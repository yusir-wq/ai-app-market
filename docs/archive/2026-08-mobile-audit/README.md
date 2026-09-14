# ai.chinaz.cn 移动端适配审计工具

## 功能
自动扫描 ai.chinaz.cn 网站，检测移动端适配问题并生成截图报告。

## 检测项目
- 横向溢出（内容超出屏幕宽度）
- 固定宽度元素溢出
- 触控区域过小（< 44×44px）
- 字体过小（< 12px）
- 图片变形或溢出
- 全屏基准截图

## 测试设备
- iPhone 14 Pro (393×852, DPR=3)
- iPhone SE (375×667, DPR=2)
- Android (360×800, DPR=3)

## 安装
```bash
pip install playwright
playwright install chromium
```

## 运行
```bash
python mobile_audit.py
```

## 输出结构
```
mobile_audit_output/
├── screenshots/
│   ├── iPhone14Pro/
│   ├── iPhoneSE/
│   └── Android/
├── report.md      # Markdown 报告（可直接发给前端）
└── issues.json    # 结构化数据
```

## 报告内容
- 问题汇总表（可直接贴到项目管理工具）
- 每个问题的详细描述 + 修复建议
- 带截图的问题展示
- 优先级分级（P0/P1/P2）
