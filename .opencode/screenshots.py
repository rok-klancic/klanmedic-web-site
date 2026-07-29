from playwright.sync_api import sync_playwright
from pathlib import Path
import os
import tempfile

HTML_PATH = Path(__file__).parent.parent.absolute() / "index.html"
FILE_URL = HTML_PATH.as_uri()

# Use a dedicated temp dir for screenshots so we can clean them up
TEMP_DIR = Path(tempfile.gettempdir()) / "klanmedic-screenshots"
TEMP_DIR.mkdir(parents=True, exist_ok=True)

WIDTHS = [375, 768, 1440]
STATES = [
    ("start", 0.0),   # text mask at initial size, image behind
    ("mid", 0.4),     # text grown ~5x, still visible
    ("end", 1.0),     # text faded out, hero overlay visible
]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for width in WIDTHS:
        page = browser.new_page(viewport={"width": width, "height": 800})
        page.goto(FILE_URL)
        page.wait_for_load_state("networkidle")
        # Wait for Alpine to initialize and the first hero animation to settle
        page.wait_for_function("window.Alpine && document.querySelector('#intro-2')")
        page.wait_for_timeout(800)

        for state_name, progress in STATES:
            page.evaluate(
                f"""
                (() => {{
                    const section = document.querySelector('#intro-2');
                    if (!section) return;
                    const start = section.offsetTop;
                    const end = start + section.offsetHeight - window.innerHeight;
                    const scrollPos = start + (end - start) * {progress};
                    window.scrollTo(0, scrollPos);
                }})();
                """
            )
            page.wait_for_timeout(600)  # let the rAF + style apply

            out = TEMP_DIR / f"intro2_{width}_{state_name}.png"
            page.screenshot(path=str(out), full_page=False)
            print(f"saved {out}")

        page.close()
    browser.close()

print("done")
