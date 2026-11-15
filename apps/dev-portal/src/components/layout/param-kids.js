import React, { useState } from 'react';

// "Show child attributes" box under a parameter (collapsed by default, like the reference)
export default function ParamKids({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="tp-kids" data-open={open ? '' : undefined}>
      <button type="button" className="tp-kids__head" aria-expanded={open} onClick={() => setOpen(!open)}>
        <svg className="tp-kids__chev" viewBox="0 0 10 10" width="10" height="10" aria-hidden="true">
          <path d="M3.5 1.5 7 5 3.5 8.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="tp-kids__label">{open ? 'Hide child attributes' : 'Show child attributes'}</span>
      </button>
      <div className="tp-kids__body" hidden={!open}>{children}</div>
    </div>
  );
}
