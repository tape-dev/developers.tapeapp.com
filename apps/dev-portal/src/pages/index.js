import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';
import { ActiveUserPrimaryName } from '@site/src/components/active-user/primary-name.component';

const features = [
  {
    title: 'Organizations',
    description: (
      <>
        The Tape API was designed from the ground up to be easily consumable and
        transparent. This way, our developers can focus on what they do best:
        Building powerful custo-tailored Tape solutions for their customers.
      </>
    ),
  },
  {
    title: 'Workspaces',
    description: (
      <>
        The Tape API was designed from the ground up to be easily consumable and
        transparent. This way, our developers can focus on what they do best:
        Building powerful custo-tailored Tape solutions for their customers.
      </>
    ),
  },
  {
    title: 'Apps',
    description: (
      <>
        We do not compromise on speed and robustness - that is why we dedicate
        our resources to guarantee a production ready experience that you can
        count and build on.
      </>
    ),
  },
  {
    title: 'Fields',
    description: (
      <>
        We do not compromise on speed and robustness - that is why we dedicate
        our resources to guarantee a production ready experience that you can
        count and build on.
      </>
    ),
  },
  {
    title: 'Records',
    description: (
      <>
        Tape is about community. In order to constantly evolve and improve, we
        allow our development community and eco system to contribute to our
        docs. Because you know best what could be missing or improved.
      </>
    ),
  },
  {
    title: 'Webhooks',
    description: (
      <>
        Tape is about community. In order to constantly evolve and improve, we
        allow our development community and eco system to contribute to our
        docs. Because you know best what could be missing or improved.
      </>
    ),
  },
];

function Feature({ title, description }) {
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      {/* Header */}
      <header className={clsx(styles.heroBanner)}>
        <div
          style={{ display: 'flex', flexDirection: 'row', padding: '0px 60px' }}
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
              <p className="hero__subtitle">{siteConfig.tagline}</p>

              <div className={styles.buttons}>
                <Link
                  className={clsx('button', styles.getStarted)}
                  to={useBaseUrl('docs/api/api-reference')}
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
      <main style={{ margin: '0px 20px', padding: '0px 24px' }}>
        <h2
          style={{
            fontSize: '64px',
            lineHeight: '64px',
            marginTop: '100px',
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'center',
            letterSpacing: '-2px',
          }}
        >
          Tap into the core elements of Tape to build what's next
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
