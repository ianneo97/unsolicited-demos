# Slice 3 - coding brief

For a coding agent. **Sell reviews.** Do not email anyone. Do not fill contact forms. Do not invent companies.

Repo: `https://github.com/ianneo97/unsolicited-demos`  
Live: `https://ianneo97.github.io/unsolicited-demos/`  
Owner: Ian Neo (`ianneo97`). Outreach Gmail is off-limits unless Ian says send.

Scores and sources: see [`ranked-slice3.md`](./ranked-slice3.md). Higher score = worse live site / better prospect.

Area this slice: Klang Valley. Penang names stay on slice 2.

---

## Already shipped - leave them alone

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

Copy **chrome** from `magsys/` (or `webmax/`). Do not invent a new design system.

---

## Pattern (data merge, not unique sites)

Vanilla HTML / CSS / JS. No build step. No React / Vue / Tailwind CLI / bundler.

Each new company is a folder at repo root:

```
<slug>/
  index.html          # copy from magsys/index.html (shared chrome)
  css/style.css       # copy from magsys/css/style.css
  js/app.js           # copy from magsys/js/app.js
  js/config.js        # THIS company only - window.SITE
  js/demo.js          # THIS company only - window.mountDemo(root)
```

`window.SITE` fields (match existing): `slug`, `name`, `oneliner`, `sells`, `worst_problem`, `city`, `original_url`, `accent`, `accentInk`, `demo_lead`, `note`.

`js/app.js` fills the chrome from `SITE` and calls `window.mountDemo(root)`. Use `window.el(tag, cls, txt)` already defined there.

Extra CSS for a dense desk: inject a `<style>` from `demo.js` (same as MAGSYS / TEERA / WebMax). Do not fork `style.css` per company.

Footer on every page: `Unsolicited demo. Built from the public site.` / `Ian Neo`.

Label sample data in the shell (`SAMPLE DATA · … · not a live …`). No fake AI accuracy, no fake customer counts, no stolen real patient/owner/client names from their marketing as if they were live records. Invent clearly-fake MY sample names.

---

## Build order

Ship **P0** first, in one PR or a few commits on `main` (or a branch + PR). Then P1 if time. Stop before P2 unless the brief is updated.

### P0 - build these (five distinct desks)

