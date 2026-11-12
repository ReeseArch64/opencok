# @opencok/config

Shared TypeScript compiler configuration for the OpenCoK monorepo. This package provides `tsconfig.base.json` so consuming workspaces can use consistent compiler settings.

The base configuration enables strict type checking, Bun types, bundler module resolution, decorator metadata and type checking without emitting JavaScript. Each consumer owns its source paths, overrides and validation workflows. The package itself is limited to shared configuration and does not need a dedicated test suite.

## Usage

From the consuming workspace directory, add the package as a development dependency:

```sh
bun add --dev '@opencok/config@workspace:*'
```

The consumer also needs TypeScript and `@types/bun`, provided through the monorepo's dependency conventions.

Extend the public configuration in the consumer's `tsconfig.json`:

```json
{
  "extends": "@opencok/config/tsconfig.base.json",
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

Add workspace-specific settings under `compilerOptions` when needed. Changes to `tsconfig.base.json` affect every consumer that extends it.
