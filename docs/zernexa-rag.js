/**
 * PDFistic Zernexa Feature Concierge — Client-Side RAG & System Prompt Engine
 * Strict Single-Purpose Role: Answer visitor questions exclusively about PDFistic App features,
 * grounded in curated architectural chunks from the real Windows desktop application.
 * Drop-in API hook: window.configurePdfisticZernexaAI({ endpoint, headers, model })
 */
(function (globalScope) {
  'use strict';

  var STORE_URL = 'https://apps.microsoft.com/detail/9PMCFQL187MN?hl=en-us&gl=IN&ocid=pdpshare';

  var SYSTEM_PROMPT = [
    'You are Zernexa, the official built-in product specialist inside the PDFistic website showcase.',
    'STRICT PURPOSE BOUNDARY:',
    '1. Your ONLY job is to explain PDFistic Desktop App features, architecture, reading modes, annotation tools, PDF utilities, offline OCR, privacy/DPAPI security, keyboard shortcuts, customization, and how to try or download PDFistic on Windows 10/11.',
    '2. Ground every factual claim strictly in the RETRIEVED PDFISTIC CONTEXT below. Never invent unverified features, pricing tiers, or unsupported OS platforms.',
    '3. If a visitor asks unrelated general questions (coding homework, recipes, news, off-topic trivia), warmly clarify that this showcase assistant is dedicated specifically to helping visitors explore PDFistic, and offer relevant PDFistic capabilities instead.',
    '4. Always distinguish clearly when a feature runs live inside this browser showcase (3D Book Turn, 8-page PDFs & EPUB Book Mode, Highlighter/Ink/Eraser/Undo/Redo, Search, Light/Paper/Dark themes) versus exclusive Windows Desktop App workflows (unlimited local files, PDF Tools Hub Merge/Split/Compress/Reorder/Images, Offline Tesseract OCR, Electronic Signatures, Sticky Notes, Vector Shapes, Saving annotated PDFs to disk, Dual Split-Screen, BookScope Lens, Custom Wallpapers, BYOK Gemini/OpenAI/Claude/Groq/OpenRouter with Windows DPAPI Vault).'
  ].join('\n');

  var SYNONYM_MAP = {
    epub: ['book', 'ebook', 'ebooks', 'chapter', 'chapters', 'kindle', 'fiction', 'novel'],
    bookturn: ['3d', 'flip', 'turn', 'page', 'spread', 'curl', 'hardcover', 'paperback'],
    annotate: ['highlight', 'highlighter', 'pen', 'ink', 'draw', 'eraser', 'undo', 'redo', 'sticky', 'note', 'notes', 'shape', 'shapes', 'callout', 'save', 'export', 'form', 'forms'],
    signature: ['sign', 'signature', 'signatures', 'stamp', 'initials'],
    tools: ['merge', 'combine', 'split', 'extract', 'compress', 'shrink', 'size', 'reorder', 'rotate', 'delete', 'images', 'png', 'jpg', 'hub', 'utilities'],
    ocr: ['ocr', 'scan', 'scanned', 'tesseract', 'selectable', 'image'],
    ai: ['zernexa', 'ai', 'assistant', 'copilot', 'rag', 'summary', 'summarize', 'quiz', 'chat', 'chart', 'mermaid', 'mindmap', 'latex', 'math', 'pyodide', 'python', 'map', 'html'],
    privacy: ['private', 'privacy', 'offline', 'local', 'pc', 'telemetry', 'cloud', 'upload', 'key', 'keys', 'api', 'byok', 'gemini', 'openai', 'claude', 'anthropic', 'groq', 'openrouter', 'dpapi', 'vault', 'encrypt', 'encrypted', 'safe', 'security'],
    splitview: ['split', 'dual', 'side', 'lens', 'magnifier', 'bookscope', 'zoom', 'fit', 'sidebar', 'thumbnails', 'bookmarks', 'outline', 'toc'],
    themes: ['theme', 'themes', 'dark', 'night', 'light', 'paper', 'warm', 'eye', 'comfort', 'wallpaper', 'font', 'typography', 'focus', 'hindi', 'language', 'english'],
    windows: ['download', 'install', 'store', 'microsoft', 'windows', 'win10', 'win11', 'free', 'price', 'cost', 'app', 'desktop', 'demo', 'mac', 'linux', 'shortcuts', 'ctrl']
  };

  var KNOWLEDGE_CHUNKS = [
    {
      id: 'core-identity',
      title: 'PDFistic Native Windows Reading Studio',
      category: 'Overview',
      tags: ['overview', 'windows', 'studio', 'free', 'microsoft', 'store', 'demo', 'fast', 'native'],
      body: 'PDFistic is a native Windows 10 and Windows 11 reading studio crafted by Devansh Dubey and distributed free on Microsoft Store. It unites a tactile 3D two-page book turn reader, continuous PDF study workspace, EPUB e-book library, markup tools, offline batch PDF utilities, local Tesseract OCR, and Zernexa BYOK AI in one fast, offline-first app.'
    },
    {
      id: 'book-3d-engine',
      title: '3D Book Page-Turn & Continuous 1-Page PDF Reader',
      category: 'Reading Modes',
      tags: ['3d', 'book', 'turn', 'flip', 'spread', 'pdf', 'scroll', '1-page', 'zoom', 'rotate', 'fit'],
      body: 'Every PDF opens in either lifelike 3D Book Turn mode (side-by-side spread with corner curl and realistic crease shadows) or crisp 1-Page continuous vertical scroll. Readers get smooth zoom (75%-150%+), Fit Width, Fit Height, 90-degree page rotation, fast in-document text search with next/previous match jumping, page bookmarks, and a pages sidebar with live thumbnails and outline navigation.'
    },
    {
      id: 'epub-book-mode',
      title: 'EPUB E-Book Reader (Dedicated Book Mode)',
      category: 'EPUB Reader',
      tags: ['epub', 'book', 'chapters', 'typography', 'font', 'reading', 'calm', 'mode'],
      body: 'EPUB e-books in PDFistic run strictly in dedicated Book Mode — preserving distraction-free page-by-page literary spreads rather than endless web scrolling. The Windows app adds full custom typography controls (serif and sans reading fonts, adjustable font size, line-height, and margins) plus warm eye-comfort reading palettes.'
    },
    {
      id: 'split-and-lens',
      title: 'Dual PDF Split-Screen & BookScope Magnifier Lens',
      category: 'Pro Study',
      tags: ['split', 'dual', 'screen', 'compare', 'bookscope', 'lens', 'magnifier', 'sidebar', 'toc', 'bookmarks'],
      body: 'In the native Windows app, students and researchers can read two PDFs side by side using Dual Split-Screen View (ideal for textbook + workbook or paper + notes) and hover with the interactive BookScope Optical Lens to inspect dense charts, formulas, and small footnotes without losing spread context.'
    },
    {
      id: 'annotations-markup',
      title: 'Highlighter, Ink Pen, Sticky Notes, Shapes & PDF Save',
      category: 'Annotation',
      tags: ['highlight', 'pen', 'ink', 'eraser', 'undo', 'redo', 'sticky', 'note', 'shapes', 'callout', 'form', 'save', 'export'],
      body: 'PDFistic supports live drag highlighting, freehand smooth ink strokes, point/stroke erasing, and full multi-step Undo and Redo — try Highlighter, Ink Pen, Eraser, Undo, and Redo right inside this browser preview on 1-Page PDFs. The desktop Windows app adds floating Sticky Notes, Vector Shapes & Callouts, interactive PDF Form Filling, and writing annotations directly back into saved PDF files on disk.'
    },
    {
      id: 'signatures-stamps',
      title: 'Electronic Signatures (Draw, Type, Upload)',
      category: 'Workflows',
      tags: ['sign', 'signature', 'stamp', 'initials', 'contract', 'agreement', 'draw', 'type', 'upload'],
      body: 'With PDFistic on Windows, you can sign agreements offline with three built-in signature workflows: draw directly with trackpad/mouse/pen, type your signature in clean calligraphic typography, or upload a signature image — then place, resize, and save it straight into your PDF without sending contracts to third-party web signers.'
    },
    {
      id: 'tools-hub',
      title: 'Offline PDF Tools Hub (Merge, Split, Compress, Reorder, PNG)',
      category: 'PDF Utilities',
      tags: ['tools', 'hub', 'merge', 'split', 'compress', 'reorder', 'rotate', 'delete', 'images', 'png', 'jpeg', 'batch'],
      body: 'PDF Tools Hub inside PDFistic includes five 100% local batch utilities built directly into the home dashboard: Merge PDFs (combine and order files), Split PDF (extract pages or ranges), Compress PDF (shrink large files locally), Reorder & Rotate Pages (visual grid organizer), and PDF to High-DPI PNG/JPEG Images. No internet connection or upload limit.'
    },
    {
      id: 'offline-ocr',
      title: 'Offline Tesseract OCR Scanner',
      category: 'OCR Engine',
      tags: ['ocr', 'scan', 'scanned', 'tesseract', 'extract', 'copy', 'text', 'searchable'],
      body: 'Stuck with a scanned book or image-only PDF? PDFistic includes local Tesseract OCR directly inside the Windows app (`OcrModal` & OCR text layer + RAG fallback), converting scanned pages into copyable, searchable text on your own CPU with zero external servers.'
    },
    {
      id: 'zernexa-byok',
      title: 'Zernexa AI Workspace & Multi-Provider BYOK Routing',
      category: 'Zernexa AI',
      tags: ['zernexa', 'ai', 'byok', 'gemini', 'openai', 'gpt', 'claude', 'anthropic', 'groq', 'openrouter', 'key', 'model', 'rag'],
      body: 'Zernexa is PDFistic’s docked & expandable AI study copilot. In the Windows app, you bring your own API keys (Gemini, OpenAI, Anthropic Claude, Groq, or OpenRouter) with multi-key rotation, automatic circuit-breaker failover, adaptive local document RAG chunking, inline clickable Page citations, and / Tools slash prompts.'
    },
    {
      id: 'ai-sandboxes',
      title: 'Rich AI Rendering: Math, Mermaid Diagrams, Mindmaps, Charts & Pyodide',
      category: 'AI Sandboxes',
      tags: ['math', 'latex', 'katex', 'mermaid', 'diagram', 'mindmap', 'chart', 'map', 'html', 'python', 'pyodide', 'table'],
      body: 'When studying STEM papers or datasets inside the Windows app, Zernexa renders far more than plain text: live KaTeX LaTeX equations, interactive Mermaid flowcharts, visual topic Mindmaps, interactive Charts, Leaflet Maps, HTML preview cards, and a local Pyodide Python code sandbox.'
    },
    {
      id: 'privacy-dpapi',
      title: 'Zero-Upload Privacy & Windows DPAPI Encrypted Key Vault',
      category: 'Privacy & Security',
      tags: ['privacy', 'offline', 'local', 'telemetry', 'dpapi', 'vault', 'encrypted', 'safe', 'security', 'files', 'upload'],
      body: 'Your PDFs, EPUBs, highlights, sticky notes, and bookmarks stay exclusively on your PC with zero cloud storage or document telemetry. Inside the Windows app, AI API keys are encrypted locally on-device using Windows DPAPI inside Key Vault — never uploaded to PDFistic servers.'
    },
    {
      id: 'themes-customization',
      title: 'Themes, Warm Paper Comfort, Wallpapers & Bilingual UI',
      category: 'Appearance',
      tags: ['theme', 'themes', 'light', 'paper', 'warm', 'dark', 'night', 'wallpaper', 'wallpapers', 'ambient', 'hindi', 'english', 'shortcut', 'shortcuts'],
      body: 'PDFistic ships curated Light Studios, Warm Paper eye-comfort presets, and Studio Dark themes alongside subtle ambient home wallpapers and liquid-glass chrome touches. The Windows app also includes a Command Palette (Ctrl+K), comprehensive keyboard shortcuts, and full English & Hindi language support.'
    },
    {
      id: 'web-demo-boundaries',
      title: 'What Works Live Here vs. Continuing to Windows App',
      category: 'Demo Guide',
      tags: ['demo', 'browser', 'website', 'preview', 'try', 'difference', 'limitations', 'continue', 'install'],
      body: 'Right here on the website preview, you can explore 3 curated 8-page PDFs + 1 dedicated 8-chapter Book-Mode EPUB, flip pages in 3D, test 1-Page continuous scroll, draw live yellow Highlights & red Ink strokes, use Eraser/Undo/Redo, switch Light/Warm Paper/Dark themes, search inside documents, and test this expandable Zernexa RAG guide. Features needing local disk access (opening your own PDFs, Merge/Split/Compress/OCR/Signatures/Save, custom API Key Vault) prompt "Continue to app" with a direct Microsoft Store link.'
    }
  ];

  var STOP_WORDS = {
    a: 1, an: 1, the: 1, is: 1, are: 1, was: 1, were: 1, be: 1, been: 1, being: 1,
    have: 1, has: 1, had: 1, do: 1, does: 1, did: 1, will: 1, would: 1, can: 1, could: 1,
    should: 1, may: 1, might: 1, what: 1, which: 1, who: 1, whom: 1, how: 1, why: 1, when: 1, where: 1,
    tell: 1, me: 1, about: 1, in: 1, on: 1, at: 1, to: 1, for: 1, of: 1, with: 1, from: 1, by: 1,
    it: 1, its: 1, this: 1, that: 1, these: 1, those: 1, and: 1, or: 1, but: 1, if: 1, my: 1, your: 1,
    app: 1, pdfistic: 1, please: 1, explain: 1, show: 1, give: 1, get: 1, use: 1, work: 1, works: 1
  };

  function tokenize(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s\-]/g, ' ')
      .split(/\s+/)
      .filter(function (w) { return w && w.length > 1; });
  }

  function expandQueryTokens(tokens) {
    var expanded = {};
    tokens.forEach(function (t) {
      if (!STOP_WORDS[t]) expanded[t] = (expanded[t] || 0) + 1;
      Object.keys(SYNONYM_MAP).forEach(function (rootKey) {
        var syns = SYNONYM_MAP[rootKey];
        if (t === rootKey || syns.indexOf(t) !== -1) {
          expanded[rootKey] = (expanded[rootKey] || 0) + 0.7;
          syns.forEach(function (s) {
            if (!expanded[s]) expanded[s] = 0.35;
          });
        }
      });
    });
    return expanded;
  }

  function retrieveChunks(query, topK) {
    var rawTokens = tokenize(query);
    var weights = expandQueryTokens(rawTokens);
    var ql = String(query || '').toLowerCase();

    var scored = KNOWLEDGE_CHUNKS.map(function (chunk, idx) {
      var hay = (chunk.title + ' ' + chunk.category + ' ' + chunk.tags.join(' ') + ' ' + chunk.body).toLowerCase();
      var hayWords = tokenize(hay);
      var tagSet = {};
      chunk.tags.forEach(function (tg) { tagSet[tg] = 1; });

      var score = 0;
      Object.keys(weights).forEach(function (tk) {
        var w = weights[tk];
        if (tagSet[tk]) score += 3.2 * w;
        if (chunk.title.toLowerCase().indexOf(tk) !== -1) score += 2.6 * w;
        var hits = 0;
        for (var i = 0; i < hayWords.length; i++) {
          if (hayWords[i] === tk || (tk.length >= 4 && hayWords[i].indexOf(tk) === 0)) hits++;
        }
        if (hits > 0) score += Math.min(3, hits) * 1.15 * w;
      });

      if (ql.indexOf('all') !== -1 && ql.indexOf('feature') !== -1 && (chunk.id === 'core-identity' || chunk.id === 'web-demo-boundaries')) {
        score += 4.5;
      }

      return { chunk: chunk, score: score, order: idx };
    });

    scored.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return a.order - b.order;
    });

    var k = topK || 4;
    var best = scored.filter(function (s) { return s.score > 0.2; }).slice(0, k);
    if (!best.length) {
      best = [scored[0], scored[1], scored[6], scored[8]].filter(Boolean).slice(0, k);
    }
    return best;
  }

  function buildPromptPayload(userQuery, history, demoState) {
    var hits = retrieveChunks(userQuery, 4);
    var contextBlock = [
      'RETRIEVED PDFISTIC CONTEXT:',
      hits.map(function (h, i) {
        return '[' + (i + 1) + ' | ' + h.chunk.category + '] ' + h.chunk.title + ': ' + h.chunk.body;
      }).join('\n'),
      '',
      'CURRENT DEMO VIEW: ' + (demoState && demoState.activeTabTitle
        ? ('Reading "' + demoState.activeTabTitle + '" (' + (demoState.activeFormat || 'pdf').toUpperCase() + ', page ' + (demoState.activePage || 1) + ')')
        : 'Home Library Showcase (3 PDFs + 1 Book-Mode EPUB + PDF Tools Hub preview)')
    ].join('\n');

    var apiMessages = [
      { role: 'system', content: SYSTEM_PROMPT + '\n\n' + contextBlock }
    ];
    if (Array.isArray(history)) {
      history.slice(-6).forEach(function (msg) {
        if (msg && msg.role && msg.text) {
          apiMessages.push({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: String(msg.text)
          });
        }
      });
    }
    apiMessages.push({ role: 'user', content: String(userQuery || '').trim() });

    return {
      systemPrompt: SYSTEM_PROMPT,
      contextBlock: contextBlock,
      retrievedChunks: hits.map(function (h) { return h.chunk; }),
      apiMessages: apiMessages
    };
  }

  function synthesizeOfflineRagReply(userQuery, hits, demoState) {
    var ql = String(userQuery || '').toLowerCase();
    var chunks = hits.map(function (h) { return h.chunk; });

    if (ql.indexOf('all feature') !== -1 || ql === '/features' || ql.indexOf('complete') !== -1 || ql.indexOf('everything') !== -1) {
      return {
        text: 'PDFistic combines 6 core engines on Windows 10/11:\n1. 3D Book Page-Turn + 1-Page PDF Scroll + Dedicated EPUB Book Mode\n2. Live Highlighter, Ink Pen, Eraser, Undo/Redo, Sticky Notes, Shapes, Signatures & PDF Save\n3. Offline PDF Tools Hub (Merge, Split, Compress, Reorder/Rotate, PDF-to-Images)\n4. Local Tesseract OCR scanner for scanned PDFs\n5. Dual Split-Screen & BookScope Optical Magnifier Lens\n6. Zernexa AI with BYOK (Gemini/OpenAI/Claude/Groq), Windows DPAPI Key Vault & local privacy.',
        categories: ['Overview', 'Reading Modes', 'Zernexa AI'],
        suggestDownload: true
      };
    }

    var primary = chunks[0];
    var secondary = chunks[1];
    var lines = [];
    if (primary) lines.push(primary.title + ': ' + primary.body);
    if (secondary && secondary.id !== primary.id) lines.push(secondary.title + ': ' + secondary.body);

    if (demoState && demoState.activeTabTitle && ql.indexOf('summar') !== -1 && demoState.pageExcerpt) {
      lines.unshift('On Page ' + demoState.activePage + ' of "' + demoState.activeTabTitle + '": ' + demoState.pageExcerpt);
    }

    return {
      text: lines.join('\n\n'),
      categories: chunks.slice(0, 3).map(function (c) { return c.category; }),
      suggestDownload: Boolean(
        ql.indexOf('download') !== -1 || ql.indexOf('windows') !== -1 || ql.indexOf('ocr') !== -1 ||
        ql.indexOf('merge') !== -1 || ql.indexOf('split') !== -1 || ql.indexOf('sign') !== -1 || ql.indexOf('app') !== -1
      )
    };
  }

  function parseExternalReply(data) {
    if (!data) return '';
    if (typeof data === 'string') return data;
    if (typeof data.reply === 'string') return data.reply;
    if (typeof data.answer === 'string') return data.answer;
    if (typeof data.text === 'string') return data.text;
    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      return String(data.choices[0].message.content);
    }
    if (data.candidates && data.candidates[0] && data.candidates[0].content && Array.isArray(data.candidates[0].content.parts)) {
      return data.candidates[0].content.parts.map(function (p) { return p.text || ''; }).join('');
    }
    return '';
  }

  globalScope.configurePdfisticZernexaAI = function (cfg) {
    globalScope.__PDFISTIC_AI_CONFIG__ = Object.assign({}, globalScope.__PDFISTIC_AI_CONFIG__ || {}, cfg || {});
  };

  async function queryZernexa(userQuery, history, demoState) {
    var payload = buildPromptPayload(userQuery, history, demoState);
    var cfg = globalScope.__PDFISTIC_AI_CONFIG__;

    if (cfg && cfg.endpoint) {
      try {
        var reqBody = typeof cfg.transformRequest === 'function'
          ? cfg.transformRequest(payload, userQuery, demoState)
          : {
              model: cfg.model || undefined,
              messages: payload.apiMessages,
              systemPrompt: payload.systemPrompt,
              context: payload.contextBlock,
              query: userQuery
            };
        var res = await fetch(cfg.endpoint, {
          method: 'POST',
          headers: Object.assign({ 'Content-Type': 'application/json' }, cfg.headers || {}),
          body: JSON.stringify(reqBody)
        });
        if (res.ok) {
          var rawJson = await res.json();
          var apiText = parseExternalReply(typeof cfg.extractReply === 'function' ? { reply: cfg.extractReply(rawJson) } : rawJson);
          if (apiText && apiText.trim()) {
            return {
              text: apiText.trim(),
              mode: 'live-api',
              categories: payload.retrievedChunks.map(function (c) { return c.category; }),
              payload: payload
            };
          }
        }
      } catch {}
    }

    var localHits = retrieveChunks(userQuery, 3);
    var synth = synthesizeOfflineRagReply(userQuery, localHits, demoState);
    return {
      text: synth.text,
      mode: 'rag-local',
      categories: synth.categories,
      suggestDownload: synth.suggestDownload,
      storeUrl: STORE_URL,
      payload: payload
    };
  }

  globalScope.PDFISTIC_ZERNEXA_RAG = {
    SYSTEM_PROMPT: SYSTEM_PROMPT,
    KNOWLEDGE_CHUNKS: KNOWLEDGE_CHUNKS,
    retrieveChunks: retrieveChunks,
    buildPromptPayload: buildPromptPayload,
    query: queryZernexa
  };
})(typeof window !== 'undefined' ? window : globalThis);
