---
id: ip-addresses
title: IP Addresses
sidebar_label: IP Addresses
---

For security reasons it could be necessary to whitelist the IP addresses of the Tape workflow automation servers when making network connections to your infrastructure or service provider. Make sure to whitelist the IP addresses listed below to avoid network or firewall issues.

When dispatching remote HTTP operations inside a Tape workflow automation, the worker node will use one of the following IP addresses:

| IP Address     | Aliases |
| :------------- | :------ |
| 18.185.193.172 | -       |
| 52.29.64.182   | -       |
| 18.153.113.19  | -       |
| 52.29.124.7    | -       |

Some functionality may not be available without whitelisting.

Note: We do not recommend relying on static IP addresses currently; if you can, avoid it. These IP addresses may be subject to change over time and may break integrations if you rely on static IPs.
