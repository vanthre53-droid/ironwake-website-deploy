# P0 Source Inventory

- Audited: 2026-07-26T08:57:57Z
- Scope: controller inputs, source archives, source-control location, and candidate portfolio workspace
- Status: partial; controller root initialized, initial commit approval pending

## Controller Inputs

| Path | SHA-256 | Status |
|---|---|---|
| `AGENTS.md` | `dfe9d29c29f6ec46b52e77dfe12964209e71e9f14c445aa81a0525b439508b81` | Read |
| `MASTER_OPENCODE_EXECUTION_PROMPT.md` | `4956085d76c1ecc6c5886a43ddb49c458fb9337c48145f0cfe3ee670143524ab` | Read |
| `ironwake.execution.yaml` | `59b9cb7891b05a66787a064f66272e72b9f76a1ffd2a4b7115ff73156b3f9aad` | Read |
| `inputs/APPROVALS.md` | `ef68dc5a96f6fe49633f1595ad960386839d578acb617faa3b79d0e011e3d871` | All gates pending |
| `inputs/REAL_DATA_INTAKE.md` | `c37650d765d2a45e458286acc4b14cb539f1157f9640e773bc8a34e160fed353` | Identity, contact, pricing, providers, and proof unresolved |
| `inputs/SOCIAL_SETUP_REAL_DATA.md` | `bd643b5b742bc457390c65b2f7832dd43792f9060b4b7779c4872de7c19971f9` | Instagram reported but unverified; all other live state unknown |
| `state/PROJECT_STATE.yaml` | `df07d8f5be26f7b49a1ca48bc60a33f69c4fe74d75a9e7267273fa879db0b4ef` | Superseded by this checkpoint |
| `state/CLI_HANDOFF.md` | `b1e8d80e2c905073bae79bf836bf18983cc65ee911c194513ae423519e968cbc` | Superseded by this checkpoint |

## Archives

| Path | SHA-256 | Observed contents | Classification |
|---|---|---|---|
| `stitch_ironwake_stitch_prompt_pack_v4 (2).zip` | `0b4b617524385637fca115965d596eac7dac56a29a578b155a3a09cea1dbd16d` | 30 `code.html`, 30 `screen.png`, and one `DESIGN.md` according to central-directory listing | Visual prototype input; unextracted |
| `ironwakeportifolioprojects/AGENCY_V2_2_UPGRADE_PACK.zip` | `a72d53fbe83706fc766314c17e995b9903329bb2724fa081dfa345d33a37ce14` | Agency/voice/WhatsApp runbooks and seven legacy skill shims | Historical runbook input; not executed |
| `ironwakeportifolioprojects/ironwake-skills.tar.gz` | `bcb1b3a16ae78f861adb65f25235cdcf99b4d208552ccfacea7f5dbed9623b19` | Large mixed skill archive | Discovery-only; not executed |
| `ironwakeportifolioprojects/rapidpulse-plumbing.zip` | `04e0651016ab3ffc4f594f33b8122613aa85f5188228f3592c6c44d15de3d26a` | Candidate P1 source snapshot | Not proof of live operation |
| `ironwakeportifolioprojects/manchester-gentle-dental.zip` | `47058728aa71d9b9f0570bd59abb09c414a060df305d98fb03fed20162725e7f` | Candidate P3 source snapshot | Not proof of live operation |
| `ironwakeportifolioprojects/atelier-luxury-salon.zip` | `3352858f9205c80c9c41f744fc9e69f079f11e7d2808910877fbe662108d7afd` | Candidate P10 source snapshot | Not proof of live operation |
| `ironwakeportifolioprojects/bristol-architectural.zip` | `9eb3c10ccd160254bea3cc6a5abee39345698acc130d5e13fb4d6c5486b40d77` | Candidate P2 source snapshot | Not proof of live operation |
| `ironwakeportifolioprojects/bramble---smooth-edition.zip` | `6df8ecf2136f12b2bad3ed91852503ed6c41d80204329812944566197627c127` | Candidate P7 source snapshot | Not proof of live operation |
| `ironwakeportifolioprojects/bluestone-jewellery-prototype.zip` | `630edfb6764e74c545d52026efe27c0603c1985d04a8ffdb5ed891b135fe2b54` | Candidate P4 source snapshot | Not proof of live operation |
| `ironwakeportifolioprojects/luxe-studio.zip` | `a78ff7e8f42323271a02864508b35235fd346dfa738bdeb6109efa89308a9c6d` | Candidate P6 source snapshot | Not proof of live operation |
| `ironwakeportifolioprojects/re-tech.zip` | `d275381176ccdd2f02f080b858beb084de02aabe13506a107b15b7ff78c89df4` | Candidate P9 source snapshot | Not proof of live operation |
| `ironwakeportifolioprojects/voltix.zip` | `ea094534d222875fc65743872d71c1803d24eacf99fa3a072dedac2ef48e9b0b` | Candidate P8 source snapshot | Not proof of live operation |

## Source-Control Readback

| Location | Readback | Result |
|---|---|---|
| Controller root | `git init`, then `git status --short --branch` | Empty Git repository on `master`; no commit yet |
| `ironwakeportifolioprojects/` | Branch `master`, `HEAD` `f511259` | Dirty; unsuitable as a reproducible baseline |

The Stitch audit script was reviewed but not run: it accepts only an unzipped export, and extraction would not resolve the source-root ambiguity. No archive contents were modified.
