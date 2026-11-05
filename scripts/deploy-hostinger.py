#!/usr/bin/env python3
"""Deploy the already-built Dennis Ross GitHub Pages export on Hostinger.

Run from the authorized Hostinger SSH account. Requires only Python 3.6+
and git, already confirmed installed. This script never asks for credentials.
"""
import datetime
import os
import pathlib
import shutil
import subprocess
import sys

HOME = pathlib.Path.home()
ROOT = HOME / "domains" / "dennisrosspublications.com"
SOURCE = ROOT / "dennis-deploy"
TARGET = ROOT / "public_html"
STAGE = ROOT / ".dennis-release-stage"
OLD_ORIGIN = "https://jay-rtl.github.io/Dennis-ross"
NEW_ORIGIN = "https://dennisrosspublications.com"
BASE_PATH = "/Dennis-ross"
TEXT_SUFFIXES = (".html", ".htm", ".js", ".css", ".json", ".txt",
                 ".xml", ".svg", ".webmanifest", ".map", ".rsc")
PREFIX = "[Dennis Ross deploy]"

def fail(message):
    sys.exit("{} ERROR: {}".format(PREFIX, message))

def run(args):
    subprocess.check_call(args)

def main():
    if not ROOT.is_dir() or not SOURCE.is_dir():
        fail("Expected Hostinger domain or dennis-deploy folder is missing.")
    if not (SOURCE / ".git").is_dir():
        fail("Existing dennis-deploy folder is not a Git checkout.")
    if not TARGET.is_dir():
        fail("The site's public_html directory is missing.")
    if STAGE.exists():
        fail("A prior staging folder exists: {}".format(STAGE))
    # Restrict operation to the known, already-cloned published export.
    print("{} Updating published GitHub Pages files...".format(PREFIX))
    run(["git", "-C", str(SOURCE), "fetch", "--depth=1", "origin", "gh-pages"])
    run(["git", "-C", str(SOURCE), "reset", "--hard", "FETCH_HEAD"])
    if not (SOURCE / "index.html").is_file() or not (SOURCE / "_next").is_dir():
        fail("The downloaded export has no index.html or _next assets.")
    shutil.copytree(str(SOURCE), str(STAGE),
                    ignore=shutil.ignore_patterns(".git"))
    rewritten = 0
    for folder, _, filenames in os.walk(str(STAGE)):
        for filename in filenames:
            file_path = pathlib.Path(folder) / filename
            if file_path.suffix.lower() not in TEXT_SUFFIXES:
                continue
            original = file_path.read_bytes()
            changed = original.replace(
                OLD_ORIGIN.encode("utf-8"), NEW_ORIGIN.encode("utf-8")
            ).replace(BASE_PATH.encode("utf-8"), b"")
            if changed != original:
                file_path.write_bytes(changed)
                rewritten += 1
    index = (STAGE / "index.html").read_text(encoding="utf-8")
    if BASE_PATH in index or OLD_ORIGIN in index:
        fail("Base-path conversion check failed; public_html was not changed.")
    if not (STAGE / "_next").is_dir():
        fail("Next.js assets missing in deployment stage.")
    # Preserve the original site's files (including default.php) in a backup.
    timestamp = datetime.datetime.utcnow().strftime("%Y%m%d-%H%M%S")
    backup = ROOT / ("public_html.backup-" + timestamp)
    if backup.exists():
        fail("Backup path already exists; no changes made.")
    print("{} Converted {} text assets. Backing up old web root...".format(PREFIX, rewritten))
    TARGET.rename(backup)
    try:
        STAGE.rename(TARGET)
    except Exception:
        backup.rename(TARGET)
        raise
    print("{} SUCCESS. Site: {}".format(PREFIX, NEW_ORIGIN))
    print("{} Previous site safely backed up: {}".format(PREFIX, backup))
    print("{} The host and CDN may need a cache refresh.".format(PREFIX))

if __name__ == "__main__":
    main()
