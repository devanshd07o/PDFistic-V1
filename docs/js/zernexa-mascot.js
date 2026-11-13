/**
 * Zernexa AI Interactive Mascot Controller
 * Renders animated sprite states (idle_blink, hi_wave, listening, thinking, speaking)
 * for the Zernexa Support Concierge on PDFistic.
 */
(function (globalScope) {
  'use strict';

  var STATES = {
    idle_blink: { frames: 6, fps: 7, loop: true, basePath: 'assets/pet/idle_blink' },
    hi_wave:    { frames: 6, fps: 8, loop: false, basePath: 'assets/pet/hi_wave' },
    listening:  { frames: 6, fps: 8, loop: true, basePath: 'assets/pet/listening' },
    thinking:   { frames: 6, fps: 8, loop: true, basePath: 'assets/pet/thinking' },
    speaking:   { frames: 6, fps: 8, loop: true, basePath: 'assets/pet/speaking' }
  };

  function ZernexaMascot(options) {
    options = options || {};
    this.canvas = options.canvas;
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.imgFallback = options.imgElement || null;
    this.currentState = 'idle_blink';
    this.currentFrame = 0;
    this.isPlaying = false;
    this.animationId = null;
    this.lastFrameTime = 0;
    this.loadedImages = {};
    this.onStateComplete = null;
    this.reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.preload();
  }

  ZernexaMascot.prototype.preload = function () {
    var self = this;
    var supportsWebp = true; // Modern browsers all support webp

    Object.keys(STATES).forEach(function (stateKey) {
      var state = STATES[stateKey];
      self.loadedImages[stateKey] = [];
      for (var i = 1; i <= state.frames; i++) {
        var img = new Image();
        img.src = state.basePath + '/frame_' + i + '.webp';
        self.loadedImages[stateKey].push(img);
      }
    });
  };

  ZernexaMascot.prototype.renderFrame = function () {
    if (!this.canvas && !this.imgFallback) return;
    var state = STATES[this.currentState] || STATES.idle_blink;
    var frames = this.loadedImages[this.currentState] || this.loadedImages.idle_blink;
    var img = frames ? frames[this.currentFrame] : null;

    if (this.ctx && img && img.complete && img.naturalWidth > 0) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    } else if (this.imgFallback && img) {
      this.imgFallback.src = img.src;
    }
  };

  ZernexaMascot.prototype.tick = function (now) {
    if (!this.isPlaying) return;

    var state = STATES[this.currentState] || STATES.idle_blink;
    var frameInterval = 1000 / state.fps;

    if (now - this.lastFrameTime >= frameInterval) {
      this.lastFrameTime = now;
      this.renderFrame();

      this.currentFrame++;
      if (this.currentFrame >= state.frames) {
        if (state.loop) {
          this.currentFrame = 0;
        } else {
          this.currentFrame = state.frames - 1;
          if (typeof this.onStateComplete === 'function') {
            var cb = this.onStateComplete;
            this.onStateComplete = null;
            cb();
          } else {
            // Revert back to calm idle
            this.setState('idle_blink');
          }
        }
      }
    }

    if (!this.reducedMotion && this.isPlaying) {
      var self = this;
      this.animationId = requestAnimationFrame(function (time) {
        self.tick(time);
      });
    }
  };

  ZernexaMascot.prototype.start = function () {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.lastFrameTime = performance.now();
    if (this.reducedMotion) {
      this.currentFrame = 0;
      this.renderFrame();
    } else {
      var self = this;
      this.animationId = requestAnimationFrame(function (time) {
        self.tick(time);
      });
    }
  };

  ZernexaMascot.prototype.stop = function () {
    this.isPlaying = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  };

  ZernexaMascot.prototype.setState = function (stateName, onComplete) {
    if (!STATES[stateName]) stateName = 'idle_blink';
    if (this.currentState === stateName && STATES[stateName].loop) return;

    this.currentState = stateName;
    this.currentFrame = 0;
    this.lastFrameTime = performance.now();
    this.onStateComplete = onComplete || null;

    if (!this.isPlaying) {
      this.start();
    }
  };

  ZernexaMascot.prototype.wave = function (callback) {
    var self = this;
    this.setState('hi_wave', function () {
      self.setState('idle_blink');
      if (typeof callback === 'function') callback();
    });
  };

  globalScope.ZernexaMascot = ZernexaMascot;
})(typeof window !== 'undefined' ? window : globalThis);
