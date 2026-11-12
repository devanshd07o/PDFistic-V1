# Security Policy

## Supported Versions

Security updates and critical patches are actively provided for the following releases of PDFistic:

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| < 2.0   | :x:                |

---

## Reporting a Vulnerability

The developer takes the security and privacy of PDFistic users very seriously. Because PDFistic operates strictly on local devices without developer-operated servers or telemetry infrastructure, the security boundary centers on:
1. Safe handling and parsing of untrusted PDF/EPUB documents (preventing memory corruption or arbitrary code execution).
2. Proper cryptographic isolation of sensitive credentials (API keys and sync tokens) using Windows DPAPI via Electron `safeStorage`.
3. Strict IPC sandboxing and Context Isolation between renderer and main processes.

### How to Report

If you discover a security vulnerability or potential privacy leak in PDFistic:

1. **Do not create a public GitHub issue.**
2. Send a detailed report via encrypted or direct email to **devanshd07o@gmail.com** with the subject line:  
   `[SECURITY] PDFistic Vulnerability Report - <Brief Description>`
3. Please include:
   - Application version (e.g., 2.0.0)
   - Windows build (e.g., Windows 11 Build 22631)
   - Detailed step-by-step reproduction instructions or a minimal proof of concept (PoC)
   - Potential impact of the issue

### Response Timeline

- **Initial Acknowledgement:** Within 48 hours of receipt.
- **Triage & Remediation Plan:** Within 5 business days.
- **Fix & Release:** A patched release will be published through the Microsoft Store and GitHub Releases upon verification.

We appreciate the responsible disclosure efforts of the security research community.
