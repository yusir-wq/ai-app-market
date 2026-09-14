from playwright.sync_api import sync_playwright
import json
import os
import traceback

OUTPUT_DIR = r"c:\Users\yf\.trae-cn\work\6a4f6d09ec7ad20987f7e0c1"
PAGE_URL = "http://192.9.186.204/frontends-demo/aichinazcn/#/image-tools/ai-background"

log_lines = []

def log(msg):
    log_lines.append(msg)
    print(msg)

def extract_computed_styles(element, page):
    styles = page.evaluate("""(el) => {
        const cs = window.getComputedStyle(el);
        return {
            backgroundColor: cs.backgroundColor,
            color: cs.color,
            fontSize: cs.fontSize,
            fontFamily: cs.fontFamily,
            fontWeight: cs.fontWeight,
            lineHeight: cs.lineHeight,
            padding: cs.padding,
            paddingTop: cs.paddingTop,
            paddingBottom: cs.paddingBottom,
            paddingLeft: cs.paddingLeft,
            paddingRight: cs.paddingRight,
            margin: cs.margin,
            borderRadius: cs.borderRadius,
            borderTopLeftRadius: cs.borderTopLeftRadius,
            borderTopRightRadius: cs.borderTopRightRadius,
            borderBottomLeftRadius: cs.borderBottomLeftRadius,
            borderBottomRightRadius: cs.borderBottomRightRadius,
            border: cs.border,
            borderColor: cs.borderColor,
            borderWidth: cs.borderWidth,
            borderStyle: cs.borderStyle,
            borderTop: cs.borderTop,
            borderRight: cs.borderRight,
            borderBottom: cs.borderBottom,
            borderLeft: cs.borderLeft,
            boxShadow: cs.boxShadow,
            width: cs.width,
            height: cs.height,
            maxHeight: cs.maxHeight,
            overflow: cs.overflow,
            overflowY: cs.overflowY,
            display: cs.display,
            position: cs.position,
            top: cs.top,
            left: cs.left,
            zIndex: cs.zIndex,
            cursor: cs.cursor,
            transition: cs.transition,
            opacity: cs.opacity,
            backdropFilter: cs.backdropFilter,
        };
    }""", element)
    return styles

