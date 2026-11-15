import clsx from 'clsx';
import React, { useRef } from 'react';

/**
 * Frame around a screenshot or video, like the reference: light grey frame
 * with 8 px padding, 16 px outer and 12 px inner radius, optional caption.
 * The screenshots carry a white macOS title bar of 56/3840 of their width;
 * `crop` (default) hides it, so no window chrome is visible.
 * A click on the image opens the zoom (src/client/zoom.js); keyboard users get
 * an "Expand image" button that shows while focused.
 */
export default function MediaFrame({ children, caption, crop = true }) {
  const media = useRef(null);
  const img = React.Children.toArray(children).find((c) => c && c.type === 'img');
  const expand = () => {
    const el = media.current && media.current.querySelector('img');
    if (el) el.click();
  };
  return (
    <figure className="tp-frame">
      <div ref={media} className={clsx('tp-frame__media', crop && 'tp-frame__media--crop')}>
        {children}
        {img ? (
          <button type="button" className="tp-frame__expand" aria-haspopup="dialog" aria-label={`Expand image${img.props.alt ? `: ${img.props.alt}` : ''}`} onClick={expand}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 3h6v6" /><path d="m21 3-7 7" /><path d="m3 21 7-7" /><path d="M9 21H3v-6" />
            </svg>
          </button>
        ) : null}
      </div>
      {caption ? <figcaption className="tp-frame__caption">{caption}</figcaption> : null}
    </figure>
  );
}
