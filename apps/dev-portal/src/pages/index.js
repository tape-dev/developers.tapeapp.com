import React, { useEffect } from 'react';
import Head from '@docusaurus/Head';
import { useHistory } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
// Keeps the hashed /assets/images/texture-*.jpg of the former home page reachable (old links must not break).
import TextureImageUrl from '@site/static/img/texture.jpg';

// No marketing home page, "/" opens the Quickstart.
// Works on static hosting (GitHub Pages): meta refresh in the HTML + client redirect.
export default function Home() {
  const target = useBaseUrl('/docs/guide/api/getting-started/');
  const history = useHistory();
  const hash = useDocusaurusContext().siteConfig.future?.experimental_router === 'hash';
  useEffect(() => { history.replace(hash ? '/docs/guide/api/getting-started/' : target); }, [history, target, hash]);
  return (
    <Head>
      {!hash && <meta httpEquiv="refresh" content={`0; url=${target}`} />}
      <link rel="canonical" href={`https://developers.tapeapp.com${target}`} />
      <title>Tape Developer Docs</title>
    </Head>
  );
}

Home.legacyAssets = [TextureImageUrl];
