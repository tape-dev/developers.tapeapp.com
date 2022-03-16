import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import React, { useEffect, useState } from 'react';
import {
  DEFAULT_USERNAME,
  getActiveUserContextIsLoading,
  getActiveUserPrimaryName,
} from '../active-user/constants';
import { activeUserContextEffect } from '../active-user/context.effect';
import ApiKeyCode from '@site/src/components/api-key-code.component';
import Admonition from '@theme/Admonition';

const STATIC_HEIGHT = '175px';

export default function UserLoginInfo() {
  const [_, setState] = useState(Date.now());
  const { siteConfig: config } = useDocusaurusContext();

  const primaryName = getActiveUserPrimaryName(config) ?? '';
  const isLoading = getActiveUserContextIsLoading(config);

  useEffect(() => {
    activeUserContextEffect(config, setState);
  }, []);

  if (isLoading) {
    return <div style={{ height: STATIC_HEIGHT }}></div>;
  }

  if (primaryName) {
    return (
      <div style={{ height: STATIC_HEIGHT }}>
        <Admonition type="info">
          <span>
            Hey {primaryName} 👋 Looks like you are already logged into Tape, so
            we were able to prefill your user API key and some IDs for records,
            fields and so on in the examples requests below.
          </span>
        </Admonition>
      </div>
    );
  }

  return (
    <div style={{ height: STATIC_HEIGHT }}>
      <Admonition type="info">
        <span>
          Hey there 👋 Looks like you are currently not logged into Tape. All
          examples in this guide will be pre-filled with stub data. To change
          this, log into your Tape account.
        </span>
        <p>
          <a target="_blank" href="https://tapeapp.com/signin">
            <button type="outline-darkest" style={{ margin: '9px 0px' }}>
              Login here
            </button>
          </a>
        </p>
      </Admonition>
    </div>
  );
}
