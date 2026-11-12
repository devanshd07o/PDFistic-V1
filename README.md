<div align="center">

  <img src="assets/logo.png" alt="PDFistic Icon" width="84" height="84" />

  # PDFistic

  **Every book. Every PDF. One calm, distraction-free place to read and work on Windows.**

  <p>
    <a href="https://apps.microsoft.com/detail/9PMCFQL187MN?hl=en-us&gl=IN&ocid=pdpshare"><img src="https://img.shields.io/badge/Microsoft_Store-Download_Now-990302?style=for-the-badge&logo=windows&logoColor=white" alt="Download on Microsoft Store" /></a>
    <a href="https://devanshd07o.github.io/PDFistic-V1/"><img src="https://img.shields.io/badge/Website-Live_Preview-1c1f24?style=for-the-badge" alt="Official Website" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-Proprietary-990302?style=for-the-badge" alt="Proprietary License" /></a>
    <a href="#privacy--local-storage"><img src="https://img.shields.io/badge/Privacy-100%25_Local-1c1f24?style=for-the-badge" alt="100% Local Privacy" /></a>
  </p>

  <p>
    <a href="#overview">Overview</a> &middot;
    <a href="#key-features">Key Features</a> &middot;
    <a href="#visual-feature-tour">Visual Tour</a> &middot;
    <a href="#privacy--local-storage">Privacy Architecture</a> &middot;
    <a href="#store-details">Store Details</a> &middot;
    <a href="#licensing--intellectual-property">Licensing</a> &middot;
    <a href="#issues--support">Support &amp; Issues</a>
  </p>

</div>

---

<div align="center">
  <img src="assets/home_library.png" alt="PDFistic Home Library and PDF Tools Hub" width="94%" />
  <p><em>Offline library shelf with pinned and recent PDFs &amp; EPUBs, multi-tab reading workspace, and local PDF Tools Hub.</em></p>
</div>

---

## Overview

**PDFistic** is a modern, high-performance desktop document reader and editor built specifically for **Windows 10 and Windows 11**. Engineered for readers, researchers, students, and professionals who demand a focused workspace without visual clutter, cloud subscriptions, or intrusive telemetry.

PDFistic pairs realistic 3D book-like page flipping, fluent side-by-side document comparison, freehand annotations, and offline PDF utilities with an optional Bring-Your-Own-Key AI reading companion (**Zernexa**). Every document, note, and credential stays strictly on your computer.

---

## Key Features

- **Dual-Page Book Flip & Continuous Flow:** Read naturally with realistic 3D two-page book spreads with authentic paper physics, or switch to continuous vertical/horizontal scroll with thumbnail navigation, outlines, and instant search.
- **Side-by-Side Dual Pane Split View:** Open two documents (or two sections of the same book) simultaneously in independent panes to cross-reference citations, verify contracts, or compare study notes.
- **Full Annotations, Freehand Pen & Signatures:** Highlight text in custom palettes, sketch with stylus/pen tools, pin persistent margin notes, fill standard interactive PDF forms, and place digital signatures.
- **Built-in Local PDF Tools Hub:** Merge multiple files, split pages, rotate, reorder, watermark, stamp pages, extract scanned text via offline OCR (`Tesseract.js`), and convert image batches to PDF directly on your CPU/GPU.
- **Zernexa AI Copilot (Optional BYOK):** Ask questions, generate chapter summaries, or analyze dense technical material with clickable page citations (`[p.N]`), rendered KaTeX mathematical formulas, and voice input. Bring your own API key (Google Gemini, OpenAI, Anthropic Claude, Groq Cloud, OpenRouter) or connect a local offline **Ollama** model.
- **Curated Themes & Typography:** Switch between Light, Dark, Sepia, and Custom palettes; choose dedicated UI and reading fonts; and adjust zoom, line-height, and margins for comfortable long-form reading.

---

## Visual Feature Tour

### 1. Side-by-Side Document Comparison
<div align="center">
  <img src="assets/split_view.png" alt="PDFistic Dual-Pane Split View" width="92%" />
  <p><em>Independent dual-pane viewer for effortless side-by-side study and document verification.</em></p>
</div>

### 2. Docked AI Reading Companion with Clickable Citations
<div align="center">
  <img src="assets/ai_copilot.png" alt="Zernexa AI Study Assistant with Page Citations" width="92%" />
  <p><em>Zernexa AI study assistant delivering grounded explanations with direct clickable page references.</em></p>
</div>

