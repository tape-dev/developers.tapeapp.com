import Admonition from '@theme/Admonition';
import React from 'react';

const STATIC_HEIGHT = '180px';

export default function UserLoginInfo() {
  /**
  const [_, setState] = useState(0);
  const { siteConfig: config } = useDocusaurusContext();

  const primaryName = getActiveUserPrimaryName(config) ?? '';
  const isLoading = getActiveUserContextIsLoading(config);

  useEffect(() => {
    activeUserContextEffect(config, setState);
  }, []);
   */
  const isLoading = false;
  const primaryName = 'TesT';

  if (isLoading) {
    return <div style={{ minHeight: STATIC_HEIGHT }}></div>;
  }

  if (primaryName) {
    return (
      <div style={{ minHeight: STATIC_HEIGHT }}>
        <Admonition type="tip" title="Logged in" icon="✅">
          <span>
            Hey {primaryName} 👋 Looks like you are already logged into Tape, so
            we were able to prefill your user API key and some IDs in the
            examples below. You can use the "copy" button to copy the code to
            your clipboard. Most cURL requests work out of the box and can be
            directly pasted into a terminal.
          </span>
        </Admonition>
      </div>
    );
  }

  return (
    <div style={{ minHeight: STATIC_HEIGHT }}>
      <Admonition type="info" title="Log in" icon="👤">
        <span>
          Hey there 👋 Looks like you are currently not logged into Tape. All
          examples in this guide will be pre-filled with stub data. To change
          this, log into your Tape account and refresh this page.
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
