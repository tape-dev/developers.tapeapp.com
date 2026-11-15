import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import TOCItems from '@theme/TOCItems';

const ACTIVE = 'tp-toc__link--active';

// Scroll-spy like the reference: a heading becomes active once its top is
// 137 px (or less) from the top of the window. First entry active at the top
// of the page, last entry active at the end of the page.
function useScrollSpy(ref) {
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const links = Array.from(ref.current?.querySelectorAll('a.tp-toc__link') || []);
      if (!links.length) return;
      const ids = links.map((a) => decodeURIComponent((a.getAttribute('href') || '').split('#').pop()));
      const heads = ids.map((id) => document.getElementById(id));
      let idx = 0;
      heads.forEach((h, i) => { if (h && h.getBoundingClientRect().top <= 137) idx = i; });
      const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atEnd && window.scrollY > 0) idx = links.length - 1;
      links.forEach((a, i) => a.classList.toggle(ACTIVE, i === idx));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(frame); };
  }, [ref]);
}

export default function TOC({ className, ...props }) {
  const ref = useRef(null);
  useScrollSpy(ref);
  return (
    <div ref={ref} className={clsx('tp-toc thin-scrollbar', className)}>
      <div className="tp-toc__label">
        <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M1 2.5h10M1 6h7M1 9.5h8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" /></svg>
        On this page
      </div>
      {/* no linkActiveClassName: Docusaurus' own highlighting is replaced by useScrollSpy */}
      <TOCItems {...props} className="tp-toc__list" linkClassName="tp-toc__link" />
    </div>
  );
}
