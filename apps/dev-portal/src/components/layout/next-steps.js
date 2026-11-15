import React from 'react';
import Link from '@docusaurus/Link';
import breakable from './breakable';
import {
  ArrowRightLeft, BookOpen, Braces, Building2, Calculator, Clock, Columns3, FileText, History,
  KeyRound, LayoutGrid, ListOrdered, Mail, MessageSquare, Plug, Search, ShieldCheck, Table,
  TriangleAlert, Upload, Users, Webhook, Zap, Gauge, Filter, Bell, Lock,
} from 'lucide-react';

// Icon per target page (own choice, Lucide icons, ISC license)
const RULES = [
  [/coming-from-podio/, ArrowRightLeft],
  [/webhook/, Webhook],
  [/mcp/, Plug],
  [/personal-access-tokens|authentication|oauth/, KeyRound],
  [/capabilities/, ShieldCheck],
  [/record-permissions/, Lock],
  [/errors|troubleshooting|limitations/, TriangleAlert],
  [/pagination/, ListOrdered],
  [/request-limits|rate/, Gauge],
  [/versioning|revision/, History],
  [/date-timezone|delay/, Clock],
  [/calculation/, Calculator],
  [/automation/, Zap],
  [/field-value|\/field\//, Columns3],
  [/filter/, Filter],
  [/follow/, Bell],
  [/comment/, MessageSquare],
  [/record/, FileText],
  [/\/app/, LayoutGrid],
  [/\/view/, Table],
  [/workspace|organization/, Building2],
  [/\/user/, Users],
  [/\/file/, Upload],
  [/\/search/, Search],
  [/email/, Mail],
  [/\/api\//, Braces],
];

function iconFor(href = '') {
  const hit = RULES.find(([re]) => re.test(href));
  return hit ? hit[1] : BookOpen;
}

export function NextSteps({ children }) {
  return <div className="tp-cards">{children}</div>;
}

export function NextStepCard({ href, title, children }) {
  const Icon = iconFor(href);
  return (
    <Link to={href} className="tp-card">
      <span className="tp-card__icon" aria-hidden="true"><Icon size={16} strokeWidth={1.75} /></span>
      <div className="tp-card__body">
        <div className="tp-card__title">{breakable(title)}</div>
        <div className="tp-card__text">{children}</div>
      </div>
    </Link>
  );
}
