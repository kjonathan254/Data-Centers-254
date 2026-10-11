#!/usr/bin/env python3
"""Render a Rack Report print HTML to PDF (A4) via Playwright.

Usage:
    python3 scripts/build_rack_report_pdf.py <input.html> <output.pdf> [--compress]

The print HTML is built from docs/newsletter/templates/rack-report-print-template.html
(see its header for the fill-in workflow). --compress runs a ghostscript /ebook
pass, the Issue 003 lineage trick that took a 4.5 MB render down to ~0.4 MB.
Output goes to public/reports/ for the archive; the HTML itself is never committed.
"""
import subprocess
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright


def main() -> None:
    if len(sys.argv) < 3:
        sys.exit("usage: build_rack_report_pdf.py <input.html> <output.pdf> [--compress]")
    src = Path(sys.argv[1]).resolve()
    out = Path(sys.argv[2]).resolve()
    compress = "--compress" in sys.argv[3:]

    if not src.exists():
        sys.exit(f"input html not found: {src}")
    out.parent.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 900, "height": 1300})
        page.goto(f"file://{src}")
        page.wait_for_timeout(600)
        page.pdf(
            path=str(out),
            format="A4",
            print_background=True,
            margin={"top": "0", "bottom": "0", "left": "0", "right": "0"},
        )
        browser.close()

    if compress:
        tmp = out.with_suffix(".tmp.pdf")
        subprocess.run(
            [
                "gs", "-sDEVICE=pdfwrite", "-dCompatibilityLevel=1.4",
                "-dPDFSETTINGS=/ebook", "-dNOPAUSE", "-dQUIET", "-dBATCH",
                f"-sOutputFile={tmp}", str(out),
            ],
            check=True,
        )
        tmp.replace(out)

    size = out.stat().st_size
    print(f"WROTE {out} ({size} bytes, {size // 1024} KB)")


if __name__ == "__main__":
    main()
