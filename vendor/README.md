# vendor

本目录存放源码阅读用第三方项目 submodule。它不是收藏夹，而是 `docs/source-reading/` 源码文章的证据库。

## 不要默认 clone 全部

如果只读 vLLM：

```bash
git submodule update --init --depth 1 vendor/vllm-project/vllm
```

如果需要完整初始化：

```bash
git submodule update --init --recursive --depth 1
```

Windows 上遇到长路径问题时，可对对应 submodule 启用：

```bash
git -C vendor/google-gemini/gemini-cli config core.longpaths true
```

## 分类

- `serving-engine`
- `kernel-library`
- `distributed-serving`
- `cache-system`
- `structured-output`
- `agent-runtime`
- `ide-agent`
- `research-agent`

## manifest

所有项目都登记在 [`MANIFEST.yaml`](./MANIFEST.yaml)，并指向对应源码阅读文章。

## 更新规则

1. 更新 submodule 前先记录旧 commit。
2. 更新后同步修改 manifest。
3. 如果源码文章中的路径变化，必须同步修文章。
4. 运行 `npm run check:vendor`。

## 版权说明

文章只做源码阅读和短片段解释，不复制大段第三方源码。
