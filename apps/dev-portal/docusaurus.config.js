module.exports = {
  title: 'Tape Developers',
  tagline: 'Connect, simplify, and automate your work using Tape Developer tools.',
  url: 'https://developers.tapeapp.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'tape', // Usually your GitHub org/user name.
  projectName: 'developers.tapeapp.com', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Tape Developers',
      logo: {
        alt: 'Tape Developers Logo',
        src: 'img/logo.jpeg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        // { to: 'blog', label: 'Blog', position: 'left' },
        {
          href: 'https://tapeapp.com',
          label: 'Tape',
          position: 'right',
        }
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Style Guide',
              to: 'docs/',
            },
            {
              label: 'Second Doc',
              to: 'docs/doc2/',
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
              href: 'https://get.tapeapp.com/privacy-policy/'
            },
            {
              label: 'Imprint',
              href: 'https://get.tapeapp.com/imprint/'
            },
            
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} <a href="https://get.tapeapp.com/imprint/">Tape Technologies</a>. Evolving with 💙 in Munich & the world 🌍`,
    },
    colorMode: {
      disableSwitch: true
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
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
