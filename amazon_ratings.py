"""Find each product on Amazon and record its rating, into amazon-ratings.csv.

Drives a visible Chrome window so Amazon treats it like a person browsing.
If a CAPTCHA appears, solve it in the window and press Enter here.
Safe to stop (Ctrl+C) and re-run: products already in the CSV are skipped.

    pip install playwright && python -m playwright install chromium
    python amazon_ratings.py                  # all products in products-export.json
    python amazon_ratings.py --limit 5        # try a few first
    python amazon_ratings.py --selftest       # check the matching logic, no browser

Every row gets a status:
    auto  - strong title match, probably the right listing (still skim: compare the photos)
    check - found something, a human should confirm it
    none  - nothing usable found
"""
import argparse
import csv
import json
import os
import random
import re
import sys
import time
from datetime import date
from urllib.parse import quote_plus

EXPORT = "products-export.json"
OUT = "amazon-ratings.csv"
PROFILE_DIR = ".amazon-profile"  # keeps the US ZIP and cookies between runs
US_ZIP = "10001"
FIELDS = ["id", "name", "status", "match_score", "query", "amazon_title", "asin",
          "amazon_url", "rating", "review_count", "our_image", "amazon_image", "checked_at"]

STOP = {"and", "for", "with", "the", "of", "to", "in", "a", "an", "&", "or", "by", "set", "pack"}


def tokens(text: str) -> set[str]:
    return {t for t in re.findall(r"[a-z0-9]+", text.lower()) if t not in STOP and len(t) > 1}


def pick_query(name: str, description: str) -> str:
    """Many descriptions are the full Amazon listing title, which searches far better than
    our short name. Marketing-copy descriptions end in a period; titles don't."""
    first = (description or "").splitlines()[0].strip() if description else ""
    if first and not first.endswith(".") and len(first) > len(name) and len(first) <= 250:
        return first
    return name


def overlap(query: str, title: str) -> int:
    return len(tokens(query) & tokens(title))


def score(query: str, title: str) -> float:
    """Shared words over the shorter side's word count. Search pages cut long titles short,
    and some of our names are short, so neither side alone is a fair denominator."""
    shorter = min(len(tokens(query)), len(tokens(title)))
    return overlap(query, title) / shorter if shorter else 0.0


def status_for(query: str, title: str) -> str:
    # ponytail: word-overlap heuristic. Needing 4+ shared words stops generic names
    # ("Stress Ball") and brand-only titles ("Under Armour") from passing as sure matches;
    # tune the 0.8 / 4 cut-offs if too many right answers land in "check".
    s = score(query, title)
    if s >= 0.8 and overlap(query, title) >= 4:
        return "auto"
    return "check" if s >= 0.4 else "none"


def parse_rating(icon_alt: str) -> str:
    m = re.search(r"(\d(?:\.\d)?) out of 5", icon_alt or "")
    return m.group(1) if m else ""


def parse_count(aria_labels: list[str]) -> str:
    for label in aria_labels:
        m = re.fullmatch(r"([\d,]+) ratings?", label.strip())
        if m:
            return m.group(1).replace(",", "")
    return ""


# Runs inside the page. Selectors checked against amazon.com on 2026-09-18.
EXTRACT_JS = """() => [...document.querySelectorAll('div[data-component-type="s-search-result"][data-asin]')]
  .filter(el => el.dataset.asin)
  .map(el => ({
    asin: el.dataset.asin,
    // clothing splits brand and product into two h2s, so join them all
    title: [...el.querySelectorAll('h2')].map(h => h.getAttribute('aria-label') || h.innerText).join(' '),
    iconAlt: el.querySelector('.a-icon-alt')?.textContent || '',
    aria: [...el.querySelectorAll('[aria-label]')].map(n => n.getAttribute('aria-label')),
    image: el.querySelector('img.s-image')?.src || '',
  }))"""


def is_blocked(page) -> bool:
    return bool(page.query_selector('form[action*="validateCaptcha"]')) or \
        "Enter the characters you see" in page.content()


def ensure_us_location(page):
    page.goto("https://www.amazon.com/", wait_until="domcontentloaded")
    wait_if_blocked(page)
    loc = page.inner_text("#glow-ingress-line2") if page.query_selector("#glow-ingress-line2") else ""
    if US_ZIP in loc:
        return
    try:
        page.wait_for_load_state("load")
        for _ in range(3):  # the popover's JS may not be attached yet on the first click
            page.click("#nav-global-location-popover-link")
            try:
                page.wait_for_selector("#GLUXZipUpdateInput", state="visible", timeout=5_000)
                break
            except Exception:
                page.keyboard.press("Escape")
        page.fill("#GLUXZipUpdateInput", US_ZIP)
        page.click("#GLUXZipUpdate input")
        time.sleep(2)
        page.reload(wait_until="domcontentloaded")
    except Exception:
        input(f"Couldn't set the delivery ZIP automatically. In the browser, click 'Deliver to', "
              f"enter {US_ZIP}, apply it, then press Enter here...")


def wait_if_blocked(page):
    while is_blocked(page):
        input("Amazon is showing a CAPTCHA. Solve it in the browser window, then press Enter here...")
        page.wait_for_load_state("domcontentloaded")


