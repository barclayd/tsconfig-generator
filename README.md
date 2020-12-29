# TypeScript Scaffold

Node.js CLI for generating an opinionated TypeScript setup for a range of frameworks

Supports:

- Node
- React
- Next
- Electron

It automatically configures TypeScript, ESLint, Prettier, providing a `tsconfig.json` with `tsconfig-paths` configured out of the box.

Can be used in an empty project or one that has already been configured.

### Demo

<p align="center">
<img width="500px" alt="alligator.io-theme" src="https://user-images.githubusercontent.com/39765499/103285423-03c4f300-49d6-11eb-8fdc-8f7bd6085939.gif" />
</p>

### [Available on NPX](https://www.npmjs.com/package/typescript-scaffold)

```shell
npx typescript-scaffold
```

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

* Provide custom configurations for React and Next.js
* Support React Native
