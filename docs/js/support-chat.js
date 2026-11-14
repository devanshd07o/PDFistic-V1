/**
 * PDFistic Zernexa AI Support Assistant — Desktop App Mirror Controller
 * Seamlessly manages the DITTO Desktop Zernexa Copilot experience:
 * - Empty Stage with Dynamic Greeting & Elevated Floating Input Card
 * - Interactive / Tools Dropup Menu (KokonutUI & OriginUI Pattern)
 * - Interactive Context Scope Popover Selector
 * - Speech-to-Text / Voice Dictation Button with Active Pulsing Ring
 * - Live Undulating Fluid Dot Wave Canvas (60fps Sine/Cosine Physics from Desktop App)
 * - Seamless Transition to Active Conversation Stream + Docked Bottom Input
 * - Full GitHub Flavored Markdown (GFM) Parsing & Responsive Table Scroll Wrappers
 * - Complete Reset via 3-Dots Menu
 * - Draggable Mascot Launcher with Strict Chat-Open Isolation
 */
(function () {
  'use strict';

  var STORE_URL = 'https://apps.microsoft.com/detail/9PMCFQL187MN?hl=en-us&gl=IN&ocid=pdpshare';
  var STORAGE_KEY_POS = 'pdfistic_mascot_pos';
  var BOT_AVATAR_SRC = 'assets/pet/idle_blink/frame_1.webp';

  var chatHistory = [];
  var floatingMascot = null;
  var heroMascot = null;
  var inPageMascot = null;
  var headerMascot = null;
  var isGenerating = false;
  var typingTimer = null;
  var waveAnimId = null;
  var waveRunning = false;

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

  function getDynamicGreeting() {
    var hr = new Date().getHours();
    if (hr >= 5 && hr < 12) return 'Good morning, Reader';
    if (hr >= 12 && hr < 17) return 'Good afternoon, Reader';
    if (hr >= 17 && hr < 22) return 'Good evening, Reader';
    return 'Late night flow, Reader';
  }

  function formatMarkdown(text) {
    var raw = String(text || '').trim();
    if (!raw) return '';

    if (typeof window.marked !== 'undefined' && typeof window.marked.parse === 'function') {
      try {
        if (typeof window.marked.setOptions === 'function') {
          window.marked.setOptions({
            gfm: true,
            breaks: true
          });
        }
        var parsed = window.marked.parse(raw);
        // Wrap all <table> elements with responsive scroll container
        parsed = parsed.replace(/<table(\s*[^>]*)>/gi, '<div class="chat-table-wrap"><div class="ai-table-scroll"><table$1>');
        parsed = parsed.replace(/<\/table>/gi, '</table></div></div>');
        return parsed;
      } catch (err) {
        console.warn('marked.js parse fallback:', err);
      }
    }

    // Fallback markdown parsing with table support
    var lines = raw.split('\n');
    var htmlLines = [];
    var inList = false;
    var listType = null;
    var inTable = false;
    var tableRows = [];

    function closeList() {
      if (inList) {
        htmlLines.push('</ul>');
        inList = false;
        listType = null;
      }
    }

    function flushTable() {
      if (!inTable) return;
      if (tableRows.length > 0) {
        var tableHtml = ['<div class="chat-table-wrap"><div class="ai-table-scroll"><table>'];
        var isHeader = true;
        for (var t = 0; t < tableRows.length; t++) {
          var row = tableRows[t];
          if (row.every(function (cell) { return /^[\s\-:]+$/.test(cell); })) {
            isHeader = false;
            continue;
          }
          tableHtml.push('<tr>');
          var tag = isHeader ? 'th' : 'td';
          for (var c = 0; c < row.length; c++) {
            tableHtml.push('<' + tag + '>' + processInline(row[c]) + '</' + tag + '>');
          }
          tableHtml.push('</tr>');
          if (isHeader) isHeader = false;
        }
        tableHtml.push('</table></div></div>');
        htmlLines.push(tableHtml.join(''));
      }
      inTable = false;
      tableRows = [];
    }

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line) {
        closeList();
        flushTable();
        continue;
      }

      // Detect table rows
      if (line.indexOf('|') !== -1 && (line.startsWith('|') || line.endsWith('|'))) {
        closeList();
        inTable = true;
        var cells = line.split('|').map(function (c) { return c.trim(); });
        if (line.startsWith('|')) cells.shift();
        if (line.endsWith('|')) cells.pop();
        tableRows.push(cells);
        continue;
      } else {
        flushTable();
      }

      // Subheadings
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
    flushTable();
    return htmlLines.join('\n');
  }

  /**
   * Organic Fluid Dot Wave Canvas (Desktop App Signature Texture)
   */
  function startFluidDotWave() {
    var canvas = document.getElementById('zernexaDotWaveCanvas');
    if (!canvas || waveRunning) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    waveRunning = true;
    var width = 0;
    var h = 0;
    var startTime = performance.now();

    function resize() {
      var rect = canvas.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      h = rect.height;
      if (width > 0 && h > 0) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(h * dpr);
        ctx.scale(dpr, dpr);
      }
    }

    resize();
    window.addEventListener('resize', resize);

    var SPACING = 18;
    var MIN_RADIUS = 0.9;
    var MAX_RADIUS = 2.2;

    function render(now) {
      if (!waveRunning) return;
      var elapsed = now - startTime;
      ctx.clearRect(0, 0, width, h);

      if (width > 0 && h > 0) {
        var cols = Math.floor(width / SPACING) + 1;
        var rows = Math.floor(h / SPACING) + 1;
        var offsetX = (width - (cols - 1) * SPACING) / 2;
        var baseBottomY = h - 6;

        ctx.fillStyle = '#93C5FD';

        for (var c = 0; c < cols; c++) {
          var x = offsetX + c * SPACING;
          var s1 = Math.sin(x * 0.009 + elapsed * 0.001);
          var s2 = Math.cos(x * 0.021 - elapsed * 0.0014 + 1.6);
          var s3 = Math.sin(x * 0.035 + elapsed * 0.0018 + 3.1) * 0.4;
          var surfaceNorm = (s1 * 0.45 + s2 * 0.35 + s3 * 0.2 + 1.0) / 2.0;
          var clampedSurface = Math.max(0.15, Math.min(0.88, surfaceNorm));
          var surfaceY = baseBottomY - clampedSurface * (h * 0.70);

          for (var r = 0; r < rows; r++) {
            var baseY = baseBottomY - r * SPACING;
            if (baseY > surfaceY) {
              var depth = baseY - surfaceY;
              var factor = Math.min(1, depth / (h * 0.55));
              var radius = MIN_RADIUS + (MAX_RADIUS - MIN_RADIUS) * (1 - factor * 0.6);
              var dotAlpha = (1 - factor * 0.65) * 0.70;

              ctx.globalAlpha = Math.max(0.04, dotAlpha);
              ctx.beginPath();
              ctx.arc(x, baseY, radius, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      waveAnimId = requestAnimationFrame(render);
    }

    waveAnimId = requestAnimationFrame(render);
  }

  function stopFluidDotWave() {
    waveRunning = false;
    if (waveAnimId) {
      cancelAnimationFrame(waveAnimId);
      waveAnimId = null;
    }
  }

  function initMascots() {
    var floatCanvas = document.getElementById('zernexaFloatMascotCanvas');
    if (floatCanvas && window.ZernexaMascot) {
      floatingMascot = new window.ZernexaMascot({ canvas: floatCanvas });
      floatingMascot.start();
    }

    var heroCanvas = document.getElementById('zernexaHeroMascotCanvas');
    if (heroCanvas && window.ZernexaMascot) {
      heroMascot = new window.ZernexaMascot({ canvas: heroCanvas });
      heroMascot.start();
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
    if (heroMascot) heroMascot.setState(state, callback);
    if (inPageMascot) inPageMascot.setState(state, callback);
    if (headerMascot) headerMascot.setState(state, callback);
  }

  function openChatWidget() {
    var widget = document.getElementById('zernexaChatWidget');
    var launcher = document.getElementById('zernexaMascotLauncher');
    if (!widget) return;

    widget.classList.add('is-open');
    document.body.classList.add('has-chat-open');
    if (launcher) {
      launcher.classList.add('is-hidden');
      launcher.setAttribute('aria-expanded', 'true');
    }

    var greetingEl = document.getElementById('zernexaHeroGreeting');
    if (greetingEl) {
      greetingEl.textContent = getDynamicGreeting();
    }

    var heroStage = document.getElementById('zernexaHeroStage');
    var messagesContainer = document.getElementById('zernexaChatMessages');
    var dockedFooter = document.getElementById('zernexaDockedFooter');

    if (chatHistory.length === 0) {
      if (heroStage) heroStage.style.display = 'flex';
      if (messagesContainer) messagesContainer.style.display = 'none';
      if (dockedFooter) dockedFooter.style.display = 'none';
      var heroInput = document.getElementById('zernexaHeroInput');
      if (heroInput) {
        setTimeout(function () { heroInput.focus(); }, 120);
      }
    } else {
      if (heroStage) heroStage.style.display = 'none';
      if (messagesContainer) messagesContainer.style.display = 'flex';
      if (dockedFooter) dockedFooter.style.display = 'block';
      var chatInput = document.getElementById('zernexaChatInput');
      if (chatInput) {
        setTimeout(function () { chatInput.focus(); }, 120);
      }
    }

    startFluidDotWave();

    if (headerMascot) {
      headerMascot.wave();
    }
  }

  function closeChatWidget() {
    var widget = document.getElementById('zernexaChatWidget');
    var launcher = document.getElementById('zernexaMascotLauncher');
    if (!widget) return;

    widget.classList.remove('is-open');
    document.body.classList.remove('has-chat-open');
    if (launcher) {
      launcher.classList.remove('is-hidden');
      launcher.setAttribute('aria-expanded', 'false');
    }
    stopFluidDotWave();
    setAllMascotsState('idle_blink');
  }

  function clearChatHistory() {
    chatHistory = [];
    var messagesContainer = document.getElementById('zernexaChatMessages');
    var heroStage = document.getElementById('zernexaHeroStage');
    var dockedFooter = document.getElementById('zernexaDockedFooter');

    if (messagesContainer) {
      messagesContainer.innerHTML = '';
      messagesContainer.style.display = 'none';
    }
    if (dockedFooter) {
      dockedFooter.style.display = 'none';
    }
    if (heroStage) {
      heroStage.style.display = 'flex';
    }

    var greetingEl = document.getElementById('zernexaHeroGreeting');
    if (greetingEl) greetingEl.textContent = getDynamicGreeting();

    var heroInput = document.getElementById('zernexaHeroInput');
    if (heroInput) {
      heroInput.value = '';
      heroInput.style.height = 'auto';
      heroInput.focus();
    }
    var heroSendBtn = document.getElementById('zernexaHeroSendBtn');
    if (heroSendBtn) heroSendBtn.disabled = true;

    var chatInput = document.getElementById('zernexaChatInput');
    if (chatInput) {
      chatInput.value = '';
      chatInput.style.height = 'auto';
    }
    var sendBtn = document.getElementById('zernexaSendBtn');
    if (sendBtn) sendBtn.disabled = true;

    setAllMascotsState('idle_blink');
  }

  function appendMessage(role, rawText, options) {
    options = options || {};
    var container = document.getElementById('zernexaChatMessages');
    if (!container) return null;

    var heroStage = document.getElementById('zernexaHeroStage');
    var dockedFooter = document.getElementById('zernexaDockedFooter');

    if (heroStage) heroStage.style.display = 'none';
    if (container) container.style.display = 'flex';
    if (dockedFooter) dockedFooter.style.display = 'block';

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
        '  <svg class="check-icon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
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

    chatHistory.push({ role: role, content: rawText });

    setupCopyButtons();
    return msgEl;
  }

  function appendTypingIndicator() {
    var container = document.getElementById('zernexaChatMessages');
    if (!container) return;

    removeTypingIndicator();

    var heroStage = document.getElementById('zernexaHeroStage');
    var dockedFooter = document.getElementById('zernexaDockedFooter');
    if (heroStage) heroStage.style.display = 'none';
    if (container) container.style.display = 'flex';
    if (dockedFooter) dockedFooter.style.display = 'block';

    var bubble = document.createElement('div');
    bubble.className = 'chat-bubble chat-bubble--bot';
    bubble.id = 'zernexaTypingBubble';
    bubble.innerHTML = [
      '<div class="chat-avatar"><img src="' + BOT_AVATAR_SRC + '" alt="Zernexa AI"></div>',
      '<div class="chat-bubble-body">',
      '  <div class="typing-bubble" aria-label="Zernexa is thinking...">',
      '    <span class="typing-dot"></span>',
      '    <span class="typing-dot"></span>',
      '    <span class="typing-dot"></span>',
      '  </div>',
      '</div>'
    ].join('\n');

    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
  }

  function removeTypingIndicator() {
    var bubble = document.getElementById('zernexaTypingBubble');
    if (bubble && bubble.parentNode) {
      bubble.parentNode.removeChild(bubble);
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

    var heroInput = document.getElementById('zernexaHeroInput');
    var heroSendBtn = document.getElementById('zernexaHeroSendBtn');
    if (heroInput) {
      heroInput.value = '';
      heroInput.style.height = 'auto';
    }
    if (heroSendBtn) heroSendBtn.disabled = true;

    var chatInput = document.getElementById('zernexaChatInput');
    var chatSendBtn = document.getElementById('zernexaSendBtn');
    if (chatInput) {
      chatInput.value = '';
      chatInput.style.height = 'auto';
    }
    if (chatSendBtn) chatSendBtn.disabled = true;

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
      if (chatInput) {
        chatInput.disabled = false;
        chatInput.focus();
      }
    }
  }

  /**
   * Draggable Mascot Launcher Setup
   */
  function setupDraggableMascot() {
    var launcher = document.getElementById('zernexaMascotLauncher');
    if (!launcher) return;

    try {
      var savedPos = localStorage.getItem(STORAGE_KEY_POS);
      if (savedPos) {
        var parsed = JSON.parse(savedPos);
        if (parsed && typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          var maxX = window.innerWidth - launcher.offsetWidth - 12;
          var maxY = window.innerHeight - launcher.offsetHeight - 12;
          var clampX = Math.max(12, Math.min(maxX, parsed.x));
          var clampY = Math.max(12, Math.min(maxY, parsed.y));
          launcher.style.left = clampX + 'px';
          launcher.style.top = clampY + 'px';
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
    var dragThreshold = 5;

    launcher.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      isPointerDown = true;
      hasMoved = false;
      startX = e.clientX;
      startY = e.clientY;

      var rect = launcher.getBoundingClientRect();
      initLeft = rect.left;
      initTop = rect.top;

      try {
        launcher.setPointerCapture(e.pointerId);
      } catch (_) {}
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

    // 1. Context Scope Popover (KokonutUI Pattern)
    var ctxPill = document.getElementById('zernexaContextPill');
    var ctxPopover = document.getElementById('zernexaContextPopover');
    var ctxLabel = document.getElementById('zernexaContextLabel');

    if (ctxPill && ctxPopover) {
      ctxPill.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = ctxPopover.style.display !== 'none';
        ctxPopover.style.display = isOpen ? 'none' : 'flex';
        ctxPill.classList.toggle('is-open', !isOpen);
        closeAllToolsPopovers();
      });

      ctxPopover.querySelectorAll('.zernexa-context-item').forEach(function (item) {
        item.addEventListener('click', function () {
          var page = item.getAttribute('data-context');
          if (page && ctxLabel) ctxLabel.textContent = page;
          ctxPopover.querySelectorAll('.zernexa-context-item').forEach(function (i) { i.classList.remove('is-active'); });
          item.classList.add('is-active');
          ctxPopover.style.display = 'none';
          ctxPill.classList.remove('is-open');
        });
      });
    }

    // 2. Tools Popovers (Hero & Docked)
    function closeAllToolsPopovers() {
      var heroPop = document.getElementById('zernexaHeroToolsPopover');
      var dockPop = document.getElementById('zernexaDockedToolsPopover');
      if (heroPop) heroPop.style.display = 'none';
      if (dockPop) dockPop.style.display = 'none';
    }

    function setupToolsPopover(btnId, popId, textareaId, sendBtnId) {
      var btn = document.getElementById(btnId);
      var pop = document.getElementById(popId);
      var ta = document.getElementById(textareaId);
      var sendBtn = document.getElementById(sendBtnId);

      if (!btn || !pop) return;

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = pop.style.display !== 'none';
        closeAllToolsPopovers();
        if (ctxPopover) {
          ctxPopover.style.display = 'none';
          if (ctxPill) ctxPill.classList.remove('is-open');
        }
        pop.style.display = isOpen ? 'none' : 'flex';
      });

      pop.querySelectorAll('.zernexa-tool-item').forEach(function (item) {
        item.addEventListener('click', function () {
          var toolPrefix = item.getAttribute('data-tool');
          if (ta && toolPrefix) {
            ta.value = toolPrefix;
            ta.style.height = 'auto';
            ta.style.height = Math.min(Math.max(ta.scrollHeight, 44), 160) + 'px';
            if (sendBtn) sendBtn.disabled = false;
            ta.focus();
          }
          pop.style.display = 'none';
        });
      });
    }

    setupToolsPopover('zernexaHeroToolsBtn', 'zernexaHeroToolsPopover', 'zernexaHeroInput', 'zernexaHeroSendBtn');
    setupToolsPopover('zernexaDockedToolsBtn', 'zernexaDockedToolsPopover', 'zernexaChatInput', 'zernexaSendBtn');

    // 3. Close popovers on click outside
    document.addEventListener('click', function (e) {
      if (ctxPopover && !ctxPopover.contains(e.target) && (!ctxPill || !ctxPill.contains(e.target))) {
        ctxPopover.style.display = 'none';
        if (ctxPill) ctxPill.classList.remove('is-open');
      }
      var heroPop = document.getElementById('zernexaHeroToolsPopover');
      var heroBtn = document.getElementById('zernexaHeroToolsBtn');
      if (heroPop && !heroPop.contains(e.target) && (!heroBtn || !heroBtn.contains(e.target))) {
        heroPop.style.display = 'none';
      }
      var dockPop = document.getElementById('zernexaDockedToolsPopover');
      var dockBtn = document.getElementById('zernexaDockedToolsBtn');
      if (dockPop && !dockPop.contains(e.target) && (!dockBtn || !dockBtn.contains(e.target))) {
        dockPop.style.display = 'none';
      }
    });

    // 4. Voice Dictation (Mic) Toggle
    function setupMicButton(micBtnId, textareaId, sendBtnId) {
      var micBtn = document.getElementById(micBtnId);
      var ta = document.getElementById(textareaId);
      var sendBtn = document.getElementById(sendBtnId);
      if (!micBtn || !ta) return;

      var recognition = null;
      var isListening = false;

      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = function () {
          isListening = true;
          micBtn.classList.add('is-active');
          setAllMascotsState('listening');
        };

        recognition.onresult = function (event) {
          var transcript = Array.from(event.results)
            .map(function (res) { return res[0].transcript; })
            .join('');
          ta.value = transcript;
          ta.style.height = 'auto';
          ta.style.height = Math.min(Math.max(ta.scrollHeight, 44), 160) + 'px';
          if (sendBtn) sendBtn.disabled = !transcript.trim();
        };

        recognition.onend = function () {
          isListening = false;
          micBtn.classList.remove('is-active');
          setAllMascotsState('idle_blink');
        };

        recognition.onerror = function () {
          isListening = false;
          micBtn.classList.remove('is-active');
          setAllMascotsState('idle_blink');
        };
      }

      micBtn.addEventListener('click', function () {
        if (recognition) {
          if (isListening) {
            recognition.stop();
          } else {
            try {
              recognition.start();
            } catch (_) {
              recognition.stop();
            }
          }
        } else {
          micBtn.classList.add('is-active');
          setTimeout(function () { micBtn.classList.remove('is-active'); }, 1200);
          if (!ta.value.trim()) {
            ta.value = 'How does 3D Book Page-Turn compare to normal PDF continuous mode?';
            ta.style.height = 'auto';
            ta.style.height = Math.min(Math.max(ta.scrollHeight, 44), 160) + 'px';
            if (sendBtn) sendBtn.disabled = false;
            ta.focus();
          }
        }
      });
    }

    setupMicButton('zernexaHeroMicBtn', 'zernexaHeroInput', 'zernexaHeroSendBtn');
    setupMicButton('zernexaDockedMicBtn', 'zernexaChatInput', 'zernexaSendBtn');

    // 5. Centered Hero Stage Form
    var heroForm = document.getElementById('zernexaHeroForm');
    var heroInput = document.getElementById('zernexaHeroInput');
    var heroSendBtn = document.getElementById('zernexaHeroSendBtn');

    if (heroForm && heroInput) {
      heroForm.addEventListener('submit', function (e) {
        e.preventDefault();
        handleUserQuery(heroInput.value);
      });

      heroInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleUserQuery(heroInput.value);
        }
      });

      heroInput.addEventListener('input', function () {
        var hasVal = heroInput.value.trim().length > 0;
        if (heroSendBtn) heroSendBtn.disabled = !hasVal || isGenerating;
        heroInput.style.height = 'auto';
        heroInput.style.height = Math.min(Math.max(heroInput.scrollHeight, 44), 160) + 'px';
      });
    }

    // 6. Docked Active Conversation Form
    var chatForm = document.getElementById('zernexaChatForm');
    var chatInput = document.getElementById('zernexaChatInput');
    var chatSendBtn = document.getElementById('zernexaSendBtn');

    if (chatForm && chatInput) {
      chatForm.addEventListener('submit', function (e) {
        e.preventDefault();
        handleUserQuery(chatInput.value);
      });

      chatInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleUserQuery(chatInput.value);
        }
      });

      chatInput.addEventListener('input', function () {
        var hasVal = chatInput.value.trim().length > 0;
        if (chatSendBtn) chatSendBtn.disabled = !hasVal || isGenerating;
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(Math.max(chatInput.scrollHeight, 28), 120) + 'px';
      });
    }

    // 7. In-page Support Card Form
    var inPageForm = document.getElementById('zernexaInPageForm');
    var inPageInput = document.getElementById('zernexaInPageInput');
    if (inPageForm && inPageInput) {
      inPageForm.addEventListener('submit', function (e) {
        e.preventDefault();
        handleUserQuery(inPageInput.value);
      });
    }

    // 8. Support starter buttons on page
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-zernexa-prompt]');
      if (btn) {
        var text = btn.getAttribute('data-zernexa-prompt');
        if (text) handleUserQuery(text);
      }
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
