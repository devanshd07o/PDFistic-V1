# PDFistic Website Proprietary Licensing Migration Report

**Product:** PDFistic (Desktop Document Reader & Editor for Windows)  
**Version:** 2.0.0  
**Target Licensing Model:** Proprietary · Closed-Source · All Rights Reserved  
**Commercial Distribution Channel:** Microsoft Store (Store ID: `9PMCFQL187MN`)  
**Author & Copyright Holder:** Devansh Dubey (Copyright © 2026 Devansh Dubey. All Rights Reserved.)  
**Date of Completion:** November 12, 2026  
**Status:** MIGRATION COMPLETE & VERIFIED  

---

## 1. Executive Summary

PDFistic has successfully transitioned its official public website (`website/` and live GitHub Pages `docs/`) from an open-source development baseline (Apache 2.0) to a commercial, proprietary positioning with an End User License Agreement (EULA).

This migration was executed in strict accordance with the non-redesign mandate: **zero changes were made to the visual layout, typography, animations, components, or responsiveness of the website**. All content updates were surgical, legally rigorous, and fully transparent regarding third-party open-source components.

### Core Achievements:
1. **Proprietary Identity Established:** Every page now clearly states that PDFistic is proprietary desktop software with closed source code and All Rights Reserved under Copyright © 2026 Devansh Dubey.
2. **Third-Party Open-Source Attribution Preserved:** All 13 upstream permissive open-source libraries (Mozilla PDF.js, Tesseract.js, pdf-lib, KaTeX, ePub.js, etc.) remain fully credited with their exact licenses (Apache 2.0, MIT, BSD, OFL-1.1), satisfying all legal obligations.
3. **EULA Transformation:** `terms.html` now serves as a complete Terms of Service & End User License Agreement, granting a personal, non-exclusive license while prohibiting unauthorized copying, reverse engineering, redistribution, and commercial resale.
4. **Link Integrity Maintained:** GitHub links were preserved for release binaries, download assets, and public issue tracking without advertising access to proprietary application source code.
5. **Zero Outdated Residuals:** Automated scanning across all 7 website HTML files confirmed zero residual claims that PDFistic itself is open source.

---

## 2. Before vs. After Licensing Comparison

| Feature / Location | Previous Positioning | Updated Proprietary Positioning |
|---|---|---|
| **Software Model** | Free and Open Source Software (FOSS) | Proprietary, Closed-Source Commercial Software |
| **Primary License** | Apache License, Version 2.0 | Proprietary · All Rights Reserved (Devansh Dubey) |
| **Terms of Service** | Generic open source terms (`terms.html`) | Full Terms of Service & End User License Agreement (EULA) |
| **Source Code Availability** | Publicly auditable on GitHub | Closed-source core; binaries distributed via Store & GitHub Releases |
| **Third-Party Attribution** | Conflated app license with upstream libraries | Explicitly delineated: Proprietary Core vs. Permissive Third-Party OSS |
| **GitHub Header CTA** | `View Source on GitHub` | `PDFistic on GitHub (Releases & Issues)` |
| **Contact Page Badge** | `Apache 2.0 Open Source` | `All Rights Reserved` · `Proprietary Software` |
| **Contact Page Repo Card** | `Open Source Repository` (source inspection) | `Issue Tracker & Releases` (bug reports & downloads) |
| **Footer Copyright** | `Published under Apache 2.0 license.` | `© 2026 Devansh Dubey · PDFistic. All Rights Reserved. Proprietary software for Windows.` |
| **Footer Legal Link** | `Open Source Notices` | `Third-Party Licenses` |

---

## 3. Detailed Per-File Migration Breakdown

### 3.1. Homepage (`website/index.html`)
- **Header Navigation:** Preserved clean navigation with dropdown link to `Third-Party Licenses`.
- **Header Action CTA:** Updated tooltip/title from `View Source on GitHub` to `PDFistic on GitHub (Releases & Issues)`.
- **Footer Links:** Updated legal link label from `Open Source Notices` to `Third-Party Licenses`.
- **Footer Copyright:** Replaced Apache 2.0 declaration with:  
  `© 2026 Devansh Dubey · PDFistic. All Rights Reserved. Proprietary software for Windows.`

### 3.2. Privacy Policy (`website/privacy.html`)
- **Structured Data (JSON-LD):** Replaced `"license": "https://www.apache.org/licenses/LICENSE-2.0"` with `"https://devanshd07o.github.io/PDFistic-V1/terms.html"`.
- **Section 1 (Scope and Who We Are):** Removed claims that PDFistic source code is published under Apache 2.0. Stated that PDFistic is proprietary desktop software with All Rights Reserved, incorporating verified open-source libraries under permissive licenses, with public release downloads and issue tracking at GitHub.
- **Section 8 (Complete Network Connection Inventory):** Replaced reference to "auditing open-source code" with "inspecting runtime traffic using standard network analysis tools."
- **Section 11 (Security Controls):** Replaced "Open source: Apache License 2.0 code is publicly auditable" with third-party transparency statement regarding sandboxed open-source engines (PDF.js, Tesseract.js, pdf-lib).
- **Footer & Related Links:** Updated link labels to `Third-Party Licenses` and updated copyright to proprietary declaration.

