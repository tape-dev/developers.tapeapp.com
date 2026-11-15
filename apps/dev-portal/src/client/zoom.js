// Image zoom like the reference (measured 15.11.2026): a click on a content image opens it
// full size over a 90 % backdrop, with Zoom out / Zoom in / Close top right.
// Steps 1x and 2x, drag to pan at 2x, Esc or a click beside the image closes.
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const MS = 340;
const CROP = 56 / 3840; // white macOS title bar baked into the screenshots
const ICON = {
  out: '<path d="M5 12h14"/>',
  in: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
};
const svg = (p) => `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;

let open = null;

function fit(img, crop) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const padX = vw >= 768 ? 32 : 0;
  const nw = img.naturalWidth || img.width;
  const nh = (img.naturalHeight || img.height) - (crop ? nw * CROP : 0);
  const s = Math.min((vw - 2 * padX) / nw, (vh - 64) / nh, 1);
  const w = nw * s;
  const h = nh * s;
  return { w, h, x: (vw - w) / 2, y: (vh - h) / 2 };
}

function close() {
  if (!open) return;
  const { root, clip, src, crop, onKey, onResize } = open;
  open = null;
  document.removeEventListener('keydown', onKey, true);
  window.removeEventListener('resize', onResize);
  clip.style.transition = 'none';
  clip.style.transform = 'none';
  clip.style.transformOrigin = '0 0';
  const from = clip.getBoundingClientRect();
  const to = visibleRect(src, crop);
  root.classList.remove('is-open');
  if (to.width && to.bottom > 0 && to.top < window.innerHeight) {
    clip.getBoundingClientRect(); // flush
    clip.style.transition = `transform ${MS}ms ${EASE}`;
    clip.style.transform = `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${to.width / from.width})`;
  }
  setTimeout(() => {
    root.remove();
    document.documentElement.classList.remove('tp-zoom-lock');
    const back = src.closest('.tp-frame__media')?.querySelector('.tp-frame__expand');
    if (back) back.focus({ preventScroll: true });
  }, MS);
}

// the part of the page image the reader sees (frame clips the title bar)
function visibleRect(img, crop) {
  const r = img.getBoundingClientRect();
  if (!crop) return r;
  const cut = r.width * CROP;
  return { left: r.left, top: r.top + cut, width: r.width, height: r.height - cut, bottom: r.bottom };
}

function show(src) {
  const crop = !!src.closest('.tp-frame__media--crop');
  const root = document.createElement('div');
  root.className = 'tp-zoom';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', src.alt || 'Image');
  root.tabIndex = -1;
  root.innerHTML = `<div class="tp-zoom__backdrop"></div>
    <div class="tp-zoom__bar">
      <button type="button" class="tp-zoom__btn" data-z="out" aria-label="Zoom out" disabled>${svg(ICON.out)}</button>
      <button type="button" class="tp-zoom__btn" data-z="in" aria-label="Zoom in">${svg(ICON.in)}</button>
      <button type="button" class="tp-zoom__btn" data-z="close" aria-label="Close">${svg(ICON.close)}</button>
    </div>
    <div class="tp-zoom__stage"><div class="tp-zoom__clip${crop ? ' tp-zoom__clip--crop' : ''}"><img alt=""></div></div>`;
  const clip = root.querySelector('.tp-zoom__clip');
  const big = clip.querySelector('img');
  big.src = src.currentSrc || src.src;
  big.alt = src.alt || '';
  big.draggable = false;
  const bOut = root.querySelector('[data-z=out]');
  const bIn = root.querySelector('[data-z=in]');

  let box = fit(src, crop);
  let scale = 1;
  let pan = { x: 0, y: 0 };
  const place = () => {
    clip.style.width = `${box.w}px`;
    clip.style.height = `${box.h}px`;
  };
  const apply = (animate) => {
    clip.style.transition = animate ? `transform ${MS}ms ${EASE}` : 'none';
    clip.style.transformOrigin = '50% 50%';
    clip.style.transform = scale === 1 ? 'none' : `translate(${pan.x}px, ${pan.y}px) scale(${scale})`;
    root.classList.toggle('is-zoomed', scale > 1);
    bOut.disabled = scale === 1;
    bIn.disabled = scale === 2;
  };
  const clampPan = () => {
    const mx = Math.max(0, (box.w * scale - window.innerWidth) / 2);
    const my = Math.max(0, (box.h * scale - window.innerHeight) / 2);
    pan.x = Math.min(mx, Math.max(-mx, pan.x));
    pan.y = Math.min(my, Math.max(-my, pan.y));
  };

  root.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (b) {
      if (b.dataset.z === 'close') close();
      if (b.dataset.z === 'in') { scale = 2; pan = { x: 0, y: 0 }; apply(true); }
      if (b.dataset.z === 'out') { scale = 1; pan = { x: 0, y: 0 }; apply(true); }
      return;
    }
    if (e.target === big || moved) return; // a click on the image itself keeps it open
    close();
  });

  // drag to pan at 2x
  let drag = null;
  let moved = false;
  big.addEventListener('pointerdown', (e) => {
    moved = false;
    if (scale === 1) return;
    drag = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
    big.setPointerCapture(e.pointerId);
    root.classList.add('is-panning');
  });
  big.addEventListener('pointermove', (e) => {
    if (!drag) return;
    pan.x = drag.px + e.clientX - drag.x;
    pan.y = drag.py + e.clientY - drag.y;
    if (Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) > 3) moved = true;
    clampPan();
    apply(false);
  });
  const endDrag = () => { drag = null; root.classList.remove('is-panning'); };
  big.addEventListener('pointerup', endDrag);
  big.addEventListener('pointercancel', endDrag);

  const onKey = (e) => {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
    if (e.key === 'Tab') { // keep the focus inside the dialog
      const f = Array.from(root.querySelectorAll('button:not(:disabled)'));
      const i = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(i + (e.shiftKey ? f.length - 1 : 1) + f.length) % f.length].focus();
    }
  };
  const onResize = () => { box = fit(src, crop); place(); clampPan(); apply(false); };

  place();
  document.documentElement.classList.add('tp-zoom-lock');
  document.body.appendChild(root);
  document.addEventListener('keydown', onKey, true);
  window.addEventListener('resize', onResize);
  open = { root, clip, src, crop, onKey, onResize };

  // grow from the image on the page to the full view
  const from = visibleRect(src, crop);
  const to = clip.getBoundingClientRect();
  clip.style.transition = 'none';
  clip.style.transformOrigin = '0 0';
  clip.style.transform = `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width})`;
  root.getBoundingClientRect(); // flush
  root.classList.add('is-open');
  clip.style.transition = `transform ${MS}ms ${EASE}`;
  clip.style.transform = 'none';
  root.focus({ preventScroll: true });
}

if (ExecutionEnvironment.canUseDOM) {
  document.addEventListener('click', (e) => {
    const img = e.target.closest && e.target.closest('.markdown img');
    if (!img || img.closest('a') || open || e.button !== 0 || e.metaKey || e.ctrlKey) return;
    if (img.getBoundingClientRect().width < 120) return;
    e.preventDefault();
    show(img);
  });
}
