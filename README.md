# Execution Cost Lab

[简体中文](README.zh-CN.md) · [Open the site](https://runchengxie.github.io/execution-cost-lab/)

Interactive teaching examples of shared cash, trading capacity, and execution
costs. All inputs are synthetic and embedded in the model.

Run `node --test` for the model checks. Run `python3 -m http.server --directory docs 8765`
and open the local server to reproduce the page. JavaScript modules are served
as static files. GitHub Pages publishes the `docs/` directory from `main`.

The model in [docs/model.mjs](docs/model.mjs) defines opening cash and sale
proceeds, the market-volume budget, and the equal-share cost comparison.
The charts update directly from that model.
