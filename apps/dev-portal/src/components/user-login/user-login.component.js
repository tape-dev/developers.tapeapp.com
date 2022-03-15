import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import React, { useEffect, useState } from 'react';
import {
  DEFAULT_USERNAME,
  getActiveUserContextIsLoading,
  getActiveUserPrimaryName,
} from '../active-user/constants';
import { activeUserContextEffect } from '../active-user/context.effect';
import ApiKeyCodeblock from '@site/src/components/api-key-code-block.component';

export default function UserLogin() {
  const [_, setState] = useState(Date.now());
  const { siteConfig: config } = useDocusaurusContext();

  const primaryName = getActiveUserPrimaryName(config) ?? '';
  const isLoading = getActiveUserContextIsLoading(config);

  useEffect(() => {
    activeUserContextEffect(config, setState);
  }, []);

  if (isLoading) {
    return '';
  }

  if (primaryName) {
    return (
      <div>
        <span>
          Hey {primaryName} 👋 Looks like you are already logged into Tape, so
          we were able to prefill your user API key and some IDs for records,
          fields and so on in the examples requests below.
        </span>

        <p>
          Here's you personal User API token:
          <br />
          <br />
          <ApiKeyCodeblock>#USER_API_KEY</ApiKeyCodeblock>
        </p>
      </div>
    );
  }

  return (
    <div>
      <span>
        Hey there 👋 Looks like you are currently not logged into Tape. All
        examples in this guide will be pre-filled with stub data. To change
        this, log into your Tape account and{' '}
      </span>
      <p>
        <a target="_blank" href="https://tapeapp.com/signin">
          <button style={{ margin: '9px 0px' }}>Login here</button>
        </a>
      </p>
    </div>
  );
}
