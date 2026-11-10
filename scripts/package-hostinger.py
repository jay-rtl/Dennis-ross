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
    print(f"Hostinger ZIP created: {DEST} ({count} files, {bytes_written:,} uncompressed bytes)")
    print("Upload ZIP to domain public_html and extract there (index.html at root).")

if __name__ == "__main__":
    main()
