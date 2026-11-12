# PDFistic Website Licensing Audit Report
**Date:** November 12, 2026  
**Scope:** Full codebase audit of `website/` directory  
**Objective:** Identify every occurrence of open-source positioning, Apache 2.0 licensing, public source code claims, and contribution statements to transition the website to a Proprietary, Closed-Source, All Rights Reserved commercial model.

---

## 1. Executive Summary of Audit Findings

The website codebase contains 7 main HTML pages (`index.html`, `privacy.html`, `terms.html`, `licenses.html`, `support.html`, `contact.html`, `404.html`), plus supporting sitemap and script assets. 

Across these files, we identified **244 total occurrences** of licensing-related terms:
- **Homepage (`index.html`)**: 9 occurrences (nav link, footer copyright, GitHub repo links, footer links).
- **Privacy Policy (`privacy.html`)**: 28 occurrences (JSON-LD schemas, Section 1 claims of public source code under Apache 2.0, Section 8 audit claims, Section 11 security controls, footer copyright).
- **Terms of Service (`terms.html`)**: 28 occurrences (metadata, summary preamble claiming FOSS under Apache 2.0, Section 2 Apache 2.0 license grants, Section 10 entire agreement, footer copyright).
- **Licenses Page (`licenses.html`)**: 133 occurrences (hero title, breadcrumbs, introductory text stating the app itself is Apache 2.0 open-source, alongside legitimate third-party notices).
- **Support & FAQ (`support.html`)**: 11 occurrences (FAQ items regarding open source status, source code availability, modification rights, footer copyright).
- **Contact Page (`contact.html`)**: 21 occurrences (editorial hero tag "Apache 2.0 Open Source", repository card "Open Source Repository", publisher meta table "Apache License 2.0", footer copyright).
- **404 Page (`404.html`)**: 13 occurrences (helpful links list, footer copyright).
- **Sitemap (`sitemap.xml`)**: 1 occurrence (`licenses.html` URL entry).

---

## 2. Detailed Per-File Audit Matrix

### 2.1. `index.html` (Homepage)
| Line(s) | Category | Current Text / Markup | Required Modification |
|---|---|---|---|
| Line 108 | Navigation | `<li><a href="licenses.html">Licenses...</a></li>` | Update anchor label to `Licenses` or `Third-Party Licenses`. |
| Line 115 | Header CTA | `title="View Source on GitHub"` | Change title to `title="PDFistic on GitHub (Releases & Issues)"`. |
| Line 516, 548 | Footer Links | GitHub link and dock item | Preserve link to GitHub for release downloads & public issues; adjust tooltips if necessary. |
| Line 557 | Footer Links | `<span class="footer-link-label">Open Source Notices</span>` | Change label to `<span class="footer-link-label">Third-Party Licenses</span>`. |
| Line 572 | Footer Copyright | `&copy; 2026 PDFistic &middot; Developed by Devansh Dubey. Published under Apache 2.0 license.` | Update to: `&copy; 2026 Devansh Dubey &middot; PDFistic. All Rights Reserved. Proprietary software for Windows.` |

---

### 2.2. `privacy.html` (Privacy Policy)
| Line(s) | Category | Current Text / Markup | Required Modification |
|---|---|---|---|
| Line 119, 129 | JSON-LD Schema | `"license": "https://www.apache.org/licenses/LICENSE-2.0"` | Update to `"https://devanshd07o.github.io/PDFistic-V1/terms.html"`. |
| Line 130 | JSON-LD Schema | `"codeRepository": "https://github.com/devanshd07o/PDFistic-V1"` | Keep or point to project release repository. |
| Line 246, 253 | Nav & CTA | `Licenses` and GitHub title | Update title to Releases & Issues. |
| Line 386 | Section 1 (Scope) | *"The source code is published under the Apache License 2.0 at github.com/devanshd07o/PDFistic-V1, so every claim in this policy can be checked against the code."* | **Critical legal rewrite:** State that PDFistic is proprietary desktop software with All Rights Reserved. Incorporates open-source third-party components under permissive licenses (documented in Third-Party Licenses). Core code and branding are proprietary and closed-source. Privacy guarantees are architectural properties of local execution on the device. |
| Line 608 | Section 8 (Network) | *"or by auditing the open-source code."* | Change to *"or by inspecting runtime traffic using standard network analysis tools."* |
| Line 725 | Section 11 (Security) | *"Open source: Apache License 2.0 code is publicly auditable."* | Update to *"Third-party transparency: Core parsing engines rely on verified, battle-tested open-source libraries (PDF.js, Tesseract.js, pdf-lib) with transparent licensing, while PDFistic proprietary code enforces strict sandboxing."* |
| Line 838 | Footer Copyright | `Published under Apache 2.0 license.` | Update to `&copy; 2026 Devansh Dubey &middot; PDFistic. All Rights Reserved. Proprietary software for Windows.` |
| Line 823 | Footer Link | `Open Source Notices` | Update to `Third-Party Licenses`. |

