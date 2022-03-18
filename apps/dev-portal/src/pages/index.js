import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';
import { ActiveUserPrimaryName } from '@site/src/components/active-user/primary-name.component';
import TextureImageUrl from '@site/static/img/texture.jpg';

const features = [
  {
    title: 'Records',
    description: (
      <>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </>
    ),
    badge: 'private-beta',
    linkLabel: 'Jump to the reference',
    link: 'docs/api/resource/record',
  },
  {
    title: 'Apps',
    description: (
      <>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </>
    ),
    badge: 'not-available',
  },
  {
    title: 'Fields',
    description: (
      <>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </>
    ),
    badge: 'not-available',
  },
  {
    title: 'Workspaces',
    description: (
      <>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </>
    ),
    badge: 'not-available',
  },
  {
    title: 'Organizations',
    description: (
      <>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </>
    ),
    badge: 'not-available',
  },
  {
    title: 'Webhooks',
    description: (
      <>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </>
    ),
    badge: 'not-available',
  },
];

function Feature({ title, description, badge, link, linkLabel }) {
  const badgeComponent =
    badge === 'private-beta' ? (
      <span type="primary" className={styles.badge}>
        PRIVATE BETA
      </span>
    ) : (
      <span className={styles.badge}>NOT AVAILABLE</span>
    );

  const linkComponent = link ? (
    <Link to={useBaseUrl(link)}>{linkLabel}</Link>
  ) : (
    ''
  );

  return (
    <div className={clsx('col col--4', styles.feature)}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <h3>{title}</h3>
        {badgeComponent}
      </div>
      <p>
        <span>{description}</span>
        <div style={{ marginTop: '4px' }}></div>
        <span>{linkComponent}</span>
      </p>
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
                  to={useBaseUrl('docs/guide/getting-started')}
                >
                  Get Started
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