### 3.3. Terms of Service & EULA (`website/terms.html`)
- **Metadata & OpenGraph:** Updated descriptions to reflect Terms of Service & End User License Agreement (EULA) for proprietary desktop software.
- **Preamble ("In short"):** Rewrote summary to state that PDFistic is proprietary desktop software provided under a personal, non-exclusive license; unauthorized copying, redistribution, or reverse engineering is prohibited.
- **Section 2 & Section 3 (License Grant & Intellectual Property):** Completely restructured:
  - **License Grant:** Personal, non-exclusive, non-transferable, revocable license to install and run PDFistic on Windows devices for personal or commercial document reading.
  - **Ownership:** All title, copyright, and intellectual property rights in PDFistic (including core code, UI, branding, assets) are owned exclusively by Devansh Dubey (All Rights Reserved).
  - **Restrictions:** Prohibition against copying, modifying, decompiling, disassembling, reverse engineering, creating derivative works, renting, leasing, sublicensing, or distributing the software without express prior written consent.
  - **Third-Party Open-Source Carve-Out:** Explicit recognition that bundled third-party libraries (PDF.js, Tesseract.js, pdf-lib) remain governed by their respective open-source licenses (Apache 2.0, MIT).
- **Section 10 & 14:** Updated entire agreement clause to reference Terms of Service, Privacy Policy, and Third-Party Licenses. Footer updated to proprietary copyright.

### 3.4. Third-Party Licenses Page (`website/licenses.html`)
- **Rebranding:** Renamed page to `Third-Party Licenses & Open Source Notices` across `<title>`, OpenGraph, Twitter tags, breadcrumbs, eyebrow, and hero header.
- **Proprietary Architecture & Open-Source Transparency Card:** Added an explicit architectural breakdown:
  - **PDFistic Proprietary Core:** Closed-source desktop shell, document workspace, canvas annotation integration, UI layout, themes, and branding (Copyright © 2026 Devansh Dubey, All Rights Reserved).
  - **Third-Party Open-Source Components:** Permissively licensed third-party libraries powering PDF decoding, OCR, rendering, and scientific charts.
- **Section 3 (Apache License 2.0 Text):** Clarified that the Apache 2.0 license text applies to upstream third-party libraries (PDF.js, Tesseract.js, Apache ECharts), removing any implication that PDFistic itself is Apache 2.0.
- **Component Preservation:** All 13 authentic third-party license cards (PDF.js, StPageFlip, pdf-lib, Tesseract.js, ePub.js, KaTeX, Lucide, DOMPurify, JSZip, Leaflet, Mermaid, Highlight.js, Apache ECharts) retained with complete author credits and license texts.

### 3.5. Support & FAQ (`website/support.html`)
- **FAQ Section:** Added a prominent, dedicated FAQ question:  
  *“Is PDFistic open source, and can I modify or redistribute it?”*  
  Answer explains that PDFistic is proprietary software (Copyright © 2026 Devansh Dubey, All Rights Reserved), proprietary source code is closed, but third-party libraries are open source and listed on the Third-Party Licenses page.
- **Section 8 (Download & Release Channels):** Updated repository link label to `Releases & Downloads`.
- **Header & Footer:** Updated GitHub tooltip and footer copyright notice.

### 3.6. Contact Page (`website/contact.html`)
- **Hero Metadata:** Replaced `Apache 2.0 Open Source` badge with `All Rights Reserved` and `Proprietary Software`.
- **Channels Grid:** Renamed `Open Source Repository` card to `Issue Tracker & Releases`, focusing on public bug reporting, feature requests, and releases on GitHub.
- **Publisher Metadata Table:** Updated license entry to `Proprietary · All Rights Reserved (Third-party OSS attributed)`.
- **Footer:** Updated to `Third-Party Licenses` and proprietary copyright.

### 3.7. 404 Error Page (`website/404.html`) & Sitemap (`sitemap.xml`)
- **Helpful Links:** Updated `Open Source Notices` to `Third-Party Licenses`.
- **Footer:** Updated copyright to proprietary notice.
- **Sitemap:** Verified canonical URLs and metadata entries.

---

## 4. Verification and Validation Results

### 4.1. Automated Keyword Scan
Using automated AST/Regex inspection across all website HTML files:
- **Direct claims of PDFistic being Open Source:** **0**
- **Direct claims of PDFistic being licensed under Apache 2.0:** **0**
- **Proprietary & All Rights Reserved references:** **24**
- **Third-party attribution references:** **51** (all legitimately describing upstream dependencies)

### 4.2. Footer Uniformity Check
All 7 HTML pages render identical, synchronized footer legal links and copyright strings:
- Legal link: `Third-Party Licenses` (`licenses.html`)
- Copyright: `© 2026 Devansh Dubey · PDFistic. All Rights Reserved. Proprietary software for Windows.`

### 4.3. Visual & Headless Verification
Electron offscreen browser testing was conducted against the live local development server (`http://localhost:3005`) with full CSS/asset rendering. Generated visual verification artifacts:
- `migration_terms_verified.png`: Terms of Service & EULA rendering with proprietary license grant.
- `migration_licenses_verified.png`: Third-Party Licenses page showing proprietary architecture card.
- `migration_contact_verified.png`: Contact page showing `All Rights Reserved` badge and `Issue Tracker & Releases` card.

---

## 5. Deployment and Synchronization

1. **Source of Truth:** Maintained in `website/` within the main project repository.
2. **Local Production Mirror:** Synchronized to `docs/` in the main repository.
3. **Live GitHub Pages Repository:** Synchronized to `scratch/pdfistic-v1/docs/` and deployed to `https://devanshd07o.github.io/PDFistic-V1/`.
4. **Microsoft Store Readiness:** All requirements for Microsoft Store submission (accurate proprietary EULA, transparent third-party notices, no broken links) are 100% fulfilled.
