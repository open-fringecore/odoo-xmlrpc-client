[![License](https://img.shields.io/github/license/open-fringecore/odoo-xmlrpc-client)](LICENSE)
[![Version](https://img.shields.io/npm/v/odoo-xmlrpc-client)](https://www.npmjs.com/package/odoo-xmlrpc-client)

# Odoo XML-RPC Client

This project provides a TypeScript client for interacting with Odoo's XML-RPC API. It allows you to authenticate and execute various methods on Odoo models.

## Table of Contents

- [Odoo XML-RPC Client](#odoo-xml-rpc-client)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Create Row](#create-row)
    - [Read Row](#read-row)
  - [License](#license)

## Installation

To install the package, use your favorite package manager. For example, with npm:

```sh
npm i odoo-xmlrpc-client
```

## Usage
Here are some examples of how to use the Odoo XML-RPC client:

### Create Row
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

        const result = await odoo.execute_kw('res.partner', 'create', [{
            'company_type': "person",
            'name': '',
            'street': '',
            'street2': '',
            'zip': '',
            'city': '',
            'country_id': 19,
            'email': '',
            'mobile': '',
            'is_company': false,
            'lang': "en_US",
        }])
        console.log('Result:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
```

### Read Row
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

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
