# Slice 2 — coding brief

For a coding agent. **Sell reviews.** Do not email anyone. Do not fill contact forms. Do not invent companies.

Repo: `https://github.com/ianneo97/unsolicited-demos`  
Live: `https://ianneo97.github.io/unsolicited-demos/`  
Owner: Ian Neo (`ianneo97`). Outreach Gmail is off-limits unless Ian says send.

Scores and sources: see [`ranked-slice2.md`](./ranked-slice2.md). Higher score = worse live site / better prospect.

---

## Already shipped — leave them alone

Do not rewrite these unless a page is actually broken:

| Folder | Product | Live |
| --- | --- | --- |
| `clinica/` | Clinic front desk + thin payroll | https://ianneo97.github.io/unsolicited-demos/clinica/ |
| `magsys/` | C / D / H HIS desks | https://ianneo97.github.io/unsolicited-demos/magsys/ |
| `teera/` | Bank inbox + Aug 2026 P&L + 7-day cash | https://ianneo97.github.io/unsolicited-demos/teera/ |
| `kumodoc/` | EMR + TPA claims | https://ianneo97.github.io/unsolicited-demos/kumodoc/ |

Copy **chrome** from `magsys/` (or `clinica/`). Do not invent a new design system.

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

Extra CSS for a dense desk: inject a `<style id="<slug>-demo-css">` from `demo.js` (same as MAGSYS / TEERA). Do not fork `style.css` per company.

Footer on every page: `Unsolicited demo. Built from the public site.` / `Ian Neo`.

Label sample data in the shell (`SAMPLE DATA · … · not a live …`). No fake AI accuracy, no fake customer counts, no stolen real patient/owner names from their marketing as if they were live records. Invent clearly-fake MY sample names.

---

## Build order

Ship **P0** first, in one PR or a few commits on `main` (or a branch + PR). Then P1 if time. Stop before P2 unless the brief is updated.

### P0 — build these

1. **webmax/** — workshop job card  
2. **advelsoft/** — JMB unit ledger + monthly bill  
3. **didi/** — pharmacy FEFO POS  

### P1 — if P0 is solid

4. **gprop/** — resident pay / book hall / invite visitor  
5. **flitz/** — last-mile dispatch + POD  
6. **classflow/** — tadika morning board  

### Skip unless Ian says so

ENGARAGE (backup of WebMax), Condo Master, StayMii, Qubit (Penang), TunaiPro, MySyarikat, leftover slice-1 accounting (Biztory / SQL / QNE / EMS).

---

## P0 specs

### 1. WebMax — `webmax/`

- Live site: https://workshopsoftware.my/ (Prima Selayang). Worst: recycled 2019–2020 news; Prowheels and Kim Auto Garage testimonials are the same “120 pengedar” paragraph.
- Sells: tyre-shop / workshop jobsheet, CRM, stock, WhatsApp bill, MyInvois.
- **Desk:** one morning board. Queue of 4–5 vehicles (plate, make, job type: tukar tayar / service / alignment). Select a job → job card (complaint, parts lines you can add/remove, labour). Total in MYR. Toggle MyInvois stamp. Button: **WhatsApp bill** (fake “queued to +60…”, do not open wa.me). Button: **Call next**.
- C / D / H style density. Tabs only if they earn it (e.g. Job card | Stock). No empty marketing tiles.
- Accent: keep dark Geist; a tyre-shop orange is fine if it stays one accent.

### 2. Advelsoft — `advelsoft/`

- Live site: https://advelsoft.com.my/ (Shah Alam). Worst: 2014-era brochure; “NEED A PROPERTY MANAGEMENT SYSTEM?” hero repeats three times. Email on site: general@advelsoft.com.my.
- Sells: strata / JMB / MC PMS, tenancy, WooYoo resident + guard apps.
- **Desk:** JMB office, one condo (“Residensi Demo, Seksyen 13”). Unit list (unit no, owner, sq ft, arrears). Select a unit → ledger (maintenance + sinking fund, 2–3 months). Button: **Issue August bill**. Toggle MyInvois / e-statement. Show running arrears that actually change when you issue or mark paid.
- Do not rebuild WooYoo as a fake app store. Office ledger first.

### 3. Didi — `didi/`

- Live site: https://didisystems.com.my/ (Mont Kiara). Worst: Latin lorem tiles and “Contact form not found.” Pharmacy product page exists at `/pharmacy-management/`.
- Sells: pharmacy stock / FEFO / dispensing (they also catalogue POS / WMS / robots — **do not** demo robots).
- **Desk:** retail counter. Scan/pick 4–5 SKUs (paracetamol, amoxicillin, etc.) with batch + expiry. FEFO: if you pick a later batch while an earlier one exists, warn. Script label (fake Rx no). Invoice MYR + MyInvois toggle.
- This is a counter, not another clinic HIS. No queue of patients, no TPA claim board (that is kumoDoc).

---

## P1 specs (short)

**gprop/** — https://www.gpropsystems.com/ (Bangsar South). Dated SEO, hero pasted twice, “UNDELETEABLE DATA”. Resident side: pay monthly fee, book hall (one slot), invite a visitor (name + car plate + time). Office sees the ticket. Sample condo name, not a real Gprop client.

**flitz/** — https://www.flitz.com.my/ (Kelana Jaya). Generic Elementor, typo “rounting”, identical plan columns. Dispatch board: 5 drops, assign agent, mark POD (photo checkbox + timestamp). Tiny map is a fake grid, not a Google embed. No live GPS.

**classflow/** — https://classflow.my/ (Mont Kiara / Treo). Homepage is an SEO keyword dump. Tadika morning: 8 children, face-scan check-in (button, not a camera), fee due chip, parent “sudah sampai” ping (fake). Not a 30-year campus ERP.

---

## Hub + README

Update root `index.html` lede and add a row per new folder (name + one-line desk). Keep the four existing rows.

Append a line to `README.md` per new folder, same style as the existing four.

---

## Definition of done

- Each P0 folder loads as static files on GitHub Pages (`/<slug>/`).
- `mountDemo` paints a dense, clickable desk. Buttons change state. Totals / arrears / FEFO warnings are real in the sample data.
- Chrome matches the existing four (dark Geist, sample-data badge, public-site link, honest note).
- No network calls, no analytics, no form posts, no WhatsApp / Gmail / Maps embeds that leave the page.
- `ranked-slice2.md` and this file stay in the repo.

---

## Review (Sell, not the coding agent)

Sell will open the live Pages and check: is it THEIR product, not a generic dashboard; does the one-line site problem appear in the note; do the controls work; is it mobile-usable. Push back if it looks like another clinic HIS or another books inbox.

Do not send outreach. Ian approves any email in chat first.
