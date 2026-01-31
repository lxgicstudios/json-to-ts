#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { parseAndGenerate, fetchAndGenerate } from './index.js';

const args = process.argv.slice(2);

const HELP = `
json-to-ts - Generate TypeScript interfaces from JSON

USAGE:
  npx @lxgicstudios/json-to-ts <file.json>       Generate from JSON file
  npx @lxgicstudios/json-to-ts <url>             Fetch from URL and generate
  npx @lxgicstudios/json-to-ts -                 Read JSON from stdin
  cat data.json | npx @lxgicstudios/json-to-ts   Pipe JSON

OPTIONS:
  -o, --output <file>    Write to file instead of stdout
  -n, --name <name>      Root interface name (default: Root)
  -t, --type             Use 'type' instead of 'interface'
  --optional             Make all properties optional
  --no-export            Don't add 'export' keyword
  -h, --help             Show this help message
  -v, --version          Show version

EXAMPLES:
  npx @lxgicstudios/json-to-ts data.json
  npx @lxgicstudios/json-to-ts https://api.example.com/users -n User
  cat response.json | npx @lxgicstudios/json-to-ts -o types.ts
  npx @lxgicstudios/json-to-ts api.json --type --optional

OUTPUT:
  Generates TypeScript interfaces with proper typing:
  - Nested objects become separate interfaces
  - Arrays are typed based on contents
  - Dates and UUIDs stay as strings

Built by LXGIC Studios · https://github.com/lxgicstudios/json-to-ts
`;

function colorize(text: string, color: string): string {
  const colors: Record<string, string> = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    dim: '\x1b[2m',
    reset: '\x1b[0m',
  };
  return `${colors[color] || ''}${text}${colors.reset}`;
}

function printError(msg: string): void {
  console.error(colorize('✗ ', 'red') + msg);
}

function printSuccess(msg: string): void {
  console.error(colorize('✓ ', 'green') + msg);
}

function printInfo(msg: string): void {
  console.error(colorize('ℹ ', 'blue') + msg);
}

function getArg(flags: string[]): string | undefined {
  for (const flag of flags) {
    const idx = args.indexOf(flag);
    if (idx !== -1 && args[idx + 1]) {
      return args[idx + 1];
    }
  }
  return undefined;
}

function hasFlag(flags: string[]): boolean {
  return flags.some(f => args.includes(f));
}

async function getJsonFromStdin(): Promise<string> {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => data += chunk);
    process.stdin.on('end', () => resolve(data.trim()));
    
    if (!process.stdin.isTTY) {
      setTimeout(() => {
        if (!data) resolve('');
      }, 100);
    } else {
      resolve('');
    }
  });
}

async function main(): Promise<void> {
  if (hasFlag(['-h', '--help'])) {
    console.log(HELP);
    process.exit(0);
  }

  if (hasFlag(['-v', '--version'])) {
    console.log('1.0.0');
    process.exit(0);
  }

  const rootName = getArg(['-n', '--name']) || 'Root';
  const outputFile = getArg(['-o', '--output']);
  const useType = hasFlag(['-t', '--type']);
  const optional = hasFlag(['--optional']);
  const exportTypes = !hasFlag(['--no-export']);

  let jsonString = '';
  let source = '';

  // Find input source
  const positional = args.find(a => !a.startsWith('-'));

  if (positional) {
    // Check if URL
    if (positional.startsWith('http://') || positional.startsWith('https://')) {
      source = positional;
      printInfo(`Fetching from ${colorize(positional, 'cyan')}...`);
      try {
        const result = await fetchAndGenerate(positional, {
          rootName,
          useType,
          optional,
          exportTypes
        });
        
        if (outputFile) {
          writeFileSync(resolve(process.cwd(), outputFile), result);
          printSuccess(`Written to ${colorize(outputFile, 'cyan')}`);
        } else {
          console.log(result);
        }
        process.exit(0);
      } catch (err) {
        printError(err instanceof Error ? err.message : 'Failed to fetch');
        process.exit(1);
      }
    }

    // Check if file
    const filePath = resolve(process.cwd(), positional);
    if (existsSync(filePath)) {
      source = positional;
      jsonString = readFileSync(filePath, 'utf-8');
    } else if (positional !== '-') {
      // Might be inline JSON
      jsonString = positional;
      source = 'inline';
    }
  }

  // Read from stdin
  if (!jsonString && (args.includes('-') || !process.stdin.isTTY)) {
    jsonString = await getJsonFromStdin();
    source = 'stdin';
  }

  if (!jsonString) {
    printError('No JSON input provided');
    console.log(HELP);
    process.exit(1);
  }

  try {
    const result = parseAndGenerate(jsonString, {
      rootName,
      useType,
      optional,
      exportTypes
    });

    if (outputFile) {
      writeFileSync(resolve(process.cwd(), outputFile), result);
      printSuccess(`Written to ${colorize(outputFile, 'cyan')}`);
    } else {
      console.log(result);
    }

  } catch (err) {
    printError(err instanceof Error ? err.message : 'Failed to parse JSON');
    process.exit(1);
  }
}

main().catch(err => {
  printError(err.message || 'An unexpected error occurred');
  process.exit(1);
});
