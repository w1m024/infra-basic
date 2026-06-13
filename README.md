# infra-basic

`infra-basic` 是面向 LLM 推理基础设施的可验证学习系统：从 PyTorch CUDA 和 operator/kernel 入门，逐步进入 serving 系统、源码阅读、实验项目和开源贡献。

## 站点

- GitHub Pages: `https://opencqut.github.io/infra-basic/`
- 本地开发：

```bash
npm install
npm run docs:dev
npm run docs:build
```

## 学习路径

1. [从零开始](docs/start/index.md)
2. [系统原理](docs/systems/index.md)
3. [源码阅读](docs/source-reading/index.md)
4. [实验项目](docs/labs/index.md)
5. [文章与资源](docs/articles/index.md)

学习原则：

```text
先跑通 → 再 benchmark → 再读源码 → 再改代码 → 再贡献 PR
```

## vendor 源码

`vendor/` 存放源码阅读用 submodule。不要默认 clone 全部；按文章需要初始化。

只读 vLLM：

```bash
git submodule update --init --depth 1 vendor/vllm-project/vllm
```

完整初始化：

```bash
git submodule update --init --recursive --depth 1
```

所有 vendor 项目登记在 [`vendor/MANIFEST.yaml`](vendor/MANIFEST.yaml)，并由 `npm run check:vendor` 校验。

## 仓库结构

```text
infra-basic/
├── docs/
│   ├── start/
│   ├── systems/
│   ├── source-reading/
│   ├── labs/
│   ├── articles/
│   ├── reference/
│   └── .vitepress/
├── projects/
├── scripts/
└── vendor/
```

## 质量检查

```bash
npm run check:vendor
npm run check:links
npm run check
npm run docs:build
```

`check:links` 用来防止在 GitHub Pages `/infra-basic/` 子路径下出错的裸写 `href="/xxx"`。内部链接应使用 VitePress markdown 链接或在 Vue 组件里用 `withBase()`。
