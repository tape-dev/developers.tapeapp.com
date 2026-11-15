import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import { Monitor, Sun, Moon } from 'lucide-react';

const OPTIONS = [
  [null, 'System', Monitor],
  ['light', 'Light', Sun],
  ['dark', 'Dark', Moon],
];

// Three-way theme switch (system, light, dark), used in the mobile menu
export default function ThemeSwitch() {
  const { colorModeChoice, setColorMode } = useColorMode();
  return (
    <div className="tp-switch" role="radiogroup" aria-label="Theme">
      {OPTIONS.map(([value, label, Icon]) => (
        <button
          key={label}
          type="button"
          role="radio"
          aria-checked={colorModeChoice === value}
          aria-label={label}
          title={label}
          className={'tp-switch__opt' + (colorModeChoice === value ? ' is-on' : '')}
          onClick={() => setColorMode(value)}>
          <Icon size={16} strokeWidth={1.75} />
        </button>
      ))}
    </div>
  );
}
