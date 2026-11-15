import MDXComponents from '@theme-original/MDXComponents';
import { NextSteps, NextStepCard } from '@site/src/components/layout/next-steps';
import CopyPageSlot from '@site/src/components/layout/copy-page-slot';
import ParamKids from '@site/src/components/layout/param-kids';

// Registered globally: the remark plugin inserts these, pages need no import
export default { ...MDXComponents, NextSteps, NextStepCard, CopyPageSlot, ParamKids };
