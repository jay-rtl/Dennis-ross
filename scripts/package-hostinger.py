#!/usr/bin/env python3
"""Create an extract-directly-to-public_html ZIP from the verified GitHub Pages export.

No credentials, remote access, or external dependencies required.
The source export is left unchanged; only ZIP entries are rewritten.
"""
from pathlib import Path
from io import BytesIO
from zipfile import ZipFile, ZIP_DEFLATED
import re

SOURCE = Path(".pages-build/app/out")
DEST = SOURCE / "downloads" / "dennisross-hostinger-ready.zip"
TEXT_EXTS = {".html", ".htm", ".css", ".js", ".json", ".txt", ".xml",
             ".svg", ".webmanifest", ".map", ".rsc"}
OLD_URL = b"https://jay-rtl.github.io/Dennis-ross"
NEW_URL = b"https://dennisrosspublications.com"
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
            if not item.is_file() or item == DEST:
                continue
            rel = item.relative_to(SOURCE).as_posix()
            content = item.read_bytes()
            if item.suffix.lower() in TEXT_EXTS:
                content = content.replace(OLD_URL, NEW_URL)
                content = content.replace(BASE, b"")
                # The video on nested book paths must resolve from the custom-domain root.
                content = content.replace(
                    b'../../media/the-lethal-elixir-trailer.mp4',
                    b'/media/the-lethal-elixir-trailer.mp4')
                # The homepage source should use the same root-relative media link.
                content = content.replace(
                    b'src="media/the-lethal-elixir-trailer.mp4"',
                    b'src="/media/the-lethal-elixir-trailer.mp4"')
                if rel == "books/the-lethal-elixir/index.html":
                    content = content.replace(b"</body>", EDITION_FALLBACK.encode("utf-8") + b"</body>")
                    if b'id="dr-edition-fallback"' not in content:
                        raise SystemExit("Missing static edition-selection fallback")
                if rel in {"index.html", "books/the-lethal-elixir/index.html",
                           "reviews/index.html"} and (BASE in content or OLD_URL in content):
                    raise SystemExit("Unconverted path in " + rel)
            archive.writestr(rel, content)
            count += 1
            bytes_written += len(content)
    with ZipFile(DEST) as check:
        names = set(check.namelist())
        if not all(n in names for n in needed + ["index.html"]):
            raise SystemExit("ZIP validation failed: required files missing.")
        book = check.read("books/the-lethal-elixir/index.html")
        assert b'/media/the-lethal-elixir-trailer.mp4' in book
        assert b'id="dr-edition-fallback"' in book
        homepage = check.read("index.html")
        assert b'/brand/logo.webp' in homepage
    print(f"Hostinger ZIP created: {DEST} ({count} files, {bytes_written:,} uncompressed bytes)")
    print("Upload ZIP to domain public_html and extract there (index.html at root).")

if __name__ == "__main__":
    main()
