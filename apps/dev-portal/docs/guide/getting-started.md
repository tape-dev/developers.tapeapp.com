---
id: getting-started
title: Getting Started
---

import UserLogin from '@site/src/components/user-login/user-login.component';
import ApiKeyCodeblock from '@site/src/components/api-key-code-block.component';

<UserLogin></UserLogin>

## Fetch your first Record

<ApiKeyCodeblock language="shell">
{`curl #BASE_URL/v1/record/1 \\
  -u #USER_API_KEY:
# The colon prevents curl from asking for a password.
`}
</ApiKeyCodeblock>
