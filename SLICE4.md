# Slice 4 — coding brief

For a coding agent. **Sell reviews.** Do not email anyone. Do not fill contact forms. Do not invent companies.

Repo: `https://github.com/ianneo97/unsolicited-demos`
Live: `https://ianneo97.github.io/unsolicited-demos/`
Owner: Ian Neo (`ianneo97`). Outreach Gmail is off-limits unless Ian says send.

Scores and sources: see [`ranked-slice4.md`](./ranked-slice4.md). Higher score = worse live site / better prospect.

Area this slice: new distinct seats (driving, martial-arts club, haulage, yuran, laundry). F&B table is P1 because KryptoPOS is still down. Penang/Johor names allowed when the product is demo-able.

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

---

## Pattern (data merge, not unique sites)

Vanilla HTML / CSS / JS. No build step. No React / Vue / Tailwind CLI / bundler.

Each new company is a folder at repo root:

```
<slug>/
  index.html          # copy from shared/template.html
  js/config.js        # THIS company only: window.SITE
  js/demo.js          # THIS company only: window.mountDemo(root)
```

Do not copy css/style.css or js/app.js into the folder. Chrome lives in `shared/`.

`window.SITE` fields (match existing): `slug`, `name`, `oneliner`, `sells`, `worst_problem`, `city`, `original_url`, `accent`, `accentInk`, `demo_lead`, `note`.

`shared/js/app.js` fills the chrome from `SITE` and calls `window.mountDemo(root)`. Use `window.el(tag, cls, txt)` from that file. Use `window.desk` from `shared/js/desk.js` for `rm`, `hms`, `stamp`, `find`, `pad`.

Desk layout classes live in `shared/css/style.css`: `desk-2`, `desk-3`, `desk-kv`, `desk-flash`, `desk-map`. Extra CSS for a signature only: inject a `<style>` from `demo.js`. Do not fork `style.css` per company.

Footer on every page: `Unsolicited demo. Built from the public site.` / `Ian Neo`.

Label sample data in the shell (`SAMPLE DATA · … · not a live …`). No fake AI accuracy, no fake customer counts, no stolen real student/driver/owner names from their marketing as if they were live records. Invent clearly-fake MY sample names.

---

## Build order

Ship **P0** first, in one PR or a few commits on `main` (or a branch + PR). Then P1 if time. Stop before P2 unless the brief is updated.

### P0 — build these (five distinct desks)