1. **flexsoft/** - retail till + MyInvois
2. **mylivin/** - JMB treasurer view
3. **classflow/** - tadika morning board
4. **corematter/** - legal matter + trust
5. **flitz/** - last-mile dispatch + POD

### P1 - if P0 is solid (different seat, not a twin)

6. **gprop/** - resident pay / book hall / invite visitor (not a second JMB ledger; that is Advelsoft + myLivin)
7. **listingmine/** - REN private listing + buyer CRM + PDF
8. **petotumvet/** - vet desk (only new vertical from Sell's same-day addendum). Live: https://petotum.com/petotumvet (Glo Damansara). Worst: GoPet AI banner is a journal. Desk: 4 pets in a waiting list, vax due chip, call next, invoice MYR. Not a human clinic HIS (that is Clinica / kumoDoc). Contact: hello@petotum.com

### Skip unless Ian says so

- `easypro/`, `mylegalsoft/` - same legal seat as CoreMatter
- `studentqr/`, `aone/`, `kindypro/` - same tadika/tuition seat as ClassFlow (KindyPro form shortcode is broken; still a twin)
- `engarage/` - WebMax twin
- `kryptopos/` - site timed out 19 Aug; do not build until it loads
- `maynuu/`, `delyva/` - last-mile-adjacent; Flitz is the dispatch seat
- `tunaipro/`, `beautesoft/`, `33crm/` - salon POS; TunaiPro site is now fine
- `property213/` - ListingMine seat
- `adam/` - procure PR/PO; thin, only if P0+P1 are done
- `iagentmy/` - no public KV office

---

## P0 specs

### 1. Flexsoft - `flexsoft/`

- Live site: https://flexsoft-tech.com/ (Sri Damansara). Worst: dated brochure, no POS UI. FAQ is real; last news is 2024 member-app posts.
- Sells: retail POS + LHDN e-invoice. Contact: business@flexsoft-tech.com.
- **Desk:** one retail counter. 5 SKUs (fake MY grocery/F&B). Add/remove lines, SST 6%, MyInvois toggle, tender cash, change. Button: **Issue e-invoice** (stays on the page). Not a mamak table map (KryptoPOS is down). Not a salon (BeauteSoft / TunaiPro).
- Accent: keep dark Geist; one retail blue is fine.

KryptoPOS is off P0. https://kryptopos.com/ timed out 19 Aug for both Sell and Desk. Do not prebuild it until the public site loads and a worst-line can be verified.

### 2. myLivin' - `mylivin/`

- Live site: https://www.mylivin.my/ (Kelana Jaya). Also https://living.my/ with Lorem Ipsum news cards. Worst: ©2022 Elementor slugs.
- Sells: condo / JMB community + building services (EBOSS).
- **Desk:** JMB treasurer, one condo ("Residensi Demo, SS7"). This month's maintenance + sinking, late interest that actually changes, 3 units in arrears. Button: **Issue August**. Button: **Queue WhatsApp pay link** (fake "queued to +60…", do not open wa.me). Do not rebuild WooYoo / a resident app store (that is Gprop's P1). Do not clone the Advelsoft 30/60/90 ledger - this is "this month + late interest + pay link", denser, one screen.
- Accent: keep dark Geist; one condo teal is fine.

### 3. ClassFlow - `classflow/`

- Live site: https://classflow.my/ (One Mont Kiara). Worst: keyword-stuffed "kindergarten software" in every paragraph.
- Sells: tadika / taska / tuition: face-scan, billing, parent chat.
- **Desk:** tadika morning. 8 children (fake MY names). Button: **Face-scan in** (button, not a camera) flips the row to IN and stamps a time. Fee-due chip on 2 kids. Button: Parent **"sudah sampai"** (fake ping, stays on the page). One **Issue August invoice** that writes a MYR amount on the selected child. Bahasa labels on the chips are fine. Not a 30-year campus ERP. Not StudentQR merits. Not AOne e-enrol.

### 4. CoreMatter - `corematter/`

- Live site: https://corematter.biz/ (Kelana Mall, via BNS Asia). Worst: leftover agency template, fake team, "Ceating brand identities".
- Sells: cloud legal practice + trust accounting.
- **Desk:** one sole-prop lawyer. Matter list (3 files: conveyancing, litigation, retainer). Select a matter → **Start timer / Stop timer** (elapsed minutes change a WIP figure). Button: **Raise bill** (office account). Show client account vs office account as two running numbers that move. Button: **SST PDF** (on-page preview, no download of a real PDF required). No fake AI drafting. EasyPro / MyLegalSoft are the same seat - do not also build those.

### 5. Flitz - `flitz/`

- Live site: https://www.flitz.com.my/ (Pinnacle Kelana Jaya). Worst: "#1" homepage, no screenshots.
- Sells: last-mile / field-workforce dispatch, GPS, POD.
- **Desk:** dispatch board. 8 drops (fake PJ addresses: SS2, Kelana, Ara, Sunway). Assign to two named riders. Button: **Mark POD** (photo checkbox + timestamp). Tiny map is a fake grid, not a Google embed. No live GPS. No Grab/Lalamove API (Maynuu). Laundry or distributor copy is fine; do not pretend it is a clinic or a workshop.

---

## P1 specs (short)

**gprop/** - https://gpropsystems.com/ (Bangsar South). Dated SEO, hero pasted twice, "UNDELETEABLE DATA". Resident side: pay monthly fee, book hall (one slot), invite a visitor (name + car plate + time). Office sees the ticket. Sample condo name, not a real Gprop client. This is not Advelsoft and not myLivin.

**listingmine/** - https://www.listingmine.com/ (Desa Parkcity). Do not put a music player on the demo. Agent desk: one private listing, one buyer, match, generate a listing PDF (on-page), "survives an agency switch" as a one-line note. No 200 songs.

---

## Hub + README

Update root `index.html` lede and add a row per new folder (name + one-line desk). Keep the seven existing rows.

Append a line to `README.md` per new folder, same style as the existing seven.

Leave `SLICE2.md` and `ranked-slice2.md` in the repo. Add these two files next to them.

---

## Definition of done

- Each P0 folder loads as static files on GitHub Pages (`/<slug>/`).
- `mountDemo` paints a dense, clickable desk. Buttons change state. Totals / arrears / WIP / POD timestamps are real in the sample data.
- Chrome matches the existing seven (dark Geist, sample-data badge, public-site link, honest note).
- No network calls, no analytics, no form posts, no WhatsApp / Gmail / Maps embeds that leave the page.
- `ranked-slice3.md` and this file stay in the repo.

---

## Review (Sell, not the coding agent)

Sell will open the live Pages and check: is it THEIR product, not a generic dashboard; does the one-line site problem appear in the note; do the controls work; is it mobile-usable. Push back if it looks like another clinic HIS, another JMB 30/60/90 clone, or another books inbox.

Do not send outreach. Ian approves any email in chat first.
