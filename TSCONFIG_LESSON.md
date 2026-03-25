# TypeScript Config Lesson For The Backend

This note explains what `tsconfig` is, how the backend uses it, and how to debug the exact TypeScript and ESLint errors we hit in this project.

## What A `tsconfig` File Is

A `tsconfig.json` file tells TypeScript how to understand your project.

It answers questions like:

- Which files belong to this TypeScript project?
- Which global types exist, such as `Node`, `Jest`, or browser globals?
- Which language features are enabled?
- Where should compiled output go?
- Which files should be excluded?

Think of it as the contract between your code and the TypeScript tools.

Without the right `tsconfig`, TypeScript may still read a file, but it may read it in the wrong project context. That is when you get confusing errors like missing `describe`, missing `it`, or ESLint saying a file is not included in the configured TS project.

## The Main Ideas Inside `tsconfig`

These are the fields you will use most often.

### `compilerOptions`

This controls how TypeScript behaves.

Examples from this backend:

- `module: "commonjs"`: output module format for Node/Nest.
- `target: "ES2017"`: which JavaScript level TypeScript should emit.
- `outDir: "./dist"`: where compiled files go.
- `emitDecoratorMetadata` and `experimentalDecorators`: needed by NestJS decorators.
- `types: ["node", "jest"]`: which global type packages TypeScript should load.

### `include`

This tells TypeScript which files belong to the project.

Example:

```json
"include": ["src/**/*.ts", "test/**/*.ts"]
```

If a file is not included, TypeScript tools that rely on that project will often behave as if the file belongs nowhere.

### `exclude`

This removes files or folders from the project.

Typical examples:

```json
"exclude": ["node_modules", "dist"]
```

Be careful with this. If you exclude `test` or `**/*.spec.ts`, then test files stop belonging to that TS project.

### `extends`

This lets one config inherit from another.

Example:

```json
{
  "extends": "./tsconfig.json"
}
```

This is how you make a base config and then create smaller configs for ESLint, tests, builds, or scripts.

## How This Backend Uses `tsconfig`

The backend currently has three TypeScript config files:

- [apps/api/tsconfig.json](apps/api/tsconfig.json)
- [apps/api/tsconfig.spec.json](apps/api/tsconfig.spec.json)
- [apps/api/tsconfig.eslint.json](apps/api/tsconfig.eslint.json)

Each one has a different job.

## 1. Base App Config

File: [apps/api/tsconfig.json](apps/api/tsconfig.json)

This is the main project config for the Nest backend.

Current purpose:

- Defines core compiler behavior for the API.
- Enables NestJS decorator support.
- Controls output into `dist`.
- Loads Node and Jest types globally.

Current shape:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "target": "ES2017",
    "sourceMap": true,
    "outDir": "./dist",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false,
    "types": ["node", "jest"]
  },
  "exclude": ["node_modules", "dist", "generated"]
}
```

Important detail:

- Right now this file includes Jest types globally. That is why test globals can be recognized even outside the spec config.
- A stricter setup could remove `jest` from the base config and leave it only in `tsconfig.spec.json`.

## 2. Test Config

File: [apps/api/tsconfig.spec.json](apps/api/tsconfig.spec.json)

This config exists for test files.

Current purpose:

- Creates a dedicated TS project for unit tests and e2e tests.
- Ensures Jest globals such as `describe`, `it`, `expect`, and `beforeEach` are available.

Current shape:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "types": ["node", "jest"]
  },
  "include": ["src/**/*.spec.ts", "test/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

Why this matters:

- Files like [apps/api/test/app.e2e-spec.ts](apps/api/test/app.e2e-spec.ts) need to belong to a TS project that includes Jest types.
- If they do not, VS Code shows errors like:

```ts
Cannot find name 'describe'
Cannot find name 'beforeEach'
Cannot find name 'it'
```

That error usually does not mean the package is missing. It usually means the file is not inside the right TS project.

## 3. ESLint Type-Aware Config

File: [apps/api/tsconfig.eslint.json](apps/api/tsconfig.eslint.json)

This config exists only for typed ESLint.

Current purpose:

- Gives ESLint a TS project that includes backend source, tests, and top-level TS files.
- Lets `@typescript-eslint` use type-aware rules without trying to lint files that TypeScript cannot resolve.

Current shape:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": true
  },
  "include": [
    "src/**/*.ts",
    "test/**/*.ts",
    "api.interface.ts",
    "helper-utils.ts",
    "prisma.config.ts",
    "script.ts"
  ],
  "exclude": ["node_modules", "dist"]
}
```

Why this matters:

- ESLint reads [apps/api/eslint.config.mjs](apps/api/eslint.config.mjs), which points `parserOptions.project` at this file.
- If ESLint tries to lint a file that is not included here, you get a parsing error.

## How The Tools Use These Configs

