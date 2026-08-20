# Slice 7 — coding brief

For a coding agent. **Sell reviews.** Do not email anyone. Do not fill contact forms. Do not invent companies.

Repo: `https://github.com/ianneo97/unsolicited-demos`
Live: `https://ianneo97.github.io/unsolicited-demos/`
Owner: Ian Neo (`ianneo97`). Outreach Gmail is off-limits unless Ian says send.

Scores and sources: see [`ranked-slice7.md`](./ranked-slice7.md). Higher score = worse live site / better prospect.

Area this slice: leftover verticals slices 1–6 barely touched, whole Malaysia. Dialysis centre, koperasi, construction site diary, church counter, farm plot. Not another clinic / JMB / tadika / F&B table / Yuran treasurer board / WMS / gold / changer / maid / mosque / used-car / freight / guard / pest / temple.

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

1. **dialysismanager/** — hemodialysis centre: register → treatment → sponsor claim
2. **icoop/** — koperasi: anggota → pembiayaan → yuran/dividen
3. **esiteview/** — site diary: task → photo+GPS → payment report
4. **relate/** — church: cell attendance → visitor follow-up → member
5. **agrinex/** — farm plot: plot → field activity → worker task

### P1 — if P0 is solid (different seat, not a twin)

6. **prima/** — RIS/PACS accession (Bangsar South street)
7. **lifecare/** — nursing-home resident + drug chart (Klang street; polished beta — only if Ian wants care home)
8. **pandaworks/** — cinema box office (Taiping street)
9. **splinergy/** — tenant energy bill only if a street city is confirmed

### Skip unless Ian says so

- **idialysis/** — fine twin of Dialysis Manager
- **manageahli/** / **sdtech/** / **moccis/** — same koperasi seat as iCOOP
- **faithconnect/** — same church seat as RELATE
- **salinee/** — same imaging seat as Prima
- **peladang/** — fine twin of Agrinex
- **easyworkshop/** — WebMax workshop twin
- **wauhub/** — fine travel SaaS
- slice-4, slice-5, slice-6 P0/P1 folders

---

## P0 specs

### 1. Dialysis Manager — `dialysismanager/`

- Live site: https://dialysismanager.io/ (Pusat Industri, Technovation Park, UTM, 81300 Johor Bahru — on homepage and `/contact-us/`). Worst: `/contact-us/` leftover lorem ipsum plus fake “Midtown Manhattan 123 5th Ave, New York”, `info@example.com`, `+1 123 456 7890`. Home trust counters render 0 / “Sponser Template”. Login is stock wp-login.php. Contact: support.dm@microsemi.com.my. **Do not use the NYC leftovers.**
- Sells: hemodialysis-centre OS — patient, treatment, inventory, sponsor claim.
- **Desk:** one dialysis board. 8 chairs (fake MY names, fake sponsor: PERKESO / SOCSO / self). Button: **Register patient** stamps a file no. + date. Button: **Treatment** writes pre-weight + duration chip. Button: **Sponsor claim** writes MYR that actually adds. Not MAGSYS clinic HIS (no GP queue). Not kumoDoc TPA as the whole demo.
- Accent: keep dark Geist; one dialysis teal is fine.

### 2. iCOOP — `icoop/`

- Live site: https://www.icoop.my/ (Suite 2-09, Block 4806, CBD Perdana 2, Persiaran Flora, Cyber 12, 63000 Cyberjaya). Worst: footer “Copyright © 2017 ICOOP.MY”; typos “Kelayakkan”, “merangkamui”; leftover “??? 60 More Themes Lifetime Support”. Contact: icoop.my@gmail.com · 019-262-0085.
- Sells: koperasi OS — anggota, pembiayaan, yuran, dividen, lejar.
- **Desk:** one koperasi counter. 8 ahli (fake MY names). Button: **Daftar anggota** stamps no. anggota. Button: **Tapis pembiayaan** writes approved/rejected + MYR. Button: **Yuran / dividen** writes a receipt that actually adds. Do **not** rebuild a Yuran.my PIBG/khairat treasurer board. Do **not** rebuild MasjidPro Jumaat.
- Accent: keep dark Geist; one koperasi green is fine.

### 3. eSiteView — `esiteview/`

- Live site: https://esiteview.com.my/ (1-15, Jalan Kajang Perdana 3, Kajang Perdana Avenue, 43000 — on `/site/contact.aspx`). Worst: homepage **is** the login form; partner copy leftover “on certain extend”. Contact: hello@esiteview.com.my · 03-8733 1734. Specialists on the contact page: Abu Zharief 017-388 1027.
- Sells: site-work diary — task, photo+GPS, inspection, payment report.
- **Desk:** one site board. 6 jobs (fake site: taman / highway / majlis). Button: **Assign task** writes a worker + date. Button: **Photo+GPS** stamps submitted + lat-ready chip (no real photo). Button: **Payment report** writes MYR that actually adds. Not REAMS facility CMMS. Not ETD custom construction ERP. Not a generic project Gantt.
- Accent: keep dark Geist; one site orange is fine.

### 4. RELATE — `relate/`

- Live site: https://www.relate.my/ (Suite 9.01, Level 9, Menara Summit, Persiaran Kewajipan, USJ 1, 47600 Subang Jaya — on `/contact-us.html`). Worst: header leftover “19800 Members & Visitors Profile”; contact leftover `-->`; footer “Copyright © 2019 Ascentrio”. Contact: relate@ascentrio.com · +603-8601 7168. Do not use parent ascentrio.com (footer is hacked sneaker spam).
- Sells: church OS — cell attendance, visitor follow-up, member file.
- **Desk:** one church counter. 8 people (fake MY names) tagged member / visitor. Button: **Cell attendance** ticks present. Button: **Visitor follow-up** writes a call chip. Button: **Member** flips visitor → member. Do **not** rebuild Grasp temple pooja. Do **not** rebuild MasjidPro Jumaat. Do **not** rebuild a Yuran fee board.
- Accent: keep dark Geist; one church purple is fine.

### 5. Agrinex — `agrinex/`

- Live site: https://agrinex.com.my/ (city **unknown** — page prints “Malaysia” only). Worst: theme leftovers “Subscrive”, “Send Your Messager”, empty Cart. Contact: kevin.ng0107@gmail.com · 017-238 3826. **Do not invent a street.**
- Sells: farm / plantation mini-ERP — plot, field activity, worker task.
- **Desk:** one farm board. 6 plots (fake crop: chilli / durian / paddy). Button: **Open plot** stamps a plot id. Button: **Field activity** writes spray / fertilise + date. Button: **Assign worker** writes a fake name + hours. Not Cerebros poultry (no flock / feed cycle). Not Airei palm-mill SI.
- Accent: keep dark Geist; one farm green is fine.

---

## P1 specs (short)

**prima/** — https://primasys.com.my/. Worst: “COMPLeTED”; `/contact/` 404. **Desk:** 6 studies, accession → report stamp → portal share. Bangsar South street.

**lifecare/** — https://lifecaresystems.com.my/. Worst: private-beta waitlist banner. **Desk:** 6 residents, drug-chart sign, bill cycle. Klang street. Only if Ian wants nursing home.

**pandaworks/** — https://pandaworks.net/cinema/. Worst: thin vs Longbow hardware twin. **Desk:** 6 showtimes, sell seat, concession MYR. Taiping street.

**splinergy/** — https://splinergy.com/. Worst: no Jalan. **Desk:** 6 tenants, kWh bill, top-up. Only if a street city is confirmed.

---

## Hub + README

Update root `index.html` lede and add a row per new folder (name + one-line desk). Keep the existing shipped rows.

Append a line to `README.md` per new folder, same style as the existing rows.

Leave `SLICE2.md`, `SLICE4.md`, `SLICE5.md`, `SLICE6.md`, `ranked-slice2.md`, `ranked-slice4.md`, `ranked-slice5.md`, `ranked-slice6.md`, `ranked-slice7.md` in the repo. Add this file next to them.

---

## Definition of done

- Each P0 folder loads as static files on GitHub Pages (`/<slug>/`).
- `mountDemo` paints a dense, clickable desk. Buttons change state. Treatment/claim, pembiayaan/yuran, photo-report, visitor→member, plot/activity totals are real in the sample data.
- Chrome matches the existing seven+ (dark Geist, sample-data badge, public-site link, honest note).
- No network calls, no analytics, no form posts, no WhatsApp / Gmail / Maps embeds that leave the page.
- `ranked-slice7.md` and this file stay in the repo.

---

## Review (Sell, not the coding agent)

Sell will open the live Pages and check: is it THEIR product, not a generic dashboard; does the one-line site problem appear in the note; do the controls work; is it mobile-usable. Push back if it looks like another clinic HIS, another JMB 30/60/90, another tadika morning, another F&B table, another Yuran treasurer board, another LeafClover WMS, another SisEmas gold counter, another EFOX changer, another maid file, another MasjidPro Jumaat board, another UCD VSO, another Buttonwood BL, another V-Patrol roster, another PestPro job, or another Grasp pooja.

Do not send outreach. Ian approves any email in chat first.
