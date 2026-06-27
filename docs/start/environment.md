# 环境与 CUDA 路线

本仓库默认主线是 NVIDIA CUDA 路径：

```text
Linux
→ NVIDIA GPU
→ NVIDIA Driver
→ CUDA Toolkit
→ PyTorch CUDA
→ Triton CUDA
→ vLLM / SGLang CUDA path
```

非 CUDA 后端、AMD/ROCm、国产硬件等只作为扩展阅读，不作为主线。

## 先分清三类环境

这个仓库里常见的不是"一个大环境"，而是三类职责不同的环境：

| 环境 | 用途 | 是否需要 GPU |
|---|---|---|
| 文档站点环境 | 预览和构建 VitePress 文档、检查链接 | 否 |
| Python / CUDA 实验环境 | 跑 PyTorch、Transformers、Triton、benchmark、profiler | 是 |
| vendor 源码阅读 checkout | 按需初始化上游仓库，配合源码阅读文章 | 通常否 |

先把这三件事拆开，后面很多混乱会直接消失：

- 写文档不等于要先装好 CUDA。
- 阅读 vendor 源码不等于要把所有上游项目都编译一遍。
- 跑 PyTorch 小实验，也不等于要立刻把 vLLM 和 SGLang 装进同一个环境。

### 学习路径与环境配置对照

| 你想学什么 | 需要配到哪一步 | 建议环境 |
|---|---|---|
| 只改文档、预览站点 | 不需要 Python/CUDA | `npm install` 即可 |
| PyTorch / Transformers / profiler 入门 | Step 1-5 全部走完 | `torch-basics` |
| vLLM / SGLang 实验 | Step 1-5 + 单独拆环境 | `vllm-lab`、`sglang-lab` |
| 源码阅读 | 不需要编译，按需 clone | 随用随建 |
 

### 实验记录比装环境更重要

环境配好之后，最好把每次实验的上下文一并记录下来：

```text
日期：
平台：Linux / WSL2 / Docker
GPU：
Driver Version：
CUDA Version：
Python：
PyTorch：
模型：
命令：
输入规模：
输出指标：TTFT / TPOT / tokens/s / peak memory
结论：
```

否则你很容易得到"上次好像跑通过，但不知道当时是什么环境"的结果。

---

## Step 1：选择平台

### 方案 A：原生 Linux

最直接的路径。推荐 Ubuntu 22.04/24.04 LTS。

### 方案 B：Windows + WSL2（推荐 Windows 用户）

当前主流方案。WSL2 内核支持 CUDA，性能接近原生。

