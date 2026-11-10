/**
 * PDFistic Interactive Desktop Demo (website/demo.js)
 * Curated 6-page 3D Book Page-Turn + Reader Showcase (3 PDFs + 1 EPUB).
 * Adapted from real PDFistic sources: PdfBookViewer.jsx (StPageFlip 3D curl),
 * EpubViewer.jsx, RecentFilesView.jsx, Titlebar.jsx, TabBar.jsx, HomeToolsGrid.jsx.
 * Icons sourced from D:\LetsCode\UI_COMPONENTS\lucide (ISC License).
 */
(function () {
  'use strict';

  var STORE_URL = 'https://apps.microsoft.com/detail/9PMCFQL187MN?hl=en-us&gl=IN&ocid=pdpshare';

  var ICONS = {
    plus: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    settings: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></svg>',
    square: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/></svg>',
    restore: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" x2="21" y1="10" y2="3"/><line x1="3" x2="10" y1="21" y2="14"/></svg>',
    expandWide: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/></svg>',
    collapseWide: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" x2="21" y1="10" y2="3"/><line x1="3" x2="10" y1="21" y2="14"/></svg>',
    upload: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="m17 8-5-5-5 5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/></svg>',
    fileText: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/><path d="M14 2v5a1 1 0 0 0 1 1h5"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>',
    wrench: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z"/></svg>',
    search: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>',
    grid: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>',
    list: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 5h.01"/><path d="M3 12h.01"/><path d="M3 19h.01"/><path d="M8 5h13"/><path d="M8 12h13"/><path d="M8 19h13"/></svg>',
    trash: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
    book: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v16"/><path d="M20.001 19A2 2 0 0 0 22 17V5a2 2 0 0 0-1.999-2L16 3.002A5 5 0 0 0 12 5a5 5 0 0 0-4-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 1.999 2H8a5 5 0 0 1 4 2 5 5 0 0 1 4-2z"/></svg>',
    scroll: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8"/><path d="M8 11h8"/><path d="M8 15h5"/></svg>',
    highlighter: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>',
    pen: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    cursor: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 4 7.07 17 2.51-7.39L21 11.07z"/></svg>',
    hand: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>',
    undo: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>',
    rotate: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>',
    bookmark: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>',
    star: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    splitCols: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 3v18"/></svg>',
    sparkles: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg>',
    left: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
    right: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
    zoomIn: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/></svg>',
    zoomOut: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="8" x2="14" y1="11" y2="11"/></svg>',
    moon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>',
    sun: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>',
    shield: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>',
    palette: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/></svg>',
    info: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
    monitor: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>',
    send: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>',
    home: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
    sidebar: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/></svg>',
    first: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg>',
    last: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/></svg>',
    fitW: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="7 9 3 12 7 15"/><polyline points="17 9 21 12 17 15"/><line x1="3" y1="12" x2="21" y2="12"/></svg>',
    fitH: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 7 12 3 15 7"/><polyline points="9 17 12 21 15 17"/><line x1="12" y1="3" x2="12" y2="21"/></svg>',
    redo: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>',
    eraser: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>',
    note: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z"/><path d="M15 3v4a2 2 0 0 0 2 2h4"/></svg>',
    shapes: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="10" height="10" rx="2"/><circle cx="15.5" cy="15.5" r="5.5"/></svg>',
    ocr: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 8h10"/><path d="M12 8v8"/></svg>',
    sign: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 20H4"/><path d="m14 6 4 4-8 8H6v-4Z"/></svg>',
    save: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',
    up: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 15-6-6-6 6"/></svg>',
    down: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
    toolMerge: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><line x1="12" y1="9" x2="12" y2="15"/><line x1="9" y1="12" x2="15" y2="12"/></svg>',
    toolSplit: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>',
    toolCompress: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>',
    toolReorder: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>',
    toolConvert: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
    arrowUp: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>',
    mic: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>',
    moreDots: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="5" cy="12" r="2"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>'
  };

  // Curated 4-Document Demo Library: 3 rich 8-page PDFs + 1 rich 8-chapter EPUB (simple everyday English)
  var SAMPLE_DOCS = [
    {
      id: 'sample-1',
      format: 'pdf',
      title: 'The Art of Deep Reading',
      fileName: '01_The_Art_of_Deep_Reading.pdf',
      url: 'assets/demo-pdfs/01_The_Art_of_Deep_Reading.pdf',
      timeLabel: 'Just now',
      pages: 8,
      tag: 'PDF',
      pinned: true,
      coverClass: 'cover-editorial',
      coverEyebrow: 'STUDY & FOCUS',
      coverHeadline: 'THE ART OF DEEP READING',
      coverSub: 'Page-turn memory, notes & focus',
      coverArtSvg: ''
    },
    {
      id: 'sample-4',
      format: 'epub',
      title: 'Everyday Focus (Book)',
      fileName: '04_Everyday_Focus_Book.epub',
      url: 'assets/demo-pdfs/04_Everyday_Focus_Book.epub',
      timeLabel: '1h ago',
      pages: 8,
      tag: 'EPUB',
      pinned: false,
      coverClass: 'cover-epub',
      coverEyebrow: 'EPUB EDITION',
      coverHeadline: 'EVERYDAY FOCUS',
      coverSub: 'Short chapters on calm thinking',
      coverArtSvg: ''
    },
    {
      id: 'sample-2',
      format: 'pdf',
      title: 'Visual Graph Study Notes',
      fileName: '02_Visual_Graph_Study_Notes.pdf',
      url: 'assets/demo-pdfs/02_Visual_Graph_Study_Notes.pdf',
      timeLabel: '3h ago',
      pages: 8,
      tag: 'PDF',
      pinned: false,
      coverClass: 'cover-diagram',
      coverEyebrow: 'CS NOTES',
      coverHeadline: 'GRAPH TRAVERSAL',
      coverSub: 'BFS, DFS & shortest path maps',
      coverArtSvg: '<svg class="pd-cover-graph-svg" viewBox="0 0 140 62" fill="none" aria-hidden="true"><line x1="22" y1="30" x2="54" y2="14" stroke="#64748b" stroke-width="1.5"/><line x1="22" y1="30" x2="54" y2="48" stroke="#64748b" stroke-width="1.5"/><line x1="54" y1="14" x2="90" y2="14" stroke="#2563eb" stroke-width="1.8"/><line x1="54" y1="48" x2="90" y2="48" stroke="#64748b" stroke-width="1.5"/><line x1="90" y1="14" x2="118" y2="30" stroke="#2563eb" stroke-width="1.8"/><line x1="90" y1="48" x2="118" y2="30" stroke="#64748b" stroke-width="1.5"/><circle cx="22" cy="30" r="6" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/><circle cx="54" cy="14" r="6" fill="#2563eb" stroke="#0f172a" stroke-width="1.6"/><circle cx="54" cy="48" r="6" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/><circle cx="90" cy="14" r="6" fill="#2563eb" stroke="#0f172a" stroke-width="1.6"/><circle cx="90" cy="48" r="6" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/><circle cx="118" cy="30" r="6" fill="#facc15" stroke="#0f172a" stroke-width="1.8"/></svg>'
    },
    {
      id: 'sample-3',
      format: 'pdf',
      title: 'Modern UI & Grid Systems',
      fileName: '03_Modern_UI_Design_Handbook.pdf',
      url: 'assets/demo-pdfs/03_Modern_UI_Design_Handbook.pdf',
      timeLabel: '5h ago',
      pages: 8,
      tag: 'PDF',
      pinned: false,
      coverClass: 'cover-amber',
      coverEyebrow: 'DESIGN EDITION',
      coverHeadline: 'MODERN UI & GRIDS',
      coverSub: '8px spacing, contrast & scale',
      coverArtSvg: ''
    }
  ];

  // Authentic 5 PDF Tools Hub Cards from HomeToolsGrid.jsx ("Only for Demo" preview overlay on click)
  var TOOL_CARDS = [
    {
      id: 'merge',
      badge: 'Popular',
      accent: '#0284c7',
      iconKey: 'toolMerge',
      title: 'Merge PDFs',
      desc: 'Combine multiple PDF files into one unified document with custom ordering.',
      continueReason: 'Merge PDFs — Desktop Organizer'
    },
    {
      id: 'split',
      badge: 'Essential',
      accent: '#e11d48',
      iconKey: 'toolSplit',
      title: 'Split PDF',
      desc: 'Extract individual pages or custom page ranges into lightweight separate PDFs.',
      continueReason: 'Split PDF — Range Extractor'
    },
    {
      id: 'compress',
      badge: 'Optimizer',
      accent: '#059669',
      iconKey: 'toolCompress',
      title: 'Compress PDF',
      desc: 'Reduce file size and optimize PDF streams for fast sharing and archiving.',
      continueReason: 'Compress PDF — Offline Optimizer'
    },
    {
      id: 'reorder',
      badge: 'Organizer',
      accent: '#9333ea',
      iconKey: 'toolReorder',
      title: 'Reorder & Rotate Pages',
      desc: 'Visual drag-and-drop page manager to rearrange, rotate, or delete pages.',
      continueReason: 'Visual Page Organizer'
    },
    {
      id: 'convert',
      badge: 'Media',
      accent: '#d97706',
      iconKey: 'toolConvert',
      title: 'PDF to PNG / Extract Images',
      desc: 'Render crisp high-resolution PNG or JPEG images directly on your PC.',
      continueReason: 'PDF to High-DPI Images & OCR'
    }
  ];

  var loadedClassicScripts = {};
  function resolveWebsiteUrl(relPath) {
    try { return new URL(relPath, window.location.href).href; } catch { return relPath; }
  }
  function loadClassicScript(relPath) {
    if (loadedClassicScripts[relPath]) return loadedClassicScripts[relPath];
    loadedClassicScripts[relPath] = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = resolveWebsiteUrl(relPath);
      s.async = false;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('Could not load script: ' + relPath)); };
      (document.head || document.documentElement).appendChild(s);
    });
    return loadedClassicScripts[relPath];
  }

  var ASSET_VER = '20261110d';
  var pdfjsPromise = null;
  function loadPdfJs() {
    if (!pdfjsPromise) {
      pdfjsPromise = (async function () {
        if (!globalThis.pdfjsLib) {
          await loadClassicScript('vendor/pdfjs/pdf.classic.min.js?v=' + ASSET_VER);
        }
        var lib = globalThis.pdfjsLib;
        if (!lib) throw new Error('PDF viewer engine unavailable.');
        if (!(globalThis.pdfjsWorker && globalThis.pdfjsWorker.WorkerMessageHandler)) {
          await loadClassicScript('vendor/pdfjs/pdf.worker.classic.min.js?v=' + ASSET_VER);
        }
        lib.GlobalWorkerOptions.workerSrc = resolveWebsiteUrl('vendor/pdfjs/pdf.worker.classic.min.js?v=' + ASSET_VER);
        return lib;
      })();
    }
    return pdfjsPromise;
  }

  var pageFlipPromise = null;
  function loadPageFlip() {
    if (!pageFlipPromise) {
      pageFlipPromise = (async function () {
        if (!(globalThis.St && globalThis.St.PageFlip)) {
          await loadClassicScript('vendor/page-flip/page-flip.browser.js?v=' + ASSET_VER);
        }
        return (globalThis.St && globalThis.St.PageFlip) || null;
      })();
    }
    return pageFlipPromise;
  }

  function decodeBase64ToBytes(b64) {
    var bin = atob(b64);
    var arr = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return arr;
  }

  async function fetchDemoBytes(relUrl) {
    if (window.location.protocol !== 'file:') {
      try {
        var res = await fetch(resolveWebsiteUrl(relUrl + '?v=' + ASSET_VER));
        if (res.ok) return new Uint8Array(await res.arrayBuffer());
      } catch {}
    }
    if (!globalThis.__PDFISTIC_DEMO_ASSETS__) {
      await loadClassicScript('assets/demo-pdfs/demo-docs-bundle.js?v=' + ASSET_VER);
    }
    var map = globalThis.__PDFISTIC_DEMO_ASSETS__ || {};
    var b64 = map[relUrl];
    if (!b64) throw new Error('Sample file not found: ' + relUrl);
    return decodeBase64ToBytes(b64);
  }

  // Zero-dependency stored-ZIP extractor for 04_Everyday_Focus_Book.epub
  function parseStoredZipEpub(buffer) {
    var bytes = new Uint8Array(buffer);
    var view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    var dec = new TextDecoder('utf-8');
    var entries = {};
    var i = 0;
    while (i + 30 < bytes.length) {
      if (view.getUint32(i, true) !== 0x04034b50) break;
      var compSize = view.getUint32(i + 18, true);
      var nameLen = view.getUint16(i + 26, true);
      var extraLen = view.getUint16(i + 28, true);
      var name = dec.decode(bytes.subarray(i + 30, i + 30 + nameLen));
      var dataStart = i + 30 + nameLen + extraLen;
      var dataEnd = dataStart + compSize;
      entries[name] = dec.decode(bytes.subarray(dataStart, dataEnd));
      i = dataEnd;
    }
    var pages = [];
    var parser = new DOMParser();
    for (var p = 1; p <= 24; p++) {
      var xhtml = entries['OEBPS/p' + p + '.xhtml'];
      if (!xhtml) break;
      var doc = parser.parseFromString(xhtml, 'application/xhtml+xml');
      if (!doc || doc.querySelector('parsererror') || !doc.querySelector('body')) {
        doc = parser.parseFromString(xhtml, 'text/html');
      }
      var body = doc.querySelector('body');
      var html = body && body.innerHTML.trim() ? body.innerHTML : '<p>Chapter ' + p + '</p>';
      var plain = body ? (body.textContent || '').replace(/\s+/g, ' ').trim() : '';
      pages.push({ page: p, html: html, text: plain });
    }
    return pages;
  }

  function escHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function (m) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var root = document.getElementById('pdfDemoApp');
    var shot = document.getElementById('heroShot');
    if (!root || !shot) return;

    var activeFlipInst = null;
    var activeFlipDocKey = '';
    var pageBitmapCache = new Map();
    var resizeTimer = null;

    var state = {
      docs: SAMPLE_DOCS.map(function (d) { return Object.assign({}, d); }),
      tabs: [],
      activeTabId: 'home',
      shelfSection: 'documents',
      filter: 'recent',
      viewMode: 'grid',
      searchQuery: '',
      theme: 'light',
      settingsOpen: false,
      settingsTab: 'overview',
      continueOpen: false,
      continueFeature: '',
      expanded: false,
      homeAiOpen: false,
      homeAiMessages: [],
      aiExpanded: false,
      aiToolsOpen: false,
      aiOverflowOpen: false,
      highlightColor: 'rgba(254, 240, 138, 0.52)',
      penColor: '#dc2626',
      loadingDocId: null,
      errorMsg: '',
      activePreset: ''
    };

    function destroyBookFlip() {
      if (activeFlipInst) {
        try { activeFlipInst.destroy(); } catch {}
        activeFlipInst = null;
        activeFlipDocKey = '';
      }
    }

    function isMobilePortraitScreen() {
      return window.innerHeight > window.innerWidth && window.innerWidth < 900;
    }

    function syncOuterShowcaseControls() {
      var themeRail = document.getElementById('heroBezelThemeRail');
      var themeIdx = state.theme === 'paper' ? 1 : (state.theme === 'dark' ? 2 : 0);
      if (themeRail) themeRail.style.setProperty('--seg-idx', String(themeIdx));
      shot.querySelectorAll('[data-stage-theme]').forEach(function (btn) {
        var active = btn.getAttribute('data-stage-theme') === state.theme;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      var stageExp = document.getElementById('heroStageExpandBtn');
      if (stageExp) {
        stageExp.classList.toggle('is-active', state.expanded);
        var lbl = stageExp.querySelector('.hero-expand-label');
        if (lbl) lbl.textContent = state.expanded ? 'Exit' : 'Fullscreen';
      }
      shot.querySelectorAll('[data-demo-action]').forEach(function (btn) {
        var act = btn.getAttribute('data-demo-action');
        btn.classList.toggle('is-active', Boolean(state.activePreset && state.activePreset === act));
      });
    }

    function syncContainerState() {
      var isReading = state.activeTabId !== 'home' || state.settingsOpen || state.continueOpen;
      var rotatedLandscape = Boolean(state.expanded && isMobilePortraitScreen());
      shot.classList.toggle('is-demo-active', isReading || state.expanded);
      shot.classList.toggle('is-expanded', state.expanded);
      shot.classList.toggle('is-rotated-landscape', rotatedLandscape);
      root.setAttribute('data-demo-theme', state.theme);
      document.body.classList.toggle('pd-expanded-open', state.expanded);
      document.body.style.overflow = state.expanded ? 'hidden' : '';
      syncOuterShowcaseControls();
    }

    function setExpanded(next) {
      state.expanded = Boolean(next);
      syncContainerState();
      if (!state.expanded && document.fullscreenElement) {
        try { document.exitFullscreen(); } catch {}
      }
      render();
      if (state.activeTabId !== 'home') {
        requestAnimationFrame(function () { setTimeout(renderActiveView, 60); });
      }
    }

    function showContinueAppPrompt(featureLabel) {
      state.continueOpen = true;
      state.continueFeature = featureLabel || 'Open local PDFs & full desktop tools';
      state.settingsOpen = false;
      syncContainerState();
      render();
      if (state.activeTabId !== 'home') renderActiveView();
    }

    window.addEventListener('resize', function () {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (state.expanded) syncContainerState();
        var t = getActiveReaderTab();
        if (t) {
          activeFlipDocKey = '';
          renderActiveView();
        }
      }, 140);
    });

    function getActiveReaderTab() {
      if (state.activeTabId === 'home') return null;
      for (var i = 0; i < state.tabs.length; i++) {
        if (state.tabs[i].id === state.activeTabId) return state.tabs[i];
      }
      return null;
    }

    function updateTabFindMatches(tab) {
      var q = String(tab.findQuery || '').trim().toLowerCase();
      var matches = [];
      if (q && tab.pageTexts && tab.pageTexts.length) {
        tab.pageTexts.forEach(function (txt, idx) {
          if (txt.toLowerCase().indexOf(q) !== -1) matches.push(idx + 1);
        });
      }
      tab.findMatches = matches;
      if (matches.length && matches.indexOf(tab.page) === -1) tab.page = matches[0];
    }

    function applyTabOptions(tab, opts) {
      var isEpub = tab.doc && tab.doc.format === 'epub';
      if (isEpub) {
        tab.viewMode = 'book';
        tab.tool = (opts.tool === 'hand') ? 'hand' : 'select';
      } else {
        if (opts.viewMode) tab.viewMode = opts.viewMode;
        if (opts.tool) tab.tool = opts.tool;
        if (tab.tool === 'highlight' || tab.tool === 'pen' || tab.tool === 'eraser') tab.viewMode = 'scroll';
      }
      if (opts.openAi !== undefined) tab.aiOpen = Boolean(opts.openAi);
      if (opts.openSidebar !== undefined) tab.sidebarOpen = Boolean(opts.openSidebar);
      if (opts.seedFind) {
        tab.findQuery = opts.seedFind;
        updateTabFindMatches(tab);
      }
    }

    async function openDocTab(docId, opts) {
      opts = opts || {};
      var doc = null;
      for (var i = 0; i < state.docs.length; i++) {
        if (state.docs[i].id === docId) { doc = state.docs[i]; break; }
      }
      if (!doc) return;

      var existing = null;
      for (var j = 0; j < state.tabs.length; j++) {
        if (state.tabs[j].id === doc.id) { existing = state.tabs[j]; break; }
      }

      var isEpub = doc.format === 'epub';
      var defaultMode = isEpub ? 'book' : (opts.viewMode || (opts.tool === 'highlight' || opts.tool === 'pen' || opts.openAi ? 'scroll' : 'book'));

      if (!existing) {
        existing = {
          id: doc.id,
          doc: doc,
          page: 1,
          numPages: doc.pages || 8,
          viewMode: defaultMode,
          zoom: 1,
          rotation: 0,
          tool: isEpub ? 'select' : (opts.tool || 'select'),
          sidebarOpen: Boolean(opts.openSidebar),
          aiOpen: Boolean(opts.openAi),
          findQuery: opts.seedFind || '',
          findMatches: [],
          pdfDoc: null,
          epubPages: null,
          pageTexts: [],
          highlights: {},
          strokes: {},
          bookmarks: {},
          undoStack: [],
          redoStack: [],
          messages: []
        };
        state.tabs.push(existing);
      } else {
        applyTabOptions(existing, opts);
      }

      if (isMobilePortraitScreen() && !state.expanded) {
        state.expanded = true;
      }

      state.activeTabId = existing.id;
      state.settingsOpen = false;
      state.continueOpen = false;
      state.errorMsg = '';
      syncContainerState();
      render();

      var needsLoad = doc.format === 'epub' ? !existing.epubPages : !existing.pdfDoc;
      if (needsLoad) {
        state.loadingDocId = existing.id;
        render();
        try {
          var docBytes = await fetchDemoBytes(doc.url);
          if (doc.format === 'epub') {
            var epPages = parseStoredZipEpub(docBytes.buffer.slice(docBytes.byteOffset, docBytes.byteOffset + docBytes.byteLength));
            existing.epubPages = epPages;
            existing.numPages = epPages.length;
            existing.pageTexts = epPages.map(function (ep) { return ep.text; });
          } else {
            var pdfjs = await loadPdfJs();
            var pdfDoc;
            try {
              pdfDoc = await pdfjs.getDocument({ data: docBytes.slice() }).promise;
            } catch (workerErr) {
              if (!(globalThis.pdfjsWorker && globalThis.pdfjsWorker.WorkerMessageHandler)) {
                await loadClassicScript('vendor/pdfjs/pdf.worker.classic.min.js?v=' + ASSET_VER);
              }
              pdfDoc = await pdfjs.getDocument({ data: docBytes.slice() }).promise;
            }
            existing.pdfDoc = pdfDoc;
            existing.numPages = pdfDoc.numPages;
            doc.pages = pdfDoc.numPages;
            var texts = [];
            for (var p = 1; p <= pdfDoc.numPages; p++) {
              var pg = await pdfDoc.getPage(p);
              var tc = await pg.getTextContent();
              texts.push(tc.items.map(function (it) { return it.str; }).join(' ').replace(/\s+/g, ' ').trim());
            }
            existing.pageTexts = texts;
          }
          if (existing.findQuery) updateTabFindMatches(existing);
        } catch (err) {
          state.errorMsg = 'Could not load demo document (' + (err && err.message ? err.message : 'load error') + ').';
        } finally {
          state.loadingDocId = null;
          render();
          renderActiveView();
        }
      } else {
        renderActiveView();
      }
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (state.continueOpen) { state.continueOpen = false; syncContainerState(); render(); renderActiveView(); return; }
        if (state.settingsOpen) { state.settingsOpen = false; syncContainerState(); render(); renderActiveView(); return; }
        if (state.expanded) { setExpanded(false); return; }
      }
      var tab = getActiveReaderTab();
      if (!tab || (document.activeElement && /INPUT|TEXTAREA/.test(document.activeElement.tagName))) return;
      if (e.key === 'ArrowRight') stepPage(1);
      if (e.key === 'ArrowLeft') stepPage(-1);
    });

    function syncPageIndicatorLabels(tab) {
      var pageBadge = document.getElementById('pdDockPageLabel');
      if (pageBadge) pageBadge.textContent = getPageRangeText(tab);
      root.querySelectorAll('.pd-thumb-btn').forEach(function (tb) {
        var pn = parseInt(tb.getAttribute('data-goto-page'), 10);
        tb.classList.toggle('is-active', isPageVisibleInCurrent(tab, pn));
      });
    }

    function isPageVisibleInCurrent(tab, n) {
      if (tab.viewMode === 'book' && !isNarrowBookStage()) {
        var leftP = tab.page % 2 === 1 ? tab.page : tab.page - 1;
        return n === leftP || n === leftP + 1;
      }
      return n === tab.page;
    }

    function getPageRangeText(tab) {
      if (tab.viewMode === 'book' && !isNarrowBookStage()) {
        var leftP = tab.page % 2 === 1 ? tab.page : tab.page - 1;
        var rightP = Math.min(tab.numPages, leftP + 1);
        return (leftP === rightP ? String(leftP) : (leftP + '-' + rightP)) + ' / ' + tab.numPages;
      }
      return tab.page + ' / ' + tab.numPages;
    }

    function isNarrowBookStage() {
      var st = root.querySelector('.pd-reader-stage');
      var w = st ? st.clientWidth : root.clientWidth;
      return w < 450;
    }

    function scrollToReaderPage(pageNum) {
      var st = root.querySelector('.pd-reader-stage');
      var pgEl = root.querySelector('[data-hl-page="' + pageNum + '"]');
      if (st && pgEl) {
        st.scrollTo({ top: Math.max(0, pgEl.offsetTop - 8), behavior: 'smooth' });
      }
    }

    function stepPage(delta) {
      var tab = getActiveReaderTab();
      if (!tab) return;
      if (tab.viewMode === 'book' && activeFlipInst) {
        if (delta > 0) activeFlipInst.flipNext();
        else activeFlipInst.flipPrev();
        return;
      }
      var next = Math.max(1, Math.min(tab.numPages, tab.page + delta));
      tab.page = next;
      syncPageIndicatorLabels(tab);
      scrollToReaderPage(next);
    }

    async function answerQuestion(tab, rawQuery) {
      var q = String(rawQuery || '').trim();
      if (!q) return;
      state.aiToolsOpen = false;
      state.aiOverflowOpen = false;

      var history = tab ? (tab.messages || []).slice(-6) : (state.homeAiMessages || []).slice(-6);
      if (tab) tab.messages.push({ role: 'user', text: q });
      else state.homeAiMessages.push({ role: 'user', text: q });

      // Refresh immediately to show user's question in chat log
      var prevSt0 = root.querySelector('.pd-reader-stage');
      var savedScroll0 = prevSt0 ? prevSt0.scrollTop : 0;
      render();
      if (tab) renderActiveView();
      var nextSt0 = root.querySelector('.pd-reader-stage');
      if (nextSt0 && savedScroll0) nextSt0.scrollTop = savedScroll0;

      var rag = globalThis.PDFISTIC_ZERNEXA_RAG;
      var pageExcerpt = '';
      if (tab && tab.pageTexts && tab.pageTexts[tab.page - 1]) {
        pageExcerpt = tab.pageTexts[tab.page - 1].slice(0, 175) + (tab.pageTexts[tab.page - 1].length > 175 ? '...' : '');
      }

      var replyText = '';
      var ragCats = [];
      var suggestDownload = false;

      if (rag && typeof rag.query === 'function') {
        var demoState = tab
          ? { activeTabTitle: tab.doc.title, activeFormat: tab.doc.format, activePage: tab.page, pageExcerpt: pageExcerpt }
          : { activeTabTitle: '', activeFormat: 'home', activePage: 0, pageExcerpt: '' };
        var res = await rag.query(q, history, demoState);
        replyText = res.text;
        ragCats = res.categories || [];
        suggestDownload = Boolean(res.suggestDownload);
      } else {
        replyText = 'PDFistic unites 3D Book Turn, dedicated Book-Mode EPUB, 1-Page annotations, offline PDF Tools Hub, local OCR, and BYOK Zernexa AI on Windows 10/11.';
        suggestDownload = true;
      }

      var msgObj = {
        role: 'assistant',
        text: replyText,
        tags: ragCats,
        suggestDownload: suggestDownload,
        citePage: (tab && q.toLowerCase().indexOf('summar') !== -1) ? tab.page : null
      };

      if (tab) tab.messages.push(msgObj);
      else state.homeAiMessages.push(msgObj);

      var prevSt = root.querySelector('.pd-reader-stage');
      var savedScroll = prevSt ? prevSt.scrollTop : 0;
      render();
      if (tab) renderActiveView();
      var nextSt = root.querySelector('.pd-reader-stage');
      if (nextSt && savedScroll) nextSt.scrollTop = savedScroll;
      var log = root.querySelector('.pd-ai-log');
      if (log) log.scrollTop = log.scrollHeight;
    }

    async function paintPdfToCanvas(tab, pageNum, canvasEl, targetW, rotation) {
      if (!tab.pdfDoc || !canvasEl) return;
      var cacheKey = tab.id + '_' + pageNum + '_' + Math.round(targetW) + '_' + rotation;
      var pageAspect = (rotation === 90 || rotation === 270) ? (595 / 842) : (842 / 595);
      if (!canvasEl.style.width) {
        canvasEl.style.width = Math.round(targetW) + 'px';
        canvasEl.style.height = Math.round(targetW * pageAspect) + 'px';
      }
      var cached = pageBitmapCache.get(cacheKey);
      if (cached) {
        canvasEl.width = cached.width;
        canvasEl.height = cached.height;
        canvasEl.style.width = cached.style.width;
        canvasEl.style.height = cached.style.height;
        canvasEl.getContext('2d').drawImage(cached, 0, 0);
        return;
      }
      try {
        var pg = await tab.pdfDoc.getPage(pageNum);
        var baseVp = pg.getViewport({ scale: 1, rotation: rotation || 0 });
        var scale = Math.max(0.22, targetW / baseVp.width);
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var vp = pg.getViewport({ scale: scale, rotation: rotation || 0 });

        var off = document.createElement('canvas');
        off.width = Math.round(vp.width * dpr);
        off.height = Math.round(vp.height * dpr);
        off.style.width = Math.round(vp.width) + 'px';
        off.style.height = Math.round(vp.height) + 'px';
        var octx = off.getContext('2d', { alpha: false });
        octx.fillStyle = '#ffffff';
        octx.fillRect(0, 0, off.width, off.height);
        octx.setTransform(dpr, 0, 0, dpr, 0, 0);
        await pg.render({ canvasContext: octx, viewport: vp }).promise;

        pageBitmapCache.set(cacheKey, off);
        canvasEl.width = off.width;
        canvasEl.height = off.height;
        canvasEl.style.width = off.style.width;
        canvasEl.style.height = off.style.height;
        canvasEl.getContext('2d').drawImage(off, 0, 0);
      } catch {}
    }

    async function renderBookFlipView(tab) {
      var mount = document.getElementById('pdFlipBookMount');
      var stage = root.querySelector('.pd-reader-stage');
      if (!mount || !stage) return;

      var rotated = shot.classList.contains('is-rotated-landscape');
      var isPortraitBook = isNarrowBookStage();
      var availW = Math.max(200, stage.clientWidth - (isPortraitBook ? 20 : 32));
      var availH = Math.max(145, stage.clientHeight - (rotated ? 32 : 38));

      var aspect = 595 / 842;
      var pageW, pageH;
      if (isPortraitBook) {
        pageW = Math.min(availW, Math.floor(availH * aspect));
        pageH = Math.floor(pageW / aspect);
      } else {
        pageW = Math.min(Math.floor(availW / 2), Math.floor(availH * aspect));
        pageH = Math.floor(pageW / aspect);
      }
      pageW = Math.max(106, Math.min(pageW, 460));
      pageH = Math.max(150, Math.min(pageH, 620));

      var docKey = tab.id + '_' + pageW + 'x' + pageH + '_' + (isPortraitBook ? 'P' : 'L') + '_' + (tab.rotation || 0);
      if (activeFlipInst && activeFlipDocKey === docKey && mount.querySelector('.stf__parent')) {
        return;
      }

      destroyBookFlip();
      mount.innerHTML = '';

      var PageFlipClass = await loadPageFlip();
      if (!PageFlipClass || !document.getElementById('pdFlipBookMount')) return;

      var bookHost = document.createElement('div');
      bookHost.className = 'pd-flip-host';
      bookHost.style.width = (isPortraitBook ? pageW : pageW * 2) + 'px';
      bookHost.style.height = pageH + 'px';
      mount.appendChild(bookHost);

      var total = tab.numPages || 8;
      var effectiveTotal = total % 2 === 0 ? total : total + 1;
      var sheetNodes = [];

      for (var p = 1; p <= effectiveTotal; p++) {
        var sheet = document.createElement('div');
        sheet.className = 'pd-book-sheet ' + (p % 2 === 1 ? 'is-left' : 'is-right');
        sheet.style.width = pageW + 'px';
        sheet.style.height = pageH + 'px';

        if (p <= total) {
          if (tab.doc.format === 'epub' && tab.epubPages) {
            var ep = tab.epubPages[p - 1];
            var epBody = document.createElement('div');
            epBody.className = 'pd-epub-sheet-inner';
            epBody.innerHTML =
              '<div class="pd-epub-runhdr"><span>' + escHtml(tab.doc.title) + '</span><span>p.' + p + '</span></div>' +
              '<div class="pd-epub-flow">' + (ep ? ep.html : '') + '</div>' +
              '<div class="pd-epub-runftr">' + p + ' / ' + total + '</div>';
            sheet.appendChild(epBody);
          } else {
            var cv = document.createElement('canvas');
            cv.className = 'pd-book-page-canvas';
            sheet.appendChild(cv);
            paintPdfToCanvas(tab, p, cv, pageW, tab.rotation || 0);
          }
        }

        var crease = document.createElement('div');
        crease.className = 'pd-book-crease ' + (p % 2 === 1 ? 'crease-left' : 'crease-right');
        sheet.appendChild(crease);

        sheetNodes.push(sheet);
      }

      var rotated = shot.classList.contains('is-rotated-landscape');
      var startIdx = isPortraitBook ? Math.max(0, tab.page - 1) : Math.max(0, (tab.page % 2 === 1 ? tab.page - 1 : tab.page - 2));

      var flipInst = new PageFlipClass(bookHost, {
        width: pageW,
        height: pageH,
        size: 'fixed',
        minWidth: 160,
        maxWidth: 900,
        minHeight: 220,
        maxHeight: 1100,
        autoSize: false,
        drawShadow: true,
        maxShadowOpacity: 0.48,
        flippingTime: 540,
        showCover: false,
        usePortrait: isPortraitBook,
        mobileScrollSupport: true,
        showPageCorners: true,
        startPage: startIdx,
        clickEventForward: true,
        useMouseEvents: !rotated,
        swipeDistance: 45
      });

      flipInst.loadFromHTML(sheetNodes);
      flipInst.on('flip', function (ev) {
        tab.page = (ev.data || 0) + 1;
        syncPageIndicatorLabels(tab);
      });

      activeFlipInst = flipInst;
      activeFlipDocKey = docKey;
    }

    function renderActiveView() {
      var tab = getActiveReaderTab();
      if (!tab) { destroyBookFlip(); return; }

      // Always render thumbnail canvases in sidebar if open
      if (tab.pdfDoc) {
        root.querySelectorAll('canvas[data-thumb="1"]').forEach(function (cv) {
          var p = parseInt(cv.getAttribute('data-render-page'), 10);
          paintPdfToCanvas(tab, p, cv, 88, 0);
        });
      }

      if (tab.viewMode === 'book') {
        renderBookFlipView(tab);
      } else {
        destroyBookFlip();
        if (tab.pdfDoc) {
          var stage = root.querySelector('.pd-reader-stage');
          var stW = stage ? Math.max(260, stage.clientWidth - 40) : 520;
          var targetW = Math.min(620, stW) * (tab.zoom || 1);
          root.querySelectorAll('canvas[data-render-page]:not([data-thumb])').forEach(function (cv) {
            var p = parseInt(cv.getAttribute('data-render-page'), 10);
            paintPdfToCanvas(tab, p, cv, targetW, tab.rotation || 0);
          });
        }
      }
    }

    function buildTopChrome(activeTab) {
      var onHome = !activeTab;
      var dirtyDot = (activeTab && (Object.keys(activeTab.highlights || {}).length || Object.keys(activeTab.strokes || {}).length))
        ? '<span class="pd-unsaved-dot" title="Annotations in session"></span>' : '';
      var centerTitle = activeTab
        ? '<span class="pd-titlebar-doc">' + escHtml(activeTab.doc.fileName) + dirtyDot + '</span>'
        : '';

      var row1 = '<div class="pd-titlebar ' + (onHome ? 'on-home' : '') + '">' +
        '<div class="pd-titlebar-left">' +
          '<img src="icon.png" alt="PDFistic" class="pd-app-icon">' +
          '<span class="pd-app-name">PDFistic</span>' +
        '</div>' +
        centerTitle +
        '<div class="pd-titlebar-right">' +
          (onHome ? '<button type="button" class="pd-win-btn" id="pdHeaderSplitBtn" title="Split View" aria-label="Split View">' + ICONS.splitCols + '</button>' : '') +
          '<button type="button" class="pd-win-btn pd-avatar-btn" id="pdHeaderAiBtn" title="Showcase Overview" aria-label="Workspace overview">' +
            '<span class="pd-avatar-circle">P<span class="pd-avatar-dot" aria-hidden="true"></span></span>' +
          '</button>' +
          '<button type="button" class="pd-win-btn" id="pdSettingsBtn" title="Settings &amp; Appearance" aria-label="Settings and appearance">' + ICONS.settings + '</button>' +
          '<button type="button" class="pd-win-btn ' + (state.expanded ? 'is-fullscreen-active' : '') + '" id="pdExpandBtn" title="' + (state.expanded ? 'Exit Fullscreen (Esc)' : 'Fullscreen Preview') + '" aria-label="' + (state.expanded ? 'Exit Fullscreen' : 'Enter Fullscreen Preview') + '">' +
            (state.expanded ? ICONS.restore : ICONS.square) +
          '</button>' +
        '</div>' +
      '</div>';

      var tabsHtml = '';
      if (activeTab) {
        tabsHtml += '<button type="button" class="pd-tab pd-home-pill pd-home-icon-only" data-tab-switch="home" title="Home Library" aria-label="Back to Home Library">' +
          ICONS.home + '</button>';
      }
      state.tabs.forEach(function (t) {
        var badgeCls = t.doc.format === 'epub' ? 'pd-tab-file-badge is-epub' : 'pd-tab-file-badge';
        tabsHtml += '<div class="pd-tab-group ' + (state.activeTabId === t.id ? 'is-active' : '') + '">' +
          '<button type="button" class="pd-tab-btn" data-tab-switch="' + escHtml(t.id) + '">' +
          '<span class="' + badgeCls + '">' + escHtml(t.doc.tag) + '</span><span>' + escHtml(t.doc.title.slice(0, 18)) + '</span></button>' +
          '<button type="button" class="pd-tab-close" data-tab-close="' + escHtml(t.id) + '" aria-label="Close ' + escHtml(t.doc.title) + ' tab">' + ICONS.x + '</button>' +
          '</div>';
      });
      tabsHtml += '<button type="button" class="pd-tab-add" id="pdAddTabBtn" title="Open your own files in the Desktop App" aria-label="Open your own PDF or EPUB in the desktop app">' + ICONS.plus + '</button>';

      var rightControls = '';
      if (activeTab) {
        var isEpubTab = activeTab.doc && activeTab.doc.format === 'epub';
        rightControls = '<div class="pd-subbar-right">' +
          '<button type="button" class="pd-sub-btn ' + (state.theme === 'dark' ? 'is-active' : '') + '" id="pdToggleThemeBtn" title="Toggle Night Mode" aria-label="Toggle Light and Dark theme">' + (state.theme === 'dark' ? ICONS.sun : ICONS.moon) + '</button>' +
          '<button type="button" class="pd-sub-btn ' + (state.theme === 'paper' ? 'is-active' : '') + '" id="pdWarmPaperBtn" title="Warm Paper Eye-Comfort" aria-label="Toggle Warm Paper theme">' + ICONS.shield + '</button>' +
          (isEpubTab
            ? '<span class="pd-mode-select is-epub-locked" id="pdEpubBookBadge" title="EPUB books open exclusively in 3D Book Mode">' + ICONS.book + '<span>Book Mode</span></span>'
            : '<button type="button" class="pd-mode-select" id="pdCycleModeBtn" aria-label="Switch between 3D Book Page-Turn and 1-Page view">' +
                (activeTab.viewMode === 'book' ? ICONS.book + '<span>Book Turn</span>' : ICONS.scroll + '<span>1-Page</span>') +
              '</button>') +
          '<button type="button" class="pd-sub-btn ' + (activeTab.aiOpen ? 'is-active' : '') + '" id="pdToggleAi" title="Ask Zernexa AI" aria-label="Toggle Zernexa AI">' + ICONS.sparkles + '</button>' +
        '</div>';
      }

      var row2 = '<div class="pd-subbar ' + (onHome ? 'on-home' : '') + '">' +
        '<div class="pd-subbar-left">' +
          (activeTab ? '<button type="button" class="pd-sub-btn ' + (activeTab.sidebarOpen ? 'is-active' : '') + '" id="pdToggleSidebar" title="Pages Sidebar" aria-label="Toggle page sidebar">' + ICONS.sidebar + '</button>' : '') +
          '<div class="pd-tabs-strip">' + tabsHtml + '</div>' +
        '</div>' +
        rightControls +
      '</div>';

      return '<div class="pd-chrome-wrap ' + (onHome ? 'on-home' : '') + '">' + row1 + row2 + '</div>';
    }

    function getTimeGreeting() {
      var hr = new Date().getHours();
      if (hr >= 5 && hr < 12) return 'Good morning';
      if (hr >= 12 && hr < 17) return 'Good afternoon';
      return 'Good evening';
    }

    function buildZernexaPanelHtml(tab) {
      var msgs = tab ? (tab.messages || []) : state.homeAiMessages;
      var contextLabel = tab
        ? ICONS.fileText + '<span>' + escHtml(tab.doc.title.slice(0, 22)) + ' &bull; PDFistic RAG</span>'
        : ICONS.home + '<span>PDFistic App Expert &bull; RAG</span>';

      var inputCard = '<div class="pd-ai-composer">' +
        '<div class="pd-ai-ctx-row"><span class="pd-ai-ctx-pill">' + contextLabel + '</span></div>' +
        (state.aiToolsOpen
          ? '<div class="pd-ai-tools-popover" id="pdAiToolsPopover">' +
              '<div class="pd-ai-tools-hdr">Ask About PDFistic App</div>' +
              '<button type="button" class="pd-ai-tool-opt" data-ai-prompt="What are all features in PDFistic?"><strong>/features</strong><span>All Windows desktop features</span></button>' +
              '<button type="button" class="pd-ai-tool-opt" data-ai-prompt="Tell me about PDF Tools Hub and offline OCR"><strong>/tools</strong><span>Merge, split, compress, OCR</span></button>' +
              '<button type="button" class="pd-ai-tool-opt" data-ai-prompt="How does PDFistic keep my files and API keys private?"><strong>/privacy</strong><span>Offline storage &amp; DPAPI Vault</span></button>' +
              '<button type="button" class="pd-ai-tool-opt" data-ai-prompt="How do 3D Book Turn and EPUB Book Mode work?"><strong>/modes</strong><span>3D Book Turn &amp; EPUB Mode</span></button>' +
            '</div>'
          : '') +
        '<form class="pd-ai-card" id="pdAiForm">' +
          '<textarea class="pd-ai-textarea" id="pdAiInput" rows="' + (msgs.length === 0 ? '2' : '1') + '" placeholder="Ask Zernexa about PDFistic features..."></textarea>' +
          '<div class="pd-ai-card-bar">' +
            '<button type="button" class="pd-ai-tools-btn ' + (state.aiToolsOpen ? 'is-active' : '') + '" id="pdAiToolsBtn" title="PDFistic feature topics"><span>/</span> Tools <span class="pd-chev">' + ICONS.down + '</span></button>' +
            '<div class="pd-ai-card-actions">' +
              '<button type="button" class="pd-ai-mini-btn" id="pdAiEnhanceBtn" title="Suggest feature question" aria-label="Suggest prompt">' + ICONS.sparkles + '</button>' +
              '<button type="button" class="pd-ai-mini-btn" data-demo-only="Voice Dictation (Whisper / Windows Mic)" title="Voice Dictation (Desktop App)" aria-label="Voice dictation">' + ICONS.mic + '</button>' +
              '<button type="submit" class="pd-ai-send-circle" id="pdAiSendBtn" title="Send to Zernexa" aria-label="Send question">' + ICONS.arrowUp + '</button>' +
            '</div>' +
          '</div>' +
        '</form>' +
      '</div>';

      var bodySection = '';
      if (msgs.length === 0) {
        bodySection = '<div class="pd-ai-empty-stage">' +
          '<canvas class="pd-ai-dotwave" id="pdAiDotWave" aria-hidden="true"></canvas>' +
          '<div class="pd-ai-hero-center">' +
            '<div class="pd-ai-hero-badge"><img src="assets/zernexa.png" alt="Zernexa"></div>' +
            '<h2 class="pd-ai-hero-title">' + getTimeGreeting() + ',<br>Explorer</h2>' +
            '<p class="pd-ai-hero-sub">Ask me anything about PDFistic&rsquo;s 3D reader, EPUB Book Mode, offline PDF tools, OCR, or BYOK privacy.</p>' +
            inputCard +
          '</div>' +
        '</div>';
      } else {
        bodySection = '<div class="pd-ai-log">' + msgs.map(function (m) {
          var tagsHtml = (m.role === 'assistant' && m.tags && m.tags.length)
            ? '<div class="pd-ai-rag-tags">' + m.tags.map(function (tg) { return '<span>' + escHtml(tg) + '</span>'; }).join('') + '</div>'
            : '';
          var actionBtn = '';
          if (m.role === 'assistant' && m.citePage) {
            actionBtn = '<button type="button" class="pd-ai-cite" data-goto-page="' + m.citePage + '">Page ' + m.citePage + ' ' + ICONS.arrowRight + '</button>';
          } else if (m.role === 'assistant' && m.openDocId) {
            actionBtn = '<button type="button" class="pd-ai-cite" data-open-doc="' + escHtml(m.openDocId) + '">Open book ' + ICONS.arrowRight + '</button>';
          } else if (m.role === 'assistant' && m.suggestDownload) {
            actionBtn = '<a href="' + STORE_URL + '" class="pd-ai-cite">Get Windows App ' + ICONS.arrowRight + '</a>';
          }
          return '<div class="pd-ai-msg is-' + m.role + '">' + tagsHtml + '<span class="pd-ai-msg-text">' + escHtml(m.text) + '</span>' + actionBtn + '</div>';
        }).join('') + '</div>' +
        '<div class="pd-ai-docked-foot">' + inputCard + '</div>';
      }

      return '<aside class="pd-ai-panel ' + (state.aiExpanded ? 'is-ai-expanded' : '') + '" aria-label="Zernexa AI Panel">' +
        '<div class="pd-ai-resize-edge" title="Expandable Zernexa Copilot"></div>' +
        '<div class="pd-ai-hdr">' +
          '<div class="pd-ai-hdr-brand"><img src="assets/zernexa.png" alt="Zernexa"><span>Zernexa</span><span class="pd-ai-rag-pill">RAG</span></div>' +
          '<div class="pd-ai-hdr-actions">' +
            '<button type="button" class="pd-ai-hdr-btn" id="pdAiExpandBtn" title="' + (state.aiExpanded ? 'Dock Zernexa Side Panel' : 'Expand Zernexa Panel') + '" aria-label="' + (state.aiExpanded ? 'Dock Zernexa panel' : 'Expand Zernexa panel') + '">' + (state.aiExpanded ? ICONS.collapseWide : ICONS.expandWide) + '</button>' +
            '<button type="button" class="pd-ai-hdr-btn" id="pdAiOverflowBtn" title="Clear chat or options" aria-label="AI panel options">' + ICONS.moreDots + '</button>' +
            '<button type="button" class="pd-ai-hdr-btn" id="pdCloseAiBtn" title="Close Zernexa" aria-label="Close AI panel">' + ICONS.x + '</button>' +
          '</div>' +
        '</div>' +
        (state.aiOverflowOpen
          ? '<div class="pd-ai-overflow-menu" id="pdAiOverflowMenu">' +
              '<button type="button" id="pdAiClearChatBtn">' + ICONS.trash + '<span>Clear Conversation</span></button>' +
              '<button type="button" data-demo-only="Custom API Keys Vault (Gemini / OpenAI / Claude / Groq)">' + ICONS.shield + '<span>Bring Your Own Key (App)</span></button>' +
            '</div>'
          : '') +
        bodySection +
      '</aside>';
    }

    function buildHomeView() {
      var pinnedCount = state.docs.filter(function (d) { return d.pinned; }).length;
      var filtered = state.docs.filter(function (d) {
        if (state.filter === 'pinned' && !d.pinned) return false;
        if (state.searchQuery) {
          var q = state.searchQuery.toLowerCase();
          return d.title.toLowerCase().indexOf(q) !== -1 || d.fileName.toLowerCase().indexOf(q) !== -1;
        }
        return true;
      });

      var bodyHtml = '';
      if (state.shelfSection === 'tools') {
        bodyHtml = '<div class="pd-tools-grid">' + TOOL_CARDS.map(function (tc) {
          return '<button type="button" class="pd-tool-card" data-tool-launch="' + tc.id + '">' +
            '<div class="pd-tool-card-top">' +
              '<span class="pd-tool-icon-badge" style="color:' + tc.accent + ';background-color:' + tc.accent + '18">' + (ICONS[tc.iconKey] || ICONS.wrench) + '</span>' +
              '<span class="pd-tool-badge" style="color:' + tc.accent + ';border-color:' + tc.accent + '44">' + escHtml(tc.badge) + '</span>' +
            '</div>' +
            '<span class="pd-tool-title">' + escHtml(tc.title) + '</span>' +
            '<span class="pd-tool-desc">' + escHtml(tc.desc) + '</span>' +
            '<span class="pd-tool-cta" style="color:' + tc.accent + '">Open Tool ' + ICONS.arrowRight + '</span>' +
          '</button>';
        }).join('') + '</div>';
      } else {
        if (filtered.length === 0) {
          bodyHtml = '<div class="pd-empty-msg">No sample documents shown. <button type="button" class="pd-link-btn" id="pdRestoreSamples">Restore 4 sample books</button></div>';
        } else {
          bodyHtml = '<div class="pd-doc-grid ' + (state.viewMode === 'list' ? 'is-list' : '') + '">' +
            filtered.map(function (d) {
              return '<div class="pd-doc-card ' + (d.pinned ? 'is-pinned' : '') + '" data-open-doc="' + escHtml(d.id) + '" role="button" tabindex="0">' +
                '<div class="pd-doc-cover ' + d.coverClass + '">' +
                  '<div class="pd-cover-top-row">' +
                    '<span class="pd-cover-badge ' + (d.format === 'epub' ? 'is-epub' : '') + '">' + escHtml(d.tag) + '</span>' +
                    '<span class="pd-cover-pin-chip ' + (d.pinned ? 'is-pinned' : '') + '" role="button" tabindex="0" data-pin-doc="' + escHtml(d.id) + '" title="' + (d.pinned ? 'Unpin document' : 'Pin document') + '" aria-label="' + (d.pinned ? 'Unpin ' : 'Pin ') + escHtml(d.title) + '">' + ICONS.star + '</span>' +
                  '</div>' +
                  '<div class="pd-cover-art">' +
                    (d.coverArtSvg || '') +
                    '<span class="pd-cover-eyebrow">' + escHtml(d.coverEyebrow) + '</span>' +
                    '<strong class="pd-cover-headline">' + escHtml(d.coverHeadline) + '</strong>' +
                    '<span class="pd-cover-sub">' + escHtml(d.coverSub) + '</span>' +
                  '</div>' +
                '</div>' +
                '<div class="pd-doc-meta">' +
                  '<span class="pd-doc-name">' + escHtml(d.title) + '</span>' +
                  '<span class="pd-doc-sub">' + escHtml(d.timeLabel) + ' &bull; ' + escHtml(d.pages) + 'p</span>' +
                '</div>' +
              '</div>';
            }).join('') + '</div>';
        }
      }

      var homeMain = '<div class="pd-home">' +
        '<div class="pd-home-wallpaper" aria-hidden="true"></div>' +
        '<div class="pd-home-scrim" aria-hidden="true"></div>' +
        '<div class="pd-home-hero">' +
          '<img src="icon.png" alt="" class="pd-center-emblem">' +
          '<div class="pd-dropzone" id="pdDropzone">' +
            '<div class="pd-dz-left">' +
              '<span class="pd-dz-icon">' + ICONS.upload + '</span>' +
              '<span class="pd-dz-text">Drop PDF or EPUB e-books here or click to browse</span>' +
            '</div>' +
            '<button type="button" class="pd-open-btn" id="pdOpenDocBtn"><span class="pd-btn-face">' + ICONS.plus + '<span>Open Document</span></span></button>' +
          '</div>' +
        '</div>' +
        '<div class="pd-toolbar">' +
          '<div class="pd-toolbar-group">' +
            '<div class="pd-seg">' +
              '<button type="button" class="pd-seg-btn ' + (state.shelfSection === 'documents' ? 'is-active' : '') + '" data-shelf="documents">' + ICONS.fileText + '<span>Documents</span></button>' +
              '<button type="button" class="pd-seg-btn ' + (state.shelfSection === 'tools' ? 'is-active' : '') + '" data-shelf="tools">' + ICONS.wrench + '<span>PDF Tools Hub</span></button>' +
            '</div>' +
            (state.shelfSection === 'documents'
              ? '<div class="pd-seg">' +
                  '<button type="button" class="pd-seg-btn ' + (state.filter === 'pinned' ? 'is-active' : '') + '" data-filter="pinned">Pinned (' + pinnedCount + ')</button>' +
                  '<button type="button" class="pd-seg-btn ' + (state.filter === 'recent' ? 'is-active' : '') + '" data-filter="recent">Recent (' + state.docs.length + ')</button>' +
                '</div>'
              : '') +
            (state.shelfSection === 'documents'
              ? '<div class="pd-search-wrap">' + ICONS.search + '<input type="text" class="pd-search-input" id="pdSearchInput" placeholder="Search documents..." value="' + escHtml(state.searchQuery) + '" aria-label="Search sample documents"></div>'
              : '') +
          '</div>' +
          (state.shelfSection === 'documents'
            ? '<div class="pd-toolbar-group pd-toolbar-right">' +
                '<div class="pd-seg">' +
                  '<button type="button" class="pd-icon-toggle ' + (state.viewMode === 'grid' ? 'is-active' : '') + '" data-view="grid" aria-label="Grid view">' + ICONS.grid + '</button>' +
                  '<button type="button" class="pd-icon-toggle ' + (state.viewMode === 'list' ? 'is-active' : '') + '" data-view="list" aria-label="List view">' + ICONS.list + '</button>' +
                '</div>' +
                '<button type="button" class="pd-clear-btn" id="pdResetSamples" title="Clear or restore demo books">' + ICONS.trash + '<span>Clear History</span></button>' +
              '</div>'
            : '') +
        '</div>' +
        bodyHtml +
        (!state.homeAiOpen ? '<button type="button" class="pd-zernexa-fab" id="pdHomeZernexaBtn" title="Open Zernexa AI" aria-label="Open Zernexa AI Assistant"><img src="assets/zernexa.png" alt="Zernexa"></button>' : '') +
      '</div>';

      return '<div class="pd-home-shell">' + homeMain + (state.homeAiOpen ? buildZernexaPanelHtml(null) : '') + '</div>';
    }

    function buildReaderView(tab) {
      var isEpub = tab.doc && tab.doc.format === 'epub';
      if (isEpub) tab.viewMode = 'book';
      var loading = state.loadingDocId === tab.id || (isEpub ? !tab.epubPages : !tab.pdfDoc);
      var isBook = isEpub || tab.viewMode === 'book';
      var rangeLabel = getPageRangeText(tab);

      var sidebarHtml = tab.sidebarOpen
        ? '<aside class="pd-reader-sidebar">' +
            '<div class="pd-sidebar-hdr"><span>Pages</span><span>' + tab.numPages + '</span></div>' +
            '<div class="pd-thumb-list">' +
              Array.from({ length: tab.numPages }, function (_, i) {
                var n = i + 1;
                var isCur = isPageVisibleInCurrent(tab, n);
                var isBm = Boolean(tab.bookmarks && tab.bookmarks[n]);
                var thumbInner = tab.doc.format === 'epub'
                  ? '<div class="pd-epub-mini-thumb">p.' + n + '</div>'
                  : '<canvas data-render-page="' + n + '" data-thumb="1"></canvas>';
                return '<button type="button" class="pd-thumb-btn ' + (isCur ? 'is-active' : '') + '" data-goto-page="' + n + '">' +
                  thumbInner +
                  '<span class="pd-thumb-num">' + n + (isBm ? ' &bull; Saved' : '') + '</span>' +
                '</button>';
              }).join('') +
            '</div>' +
          '</aside>'
        : '';

      var stageHtml = '';
      var toolCls = tab.tool === 'highlight' ? 'is-hl-cursor' : (tab.tool === 'pen' ? 'is-pen-cursor' : (tab.tool === 'eraser' ? 'is-eraser-cursor' : (tab.tool === 'hand' ? 'is-hand-cursor' : '')));

      if (loading) {
        stageHtml = '<div class="pd-reader-loading">Opening "' + escHtml(tab.doc.title) + '" in browser...</div>';
      } else if (isBook) {
        stageHtml = '<div class="pd-book-wrap">' +
          '<div class="pd-flip-hint">Drag any corner, swipe, or tap arrows to flip pages</div>' +
          '<div class="pd-flip-book-mount" id="pdFlipBookMount"></div>' +
        '</div>';
      } else if (tab.doc.format === 'epub' && tab.epubPages) {
        stageHtml = '<div class="pd-pages-track">' + tab.epubPages.map(function (ep, idx) {
          var pn = idx + 1;
          var rects = (tab.highlights[pn] || []).map(function (r, ri) {
            return '<span class="pd-hl-rect" data-mark-type="hl" data-mark-page="' + pn + '" data-mark-idx="' + ri + '" style="left:' + r.x + '%;top:' + r.y + '%;width:' + r.w + '%;height:' + r.h + '%;background-color:' + (r.color || 'rgba(254,240,138,0.52)') + '"></span>';
          }).join('');
          var paths = (tab.strokes[pn] || []).map(function (stObj, si) {
            var pts = typeof stObj === 'string' ? stObj : stObj.pts;
            var clr = typeof stObj === 'string' ? '#dc2626' : (stObj.color || '#dc2626');
            return '<polyline class="pd-ink-stroke" data-mark-type="ink" data-mark-page="' + pn + '" data-mark-idx="' + si + '" style="stroke:' + clr + '" points="' + escHtml(pts) + '"/>';
          }).join('');
          var isBmEp = Boolean(tab.bookmarks && tab.bookmarks[pn]);
          return '<div class="pd-page-wrap pd-epub-single-sheet ' + toolCls + '" data-hl-page="' + pn + '">' +
            '<button type="button" class="pd-page-bookmark ' + (isBmEp ? 'is-bookmarked' : '') + '" data-bookmark-page="' + pn + '" title="Bookmark page ' + pn + '" aria-label="Bookmark page ' + pn + '">' + ICONS.bookmark + '</button>' +
            '<div class="pd-epub-sheet-inner is-single-flow">' +
              '<div class="pd-epub-runhdr"><span>' + escHtml(tab.doc.title) + '</span><span>Page ' + pn + ' of ' + tab.numPages + '</span></div>' +
              '<div class="pd-epub-flow">' + (ep ? ep.html : '') + '</div>' +
            '</div>' +
            '<div class="pd-hl-layer">' + rects + '</div>' +
            '<svg class="pd-ink-layer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' + paths + '</svg>' +
          '</div>';
        }).join('') + '</div>';
      } else {
        stageHtml = '<div class="pd-pages-track">' + Array.from({ length: tab.numPages }, function (_, idx) {
          var pn = idx + 1;
          var rects = (tab.highlights[pn] || []).map(function (r, ri) {
            return '<span class="pd-hl-rect" data-mark-type="hl" data-mark-page="' + pn + '" data-mark-idx="' + ri + '" style="left:' + r.x + '%;top:' + r.y + '%;width:' + r.w + '%;height:' + r.h + '%;background-color:' + (r.color || 'rgba(254,240,138,0.52)') + '"></span>';
          }).join('');
          var paths = (tab.strokes[pn] || []).map(function (stObj, si) {
            var pts = typeof stObj === 'string' ? stObj : stObj.pts;
            var clr = typeof stObj === 'string' ? '#dc2626' : (stObj.color || '#dc2626');
            return '<polyline class="pd-ink-stroke" data-mark-type="ink" data-mark-page="' + pn + '" data-mark-idx="' + si + '" style="stroke:' + clr + '" points="' + escHtml(pts) + '"/>';
          }).join('');
          var isBm = Boolean(tab.bookmarks && tab.bookmarks[pn]);
          return '<div class="pd-page-wrap ' + toolCls + '" data-hl-page="' + pn + '">' +
            '<button type="button" class="pd-page-bookmark ' + (isBm ? 'is-bookmarked' : '') + '" data-bookmark-page="' + pn + '" title="Bookmark page ' + pn + '" aria-label="Bookmark page ' + pn + '">' + ICONS.bookmark + '</button>' +
            '<canvas data-render-page="' + pn + '"></canvas>' +
            '<div class="pd-hl-layer">' + rects + '</div>' +
            '<svg class="pd-ink-layer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' + paths + '</svg>' +
          '</div>';
        }).join('') + '</div>';
      }

      var aiHtml = tab.aiOpen ? buildZernexaPanelHtml(tab) : '';

      var canUndo = tab.undoStack && tab.undoStack.length > 0;
      var canRedo = tab.redoStack && tab.redoStack.length > 0;
      var hasMarkups = Boolean(Object.keys(tab.highlights || {}).length || Object.keys(tab.strokes || {}).length);

      var dockMiddleHtml = '';
      if (isEpub) {
        dockMiddleHtml =
          '<button type="button" class="pd-dock-btn ' + (tab.tool === 'select' ? 'is-active' : '') + '" data-reader-tool="select" data-tool-tone="select" title="Select Text" aria-label="Cursor select tool">' + ICONS.cursor + '</button>' +
          '<button type="button" class="pd-dock-btn ' + (tab.tool === 'hand' ? 'is-active' : '') + '" data-reader-tool="hand" data-tool-tone="hand" title="Hand Pan Tool" aria-label="Hand pan tool">' + ICONS.hand + '</button>' +
          '<span class="pd-dock-sep"></span>' +
          '<div class="pd-find-inline">' + ICONS.search + '<input type="text" id="pdFindInput" class="pd-find-input" placeholder="Find in book..." value="' + escHtml(tab.findQuery) + '" aria-label="Find in book">' +
            (tab.findQuery ? '<span class="pd-find-count">' + tab.findMatches.length + '</span>' : '') +
            '<button type="button" class="pd-find-step-btn" id="pdFindPrev" title="Previous match" aria-label="Previous search match">' + ICONS.up + '</button>' +
            '<button type="button" class="pd-find-step-btn" id="pdFindNext" title="Next match" aria-label="Next search match">' + ICONS.down + '</button>' +
          '</div>' +
          '<span class="pd-dock-sep pd-dock-hide-compact"></span>' +
          '<button type="button" class="pd-dock-btn pd-dock-hide-compact" data-demo-only="Floating Sticky Notes" title="Sticky Note (Full Windows App)" aria-label="Sticky notes tool">' + ICONS.note + '</button>' +
          '<button type="button" class="pd-dock-btn pd-dock-hide-compact" data-demo-only="Save &amp; Export EPUB Notes" title="Save Notes (Full Windows App)" aria-label="Save notes">' + ICONS.save + '</button>';
      } else {
        dockMiddleHtml =
          '<button type="button" class="pd-dock-btn pd-dock-hide-compact" id="pdZoomOut" title="Zoom Out" aria-label="Zoom out">' + ICONS.zoomOut + '</button>' +
          '<button type="button" class="pd-dock-zoom-btn" id="pdZoomReset" title="Reset 100%" aria-label="Reset zoom">' + Math.round(tab.zoom * 100) + '%</button>' +
          '<button type="button" class="pd-dock-btn pd-dock-hide-compact" id="pdZoomIn" title="Zoom In" aria-label="Zoom in">' + ICONS.zoomIn + '</button>' +
          '<button type="button" class="pd-dock-btn pd-dock-hide-compact" id="pdFitWidthBtn" title="Fit Width" aria-label="Fit page width">' + ICONS.fitW + '</button>' +
          '<button type="button" class="pd-dock-btn pd-dock-hide-compact" id="pdFitHeightBtn" title="Fit Height" aria-label="Fit page height">' + ICONS.fitH + '</button>' +
          '<button type="button" class="pd-dock-btn" id="pdRotateBtn" title="Rotate 90deg" aria-label="Rotate page 90 degrees">' + ICONS.rotate + '</button>' +
          '<span class="pd-dock-sep"></span>' +
          '<button type="button" class="pd-dock-btn" id="pdUndoBtn" title="Undo Markup" aria-label="Undo" ' + (!canUndo || isBook ? 'data-demo-idle="1"' : '') + '>' + ICONS.undo + '</button>' +
          '<button type="button" class="pd-dock-btn" id="pdRedoBtn" title="Redo Markup" aria-label="Redo" ' + (!canRedo || isBook ? 'data-demo-idle="1"' : '') + '>' + ICONS.redo + '</button>' +
          '<span class="pd-dock-sep"></span>' +
          '<button type="button" class="pd-dock-btn ' + (tab.tool === 'select' ? 'is-active' : '') + '" data-reader-tool="select" data-tool-tone="select" title="Select Cursor" aria-label="Cursor select tool">' + ICONS.cursor + '</button>' +
          '<button type="button" class="pd-dock-btn ' + (tab.tool === 'hand' ? 'is-active' : '') + '" data-reader-tool="hand" data-tool-tone="hand" title="Hand Pan Tool" aria-label="Hand pan tool">' + ICONS.hand + '</button>' +
          '<button type="button" class="pd-dock-btn ' + (tab.tool === 'highlight' && !isBook ? 'is-active' : '') + '" data-reader-tool="highlight" data-tool-tone="highlight" title="Drag Highlight (1-Page Mode)" aria-label="Highlight tool">' + ICONS.highlighter + '</button>' +
          '<button type="button" class="pd-dock-btn ' + (tab.tool === 'pen' && !isBook ? 'is-active' : '') + '" data-reader-tool="pen" data-tool-tone="pen" title="Ink Pen (1-Page Mode)" aria-label="Ink pen tool">' + ICONS.pen + '</button>' +
          '<button type="button" class="pd-dock-btn ' + (tab.tool === 'eraser' && !isBook ? 'is-active' : '') + '" data-reader-tool="eraser" data-tool-tone="eraser" title="Erase Highlight / Ink" aria-label="Eraser tool">' + ICONS.eraser + '</button>' +
          '<button type="button" class="pd-dock-btn pd-dock-hide-compact" data-demo-only="Floating Sticky Notes" title="Sticky Note (Full Windows App)" aria-label="Sticky notes tool">' + ICONS.note + '</button>' +
          '<button type="button" class="pd-dock-btn pd-dock-hide-compact" data-demo-only="Vector Shapes &amp; Callouts" title="Shapes (Full Windows App)" aria-label="Vector shapes tool">' + ICONS.shapes + '</button>' +
          (hasMarkups && !isBook ? '<button type="button" class="pd-dock-btn" id="pdClearHighlights" title="Clear All Notes" aria-label="Clear highlights and ink">' + ICONS.trash + '</button>' : '') +
          '<span class="pd-dock-sep pd-dock-hide-compact"></span>' +
          '<div class="pd-find-inline pd-dock-hide-compact">' + ICONS.search + '<input type="text" id="pdFindInput" class="pd-find-input" placeholder="Find..." value="' + escHtml(tab.findQuery) + '" aria-label="Find in document">' +
            (tab.findQuery ? '<span class="pd-find-count">' + tab.findMatches.length + '</span>' : '') +
            '<button type="button" class="pd-find-step-btn" id="pdFindPrev" title="Previous match" aria-label="Previous search match">' + ICONS.up + '</button>' +
            '<button type="button" class="pd-find-step-btn" id="pdFindNext" title="Next match" aria-label="Next search match">' + ICONS.down + '</button>' +
          '</div>' +
          '<span class="pd-dock-sep pd-dock-hide-compact"></span>' +
          '<button type="button" class="pd-dock-btn pd-dock-hide-compact" data-demo-only="Offline OCR Text Scanner" title="OCR Scanner (Full Windows App)" aria-label="OCR scanner tool">' + ICONS.ocr + '</button>' +
          '<button type="button" class="pd-dock-btn pd-dock-hide-compact" data-demo-only="Electronic Signature &amp; Stamp" title="Signature (Full Windows App)" aria-label="Electronic signature tool">' + ICONS.sign + '</button>' +
          '<button type="button" class="pd-dock-btn pd-dock-hide-compact" data-demo-only="Save &amp; Export Annotated PDF" title="Save Annotated PDF (Full Windows App)" aria-label="Save annotated PDF">' + ICONS.save + '</button>';
      }

      var dockHtml = '<div class="pd-reader-dock ' + (isBook ? 'is-book-dock' : '') + (isEpub ? ' is-epub-dock' : '') + '" role="toolbar" aria-label="Document Reader Dock">' +
        '<button type="button" class="pd-dock-btn pd-dock-skip" id="pdFirstPage" title="First Page" aria-label="First page">' + ICONS.first + '</button>' +
        '<button type="button" class="pd-dock-btn" id="pdPrevPage" title="Previous Page" aria-label="Previous page">' + ICONS.left + '</button>' +
        '<span class="pd-dock-page" id="pdDockPageLabel">' + rangeLabel + '</span>' +
        '<button type="button" class="pd-dock-btn" id="pdNextPage" title="Next Page" aria-label="Next page">' + ICONS.right + '</button>' +
        '<button type="button" class="pd-dock-btn pd-dock-skip" id="pdLastPage" title="Last Page" aria-label="Last page">' + ICONS.last + '</button>' +
        '<span class="pd-dock-sep"></span>' +
        dockMiddleHtml +
      '</div>';

      return '<div class="pd-reader">' +
        '<div class="pd-reader-body">' +
          sidebarHtml +
          '<div class="pd-reader-col">' +
            '<div class="pd-reader-stage ' + (isBook ? 'is-book-stage ' : 'is-scroll-stage ') + (tab.tool === 'hand' && !isBook ? 'is-hand-stage' : '') + '">' +
              stageHtml +
            '</div>' +
            (!loading ? dockHtml : '') +
            (!tab.aiOpen ? '<button type="button" class="pd-zernexa-fab" id="pdReaderZernexaBtn" title="Ask Zernexa AI" aria-label="Open Zernexa AI Assistant"><img src="assets/zernexa.png" alt="Zernexa"></button>' : '') +
          '</div>' +
          aiHtml +
        '</div>' +
      '</div>';
    }

    function buildSettingsModal() {
      if (!state.settingsOpen) return '';
      var body = '';
      if (state.settingsTab === 'overview') {
        body = '<h4>PDFistic Preview Showcase</h4>' +
          '<p>Explore our 3D Book Page-Turn engine, EPUB typography, page highlights, and Zernexa AI right in Chrome.</p>' +
          '<div class="pd-overview-grid">' +
            '<div class="pd-ov-box"><strong>4 Curated 8-Page Books</strong><span>Three 8-page PDFs and one dedicated Book-Mode EPUB pre-loaded locally.</span></div>' +
            '<div class="pd-ov-box"><strong>3D Book Turn &amp; Themes</strong><span>Drag page corners on desktop or swipe in Landscape Expanded mode on mobile.</span></div>' +
          '</div>' +
          '<div class="pd-continue-strip">' +
            '<span>Want unlimited local files, offline OCR &amp; merge/split tools?</span>' +
            '<a href="' + STORE_URL + '" class="pd-continue-cta">Continue to app</a>' +
          '</div>';
      } else if (state.settingsTab === 'appearance') {
        body = '<h4>Reader Theme</h4>' +
          '<p>Pick your preferred paper or dark studio background.</p>' +
          '<div class="pd-theme-choices">' +
            '<button type="button" class="pd-theme-chip ' + (state.theme === 'light' ? 'is-active' : '') + '" data-set-theme="light">Porcelain Studio Light</button>' +
            '<button type="button" class="pd-theme-chip ' + (state.theme === 'paper' ? 'is-active' : '') + '" data-set-theme="paper">Warm Paper Comfort</button>' +
            '<button type="button" class="pd-theme-chip ' + (state.theme === 'dark' ? 'is-active' : '') + '" data-set-theme="dark">Studio Obsidian Dark</button>' +
          '</div>';
      } else {
        body = '<h4>Full Windows App Features</h4>' +
          '<p>Custom local file loading, offline OCR, and encrypted note storage live in the native Windows app.</p>' +
          '<ul class="pd-shortcut-list">' +
            '<li><span>Open unlimited local PDF &amp; EPUB files</span><span class="pd-app-badge">Windows App</span></li>' +
            '<li><span>Merge, split, rotate &amp; compress PDFs</span><span class="pd-app-badge">Windows App</span></li>' +
            '<li><span>Offline Tesseract OCR &amp; local encrypted vault</span><span class="pd-app-badge">Windows App</span></li>' +
          '</ul>' +
          '<div class="pd-continue-strip">' +
            '<span>Ready for your own library?</span>' +
            '<a href="' + STORE_URL + '" class="pd-continue-cta">Continue to app</a>' +
          '</div>';
      }

      return '<div class="pd-modal-backdrop" id="pdModalBackdrop">' +
        '<div class="pd-modal" role="dialog" aria-modal="true" aria-label="PDFistic Demo Settings">' +
          '<aside class="pd-modal-nav">' +
            '<span class="pd-modal-cat">SHOWCASE SETTINGS</span>' +
            '<button type="button" class="pd-modal-tab ' + (state.settingsTab === 'overview' ? 'is-active' : '') + '" data-stab="overview">' + ICONS.info + '<span>Overview</span></button>' +
            '<button type="button" class="pd-modal-tab ' + (state.settingsTab === 'appearance' ? 'is-active' : '') + '" data-stab="appearance">' + ICONS.palette + '<span>Appearance</span></button>' +
            '<button type="button" class="pd-modal-tab ' + (state.settingsTab === 'desktop' ? 'is-active' : '') + '" data-stab="desktop">' + ICONS.monitor + '<span>Continue to App</span></button>' +
          '</aside>' +
          '<div class="pd-modal-content">' +
            '<button type="button" class="pd-modal-close" id="pdModalClose" aria-label="Close settings">' + ICONS.x + '</button>' +
            body +
          '</div>' +
        '</div>' +
      '</div>';
    }

    function buildContinueModal() {
      if (!state.continueOpen) return '';
      return '<div class="pd-modal-backdrop" id="pdContinueBackdrop">' +
        '<div class="pd-modal pd-continue-modal" role="dialog" aria-modal="true" aria-label="Demo Preview Notice">' +
          '<div class="pd-modal-content">' +
            '<button type="button" class="pd-modal-close" id="pdContinueClose" aria-label="Close notice">' + ICONS.x + '</button>' +
            '<span class="pd-continue-kicker">DEMO PREVIEW ONLY &bull; DESKTOP EXCLUSIVE</span>' +
            '<h4>' + escHtml(state.continueFeature) + '</h4>' +
            '<p>This lightweight browser showcase is built for previewing PDFistic&rsquo;s 3D page turn, EPUB reading, markup, and AI. Full local file workflows like <strong>' + escHtml(state.continueFeature) + '</strong> run 100% offline in the Windows app.</p>' +
            '<div class="pd-continue-actions">' +
              '<a href="' + STORE_URL + '" class="pd-continue-cta">Download PDFistic App ' + ICONS.arrowRight + '</a>' +
              '<button type="button" class="pd-continue-sample-btn" id="pdContinueDismiss">Back to Demo</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    }

    var dotWaveRaf = null;
    function startAiDotWave() {
      if (dotWaveRaf) { cancelAnimationFrame(dotWaveRaf); dotWaveRaf = null; }
      var canvas = document.getElementById('pdAiDotWave');
      if (!canvas) return;
      var ctx = canvas.getContext('2d');
      if (!ctx) return;
      var rect = canvas.getBoundingClientRect();
      var w = Math.max(200, Math.round(rect.width || 300));
      var h = Math.max(80, Math.round(rect.height || 130));
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var t0 = performance.now();
      var spacing = 18;
      var cols = Math.floor(w / spacing) + 1;
      var rows = Math.floor(h / spacing) + 1;
      var offX = (w - (cols - 1) * spacing) / 2;

      function frame(now) {
        if (!document.body.contains(canvas)) { dotWaveRaf = null; return; }
        var elapsed = reduced ? 0 : (now - t0);
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = state.theme === 'dark' ? 'rgba(129, 140, 248, 0.42)' : 'rgba(99, 102, 241, 0.34)';
        for (var c = 0; c < cols; c++) {
          var x = offX + c * spacing;
          var s1 = Math.sin(x * 0.011 + elapsed * 0.0011);
          var s2 = Math.cos(x * 0.023 - elapsed * 0.0014 + 1.5);
          var surfaceNorm = (s1 * 0.55 + s2 * 0.45 + 1.0) / 2.0;
          var surfY = (h - 6) - Math.max(0.15, Math.min(0.86, surfaceNorm)) * (h * 0.78);
          for (var r = 0; r < rows; r++) {
            var y = (h - 6) - r * spacing;
            if (y > surfY) {
              var factor = Math.min(1, (y - surfY) / (h * 0.55));
              var rad = 0.85 + 1.45 * (1 - factor * 0.6);
              ctx.globalAlpha = Math.max(0.05, (1 - factor * 0.65) * 0.42);
              ctx.beginPath();
              ctx.arc(x, y, rad, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        if (!reduced) dotWaveRaf = requestAnimationFrame(frame);
      }
      if (reduced) frame(t0);
      else dotWaveRaf = requestAnimationFrame(frame);
    }

    function render() {
      destroyBookFlip();
      var activeTab = getActiveReaderTab();
      var errHtml = state.errorMsg ? '<div class="pd-error-banner">' + escHtml(state.errorMsg) + '</div>' : '';
      root.innerHTML = buildTopChrome(activeTab) + errHtml + (activeTab ? buildReaderView(activeTab) : buildHomeView()) + buildSettingsModal() + buildContinueModal();
      syncOuterShowcaseControls();
      bindEvents();
      if (document.getElementById('pdAiDotWave')) startAiDotWave();
    }

    function snapshotMarkup(tab) {
      return JSON.stringify({ h: tab.highlights, s: tab.strokes });
    }

    function pushUndo(tab, prevSnap) {
      tab.undoStack.push(prevSnap);
      tab.redoStack = [];
    }

    function bindEvents() {
      var expBtn = document.getElementById('pdExpandBtn');
      if (expBtn) expBtn.addEventListener('click', function () { setExpanded(!state.expanded); });

      var splitBtn = document.getElementById('pdHeaderSplitBtn');
      if (splitBtn) splitBtn.addEventListener('click', function () {
        var cur = getActiveReaderTab();
        if (cur) {
          if (cur.doc && cur.doc.format === 'epub') return;
          cur.viewMode = cur.viewMode === 'book' ? 'scroll' : 'book';
          render();
          renderActiveView();
        } else {
          openDocTab('sample-1', { viewMode: 'book' });
        }
      });

      var setBtn = document.getElementById('pdSettingsBtn');
      if (setBtn) setBtn.addEventListener('click', function () {
        state.settingsOpen = !state.settingsOpen;
        state.continueOpen = false;
        syncContainerState();
        render();
        renderActiveView();
      });

      var hdrAi = document.getElementById('pdHeaderAiBtn');
      if (hdrAi) hdrAi.addEventListener('click', function () {
        state.settingsOpen = true;
        state.settingsTab = 'overview';
        state.continueOpen = false;
        syncContainerState();
        render();
        renderActiveView();
      });

      var homeZern = document.getElementById('pdHomeZernexaBtn');
      if (homeZern) homeZern.addEventListener('click', function () {
        state.homeAiOpen = true;
        state.aiToolsOpen = false;
        state.aiOverflowOpen = false;
        syncContainerState();
        render();
      });

      var rdrZern = document.getElementById('pdReaderZernexaBtn');
      if (rdrZern) rdrZern.addEventListener('click', function () {
        var t = getActiveReaderTab();
        if (t) { t.aiOpen = true; state.aiToolsOpen = false; state.aiOverflowOpen = false; render(); renderActiveView(); }
      });

      var modalClose = document.getElementById('pdModalClose');
      if (modalClose) modalClose.addEventListener('click', function () {
        state.settingsOpen = false;
        syncContainerState();
        render();
        renderActiveView();
      });

      var modalBg = document.getElementById('pdModalBackdrop');
      if (modalBg) modalBg.addEventListener('click', function (e) {
        if (e.target === modalBg) {
          state.settingsOpen = false;
          syncContainerState();
          render();
          renderActiveView();
        }
      });

      var contClose = document.getElementById('pdContinueClose');
      if (contClose) contClose.addEventListener('click', function () {
        state.continueOpen = false;
        syncContainerState();
        render();
        renderActiveView();
      });

      var contBg = document.getElementById('pdContinueBackdrop');
      if (contBg) contBg.addEventListener('click', function (e) {
        if (e.target === contBg) {
          state.continueOpen = false;
          syncContainerState();
          render();
          renderActiveView();
        }
      });

      var contDismiss = document.getElementById('pdContinueDismiss');
      if (contDismiss) contDismiss.addEventListener('click', function () {
        state.continueOpen = false;
        syncContainerState();
        render();
        renderActiveView();
      });

      root.querySelectorAll('[data-stab]').forEach(function (b) {
        b.addEventListener('click', function () {
          state.settingsTab = b.getAttribute('data-stab');
          render();
          renderActiveView();
        });
      });

      root.querySelectorAll('[data-set-theme]').forEach(function (b) {
        b.addEventListener('click', function () {
          state.theme = b.getAttribute('data-set-theme');
          syncContainerState();
          render();
          renderActiveView();
        });
      });

      var addBtn = document.getElementById('pdAddTabBtn');
      if (addBtn) addBtn.addEventListener('click', function () { showContinueAppPrompt('Open unlimited local PDF & EPUB files'); });

      var openBtn = document.getElementById('pdOpenDocBtn');
      if (openBtn) openBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        showContinueAppPrompt('Open your own local PDF & EPUB files');
      });

      var dz = document.getElementById('pdDropzone');
      if (dz) {
        dz.addEventListener('click', function (e) {
          if (e.target.closest('#pdOpenDocBtn')) return;
          showContinueAppPrompt('Drop & read your own local PDF or EPUB files');
        });
      }

      root.querySelectorAll('[data-tab-switch]').forEach(function (b) {
        b.addEventListener('click', function () {
          state.activeTabId = b.getAttribute('data-tab-switch');
          syncContainerState();
          render();
          renderActiveView();
        });
      });

      root.querySelectorAll('[data-tab-close]').forEach(function (b) {
        b.addEventListener('click', function (e) {
          e.stopPropagation();
          var id = b.getAttribute('data-tab-close');
          state.tabs = state.tabs.filter(function (t) { return t.id !== id; });
          if (state.activeTabId === id) state.activeTabId = state.tabs.length ? state.tabs[state.tabs.length - 1].id : 'home';
          syncContainerState();
          render();
          renderActiveView();
        });
      });

      root.querySelectorAll('[data-shelf]').forEach(function (b) {
        b.addEventListener('click', function () { state.shelfSection = b.getAttribute('data-shelf'); render(); });
      });

      root.querySelectorAll('[data-filter]').forEach(function (b) {
        b.addEventListener('click', function () { state.filter = b.getAttribute('data-filter'); render(); });
      });

      root.querySelectorAll('[data-view]').forEach(function (b) {
        b.addEventListener('click', function () { state.viewMode = b.getAttribute('data-view'); render(); });
      });

      var srch = document.getElementById('pdSearchInput');
      if (srch) {
        srch.addEventListener('input', function () {
          state.searchQuery = srch.value;
          var pos = srch.selectionStart;
          render();
          var nextSrch = document.getElementById('pdSearchInput');
          if (nextSrch) { nextSrch.focus(); nextSrch.setSelectionRange(pos, pos); }
        });
      }

      var rst = document.getElementById('pdResetSamples');
      if (rst) rst.addEventListener('click', function () {
        if (state.docs.length > 0 && state.searchQuery === '' && state.filter === 'recent') {
          state.docs = [];
        } else {
          state.docs = SAMPLE_DOCS.map(function (d) { return Object.assign({}, d); });
          state.searchQuery = '';
          state.filter = 'recent';
        }
        render();
      });

      var restoreLink = document.getElementById('pdRestoreSamples');
      if (restoreLink) restoreLink.addEventListener('click', function () {
        state.docs = SAMPLE_DOCS.map(function (d) { return Object.assign({}, d); });
        state.searchQuery = '';
        state.filter = 'recent';
        render();
      });

      root.querySelectorAll('[data-pin-doc]').forEach(function (pinEl) {
        function togglePin(e) {
          e.stopPropagation();
          var id = pinEl.getAttribute('data-pin-doc');
          for (var i = 0; i < state.docs.length; i++) {
            if (state.docs[i].id === id) { state.docs[i].pinned = !state.docs[i].pinned; break; }
          }
          render();
        }
        pinEl.addEventListener('click', togglePin);
        pinEl.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePin(e); } });
      });

      root.querySelectorAll('[data-open-doc]').forEach(function (card) {
        card.addEventListener('click', function (e) {
          if (e.target.closest('[data-pin-doc]')) return;
          openDocTab(card.getAttribute('data-open-doc'));
        });
        card.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') openDocTab(card.getAttribute('data-open-doc'));
        });
      });

      root.querySelectorAll('[data-tool-launch]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var id = btn.getAttribute('data-tool-launch');
          for (var i = 0; i < TOOL_CARDS.length; i++) {
            if (TOOL_CARDS[i].id === id) {
              if (TOOL_CARDS[i].continueReason) {
                showContinueAppPrompt(TOOL_CARDS[i].continueReason);
                return;
              }
              openDocTab(TOOL_CARDS[i].actionDoc, {
                viewMode: TOOL_CARDS[i].mode || 'book',
                tool: TOOL_CARDS[i].tool || 'select',
                openAi: TOOL_CARDS[i].openAi
              });
              return;
            }
          }
        });
      });

      root.querySelectorAll('[data-demo-only]').forEach(function (b) {
        b.addEventListener('click', function () {
          showContinueAppPrompt(b.getAttribute('data-demo-only'));
        });
      });

      // Shared Zernexa Copilot Panel Bindings (Works on BOTH Home & Active Document Reader!)
      var currentTabForAi = getActiveReaderTab();
      var aiExpBtn = document.getElementById('pdAiExpandBtn');
      if (aiExpBtn) aiExpBtn.addEventListener('click', function () {
        state.aiExpanded = !state.aiExpanded;
        state.aiToolsOpen = false;
        state.aiOverflowOpen = false;
        render();
        if (currentTabForAi) renderActiveView();
      });

      var closeAi = document.getElementById('pdCloseAiBtn');
      if (closeAi) closeAi.addEventListener('click', function () {
        state.aiToolsOpen = false;
        state.aiOverflowOpen = false;
        state.aiExpanded = false;
        if (currentTabForAi) {
          currentTabForAi.aiOpen = false;
          activeFlipDocKey = '';
          render();
          renderActiveView();
        } else {
          state.homeAiOpen = false;
          render();
        }
      });

      var ovBtn = document.getElementById('pdAiOverflowBtn');
      if (ovBtn) ovBtn.addEventListener('click', function () {
        state.aiOverflowOpen = !state.aiOverflowOpen;
        state.aiToolsOpen = false;
        render();
        if (currentTabForAi) renderActiveView();
      });

      var clrChatBtn = document.getElementById('pdAiClearChatBtn');
      if (clrChatBtn) clrChatBtn.addEventListener('click', function () {
        state.aiOverflowOpen = false;
        if (currentTabForAi) currentTabForAi.messages = [];
        else state.homeAiMessages = [];
        render();
        if (currentTabForAi) renderActiveView();
      });

      var toolsBtn = document.getElementById('pdAiToolsBtn');
      if (toolsBtn) toolsBtn.addEventListener('click', function () {
        state.aiToolsOpen = !state.aiToolsOpen;
        state.aiOverflowOpen = false;
        render();
        if (currentTabForAi) renderActiveView();
      });

      var enhBtn = document.getElementById('pdAiEnhanceBtn');
      if (enhBtn) enhBtn.addEventListener('click', function () {
        var inp = document.getElementById('pdAiInput');
        if (inp) {
          inp.value = currentTabForAi
            ? 'How do ' + currentTabForAi.doc.format.toUpperCase() + ' tools, annotations & OCR work in PDFistic?'
            : 'What are all the features in the PDFistic Windows app?';
          inp.focus();
        }
      });

      root.querySelectorAll('[data-ai-prompt]').forEach(function (b) {
        b.addEventListener('click', function () { answerQuestion(currentTabForAi, b.getAttribute('data-ai-prompt')); });
      });

      var aiForm = document.getElementById('pdAiForm');
      if (aiForm) {
        aiForm.addEventListener('submit', function (e) {
          e.preventDefault();
          var inp = document.getElementById('pdAiInput');
          if (!inp || !inp.value.trim()) return;
          answerQuestion(currentTabForAi, inp.value);
        });
      }
      var aiInpEl = document.getElementById('pdAiInput');
      if (aiInpEl) {
        aiInpEl.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (aiInpEl.value.trim()) answerQuestion(currentTabForAi, aiInpEl.value);
          }
        });
      }

      var activeTab = getActiveReaderTab();
      if (!activeTab) return;

      function renderPreservingScroll() {
        var st = root.querySelector('.pd-reader-stage');
        var top = st ? st.scrollTop : 0;
        render();
        renderActiveView();
        var nextSt = root.querySelector('.pd-reader-stage');
        if (nextSt && top > 0) nextSt.scrollTop = top;
      }

      var sbBtn = document.getElementById('pdToggleSidebar');
      if (sbBtn) sbBtn.addEventListener('click', function () { activeTab.sidebarOpen = !activeTab.sidebarOpen; render(); renderActiveView(); });

      var modeBtn = document.getElementById('pdCycleModeBtn');
      if (modeBtn) modeBtn.addEventListener('click', function () {
        if (activeTab.doc && activeTab.doc.format === 'epub') return;
        activeTab.viewMode = activeTab.viewMode === 'book' ? 'scroll' : 'book';
        render();
        renderActiveView();
      });

      var themeBtn = document.getElementById('pdToggleThemeBtn');
      if (themeBtn) themeBtn.addEventListener('click', function () {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        syncContainerState();
        render();
        renderActiveView();
      });

      var warmBtn = document.getElementById('pdWarmPaperBtn');
      if (warmBtn) warmBtn.addEventListener('click', function () {
        state.theme = state.theme === 'paper' ? 'light' : 'paper';
        syncContainerState();
        render();
        renderActiveView();
      });

      root.querySelectorAll('[data-goto-page]').forEach(function (b) {
        b.addEventListener('click', function () {
          var targetP = parseInt(b.getAttribute('data-goto-page'), 10) || 1;
          activeTab.page = targetP;
          if (activeTab.viewMode === 'book' && activeFlipInst) {
            try { activeFlipInst.flip(targetP - 1); } catch { render(); renderActiveView(); }
            syncPageIndicatorLabels(activeTab);
          } else {
            syncPageIndicatorLabels(activeTab);
            scrollToReaderPage(targetP);
          }
        });
      });

      root.querySelectorAll('[data-bookmark-page]').forEach(function (b) {
        b.addEventListener('click', function (e) {
          e.stopPropagation();
          var pn = parseInt(b.getAttribute('data-bookmark-page'), 10);
          activeTab.bookmarks[pn] = !activeTab.bookmarks[pn];
          renderPreservingScroll();
        });
      });

      root.querySelectorAll('[data-reader-tool]').forEach(function (b) {
        b.addEventListener('click', function () {
          var tool = b.getAttribute('data-reader-tool');
          var isEpub = activeTab.doc && activeTab.doc.format === 'epub';
          if (isEpub) {
            activeTab.tool = tool === 'hand' ? 'hand' : 'select';
            activeTab.viewMode = 'book';
          } else {
            activeTab.tool = tool;
            if (tool === 'highlight' || tool === 'pen' || tool === 'eraser') activeTab.viewMode = 'scroll';
          }
          render();
          renderActiveView();
        });
      });

      var undoBtn = document.getElementById('pdUndoBtn');
      if (undoBtn) undoBtn.addEventListener('click', function () {
        if (!activeTab.undoStack.length) return;
        activeTab.redoStack.push(snapshotMarkup(activeTab));
        var prev = JSON.parse(activeTab.undoStack.pop());
        activeTab.highlights = prev.h || {};
        activeTab.strokes = prev.s || {};
        renderPreservingScroll();
      });

      var redoBtn = document.getElementById('pdRedoBtn');
      if (redoBtn) redoBtn.addEventListener('click', function () {
        if (!activeTab.redoStack || !activeTab.redoStack.length) return;
        activeTab.undoStack.push(snapshotMarkup(activeTab));
        var nxt = JSON.parse(activeTab.redoStack.pop());
        activeTab.highlights = nxt.h || {};
        activeTab.strokes = nxt.s || {};
        renderPreservingScroll();
      });

      var clHlBtn = document.getElementById('pdClearHighlights');
      if (clHlBtn) clHlBtn.addEventListener('click', function () {
        pushUndo(activeTab, snapshotMarkup(activeTab));
        activeTab.highlights = {};
        activeTab.strokes = {};
        renderPreservingScroll();
      });

      var rotBtn = document.getElementById('pdRotateBtn');
      if (rotBtn) rotBtn.addEventListener('click', function () {
        activeTab.rotation = ((activeTab.rotation || 0) + 90) % 360;
        activeFlipDocKey = '';
        renderPreservingScroll();
      });

      var fitWBtn = document.getElementById('pdFitWidthBtn');
      if (fitWBtn) fitWBtn.addEventListener('click', function () {
        if (activeTab.viewMode === 'book') { activeTab.viewMode = 'scroll'; }
        activeTab.zoom = 1.25;
        renderPreservingScroll();
      });

      var fitHBtn = document.getElementById('pdFitHeightBtn');
      if (fitHBtn) fitHBtn.addEventListener('click', function () {
        activeTab.zoom = 1.0;
        renderPreservingScroll();
      });

      var firstBtn = document.getElementById('pdFirstPage');
      if (firstBtn) firstBtn.addEventListener('click', function () {
        activeTab.page = 1;
        if (activeTab.viewMode === 'book' && activeFlipInst) {
          try { activeFlipInst.flip(0); } catch { render(); renderActiveView(); }
          syncPageIndicatorLabels(activeTab);
        } else { syncPageIndicatorLabels(activeTab); scrollToReaderPage(1); }
      });

      var lastBtn = document.getElementById('pdLastPage');
      if (lastBtn) lastBtn.addEventListener('click', function () {
        activeTab.page = activeTab.numPages;
        if (activeTab.viewMode === 'book' && activeFlipInst) {
          try { activeFlipInst.flip(activeTab.numPages - 1); } catch { render(); renderActiveView(); }
          syncPageIndicatorLabels(activeTab);
        } else { syncPageIndicatorLabels(activeTab); scrollToReaderPage(activeTab.numPages); }
      });

      var aiBtn = document.getElementById('pdToggleAi');
      if (aiBtn) aiBtn.addEventListener('click', function () {
        activeTab.aiOpen = !activeTab.aiOpen;
        state.aiToolsOpen = false;
        state.aiOverflowOpen = false;
        activeFlipDocKey = '';
        render();
        renderActiveView();
      });

      var prevBtn = document.getElementById('pdPrevPage');
      if (prevBtn) prevBtn.addEventListener('click', function () { stepPage(-1); });
      var nextBtn = document.getElementById('pdNextPage');
      if (nextBtn) nextBtn.addEventListener('click', function () { stepPage(1); });

      var zOut = document.getElementById('pdZoomOut');
      if (zOut) zOut.addEventListener('click', function () { activeTab.zoom = Math.max(0.75, Math.round((activeTab.zoom - 0.15) * 100) / 100); renderPreservingScroll(); });
      var zReset = document.getElementById('pdZoomReset');
      if (zReset) zReset.addEventListener('click', function () { activeTab.zoom = 1; renderPreservingScroll(); });
      var zIn = document.getElementById('pdZoomIn');
      if (zIn) zIn.addEventListener('click', function () { activeTab.zoom = Math.min(1.5, Math.round((activeTab.zoom + 0.15) * 100) / 100); renderPreservingScroll(); });

      var findInp = document.getElementById('pdFindInput');
      function jumpFindMatch(dir) {
        if (!activeTab.findMatches.length) return;
        var idx = activeTab.findMatches.indexOf(activeTab.page);
        var nextIdx = idx === -1 ? 0 : (idx + dir + activeTab.findMatches.length) % activeTab.findMatches.length;
        var target = activeTab.findMatches[nextIdx];
        activeTab.page = target;
        if (activeTab.viewMode === 'book' && activeFlipInst) {
          try { activeFlipInst.flip(target - 1); } catch {}
          syncPageIndicatorLabels(activeTab);
        } else {
          syncPageIndicatorLabels(activeTab);
          scrollToReaderPage(target);
        }
      }
      var fPrev = document.getElementById('pdFindPrev');
      if (fPrev) fPrev.addEventListener('click', function () { jumpFindMatch(-1); });
      var fNext = document.getElementById('pdFindNext');
      if (fNext) fNext.addEventListener('click', function () { jumpFindMatch(1); });
      if (findInp) {
        findInp.addEventListener('input', function () {
          activeTab.findQuery = findInp.value;
          updateTabFindMatches(activeTab);
          var pos = findInp.selectionStart;
          render();
          renderActiveView();
          var nInp = document.getElementById('pdFindInput');
          if (nInp) { nInp.focus(); nInp.setSelectionRange(pos, pos); }
        });
        findInp.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' && activeTab.findMatches.length) {
            e.preventDefault();
            jumpFindMatch(1);
            var nInp = document.getElementById('pdFindInput');
            if (nInp) nInp.focus();
          }
        });
      }

      // Multi-page scroll tracking in 1-Page mode + Swipe Page-Turn in Book mode
      var stage = root.querySelector('.pd-reader-stage');
      if (stage && activeTab.viewMode === 'book') {
        var touchStartX = 0, touchStartY = 0;
        stage.addEventListener('touchstart', function (te) {
          if (!te.touches || !te.touches[0]) return;
          touchStartX = te.touches[0].clientX;
          touchStartY = te.touches[0].clientY;
        }, { passive: true });
        stage.addEventListener('touchend', function (te) {
          if (!te.changedTouches || !te.changedTouches[0]) return;
          if (te.target.closest('button, input, .pd-reader-dock, .pd-zernexa-fab')) return;
          var dx = te.changedTouches[0].clientX - touchStartX;
          var dy = te.changedTouches[0].clientY - touchStartY;
          var rotated = shot.classList.contains('is-rotated-landscape');
          var primaryDelta = rotated ? dy : dx;
          if (Math.abs(primaryDelta) > 36) {
            stepPage(primaryDelta < 0 ? 1 : -1);
          } else if (rotated && Math.abs(dx) < 12 && Math.abs(dy) < 12) {
            var sr = stage.getBoundingClientRect();
            var frac = (te.changedTouches[0].clientY - sr.top) / sr.height;
            stepPage(frac > 0.5 ? 1 : -1);
          }
        }, { passive: true });
      } else if (stage) {
        stage.addEventListener('scroll', function () {
          var stMid = stage.scrollTop + stage.clientHeight * 0.35;
          var wraps = stage.querySelectorAll('[data-hl-page]');
          for (var wi = wraps.length - 1; wi >= 0; wi--) {
            if (wraps[wi].offsetTop <= stMid + 12) {
              var curP = parseInt(wraps[wi].getAttribute('data-hl-page'), 10);
              if (curP && curP !== activeTab.page) {
                activeTab.page = curP;
                syncPageIndicatorLabels(activeTab);
              }
              break;
            }
          }
        }, { passive: true });
      }

      // Live Smooth Highlight, Ink Pen & Eraser on Every Page (Zero Scroll Jump / Zero Flicker!)
      var lastEraseAt = 0;
      function eraseMarkElement(markEl) {
        if (!markEl || activeTab.tool !== 'eraser') return false;
        var now = Date.now();
        if (now - lastEraseAt < 80) return false;
        lastEraseAt = now;
        var mType = markEl.getAttribute('data-mark-type');
        var mPage = parseInt(markEl.getAttribute('data-mark-page'), 10);
        var mIdx = parseInt(markEl.getAttribute('data-mark-idx'), 10);
        pushUndo(activeTab, snapshotMarkup(activeTab));
        if (mType === 'hl' && activeTab.highlights[mPage]) activeTab.highlights[mPage].splice(mIdx, 1);
        if (mType === 'ink' && activeTab.strokes[mPage]) activeTab.strokes[mPage].splice(mIdx, 1);
        renderPreservingScroll();
        return true;
      }

      root.querySelectorAll('[data-hl-page]').forEach(function (wrap) {
        wrap.addEventListener('click', function (e) {
          if (activeTab.tool !== 'eraser') return;
          var markEl = e.target.closest('[data-mark-type]');
          if (markEl) eraseMarkElement(markEl);
        });
        wrap.addEventListener('pointerdown', function (e) {
          if (e.target.closest('button')) return;
          if (activeTab.tool === 'eraser') {
            var markEl = e.target.closest('[data-mark-type]');
            if (markEl) {
              e.preventDefault();
              eraseMarkElement(markEl);
            }
            return;
          }
          if (activeTab.tool !== 'highlight' && activeTab.tool !== 'pen') return;
          e.preventDefault();
          var pNum = parseInt(wrap.getAttribute('data-hl-page'), 10);
          var prevSnap = snapshotMarkup(activeTab);

          function toPercent(ev) {
            var r = wrap.getBoundingClientRect();
            var rotated = shot.classList.contains('is-rotated-landscape');
            if (rotated) {
              var py = ((ev.clientX - r.left) / r.width);
              var px = ((ev.clientY - r.top) / r.height);
              return { x: Math.max(1, Math.min(99, px * 100)), y: Math.max(1, Math.min(99, (1 - py) * 100)) };
            }
            return {
              x: Math.max(1, Math.min(99, ((ev.clientX - r.left) / r.width) * 100)),
              y: Math.max(1, Math.min(99, ((ev.clientY - r.top) / r.height) * 100))
            };
          }

          var start = toPercent(e);

          if (activeTab.tool === 'highlight') {
            var hlLayer = wrap.querySelector('.pd-hl-layer');
            var liveHl = document.createElement('span');
            liveHl.className = 'pd-hl-rect is-live-hl';
            liveHl.style.left = start.x.toFixed(1) + '%';
            liveHl.style.top = Math.max(1, start.y - 1.5).toFixed(1) + '%';
            liveHl.style.width = '4%';
            liveHl.style.height = '3.2%';
            liveHl.style.backgroundColor = state.highlightColor;
            if (hlLayer) hlLayer.appendChild(liveHl);

            function computeRect(endPt) {
              var rawW = Math.abs(endPt.x - start.x);
              var rawH = Math.abs(endPt.y - start.y);
              var w = Math.max(6, rawW);
              var h = Math.max(2.6, rawH);
              var x = Math.max(1.5, Math.min(96 - w, Math.min(start.x, endPt.x)));
              var y = Math.max(1.5, Math.min(96 - h, rawH < 1.2 ? start.y - h * 0.5 : Math.min(start.y, endPt.y)));
              return { x: x.toFixed(1), y: y.toFixed(1), w: Math.min(w, 97 - x).toFixed(1), h: Math.min(h, 16).toFixed(1) };
            }

            function onMoveHl(mv) {
              var box = computeRect(toPercent(mv));
              liveHl.style.left = box.x + '%';
              liveHl.style.top = box.y + '%';
              liveHl.style.width = box.w + '%';
              liveHl.style.height = box.h + '%';
            }

            function onUp(upEv) {
              window.removeEventListener('pointermove', onMoveHl);
              window.removeEventListener('pointerup', onUp);
              liveHl.classList.remove('is-live-hl');
              var box = computeRect(toPercent(upEv));
              liveHl.style.left = box.x + '%';
              liveHl.style.top = box.y + '%';
              liveHl.style.width = box.w + '%';
              liveHl.style.height = box.h + '%';
              if (!activeTab.highlights[pNum]) activeTab.highlights[pNum] = [];
              var idx = activeTab.highlights[pNum].length;
              activeTab.highlights[pNum].push({ x: box.x, y: box.y, w: box.w, h: box.h, color: state.highlightColor });
              liveHl.setAttribute('data-mark-type', 'hl');
              liveHl.setAttribute('data-mark-page', String(pNum));
              liveHl.setAttribute('data-mark-idx', String(idx));
              pushUndo(activeTab, prevSnap);
              var uBtn = document.getElementById('pdUndoBtn');
              var rBtn = document.getElementById('pdRedoBtn');
              if (uBtn) uBtn.removeAttribute('data-demo-idle');
              if (rBtn) rBtn.setAttribute('data-demo-idle', '1');
            }
            window.addEventListener('pointermove', onMoveHl);
            window.addEventListener('pointerup', onUp);
          } else if (activeTab.tool === 'pen') {
            var pts = [start.x.toFixed(1) + ',' + start.y.toFixed(1)];
            var svg = wrap.querySelector('.pd-ink-layer');
            var livePoly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
            livePoly.setAttribute('class', 'pd-ink-stroke');
            livePoly.style.stroke = state.penColor;
            livePoly.setAttribute('points', pts.join(' '));
            if (svg) svg.appendChild(livePoly);

            function onMovePen(mv) {
              var pt = toPercent(mv);
              pts.push(pt.x.toFixed(1) + ',' + pt.y.toFixed(1));
              livePoly.setAttribute('points', pts.join(' '));
            }
            function onStopPen() {
              window.removeEventListener('pointermove', onMovePen);
              window.removeEventListener('pointerup', onStopPen);
              if (pts.length >= 2) {
                if (!activeTab.strokes[pNum]) activeTab.strokes[pNum] = [];
                var sIdx = activeTab.strokes[pNum].length;
                activeTab.strokes[pNum].push({ pts: pts.join(' '), color: state.penColor });
                livePoly.setAttribute('data-mark-type', 'ink');
                livePoly.setAttribute('data-mark-page', String(pNum));
                livePoly.setAttribute('data-mark-idx', String(sIdx));
                pushUndo(activeTab, prevSnap);
                var uBtn2 = document.getElementById('pdUndoBtn');
                var rBtn2 = document.getElementById('pdRedoBtn');
                if (uBtn2) uBtn2.removeAttribute('data-demo-idle');
                if (rBtn2) rBtn2.setAttribute('data-demo-idle', '1');
              } else if (livePoly.parentNode) {
                livePoly.parentNode.removeChild(livePoly);
              }
            }
            window.addEventListener('pointermove', onMovePen);
            window.addEventListener('pointerup', onStopPen);
          }
        });
      });
    }

    shot.querySelectorAll('[data-stage-theme]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.theme = btn.getAttribute('data-stage-theme');
        syncContainerState();
        render();
        renderActiveView();
      });
    });

    var stageExpandBtn = document.getElementById('heroStageExpandBtn');
    if (stageExpandBtn) {
      stageExpandBtn.addEventListener('click', function () {
        setExpanded(!state.expanded);
      });
    }

    var seeActionBtn = document.getElementById('heroSeeInActionBtn');
    if (seeActionBtn) {
      seeActionBtn.addEventListener('click', function (e) {
        e.preventDefault();
        shot.scrollIntoView({ behavior: 'smooth', block: 'center' });
        shot.classList.add('is-spotlight-pulse');
        setTimeout(function () { shot.classList.remove('is-spotlight-pulse'); }, 900);
      });
    }

    var showcaseDock = document.getElementById('demoShowcaseDock');
    if (showcaseDock) {
      showcaseDock.addEventListener('mousemove', function (ev) {
        var r = showcaseDock.getBoundingClientRect();
        showcaseDock.style.setProperty('--dock-mx', (ev.clientX - r.left) + 'px');
      });
    }

    shot.querySelectorAll('[data-demo-action]').forEach(function (pill) {
      function fireAction() {
        var act = pill.getAttribute('data-demo-action');
        state.activePreset = act;
        if (act === 'epub') openDocTab('sample-4', { viewMode: 'book' });
        if (act === 'highlight') openDocTab('sample-3', { viewMode: 'scroll', tool: 'highlight' });
        if (act === 'ai') {
          if (state.activeTabId !== 'home') {
            var cur = getActiveReaderTab();
            if (cur) { cur.aiOpen = true; state.aiToolsOpen = false; state.aiOverflowOpen = false; render(); renderActiveView(); return; }
          }
          state.activeTabId = 'home';
          state.homeAiOpen = true;
          state.aiToolsOpen = false;
          state.aiOverflowOpen = false;
          if (isMobilePortraitScreen() && !state.expanded) state.expanded = true;
          syncContainerState();
          render();
        }
        if (act === 'flip') openDocTab('sample-1', { viewMode: 'book' });
      }
      pill.addEventListener('click', fireAction);
      pill.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fireAction(); }
      });
    });

    render();
  });
})();
