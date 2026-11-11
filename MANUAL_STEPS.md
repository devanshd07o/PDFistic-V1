# 📋 Manual Action Steps for Owner (`PDFistic`)

This document lists non-code action items and external credentials needed to finalize the production launch of **PDFistic**.

---

## 1. Google Analytics 4 (GA4) Property Setup
1. Go to [analytics.google.com](https://analytics.google.com/) and sign in with your Google account (`devanshd07o@gmail.com`).
2. Click **Admin** (gear icon) &rarr; **Create Property**.
3. Set Property Name to `PDFistic Landing Website` and select your reporting timezone & currency.
4. In Data Streams, choose **Web** and enter:
   - **Website URL**: `https://devanshd07o.github.io/PDFistic-V1/`
   - **Stream Name**: `PDFistic Production Web`
5. Copy your **Measurement ID** (formatted as `G-XXXXXXXXXX`).
6. In Batch 4, this ID will be activated in `index.html` and subpages.

---

## 2. Google Search Console & Sitemap Submission
1. Go to [search.google.com/search-console](https://search.google.com/search-console).
2. Choose **URL prefix** property and enter:
   `https://devanshd07o.github.io/PDFistic-V1/`
3. Under verification methods, select **HTML tag**:
   - Copy the verification token from `<meta name="google-site-verification" content="TOKEN_HERE">`.
4. Once verified, open the left sidebar &rarr; **Sitemaps**.
5. Under "Add a new sitemap", enter:
   `sitemap.xml`
   (Full URL: `https://devanshd07o.github.io/PDFistic-V1/sitemap.xml`)
6. Click **Submit**. Google will crawl all 6 canonical URLs.

---

## 3. FormSubmit.co Contact Activation
1. When a user submits the contact form at `contact.html` for the first time, FormSubmit sends an automated confirmation email to `devanshd07o@gmail.com`.
2. Subject line: *Action Required: Confirm your email address*.
3. Click the **Activate Form** link inside the email.
4. From then on, messages submitted via the contact form are delivered straight to your inbox without opening an external mail app.

---

## 4. Custom Domain Configuration (Optional)
If you decide to connect a custom root domain (e.g. `pdfistic.com`):
1. In your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.), create:
   - **A Records** pointing to GitHub Pages IPs:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - **CNAME Record**: `www` pointing to `devanshd07o.github.io.`
2. Go to GitHub repo `devanshd07o/PDFistic-V1` &rarr; **Settings** &rarr; **Pages**.
3. Under **Custom domain**, enter your domain and check **Enforce HTTPS**.
