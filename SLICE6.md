# Slice 6 — coding brief

For a coding agent. **Sell reviews.** Do not email anyone. Do not fill contact forms. Do not invent companies.

Repo: `https://github.com/ianneo97/unsolicited-demos`
Live: `https://ianneo97.github.io/unsolicited-demos/`
Owner: Ian Neo (`ianneo97`). Outreach Gmail is off-limits unless Ian says send.

Scores and sources: see [`ranked-slice6.md`](./ranked-slice6.md). Higher score = worse live site / better prospect.

Area this slice: leftover verticals slices 1–5 barely touched, whole Malaysia. Used-car dealer DMS, freight-forwarder file, guard roster, pest-control job, temple counter. Not another clinic / JMB / tadika / F&B table / Yuran treasurer board / WMS / gold / changer / maid / mosque.

---

## Already shipped — leave them alone

Do not rewrite these unless a page is actually broken:

| Folder | Product | Live |
| --- | --- | --- |
| `clinica/` | Clinic front desk + thin payroll | https://ianneo97.github.io/unsolicited-demos/clinica/ |
| `magsys/` | C / D / H HIS desks | https://ianneo97.github.io/unsolicited-demos/magsys/ |
| `teera/` | Bank inbox + Aug 2026 P&L + 7-day cash | https://ianneo97.github.io/unsolicited-demos/teera/ |
| `kumodoc/` | EMR + TPA claims | https://ianneo97.github.io/unsolicited-demos/kumodoc/ |
| `webmax/` | Workshop job card + next service | https://ianneo97.github.io/unsolicited-demos/webmax/ |
| `advelsoft/` | JMB ledger + 30/60/90 | https://ianneo97.github.io/unsolicited-demos/advelsoft/ |
| `didi/` | Pharmacy till + FEFO | https://ianneo97.github.io/unsolicited-demos/didi/ |
| `flexsoft/` | Retail till + MyInvois | https://ianneo97.github.io/unsolicited-demos/flexsoft/ |
| `mylivin/` | JMB treasurer view | https://ianneo97.github.io/unsolicited-demos/mylivin/ |
| `classflow/` | Tadika morning board | https://ianneo97.github.io/unsolicited-demos/classflow/ |
| `corematter/` | Legal matter + trust | https://ianneo97.github.io/unsolicited-demos/corematter/ |
| `flitz/` | Last-mile dispatch + POD | https://ianneo97.github.io/unsolicited-demos/flitz/ |

Copy **chrome** from `magsys/` (or `webmax/`). Do not invent a new design system.

Slice-3 P1 already specified — do not re-P0: `gprop/`, `listingmine/`, `petotumvet/`.
Slice-4 P0 already specified — do not re-P0: `edriving/`, `dclix/`, `gussmann/`, `yuran/`, `thelaundro/`.
Slice-4 P1: `pos2u/`, `ultrapark/`, `labeau/`.
Slice-5 P0 already specified — do not re-P0: `leafclover/`, `sisemas/`, `efox/`, `maid/`, `masjidpro/`.
Slice-5 P1: `ksewa/`, `skr/`, `reams/`.

---

## Pattern (data merge, not unique sites)

Vanilla HTML / CSS / JS. No build step. No React / Vue / Tailwind CLI / bundler.

Each new company is a folder at repo root:

```
<slug>/
  index.html          # copy from magsys/index.html (shared chrome)
  css/style.css       # copy from magsys/css/style.css
  js/app.js           # copy from magsys/js/app.js
  js/config.js        # THIS company only — window.SITE
  js/demo.js          # THIS company only — window.mountDemo(root)
```

`window.SITE` fields (match existing): `slug`, `name`, `oneliner`, `sells`, `worst_problem`, `city`, `original_url`, `accent`, `accentInk`, `demo_lead`, `note`.

`js/app.js` fills the chrome from `SITE` and calls `window.mountDemo(root)`. Use `window.el(tag, cls, txt)` already defined there.

Extra CSS for a dense desk: inject a `<style>` from `demo.js` (same as MAGSYS / TEERA / WebMax). Do not fork `style.css` per company.

Footer on every page: `Unsolicited demo. Built from the public site.` / `Ian Neo`.

Label sample data in the shell (`SAMPLE DATA · … · not a live …`). No fake AI accuracy, no fake customer counts, no stolen real worker/dealer/guard/ahli names from their marketing as if they were live records. Invent clearly-fake MY sample names.

---

## Build order

