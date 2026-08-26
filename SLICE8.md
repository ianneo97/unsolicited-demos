# Slice 8 — coding brief

For a coding agent. **Sell reviews.** Do not email anyone. Do not fill contact forms. Do not invent companies.

Repo: `https://github.com/ianneo97/unsolicited-demos`
Live: `https://ianneo97.github.io/unsolicited-demos/`
Owner: Ian Neo (`ianneo97`). Outreach Gmail is off-limits unless Ian says send.

Scores and sources: see [`ranked-slice8.md`](./ranked-slice8.md). Higher score = worse live site / better prospect.

Area this slice: new seats slices 1–7 did not own. Confinement centre, petrol-station POS, SK/SMK school, lab LIS, umrah agency file, construction PM leftover. Not another clinic / JMB / tadika / F&B table / Yuran treasurer / WMS / gold / changer / maid / mosque / used-car / freight / guard / pest / temple / dialysis / koperasi / site diary / church / farm.

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
Slice-6 P0 already specified — do not re-P0: `ucd/`, `buttonwood/`, `vpatrol/`, `pestpro/`, `grasp/`.
Slice-6 P1: `ejenplus/`, `greenflow/`, `libraflow/`, `epusara/`, `strikezone/`.
Slice-7 P0 already specified — do not re-P0: `dialysismanager/`, `icoop/`, `esiteview/`, `relate/`, `agrinex/`.
Slice-7 P1: `prima/`, `lifecare/`, `pandaworks/`, `splinergy/`.

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

Label sample data in the shell (`SAMPLE DATA · … · not a live …`). No fake AI accuracy, no fake customer counts, no stolen real worker/patient/ahli names from their marketing as if they were live records. Invent clearly-fake MY sample names.

---

## Build order

Ship **P0** first, in one PR or a few commits on `main` (or a branch + PR). Then P1 if time. Stop before P2 unless the brief is updated.

### P0 — build these (five distinct desks)

