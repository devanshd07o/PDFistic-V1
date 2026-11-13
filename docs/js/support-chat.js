/**
 * PDFistic Support & FAQ — Zernexa AI Chatbot & RAG Controller
 * Features:
 * - Live Draggable Mascot Launcher with natural hover tooltip & position persistence
 * - KokonutUI-inspired auto-resizing input card with tool tray
 * - High-quality Markdown text rendering with citation badges & copy buttons
 * - Client-side RAG chunk retrieval grounded on PDFistic architecture
 * - Responsive 60fps canvas pet states (idle, wave, listening, thinking, speaking)
 */
(function () {
  'use strict';

  var STORE_URL = 'https://apps.microsoft.com/detail/9PMCFQL187MN?hl=en-us&gl=IN&ocid=pdpshare';
  var STORAGE_KEY_POS = 'pdfistic_mascot_pos';

  var chatHistory = [];
  var floatingMascot = null;
  var inPageMascot = null;
  var headerMascot = null;
  var isGenerating = false;
  var typingTimer = null;

  function escHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function (m) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
    });
  }

  function getTimeString() {
    var d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  /**
   * Premium Markdown & Text Renderer
   * Renders structured titles, bullet lists, numbered badges, code chips, and citations.
   */
  function formatMarkdown(text, category) {
    var raw = String(text || '').trim();
    var lines = raw.split('\n');
    var htmlLines = [];
    var inList = false;
    var listType = null; // 'ol' or 'ul'

    function closeList() {
      if (inList) {
        htmlLines.push('</ul>');
        inList = false;
        listType = null;
      }
    }

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line) {
        closeList();
        continue;
      }

      // Detect "Title: Body" format on the first line
      if (i === 0 && line.indexOf(': ') !== -1 && !line.match(/^(\d+\.|\-|\*)/)) {
        var colonIdx = line.indexOf(': ');
        var head = line.slice(0, colonIdx);
        var rest = line.slice(colonIdx + 2);
        htmlLines.push('<div class="chat-msg-title">' + escHtml(head) + '</div>');
        if (rest) {
          htmlLines.push('<p style="margin:0 0 6px 0;">' + processInline(rest) + '</p>');
        }
        continue;
      }

      // Ordered list (e.g. "1. Feature description")
      var olMatch = line.match(/^(\d+)\.\s+(.+)$/);
      if (olMatch) {
        if (!inList || listType !== 'ol') {
          closeList();
          htmlLines.push('<ul class="chat-msg-list">');
          inList = true;
          listType = 'ol';
        }
        htmlLines.push('<li class="chat-list-num"><span class="chat-num-idx">' + olMatch[1] + '</span><span>' + processInline(olMatch[2]) + '</span></li>');
        continue;
      }

      // Unordered bullet list (e.g. "- Feature" or "* Feature")
      var ulMatch = line.match(/^[\-\*]\s+(.+)$/);
      if (ulMatch) {
        if (!inList || listType !== 'ul') {
          closeList();
          htmlLines.push('<ul class="chat-msg-list">');
          inList = true;
          listType = 'ul';
        }
        htmlLines.push('<li class="chat-list-bullet"><span class="chat-bullet-dot">&bull;</span><span>' + processInline(ulMatch[1]) + '</span></li>');
        continue;
      }

      // Normal paragraph
      closeList();
      htmlLines.push('<p style="margin: 0 0 6px 0;">' + processInline(line) + '</p>');
    }

    closeList();

    var fullHtml = htmlLines.join('\n');

    // Add Grounding Citation Bar if available
    if (category) {
      fullHtml += [
        '<div class="chat-citation-bar">',
        '  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
        '  <span>Grounded in: ' + escHtml(category) + '</span>',
        '</div>'
      ].join('\n');
    }

    return fullHtml;
  }

  function processInline(str) {
    var safe = escHtml(str);
    // Bold: **text**
    safe = safe.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Inline code: `code`
    safe = safe.replace(/`([^`]+)`/g, '<code class="chat-inline-code">$1</code>');
    return safe;
  }

  function initMascots() {
    var floatCanvas = document.getElementById('zernexaFloatMascotCanvas');
    if (floatCanvas && window.ZernexaMascot) {
      floatingMascot = new window.ZernexaMascot({ canvas: floatCanvas });
      floatingMascot.start();
    }

    var inPageCanvas = document.getElementById('zernexaInPageMascotCanvas');
    if (inPageCanvas && window.ZernexaMascot) {
      inPageMascot = new window.ZernexaMascot({ canvas: inPageCanvas });
      inPageMascot.start();
    }

    var headerCanvas = document.getElementById('zernexaHeaderMascotCanvas');
    if (headerCanvas && window.ZernexaMascot) {
      headerMascot = new window.ZernexaMascot({ canvas: headerCanvas });
      headerMascot.start();
    }
  }

  function setAllMascotsState(state, callback) {
    if (floatingMascot) floatingMascot.setState(state, callback);
    if (inPageMascot) inPageMascot.setState(state, callback);
    if (headerMascot) headerMascot.setState(state, callback);
  }

  function openChatWidget() {
    var widget = document.getElementById('zernexaChatWidget');
    var launcher = document.getElementById('zernexaMascotLauncher');
    if (!widget) return;

    widget.classList.add('is-open');
    if (launcher) {
      launcher.setAttribute('aria-expanded', 'true');
    }

    if (headerMascot) {
      headerMascot.wave();
    }

    var textarea = document.getElementById('zernexaChatInput');
    if (textarea) {
      setTimeout(function () { textarea.focus(); }, 150);
    }
  }

  function closeChatWidget() {
    var widget = document.getElementById('zernexaChatWidget');
    var launcher = document.getElementById('zernexaMascotLauncher');
    if (!widget) return;

    widget.classList.remove('is-open');
    if (launcher) {
      launcher.setAttribute('aria-expanded', 'false');
    }
    setAllMascotsState('idle_blink');
  }

  function clearChatHistory() {
    var container = document.getElementById('zernexaChatMessages');
    if (!container) return;
    chatHistory = [];
    container.innerHTML = [
      '<div class="chat-bubble chat-bubble--bot">',
      '  <div class="chat-avatar chat-avatar--bot">',
      '    <img src="assets/zernexa.png" alt="Zernexa AI">',
      '  </div>',
      '  <div class="chat-bubble-content">',
      '    <div class="chat-bubble-meta">',
      '      <span class="chat-bubble-author">Zernexa AI Copilot</span>',
      '      <span class="chat-bubble-source">Local Guide</span>',
      '      <span class="chat-bubble-time">' + getTimeString() + '</span>',
      '    </div>',
      '    <div class="chat-bubble-text">',
      '      Conversation reset. Ask me anything about PDFistic reading modes, 3D page curls, offline OCR, or privacy on Windows 10 &amp; 11.',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');
    setupCopyButtons();
  }

  function appendMessage(role, rawText, options) {
    options = options || {};
    var container = document.getElementById('zernexaChatMessages');
    if (!container) return null;

    var msgEl = document.createElement('div');
    msgEl.className = 'chat-bubble ' + (role === 'user' ? 'chat-bubble--user' : 'chat-bubble--bot');

    var avatarHtml = role === 'user'
      ? '<div class="chat-avatar chat-avatar--user"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>'
      : '<div class="chat-avatar chat-avatar--bot"><img src="assets/zernexa.png" alt="Zernexa AI"></div>';

    var htmlContent = formatMarkdown(rawText, options.category);

    var ctaHtml = '';
    if (options.suggestDownload || options.alwaysShowCta) {
      ctaHtml = [
        '<div class="chat-msg-cta">',
        '  <a href="' + STORE_URL + '" target="_blank" rel="noopener noreferrer" class="chat-download-btn">',
        '    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.949-1.801"/></svg>',
        '    <span>Get Free on Microsoft Store</span>',
        '    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
        '  </a>',
        '</div>'
      ].join('\n');
    }

    var copyActionHtml = role === 'bot'
      ? [
        '<div class="chat-bubble-actions">',
        '  <button type="button" class="chat-copy-btn" aria-label="Copy message" title="Copy response">',
        '    <svg class="copy-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
        '    <svg class="check-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
        '    <span>Copy</span>',
        '  </button>',
        '</div>'
      ].join('\n')
      : '';

    msgEl.innerHTML = [
      avatarHtml,
      '<div class="chat-bubble-content">',
      '  <div class="chat-bubble-meta">',
      '    <span class="chat-bubble-author">' + (role === 'user' ? 'You' : 'Zernexa AI Copilot') + '</span>',
      '    ' + (role === 'bot' ? '<span class="chat-bubble-source">Local RAG</span>' : ''),
      '    <span class="chat-bubble-time">' + getTimeString() + '</span>',
      '  </div>',
      '  <div class="chat-bubble-text">' + htmlContent + '</div>',
      copyActionHtml,
      ctaHtml,
      '</div>'
    ].join('\n');

    container.appendChild(msgEl);
    container.scrollTop = container.scrollHeight;

    chatHistory.push({ role: role, text: rawText });
    setupCopyButtons();
    return msgEl;
  }

  function appendTypingIndicator() {
    var container = document.getElementById('zernexaChatMessages');
    if (!container) return null;

    var ind = document.createElement('div');
    ind.className = 'chat-bubble chat-bubble--bot chat-bubble--typing';
    ind.id = 'zernexaTypingIndicator';
    ind.innerHTML = [
      '<div class="chat-avatar chat-avatar--bot"><img src="assets/zernexa.png" alt="Zernexa AI"></div>',
      '<div class="chat-bubble-content">',
      '  <div class="chat-bubble-meta">',
      '    <span class="chat-bubble-author">Zernexa AI Copilot</span>',
      '    <span class="chat-bubble-source">Searching Knowledge Base</span>',
      '  </div>',
      '  <div class="chat-bubble-text">',
      '    <div class="typing-dots">',
      '      <span></span><span></span><span></span>',
      '      <span class="typing-label">Thinking...</span>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');

    container.appendChild(ind);
    container.scrollTop = container.scrollHeight;
    return ind;
  }

  function removeTypingIndicator() {
    var ind = document.getElementById('zernexaTypingIndicator');
    if (ind && ind.parentNode) {
      ind.parentNode.removeChild(ind);
    }
  }

  function setupCopyButtons() {
    var buttons = document.querySelectorAll('.chat-copy-btn');
    buttons.forEach(function (btn) {
      if (btn.getAttribute('data-has-listener')) return;
      btn.setAttribute('data-has-listener', 'true');
      btn.addEventListener('click', function () {
        var textEl = btn.closest('.chat-bubble-content').querySelector('.chat-bubble-text');
        if (!textEl) return;
        var textToCopy = textEl.innerText || textEl.textContent || '';
        navigator.clipboard.writeText(textToCopy).then(function () {
          btn.classList.add('is-copied');
          var span = btn.querySelector('span');
          if (span) span.textContent = 'Copied!';
          setTimeout(function () {
            btn.classList.remove('is-copied');
            if (span) span.textContent = 'Copy';
          }, 2000);
        }).catch(function () {});
      });
    });
  }

  async function handleUserQuery(query) {
    var q = String(query || '').trim();
    if (!q || isGenerating) return;

    isGenerating = true;
    openChatWidget();

    appendMessage('user', q);

    var textarea = document.getElementById('zernexaChatInput');
    var sendBtn = document.getElementById('zernexaSendBtn');
    if (textarea) {
      textarea.value = '';
      textarea.style.height = 'auto';
    }
    if (sendBtn) {
      sendBtn.disabled = true;
    }
    var inPageInput = document.getElementById('zernexaInPageInput');
    if (inPageInput) inPageInput.value = '';

    setAllMascotsState('thinking');
    appendTypingIndicator();

    try {
      await new Promise(function (r) { setTimeout(r, 450); });

      var result = null;
      if (window.PDFISTIC_ZERNEXA_RAG && typeof window.PDFISTIC_ZERNEXA_RAG.query === 'function') {
        result = await window.PDFISTIC_ZERNEXA_RAG.query(q, chatHistory, null);
      } else {
        result = {
          text: 'PDFistic is a native Windows 10 & 11 reading studio with 3D Book Page-Turn, EPUB reader, offline OCR, PDF tools, and local DPAPI privacy.',
          categories: ['Overview'],
          suggestDownload: true
        };
      }

      removeTypingIndicator();
      setAllMascotsState('speaking');

      var primaryCategory = (result.categories && result.categories.length) ? result.categories[0] : null;

      appendMessage('bot', result.text, {
        category: primaryCategory,
        suggestDownload: result.suggestDownload || q.toLowerCase().indexOf('download') !== -1 || q.toLowerCase().indexOf('install') !== -1
      });

      setTimeout(function () {
        setAllMascotsState('idle_blink');
      }, 2800);

    } catch (err) {
      removeTypingIndicator();
      setAllMascotsState('idle_blink');
      appendMessage('bot', 'PDFistic runs completely offline on Windows 10 and 11. You can open any PDF or EPUB, highlight and annotate, and run PDF utilities without an account. Download it free from Microsoft Store.', {
        category: 'Windows Desktop App',
        suggestDownload: true
      });
    } finally {
      isGenerating = false;
      if (textarea) {
        textarea.disabled = false;
        textarea.focus();
      }
    }
  }

  /**
   * Draggable Mascot Launcher Setup
   * Stays in one place, animates, drags across the full viewport,
   * snaps to safe margins, persists position in localStorage.
   */
  function setupDraggableMascot() {
    var launcher = document.getElementById('zernexaMascotLauncher');
    if (!launcher) return;

    // Restore saved position
    try {
      var saved = localStorage.getItem(STORAGE_KEY_POS);
      if (saved) {
        var pos = JSON.parse(saved);
        if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
          var maxX = window.innerWidth - launcher.offsetWidth - 12;
          var maxY = window.innerHeight - launcher.offsetHeight - 12;
          var clampedX = Math.max(12, Math.min(maxX, pos.x));
          var clampedY = Math.max(12, Math.min(maxY, pos.y));
          launcher.style.left = clampedX + 'px';
          launcher.style.top = clampedY + 'px';
          launcher.style.right = 'auto';
          launcher.style.bottom = 'auto';
        }
      }
    } catch (_) {}

    var isPointerDown = false;
    var hasMoved = false;
    var startX = 0;
    var startY = 0;
    var initLeft = 0;
    var initTop = 0;
    var dragThreshold = 6;

    launcher.addEventListener('pointerdown', function (e) {
      // Primary button only
      if (e.button !== 0) return;
      isPointerDown = true;
      hasMoved = false;
      startX = e.clientX;
      startY = e.clientY;

      var rect = launcher.getBoundingClientRect();
      initLeft = rect.left;
      initTop = rect.top;

      launcher.setPointerCapture(e.pointerId);
    });

    launcher.addEventListener('pointermove', function (e) {
      if (!isPointerDown) return;
      var dx = e.clientX - startX;
      var dy = e.clientY - startY;

      if (!hasMoved && Math.hypot(dx, dy) > dragThreshold) {
        hasMoved = true;
        launcher.classList.add('is-dragging');
      }

      if (hasMoved) {
        var newX = initLeft + dx;
        var newY = initTop + dy;

        // Boundary clamp
        var maxX = window.innerWidth - launcher.offsetWidth - 12;
        var maxY = window.innerHeight - launcher.offsetHeight - 12;
        newX = Math.max(12, Math.min(maxX, newX));
        newY = Math.max(12, Math.min(maxY, newY));

        launcher.style.left = newX + 'px';
        launcher.style.top = newY + 'px';
        launcher.style.right = 'auto';
        launcher.style.bottom = 'auto';
      }
    });

    function endDrag(e) {
      if (!isPointerDown) return;
      isPointerDown = false;
      launcher.classList.remove('is-dragging');

      try {
        launcher.releasePointerCapture(e.pointerId);
      } catch (_) {}

      if (hasMoved) {
        // Persist new position
        try {
          var rect = launcher.getBoundingClientRect();
          localStorage.setItem(STORAGE_KEY_POS, JSON.stringify({ x: rect.left, y: rect.top }));
        } catch (_) {}
      } else {
        // Clean click -> Toggle chat widget
        var widget = document.getElementById('zernexaChatWidget');
        if (widget && widget.classList.contains('is-open')) {
          closeChatWidget();
        } else {
          openChatWidget();
        }
      }
    }

    launcher.addEventListener('pointerup', endDrag);
    launcher.addEventListener('pointercancel', endDrag);

    // Hover animation: Wave occasionally when mouse enters
    launcher.addEventListener('mouseenter', function () {
      if (!isGenerating && floatingMascot) {
        floatingMascot.setState('hi_wave', function () {
          floatingMascot.setState('idle_blink');
        });
      }
    });

    // Keyboard support (Enter/Space opens chat)
    launcher.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openChatWidget();
      }
    });

    // Window resize safeguard
    window.addEventListener('resize', function () {
      var rect = launcher.getBoundingClientRect();
      var maxX = window.innerWidth - launcher.offsetWidth - 12;
      var maxY = window.innerHeight - launcher.offsetHeight - 12;
      if (rect.left > maxX || rect.top > maxY) {
        launcher.style.left = Math.max(12, Math.min(maxX, rect.left)) + 'px';
        launcher.style.top = Math.max(12, Math.min(maxY, rect.top)) + 'px';
      }
    });
  }

  function setupEventListeners() {
    setupDraggableMascot();

    var keyBtn = document.getElementById('zernexaChatKeyBtn');
    if (keyBtn) {
      keyBtn.addEventListener('click', function () {
        var currentKey = '';
        try { currentKey = localStorage.getItem('pdfistic_groq_key') || ''; } catch (_) {}
        var promptMsg = currentKey
          ? 'Enter your Groq API Key (leave empty to remove and use offline RAG):'
          : 'Enter your Groq API Key (starts with gsk_):';
        var newKey = window.prompt(promptMsg, currentKey);
        if (newKey !== null) {
          var clean = newKey.trim();
          try {
            if (clean) {
              localStorage.setItem('pdfistic_groq_key', clean);
              appendMessage('bot', '**Groq API Key activated.** Live LLM with grounded RAG context is now active for this browser session.');
            } else {
              localStorage.removeItem('pdfistic_groq_key');
              appendMessage('bot', 'Groq API Key removed. Reverted to 100% offline client-side RAG engine.');
            }
          } catch (_) {}
        }
      });
    }

    var closeBtn = document.getElementById('zernexaChatClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeChatWidget);
    }

    var clearBtn = document.getElementById('zernexaChatClear');
    if (clearBtn) {
      clearBtn.addEventListener('click', clearChatHistory);
    }

    // KokonutUI ai-prompt Textarea Controller
    var form = document.getElementById('zernexaChatForm');
    var textarea = document.getElementById('zernexaChatInput');
    var sendBtn = document.getElementById('zernexaSendBtn');

    if (form && textarea) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        handleUserQuery(textarea.value);
      });

      // Auto-resize textarea & toggle submit button
      textarea.addEventListener('input', function () {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';

        var hasValue = textarea.value.trim().length > 0;
        if (sendBtn) {
          sendBtn.disabled = !hasValue || isGenerating;
        }

        if (!isGenerating) {
          setAllMascotsState('listening');
          clearTimeout(typingTimer);
          typingTimer = setTimeout(function () {
            if (!isGenerating) setAllMascotsState('idle_blink');
          }, 1800);
        }
      });

      // Enter to send, Shift+Enter for newline
      textarea.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          if (textarea.value.trim().length > 0 && !isGenerating) {
            handleUserQuery(textarea.value);
          }
        }
      });
    }

    // In-page Hero Input
    var inPageForm = document.getElementById('zernexaInPageForm');
    var inPageInput = document.getElementById('zernexaInPageInput');
    if (inPageForm && inPageInput) {
      inPageForm.addEventListener('submit', function (e) {
        e.preventDefault();
        handleUserQuery(inPageInput.value);
      });

      inPageInput.addEventListener('input', function () {
        if (!isGenerating) {
          setAllMascotsState('listening');
          clearTimeout(typingTimer);
          typingTimer = setTimeout(function () {
            if (!isGenerating) setAllMascotsState('idle_blink');
          }, 1800);
        }
      });
    }

    // Quick starter chips and buttons with [data-zernexa-prompt]
    document.querySelectorAll('[data-zernexa-prompt]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-zernexa-prompt');
        if (text) {
          handleUserQuery(text);
        }
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var widget = document.getElementById('zernexaChatWidget');
        if (widget && widget.classList.contains('is-open')) {
          closeChatWidget();
        }
      }
    });

    setupCopyButtons();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMascots();
    setupEventListeners();
  });
})();