---

### 2.3. `terms.html` (Terms of Service)
| Line(s) | Category | Current Text / Markup | Required Modification |
|---|---|---|---|
| Line 7, 14, 24 | Metadata / SEO | *"Free open source desktop document reader for Windows under Apache 2.0."* | Update to *"Terms of Service and End User License Agreement for PDFistic. Proprietary desktop document reader and editor for Windows. Copyright &copy; 2026 Devansh Dubey. All Rights Reserved."* |
| Line 176 | In Short Summary | *"PDFistic is free, open source software provided as is."* | **Critical rewrite:** State that PDFistic is proprietary desktop software provided under a personal, non-exclusive End User License Agreement (EULA). The software is closed-source; unauthorized copying, reverse engineering, redistribution, or commercial resale is prohibited. |
| Line 199–205 | Section 2 (Licensing) | *"The source code is released under the Apache License 2.0, which governs your rights to use, copy, modify, and distribute the code..."* | **Complete EULA transformation:** Replace Apache 2.0 grant with Proprietary Software License Grant (personal, non-exclusive, non-transferable), All Rights Reserved clause, restrictions against reverse engineering/redistribution, and explicit carve-out for bundled third-party open-source components. |
| Line 291 | Section 10 (Agreement) | *"together with the Privacy Policy and the Apache License 2.0, are the whole agreement..."* | Change to *"These Terms, together with the Privacy Policy and Third-Party License notices, constitute the entire agreement between you and the Developer..."* |
| Line 351, 366 | Footer | `Open Source Notices` & Apache 2.0 copyright | Update to `Third-Party Licenses` and Proprietary All Rights Reserved copyright notice. |

---

### 2.4. `licenses.html` (Third-Party Licenses & Notices)
| Line(s) | Category | Current Text / Markup | Required Modification |
|---|---|---|---|
| Line 6, 13, 23 | Metadata | `Open Source Notices &mdash; PDFistic` | Change to `Third-Party Licenses &amp; Open Source Notices &mdash; PDFistic`. |
| Line 139 | Breadcrumb | `Open Source Notices` | Change to `Third-Party Licenses`. |
| Line 141 | Eyebrow | `Legal &amp; Compliance` | Keep or refine to `Attribution &amp; Legal Notices`. |
| Line 142 | Hero Title | `Open Source Notices &amp; Third-Party Licenses` | Change to `Third-Party Licenses &amp; Acknowledgements`. |
| Line 146 | Subtitle | Implies PDFistic itself is an open-source project | **Critical rewrite:** Clearly state: *"PDFistic is proprietary software (Copyright &copy; 2026 Devansh Dubey. All Rights Reserved). We gratefully acknowledge and strictly comply with the open-source libraries and components that power our rendering, OCR, and AI features."* |
| Line 166–178 | Introduction Card | Generic open source text | Add explicit callout: **PDFistic Proprietary Architecture** (closed-source core) vs **Third-Party Open Source Components** (permissively licensed libraries preserved in full). |
| Lines 190–490 | 13 Component Cards | PDF.js, StPageFlip, pdf-lib, Tesseract.js, ePub.js, KaTeX, etc. | **MANDATORY PRESERVATION:** Preserve all 13 authentic third-party license cards, copyright notices, author attributions, and license texts without alteration. |
| Line 494 | Footer Copyright | `Published under Apache 2.0 license.` | Update to Proprietary All Rights Reserved copyright. |

---

### 2.5. `support.html` (Support & FAQ)
| Line(s) | Category | Current Text / Markup | Required Modification |
|---|---|---|---|
| Line 216–230 | FAQ Item | *"Is PDFistic open source?"* or questions on code access | Update FAQ to explicitly clarify: PDFistic is a proprietary Windows application (Copyright &copy; 2026 Devansh Dubey, All Rights Reserved). Core application source code is not publicly available. Third-party libraries used in the app are open-source and listed on the Third-Party Licenses page. |
| Line 240–250 | FAQ Item | *"Can I modify or contribute?"* | Clarify: Users can submit feedback, bug reports, and feature requests via GitHub Issues or direct email. The proprietary binaries and source code cannot be redistributed or modified. |
| Line 409, 424 | Footer | `Open Source Notices` & Apache 2.0 copyright | Update to `Third-Party Licenses` and Proprietary All Rights Reserved notice. |

