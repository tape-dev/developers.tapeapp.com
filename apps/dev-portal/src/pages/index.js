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
    title: 'Records',
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
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">
            Welcome, <ActiveUserPrimaryName></ActiveUserPrimaryName>
          </h1>
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
      </header>

      {/* Main */}
      <main style={{ margin: '0px 160px', padding: '0px 24px' }}>
        <h1
          style={{
            fontWeight: 900,
            marginTop: '100px',
            marginLeft: 'auto',
            marginRight: 'auto',
            textAlign: 'center',
          }}
        >
          Tap into the core elements of Tape to build what's next
        </h1>

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
