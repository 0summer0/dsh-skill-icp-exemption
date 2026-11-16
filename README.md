# dsh-skill-icp-exemption

A DeepSeek Harness (DSH) skill bundle that drafts and generates the bilingual Apple App Store China ICP filing exemption declaration (`ICP 备案豁免申请声明` / `ICP Filing Exemption Declaration`) for one standalone iOS app. It contributes the `icp-exemption` skill and bundles the Python PDF generator it drives.

## What it does

- Collects the app's verified facts: Team ID, account holder legal name (Chinese and English), App Store display name, numeric App ID, Bundle ID, date, and purpose/networking statements.
- Generates a one-page A4 bilingual PDF letter through the bundled `generate.py`, which lays out HTML/CSS and prints it with local Chrome or Chromium.
- Supports unsigned output, optional `--prepare-signature` image preprocessing (transparent PNG, background removal, whitespace crop), and signed output when the account holder authorizes it.
- Guides the Apple Developer Support request, secure upload, and follow-up reply, including the legal acknowledgement and privacy rules.

It does not submit the request to Apple, does not upload documents, and is not legal advice. Creating or copying the PDF does not upload it.

## Install

After this bundle is published:

- DSH Web/Desktop: **Plugins → Discover**, add the market index URL, install **ICP exemption declaration**.
- CLI: `dsh plugin --profile <profile> add dsh-skill-icp-exemption`.
- Local package: install this directory or its packed tarball through Plugin Manager.

Enabling the bundle adds one plugin row. The `icp-exemption` skill appears in the session skill catalog; ask the agent to draft or generate the declaration for one app.

## Requirements

- Python 3.9 or newer. `generate.py` uses only the standard library.
- Google Chrome or Chromium. Discovery order: `CHROME_PATH`/`DSH_CHROME_PATH`, `google-chrome`/`google-chrome-stable`/`chromium`/`chromium-browser` on `PATH`, then the usual macOS and Windows install locations.
- Noto Sans CJK SC is recommended for exact Chinese rendering; a missing font falls back to the system sans-serif.
- Optional: Pillow for `--prepare-signature`, `pdftoppm` (Poppler) for PNG previews.

## Package layout

| Path | Purpose |
|---|---|
| `index.js` | Registers the `icp-exemption` skill from its packaged `SKILL.md` at activation. |
| `cordis.patch.yml` | Bundle patch: one insert row for `@deepseek-ai/dsh-skill-icp-exemption`. |
| `skills/icp-exemption/SKILL.md` | Skill instructions (DSH kebab-case name: `icp-exemption`). |
| `skills/icp-exemption/generate.py` | A4 bilingual PDF generator (stdlib + local Chrome). |
| `locale/{en,zh}.json` | Plugin display title, description, and detail document paths. |
| `docs/` | Detail document and its feature image. |
| `icon.svg` | Plugin row icon. |

## Privacy

The package contains placeholders only: no real names, Team IDs, App IDs, case IDs, bundle IDs, contact details, or signatures. Fact values are passed at run time and must stay outside this package. Apply a signature only when the account holder explicitly asks to sign the letter concerned; a saved signature image never authorizes signing unrequested or future documents.

## Development

```sh
npm pack --dry-run                      # inspect the published file list
test/verify.sh                          # run the DSH-side and generator checks
```

`test/verify.sh` expects a DSH agent shell (`DSH_NODE_EXECUTABLE`, `DSH_INSTALL_DIR`) and uses placeholder data only.

## License

MIT
