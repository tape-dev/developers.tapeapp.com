import React, { useState } from 'react';
import useMenu from './use-menu';
import { useColorMode } from '@docusaurus/theme-common';
import { Monitor, Sun, Moon, Check } from 'lucide-react';

const OPTIONS = [
  [null, 'System', Monitor],
  ['light', 'Light', Sun],
  ['dark', 'Dark', Moon],
];

// Theme button in the header: opens a small menu (System, Light, Dark); the icon shows the current choice
export default function ThemeMenu() {
  const { colorModeChoice, setColorMode } = useColorMode();
  const [open, setOpen] = useState(false);
  const { btn, menu, wrap } = useMenu(open, setOpen);
  const current = OPTIONS.find((o) => o[0] === colorModeChoice) || OPTIONS[0];
  const CurrentIcon = current[2];
  return (
    <div className="tp-theme-toggle" ref={wrap}>
      <button ref={btn} type="button" className="tp-theme__btn" aria-label={`Theme: ${current[1]}`} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <CurrentIcon size={16} strokeWidth={1.75} aria-hidden="true" />
      </button>
      {open && (
        <div ref={menu} className="tp-theme__menu" role="menu">
          {OPTIONS.map(([value, label, Icon]) => {
            const on = value === colorModeChoice;
            return (
              <button key={label} type="button" role="menuitemradio" aria-checked={on} className={'tp-theme__item' + (on ? ' is-on' : '')} onClick={() => { setColorMode(value); setOpen(false); if (btn.current) btn.current.focus(); }}>
                <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                <span>{label}</span>
                {on && <Check className="tp-theme__check" size={16} strokeWidth={2} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
