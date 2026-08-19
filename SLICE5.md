# Slice 5 — coding brief

For a coding agent. **Sell reviews.** Do not email anyone. Do not fill contact forms. Do not invent companies.

Repo: `https://github.com/ianneo97/unsolicited-demos`
Live: `https://ianneo97.github.io/unsolicited-demos/`
Owner: Ian Neo (`ianneo97`). Outreach Gmail is off-limits unless Ian says send.

Scores and sources: see [`ranked-slice5.md`](./ranked-slice5.md). Higher score = worse live site / better prospect.

Area this slice: leftover verticals (3PL WMS, kedai emas, money changer, maid agency, mosque). Not another clinic / JMB / tadika / F&B table / Yuran treasurer board.

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

Label sample data in the shell (`SAMPLE DATA · … · not a live …`). No fake AI accuracy, no fake customer counts, no stolen real worker/maid/ahli names from their marketing as if they were live records. Invent clearly-fake MY sample names.

---

## Build order

Ship **P0** first, in one PR or a few commits on `main` (or a branch + PR). Then P1 if time. Stop before P2 unless the brief is updated.

### P0 — build these (five distinct desks)

1. **leafclover/** — 3PL WMS inbound + FIFO pick
2. **sisemas/** — kedai emas weigh + trade-in
3. **efox/** — money-changer till + AML tick
4. **maid/** — maid-agency file + permit expiry
5. **masjidpro/** — mosque kariah + Jumaat check-in + infaq

### P1 — if P0 is solid (different seat, not a twin)

6. **ksewa/** — car-rental IC + blacklist + handover (only if a street city is confirmed; marketing page has no Jalan)
7. **skr/** — phone-repair ticket (only if a street city is confirmed; `/contact/` is WP default)
8. **reams/** — facility CMMS job card (Johor Bahru Ekoflora)

### Skip unless Ian says so

- **igold/** — same gold desk as SisEmas
- **ekhairat/** — same treasurer-yuran desk as Yuran.my
- **softinnovation/** — same MSB desk as EFOX
- **3warranty/** — same repair ticket as SKR
- **tagy/** — car wash; Pitstop already covers automotive POS
- **luimewah/** — full LIS is not a weekend mock; e-Pusara only if Ian wants cemetery
- **ternak/** — thin poultry page
- **zeoniq/** — same F&B table as POS2U
- **ebteq/** / **ibeauty/** — salon twins of Tunai / LABÉAU
- **spe/** — fine gold site
- slice-4 P0/P1 folders

---

## P0 specs

### 1. LeafClover — `leafclover/`

- Live site: https://leafclovertechnology.com/ (Stellar Suites, Bandar Puteri Puchong). Worst: Colorlib `lang="zxx"`; Latin lorem about; “John Doe ceo of Classic”; “This template is made with by Colorlib”.
- Sells: 3PL / warehouse WMS, FIFO, billable charges. Contact: sales@leafclovertechnology.com.
- **Desk:** one warehouse board. 8 pallets / cartons (fake SKUs, fake inbound from Port Klang). Locations A-01…B-04. Button: **Putaway** writes a bin. Button: **FIFO pick** takes the oldest lot. Running **billable charge** MYR that actually adds (storage + pick). Not Gussmann ROT/POD. Not Flitz last-mile.
- Accent: keep dark Geist; one warehouse amber is fine.

### 2. SisEmas — `sisemas/`

- Live site: https://www.sisemas.com/ (Lembah Sireh, Kota Bharu). Worst: 0+ counters; “Kami mempunya”; leftover tokenomics HTML.
- Sells: kedai emas POS, gram stock, trade-in / buy-back, e-invoice. Contact: hi@sisemas.com.
- **Desk:** one gold counter. 6 items with **weight (g)** + **mutu** + live MYR/g. Button: **Weigh / tag** stamps a tag id. Button: **Trade-in** writes buy-back MYR on the row. Button: **Issue e-invoice** writes a MYR sale. Not a generic retail till (Flexsoft). Not pawn unless the row is marked pajak — keep it jewellery POS.
- Accent: keep dark Geist; one gold is fine.

### 3. EFOX — `efox/`

- Live site: https://efox.com.my/ (Berjaya Times Square, Jalan Imbi). Worst: 2010s theme; wholesale “Coming soon”; two different HQ phones.
- Sells: retail MSB / currency exchange + AML/CFT + rate board. Contact: joiann@efox.com.my.
- **Desk:** one changer till. 6 tickets (fake MY names, fake passport/IC). Pair USD / SGD / THB with a **rate** you can edit. Button: **AML check** flips a watchlist chip (one row hits). Button: **Print receipt** writes MYR + foreign amount. Not a bank inbox (TEERA). Not Yuran.
- Accent: keep dark Geist; one changer green is fine.

### 4. MICES Maid — `maid/`

- Live site: https://www.maidsystem.com.my/ (Empire Subang). Worst: “to suite”; Internet Explorer still listed; phone “03- 5 8888 321”; ©2023.
- Sells: maid-agency file — employer, maid, contract, permit expiry, runaway / send-back lists.
- **Desk:** one agency file board. 6 files (fake employer + fake maid first names, fake source country). Chips: permit due / incomplete docs / runaway. Button: **Mark docs complete**. Button: **Permit reminder** (fake “queued”, do not open wa.me). One **runaway** row that can flip to “office”. Not a generic ATS. Not ClassFlow.
- Accent: keep dark Geist; one file teal is fine.

### 5. MasjidPro — `masjidpro/`

- Live site: https://web.masjidpro.my/ (Taman Alam Budiman, Shah Alam). Worst: Mobirise leftover alt text; title “Home”; ©2022.
- Sells: masjid/surau OS — kariah, khairat, infaq, Jumaat attendance, takwim, bantuan. Phone 010-3314117.
- **Desk:** one mosque counter. 8 kariah (fake MY names). Button: **Jumaat check-in** flips IN + time. Running **infaq** MYR that actually adds. Button: **Record infaq**. Do **not** rebuild a Yuran overdue-fee board (that is e-Khairat / Yuran.my). Khairat is one chip, not the whole demo.
- Accent: keep dark Geist; one mosque green is fine.

---

## P1 specs (short)

**ksewa/** — https://ksewa.com/. Worst: AdSense + empty Play badge. **Desk:** 6 cars, IC book, one blacklist hit, handover sign checkbox. Only build if a street city is confirmed.

**skr/** — https://softwarekedairepair.com/. Worst: `/contact/` is default WP + “Hello world!”. **Desk:** 6 repair tickets, status flip, WhatsApp ready, MYR. Only build if a street city is confirmed.

**reams/** — https://cmms.reamstech.com/ (Ekoflora, JB). **Desk:** 6 assets, raise job, close + invoice.

---

## Hub + README

Update root `index.html` lede and add a row per new folder (name + one-line desk). Keep the existing shipped rows.

Append a line to `README.md` per new folder, same style as the existing rows.

Leave `SLICE2.md`, `SLICE4.md`, `ranked-slice2.md`, `ranked-slice4.md`, `ranked-slice5.md` in the repo. Add this file next to them.

---

## Definition of done

- Each P0 folder loads as static files on GitHub Pages (`/<slug>/`).
- `mountDemo` paints a dense, clickable desk. Buttons change state. FIFO age / gold MYR / AML chip / permit due / infaq totals are real in the sample data.
- Chrome matches the existing seven+ (dark Geist, sample-data badge, public-site link, honest note).
- No network calls, no analytics, no form posts, no WhatsApp / Gmail / Maps embeds that leave the page.
- `ranked-slice5.md` and this file stay in the repo.

---

## Review (Sell, not the coding agent)

Sell will open the live Pages and check: is it THEIR product, not a generic dashboard; does the one-line site problem appear in the note; do the controls work; is it mobile-usable. Push back if it looks like another clinic HIS, another JMB 30/60/90, another tadika morning, another F&B table, or another Yuran treasurer board.

Do not send outreach. Ian approves any email in chat first.
