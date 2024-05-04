import plistlib

plist_file = "dist/main.app/Contents/Info.plist"

with open(plist_file, "rb") as f:
    plist_data = plistlib.load(f)

plist_data["CFBundleExecutable"] = "wrapper"

with open(plist_file, "wb") as f:
    plistlib.dump(plist_data, f)
