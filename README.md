![GitHub License](https://img.shields.io/github/license/open-fringecore/odoo-xmlrpc-client)

# Odoo XML-RPC Client

This project provides a TypeScript client for interacting with Odoo's XML-RPC API. It allows you to authenticate and execute various methods on Odoo models.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Installation

To install the package, use npm or yarn:

```sh
npm i odoo-xmlrpc-client
```

## Usage
Here's an example of how to use the Odoo XML-RPC client:
```typescript
import { OdooXMLRPC, OdooConfig } from 'odoo-xmlrpc-client';

const config: OdooConfig = {
    url: 'https://your-odoo-instance.com',
    db: 'your-database',
    username: 'your-username',
    password: 'your-password',
};

const odoo = new OdooXMLRPC(config);

async function main() {
    try {
        const uid = await odoo.authenticate();
        console.log('Authenticated with UID:', uid);

        const result = await odoo.execute_kw(
            'res.partner',
            'search_read',
            [[['is_company', '=', true]]],
            { fields: ['name', 'country_id', 'comment'], limit: 5 },
        );
        console.log('Result:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
```

## Licens
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
