---
id: ip-addresses
title: IP Addresses
sidebar_label: IP Addresses
---

For security reasons it could be neccessary to whitelist the IP addresses of the Tape workflow automation servers when making network connections to your infrastrure or service provider. Make sure to whitelist the IP addresses listed below to avoid network or firewall issues.

When dispatching remote HTTP operations inside a Tape workflow automation, the worker node will use one of the following IP addresses:

| IP Address     | Aliases |
| :------------- | :------ |
| 18.157.160.124 | -       |
| 3.69.151.60    | -       |
| 3.123.27.97    | -       |
| 52.59.55.162   | -       |
| 3.68.115.98    | -       |
| 35.158.133.118 | -       |
| 3.76.188.91    | -       |
| 3.66.192.144   | -       |
| 18.192.198.77  | -       |
| 3.78.93.38     | -       |
| 3.71.0.148     | -       |
| 63.177.67.205  | -       |
| 3.71.36.243    | -       |
| 3.74.231.152   | -       |
| 63.177.55.177  | -       |
| 3.127.27.209   | -       |

Some functionality may not be available without whitelisting.

Note: We do not recommend relying on static IP addresses currently; if you can, avoid it. These IP addresses may be subject to change over time and may break integrations if you rely on static IPs.
