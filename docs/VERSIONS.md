# 版本演进说明

> 本文档记录项目各版本分支的对应关系与快速切换指南。
> 生成时间：2026-07-07

## 分支速查

| 分支 | 对应历史版本 | 状态 | 最后功能特征 |
|------|------------|------|-------------|
| `main` | V1.3 | 活跃开发 | Agent 生态、视频/图像智能体 |
| `full-feature` | V1.3 实验线 | 并行实验 | 完整功能探索 |
| `archive/v1.2` | V1.2 | 归档 | 模型市场、多模型 Tab 布局 |
| `archive/v1.1` | V1.1 | 归档 | MCP 服务模块（后移除） |
| `archive/v1.0` | V1.0 | 归档 | 基础 AI 应用市场 |

## Tag 速查

- `v1.0.0` — V1.0 归档快照
- `v1.1.0` — V1.1 归档快照（含 MCP 移除后的清理）
- `v1.2.0` — V1.2 归档快照
- `v1.3.0` — V1.3 主分支快照

## 切换旧版本

```bash
# 查看 V1.2 代码
git checkout archive/v1.2

# 基于 V1.2 创建修复分支
git checkout -b hotfix/v1.2.x archive/v1.2
```

## 仓库合并说明

本项目由 4 个独立仓库合并而成：
- `ai-app-market-v1` → `archive/v1.0`
- `ai-app-market-v1.1` → `archive/v1.1`
- `ai-app-market-v1.2` → `archive/v1.2`
- `ai-app-market-v1.3` → `main` + `full-feature`

各版本历史以**独立提交树**形式共存，通过分支名区分来源。
