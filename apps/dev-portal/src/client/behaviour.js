// Behaviour fixes from the acceptance (Nörgler + analyzer behavior run, 15.11.2026)
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

let userScrolled = false;
let timers = [];
let ours = false;
let lastY = 0;
let popNav = false;
let graceUntil = 0;
const cancel = () => { timers.forEach(clearTimeout); timers = []; };

if (ExecutionEnvironment.canUseDOM) {
  // any input or any scroll we did not cause ends the anchor correction (Nörgler N1, Runde 2)
  // Clicks (a link to an anchor) and scroll events (Docusaurus jumps to the anchor itself) must NOT
  // count, otherwise the correction never runs (Nörgler Runde 3, B1). Only scrolling input does.
  ['wheel', 'touchmove', 'keydown'].forEach((t) =>
    window.addEventListener(t, () => { userScrolled = true; cancel(); }, { passive: true }));
  // Back/Forward: keep the reading position the browser restores (N2)
  window.addEventListener('popstate', () => { popNav = true; });
  // Esc closes the mobile menu: handled in theme/Navbar/MobileSidebar/Layout (also returns the focus)
}

// Keep the active sidebar entry visible on deep pages
function revealActiveSidebarItem() {
  const a = document.querySelector('.theme-doc-sidebar-menu a.menu__link[aria-current="page"]');
  const box = a && a.closest('nav.menu');
  if (!a || !box) return;
  const r = a.getBoundingClientRect();
  const b = box.getBoundingClientRect();
  if (r.top < b.top + 40 || r.bottom > b.bottom - 40) box.scrollTop += r.top - b.top - b.height / 3;
}

// Anchor target again after late layout shifts (login hint, images without size)
function settleHash(hash) {
  if (!hash) return;
  const id = decodeURIComponent(hash.slice(1));
  const go = () => {
    if (userScrolled) return;
    const el = document.getElementById(id);
    if (!el) return;
    ours = true;
    el.scrollIntoView({ block: 'start' });
    lastY = window.scrollY;
    requestAnimationFrame(() => { ours = false; });
  };
  lastY = window.scrollY;
  graceUntil = Date.now() + 150;
  timers = [120, 450, 1000, 1800].map((ms) => setTimeout(go, ms));
  Array.from(document.images).forEach((img) => { if (!img.complete) img.addEventListener('load', go, { once: true }); });
}

export function onRouteDidUpdate({ location, previousLocation }) {
  cancel();
  const pop = popNav;
  popNav = false;
  if (previousLocation && location.pathname === previousLocation.pathname && location.hash !== previousLocation.hash) return;
  userScrolled = false;
  requestAnimationFrame(() => {
    revealActiveSidebarItem();
    if (!pop) settleHash(location.hash);
  });
}
