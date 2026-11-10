/**
 * PDFistic Official Interactive Script
 * High-performance, zero external dependencies.
 * Handles responsive mobile navigation, accessibility, and TOC scroll-spy.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // 1. Mobile Navigation Toggle
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const primaryNav = document.getElementById('primaryNav');
    const backdrop = document.getElementById('navBackdrop');

    function syncMobileDrawerTop() {
      var siteHeader = document.querySelector('header.site-header');
      if (!siteHeader) return;
      var headerBottom = Math.ceil(siteHeader.getBoundingClientRect().bottom);
      document.documentElement.style.setProperty('--mobile-drawer-top', Math.max(68, headerBottom + 8) + 'px');
    }

    function openMenu() {
      if (!toggleBtn || !primaryNav) return;
      syncMobileDrawerTop();
      toggleBtn.classList.add('is-active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      primaryNav.classList.add('is-open');
      if (backdrop) backdrop.classList.add('is-visible');
      document.documentElement.classList.add('nav-menu-open');
      document.body.classList.add('nav-menu-open');
    }

    function closeMenu() {
      if (!toggleBtn || !primaryNav) return;
      toggleBtn.classList.remove('is-active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      primaryNav.classList.remove('is-open');
      if (backdrop) backdrop.classList.remove('is-visible');
      document.documentElement.classList.remove('nav-menu-open');
      document.body.classList.remove('nav-menu-open');
    }

    if (toggleBtn && primaryNav) {
      // Ensure mobile drawer always includes GitHub link when top-bar GitHub button hides on <=768px
      if (!primaryNav.querySelector('.nav-drawer-github-item')) {
        const ghLi = document.createElement('li');
        ghLi.className = 'nav-drawer-github-item';
        ghLi.innerHTML = '<a href="https://github.com/devanshd07o/PDFistic-V1" target="_blank" rel="noopener noreferrer">GitHub Repository<svg class="skiper-arrow" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 9L9 1m0 0v8m0-8H1"/></svg></a>';
        primaryNav.appendChild(ghLi);
      }

      toggleBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        const isOpen = primaryNav.classList.contains('is-open');
        if (isOpen) {
          closeMenu();
        } else {
          openMenu();
        }
      });

      if (backdrop) {
        backdrop.addEventListener('click', closeMenu);
      }

      // Close when clicking any nav link
      const links = primaryNav.querySelectorAll('a');
      links.forEach(function (link) {
        link.addEventListener('click', function () {
          closeMenu();
        });
      });

      // Close on Escape key
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
          closeMenu();
        }
      });

      // Close on window resize above mobile breakpoint
      window.addEventListener('resize', function () {
        if (window.innerWidth > 992 && primaryNav.classList.contains('is-open')) {
          closeMenu();
        }
      }, { passive: true });
    }

    // 2. FAQ Accordion Toggle (Native <details> toggle + fallback div toggle)
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(function (button) {
      const item = button.closest('.faq-item');
      if (!item) return;

      if (item.tagName === 'DETAILS') {
        const syncDetailsState = function () {
          item.classList.toggle('is-open', item.open);
          button.setAttribute('aria-expanded', item.open ? 'true' : 'false');
        };
        syncDetailsState();
        item.addEventListener('toggle', syncDetailsState);
      } else {
        if (!button.hasAttribute('aria-expanded')) {
          button.setAttribute('aria-expanded', item.classList.contains('is-open') ? 'true' : 'false');
        }
        button.addEventListener('click', function () {
          const isOpen = item.classList.toggle('is-open');
          button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
      }
    });

    // 3. Scroll-Spy for Table of Contents (Desktop sidebar & Mobile horizontal pill strip)
    const tocNav = document.querySelector('.toc-nav, .doc-toc nav');
    if (tocNav) {
      const tocLinks = tocNav.querySelectorAll('a');
      const sections = Array.from(tocLinks).map(function (link) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          return document.getElementById(href.substring(1));
        }
        return null;
      }).filter(Boolean);

      function updateActiveToc() {
        if (!sections.length) return;
        const scrollY = window.scrollY + 160;
        let activeIndex = 0;

        sections.forEach(function (section, index) {
          if (section.offsetTop <= scrollY) {
            activeIndex = index;
          }
        });

        tocLinks.forEach(function (link, index) {
          if (index === activeIndex) {
            if (!link.classList.contains('active')) {
              link.classList.add('active');
              if (window.innerWidth <= 900) {
                const targetLeft = link.offsetLeft - (tocNav.clientWidth / 2) + (link.offsetWidth / 2);
                tocNav.scrollLeft = Math.max(0, targetLeft);
              }
            }
          } else {
            link.classList.remove('active');
          }
        });
      }

      window.addEventListener('scroll', updateActiveToc, { passive: true });
      updateActiveToc();
    }

    // 4. Skiper 17 Sticky Pinned Card Showcase (GSAP + ScrollTrigger)
    function initSkiper17() {
      const stage = document.querySelector('.sticky-cards-stage');
      const cardItems = document.querySelectorAll('.skiper17-card-item');

      if (!stage || !cardItems.length) return;

      const gsapInstance = window.gsap || (typeof gsap !== 'undefined' ? gsap : null);
      const stInstance = window.ScrollTrigger || (typeof ScrollTrigger !== 'undefined' ? ScrollTrigger : null);

      if (!gsapInstance || !stInstance) {
        console.warn('GSAP or ScrollTrigger not loaded, retrying on window load');
        window.addEventListener('load', initSkiper17, { once: true });
        return;
      }

      gsapInstance.registerPlugin(stInstance);

      const totalCards = cardItems.length;

      // Card 0 starts visible & active, Cards 1..N start staged invisibly below with subtle depth
      gsapInstance.set(cardItems[0], { y: '0%', scale: 1, rotation: 0, opacity: 1 });
      cardItems[0].classList.add('is-active-tour');
      for (let i = 1; i < totalCards; i++) {
        gsapInstance.set(cardItems[i], { y: '108%', scale: 0.96, rotation: 0, opacity: 0 });
      }

      const tourCounter = document.getElementById('tourStepCounter');
      const scrollTimeline = gsapInstance.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'center 54%',
          end: () => `+=${window.innerHeight * (totalCards - 1) * 0.95}`,
          pin: true,
          scrub: 1.15,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const activeIdx = Math.min(totalCards - 1, Math.max(0, Math.round(self.progress * (totalCards - 1))));
            cardItems.forEach((c, idx) => c.classList.toggle('is-active-tour', idx === activeIdx));
            if (tourCounter) {
              tourCounter.textContent = String(activeIdx + 1).padStart(2, '0') + ' / ' + String(totalCards).padStart(2, '0');
            }
          },
        },
      });

      for (let i = 0; i < totalCards - 1; i++) {
        const currentCard = cardItems[i];
        const nextCard = cardItems[i + 1];
        const position = i;

        scrollTimeline.to(
          currentCard,
          {
            scale: 0.86,
            y: '-2%',
            rotation: i % 2 === 0 ? 2.2 : -2.2,
            opacity: 0.4,
            duration: 1,
            ease: 'power2.inOut',
          },
          position
        );

        scrollTimeline.to(
          nextCard,
          {
            y: '0%',
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: 'power2.inOut',
          },
          position
        );
      }

      window.addEventListener('resize', () => {
        stInstance.refresh();
      }, { passive: true });
    }

    initSkiper17();

    // 4b. Passive Observer for Tour Segmented Dots, Scroll Cue & Active Step Callout
    function initTourObservers() {
      var counter = document.getElementById('tourStepCounter');
      var container = document.getElementById('tour');
      var dots = Array.from(document.querySelectorAll('#tourStepDots .step-dot'));
      var callouts = Array.from(document.querySelectorAll('#tourCallouts .callout'));
      if (!counter || !container) return;

      function syncTourUi() {
        var match = (counter.textContent || '').trim().match(/^(\d+)/);
        var step = match ? parseInt(match[1], 10) : 1;
        if (isNaN(step) || step < 1) step = 1;

        dots.forEach(function (dot, idx) {
          dot.classList.toggle('is-active', idx === step - 1);
        });
        callouts.forEach(function (callout, idx) {
          callout.classList.toggle('is-active-callout', idx === step - 1);
        });
        container.classList.toggle('is-past-step-1', step > 1);
      }

      syncTourUi();
      var mo = new MutationObserver(syncTourUi);
      mo.observe(counter, { characterData: true, childList: true, subtree: true });
    }

    initTourObservers();

    // 5. Direction Hover (Originkit Physical Edge-Reactive Text)
    function initDirectionHover() {
      var items = document.querySelectorAll('.direction-hover');
      items.forEach(function (el) {
        var track = el.querySelector('.dh-track');
        if (!track) return;

        el.addEventListener('mouseenter', function (e) {
          var rect = el.getBoundingClientRect();
          var fromTop = (e.clientY - rect.top) < rect.height / 2;
          track.style.transform = fromTop ? 'translateY(0em)' : 'translateY(-3.20em)';
        });

        el.addEventListener('mouseleave', function () {
          track.style.transform = 'translateY(-1.60em)';
        });
      });
    }

    initDirectionHover();
    // 6. Flicker Text (Originkit Outline & Fill Symbiote Flicker)
    function initFlickerText() {
      var targets = document.querySelectorAll('.flicker-text:not(.brand-title), [data-flicker]');
      if (!targets.length) return;

      function makeEase(t) {
        return t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t);
      }

      targets.forEach(function (el) {
        if (el._flickerInit) return;
        el._flickerInit = true;
        el.classList.add('flicker-text');

        var originalText = el.textContent.trim();
        if (!originalText) return;

        el.innerHTML = '';
        var charSpans = [];
        for (var i = 0; i < originalText.length; i++) {
          var span = document.createElement('span');
          span.className = 'flicker-char';
          span.textContent = originalText[i];
          el.appendChild(span);
          if (originalText[i].trim() !== '') {
            charSpans.push(span);
          }
        }

        var isRunning = false;
        var timers = [];

        function clearTimers() {
          timers.forEach(function (t) { clearTimeout(t); });
          timers.length = 0;
        }

        function resetState() {
          clearTimers();
          el.classList.remove('phase-outline', 'phase-invisible');
          el.classList.add('phase-filled');
          el.style.transform = 'translateX(0px)';
          charSpans.forEach(function (s) {
            s.classList.remove('is-flicker-dim', 'is-flicker-stroke');
          });
          isRunning = false;
        }

        function runFlicker(opts) {
          opts = opts || {};
          if (isRunning) resetState();
          isRunning = true;

          var duration = opts.duration || 650;
          var shakeWidth = opts.shakeWidth || 1.8;

          var sequence = [
            'invisible',
            'outline',
            'invisible',
            'filled',
            'outline',
            'invisible',
            'filled'
          ];

          var intervals = [];
          var prev = 0;
          for (var i = 1; i <= sequence.length; i++) {
            var t = i / sequence.length;
            var cur = makeEase(t) * duration;
            intervals.push(Math.max(15, cur - prev));
            prev = cur;
          }

          var cursor = 0;
          var shakeDir = 1;

          sequence.forEach(function (phase, idx) {
            var delay = cursor;
            var stepMs = intervals[idx];

            timers.push(
              setTimeout(function () {
                el.classList.remove('phase-filled', 'phase-outline', 'phase-invisible');
                el.classList.add('phase-' + phase);

                if (phase !== 'filled') {
                  el.style.transform = 'translateX(' + (shakeDir * shakeWidth) + 'px)';
                  shakeDir *= -1;
                } else {
                  el.style.transform = 'translateX(0px)';
                }

                if (phase === 'filled' || phase === 'outline') {
                  charSpans.forEach(function (s) {
                    s.classList.remove('is-flicker-dim', 'is-flicker-stroke');
                  });
                  if (Math.random() > 0.25) {
                    var pick1 = Math.floor(Math.random() * charSpans.length);
                    var pick2 = (pick1 + 2) % charSpans.length;
                    charSpans[pick1].classList.add(Math.random() > 0.5 ? 'is-flicker-dim' : 'is-flicker-stroke');
                    if (charSpans.length > 4) {
                      charSpans[pick2].classList.add('is-flicker-dim');
                    }
                  }
                }
              }, delay)
            );

            cursor += stepMs;
          });

          timers.push(
            setTimeout(function () {
              resetState();
            }, cursor)
          );
        }

        if ('IntersectionObserver' in window) {
          var observer = new IntersectionObserver(
            function (entries) {
              entries.forEach(function (entry) {
                if (entry.isIntersecting && !el._hasEntered) {
                  el._hasEntered = true;
                  setTimeout(function () {
                    runFlicker({ duration: 750, shakeWidth: 1.6 });
                  }, 400);
                }
              });
            },
            { threshold: 0.2 }
          );
          observer.observe(el);
        }

        var hoverParent = el.closest('.brand-link') || el;
        hoverParent.addEventListener('mouseenter', function () {
          runFlicker({ duration: 550, shakeWidth: 1.5 });
        });
      });
    }

    initFlickerText();

    // 7. Fade hero callouts once on first demo interaction + keep demo flat (no tilt transform)
    function initHeroShotTilt() {
      var shot = document.getElementById('heroShot');
      if (!shot) return;
      var inner = shot.querySelector('.hero-shot-inner');
      if (inner) inner.style.setProperty('--shot-tilt', '0deg');

      var callouts = document.getElementById('heroCallouts');
      if (!callouts) return;
      var dismissed = false;
      function dismissCallouts() {
        if (dismissed) return;
        dismissed = true;
        shot.classList.add('is-callouts-hidden');
        ['click', 'pointerdown', 'dragstart', 'dragover', 'keydown'].forEach(function (evt) {
          shot.removeEventListener(evt, dismissCallouts, true);
        });
      }
      ['click', 'pointerdown', 'dragstart', 'dragover', 'keydown'].forEach(function (evt) {
        shot.addEventListener(evt, dismissCallouts, { passive: true, capture: true });
      });
    }

    initHeroShotTilt();

    // 8. Originkit TextPath (Monumental Full-Bleed Edge-to-Edge PDFistic Sine-Wave Marquee)
    function initHeroTextPath() {
      var container = document.getElementById('heroTextPath');
      if (!container) return;

      var text = 'PDFistic';
      var separator = '\u2022';
      var gap = 1;
      var speed = 24;
      var letterSpacing = '-0.02em';
      var fontFamily = "var(--font-marquee, 'Bricolage Grotesque', 'Space Grotesk', 'Montserrat', sans-serif)";

      var gapStr = '\u00A0'.repeat(gap);
      var unitText = text + gapStr + separator + gapStr;

      var rafId = null;
      var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      function render() {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }

        var rect = container.getBoundingClientRect();
        var w = Math.round(rect.width) || window.innerWidth || 1200;
        var fontSizePx = Math.round(Math.max(54, Math.min(166, w * 0.114)));
        var h = Math.round(rect.height) || Math.round(fontSizePx * 1.65);
        var waveFrequency = w < 640 ? 1.0 : 1.75;
        var cy = h / 2;
        var amplitude = Math.max(8, Math.min(h * 0.15, (h - fontSizePx * 1.04) * 0.42));
        var ctrlAmp = amplitude * (4 / 3);
        var halfCyclesVisible = Math.max(1, Math.round(waveFrequency * 2));
        var halfWidth = w / halfCyclesVisible;

        var pathId = 'heroWavePath';
        var gradId = 'heroWaveGrad';

        // Step 1: Measure exact glyph advance width in target display font before laying out path overflow
        container.innerHTML =
          '<svg class="hero-textpath-svg" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none">' +
            '<defs>' +
              '<linearGradient id="' + gradId + '" x1="0%" y1="0%" x2="100%" y2="0%">' +
                '<stop offset="0%" stop-color="#C8BCA6"/>' +
                '<stop offset="50%" stop-color="#FAF7F2"/>' +
                '<stop offset="100%" stop-color="#C8BCA6"/>' +
              '</linearGradient>' +
              '<path id="' + pathId + '" d="M 0,' + cy + ' L ' + w + ',' + cy + '" fill="none"/>' +
            '</defs>' +
            '<text id="tpMeas2" x="-9999" y="-9999" font-family="' + fontFamily + '" font-size="' + fontSizePx + 'px" font-weight="800" letter-spacing="' + letterSpacing + '">' + (unitText + unitText) + '</text>' +
            '<text id="tpMeas4" x="-9999" y="-9999" font-family="' + fontFamily + '" font-size="' + fontSizePx + 'px" font-weight="800" letter-spacing="' + letterSpacing + '">' + (unitText + unitText + unitText + unitText) + '</text>' +
            '<text fill="url(#' + gradId + ')" fill-opacity="0.15" dy="0.33em" font-family="' + fontFamily + '" font-size="' + fontSizePx + 'px" font-weight="800" letter-spacing="' + letterSpacing + '">' +
              '<textPath id="tpTextPathEl" href="#' + pathId + '" startOffset="0"></textPath>' +
            '</text>' +
          '</svg>';

        var pathEl = document.getElementById(pathId);
        var textPathEl = document.getElementById('tpTextPathEl');
        var meas2 = document.getElementById('tpMeas2');
        var meas4 = document.getElementById('tpMeas4');

        if (!pathEl || !textPathEl || !meas2 || !meas4) return;

        var unitWidthPx = 0;
        try {
          unitWidthPx = (meas4.getComputedTextLength() - meas2.getComputedTextLength()) / 2;
        } catch (e) {
          unitWidthPx = 0;
        }
        if (!unitWidthPx || unitWidthPx <= 0) {
          unitWidthPx = unitText.length * fontSizePx * 0.58;
        }

        // Guarantee off-screen left & right extension so words emerge seamlessly from both screen corners
        var overflow = Math.max(unitWidthPx * 1.8, w * 0.65, 420);
        var leftSteps = Math.ceil(overflow / halfWidth);
        var rightSteps = Math.ceil(overflow / halfWidth);
        var totalSteps = halfCyclesVisible + leftSteps + rightSteps;
        var xStart = -leftSteps * halfWidth;
        var startSign = leftSteps % 2 === 0 ? -1 : 1;

        var d = 'M ' + xStart + ',' + cy;
        for (var i = 0; i < totalSteps; i++) {
          var xa = xStart + i * halfWidth;
          var xb = xStart + (i + 1) * halfWidth;
          var peakY = cy + (i % 2 === 0 ? startSign * ctrlAmp : -startSign * ctrlAmp);
          d += ' C ' + (xa + halfWidth / 3) + ',' + peakY + ' ' + (xb - halfWidth / 3) + ',' + peakY + ' ' + xb + ',' + cy;
        }
        pathEl.setAttribute('d', d);

        var pathLengthPx = 0;
        try {
          pathLengthPx = pathEl.getTotalLength();
        } catch (e) {
          pathLengthPx = totalSteps * halfWidth * 1.25;
        }

        var repeatCount = Math.min(256, Math.max(6, Math.ceil(pathLengthPx / unitWidthPx) + 5));
        textPathEl.textContent = unitText.repeat(repeatCount);

        // Start slightly offset so wordmark visually bleeds out of BOTH left and right corners from frame 0
        var initialPhasePx = Math.round(unitWidthPx * 0.38);

        if (reducedMotion) {
          textPathEl.setAttribute('startOffset', initialPhasePx + 'px');
          return;
        }

        var offset = initialPhasePx;
        var lastT = null;
        var pps = speed * 4.2;

        function loop(t) {
          if (lastT === null) lastT = t;
          var dt = Math.min((t - lastT) / 1000, 1 / 30);
          lastT = t;

          if (unitWidthPx > 0 && pps > 0) {
            offset = offset + pps * dt;
            offset = offset - Math.floor(offset / unitWidthPx) * unitWidthPx;
            textPathEl.setAttribute('startOffset', offset.toFixed(2) + 'px');
          }

          rafId = requestAnimationFrame(loop);
        }

        textPathEl.setAttribute('startOffset', offset.toFixed(2) + 'px');
        rafId = requestAnimationFrame(loop);
      }

      render();

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
          if (container.isConnected) render();
        });
      }

      if (typeof ResizeObserver !== 'undefined') {
        var lastW = 0;
        var lastH = 0;
        var ro = new ResizeObserver(function (entries) {
          for (var i = 0; i < entries.length; i++) {
            var nextW = Math.round(entries[i].contentRect.width);
            var nextH = Math.round(entries[i].contentRect.height);
            if (Math.abs(nextW - lastW) > 1 || Math.abs(nextH - lastH) > 1) {
              lastW = nextW;
              lastH = nextH;
              render();
            }
          }
        });
        ro.observe(container);
      } else {
        var resizeTimer;
        window.addEventListener('resize', function () {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(render, 150);
        }, { passive: true });
      }
    }

    initHeroTextPath();

    // 9. Originkit + Skiper UI Kinetic Typography Suite (All Pages)
    function initKineticTypographySuite() {
      var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) return;

      var isDocPage = document.body.classList.contains('page-document');

      // 9b. Skiper 58 Staggered TextRoll on Navbar Brand Title
      document.querySelectorAll('.brand-title').forEach(function (el) {
        if (el.dataset.rollInit) return;
        var label = (el.textContent || '').trim();
        if (!label) return;
        el.dataset.rollInit = '1';
        el.setAttribute('aria-label', label);
        el.classList.add('text-roll');
        el.innerHTML = '';

        var center = (label.length - 1) / 2;
        ['top', 'bottom'].forEach(function (layer) {
          var row = document.createElement('span');
          row.className = 'text-roll-row text-roll-row--' + layer;
          row.setAttribute('aria-hidden', 'true');
          for (var i = 0; i < label.length; i++) {
            var ch = document.createElement('span');
            ch.className = 'text-roll-char';
            ch.textContent = label[i] === ' ' ? '\u00A0' : label[i];
            ch.style.setProperty('--roll-delay', Math.round(Math.abs(i - center) * 26) + 'ms');
            row.appendChild(ch);
          }
          el.appendChild(row);
        });
      });

      if (isDocPage) return;

      document.body.classList.add('has-text-anim');

      // 9a. Originkit Shiny Sheen Sweep on Eyebrows & Kickers (Never on solid-background badge pills)
      document.querySelectorAll('.section-label, .bottom-cta-eyebrow, .bento-kicker').forEach(function (el) {
        el.classList.add('shiny-text');
      });

      // Helper: Attach Originkit Dynamic Weight Proximity Hover to character spans
      function attachDynamicWeight(container, charSpans, baseWeight, peakWeight, hoverColor) {
        if (!charSpans.length) return;
        container.classList.add('dw-heading');

        container.addEventListener('pointermove', function (e) {
          var mx = e.clientX;
          var my = e.clientY;
          charSpans.forEach(function (ch) {
            var r = ch.getBoundingClientRect();
            var cx = r.left + r.width / 2;
            var cy = r.top + r.height / 2;
            var dist = Math.hypot(mx - cx, my - cy);
            var influence = Math.exp(-(dist * dist) / (2 * 64 * 64));
            var w = Math.round(baseWeight + (peakWeight - baseWeight) * influence);
            ch.style.fontWeight = String(w);
            if (influence > 0.12) {
              ch.style.transform = 'translate3d(0, ' + (-3 * influence).toFixed(1) + 'px, 0)';
              ch.style.color = influence > 0.55 ? (hoverColor || 'var(--accent-crimson)') : '';
            } else {
              ch.style.transform = '';
              ch.style.color = '';
            }
          });
        });

        container.addEventListener('pointerleave', function () {
          charSpans.forEach(function (ch) {
            ch.style.fontWeight = '';
            ch.style.transform = '';
            ch.style.color = '';
          });
        });
      }

      // 9c. Skiper 31 Character Scroll Perspective + Dynamic Weight Hover on Section Titles & Page Hero H1s
      var gsapInstance = window.gsap || (typeof gsap !== 'undefined' ? gsap : null);
      var stInstance = window.ScrollTrigger || (typeof ScrollTrigger !== 'undefined' ? ScrollTrigger : null);
      if (gsapInstance && stInstance) {
        gsapInstance.registerPlugin(stInstance);
      }

      document.querySelectorAll('.section-title').forEach(function (titleEl) {
        if (titleEl.dataset.skiper31Init) return;
        var text = (titleEl.textContent || '').replace(/\s+/g, ' ').trim();
        if (!text) return;
        titleEl.dataset.skiper31Init = '1';
        titleEl.setAttribute('aria-label', text);
        titleEl.classList.add('skiper31-heading');
        titleEl.innerHTML = '';

        var charSpans = [];
        var words = text.split(' ');
        words.forEach(function (word, wIdx) {
          var wordSpan = document.createElement('span');
          wordSpan.className = 'skiper31-word';
          wordSpan.setAttribute('aria-hidden', 'true');
          for (var c = 0; c < word.length; c++) {
            var charSpan = document.createElement('span');
            charSpan.className = 'skiper31-char dw-char';
            charSpan.textContent = word[c];
            wordSpan.appendChild(charSpan);
            charSpans.push(charSpan);
          }
          titleEl.appendChild(wordSpan);
          if (wIdx < words.length - 1) {
            titleEl.appendChild(document.createTextNode(' '));
          }
        });

        var centerIdx = (charSpans.length - 1) / 2;
        if (gsapInstance && stInstance) {
          var spread = Math.min(7, Math.max(2, window.innerWidth * 0.004));
          gsapInstance.fromTo(
            charSpans,
            {
              x: function (i) { return Math.max(-36, Math.min(36, (i - centerIdx) * spread)); },
              rotateX: function (i) { return Math.max(-28, Math.min(28, (i - centerIdx) * 5)); },
              opacity: 0.25,
            },
            {
              x: 0,
              rotateX: 0,
              opacity: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: titleEl,
                start: 'top 95%',
                end: 'top 68%',
                scrub: 0.7,
              },
            }
          );
        }

        attachDynamicWeight(titleEl, charSpans, 650, 900);
      });

      // Dynamic Weight interactive hover on subpage H1 headings (.doc-title, .editorial-title)
      document.querySelectorAll('.doc-title, .editorial-title').forEach(function (h1El) {
        if (h1El.dataset.dwInit) return;
        var text = (h1El.textContent || '').replace(/\s+/g, ' ').trim();
        if (!text) return;
        h1El.dataset.dwInit = '1';
        h1El.setAttribute('aria-label', text);
        h1El.innerHTML = '';

        var charSpans = [];
        var words = text.split(' ');
        words.forEach(function (word, wIdx) {
          var wordSpan = document.createElement('span');
          wordSpan.className = 'dw-word';
          wordSpan.setAttribute('aria-hidden', 'true');
          for (var c = 0; c < word.length; c++) {
            var charSpan = document.createElement('span');
            charSpan.className = 'dw-char';
            charSpan.textContent = word[c];
            wordSpan.appendChild(charSpan);
            charSpans.push(charSpan);
          }
          h1El.appendChild(wordSpan);
          if (wIdx < words.length - 1) {
            h1El.appendChild(document.createTextNode(' '));
          }
        });

        var isDarkHero = h1El.classList.contains('editorial-title');
        attachDynamicWeight(h1El, charSpans, 650, 900, isDarkHero ? '#F87171' : 'var(--accent-crimson)');
      });

      // 9d. Originkit Smoky Text Word Diffusion on Headings & Subpage Titles
      var smokySelectors = [
        '.bento-heading',
        '.bottom-cta-banner h2',
        '.doc-section h2',
        '.contact-form-card h2',
        '.contact-card h3',
        '.feature-title',
        '.trust-pillar-card h3',
        '.step-card h3',
        '.doc-next-strip h3'
      ];
      var smokyHeadings = Array.from(document.querySelectorAll(smokySelectors.join(', ')));
      smokyHeadings.forEach(function (el) {
        if (el.dataset.smokyInit) return;
        var raw = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (!raw) return;
        el.dataset.smokyInit = '1';
        el.setAttribute('aria-label', raw);
        el.classList.add('smoky-heading');
        el.innerHTML = '';

        var words = raw.split(' ');
        words.forEach(function (w, idx) {
          var span = document.createElement('span');
          span.className = 'smoky-word';
          span.setAttribute('aria-hidden', 'true');
          span.textContent = w;
          span.style.setProperty('--smoky-delay', Math.min(idx * 16, 90) + 'ms');
          el.appendChild(span);
          if (idx < words.length - 1) {
            el.appendChild(document.createTextNode(' '));
          }
        });
      });

      // 9e. Originkit Spotlight Text on Subheadings & Descriptions
      var spotSelectors = [
        '.section-intro',
        '.skiper17-scroll-text',
        '.editorial-subtitle',
        '.doc-subline',
        '.bottom-cta-banner p',
        '.bento-text',
        '.feature-desc'
      ];
      document.querySelectorAll(spotSelectors.join(', ')).forEach(function (el) {
        el.classList.add('spotlight-text');
        el.addEventListener('pointermove', function (e) {
          var r = el.getBoundingClientRect();
          el.style.setProperty('--spot-x', (e.clientX - r.left).toFixed(1) + 'px');
          el.style.setProperty('--spot-y', (e.clientY - r.top).toFixed(1) + 'px');
          el.classList.add('is-spotlight-active');
        });
        el.addEventListener('pointerleave', function () {
          el.classList.remove('is-spotlight-active');
        });
      });

      // 9f. Smooth Editorial Reveal Observer for Body Blocks, Bento Micro-Artifacts & Cards (Zero Stuck Blank)
      var revealSelectors = [
        '.smoky-heading',
        '.section-header .section-intro',
        '.bento-panel .bento-text',
        '.bento-panel--sand',
        '.bento-page-chapter',
        '.bento-page-excerpt',
        '.bento-privacy-row',
        '.bento-margin-note',
        '.bento-ai-prompt',
        '.bento-ai-reply',
        '.skiper17-scroll-indicator',
        '.bottom-cta-banner p',
        '.doc-short-version',
        '.plain-english-card',
        '.trust-pillar-card',
        '.step-card',
        '.storage-path-item',
        '.doc-next-strip',
        '.doc-section > p',
        '.doc-section > ul',
        '.doc-section .spec-table-container',
        '.spec-table tbody tr',
        '.publisher-meta-item',
        '.faq-item',
        '.contact-card',
        '.feature-card',
        '.license-summary-card'
      ];
      var elements = Array.from(document.querySelectorAll(revealSelectors.join(', ')));
      if (!elements.length) return;

      elements.forEach(function (el, idx) {
        if (!el.classList.contains('smoky-heading') && !el.classList.contains('bento-panel--sand')) {
          el.classList.add('txt-anim');
          el.style.setProperty('--txt-delay', ((idx % 4) * 24) + 'ms');
        }
      });

      function markElementVisible(el) {
        el.classList.add('is-visible');
        if (el.classList.contains('bento-panel--sand')) {
          el.classList.add('is-marker-lit');
        }
      }

      function revealIfNearViewport() {
        var vh = window.innerHeight || document.documentElement.clientHeight || 900;
        elements.forEach(function (el) {
          if (el.classList.contains('is-visible')) return;
          var r = el.getBoundingClientRect();
          if (r.top <= vh + 260) {
            markElementVisible(el);
          }
        });
      }

      function revealTargetAndNeighbors(targetId) {
        if (!targetId) return;
        var target = document.getElementById(targetId);
        if (!target) return;
        elements.forEach(function (el) {
          if (target.contains(el) || el === target || (el.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING)) {
            markElementVisible(el);
          }
        });
      }

      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              markElementVisible(entry.target);
              io.unobserve(entry.target);
            }
          });
        }, { threshold: 0.01, rootMargin: '260px 0px 260px 0px' });
        elements.forEach(function (el) { io.observe(el); });
      }

      document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function () {
          var href = anchor.getAttribute('href');
          if (href && href.length > 1) {
            revealTargetAndNeighbors(href.substring(1));
          }
        });
      });

      window.addEventListener('hashchange', function () {
        if (window.location.hash && window.location.hash.length > 1) {
          revealTargetAndNeighbors(window.location.hash.substring(1));
        }
      });

      if (window.location.hash && window.location.hash.length > 1) {
        revealTargetAndNeighbors(window.location.hash.substring(1));
      }

      revealIfNearViewport();
      window.addEventListener('scroll', revealIfNearViewport, { passive: true });
      window.addEventListener('load', function () {
        revealIfNearViewport();
        if (stInstance) stInstance.refresh();
      }, { once: true });
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
          if (stInstance) stInstance.refresh();
        });
      }
    }

    initKineticTypographySuite();

    // 10. Clean Contact Form (Direct Auto-Send + Gmail + Outlook/Mailto + Copy)
    function initContactForm() {
      var form = document.querySelector('.galaxy-contact-form');
      if (!form) return;

      var TARGET_EMAIL = 'devanshd07o@gmail.com';
      var DIRECT_ENDPOINT = 'https://formsubmit.co/ajax/' + TARGET_EMAIL;

      var msgInput = document.getElementById('contact-message');
      var countEl = document.getElementById('contactCharCount');
      var updateCount = function () {
        if (!msgInput || !countEl) return;
        var len = msgInput.value.length;
        countEl.textContent = len + (len === 1 ? ' char' : ' chars');
      };
      if (msgInput && countEl) {
        msgInput.addEventListener('input', updateCount);
        updateCount();
      }

      var statusEl = form.querySelector('.contact-form-status');
      var setStatus = function (text, tone) {
        if (!statusEl) return;
        statusEl.textContent = text || '';
        if (tone) {
          statusEl.setAttribute('data-tone', tone);
        } else {
          statusEl.removeAttribute('data-tone');
        }
      };

      var sanitizeLine = function (val) {
        return String(val || '').replace(/[\r\n]+/g, ' ').trim();
      };

      var readDraft = function () {
        return {
          name: sanitizeLine((document.getElementById('contact-name') || {}).value),
          email: sanitizeLine((document.getElementById('contact-email') || {}).value),
          subject: sanitizeLine((document.getElementById('contact-subject') || {}).value),
          message: String((msgInput || {}).value || '').trim()
        };
      };

      var buildMailBody = function (draft) {
        var meta = [];
        if (draft.name) meta.push('Name: ' + draft.name);
        if (draft.email) meta.push('Reply Email: ' + draft.email);
        if (meta.length && draft.message) return meta.join('\n') + '\n\n' + draft.message;
        return meta.join('\n') || draft.message;
      };

      var buildGmailUrl = function (draft) {
        var subject = draft.subject || 'PDFistic Inquiry';
        var body = buildMailBody(draft);
        return 'https://mail.google.com/mail/?view=cm&fs=1&to=' +
          encodeURIComponent(TARGET_EMAIL) +
          '&su=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(body);
      };

      var buildMailtoUrl = function (draft) {
        var subject = draft.subject || 'PDFistic Inquiry';
        var body = buildMailBody(draft);
        return 'mailto:' + TARGET_EMAIL +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(body);
      };

      var submitBtn = form.querySelector('.galaxy-submit');
      var submitLabel = submitBtn ? submitBtn.querySelector('span') : null;
      var origSubmitText = submitLabel ? submitLabel.textContent : 'Send message';
      var isSubmitting = false;

      var resetSubmitState = function () {
        isSubmitting = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.removeAttribute('aria-busy');
        }
        if (submitLabel) {
          submitLabel.textContent = origSubmitText;
        }
      };

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (isSubmitting) return;
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        if (window.location.protocol === 'file:') {
          setStatus('Direct send works on the live HTTPS site. Use Open in Gmail or Outlook / Mail app below for local preview.', 'info');
          return;
        }

        if (typeof fetch !== 'function') {
          setStatus('Direct send is unavailable in this browser. Use Open in Gmail or Outlook / Mail app below.', 'error');
          return;
        }

        var draft = readDraft();
        isSubmitting = true;
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.setAttribute('aria-busy', 'true');
        }
        if (submitLabel) {
          submitLabel.textContent = 'Sending...';
        }
        setStatus('Sending directly to ' + TARGET_EMAIL + '...', 'info');

        var controller = typeof AbortController === 'function' ? new AbortController() : null;
        var timeoutId = setTimeout(function () {
          if (controller) controller.abort();
        }, 12000);

        fetch(DIRECT_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          signal: controller ? controller.signal : undefined,
          body: JSON.stringify({
            name: draft.name,
            email: draft.email,
            _replyto: draft.email,
            subject: draft.subject,
            _subject: '[PDFistic Contact] ' + draft.subject,
            message: draft.message,
            _captcha: 'false',
            _template: 'table'
          })
        }).then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (data) {
            if (!res.ok || (data && data.success !== true && data.success !== 'true')) {
              var serverMsg = data && typeof data.message === 'string' ? data.message : '';
              if (/activat|confirm|verify/i.test(serverMsg)) {
                setStatus('First-time form activation link sent to ' + TARGET_EMAIL + '. You can also use Open in Gmail or Outlook / Mail app below.', 'info');
              } else {
                setStatus('Direct send could not complete right now. Use Open in Gmail or Outlook / Mail app below.', 'error');
              }
              return;
            }
            setStatus('Message sent directly to ' + TARGET_EMAIL + '. Expect a reply as soon as possible.', 'success');
            form.reset();
            updateCount();
          });
        }).catch(function () {
          setStatus('Network timeout or blocked request. Use Open in Gmail or Outlook / Mail app below.', 'error');
        }).then(function () {
          clearTimeout(timeoutId);
          resetSubmitState();
        });
      });

      var gmailBtn = form.querySelector('.js-send-gmail');
      if (gmailBtn) {
        gmailBtn.addEventListener('click', function () {
          var url = buildGmailUrl(readDraft());
          var win = window.open(url, '_blank', 'noopener,noreferrer');
          if (win === null) {
            setStatus('Popup blocked. Allow popups or copy ' + TARGET_EMAIL + '.', 'info');
          } else {
            setStatus('Opening Gmail compose in a new tab with your draft.', 'info');
          }
        });
      }

      var mailtoBtn = form.querySelector('.js-send-mailto');
      if (mailtoBtn) {
        mailtoBtn.addEventListener('click', function () {
          var url = buildMailtoUrl(readDraft());
          setStatus('Opening Outlook / your default mail app with your draft.', 'info');
          window.location.href = url;
        });
      }

      var copyEmailBtns = form.closest('.section-container') ? form.closest('.section-container').querySelectorAll('.js-copy-email') : document.querySelectorAll('.js-copy-email');
      copyEmailBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var emailAddr = btn.getAttribute('data-email') || TARGET_EMAIL;
          var notifyCopied = function () {
            var origText = btn.textContent;
            btn.textContent = 'Copied email';
            setStatus('Email copied (' + emailAddr + '). Paste it in any mail app.', 'success');
            setTimeout(function () {
              btn.textContent = origText;
            }, 1800);
          };

          var copyViaTextarea = function () {
            var ta = document.createElement('textarea');
            ta.value = emailAddr;
            ta.setAttribute('readonly', '');
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            try {
              document.execCommand('copy');
              notifyCopied();
            } catch (copyErr) {
              setStatus('Copy manually: ' + emailAddr, 'info');
            } finally {
              document.body.removeChild(ta);
            }
          };

          if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            navigator.clipboard.writeText(emailAddr).then(notifyCopied, copyViaTextarea);
          } else {
            copyViaTextarea();
          }
        });
      });
    }

    initContactForm();

    // 11. Footer Back-to-Top Smooth Scroll
    document.querySelectorAll('.to-top').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    });

    // 12. Document Page Helpers (Responsive TOC <details> + Desktop Section Link Copy & Toast)
    function initDocPageEnhancements() {
      if (!document.body.classList.contains('page-document')) return;

      var tocPanel = document.querySelector('.doc-toc-panel');
      if (tocPanel && window.matchMedia) {
        var compactMq = window.matchMedia('(max-width: 1024px)');
        var syncTocDisclosure = function () {
          tocPanel.open = !compactMq.matches;
        };
        syncTocDisclosure();
        if (typeof compactMq.addEventListener === 'function') {
          compactMq.addEventListener('change', syncTocDisclosure);
        }
        tocPanel.querySelectorAll('nav a').forEach(function (link) {
          link.addEventListener('click', function () {
            if (compactMq.matches) tocPanel.open = false;
          });
        });
      }

      var headings = Array.from(document.querySelectorAll('.doc-section[id] > h2'));
      if (!headings.length) return;

      var toast = document.querySelector('.doc-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.className = 'doc-toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.textContent = 'Link copied';
        document.body.appendChild(toast);
      }
      var toastTimer = null;

      function showToast() {
        toast.classList.add('is-visible');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
          toast.classList.remove('is-visible');
        }, 1200);
      }

      function fallbackCopy(text) {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          // Ignore clipboard errors in restricted frames
        }
        document.body.removeChild(ta);
        showToast();
      }

      function copySectionUrl(sectionId) {
        var base = window.location.href.split('#')[0];
        var fullUrl = base + '#' + sectionId;
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
          navigator.clipboard.writeText(fullUrl).then(showToast, function () {
            fallbackCopy(fullUrl);
          });
        } else {
          fallbackCopy(fullUrl);
        }
      }

      headings.forEach(function (h2) {
        var sec = h2.closest('.doc-section');
        if (!sec || !sec.id || h2.querySelector('.doc-anchor-btn')) return;

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'doc-anchor-btn';
        btn.setAttribute('aria-label', 'Copy link to ' + (h2.textContent || sec.id).trim());
        btn.innerHTML = '<span aria-hidden="true">#</span><span class="doc-anchor-tooltip" aria-hidden="true">Copy link</span>';
        btn.addEventListener('click', function () {
          copySectionUrl(sec.id);
        });
        h2.appendChild(btn);
      });
    }

    initDocPageEnhancements();
  });
})();
