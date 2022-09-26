import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';
import { ActiveUserPrimaryName } from '@site/src/components/active-user-primary-name/active-user-primary-name.component';
import TextureImageUrl from '@site/static/img/texture.jpg';
import LinkSvg from '@site/static/icon/link.svg';

const features = [
  {
    title: 'Records',
    description: (
      <>
        Build almost anything by creating, retrieving or updating records in
        Tape. The comprehensive sort, filter and pagination options give you
        full control over the data you receive.
      </>
    ),
    badge: 'private-beta',
    linkLabel: 'Learn more',
    link: 'docs/api/resource/record',
  },
  {
    title: 'Apps',
    description: (
      <>
        Dynamically adapt your team's data and processes to changing
        requirements. Create an app from scratch, duplicate an existing one or
        move an app from one workspace to another.
      </>
    ),
    badge: 'private-beta',
    linkLabel: 'Learn more',
    link: 'docs/api/resource/app',
  },
  {
    title: 'Workflow Automations',
    description: (
      <>
        Automate your work using Tape's customizable low-code workflow editor.
        Connect with external systems and APIs and leverage different triggers
        inside Tape.
      </>
    ),
    badge: 'private-alpha',
    linkLabel: 'Learn more',
    link: 'docs/automations/introduction',
  },
  {
    title: 'Workspaces',
    description: (
      <>
        Facilitate onboarding and permission management via the workspace
        endpoints. Move lots of data with ease by duplicating an existing
        workspace from the same or another organization.
      </>
    ),
    badge: 'private-beta',
    linkLabel: 'Learn more',
    link: 'docs/api/resource/workspace',
  },
  {
    title: 'Webhooks',
    description: (
      <>
        Create powerful integrations via webhooks. Get detailed insights into
        everything that happens inside Tape including record, app and workspace
        changes. Programmatically register and de-register webhooks for all
        resources.
      </>
    ),
    badge: 'private-beta',
    linkLabel: 'Learn more',
    link: 'docs/api/resource/webhook',
  },
  {
    title: 'Calculations',
    description: (
      <>
        Leverage the power of calculations to solve your business needs.
        Calculation fields can range from simple additions to custom JavaScript
        code. Furthermore, the output rendering supports Markdown, HTML and CSS.
      </>
    ),
    badge: 'released',
    linkLabel: 'Learn more',
    link: 'docs/calculation/introduction',
  },
];

function Feature({ title, description, badge, link, linkLabel }) {
  const badgeComponent = !badge ? (
    <span></span>
  ) : badge === 'private-beta' ? (
    <span type="primary" className={styles.badge}>
      PRIVATE BETA
    </span>
  ) : badge === 'private-alpha' ? (
    <span type="primary" className={styles.badge}>
      PRIVATE ALPHA
    </span>
  ) : badge === 'released' ? (
    <span type="primary" className={styles.badge}>
      RELEASED
    </span>
  ) : (
    <span className={styles.badge}>NOT AVAILABLE</span>
  );

  const linkComponent = link ? (
    <Link
      to={useBaseUrl(link)}
      style={{
        width: 'fit-content',
        display: 'flex',
        flexDirection: 'row',
        fill: 'var(--tape-color-primary)',
      }}
    >
      <span>{linkLabel}</span>
      <LinkSvg style={{ marginLeft: '4px', marginTop: '1px' }} width="15px" />
    </Link>
  ) : (
    <div></div>
  );

  return (
    <div className={clsx('col col--4', styles.feature)}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <h3>{title}</h3>
        {badgeComponent}
      </div>
      <div style={{ marginBottom: '30px' }}>
        <span>{description}</span>
        <div style={{ marginTop: '4px' }}></div>
        <span>{linkComponent}</span>
      </div>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      {/* Header */}
      <header
        className={clsx(styles.heroBanner)}
        style={{ backgroundImage: `url(${TextureImageUrl})` }}
      >
        <div
          className={clsx(styles.welcomeContainer)}
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <section style={{ flex: 1 }}>
            <div className="container">
              <h2
                className="hero__title"
                style={{
                  fontSize: '64px',
                  lineHeight: '64px',
                  letterSpacing: '-2px',
                }}
              >
                Welcome, <ActiveUserPrimaryName></ActiveUserPrimaryName>
              </h2>
              <p className={clsx(styles.subline)}>{siteConfig.tagline}</p>

              <div className={styles.buttons}>
                <Link
                  className={clsx('button', styles.getStarted)}
                  to={useBaseUrl('docs/guide/api/getting-started')}
                >
                  Get started
                </Link>
              </div>
            </div>
          </section>

          <section style={{ flex: 1 }}>
            <div className="container"></div>
          </section>
        </div>
      </header>

      {/* Main */}
      <main style={{ margin: '0px 20px', padding: '20px 24px 120px 24px' }}>
        <h2 className={clsx(styles.mainHeader)}>
          Tap into the <u>core</u> of Tape to build something amazing
        </h2>

        {/* Features */}
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
