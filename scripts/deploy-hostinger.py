#!/usr/bin/env python3
"""Deploy the Hostinger ZIP packaged by the Dennis Ross publishing workflow.

Run from the authorized Hostinger SSH account. Requires only Python 3.6+
and git, already confirmed installed. This script never asks for credentials.
"""
import datetime
import pathlib
import shutil
import subprocess
import sys
import tempfile
import zipfile

HOME = pathlib.Path.home()
ROOT = HOME / "domains" / "dennisrosspublications.com"
SOURCE = ROOT / "dennis-deploy"
TARGET = ROOT / "public_html"
STAGE = ROOT / ".dennis-release-stage"
NEW_ORIGIN = "https://dennisrosspublications.com"
PACKAGE_PATH = "downloads/dennisross-hostinger-ready.zip"
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
    print("{} Fetching the packaged Hostinger release...".format(PREFIX))
    run(["git", "-C", str(SOURCE), "fetch", "--depth=1", "origin", "gh-pages"])
    with tempfile.TemporaryFile() as package:
        subprocess.check_call(
            ["git", "-C", str(SOURCE), "show", "FETCH_HEAD:" + PACKAGE_PATH],
            stdout=package,
        )
        package.seek(0)
        with zipfile.ZipFile(package) as archive:
            names = archive.namelist()
            for name in names:
                path = pathlib.PurePosixPath(name)
                if path.is_absolute() or ".." in path.parts or "\\" in name:
                    fail("Unexpected path in Hostinger package.")
            if "index.html" not in names or not any(name.startswith("_next/") for name in names):
                fail("The Hostinger package has no index.html or Next.js assets.")
            index = archive.read("index.html")
            if b"/Dennis-ross" in index or NEW_ORIGIN.encode("utf-8") not in index:
                fail("The package does not target the production domain.")
            STAGE.mkdir()
            try:
                archive.extractall(str(STAGE))
            except Exception:
                shutil.rmtree(str(STAGE))
                raise
    # Preserve the original site's files (including default.php) in a backup.
    timestamp = datetime.datetime.utcnow().strftime("%Y%m%d-%H%M%S")
    backup = ROOT / ("public_html.backup-" + timestamp)
    if backup.exists():
        fail("Backup path already exists; no changes made.")
    print("{} Backing up old web root...".format(PREFIX))
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
