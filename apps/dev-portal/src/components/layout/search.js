import React, { useCallback, useEffect, useState } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { Search } from 'lucide-react';
import SearchModal from './search-modal';
import { loadFulltext } from './fulltext';

// Search pill in the header; Cmd+K / Ctrl+K opens the search dialog
export default function SearchButton() {
  const [open, setOpen] = useState(false);
  const [mac, setMac] = useState(true);
  const base = useBaseUrl('/');
  const close = useCallback(() => setOpen(false), []);
  // Load the search index as soon as the pointer or focus is on the pill, so results are there when typing starts
  const prefetch = () => { loadFulltext(base).catch(() => {}); };
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
      <button type="button" className="tp-search" onClick={() => setOpen(true)} onMouseEnter={prefetch} onFocus={prefetch} aria-label="Search">
        <Search size={16} strokeWidth={1.75} />
        <span className="tp-search__ph">Search...</span>
        <kbd className="tp-search__kbd">{mac ? '⌘K' : 'Ctrl K'}</kbd>
      </button>
      {open && <SearchModal onClose={close} />}
    </>
  );
}
