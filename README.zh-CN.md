# 交易执行实验室

[English](README.md) · [打开网页](https://runchengxie.github.io/execution-cost-lab/)

三个可交互的教学案例，分别展示共享资金、成交容量和执行成本。所有输入均为合成数据，
保存在网页模型中。

运行 `node --test` 验证模型。运行 `python3 -m http.server --directory docs 8765`
后在浏览器打开本地服务即可复现网页。GitHub Pages 从 `main` 的 `docs/` 目录发布静态文件。

[模型源码](docs/model.mjs)定义了期初现金和回款、成交量额度与同量成本比较。
图表直接从模型计算。
