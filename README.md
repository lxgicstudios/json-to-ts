# @lxgicstudios/json-to-ts

Generate TypeScript interfaces from JSON data or API responses.

Stop writing types by hand. Just paste your JSON.

## Installation

```bash
# Use directly with npx (recommended)
npx @lxgicstudios/json-to-ts data.json

# Or install globally
npm install -g @lxgicstudios/json-to-ts
```

## Usage

```bash
# From file
npx @lxgicstudios/json-to-ts data.json

# From URL
npx @lxgicstudios/json-to-ts https://api.example.com/users -n User

# From pipe
curl https://api.example.com/users | npx @lxgicstudios/json-to-ts

# Output to file
npx @lxgicstudios/json-to-ts response.json -o src/types/api.ts
```

## Example

Given this JSON:

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "Anytown"
  },
  "tags": ["developer", "typescript"]
}
```

Running `npx @lxgicstudios/json-to-ts user.json -n User` outputs:

```typescript
export interface Address {
  street: string;
  city: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  address: Address;
  tags: string[];
}
```

## Options

| Option | Description |
|--------|-------------|
| `-n, --name <name>` | Root interface name (default: Root) |
| `-o, --output <file>` | Write to file |
| `-t, --type` | Use `type` instead of `interface` |
| `--optional` | Make all properties optional |
| `--no-export` | Don't add `export` keyword |
| `-h, --help` | Show help |

## Features

- ✅ Nested objects become separate interfaces
- ✅ Arrays are properly typed
- ✅ Mixed arrays become union types
- ✅ Fetches from URLs
- ✅ Pipe support
- ✅ Handles empty arrays as `unknown[]`

## Programmatic API

```typescript
import { 
  jsonToTypeScript, 
  parseAndGenerate, 
  fetchAndGenerate 
} from '@lxgicstudios/json-to-ts';

// From object
const types = jsonToTypeScript({ id: 1, name: 'Test' }, { rootName: 'User' });

// From JSON string
const types2 = parseAndGenerate('{"id": 1}', { useType: true });

// From URL
const types3 = await fetchAndGenerate('https://api.example.com/data', {
  rootName: 'ApiResponse',
  optional: true
});
```

---

**Built by [LXGIC Studios](https://lxgicstudios.com)**

🔗 [GitHub](https://github.com/lxgicstudios/json-to-ts) · [Twitter](https://x.com/lxgicstudios)