### 3. Curated Appearance Themes & Typography Settings
<div align="center">
  <img src="assets/settings_suite.png" alt="PDFistic Appearance and Font Settings" width="92%" />
  <p><em>Deep personalization with custom color palettes, font selectors, and document engine tuning.</em></p>
</div>

### 4. Realistic 3D Dual-Page Book View
<div align="center">
  <img src="assets/book_flip.png" alt="PDFistic Realistic Dual-Page Book Turn" width="92%" />
  <p><em>Authentic book-like page flipping for an immersive, distraction-free reading experience.</em></p>
</div>

---

## Privacy & Local Storage

PDFistic is architected from the ground up around **data sovereignty** and local execution:

- **Zero Developer Telemetry:** The developer operates no telemetry servers, no user tracking databases, and no analytics SDKs. What you read is strictly your business.
- **Offline-First Document Processing:** PDFs, EPUBs, highlights, annotations, signatures, and local vector indices are processed locally on your machine.
- **Hardware-Level Key Encryption:** Optional AI API keys and Google Drive sync tokens are encrypted using Windows DPAPI via Electron `safeStorage`, tied directly to your Windows user account.
- **Direct Provider Connection:** When using Zernexa, your machine connects directly to the AI endpoint you configure (e.g. Gemini, OpenAI, Claude, or local Ollama). No middleman server or proxy exists.

---

## Store Details & Requirements

<div align="center">
  <img src="assets/store_developer_info.png" alt="Microsoft Store Listing Information" width="88%" />
</div>

- **Distribution Channel:** [Microsoft Store (Windows 10 & 11)](https://apps.microsoft.com/detail/9PMCFQL187MN?hl=en-us&gl=IN&ocid=pdpshare)
- **Store Product ID:** `9PMCFQL187MN`
- **Current Version:** `2.0.0`
- **Supported Platforms:** Windows 10 (Version 19041.0 or higher) and Windows 11 (x64 / ARM64)
- **Category:** Productivity / Books & Reference

---

## Licensing & Intellectual Property

PDFistic is commercial, proprietary desktop software authored by **Devansh Dubey**.

- **Proprietary Core:** The original application source code, desktop shell, user interface designs, custom icons, algorithms, and branding are proprietary and confidential intellectual property of Devansh Dubey. All Rights Reserved.
- **End User License:** Distributed under the [PDFistic Software License Agreement](LICENSE) and [End User License Agreement (EULA)](EULA.md). Unauthorized copying, decompilation, reverse engineering, redistribution, or resale is prohibited.
- **Third-Party Open-Source Attribution:** PDFistic incorporates and gratefully acknowledges permissively licensed third-party open-source components (including Mozilla PDF.js, Tesseract.js, pdf-lib, KaTeX, ePub.js, and others). All upstream authors retain their original copyrights. Complete license texts and legal notices are detailed in [THIRD_PARTY_NOTICES.txt](THIRD_PARTY_NOTICES.txt) and on our online [Third-Party Licenses](https://devanshd07o.github.io/PDFistic-V1/licenses.html) directory.

---

## Issues & Support

We welcome feedback, bug reports, and feature suggestions from our users:

- **Issue Tracker:** Report bugs or suggest enhancements via [GitHub Issues](https://github.com/devanshd07o/PDFistic-V1/issues).
- **Security Vulnerabilities:** To report a potential security issue privately, please consult our [Security Policy](SECURITY.md) or email `devanshd07o@gmail.com`.
- **Official Support Portal:** [https://devanshd07o.github.io/PDFistic-V1/support.html](https://devanshd07o.github.io/PDFistic-V1/support.html)
- **Direct Email Support:** `devanshd07o@gmail.com`

---

## Links & Resources

- **Official Website:** [https://devanshd07o.github.io/PDFistic-V1/](https://devanshd07o.github.io/PDFistic-V1/)
- **Privacy Policy:** [https://devanshd07o.github.io/PDFistic-V1/privacy.html](https://devanshd07o.github.io/PDFistic-V1/privacy.html)
- **Terms of Service & EULA:** [https://devanshd07o.github.io/PDFistic-V1/terms.html](https://devanshd07o.github.io/PDFistic-V1/terms.html)
- **Third-Party Licenses:** [https://devanshd07o.github.io/PDFistic-V1/licenses.html](https://devanshd07o.github.io/PDFistic-V1/licenses.html)
- **LinkedIn:** [Devansh Dubey](https://www.linkedin.com/in/devansh-dubey-aa802b305/)

---

<div align="center">
  <sub>Developed by <strong>Devansh Dubey</strong> &middot; Copyright &copy; 2026 Devansh Dubey. All Rights Reserved.</sub>
</div>
