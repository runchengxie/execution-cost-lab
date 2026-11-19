# Execution Cost Lab

[简体中文](README.zh-CN.md) · [Open the site](https://runchengxie.github.io/execution-cost-lab/)

Interactive teaching examples of shared cash, trading capacity, and execution
costs. All inputs are synthetic and embedded in the model.

Use Node.js 24 or newer. Run `npm ci` and `npm run dev`, then open
`http://localhost:4321/execution-cost-lab/`. Run `npm test`, `npm run check`
and `npm run build` to verify the project. GitHub Actions builds the Astro
site from `main` and deploys the static output to GitHub Pages.

The [TypeScript model](src/scripts/model.ts) defines opening cash and sale
proceeds, the market-volume budget, and the equal-share cost comparison.
The charts update directly from that model.
