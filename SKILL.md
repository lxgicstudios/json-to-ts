---
name: JSON to TypeScript CLI
description: Convert JSON to TypeScript interfaces. API responses, config files. Smart type inference. Free type generation tool.
tags: [json, typescript, types, interfaces, codegen, cli, developer]
---

# JSON to TypeScript CLI

Convert JSON to TypeScript types instantly.

**Paste JSON. Get types. Ship faster.**

## Quick Start

```bash
npm install -g json-to-ts-cli
```

```bash
# From file
json-to-ts data.json

# From URL
json-to-ts https://api.example.com/users

# From clipboard
pbpaste | json-to-ts
```

## Features

### Smart Inference
- Optional properties
- Union types
- Nullable fields
- Array type detection

### Naming
- PascalCase interfaces
- camelCase properties
- Configurable prefixes

## Commands

```bash
# Basic conversion
json-to-ts data.json

# With root name
json-to-ts data.json --name UserResponse

# Output to file
json-to-ts data.json -o types.ts

# From API
json-to-ts https://api.example.com/users

# Inline JSON
echo '{"name": "John", "age": 30}' | json-to-ts
```

## Example

**Input:**
```json
{
  "users": [
    {
      "id": 1,
      "name": "John",
      "email": "john@example.com",
      "roles": ["admin", "user"],
      "metadata": null
    }
  ],
  "total": 42
}
```

**Output:**
```typescript
interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  metadata: unknown | null;
}

interface RootObject {
  users: User[];
  total: number;
}
```

## Options

```bash
# Export types
json-to-ts data.json --export

# Use type instead of interface
json-to-ts data.json --type

# Add readonly
json-to-ts data.json --readonly

# Separate files
json-to-ts data.json --split
```

## When to Use This

- API response typing
- Config file types
- Data migration
- Quick prototyping
- Documentation

---

**Built by [LXGIC Studios](https://lxgicstudios.com)**

🔗 [GitHub](https://github.com/lxgicstudios/json-to-ts) · [Twitter](https://x.com/lxgicstudios)
