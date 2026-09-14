#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ai.chinaz.cn 移动端适配审计脚本
使用 Playwright 自动扫描网站移动端适配问题，截图并生成报告

安装依赖:
    pip install playwright
    playwright install chromium

运行:
    python mobile_audit.py
"""

import os
import json
import time
import re
from datetime import datetime
from urllib.parse import urljoin, urlparse
from playwright.sync_api import sync_playwright, expect

# ==================== 配置区域 ====================

TARGET_URL = "https://ai.chinaz.cn/"
OUTPUT_DIR = "./mobile_audit_output"

# 模拟设备配置
DEVICES = {
    "iPhone14Pro": {
        "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        "viewport": {"width": 393, "height": 852},
        "device_scale_factor": 3,
        "is_mobile": True,
        "has_touch": True,
    },
    "iPhoneSE": {
        "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        "viewport": {"width": 375, "height": 667},
        "device_scale_factor": 2,
        "is_mobile": True,
        "has_touch": True,
    },
    "Android": {
        "user_agent": "Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
        "viewport": {"width": 360, "height": 800},
        "device_scale_factor": 3,
        "is_mobile": True,
        "has_touch": True,
    },
}

# 最小触控区域 (px)
MIN_TOUCH_SIZE = 44
# 最小可读字体 (px)
MIN_FONT_SIZE = 12

# ==================== 工具函数 ====================

def sanitize_filename(text):
    """清理文件名中的非法字符"""
    text = re.sub(r'[\\/:*?"<>|]', '_', text)
    text = re.sub(r'\s+', '_', text)
    return text[:80]

def ensure_dir(path):
    """确保目录存在"""
    os.makedirs(path, exist_ok=True)

def get_page_name(url):
    """从 URL 提取页面名称"""
    parsed = urlparse(url)
    path = parsed.path.strip('/')
    if not path:
        return "首页"
    return sanitize_filename(path.replace('/', '_') or "首页")

# ==================== 核心检测类 ====================

class MobileAuditor:
    def __init__(self):
        self.issues = []
        self.visited_urls = set()
        self.urls_to_scan = []
        self.start_time = datetime.now()

    def log(self, message):
        """打印日志"""
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {message}")

    def add_issue(self, url, page_name, device, issue_type, description, screenshot_path, suggestion, priority="P1"):
        """记录问题"""
        self.issues.append({
            "timestamp": datetime.now().isoformat(),
            "url": url,
            "page_name": page_name,
            "device": device,
            "issue_type": issue_type,
            "description": description,
            "screenshot": screenshot_path,
            "suggestion": suggestion,
            "priority": priority,
        })

    def discover_urls(self, page, base_url):
        """从首页发现所有内部链接"""
        self.log("正在发现页面链接...")

        # 执行 JavaScript 获取所有链接
        links = page.evaluate("""
            () => {
                const urls = new Set();
                document.querySelectorAll('a[href]').forEach(a => {
                    const href = a.getAttribute('href');
                    if (href && !href.startsWith('#') && !href.startsWith('javascript:') && !href.startsWith('mailto:')) {
                        urls.add(href);
                    }
                });
                return Array.from(urls);
            }
        """)

        discovered = set()
        for link in links:
            full_url = urljoin(base_url, link)
            # 只保留同域名的链接
            if urlparse(full_url).netloc == urlparse(base_url).netloc:
                discovered.add(full_url)

        # 必测页面
        must_test = [base_url]

        # 补充发现的链接
        for url in list(discovered)[:30]:
            must_test.append(url)

        self.urls_to_scan = list(dict.fromkeys(must_test))
        self.log(f"发现 {len(self.urls_to_scan)} 个待测页面")

    def check_horizontal_overflow(self, page, url, page_name, device, screenshot_dir):
        """检测横向溢出"""
        try:
            result = page.evaluate("""
                () => {
                    const html = document.documentElement;
                    const body = document.body;
                    const scrollWidth = Math.max(html.scrollWidth, body.scrollWidth);
                    const clientWidth = window.innerWidth;
                    return {
                        scrollWidth: scrollWidth,
                        clientWidth: clientWidth,
                        hasOverflow: scrollWidth > clientWidth,
                        overflowAmount: scrollWidth - clientWidth
                    };
                }
            """)

            if result["hasOverflow"] and result["overflowAmount"] > 5:
                screenshot_name = f"{sanitize_filename(page_name)}_横向溢出.png"
                screenshot_path = os.path.join(screenshot_dir, screenshot_name)
                page.screenshot(path=screenshot_path, full_page=True)

                self.add_issue(
                    url=url,
                    page_name=page_name,
                    device=device,
                    issue_type="横向溢出",
                    description=f"页面内容宽度({result['scrollWidth']}px)超出视口宽度({result['clientWidth']}px)，超出{result['overflowAmount']}px",
                    screenshot_path=screenshot_path,
                    suggestion="检查并移除固定宽度元素，使用 max-width: 100vw 或 width: 100%",
                    priority="P0"
                )
                self.log(f"  ⚠️ 发现横向溢出: +{result['overflowAmount']}px")
                return True
        except Exception as e:
            self.log(f"  横向溢出检测失败: {e}")
        return False

    def check_touch_targets(self, page, url, page_name, device, screenshot_dir):
        """检测触控区域"""
        try:
            small_targets = page.evaluate("""
                () => {
                    const elements = document.querySelectorAll('a, button, [role="button"], input, select, textarea, [onclick]');
                    const small = [];
                    elements.forEach(el => {
                        const rect = el.getBoundingClientRect();
                        if (rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44)) {
                            const style = window.getComputedStyle(el);
                            if (style.display !== 'none' && style.visibility !== 'hidden') {
                                small.push({
                                    tag: el.tagName,
                                    text: el.innerText ? el.innerText.substring(0, 30) : '',
                                    width: Math.round(rect.width),
                                    height: Math.round(rect.height)
                                });
                            }
                        }
                    });
                    return small.slice(0, 10);
                }
            """)

            if small_targets:
                screenshot_name = f"{sanitize_filename(page_name)}_触控区域过小.png"
                screenshot_path = os.path.join(screenshot_dir, screenshot_name)
                page.screenshot(path=screenshot_path, full_page=True)

                details = "; ".join([f"{t['tag']}(\"{t['text']}\") {t['width']}×{t['height']}px" for t in small_targets[:3]])
                self.add_issue(
                    url=url,
                    page_name=page_name,
                    device=device,
                    issue_type="触控区域过小",
                    description=f"发现 {len(small_targets)} 个触控区域小于 44×44px: {details}",
                    screenshot_path=screenshot_path,
                    suggestion="增大按钮 padding 或尺寸，确保触控区域至少 44×44px",
                    priority="P1"
                )
                self.log(f"  ⚠️ 发现 {len(small_targets)} 个触控区域过小")
                return True
        except Exception as e:
            self.log(f"  触控区域检测失败: {e}")
        return False

    def check_font_sizes(self, page, url, page_name, device, screenshot_dir):
        """检测字体过小"""
        try:
            small_texts = page.evaluate("""
                () => {
                    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
                    const small = [];
                    let node;
                    while (node = walker.nextNode()) {
                        if (node.textContent.trim().length > 0) {
                            const parent = node.parentElement;
                            const style = window.getComputedStyle(parent);
                            const fontSize = parseFloat(style.fontSize);
                            if (fontSize > 0 && fontSize < 12) {
                                const rect = parent.getBoundingClientRect();
                                if (rect.width > 0 && rect.height > 0) {
                                    small.push({
                                        text: node.textContent.trim().substring(0, 40),
                                        fontSize: fontSize,
                                        tag: parent.tagName
                                    });
                                }
                            }
                        }
                    }
                    return small.slice(0, 10);
                }
            """)

            if small_texts:
                screenshot_name = f"{sanitize_filename(page_name)}_字体过小.png"
                screenshot_path = os.path.join(screenshot_dir, screenshot_name)
                page.screenshot(path=screenshot_path, full_page=True)

                details = "; ".join([f"\"{t['text']}\"({t['fontSize']}px)" for t in small_texts[:3]])
                self.add_issue(
                    url=url,
                    page_name=page_name,
                    device=device,
                    issue_type="字体过小",
                    description=f"发现 {len(small_texts)} 处字体小于 12px: {details}",
                    screenshot_path=screenshot_path,
                    suggestion="正文字体至少 12px（推荐 14-16px），使用 rem/em 单位",
                    priority="P2"
                )
                self.log(f"  ⚠️ 发现 {len(small_texts)} 处字体过小")
                return True
        except Exception as e:
            self.log(f"  字体检测失败: {e}")
        return False

    def check_fixed_width_elements(self, page, url, page_name, device, screenshot_dir):
        """检测固定宽度溢出"""
        try:
            fixed_elements = page.evaluate("""
                () => {
                    const all = document.querySelectorAll('*');
                    const bad = [];
                    const vw = window.innerWidth;
                    all.forEach(el => {
                        const style = window.getComputedStyle(el);
                        const width = style.width;
                        if (width.endsWith('px')) {
                            const px = parseInt(width);
                            if (px > vw) {
                                const rect = el.getBoundingClientRect();
                                if (rect.width > 0) {
                                    bad.push({
                                        tag: el.tagName,
                                        className: el.className ? el.className.substring(0, 50) : '',
                                        width: px,
                                        viewport: vw
                                    });
                                }
                            }
                        }
                    });
                    return bad.slice(0, 5);
                }
            """)

            if fixed_elements:
                screenshot_name = f"{sanitize_filename(page_name)}_固定宽度溢出.png"
                screenshot_path = os.path.join(screenshot_dir, screenshot_name)
                page.screenshot(path=screenshot_path, full_page=True)

                details = "; ".join([f"<{t['tag']} class=\"{t['className']}\"> {t['width']}px > {t['viewport']}px" for t in fixed_elements[:2]])
                self.add_issue(
                    url=url,
                    page_name=page_name,
                    device=device,
                    issue_type="固定宽度溢出",
                    description=f"固定宽度元素超出视口: {details}",
                    screenshot_path=screenshot_path,
                    suggestion="将固定像素宽度改为百分比/vw，或使用 max-width: 100% + box-sizing: border-box",
                    priority="P0"
                )
                self.log(f"  ⚠️ 发现固定宽度溢出")
                return True
        except Exception as e:
            self.log(f"  固定宽度检测失败: {e}")
        return False

    def check_images(self, page, url, page_name, device, screenshot_dir):
        """检测图片问题"""
        try:
            image_issues = page.evaluate("""
                () => {
                    const imgs = document.querySelectorAll('img');
                    const issues = [];
                    imgs.forEach(img => {
                        const rect = img.getBoundingClientRect();
                        if (rect.width > 0 && rect.height > 0 && img.naturalWidth > 0) {
                            const naturalRatio = img.naturalWidth / img.naturalHeight;
                            const displayRatio = rect.width / rect.height;
                            if (Math.abs(naturalRatio - displayRatio) > 0.3) {
                                issues.push({type: '变形', src: img.src.split('/').pop().substring(0, 30)});
                            }
                            if (rect.width > window.innerWidth) {
                                issues.push({type: '溢出', src: img.src.split('/').pop().substring(0, 30)});
                            }
                        }
                    });
                    return issues.slice(0, 5);
                }
            """)

            if image_issues:
                screenshot_name = f"{sanitize_filename(page_name)}_图片问题.png"
                screenshot_path = os.path.join(screenshot_dir, screenshot_name)
                page.screenshot(path=screenshot_path, full_page=True)

                deform = len([i for i in image_issues if i['type'] == '变形'])
                overflow = len([i for i in image_issues if i['type'] == '溢出'])
                desc_parts = []
                if deform: desc_parts.append(f"{deform} 张图片比例变形")
                if overflow: desc_parts.append(f"{overflow} 张图片超出视口")

                self.add_issue(
                    url=url,
                    page_name=page_name,
                    device=device,
                    issue_type="图片适配问题",
                    description="; ".join(desc_parts),
                    screenshot_path=screenshot_path,
                    suggestion="图片添加 max-width: 100%; height: auto; 使用响应式图片 srcset",
                    priority="P1"
                )
                self.log(f"  ⚠️ 发现图片问题")
                return True
        except Exception as e:
            self.log(f"  图片检测失败: {e}")
        return False

    def scan_page(self, page, url, device_name, device_config, screenshot_dir):
        """扫描单个页面"""
        page_name = get_page_name(url)
        self.log(f"扫描页面: {page_name} ({device_name})")

        try:
            page.set_viewport_size(device_config["viewport"])
            page.set_extra_http_headers({"User-Agent": device_config["user_agent"]})

            response = page.goto(url, wait_until="networkidle", timeout=30000)
            if not response or response.status >= 400:
                self.log(f"  ❌ 页面访问失败")
                return

            page.wait_for_timeout(2000)

            # 滚动到底部触发懒加载
            page.evaluate("""
                async () => {
                    await new Promise(resolve => {
                        let totalHeight = 0;
                        const distance = 300;
                        const timer = setInterval(() => {
                            const scrollHeight = document.body.scrollHeight;
                            window.scrollBy(0, distance);
                            totalHeight += distance;
                            if (totalHeight >= scrollHeight) {
                                clearInterval(timer);
                                window.scrollTo(0, 0);
                                resolve();
                            }
                        }, 100);
                    });
                }
            """)
            page.wait_for_timeout(1000)

            has_issue = False
            has_issue |= self.check_horizontal_overflow(page, url, page_name, device_name, screenshot_dir)
            has_issue |= self.check_fixed_width_elements(page, url, page_name, device_name, screenshot_dir)
            has_issue |= self.check_touch_targets(page, url, page_name, device_name, screenshot_dir)
            has_issue |= self.check_font_sizes(page, url, page_name, device_name, screenshot_dir)
            has_issue |= self.check_images(page, url, page_name, device_name, screenshot_dir)

            # 保存全屏基准截图
            baseline_name = f"{sanitize_filename(page_name)}_全屏.png"
            baseline_path = os.path.join(screenshot_dir, baseline_name)
            page.screenshot(path=baseline_path, full_page=True)

            if not has_issue:
                self.log(f"  ✅ 未检测到明显适配问题")

        except Exception as e:
            self.log(f"  ❌ 扫描异常: {e}")

    def generate_report(self):
        """生成报告"""
        report_path = os.path.join(OUTPUT_DIR, "report.md")
        json_path = os.path.join(OUTPUT_DIR, "issues.json")

        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(self.issues, f, ensure_ascii=False, indent=2)

        duration = (datetime.now() - self.start_time).total_seconds()

        md = f"""# ai.chinaz.cn 移动端适配审计报告