This is the most important part to understand.

### TypeScript editor diagnostics

VS Code TypeScript tries to attach each `.ts` file to a `tsconfig` project.

If your test file is not part of a project that includes Jest types, you get missing global errors.

### Jest

Jest runs tests using its own config in [apps/api/package.json](apps/api/package.json) and [apps/api/test/jest-e2e.json](apps/api/test/jest-e2e.json).

Jest can still execute tests even when the editor shows TypeScript errors.

That is why a test file can run, but VS Code still complains about `describe`.

### ESLint

ESLint uses [apps/api/eslint.config.mjs](apps/api/eslint.config.mjs).

Because that config uses `parserOptions.project`, ESLint needs a matching TS project that includes every linted file.

That is what [apps/api/tsconfig.eslint.json](apps/api/tsconfig.eslint.json) is for.

## The Errors We Hit And What They Really Mean

### Error 1: `Cannot find name 'describe'`

Example file:

- [apps/api/test/app.e2e-spec.ts](apps/api/test/app.e2e-spec.ts)

What it means:

- The test file is not in a TS project that loads Jest types.

Common causes:

- `@types/jest` is not installed.
- The file is excluded by `tsconfig.json`.
- The editor is not associating the file with `tsconfig.spec.json`.
- The TS server is stale.

What fixed it here:

- Restoring [apps/api/tsconfig.spec.json](apps/api/tsconfig.spec.json).
- Ensuring Jest types are present.
- Keeping test files included there.

### Error 2: ESLint says a file is not included in the TS project

Example error we hit:

```txt
ESLint was configured to run on prisma.config.ts using parserOptions.project,
but that TSConfig does not include this file.
```

What it means:

- ESLint is linting a file that [apps/api/tsconfig.eslint.json](apps/api/tsconfig.eslint.json) does not include.

What fixed it here:

- Adding top-level TS files explicitly to `include`, especially `prisma.config.ts`.

### Error 3: `allowDefaultProject` glob contains a disallowed `**`

What it means:

- `typescript-eslint` does not allow a wide recursive glob in `allowDefaultProject` because it hurts performance.

What fixed it here:

- Stop relying on `allowDefaultProject` for lots of files.
- Use a dedicated [apps/api/tsconfig.eslint.json](apps/api/tsconfig.eslint.json) instead.

That is the cleaner setup.

## Good Mental Model

When a TypeScript-related tool errors, ask this question first:

Which `tsconfig` is this tool using for this file?

Then check these in order:

1. Is the file included in that config?
2. Is the file excluded by that config or by a parent config through `extends`?
3. Does that config load the correct global types?
4. Is VS Code showing a stale error from an old TS server state?

If you answer those four questions, you usually find the problem fast.

## Recommended Pattern For Backend Projects

For a Nest backend like this one, this split works well:

### Base config

- One `tsconfig.json` for the app itself.

### Test config

- One `tsconfig.spec.json` for `*.spec.ts` and `test/**/*.ts`.

### ESLint config

- One `tsconfig.eslint.json` for every file ESLint should type-check.

This separation keeps things easier to reason about.

## Example Clean Setup

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2017",
    "outDir": "./dist",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "esModuleInterop": true,
    "types": ["node"]
  },
  "exclude": ["node_modules", "dist", "generated"]
}
```

### `tsconfig.spec.json`

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "types": ["node", "jest"]
  },
  "include": ["src/**/*.spec.ts", "test/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### `tsconfig.eslint.json`

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": true
  },
  "include": [
    "src/**/*.ts",
    "test/**/*.ts",
    "api.interface.ts",
    "helper-utils.ts",
    "prisma.config.ts",
    "script.ts"
  ],
  "exclude": ["node_modules", "dist"]
}
```

## Fast Troubleshooting Checklist

If you see a TypeScript or ESLint config error, use this checklist.

### Missing Jest globals

- Is `@types/jest` installed?
- Does the active TS project include `"types": ["jest"]`?
- Is the test file included in `tsconfig.spec.json`?
- Restart the TS server.

### ESLint parser project error

- Which file is ESLint complaining about?
- Is that file included in `tsconfig.eslint.json`?
- Is it a top-level script file that needs to be added explicitly?
- Restart the ESLint server if the config is already correct.

### Still seeing old errors after a fix

- Run `TypeScript: Restart TS Server`.
- Run `ESLint: Restart ESLint Server`.
- If needed, reload the VS Code window.

## Final Rule To Remember

Most `tsconfig` issues are not really about TypeScript syntax.

They are about project boundaries.

If a file belongs to the wrong TS project, or to no TS project, the editor and lint tools start lying to you.

When that happens, do not guess. Check:

- which config the tool is using,
- whether the file is included,
- whether the right types are loaded.

That is the reliable way to debug `tsconfig` problems.