1. **esoft/** — confinement centre: check-in mother → vital/breastfeed/wound → meal pick
2. **fmpos/** — petrol station: authorize dispenser → waiting zone → tank reconcile
3. **asis/** — SK/SMK school: daftar murid → yuran reminder → peperiksaan
4. **medist/** — lab LIS: register patient → tube label → verify result
5. **dooums/** — umrah agency: daftar jemaah → group / visa file
6. **binacloud/** — construction PM: assign task → stamp drawing → flag delay

### P1 — if P0 is solid (different seat, not a twin)

6. **ace/** — company secretary: statutory register → MBRS AR export → deadline (KK street)
7. **thinkis/** — hostel: assign bed → split utility → tenancy deadline (PJ street)
8. **albatrozz/** — golf tee sheet only if Ian wants golf (Bangsar South; modern-enough site)
9. **xgen/** — gym: sign member → PT pack → door check-in (Puchong street)
10. **weddie/** — wedding guest: add guest → seat table → door check-in (phone only)
11. **speedbrick/** — contractor claim: open job → progress claim → VO (PJ street). Same construction leftover family as Bina Cloud — only if Ian wants a second construction desk.

### Skip unless Ian says so

- **pepatih/** / **mypelajar/** / **adabs/** / **tenjin/** / **skoolbeez/** — same school seat as ASIS
- **hiro/** — same petrol seat as FMPOS
- **officio/** / **bizaid/** / **ezcosec/** — same CoSec seat as ACE
- **hiclass/** — tuition leftover, crowded with AOne / REMMU / Synorex / Tuis.my
- **fitnow/** — same gym seat as XGEN
- **buildtrack/** / **buildspace/** / **niuace/** — finer Bina Cloud / Speedbrick leftover
- **treom/** — Johor waste IoT, thin, not KL
- slice-4, slice-5, slice-6, slice-7 P0/P1 folders

---

## P0 specs

### 1. E-Soft Confinement — `esoft/`

- Live site: https://www.e-soft.com.my/confinement.html (125, Jalan Mawar 2/3, Pekan Baru, 08000 Sungai Petani, Kedah — on `/contact1.php`). Worst: 1990s frames HTML; leftover “aircond”; home is a 15-SKU catalogue with no product UI. Contact: colim@e-soft.com.my · 04-4242230 · 012-4787917 (Mr. Lim Chan Oo, printed). **Do not invent a second inbox.**
- Sells: confinement-centre OS — room/package, mother+baby health, meal pick, visitor, billing.
- **Desk:** one confinement board. 6 rooms (fake MY mother names, fake packages: 14-day / 28-day). Button: **Check-in** stamps a room + date. Button: **Vital** writes BP / temp / breastfeed / wound chip. Button: **Meal pick** writes breakfast/lunch that actually sticks. Not Life Care nursing home. Not GuestPro hotel PMS. Same shop also sells hostel + timber — do **not** also build those.
- Accent: keep dark Geist; one confinement rose is fine.

### 2. FMPOS — `fmpos/`

- Live site: http://www.fmpos.mbjs.com.my/ (Suite 33-01, Level 33, Keck Seng Tower, Jalan Bukit Bintang, 55100 Kuala Lumpur — on homepage). Worst: “This website was made with Mobirise”; leftover “Whatapp”, “Tokhiem”, “it expandable”. HTTP only. Contact: mahadi@fmpos.net · +60 111 028 6886.
- Sells: independent petrol-station POS + dispenser site-controller.
- **Desk:** one petrol board. 6 pumps (fake station: “Pump 1–6”). Button: **Authorize** stamps a pump + litres. Button: **Waiting zone** writes a car plate chip. Button: **Tank reconcile** writes litres that actually add. Not Pitstop car-wash. Not WebMax workshop. Not UltraPark.
- Accent: keep dark Geist; one petrol amber is fine.

### 3. ASIS — `asis/`

- Live site: https://www.asis.my/ (No. 5-1, Jalan USJ1/1A, Regalia Business Center, 47600 Subang Jaya — on homepage). Worst: page last stamped 2018-08-21; trust counters render 0 Pengguna / 0 Malaysia; leftover GST; leftover “Pengguna Adalah Elemen Yang Paling Beharga”. Contact: info@awfatech.com · 03-8023 5250.
- Sells: school OS — daftar, yuran, kehadiran, peperiksaan, e-Parent.
- **Desk:** one school counter. 8 murid (fake MY names, fake darjah). Button: **Daftar** stamps no. murid. Button: **Yuran reminder** writes MYR + due date. Button: **Peperiksaan** writes a mark that actually stores. Do **not** rebuild ClassFlow tadika. Do **not** rebuild Yuran.my PIBG treasurer. Do **not** rebuild StudentQR.
- Accent: keep dark Geist; one school blue is fine.

### 4. Medist — `medist/`

- Live site: https://medisthealthcare.my/ (city **unknown** — page prints “Malaysia” only). Worst: leftover bordered “MH Lab Connect” hero; Privacy/Terms/Support are `href="#"`; contact is a gmail. Contact: medisthcare@gmail.com. **Do not invent a street or a phone.**
- Sells: medical-lab LIS — register, accession / barcode tube, analyzer result, QC.
- **Desk:** one lab bench. 6 samples (fake MY names, fake tests: FBC / LFT / HbA1c). Button: **Register** stamps an accession no. Button: **Tube label** writes a barcode chip. Button: **Verify result** writes a value that actually stores. Not MAGSYS clinic HIS (no GP queue). Not Luimewah. Not Salinee / Prima RIS-PACS. Not Dialysis Manager.
- Accent: keep dark Geist; one lab teal is fine.

### 5. DooUMS — `dooums/`

- Live site: https://dooums.com/ (city **unknown**). Worst: footer “Dabudoo Technology © 2019”; generic hosting tiles; dead `/contact.html` form. Contact: WhatsApp 011-5950 9509 only. **Do not invent an email or a street.**
- Sells: umrah / haji agency OS — jemaah record, multi-user, cloud.
- **Desk:** one umrah counter. 8 jemaah (fake MY names, fake packages: 14-hari / 21-hari). Button: **Daftar jemaah** stamps a file no. Button: **Group** writes a departure date + package. Button: **Visa file** writes submitted / missing chip. Not TrevoFlow travel ERP. Not Pandaworks cinema. Not a generic CRM.
- Accent: keep dark Geist; one umrah green is fine.


### 6. Bina Cloud — `binacloud/`

- Live site: https://www.bina.cloud/ (L-1-03A, Connezion Commercial, Persiaran IRC 3, IOI Resort, 62502 Putrajaya — on `/about-us`). Worst: demo counters leftover “Hours Wasted −10°C to 40°C” / “Hours Saved LED searchlight”; email placeholder maestronoob@gmail.com; typo “technolgy”; `/contact` is the homepage clone titled Home. Contact: info@bina.cloud · 03-8309 4732. **Do not use maestronoob@gmail.com.**
- Sells: construction project OS — documents, drawing approval, task, site photo, schedule-delay flag.
- **Desk:** one contractor board. 6 jobs (fake sites: taman / highway / majlis). Button: **Assign task** writes a worker + date. Button: **Stamp drawing** writes approved / rejected. Button: **Flag delay** writes days late that actually stores. Not eSiteView photo+GPS diary. Not REAMS facility CMMS. Not a generic Gantt.
- Accent: keep dark Geist; one site orange is fine.

---

## P1 specs (short)

**ace/** — https://blazetech.my/. Worst: “managment”. **Desk:** 6 companies, open register → export AR → deadline. Kota Kinabalu street. Not CoreMatter.

**thinkis/** — https://www.think-is.com.my/hostel-management-system. Worst: 2000s frames + leftover laptop shop. **Desk:** 6 beds, assign → split utility MYR → tenancy deadline. PJ street. Not StayMii. Not JMB.

**albatrozz/** — https://www.albatrozz.com/. Worst: 0+ counters; “We would be please”. **Desk:** 6 tee times, book → handicap stamp → green-fee MYR. Bangsar South. Only if Ian wants golf.

**xgen/** — https://xgen.com.my/. Worst: contact@example.com mailto; about/contact 404. **Desk:** 6 members, sign → PT pack → door check-in. Puchong street. Not D-Clix.

**weddie/** — https://weddie.my/. Worst: ©2023; no email. **Desk:** 6 guests, add → seat table → door check-in. Phone only. Not hotel PMS.

**speedbrick/** — https://speedbrick.com/. Worst: WP 5.3 + lorem ipsum accordion. **Desk:** 6 jobs, progress claim MYR → VO log. PJ SS2 street. Same construction leftover family as Bina Cloud — only if Ian wants two construction desks. Not eSiteView diary.

---

## Hub + README

Update root `index.html` lede and add a row per new folder (name + one-line desk). Keep the existing shipped rows.

Append a line to `README.md` per new folder, same style as the existing rows.

Leave `SLICE2.md` through `SLICE7.md` and their `ranked-slice*.md` in the repo. Add this file next to them.

---

## Definition of done

- Each P0 folder loads as static files on GitHub Pages (`/<slug>/`).
- `mountDemo` paints a dense, clickable desk. Buttons change state. Check-in/meal, pump/tank, daftar/yuran, accession/result, jemaah/visa totals are real in the sample data.
- Chrome matches the existing desks (dark Geist, sample-data badge, public-site link, honest note).
- No network calls, no analytics, no form posts, no WhatsApp / Gmail / Maps embeds that leave the page.
- `ranked-slice8.md` and this file stay in the repo.

---

## Review (Sell, not the coding agent)

Sell will open the live Pages and check: is it THEIR product, not a generic dashboard; does the one-line site problem appear in the note; do the controls work; is it mobile-usable. Push back if it looks like another clinic HIS, another JMB 30/60/90, another tadika morning, another F&B table, another Yuran treasurer board, another LeafClover WMS, another SisEmas gold counter, another EFOX changer, another maid file, another MasjidPro Jumaat board, another UCD VSO, another Buttonwood BL, another V-Patrol roster, another PestPro job, another Grasp pooja, another dialysis chair, another koperasi yuran, another site diary, another church cell, or another farm plot, or another eSiteView site diary.
