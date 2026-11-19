# 交易执行实验室

[English](README.md) · [打开网页](https://runchengxie.github.io/execution-cost-lab/)

三个可交互的教学案例，分别展示共享资金、成交容量和执行成本。所有输入均为合成数据，
保存在网页模型中。

使用 Node.js 24 或更高版本。运行 `npm ci` 和 `npm run dev`，
打开 `http://localhost:4321/execution-cost-lab/`。运行 `npm test`、
`npm run check` 和 `npm run build` 验证项目。GitHub Actions 从
`main` 构建 Astro 站点，并将静态产物部署到 GitHub Pages。

[TypeScript 模型](src/scripts/model.ts)定义了期初现金和回款、成交量额度与同量成本比较。
图表直接从模型计算。
