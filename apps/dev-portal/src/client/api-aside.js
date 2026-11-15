// API pages (>= 1280 px): one example column per page that never moves, like an endpoint page of the
// reference. Our pages hold several endpoints, so the column shows the request and response of the
// endpoint in view; switching is a short fade (CSS), nothing slides. The column is never empty:
// above the first endpoint it shows the first one, after the last endpoint (object reference,
// errors) it keeps the last one.
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

let frame = 0;

function update() {
  frame = 0;
  const aside = document.querySelector('.markdown > .tp-api-aside');
  if (!aside || !aside.offsetWidth) return; // no API page, or below 1280 px
  const markers = Array.from(document.querySelectorAll('.markdown > .tp-api-sec[data-sec]'));
  if (!markers.length) return;
  const vh = window.innerHeight;
  const atEnd = window.scrollY + vh >= document.documentElement.scrollHeight - 2;
  // a section counts as "in view" once its heading passes the middle of the window;
  // at the bottom of the page the last section whose heading is visible wins
  const line = atEnd ? vh - 120 : vh / 2;
  const val = (m) => m.getAttribute('data-sec');
  let active = val(markers[0]);
  for (const m of markers) if (m.getBoundingClientRect().top <= line) active = val(m);
  if (aside.getAttribute('data-active') === active) return;
  aside.setAttribute('data-active', active);
  aside.querySelectorAll('.tp-api-panel').forEach((p) => {
    if (p.getAttribute('data-sec') === active) p.setAttribute('data-on', '');
    else p.removeAttribute('data-on');
  });
}

const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };

if (ExecutionEnvironment.canUseDOM) {
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
}

export function onRouteDidUpdate() {
  // after hydration and the anchor jump of the new page
  schedule();
  setTimeout(schedule, 150);
}