Ship **P0** first, in one PR or a few commits on `main` (or a branch + PR). Then P1 if time. Stop before P2 unless the brief is updated.

### P0 — build these (five distinct desks)

1. **ucd/** — used-car dealer DMS: stock in → buyer contract → hutang-tepi
2. **buttonwood/** — freight-forwarder file: job → BL → invoice
3. **vpatrol/** — guard roster: shift → checkpoint scan → payroll tick
4. **pestpro/** — pest-control job: contract → assign tech → report + invoice
5. **grasp/** — temple counter: pooja book → donation receipt → hall date

### P1 — if P0 is solid (different seat, not a twin)

6. **ejenplus/** — insurance / REN agency commission (only if a street city is confirmed; live home has no Jalan)
7. **greenflow/** — hire-purchase / loan kedai (Puchong street; adjacent to UCD — do not rebuild the VSO)
8. **libraflow/** — small-library checkout (Leisure Commerce Square, PJ)
9. **epusara/** — cemetery plot desk only if Ian wants pusara and accepts Luimewah already named e-Pusara (do **not** rebuild a Yuran fee board)
10. **strikezone/** — bowling tournament / lane book only if a street city is confirmed

### Skip unless Ian says so

- **sterling/** / **carma/** / **merp/** used-car tile — same VSO as UCD
- **efreight/** — Cheras reseller twin of Buttonwood
- **spider/** / **gopatrol/** — same guard roster as V-Patrol
- **proline/** / **shinepro/** — same pest / janitorial shop as PestPro
- **ekhairatq/** — same Yuran treasurer seat (Quantum Digital, different shop from slice-5 e-Khairat)
- **antlibrary/** — same checkout as LibraFlow; finer site
- **sevengee/** — custom-dev catalogue with an ATS tile
- slice-4 and slice-5 P0/P1 folders

---

## P0 specs

### 1. UCD Software — `ucd/`

- Live site: https://www.ucdsoftware.com.my/ (17, JLN PJS 9/11A, Bandar Sunway, 47500 — on `/contactUs.html`). Worst: About still sells Windows 98/NT/2000/XP/Vista; footer “@ Copyright of UCDSoftware Sdn Bhd 2010”; enquiry iframe leftover “正在加载…”.
- Sells: used-car dealer DMS — stock, VSO, hutang tepi / loan. GIS cover-note is the same shop — do not also build. Phones on `/contactUs.html`: Alan Wong 012-2215376, Susan Low 016-8320723. **No public email — do not invent.**
- **Desk:** one used-car yard board. 8 units (fake plate, fake make/year, fake asking MYR). Button: **Stock in** stamps a lot id + date. Button: **Buyer contract** writes a VSO chip on the row. Button: **Hutang-tepi** writes outstanding MYR + next due. Not WebMax workshop (no labour hours / next-service). Not a gold weigh. Not KSEWA rental.
- Accent: keep dark Geist; one yard amber is fine.

### 2. Buttonwood — `buttonwood/`

- Live site: https://buttonwood.com.my/ (A-31-06, 3 Two Square, 2, Jalan 19/1, Petaling Jaya, 46300). Worst: 2010s brochure still shows “Loading…”; typo “Unsure of the whereabout of the job file”; product paths 404. Contact: info@buttonwood.com.my · +603-7491 7903.
- Sells: freight-forwarder / NVOCC / shipping-agency file — job, BL, docs, invoice.
- **Desk:** one forwarder file board. 6 jobs (fake shipper, fake POL/POD, fake container). Button: **Open job** stamps a file no. Button: **Issue BL** writes a BL chip. Button: **Invoice** writes a MYR charge that actually adds. Not Gussmann haulage ROT/POD. Not Flitz last-mile. Not LeafClover 3PL WMS (no bin / FIFO).
- Accent: keep dark Geist; one freight blue is fine.

### 3. V-Patrol — `vpatrol/`

- Live site: https://vpatrolsecurity.com/ (No. 62, 2nd Floor, Jalan Radin Anum, Bandar Baru Sri Petaling, 57000 — on `/contact/`). Worst: leftover `hellothemetags@gmail.com` on `/contact/`. Contact: sales@vpatrolsecurity.com. Do not use the theme leftover.
- Sells: security-company OS — guard roster, checkpoint, EPF/SOCSO payroll.
- **Desk:** one guard board. 8 guards (fake MY names) across tonight’s shifts. Button: **Assign shift** writes post + time. Button: **Checkpoint scan** flips IN + time on a post. Button: **Payroll tick** writes hours + a fake EPF chip. Not a generic ATS. Not Jibble attendance as the whole demo.
- Accent: keep dark Geist; one roster teal is fine.

### 4. PestPro — `pestpro/`

- Live site: https://www.ews2u.com/pestpro/ (2F-22, IOI Business Park, 1, Persiaran Puchong Jaya Selatan, Puchong Jaya, 47170 — on `/contact/`). Worst: generic “Revolutionize Your Pest Control Business”; no desk UI. Contact: inquiry@ews2u.com · +6019-273 2289.
- Sells: pest-control ops — quote, contract, schedule, auto invoice.
- **Desk:** one pest job board. 6 contracts (fake premise, fake pest type: termite / denggi / rodent). Button: **Assign tech** writes a tech name + date. Button: **Close report** stamps treated + photo-ready chip (no real photo). Button: **Invoice** writes MYR that actually adds. Not REAMS facility CMMS. Not a clinic.
- Accent: keep dark Geist; one pest green is fine.

### 5. Grasp Temple — `grasp/`

- Live site: https://www.templemanagementsoftware.com/temple-management-software (No 8-3, 3rd Mile Square, 151, Jln Klang Lama, 58100). Worst: SEO temple-ERP encyclopedia; nav leftover “Batu Caves Immersive Experience Centre”. Contact: sales@graspsoftwaresolutions.com.
- Sells: temple / tokong OS — pooja ticket, donation, hall booking, kiosk. **Not** a mosque.
- **Desk:** one temple counter. 8 devotees (fake MY names). Button: **Book pooja** writes rite + time. Button: **Donation receipt** writes MYR that actually adds. Button: **Hall date** stamps a hall chip on one row. Do **not** rebuild MasjidPro Jumaat check-in. Do **not** rebuild a Yuran overdue-fee board.
- Accent: keep dark Geist; one temple gold is fine.

---

## P1 specs (short)

**ejenplus/** — https://ejenplus.com/. Worst: 0+ Agents / 0+ Submissions; `/pricing/` 404. **Desk:** 6 cases, rank split, commission MYR. Only build if a street city is confirmed.

**greenflow/** — https://www.htcc.com.my/products/ (Bandar Puteri Puchong). Worst: leftover `ali@company.com`. **Desk:** 6 HP agreements, instalment due, receipt. Do not rebuild UCD VSO.

**libraflow/** — https://libraflow.xyz/ (Leisure Commerce Square, PJ). Worst: “suit your need”; `/contact/` 404. **Desk:** 6 titles, checkout, overdue chip, receipt.

**epusara/** — https://epusara.net/. Worst: thin public search. **Desk:** search arwah → register plot → nisan job. Only if Ian wants cemetery. Do not build a Yuran fee board. Do not treat Kg Relong Lipis as company HQ unless a later page prints it as theirs.

**strikezone/** — https://strikezone.futurify.my/. Worst: React SPA; parent is an agency. **Desk:** 6 squads, lane book, QR in. Only if a street city is confirmed.

---

## Hub + README

Update root `index.html` lede and add a row per new folder (name + one-line desk). Keep the existing shipped rows.

Append a line to `README.md` per new folder, same style as the existing rows.

Leave `SLICE2.md`, `SLICE4.md`, `SLICE5.md`, `ranked-slice2.md`, `ranked-slice4.md`, `ranked-slice5.md`, `ranked-slice6.md` in the repo. Add this file next to them.

---

## Definition of done

- Each P0 folder loads as static files on GitHub Pages (`/<slug>/`).
- `mountDemo` paints a dense, clickable desk. Buttons change state. Stock/VSO/hutang, BL/invoice, checkpoint/payroll hours, pest invoice, pooja/donation totals are real in the sample data.
- Chrome matches the existing seven+ (dark Geist, sample-data badge, public-site link, honest note).
- No network calls, no analytics, no form posts, no WhatsApp / Gmail / Maps embeds that leave the page.
- `ranked-slice6.md` and this file stay in the repo.

---

## Review (Sell, not the coding agent)

Sell will open the live Pages and check: is it THEIR product, not a generic dashboard; does the one-line site problem appear in the note; do the controls work; is it mobile-usable. Push back if it looks like another clinic HIS, another JMB 30/60/90, another tadika morning, another F&B table, another Yuran treasurer board, another LeafClover WMS, another SisEmas gold counter, another EFOX changer, another maid file, or another MasjidPro Jumaat board.

Do not send outreach. Ian approves any email in chat first.
