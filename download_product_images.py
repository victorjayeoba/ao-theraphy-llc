"""Download all product images from products-export.json into ./product-images/."""
import json
import os
import urllib.request
import urllib.error

EXPORT = "products-export.json"
OUT_DIR = "product-images"

os.makedirs(OUT_DIR, exist_ok=True)

with open(EXPORT, encoding="utf-8") as f:
    products = json.load(f)["data"]

ok, failed, skipped = 0, 0, 0
fail_list = []

for p in products:
    url = p.get("picture")
    if not url:
        skipped += 1
        continue

    ext = os.path.splitext(url)[1] or ".png"
    safe_slug = (p.get("slug") or p.get("name") or "product").replace("/", "-")
    filename = f"{p['id']}_{safe_slug}{ext}"
    dest = os.path.join(OUT_DIR, filename)

    if os.path.exists(dest):
        ok += 1
        continue

    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as resp, open(dest, "wb") as out:
            out.write(resp.read())
        ok += 1
        print(f"[OK]  {filename}")
    except (urllib.error.URLError, urllib.error.HTTPError, OSError) as e:
        failed += 1
        fail_list.append((p["id"], url, str(e)))
        print(f"[FAIL] id={p['id']} {url} -> {e}")

print("\n--- Summary ---")
print(f"Downloaded/exists: {ok}")
print(f"Failed:            {failed}")
print(f"Skipped (no url):  {skipped}")
if fail_list:
    print("\nFailures:")
    for pid, url, err in fail_list:
        print(f"  id={pid}: {err}")
