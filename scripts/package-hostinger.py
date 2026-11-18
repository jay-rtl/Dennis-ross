#!/usr/bin/env python3
"""Create a static export ZIP for the Hostinger public_html directory.

Build for the production domain so Next.js paths are compiled for the site root.
"""
from pathlib import Path
from subprocess import run
from zipfile import ZipFile, ZIP_DEFLATED
import re

SOURCE = Path(".pages-build/hostinger/out")
DEST = Path(".pages-build/app/out/downloads/dennisross-hostinger-ready.zip")
BASE = b"/Dennis-ross"

# Small, dependency-free enhancement for the Hostinger static export.
# If Next's JavaScript fails to load, the user can still switch editions and
# purchase the correctly selected binding. React retains control when available.
EDITION_FALLBACK = r"""<script id="dr-edition-fallback">
(function () {
  var products = {
    paperback: "https://shop.ingramspark.com/b/084?params=K0KvmdqJ6kXnRo54B4cKyj2RPFYoUiwOecMtQc2DnPw",
    hardback: "https://shop.ingramspark.com/b/084?params=CkLqhZYbbL3KAtgQQT5TWk68VQvAWXhZvouFSuWlr8R"
  };
  document.addEventListener("click", function (event) {
    var button = event.target.closest(".dr-store-editions button");
    if (!button) return;
    var label = button.querySelector("strong");
    var edition = label && label.textContent.trim().toLowerCase();
    if (!Object.prototype.hasOwnProperty.call(products, edition)) return;
    setTimeout(function () {
      /* Hydrated React has already updated aria-pressed if it is running. */
      if (button.getAttribute("aria-pressed") === "true") return;
      document.querySelectorAll(".dr-store-editions button").forEach(function (item) {
        var chosen = item === button;
        item.classList.toggle("is-selected", chosen);
        item.setAttribute("aria-pressed", chosen ? "true" : "false");
        var icon = item.querySelector("svg");
        if (icon) icon.style.display = chosen ? "" : "none";
      });
      var buy = document.querySelector(".dr-store-actions .dr-store-primary");
      if (!buy) return;
      if (buy.tagName !== "A") {
        var anchor = document.createElement("a");
        anchor.className = buy.className;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        buy.replaceWith(anchor);
        buy = anchor;
      }
      buy.href = products[edition];
      buy.textContent = "Buy " + (edition === "hardback" ? "Hardback" : "Paperback") + " on IngramSpark ↗";
    }, 80);
  });
})();
</script>"""

def main():
    run(["node", "scripts/build-pages.mjs", "--hostinger"], check=True)
    if not (SOURCE / "index.html").is_file() or not (SOURCE / "_next").is_dir():
        raise SystemExit("Missing exported homepage or _next assets; ZIP not created.")
    needed = [
        "reviews/index.html",
        "books/the-lethal-elixir/index.html",
        "media/the-lethal-elixir-trailer.mp4",
        "sample/the-lethal-elixir/index.html",
        "sample/the-lethal-elixir/the-lethal-elixir-sample.pdf",
    ]
    for name in needed:
        if not (SOURCE / name).is_file():
            raise SystemExit("Expected file missing: " + name)

    DEST.parent.mkdir(parents=True, exist_ok=True)
    count = 0
    bytes_written = 0
    with ZipFile(DEST, "w", ZIP_DEFLATED, compresslevel=6) as archive:
        for item in sorted(SOURCE.rglob("*")):
            if not item.is_file():
                continue
            rel = item.relative_to(SOURCE).as_posix()
            content = item.read_bytes()
            if rel == "books/the-lethal-elixir/index.html":
                content = content.replace(b"</body>", EDITION_FALLBACK.encode("utf-8") + b"</body>")
            if rel in {"index.html", "books/the-lethal-elixir/index.html",
                       "reviews/index.html"} and BASE in content:
                raise SystemExit("Unexpected GitHub Pages path in " + rel)
            archive.writestr(rel, content)
            count += 1
            bytes_written += len(content)
    with ZipFile(DEST) as check:
        names = set(check.namelist())
        if not all(n in names for n in needed + ["index.html"]):
            raise SystemExit("ZIP validation failed: required files missing.")
        book = check.read("books/the-lethal-elixir/index.html")
        homepage = check.read("index.html")
        for page, source in (
            (homepage, b"media/the-lethal-elixir-trailer.mp4"),
            (book, b"../../media/the-lethal-elixir-trailer.mp4"),
        ):
            assert re.search(rb'<video\b[^>]*\bcontrols(?:=""|\s|>)', page)
            assert b'src="' + source + b'"' in page
            assert b'trailer-coming-soon' not in page
        assert b'id="dr-edition-fallback"' in book
        assert b'/brand/logo.webp' in homepage
    print(f"Hostinger ZIP created: {DEST} ({count} files, {bytes_written:,} uncompressed bytes)")
    print("Upload ZIP to domain public_html and extract there (index.html at root).")

if __name__ == "__main__":
    main()
