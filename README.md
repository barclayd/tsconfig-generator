# TypeScript Scaffold

```shell
npx typescript-scaffold
```

Node.js CLI for generating an opinionated TypeScript setup for a range of frameworks

Supports:

- Node
- React
- Next
- Electron

It automatically configures TypeScript, ESLint, Prettier, providing a `tsconfig.json` with `tsconfig-paths` configured out of the box.

Suitable for use in an empty project or one that has already been configured.

### Demo

<p align="center">
<img width="500px" alt="typescript-scaffold" src="https://user-images.githubusercontent.com/39765499/103287930-9fa52d80-49db-11eb-94e0-47f24d49d4a0.gif" />
</p>

### [Available on NPX](https://www.npmjs.com/package/typescript-scaffold)

### Develop locally

```shell
git clone https://github.com/barclayd/tsconfig-generator.git
cd typesript-scaffold
npm i
npm run dev
```

### Build

```shell
npm build
```

### Publish new package

```shell
npm run npx-publish
```

### Future improvements

- Provide custom configurations for React and Next.js
- Support React Native