1. **edriving/** — driving-institute enrol + KPP thumbprint + fee
2. **dclix/** — martial-arts club morning
3. **gussmann/** — haulage ROT + POD + invoice
4. **yuran/** — KAFA/PIBG fee collection
5. **thelaundro/** — laundromat remote-start + today’s RM

### P1 — if P0 is solid (different seat, not a twin)

6. **pos2u/** — F&B table + KDS (KryptoPOS still down; their `/contact.html` is leftover lorem + “66 broklyn golden street. New York”)
7. **ultrapark/** — parking operator (only if a street city is confirmed; marketing site has no Jalan)
8. **labeau/** — salon book / deduct / commission (only if Ian wants a salon; Tunai/Beaute/33CRM already cover the seat — this site is the weak one)

### Skip unless Ian says so

- **imms/** — same driving seat as E-Driving; city not on the live homepage
- **telos/** — same laundry seat as theLaundro
- **qubepos/**, **poscare/**, **easyeat/**, **feedme/** — same F&B table as POS2U
- **bbs/** — optical; city not on the live page
- **frontdesk/** — agency catalogue; gym is one tile
- **gprop/**, **listingmine/**, **petotumvet/** — already slice-3 P1
- **kryptopos/** — still do not prebuild until the public site loads

---

## P0 specs

### 1. E-Driving — `edriving/`

- Live site: https://e-drivingsoft.com/ (Taman Perling, Johor Bahru). Worst: “Proudly supporting 0+ clients”; Payment Tracking tile copies the Class Scheduling sentence.
- Sells: driving-institute STARS + SOSV4/SOSV5 kiosk + POS. Contact: fongye@e-drivingsoft.com.
- **Desk:** one institute counter. 6 candidates (fake MY names, fake licence class D / B2). Button: **Thumbprint KPP02** flips the row to IN and stamps a time. Fee-due chip on 2 candidates. Button: **Issue receipt** writes a MYR amount. Not a tadika morning (ClassFlow). Not a university SIS (EMS).
- Accent: keep dark Geist; one JPJ green is fine.

### 2. D-Clix — `dclix/`

- Live site: https://www.d-clix.com/ (Kelana Centre Point). Worst: ©2025 Wix brochure, no desk UI.
- Sells: martial-arts / sports-club attendance, grading, fees, parent ping.
- **Desk:** club morning. 8 students (fake MY names). Button: **QR in** flips IN + time. Grading-due chip on 2. Button: **Parent “sudah sampai”** (fake ping, stays on the page). Button: **Collect grading fee** writes MYR on the selected row. Bahasa chips are fine. Not ClassFlow tadika. Not REMMU martial-arts marketing.
- Accent: keep dark Geist; one club red is fine.

### 3. Gussmann — `gussmann/`

- Live site: https://www.gussmann.my/hms/ (Taman Mastiara, Jalan Ipoh, KL). Worst: India office leftover on the MY homepage.
- Sells: container haulage HMS + transporter TMS, e-POD, driver incentive, invoice.
- **Desk:** dispatch board. 6 ROTs (fake Port Klang / Northport / Westports boxes). Assign to two named drivers / trucks. Button: **Mark POD** (photo checkbox + timestamp). Button: **Raise invoice** writes a MYR haulage charge. Tiny map is a **fake grid**, not a Google embed. Not Flitz last-mile parcels. Not WebMax workshop.
- Accent: keep dark Geist; one haulage amber is fine.

### 4. Yuran.my — `yuran/`

- Live site: https://yuran.my/ (Pusat Dagangan PJS). Worst: leftover “Sudah Tahun 2024” sales-letter.
- Sells: online yuran for KAFA / PIBG / tahfiz / persatuan. Contact: hello@yuran.my.
- **Desk:** treasurer. One sample org (“KAFA Demo, PJS”). 8 payers. Running overdue total that changes. Button: **Queue WhatsApp pay link** (fake “queued to +60…”, do not open wa.me). Button: **Reprint receipt**. Do **not** rebuild a tadika face-scan board (ClassFlow) or a tuition timetable (AOne).
- Accent: keep dark Geist; one teal is fine.

### 5. theLaundro — `thelaundro/`

- Live site: https://info.thelaundro.com/ (Oval Damansara). Worst: ©2024; “finger tips / vigourous / built the confident” still live 20 Aug.
- Sells: laundromat IoT remote-start + e-wallet + live sales.
- **Desk:** owner phone. 6 washers/dryers. Button: **Remote start** (e-wallet tick + timestamp). Today’s RM by machine that actually adds. Status chips: idle / running / fault. Not a ticket laundry POS (Rapy). Not Telos kiosk hardware.
- Accent: keep dark Geist; one laundry blue is fine.

---

## P1 specs (short)

**pos2u/** — https://pos2u.co/Restaurant.html. Worst: `/contact.html` is leftover lorem + Brooklyn NY. **Desk:** 6 tables, QR order (button, not a camera), kitchen ticket, split bill, SST 6%. Not KryptoPOS (site down). Not a salon.

**ultrapark/** — https://www.ultrapark.com.my/. Privacy host still prints `Undefined index: BING` and “Ultrapark Sdn Sdn”. **Desk:** 8 bays, season pass, one compound. Only build if a street city is confirmed.

**labeau/** — https://www.labeaupos.com/. LLM encyclopedia homepage. Same salon seat as Tunai — skip unless Ian pulls it up.

---

## Hub + README

Update root `index.html` lede and add a row per new folder (name + one-line desk). Keep the existing shipped rows.

Append a line to `README.md` per new folder, same style as the existing rows.

Leave `SLICE2.md`, `SLICE3.md`, `ranked-slice2.md`, `ranked-slice3.md` in the repo. Add these two files next to them.

---

## Definition of done

- Each P0 folder loads as static files on GitHub Pages (`/<slug>/`).
- `mountDemo` paints a dense, clickable desk. Buttons change state. Totals / overdue / POD timestamps / machine RM are real in the sample data.
- Chrome matches the existing seven+ (dark Geist, sample-data badge, public-site link, honest note).
- No network calls, no analytics, no form posts, no WhatsApp / Gmail / Maps embeds that leave the page.
- `ranked-slice4.md` and this file stay in the repo.

---

## Review (Sell, not the coding agent)

Sell will open the live Pages and check: is it THEIR product, not a generic dashboard; does the one-line site problem appear in the note; do the controls work; is it mobile-usable. Push back if it looks like another clinic HIS, another JMB 30/60/90, another tadika morning, or another books inbox.

Do not send outreach. Ian approves any email in chat first.
