import React, { useState } from "react";

type Section = {
    id: string;
    title: string;
    summary?: string;
    content: React.ReactNode;
};

const sections: Section[] = [
    {
        id: "intro",
        title: "Introduction",
        summary: "A short overview of this policy and scope.",
        content: (
            <>
                <p>
                    This Privacy Policy explains how Sensory Flow Connect ("we", "us", "our") collects,
                    uses, and discloses personal information when you use our website and services.
                </p>
            </>
        ),
    },
    {
        id: "data-collected",
        title: "Data We Collect",
        summary: "Types of information we collect and examples.",
        content: (
            <>
                <ul className="list-disc pl-5">
                    <li>Account information: name, email, password (hashed).</li>
                    <li>Profile data: preferences and settings.</li>
                    <li>Usage data: pages visited, features used, logs.</li>
                    <li>Device information: IP, browser, OS, device identifiers.</li>
                </ul>
            </>
        ),
    },
    {
        id: "use-of-data",
        title: "How We Use Data",
        summary: "Why we process your personal data.",
        content: (
            <>
                <p>We use data to: deliver and improve the service, personalize content, communicate with you, and protect our systems.</p>
            </>
        ),
    },
    {
        id: "sharing",
        title: "Sharing & Third Parties",
        summary: "When we disclose your information.",
        content: (
            <>
                <p>
                    We may share data with service providers, analytics partners, and where required by law.
                    We do not sell personal information.
                </p>
            </>
        ),
    },
    {
        id: "cookies",
        title: "Cookies & Tracking",
        summary: "How cookies and similar tech are used.",
        content: (
            <>
                <p>
                    We use cookies and similar technologies for session management, preferences, and analytics.
                    You can control cookie settings via your browser.
                </p>
            </>
        ),
    },
    {
        id: "security",
        title: "Security",
        summary: "Measures we take to protect data.",
        content: (
            <>
                <p>
                    We implement administrative, technical, and physical safeguards to protect your information.
                    No method of transmission is 100% secure, so we cannot guarantee absolute security.
                </p>
            </>
        ),
    },
    {
        id: "your-rights",
        title: "Your Rights",
        summary: "Access, correction, deletion, and portability.",
        content: (
            <>
                <p>
                    Depending on your jurisdiction, you may have rights to access, correct, delete, or port your personal data.
                    Contact us for requests.
                </p>
            </>
        ),
    },
    {
        id: "children",
        title: "Children",
        summary: "Policy regarding minors.",
        content: (
            <>
                <p>
                    Our services are not directed to children under 13. We do not knowingly collect personal data from children.
                </p>
            </>
        ),
    },
    {
        id: "changes",
        title: "Changes to This Policy",
        summary: "How we notify changes.",
        content: (
            <>
                <p>
                    We may update this policy. Material changes will be posted with an updated effective date.
                </p>
            </>
        ),
    },
    {
        id: "contact",
        title: "Contact",
        summary: "How to reach us with privacy questions.",
        content: (
            <>
                <p>
                    For privacy inquiries, please contact: <strong>privacy@sensoryflow.example</strong>
                </p>
            </>
        ),
    },
];

export default function PrivacyPolicy(): JSX.Element {
    const [open, setOpen] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        sections.forEach((s, i) => (initial[s.id] = i < 2));
        return initial;
    });

    function toggle(id: string) {
        setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
    }

    function handlePrint() {
        window.print();
    }

    return (

        <main className="max-w-4xl mx-auto my-8 p-6 font-sans text-slate-900">
            <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">Privacy Policy</h1>
                    <div className="text-sm text-slate-500 mt-1">Effective date: November 28, 2025</div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrint}
                        aria-label="Print privacy policy"
                        className="inline-flex items-center px-3 py-2 text-sm rounded-md border border-slate-200 bg-white hover:bg-slate-50"
                    >
                        Print / Save as PDF
                    </button>
                </div>
            </header>

            <section className="mb-6 p-4 rounded-lg bg-sky-50 border border-sky-100" aria-labelledby="toc-heading">
                <h2 id="toc-heading" className="text-sm font-medium mb-2">Contents</h2>
                <nav aria-label="Table of contents">
                    <ul className="space-y-2">
                        {sections.map((s) => (
                            <li key={s.id}>
                                <a
                                    href={`#${s.id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                                        setOpen((prev) => ({ ...prev, [s.id]: true }));
                                    }}
                                    className="text-sky-700 hover:underline text-sm font-medium"
                                >
                                    {s.title}
                                </a>
                                {s.summary && <div className="text-xs text-slate-500">{s.summary}</div>}
                            </li>
                        ))}
                    </ul>
                </nav>
            </section>

            <article className="space-y-4">
                {sections.map((s) => (
                    <section
                        id={s.id}
                        key={s.id}
                        aria-labelledby={`${s.id}-heading`}
                        className="bg-white border border-slate-100 rounded-lg p-4 shadow-sm"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 id={`${s.id}-heading`} className="text-lg font-medium mb-1">
                                    {s.title}
                                </h3>
                                {s.summary && <div className="text-sm text-slate-500">{s.summary}</div>}
                            </div>

                            <div>
                                <button
                                    onClick={() => toggle(s.id)}
                                    aria-expanded={!!open[s.id]}
                                    aria-controls={`${s.id}-content`}
                                    className="text-sm px-3 py-1 border rounded-md bg-white hover:bg-slate-50"
                                >
                                    {open[s.id] ? "Collapse" : "Expand"}
                                </button>
                            </div>
                        </div>

                        <div
                            id={`${s.id}-content`}
                            role="region"
                            aria-hidden={!open[s.id]}
                            className={`mt-3 text-sm text-slate-800 ${open[s.id] ? "block" : "hidden"}`}
                        >
                            {s.content}
                        </div>
                    </section>
                ))}
            </article>

            <footer className="mt-6 text-sm text-slate-500">
                <div>Last updated: November 28, 2025</div>
                <div className="mt-2">For questions about this policy, email <strong>privacy@sensoryflow.example</strong></div>
            </footer>
        </main>
        
    );
}