> 生成时间: {self.start_time.strftime('%Y-%m-%d %H:%M:%S')}  
> 扫描耗时: {duration:.1f} 秒  
> 测试设备: {', '.join(DEVICES.keys())}  
> 发现问题: {len(self.issues)} 项

---

## 问题汇总表

| 序号 | 页面 | 设备 | 问题类型 | 优先级 | 描述 | 修复建议 |
|------|------|------|----------|--------|------|----------|
"""

        for i, issue in enumerate(self.issues, 1):
            desc_short = issue["description"][:60] + "..." if len(issue["description"]) > 60 else issue["description"]
            suggest_short = issue["suggestion"][:60] + "..." if len(issue["suggestion"]) > 60 else issue["suggestion"]
            md += f"| {i} | {issue['page_name']} | {issue['device']} | {issue['issue_type']} | {issue['priority']} | {desc_short} | {suggest_short} |\n"

        md += "\n---\n\n## 详细问题列表\n\n"

        for i, issue in enumerate(self.issues, 1):
            rel_path = os.path.relpath(issue['screenshot'], OUTPUT_DIR).replace("\\", "/")
            md += f"""### {i}. {issue['page_name']} - {issue['issue_type']} [{issue['priority']}]

- **URL**: {issue['url']}
- **设备**: {issue['device']}
- **问题描述**: {issue['description']}
- **修复建议**: {issue['suggestion']}
- **截图文件**: `{os.path.basename(issue['screenshot'])}`