def extract_element_info(element, page, label=""):
    tag = element.evaluate("el => el.tagName.toLowerCase()")
    class_list = element.evaluate("""(el) => {
        if (typeof el.className === 'string') return el.className.split(' ').filter(c => c);
        return Array.from(el.classList);
    }""")
    inline_style = element.evaluate("el => el.getAttribute('style') || ''")
    computed = extract_computed_styles(element, page)
    data_attribute = element.evaluate("el => { const attrs = {}; for (const attr of el.attributes) { if (attr.name.startsWith('data-') || attr.name === 'role') attrs[attr.name] = attr.value; } return attrs; }")
    
    return {
        "label": label,
        "tag": tag,
        "classes": class_list,
        "data_attributes": data_attribute,
        "inline_style": inline_style,
        "computed_styles": computed
    }

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    
    try:
        log("Step 1: Navigating to page...")
        page.goto(PAGE_URL, wait_until="load", timeout=30000)
        page.wait_for_timeout(3000)
        
        page.screenshot(path=os.path.join(OUTPUT_DIR, "01_initial_page.png"), full_page=False)
        log("Initial screenshot saved.")
        
        all_buttons = page.locator("button, [role='button']").all()
        log(f"Found {len(all_buttons)} button elements total")
        
        for i, btn in enumerate(all_buttons):
            try:
                text = btn.inner_text().strip()
                is_visible = btn.is_visible()
                if is_visible and text:
                    log(f"  Button [{i}] visible={is_visible}: '{text[:60]}'")
            except:
                pass
        
        # --- Style Dropdown ---
        log("\n--- Step 2: Style Dropdown ---")
        style_btn = None
        
        for btn in all_buttons:
            try:
                text = btn.inner_text().strip()
                if ("摄影棚" in text or ("风格" in text and "分类" in text)) and btn.is_visible():
                    style_btn = btn
                    log(f"Found style button: '{text}'")
                    break
            except:
                pass
        
        if not style_btn:
            try:
                style_btn = page.locator("text=摄影棚").first
                if style_btn.is_visible():
                    log("Found style button via text locator")
            except:
                pass
        
        if style_btn and style_btn.is_visible():
            log("Clicking style dropdown...")
            style_btn.click()
            page.wait_for_timeout(1000)
            
            page.screenshot(path=os.path.join(OUTPUT_DIR, "02_style_dropdown_opened.png"), full_page=False)
            log("Style dropdown screenshot saved.")
            
            floating_panels = page.locator("[class*='popper'], [class*='popover'], [class*='dropdown'], [class*='select-drop'], [class*='popup'], [class*='panel'], [class*='options'], [class*='overlay'], [role='listbox'], [role='menu'], [role='dialog']").all()
            
            style_results = []
            for i, panel in enumerate(floating_panels):
                if not panel.is_visible():
                    continue
                box = panel.bounding_box()
                if box is None:
                    continue
                
                log(f"  Panel {i}: visible, bbox=({box['x']},{box['y']}, {box['width']}x{box['height']})")
                panel_info = extract_element_info(panel, page, f"style_panel_{i}")
                style_results.append(panel_info)
                
                inner_html = panel.evaluate("el => el.innerHTML.substring(0, 2000)")
                log(f"  Inner HTML (first 500 chars): {inner_html[:500]}")
                
                items = panel.locator("[class*='item'], [class*='option'], [class*='cell'], [class*='row'], li, [role='option'], [role='menuitem'], [class*='tag']").all()
                log(f"  Items found: {len(items)}")
                
                for j, item in enumerate(items[:15]):
                    if item.is_visible():
                        item_text = item.inner_text().strip()[:40]
                        item_info = extract_element_info(item, page, f"style_item_{j}: '{item_text}'")
                        style_results.append(item_info)
                        log(f"    Item {j}: '{item_text}' classes={item_info['classes'][:3]}")
            
            with open(os.path.join(OUTPUT_DIR, "style_dropdown_styles.json"), "w", encoding="utf-8") as f:
                json.dump(style_results, f, ensure_ascii=False, indent=2)
            log(f"Saved {len(style_results)} style elements to JSON")
            
            page.mouse.click(10, 10)
            page.wait_for_timeout(500)
        else:
            log("Could not find style dropdown button!")
        
        # --- Ratio Dropdown ---
        log("\n--- Step 3: Ratio Dropdown ---")
        all_buttons = page.locator("button, [role='button']").all()
        
        ratio_btn = None
        for btn in all_buttons:
            try:
                text = btn.inner_text().strip()
                if ("接近原图" in text or ("比例" in text and btn.is_visible())) and btn.is_visible():
                    ratio_btn = btn
                    log(f"Found ratio button: '{text}'")
                    break
            except:
                pass
        
        if not ratio_btn:
            try:
                ratio_btn = page.locator("text=接近原图").first
                if ratio_btn.is_visible():
                    log("Found ratio button via text locator")
            except:
                pass
        
        if ratio_btn and ratio_btn.is_visible():
            log("Clicking ratio dropdown...")
            ratio_btn.click()
            page.wait_for_timeout(1000)
            
            page.screenshot(path=os.path.join(OUTPUT_DIR, "03_ratio_dropdown_opened.png"), full_page=False)
            log("Ratio dropdown screenshot saved.")
            
            floating_panels = page.locator("[class*='popper'], [class*='popover'], [class*='dropdown'], [class*='select-drop'], [class*='popup'], [class*='panel'], [class*='options'], [role='listbox'], [role='menu']").all()
            
            ratio_results = []
            for i, panel in enumerate(floating_panels):
                if not panel.is_visible():
                    continue
                box = panel.bounding_box()
                if box is None:
                    continue
                
                log(f"  Panel {i}: bbox=({box['x']},{box['y']}, {box['width']}x{box['height']})")
                panel_info = extract_element_info(panel, page, f"ratio_panel_{i}")
                ratio_results.append(panel_info)
                
                items = panel.locator("[class*='item'], [class*='option'], [class*='cell'], [class*='row'], li, [role='option'], [role='menuitem'], [class*='tag']").all()
                for j, item in enumerate(items[:10]):
                    if item.is_visible():
                        item_text = item.inner_text().strip()[:40]
                        item_info = extract_element_info(item, page, f"ratio_item_{j}: '{item_text}'")
                        ratio_results.append(item_info)
            
            with open(os.path.join(OUTPUT_DIR, "ratio_dropdown_styles.json"), "w", encoding="utf-8") as f:
                json.dump(ratio_results, f, ensure_ascii=False, indent=2)
            log(f"Saved {len(ratio_results)} ratio elements to JSON")
            
            page.mouse.click(10, 10)
            page.wait_for_timeout(500)
        else:
            log("Could not find ratio dropdown button!")
        
        # --- Background Color Dropdown ---
        log("\n--- Step 4: Background Color Dropdown ---")
        all_buttons = page.locator("button, [role='button']").all()
        
        bg_btn = None
        for btn in all_buttons:
            try:
                text = btn.inner_text().strip()
                if ("背景色" in text or "背景" in text) and btn.is_visible():
                    bg_btn = btn
                    log(f"Found bg button: '{text}'")
                    break
            except:
                pass
        
        if bg_btn and bg_btn.is_visible():
            log("Clicking background color dropdown...")
            bg_btn.click()
            page.wait_for_timeout(1000)
            page.screenshot(path=os.path.join(OUTPUT_DIR, "04_bg_color_dropdown_opened.png"), full_page=False)
            log("BG color dropdown screenshot saved.")
            
            floating_panels = page.locator("[class*='popper'], [class*='popover'], [class*='dropdown'], [class*='select-drop'], [class*='popup'], [class*='panel'], [class*='options'], [class*='color'], [role='listbox'], [role='menu']").all()
            
            bg_results = []
            for i, panel in enumerate(floating_panels):
                if not panel.is_visible():
                    continue
                box = panel.bounding_box()
                if box is None:
                    continue
                
                panel_info = extract_element_info(panel, page, f"bg_panel_{i}")
                bg_results.append(panel_info)
                
                items = panel.locator("[class*='item'], [class*='option'], [class*='cell'], [class*='color'], [class*='swatch'], li, [role='option'], [role='menuitem']").all()
                for j, item in enumerate(items[:15]):
                    if item.is_visible():
                        item_text = item.inner_text().strip()[:40]
                        item_info = extract_element_info(item, page, f"bg_item_{j}: '{item_text}'")
                        bg_results.append(item_info)
            
            with open(os.path.join(OUTPUT_DIR, "bg_color_dropdown_styles.json"), "w", encoding="utf-8") as f:
                json.dump(bg_results, f, ensure_ascii=False, indent=2)
            log(f"Saved {len(bg_results)} bg elements to JSON")
        else:
            log("Could not find bg color dropdown button!")
        
        # --- Extract CSS Rules ---
        log("\n--- Step 5: Extracting CSS Rules ---")
        page.mouse.click(10, 10)
        page.wait_for_timeout(300)
        
        all_css_classes = page.evaluate("""() => {
            const allEls = document.querySelectorAll('*');
            const classes = new Set();
            for (const el of allEls) {
                if (el.classList) {
                    for (const c of el.classList) {
                        if (c.match(/select|drop|pop|menu|option|panel|trigger|popover|picker|tag|grid|card|tooltip/i)) {
                            classes.add(c);
                        }
                    }
                }
            }
            return Array.from(classes).sort();
        }""")
        log(f"Found {len(all_css_classes)} relevant CSS classes")
        for c in all_css_classes:
            log(f"  .{c}")
        
        css_rules = page.evaluate("""() => {
            const results = [];
            for (const sheet of document.styleSheets) {
                try {
                    for (const rule of sheet.cssRules) {
                        const sel = rule.selectorText || '';
                        if (sel.match(/select|drop|pop|menu|option|panel|trigger|popover|picker|tag-item|grid-item|card-item/i)) {
                            if (rule.cssText && rule.cssText.length < 2000) {
                                results.push(rule.cssText);
                            }
                        }
                    }
                } catch (e) {}
            }
            return results;
        }""")
        
        log(f"Found {len(css_rules)} CSS rules")
        with open(os.path.join(OUTPUT_DIR, "dropdown_css_rules.txt"), "w", encoding="utf-8") as f:
            f.write("=== Relevant CSS Classes ===\n")
            f.write("\n".join(f".{c}" for c in all_css_classes))
            f.write("\n\n=== CSS Rules ===\n\n")
            f.write("\n".join(css_rules))
        
        all_style_contents = page.evaluate("""() => {
            const styles = document.querySelectorAll('style');
            const results = [];
            for (const s of styles) {
                const text = s.textContent || '';
                if (text.match(/select|drop|pop|menu|option|panel|trigger|popover|picker|tag-item/i)) {
                    results.push(text.substring(0, 5000));
                }
            }
            return results;
        }""")
        
        with open(os.path.join(OUTPUT_DIR, "dropdown_style_tags.txt"), "w", encoding="utf-8") as f:
            for i, content in enumerate(all_style_contents):
                f.write(f"\n=== Style Block {i+1} ===\n")
                f.write(content)
                f.write("\n")
        
        log("All CSS data saved.")
        
    except Exception as e:
        log(f"ERROR: {e}")
        traceback.print_exc()
        try:
            page.screenshot(path=os.path.join(OUTPUT_DIR, "error_screenshot.png"))
        except:
            pass
    finally:
        browser.close()
    
    with open(os.path.join(OUTPUT_DIR, "extraction_log.txt"), "w", encoding="utf-8") as f:
        f.write("\n".join(log_lines))

log("Script finished.")