def lookup(page, query: str) -> dict:
    page.goto(f"https://www.amazon.com/s?k={quote_plus(query)}", wait_until="domcontentloaded")
    wait_if_blocked(page)
    try:
        page.wait_for_selector('[data-component-type="s-search-results"]', timeout=15_000)
    except Exception:
        return {}
    results = [r for r in page.evaluate(EXTRACT_JS)
               if "Sponsored Ad" not in r["title"]][:5]  # ads mimic real results
    if not results:
        return {}
    # most shared words wins, so a short "Under Armour" can't beat a real full-title match
    best = max(results, key=lambda r: (overlap(query, r["title"]), score(query, r["title"])))
    return {
        "match_score": f"{score(query, best['title']):.2f}",
        "amazon_title": best["title"],
        "asin": best["asin"],
        "amazon_url": f"https://www.amazon.com/dp/{best['asin']}",
        "rating": parse_rating(best["iconAlt"]),
        "review_count": parse_count(best["aria"]),
        "amazon_image": best["image"],
    }


def done_ids() -> set[str]:
    if not os.path.exists(OUT):
        return set()
    with open(OUT, newline="", encoding="utf-8-sig") as f:
        return {row["id"] for row in csv.DictReader(f)}


def run(limit: int | None):
    from playwright.sync_api import sync_playwright

    with open(EXPORT, encoding="utf-8") as f:
        products = json.load(f)["data"]
    skip = done_ids()
    todo = [p for p in products if str(p["id"]) not in skip][:limit]
    print(f"{len(products)} products, {len(skip)} already done, {len(todo)} to look up.")
    if not todo:
        return

    new_file = not os.path.exists(OUT)
    # BOM on a new file so Excel shows symbols like (R) correctly; appending must not add another
    with sync_playwright() as pw, open(OUT, "a", newline="", encoding="utf-8-sig" if new_file else "utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS)
        if new_file:
            writer.writeheader()
        browser = pw.chromium.launch_persistent_context(PROFILE_DIR, headless=False)
        page = browser.pages[0] if browser.pages else browser.new_page()
        ensure_us_location(page)

        for i, p in enumerate(todo, 1):
            query = pick_query(p["name"], p.get("description", ""))
            found = lookup(page, query)
            row = {"id": p["id"], "name": p["name"], "query": query, "our_image": p.get("picture", ""),
                   "status": status_for(query, found["amazon_title"]) if found else "none",
                   "checked_at": date.today().isoformat(), **found}
            writer.writerow(row)
            f.flush()  # a crash or Ctrl+C never loses finished rows
            print(f"[{i}/{len(todo)}] {row['status']:5} {row.get('rating') or '-':>3}* "
                  f"{row.get('review_count') or '-':>6}  {p['name'][:60]}")
            time.sleep(random.uniform(4, 8))  # be gentle: one search every few seconds

        browser.close()
    print(f"Done. Open {OUT} and review every row that isn't 'auto'.")


def selftest():
    assert pick_query("Stress Ball", "Classic stress relief tool for anxiety.") == "Stress Ball"
    full = 'JAMBO 15.5" River Oasis Lamp, Beautiful Lamp for Living Room Office Bedroom Kitchen'
    assert pick_query("River Oasis Lamp", full) == full
    assert pick_query("Knee Wrap", "Knee Wrap for Swelling, Reusable\r\nA&O Therapy_ Health") == \
        "Knee Wrap for Swelling, Reusable"
    # Amazon shows a shortened title: still a full match
    assert score(full, 'JAMBO 15.5" River Oasis Lamp, Beautiful Lamp') == 1.0
    assert status_for(full, 'JAMBO 15.5" River Oasis Lamp, Beautiful Lamp') == "auto"
    assert status_for(full, "TOCHIC 46in Tiffany-Style Pool Table Light") == "none"
    # real cases from the first test run
    assert status_for("Under Armour Boys HeatGear Compression Sleeve", "Under Armour") == "check"
    assert status_for("Stress Ball", "Mind & Body Stress Ball for Adults, Multi-Density") == "check"
    assert status_for("CanDo Premium Foam Roller (Round)",
                      "CanDo Premium Foam Roller, Round, Blue Marble, 6 x 12 Inch") == "auto"
    knee = ("(Knee-Black-2 Pack) Extended Leg/Knee Ice Pack Wrap for Injuries Compression Gel Freeze "
            "Knees Brace for Swelling Compress Therapy for Arthritis")
    assert status_for(knee, "AiricePac Ice Pack for Knee Pain Relief, Reusable Gel Ice Wrap for "
                            "Injuries, Swelling, Knee Replacement Surgery, Cold Compress") != "auto"
    assert parse_rating("4.2 out of 5 stars") == "4.2"
    assert parse_rating("5 out of 5 stars") == "5"
    assert parse_count(["4.2 out of 5 stars, rating details", "1,284 ratings"]) == "1284"
    assert parse_count(["1 rating"]) == "1"
    assert parse_count(["no numbers here"]) == ""
    print("selftest ok")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--limit", type=int, help="only look up this many products")
    ap.add_argument("--selftest", action="store_true", help="check matching logic without a browser")
    args = ap.parse_args()
    if args.selftest:
        selftest()
        sys.exit()
    run(args.limit)
