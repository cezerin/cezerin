# API Reference

* [Apps](./apps.md)
* [Products](./products.md)
* [Product Categories](./product-categories.md)
* Orders
* Order Statuses
* Customers
* Customer Groups
* Pages
* Shipping Methods
* Payment Methods
* Payment Gateways
* Payment Notifications
* Files
* Security
* Settings
* Site Map
* Theme
* Redirects
* [Webhooks](./webhooks.md)

## Overview

### Authentication
Authenticate your account when using the API by including your Access Token in the request. You can manage your Access Tokens in the Dashboard. Your Access Tokens carry many privileges, so be sure to keep them secret! Do not share your secret API keys in publicly accessible areas such GitHub, client-side code, and so forth.

Authentication to the API is performed via bearer auth (e.g., for a cross-origin request), use

```
-H "Authorization: Bearer <token>"
```
