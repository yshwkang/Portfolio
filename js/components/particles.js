(function (P) {
  'use strict';

  const TAU = Math.PI * 2;
  const SPRING = 0.035; // 목표 위치로 돌아가려는 힘
  const FRICTION = 0.84;
  const REPEL_RADIUS = 120;
  const REPEL_FORCE = 2.4;

  /**
   * Hero 파티클: 텍스트 형태로 모이고 포인터에 반응하는 Canvas 2D 시스템.
   * - 화면 밖 / 탭 비활성 / 모든 파티클이 정지한 상태에서는 루프를 멈춘다.
   * - prefers-reduced-motion 이면 정지된 텍스트 형태로 한 번만 그린다.
   */
  function initParticles({ container, canvas, text }) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const smallScreen = matchMedia('(max-width: 720px)');
    const pointer = { x: 0, y: 0, active: false };

    let particles = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let colors = readColors();
    let raf = 0;
    let last = 0;
    let inView = true;
    let resizeTimer = 0;

    function readColors() {
      const style = getComputedStyle(document.documentElement);
      return {
        base: style.getPropertyValue('--particle').trim() || '#888',
        accent: style.getPropertyValue('--accent').trim() || '#888',
      };
    }

    // 오프스크린 캔버스에 텍스트를 그린 뒤 픽셀을 샘플링해 목표 좌표를 만든다
    function buildTargets() {
      const off = document.createElement('canvas');
      off.width = width;
      off.height = height;
      const octx = off.getContext('2d', { willReadFrequently: true });
      const family = getComputedStyle(document.documentElement).getPropertyValue('--font-display');

      octx.font = `800 100px ${family}`;
      const measured = octx.measureText(text).width || 1;
      const size = Math.min((100 * width * 0.88) / measured, height * 0.24);
      octx.font = `800 ${size}px ${family}`;
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      octx.fillStyle = '#000';
      octx.fillText(text, width / 2, height * 0.36);

      const { data } = octx.getImageData(0, 0, width, height);
      const collect = (gap) => {
        const points = [];
        for (let y = 0; y < height; y += gap) {
          for (let x = 0; x < width; x += gap) {
            if (data[(y * width + x) * 4 + 3] > 128) points.push([x, y]);
          }
        }
        return points;
      };

      // 기기 성능에 맞춰 파티클 수 상한을 지키도록 간격을 늘린다
      const max = smallScreen.matches ? 500 : 1500;
      let gap = 2;
      let points = collect(gap);
      if (points.length > max) {
        gap = Math.ceil(gap * Math.sqrt(points.length / max));
        points = collect(gap);
      }
      return { points, gap };
    }

    function resize() {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const { points, gap } = buildTargets();
      const previous = particles;
      particles = points.map(([tx, ty], i) => {
        const old = previous[i];
        return {
          tx,
          ty,
          x: old ? old.x : tx + (Math.random() - 0.5) * 400,
          y: old ? old.y : ty + (Math.random() - 0.5) * 400,
          vx: 0,
          vy: 0,
          r: gap * (0.2 + Math.random() * 0.15), // 간격이 넓을수록 점을 키워 글자 윤곽 유지
          accent: Math.random() < 0.12,
        };
      });

      if (reducedMotion.matches) snapToTargets();
      draw();
      start();
    }

    function snapToTargets() {
      for (const p of particles) {
        p.x = p.tx;
        p.y = p.ty;
        p.vx = p.vy = 0;
      }
    }

    // 반환값: 아직 움직이는 파티클이 있는지
    function step(dt) {
      const spring = SPRING * dt;
      const friction = Math.pow(FRICTION, dt);
      const r2 = REPEL_RADIUS * REPEL_RADIUS;
      let moving = false;

      for (const p of particles) {
        p.vx += (p.tx - p.x) * spring;
        p.vy += (p.ty - p.y) * spring;

        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < r2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const force = (1 - d / REPEL_RADIUS) * REPEL_FORCE * dt;
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
          }
        }

        p.vx *= friction;
        p.vy *= friction;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        if (
          !moving &&
          (Math.abs(p.vx) > 0.02 || Math.abs(p.vy) > 0.02 || Math.abs(p.tx - p.x) > 0.1 || Math.abs(p.ty - p.y) > 0.1)
        ) {
          moving = true;
        }
      }
      return moving;
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (const [isAccent, color] of [[false, colors.base], [true, colors.accent]]) {
        ctx.fillStyle = color;
        ctx.beginPath();
        for (const p of particles) {
          if (p.accent !== isAccent) continue;
          ctx.moveTo(p.x + p.r, p.y);
          ctx.arc(p.x, p.y, p.r, 0, TAU);
        }
        ctx.fill();
      }
    }

    function frame(now) {
      // rAF 타임스탬프가 start()의 performance.now()보다 앞설 수 있어 하한을 둔다
      const dt = Math.min(Math.max((now - last) / 16.67, 0.1), 2.5);
      last = now;
      const moving = step(dt);
      draw();
      raf = moving || pointer.active ? requestAnimationFrame(frame) : 0;
    }

    function start() {
      if (raf || reducedMotion.matches || !inView || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }

    function setPointer(e) {
      const rect = container.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
      start();
    }

    const release = () => {
      pointer.active = false;
    };

    container.addEventListener('pointermove', setPointer);
    container.addEventListener('pointerdown', setPointer);
    container.addEventListener('pointerleave', release);
    container.addEventListener('pointercancel', release);
    container.addEventListener('pointerup', (e) => e.pointerType !== 'mouse' && release());
    window.addEventListener('scroll', release, { passive: true });

    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    }).observe(container);

    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

    new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    }).observe(container);

    window.addEventListener('themechange', () => {
      colors = readColors();
      draw();
    });

    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) {
        stop();
        snapToTargets();
        draw();
      } else {
        start();
      }
    });

    resize();
    return { redraw: draw };
  }

  P.initParticles = initParticles;
})((window.Portfolio = window.Portfolio || {}));
