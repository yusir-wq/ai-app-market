# Agent 智能体模块

## 1. 模块职责

提供智能体的产品介绍（Intro）、交互体验（Experience）、结果展示（Result）三层架构，支持音视频处理、文案生成、图像处理等多种 AI 能力。

## 2. 目录结构

```
components/agent/
├── agent-shell.tsx                     # 智能体详情主壳
├── agent-scene-cards.tsx               # 场景选择卡片网格
├── agent-input-area.tsx                # 复合输入区域
├── agent-params-form.tsx               # 动态参数表单
├── agent-upload-zone.tsx               # 通用上传拖拽区
├── agent-result-area.tsx               # 结果展示区域
├── agent-result-preview.tsx            # 结果预览卡片
│
├── agent-copywriting-intro.tsx         # 视频文案 - 介绍
├── agent-copywriting-experience.tsx    # 视频文案 - 体验
├── agent-copywriting-to-video-intro.tsx# 文案转视频 - 介绍
├── copywriting-to-video-experience.tsx # 文案转视频 - 体验
├── agent-image-to-video-intro.tsx      # 图生视频 - 介绍
├── image-to-video-experience.tsx       # 图生视频 - 体验
├── agent-text-to-speech-intro.tsx      # 文字转语音 - 介绍
├── agent-text-to-speech-experience.tsx # 文字转语音 - 体验
├── agent-speech-to-text-intro.tsx      # 语音转文字 - 介绍
├── agent-video-to-text-intro.tsx       # 视频转文字 - 介绍
├── agent-video-translate-intro.tsx     # 视频翻译 - 介绍
├── agent-video-translate-experience.tsx# 视频翻译 - 体验
└── agent-video-translate-result.tsx    # 视频翻译 - 结果

app/agent/
├── page.tsx                            # 智能体广场列表页
└── [id]/page.tsx                       # 智能体详情页（动态路由）
```

## 3. 文件说明

### 架构层

| 文件 | 职责 |
|------|------|
| `agent-shell.tsx` | 详情页主壳，按类型动态加载 Intro 组件，协调场景→输入→结果流程 |
| `agent-scene-cards.tsx` | 场景卡片网格，彩色主题图标 + 标题 + 描述 + 标签 |
| `agent-input-area.tsx` | 复合输入，支持 file/text/both 类型切换、上传和文本输入 |
| `agent-params-form.tsx` | 根据 Agent 参数定义自动渲染开关/滑块/下拉表单 |
| `agent-upload-zone.tsx` | 拖拽上传，格式校验、大小限制、进度显示、分类图标 |
| `agent-result-area.tsx` | 多类型结果渲染（文本/音频/视频/图片/分镜），下载和复制 |
| `agent-result-preview.tsx` | 轻量预览卡片，处理中（进度条）和已完成两种状态 |

### 能力 Intro 页（8 个）

| 文件 | 职责 |
|------|------|
| `agent-copywriting-intro.tsx` | 视频文案生成介绍，Hero + 三大亮点 + 步骤指引 |
| `agent-copywriting-to-video-intro.tsx` | 文案→视频介绍，功能亮点 + 分步向导 |
| `agent-image-to-video-intro.tsx` | 图生视频介绍，特色卡片 + 使用场景 |
| `agent-text-to-speech-intro.tsx` | 文字转语音介绍，多场景卡片（配音/播客/教育） |
| `agent-speech-to-text-intro.tsx` | 语音转文字介绍，音视频转写 + 发言人区分 |
| `agent-video-to-text-intro.tsx` | 视频转文字介绍，三步骤 + 场景卡片 |
| `agent-video-translate-intro.tsx` | 视频翻译介绍，70+ 语言 + 分步指南 |

### 能力 Experience 页（6 个）

| 文件 | 职责 |
|------|------|
| `agent-copywriting-experience.tsx` | 视频文案体验，主题输入 + AI 生成 + 参数控制 |
| `copywriting-to-video-experience.tsx` | 文案转视频体验，分镜脚本生成 + 满意度 |
| `image-to-video-experience.tsx` | 图生视频体验，图片上传 + prompt + 运镜/比例/时长 |
| `agent-text-to-speech-experience.tsx` | 文字转语音体验，语种/音色/语速/音调 + 播放下载 |
| `agent-video-translate-experience.tsx` | 视频翻译体验，语言选择 + 字幕/配音模式 |

### 结果页

| 文件 | 职责 |
|------|------|
| `agent-video-translate-result.tsx` | 视频翻译结果，双语字幕时间轴 + 视频播放器 |

### 路由页

| 文件 | 职责 |
|------|------|
| `app/agent/page.tsx` | 智能体广场，分类筛选 + 关键词搜索 + 卡片网格 |
| `app/agent/[id]/page.tsx` | 动态路由详情，按 id 查询 mockAgents，未找到返回 404 |

## 4. 对外提供的能力

| 类别 | 导出名称 |
|------|----------|
| 壳 & 通用 | `AgentShell`, `AgentSceneCards`, `AgentInputArea`, `AgentParamsForm`, `AgentUploadZone`, `AgentResultArea`, `AgentResultPreview` |
| Intro 页 | `AgentCopywritingIntro`, `AgentCopywritingToVideoIntro`, `AgentImageToVideoIntro`, `AgentTextToSpeechIntro`, `AgentSpeechToTextIntro`, `AgentVideoToTextIntro`, `AgentVideoTranslateIntro` |
| 体验区 | `CopywritingExperienceArea`, `CopywritingToVideoExperienceArea`, `ImageToVideoExperienceArea`, `TextToSpeechExperienceArea`, `VideoTranslateExperienceArea` |
| 结果 | `VideoTranslateResultPage` |
| 类型 | `ResultType`, `SpeakerSegment`, `StoryboardShot`, `MultiVoiceResult` |

## 5. 依赖关系

- **依赖**：`components/ui/`、`lib/`（mockAgents、getAgentById 等）
- **被依赖**：`components/workspace/agent-home-view.tsx`、`components/workspace/agent-result-detail-view.tsx`

## 6. 开发约定

- **三层架构**：Intro（介绍）→ Experience（体验）→ Result（结果），新增能力按此模式扩展
- **命名规范**：Intro 以 `*-intro.tsx` 结尾，Experience 以 `*-experience.tsx` 结尾
- **AgentShell 调度**：所有 Agent 详情通过 `AgentShell` 统一入口，按类型懒加载对应 Intro 组件
- **数据源**：从 `lib/mock-data.ts` 读取 `mockAgents` 和 `getAgentById()`
- **结果类型**：统一使用 `ResultType` 联合类型（`'text' | 'audio' | 'video' | 'image' | 'storyboard' | 'file'`）

## 7. 已知问题

- Intro 组件代码高度重复（Hero + 亮点卡片 + 步骤），可提取共享模板
- `agent-input-area.tsx` 1131 行过长
- 部分命名不一致：有的有 `agent-` 前缀，有的没有（如 `copywriting-to-video-experience.tsx`）
- `agent-speech-to-text` 和 `agent-video-to-text` 缺少 Experience 组件（仅有 Intro）