1. Windows 侧安装 NVIDIA 驱动（从 [NVIDIA 官网](https://www.nvidia.com/drivers) 下载）
2. 启用 WSL2：`wsl --install`
3. 重启电脑

**关键点：** Windows 驱动版本决定了 WSL 内可用的 CUDA 版本上限。WSL2 依赖 Windows 驱动的 vGPU 接口来访问 GPU，在 WSL 内装驱动会导致版本冲突和调度异常。

---

## Step 2：验证 NVIDIA 驱动

```bash
nvidia-smi
```

预期输出包含：

| 字段 | 说明 |
|---|---|
| NVIDIA-SMI | 驱动管理器版本 |
| Driver Version | 驱动版本号（如 550.xx） |
| CUDA Version | 驱动支持的最高 CUDA 版本（如 12.4） |
| GPU Name | GPU 型号（如 NVIDIA GeForce RTX 4090） |
| MiB | 显存使用情况 |

**这一步必须通过才能继续。** 如果 `nvidia-smi` 报错，说明驱动未安装或损坏，先解决驱动问题。

记下右上角的 CUDA Version，后面选 PyTorch wheel 时要用。

---

## Step 3：创建 Python 虚拟环境

**不要裸装到系统 Python。** 裸装会导致依赖冲突，后面每个项目都会互相干扰。

### 工具选择

| 工具 | 优点 | 代价 | 推荐场景 |
|---|---|---|---|
| `venv` | Python 自带、概念最少 | 安装速度一般 | 想先理解环境本质时 |
| `uv` | 建环境和装包很快 | 需要额外装一个工具 | **默认首选** |
| `conda` | 处理二进制依赖更强 | 更重，环境容易变"大杂烩" | vLLM / SGLang / 自定义 CUDA 编译 |

### 创建环境（三选一）

```bash
# 方案 A：uv（最快，推荐）
uv venv .venv
source .venv/bin/activate  # Linux/WSL2

# 方案 B：venv（Python 自带）
python -m venv .venv
source .venv/bin/activate

# 方案 C：conda
conda create -n llm python=3.11 -y
conda activate llm
```

本仓库建议的环境拆分：

| 环境名示例 | 用途 |
|---|---|
| `docs-site` | 文档站点预览与构建 |
| `torch-basics` | PyTorch / Transformers / profiler / toy serving |
| `vllm-lab` | vLLM 服务与 benchmark |
| `sglang-lab` | SGLang 服务、structured output、prefix/radix cache |

比起"一个万能环境"，这种拆法更符合本仓库的学习节奏，也更利于排障。

### 验证环境已激活

```bash
which python  # 应指向 .venv/bin/python 或 conda 环境路径，不是系统 Python
python --version  # 3.10+
```

**常见坑：**
- 不要把 `torch`、`vllm`、`sglang` 长期混装在一个环境里
- 不要同时在 Windows Python 和 WSL Python 里维护两套 CUDA 主线
- 一个阶段一个环境，一个重框架一个环境

---

## Step 4：安装 PyTorch CUDA

确认虚拟环境已激活，然后根据 Step 2 记下的 CUDA 版本选择 wheel：

| wheel 后缀 | CUDA 版本 | 适用 GPU |
|---|---|---|
| `cu118` | CUDA 11.8 | Turing 及更早 |
| `cu121` | CUDA 12.1 | Ampere/Ada（A10、RTX 30/40） |
| `cu124` | CUDA 12.4 | Hopper/Blackwell |

```bash
# 根据 nvidia-smi 显示的 CUDA 版本选择对应 wheel
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu124
```

**常见问题：** 如果装完后 `torch.cuda.is_available()` 返回 False，大概率是选错了 wheel（装成 CPU-only 版本），或者虚拟环境没激活。

---

## Step 5：验证 PyTorch CUDA

```bash
python -c "
import torch
print('PyTorch:', torch.__version__)
print('CUDA available:', torch.cuda.is_available())
print('CUDA version:', torch.version.cuda)
if torch.cuda.is_available():
    print('GPU:', torch.cuda.get_device_name(0))
    print('Capability:', torch.cuda.get_device_capability(0))
    print('Memory:', round(torch.cuda.get_device_properties(0).total_memory / 1024**3, 1), 'GB')
"
```

预期输出示例：

```
PyTorch: 2.5.0+cu124
CUDA available: True
CUDA version: 12.4
GPU: NVIDIA GeForce RTX 4090
Capability: (8, 9)
Memory: 24.0 GB
```

如果 `CUDA available: False`，排查顺序：

1. `nvidia-smi` 能否看到 GPU → 驱动问题
2. `pip show torch` 看版本号是否含 `+cu` → 装错版本
3. `which python` 确认指向虚拟环境 → 环境没激活
4. `torch.version.cuda` 与 `nvidia-smi` 的 CUDA Version 对比 → 版本不兼容

### 安装核心库

```bash
pip install transformers triton
python -c "
import transformers, triton
print('Transformers:', transformers.__version__)
print('Triton:', triton.__version__)
"
```

---

## 常见问题速查

### `torch.cuda.is_available()` 返回 False

排查顺序：

1. `nvidia-smi` 能否看到 GPU → 驱动问题
2. PyTorch 是否安装了 CUDA 版本 → `pip show torch` 看版本号是否含 `+cu`
3. 虚拟环境是否激活 → `which python` 确认路径
4. CUDA 版本是否匹配 → `torch.version.cuda` 与 `nvidia-smi` 的 CUDA Version 对比

### CUDA 版本不匹配

```text
nvidia-smi 显示 CUDA 12.4
torch.version.cuda 显示 12.1
→ 正常，只要 driver CUDA 版本 ≥ PyTorch CUDA 版本即可

nvidia-smi 显示 CUDA 11.8
torch.version.cuda 显示 12.1
→ 不兼容，需要升级 driver 或降级 PyTorch wheel
```

### 推理速度异常慢

1. 确认模型在 GPU 上：`next(model.parameters()).device` 应为 `cuda:0`
2. 确认输入在 GPU 上：`tensor.device` 应为 `cuda:0`
3. 首次推理慢是正常的（CUDA JIT 编译、缓存预热）
4. 检查 `nvidia-smi` 的 GPU Utilization 是否为 0%（可能卡在 CPU 端）

### 多版本 CUDA 共存

```bash
# 查看当前 CUDA 版本
nvcc --version

# 如果需要切换（conda 方式）
conda install cuda-toolkit=12.4 -c nvidia
```

建议：一个项目一个虚拟环境，不要在同一环境混装多个 CUDA 版本。

---

## 相关参考

- [GPU 显存 vs 模型大小速查](/reference/gpu-memory) — 不同模型的显存需求和量化后显存估算
- [Profiling 工具快速入门](/systems/profiling-quickstart) — nvidia-smi、torch.profiler 等工具的使用方法

---

## 最小检查清单

完成 Step 1-5 后，能回答以下问题即算环境就绪：

- [ ] `nvidia-smi` 能看到 GPU 和驱动版本
- [ ] `torch.cuda.is_available()` 返回 True
- [ ] 能说出当前 GPU 的型号、显存、CUDA 版本
- [ ] 遇到 CUDA 问题知道从哪里开始排查

## 学习重点

环境配好后，接下来的学习内容：

- tensor shape、dtype、device、contiguous 与显存占用 → [PyTorch CUDA 实验](/labs/p0-torch-cuda)
- profiler 中 CPU 调用、operator、kernel 的关系 → [Operator / Kernel 入门](/reference/operator-kernel-guide)
- batch size、sequence length、KV cache 对显存和延迟的影响 → [KV Cache 系统](/systems/kv-cache)

## 下一步

- [Operator / Kernel 入门](/reference/operator-kernel-guide)
- [CUDA GPU 入门](/reference/cuda-gpu-guide)
- [Benchmark & Profiling](/systems/benchmark-profiling)
- [问题排查指南](/reference/troubleshooting)
