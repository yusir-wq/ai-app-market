# AI视频配音 · BGM 公网地址清单

> 来源：Kevin MacLeod（incompetech.com）
> 直链验证：全部支持在线流式播放（HTTP 206 / Range 请求），截至 2026-09-08
> 授权：CC BY 4.0，商用免费，需署名
> URL 规则：`https://incompetech.com/music/royalty-free/mp3-royaltyfree/曲名.mp3`（曲名中的空格写为 `%20`）

## 温暖舒缓 · 适合配音垫底（人声优先）

| 曲名 | 试听地址 | 适用场景 |
|------|----------|----------|
| Wholesome | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Wholesome.mp3 | 温暖治愈，人声旁白下最稳的选择 |
| Dreamy Flashback | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Dreamy%20Flashback.mp3 | 梦幻氛围，适合独白、回忆片段 |
| Fireflies and Stardust | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Fireflies%20and%20Stardust.mp3 | 空灵柔和，适合睡前、治愈类内容 |
| Deliberate Thought | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Deliberate%20Thought.mp3 | 沉思型钢琴+弦乐，适合知识讲解、观点输出 |
| Thinking Music | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Thinking%20Music.mp3 | 轻松钢琴小品，适合教程、操作演示 |

## 轻快活泼 · 适合产品介绍、日常内容

| 曲名 | 试听地址 | 适用场景 |
|------|----------|----------|
| Carefree | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Carefree.mp3 | 轻松愉快，尤克里里质感，口播开场常用 |
| Wallpaper | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Wallpaper.mp3 | 轻快电子，有科技感，适合 AI 产品演示 |
| Daily Beetle | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Daily%20Beetle.mp3 | 俏皮轻快，适合 vlog、日常记录 |
| Fluffing a Duck | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Fluffing%20a%20Duck.mp3 | 滑稽幽默，适合搞笑配音、整活内容 |
| Monkeys Spinning Monkeys | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Monkeys%20Spinning%20Monkeys.mp3 | 短视频神曲级幽默 BGM |
| Sneaky Snitch | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Sneaky%20Snitch.mp3 | 俏皮悬疑，适合"揭秘"类、剧情反转 |

## 抒情钢琴 · 适合情感叙述、回忆向

| 曲名 | 试听地址 | 适用场景 |
|------|----------|----------|
| Piano Between | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Piano%20Between.mp3 | 简约钢琴，情绪留白，适合人物故事 |
| Heartbreaking | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Heartbreaking.mp3 | 感伤钢琴+弦乐，适合催泪向内容 |
| Bittersweet | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Bittersweet.mp3 | 苦乐参半的抒情，适合告别、成长主题 |

## 爵士律动 · 适合美食、探店、生活方式

| 曲名 | 试听地址 | 适用场景 |
|------|----------|----------|
| Local Forecast - Elevator | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Local%20Forecast%20-%20Elevator.mp3 | 电梯爵士，慵懒舒适 |
| George Street Shuffle | https://incompetech.com/music/royalty-free/mp3-royaltyfree/George%20Street%20Shuffle.mp3 | 轻快爵士鼓刷+钢琴，适合探店、美食 |
| Groove Grove | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Groove%20Grove.mp3 | 律动感强，适合节奏剪辑、卡点 |
| Fretless | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Fretless.mp3 | 无品贝斯主导，慵懒休闲 |

## 紧张史诗 · 适合悬念、动作、预告片

| 曲名 | 试听地址 | 适用场景 |
|------|----------|----------|
| Prelude and Action | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Prelude%20and%20Action.mp3 | 动作紧张，弦乐推进，适合快节奏预告 |
| Rising Tide | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Rising%20Tide.mp3 | 层层递进的紧张感，适合悬念铺垫 |
| Darkest Child | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Darkest%20Child.mp3 | 黑暗压迫感，适合悬疑、惊悚 |

## 授权与使用说明

- **授权协议**：Creative Commons BY 4.0（https://creativecommons.org/licenses/by/4.0/），商用免费，使用时需署名
- **署名模板**：`"曲名" Kevin MacLeod (incompetech.com), Licensed under Creative Commons: By Attribution 4.0 License`
- **播放注意**：直链返回 `application/octet-stream`，浏览器直接打开会触发下载；在 `<audio>` 标签或播放器中可正常流式播放，配套试听页见 `bgm-preview.html`
- **工程混音**：直链支持 Range 请求，ffmpeg 可直接远程混音：

```bash
ffmpeg -i 配音.wav -i "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Wholesome.mp3" \
  -filter_complex "[1:a]volume=0.25[b];[0:a][b]amix=duration=first" out.mp4
```
