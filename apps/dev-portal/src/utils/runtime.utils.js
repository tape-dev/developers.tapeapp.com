export function getRuntimeFromDocusaurusCtx(docusaurusContext) {
  return docusaurusContext?.siteConfig?.customFields?.runtime || 'PRD';
}