![截图]({rel_path})

---

"""

        with open(report_path, "w", encoding="utf-8") as f:
            f.write(md)

        self.log(f"报告已生成: {report_path}")
        self.log(f"JSON 数据: {json_path}")

    def run(self):
        """主流程"""
        self.log("=" * 50)
        self.log("开始移动端适配审计")
        self.log("=" * 50)

        ensure_dir(OUTPUT_DIR)

        with sync_playwright() as p:
            browser = p.chromium.launch(
                headless=True,
                executable_path=r"C:\Users\yf\AppData\Local\ms-playwright\chromium-1228\chrome-win64\chrome.exe"
            )

            # 发现 URL
            context = browser.new_context()
            page = context.new_page()
            page.goto(TARGET_URL, wait_until="networkidle", timeout=30000)
            self.discover_urls(page, TARGET_URL)
            context.close()

            # 限制扫描数量
            max_pages = min(len(self.urls_to_scan), 15)
            self.urls_to_scan = self.urls_to_scan[:max_pages]

            # 逐个设备扫描
            for device_name, device_config in DEVICES.items():
                device_dir = os.path.join(OUTPUT_DIR, "screenshots", device_name)
                ensure_dir(device_dir)

                self.log(f"\n{'='*50}")
                self.log(f"使用设备: {device_name}")
                self.log(f"{'='*50}")

                context = browser.new_context(
                    user_agent=device_config["user_agent"],
                    viewport=device_config["viewport"],
                    device_scale_factor=device_config["device_scale_factor"],
                    is_mobile=device_config["is_mobile"],
                    has_touch=device_config["has_touch"],
                )

                for url in self.urls_to_scan:
                    page = context.new_page()
                    self.scan_page(page, url, device_name, device_config, device_dir)
                    page.close()

                context.close()

            browser.close()

        self.generate_report()

        self.log("\n" + "=" * 50)
        self.log("审计完成！")
        self.log(f"共发现 {len(self.issues)} 个问题")
        self.log(f"输出目录: {os.path.abspath(OUTPUT_DIR)}")
        self.log("=" * 50)


if __name__ == "__main__":
    auditor = MobileAuditor()
    auditor.run()