---

### 2.6. `contact.html` (Contact Page)
| Line(s) | Category | Current Text / Markup | Required Modification |
|---|---|---|---|
| Line 145 | Editorial Subtitle | *"Direct email support, public bug reporting, and open-source publisher details..."* | Change to *"Direct email support, public bug reporting, and publisher details for PDFistic on Windows."* |
| Line 151 | Editorial Meta Row | `<div class="editorial-meta-item">Apache 2.0 Open Source</div>` | Replace with `<div class="editorial-meta-item">Proprietary Software</div>` and `<div class="editorial-meta-item">All Rights Reserved</div>`. |
| Line 265 | Card Heading | `<h3>Open Source Repository</h3>` | Change to `<h3>Issue Tracker &amp; Releases</h3>`. |
| Line 267 | Card Body | *"For public bug tracking, feature requests, release notes, and source code inspection:"* | Change to *"For public issue tracking, feature requests, and release notes on GitHub:"*. |
| Line 340–341 | Publisher Table | `License: Apache License 2.0 (Open Source)` | Update to `License: Proprietary &middot; All Rights Reserved (Third-party OSS attributed)`. |
| Line 413, 428 | Footer | `Open Source Notices` & Apache 2.0 copyright | Update to `Third-Party Licenses` and Proprietary All Rights Reserved notice. |

---

### 2.7. `404.html` (Error Page)
| Line(s) | Category | Current Text / Markup | Required Modification |
|---|---|---|---|
| Line 203 | Helpful Link | `<li><a href="licenses.html">&bull; Open Source Notices</a></li>` | Update to `<li><a href="licenses.html">&bull; Third-Party Licenses</a></li>`. |
| Line 247, 262 | Footer | `Open Source Notices` & Apache 2.0 copyright | Update to `Third-Party Licenses` and Proprietary All Rights Reserved notice. |

---

## 3. GitHub Link Strategy (Phase 5 Compliance)
- **What to preserve:**
  - Issue tracker link: `https://github.com/devanshd07o/PDFistic-V1/issues` (essential for customer support, public bug reporting, and feature requests).
  - Releases link: `https://github.com/devanshd07o/PDFistic-V1/releases` (essential for offline installers and release changelog).
  - Developer GitHub profile: `https://github.com/devanshd07o`.
- **What to modify:**
  - Remove descriptions claiming the GitHub repo is for *"source code inspection"* or *"forking/contributing code"*.
  - Change navbar GitHub button title from `"View Source on GitHub"` to `"PDFistic on GitHub (Releases & Issues)"`.
  - Rebrand "Open Source Repository" card on `contact.html` to "Issue Tracker &amp; Releases".

---

## 4. Third-Party License Transparency Plan (Phase 4 Compliance)
- Maintain `licenses.html` as the dedicated third-party license registry.
- Clearly delineate between:
  1. **Proprietary Core:** PDFistic UI, reader orchestration, tab management, custom canvas overlays, settings suites, and branding (Devansh Dubey © 2026, All Rights Reserved).
  2. **Third-Party Open Source Libraries:** PDF.js (Apache 2.0), PageFlip (MIT), pdf-lib (MIT), Tesseract.js (Apache 2.0), ePub.js (BSD-2), KaTeX (MIT), Mermaid (MIT), ECharts (Apache 2.0), Leaflet (BSD-2), Highlight.js (BSD-3), Electron/Chromium (MIT/BSD), React (MIT), SignaturePad (MIT).
- All third-party copyright notices, licenses, and links are 100% retained.

---

## 5. Execution Roadmap
1. Update `index.html` (nav, footer copyright, links).
2. Update `privacy.html` (Section 1, Section 8, Section 11, JSON-LD, footer).
3. Update `terms.html` (Preamble, Section 2 EULA terms, Section 10, metadata, footer).
4. Update `licenses.html` (Header, intro proprietary card, retain third-party cards, footer).
5. Update `support.html` (FAQ entries regarding licensing and ownership, footer).
6. Update `contact.html` (Hero badges, publisher table, repository card, footer).
7. Update `404.html` (Helpful links, footer).
8. Automated re-audit and verification across all files.
9. Generate `WEBSITE_LICENSING_MIGRATION_REPORT.md`.
10. Deploy and verify live site.
