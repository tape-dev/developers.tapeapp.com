import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import SearchModal from './search-modal';

// Search pill in the header; Cmd+K / Ctrl+K opens the search dialog
export default function SearchButton() {
  const [open, setOpen] = useState(false);
  const [mac, setMac] = useState(true);
  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.platform));
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((o) => !o); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <>
      <button type="button" className="tp-search" onClick={() => setOpen(true)} aria-label="Search">
        <Search size={16} strokeWidth={1.75} />
        <span className="tp-search__ph">Search...</span>
        <kbd className="tp-search__kbd">{mac ? '⌘K' : 'Ctrl K'}</kbd>
      </button>
      {open && <SearchModal onClose={() => setOpen(false)} />}
    </>
  );
}
