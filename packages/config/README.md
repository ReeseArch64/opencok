# @opencok/config

Base TypeScript configuration shared by OpenCoK workspaces.

## Usage

From the consuming workspace, with TypeScript and `@types/bun` available:

```sh
bun add --dev '@opencok/config@workspace:*'
```

Extend the configuration in `tsconfig.json`:

```json
{
  "extends": "@opencok/config/tsconfig.base.json",
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```
