module.exports = {
  title: 'Tape Developers',
  tagline: 'Connect, simplify, and automate your work using Tape.',
  url: 'https://developers.tapeapp.com',
  baseUrl: '/',
  staticDirectories: ['static'],
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.svg',
  organizationName: 'tape',
  projectName: 'developers.tapeapp.com',
  customFields: {
    runtime: process.env.runtime ?? '',
  },
  themeConfig: {
    navbar: {
      title: 'Tape Developers',
      logo: {
        alt: 'Tape Developers Logo',
        src: 'img/logo.jpeg',
      },
      items: [
        {
          to: 'docs/guide/getting-started',
          label: 'Guides',
          position: 'left',
        },
        {
          to: 'docs/api/introduction',
          label: 'Docs',
          position: 'left',
        },
        // { to: 'blog', label: 'Blog', position: 'left' },
        {
          href: 'https://tapeapp.com',
          label: 'Go to Tape',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'API Reference',
              to: 'docs/api/introduction',
            },
            {
              label: 'Calculation Field',
              to: 'docs/calculation/intro',
            },
            {
              label: 'Contribute',
              to: 'docs/contribute',
            },
          ],
        },
        {
          title: 'Find us',
          items: [
            {
              label: 'Twitter',
              href: 'https://twitter.com/Tape_HQ',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/company/tapehq',
            },
            {
              label: 'Facebook',
              href: 'https://www.facebook.com/tapehq',
            },
          ],
        },
        {
          title: 'Legal',
          items: [
            {
              label: 'Privacy Policy',
              href: 'https://get.tapeapp.com/privacy-policy/',
            },
            {
              label: 'Imprint',
              href: 'https://get.tapeapp.com/imprint/',
            },
          ],
        },
      ],
      // copyright: `© ${new Date().getFullYear()} Tape Technologies`,
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
    },
    prism: {
      // theme: require('prism-react-renderer/themes/vsDark'),
      // theme: require('prism-react-renderer/themes/vsLight'),
      theme: require('prism-react-renderer/themes/github'),
      // theme: require('prism-react-renderer/themes/duotoneLight'),
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/tape-dev/developers.tapeapp.com/edit/main/apps/dev-portal',
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
