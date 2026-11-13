/**
 * PDFistic Zernexa AI Support Assistant — Production Controller
 * Clean, human, zero-slop conversational UI inspired by Shadcn UI and Flowbite.
 */
(function () {
  'use strict';

  var STORE_URL = 'https://apps.microsoft.com/detail/9PMCFQL187MN?hl=en-us&gl=IN&ocid=pdpshare';
  var STORAGE_KEY_POS = 'pdfistic_mascot_pos';
  var BOT_AVATAR_SRC = 'assets/pet/idle_blink/frame_1.webp';

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

  function processInline(str) {
    var safe = escHtml(str);
    safe = safe.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    safe = safe.replace(/`([^`]+)`/g, '<code class="chat-inline-code">$1</code>');
    return safe;
  }

  /**
   * Clean Markdown & Text Renderer (Zero internal jargon)
   */
  function formatMarkdown(text) {
    var raw = String(text || '').trim();
    var lines = raw.split('\n');
    var htmlLines = [];
    var inList = false;
    var listType = null;

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

      // Detect sub-headings like "### Feature" or "Title:"
      if (line.match(/^###\s+(.+)$/)) {
        closeList();
        htmlLines.push('<div class="chat-msg-title">' + processInline(line.replace(/^###\s+/, '')) + '</div>');
        continue;
      }

      // Ordered list
      var olMatch = line.match(/^(\d+)\.\s+(.+)$/);
      if (olMatch) {
        if (!inList || listType !== 'ol') {
          closeList();
          htmlLines.push('<ul class="chat-msg-list">');
          inList = true;
          listType = 'ol';
        }
        htmlLines.push('<li class="chat-list-num"><span class="chat-num-idx">' + olMatch[1] + '.</span><span>' + processInline(olMatch[2]) + '</span></li>');
        continue;
      }

      // Bullet list
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
      htmlLines.push('<p>' + processInline(line) + '</p>');
    }

    closeList();
    return htmlLines.join('\n');
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

    var input = document.getElementById('zernexaChatInput');
    if (input) {
      setTimeout(function () { input.focus(); }, 120);
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
      '  <div class="chat-avatar"><img src="' + BOT_AVATAR_SRC + '" alt="Zernexa AI"></div>',
      '  <div class="chat-bubble-body">',
      '    <div class="chat-bubble-text">',
      '      Conversation reset. Ask me anything about PDFistic reading modes, 3D page curls, offline OCR, or privacy on Windows.',
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
      ? ''
      : '<div class="chat-avatar"><img src="' + BOT_AVATAR_SRC + '" alt="Zernexa AI"></div>';

    var htmlContent = formatMarkdown(rawText);

    var ctaHtml = '';
    if (options.suggestDownload) {
      ctaHtml = [
        '<div class="chat-msg-cta">',
        '  <a href="' + STORE_URL + '" target="_blank" rel="noopener noreferrer" class="chat-download-btn">',
        '    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.949-1.801"/></svg>',
        '    <span>Get Free on Microsoft Store</span>',
        '  </a>',
        '</div>'
      ].join('\n');
    }

    var copyActionHtml = role === 'bot'
      ? [
        '<button type="button" class="chat-copy-btn" aria-label="Copy message" title="Copy response">',
        '  <svg class="copy-icon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
        '  <svg class="check-icon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
        '  <span>Copy</span>',
        '</button>'
      ].join('\n')
      : '';

    msgEl.innerHTML = [
      avatarHtml,
      '<div class="chat-bubble-body">',
      '  <div class="chat-bubble-text">' + htmlContent + '</div>',
      ctaHtml,
      copyActionHtml,
      '</div>'
    ].join('\n');

    container.appendChild(msgEl);
    container.scrollTop = container.scrollHeight;

    chatHistory.push({ role: role, text: rawText });
    setupCopyButtons();
    return msgEl;
  }

  /**
   * Horizontal 3-Dot Typing Bubble (Zero vertical text)
   */
  function appendTypingIndicator() {
    var container = document.getElementById('zernexaChatMessages');
    if (!container) return null;

    var ind = document.createElement('div');
    ind.className = 'chat-bubble chat-bubble--bot chat-bubble--typing';
    ind.id = 'zernexaTypingIndicator';
    ind.innerHTML = [
      '<div class="chat-avatar"><img src="' + BOT_AVATAR_SRC + '" alt="Zernexa AI"></div>',
      '<div class="chat-bubble-body">',
      '  <div class="typing-bubble">',
      '    <span class="typing-dot"></span>',
      '    <span class="typing-dot"></span>',
      '    <span class="typing-dot"></span>',
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
        var textEl = btn.closest('.chat-bubble-body').querySelector('.chat-bubble-text');
        if (!textEl) return;
        var textToCopy = textEl.innerText || textEl.textContent || '';
        navigator.clipboard.writeText(textToCopy).then(function () {
          btn.classList.add('is-copied');
          var span = btn.querySelector('span');
          if (span) span.textContent = 'Copied';
          setTimeout(function () {
            btn.classList.remove('is-copied');
            if (span) span.textContent = 'Copy';
          }, 1800);
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

    var input = document.getElementById('zernexaChatInput');
    var sendBtn = document.getElementById('zernexaSendBtn');
    if (input) input.value = '';
    if (sendBtn) sendBtn.disabled = true;

    var inPageInput = document.getElementById('zernexaInPageInput');
    if (inPageInput) inPageInput.value = '';

    setAllMascotsState('thinking');
    appendTypingIndicator();

    try {
      await new Promise(function (r) { setTimeout(r, 400); });

      var result = null;
      if (window.PDFISTIC_ZERNEXA_RAG && typeof window.PDFISTIC_ZERNEXA_RAG.query === 'function') {
        result = await window.PDFISTIC_ZERNEXA_RAG.query(q, chatHistory, null);
      } else {
        result = {
          text: 'PDFistic is a fast, offline Windows reading studio with 3D Book Page-Turn, dedicated EPUB reader, offline OCR, and local DPAPI privacy.',
          suggestDownload: true
        };
      }

      removeTypingIndicator();
      setAllMascotsState('speaking');

      appendMessage('bot', result.text, {
        suggestDownload: result.suggestDownload || q.toLowerCase().indexOf('download') !== -1 || q.toLowerCase().indexOf('install') !== -1
      });

      setTimeout(function () {
        setAllMascotsState('idle_blink');
      }, 2500);

    } catch (err) {
      removeTypingIndicator();
      setAllMascotsState('idle_blink');
      appendMessage('bot', 'PDFistic runs completely offline on Windows 10 and 11. You can open any PDF or EPUB, highlight, and run PDF utilities without an account. Download it free from Microsoft Store.', {
        suggestDownload: true
      });
    } finally {
      isGenerating = false;
      if (input) {
        input.disabled = false;
        input.focus();
      }
    }
  }

  /**
   * Draggable Mascot Launcher Setup
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
        try {
          var rect = launcher.getBoundingClientRect();
          localStorage.setItem(STORAGE_KEY_POS, JSON.stringify({ x: rect.left, y: rect.top }));
        } catch (_) {}
      } else {
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

    launcher.addEventListener('mouseenter', function () {
      if (!isGenerating && floatingMascot) {
        floatingMascot.setState('hi_wave', function () {
          floatingMascot.setState('idle_blink');
        });
      }
    });

    launcher.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openChatWidget();
      }
    });

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

    var closeBtn = document.getElementById('zernexaChatClose');
    if (closeBtn) closeBtn.addEventListener('click', closeChatWidget);

    var clearBtn = document.getElementById('zernexaChatClear');
    if (clearBtn) clearBtn.addEventListener('click', clearChatHistory);

    var form = document.getElementById('zernexaChatForm');
    var input = document.getElementById('zernexaChatInput');
    var sendBtn = document.getElementById('zernexaSendBtn');

    if (form && input) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        handleUserQuery(input.value);
      });

      input.addEventListener('input', function () {
        var hasVal = input.value.trim().length > 0;
        if (sendBtn) sendBtn.disabled = !hasVal || isGenerating;

        if (!isGenerating) {
          setAllMascotsState('listening');
          clearTimeout(typingTimer);
          typingTimer = setTimeout(function () {
            if (!isGenerating) setAllMascotsState('idle_blink');
          }, 1800);
        }
      });
    }

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

    document.querySelectorAll('[data-zernexa-prompt]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var text = btn.getAttribute('data-zernexa-prompt');
        if (text) handleUserQuery(text);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var widget = document.getElementById('zernexaChatWidget');
        if (widget && widget.classList.contains('is-open')) closeChatWidget();
      }
    });

    setupCopyButtons();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMascots();
    setupEventListeners();
  });
})();
