"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowSquareOut,
  Briefcase,
  CaretDown,
  CaretRight,
  ChatCenteredText,
  CheckCircle,
  Coins,
  Copy,
  DownloadSimple,
  Drop,
  FrameCorners,
  Gift,
  Globe,
  HandCoins,
  Headset,
  Heart,
  ImageSquare,
  ImagesSquare,
  Info,
  Lightning,
  MagicWand,
  Palette,
  ShareNetwork,
  SidebarSimple,
  SignIn,
  SpinnerGap,
  Star,
  Trash,
  UserCircle,
  UserFocus,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import {
  backgroundScenes,
  backgroundToolConfig,
  prototypeConfig,
  scenes,
} from "./prototype-config";
import type {
  EventLog,
  PrototypeState,
  SourceStatus,
  Variant,
} from "./prototype-types";
import { NewUserBenefitToast } from "@/components/workspace/new-user-benefit-toast";
import "./prototype.css";

const states: { value: PrototypeState; label: string }[] = [
  { value: "guest-ready", label: "就绪" },
  { value: "login-open", label: "登录弹窗" },
  { value: "login-success", label: "登录完成" },
  { value: "submitting", label: "提交中" },
  { value: "generating", label: "生成中" },
  { value: "still-generating", label: "仍在生成" },
  { value: "success", label: "成功" },
  { value: "failed-refunded", label: "失败退款" },
  { value: "insufficient-balance", label: "余额不足" },
];
const validStates = new Set(states.map((item) => item.value));

const expansionSourceAspectRatio = 3 / 4;

function getExpansionPreviewStyle(ratio: string): CSSProperties {
  const [width, height] = ratio.split("x").map((value) => Number(value.trim()));
  const targetAspectRatio = width > 0 && height > 0 ? width / height : 1;
  const canvasWidth = targetAspectRatio >= 1 ? targetAspectRatio * 100 : 100;
  const canvasHeight = targetAspectRatio >= 1 ? 100 : 100 / targetAspectRatio;
  const sourceWidth = targetAspectRatio >= expansionSourceAspectRatio
    ? canvasHeight * expansionSourceAspectRatio
    : canvasWidth;
  const sourceHeight = targetAspectRatio >= expansionSourceAspectRatio
    ? canvasHeight
    : canvasWidth / expansionSourceAspectRatio;
  const sourceInsetTop = ((canvasHeight - sourceHeight) / canvasHeight) * 50;
  const sourceInsetRight = ((canvasWidth - sourceWidth) / canvasWidth) * 50;
  const sourceInsetBottom = sourceInsetTop;
  const sourceInsetLeft = sourceInsetRight;
  const isSquareCanvas = Math.abs(targetAspectRatio - 1) < 0.001;
  const hasExpansionDifference = !isSquareCanvas && Math.abs(targetAspectRatio - expansionSourceAspectRatio) >= 0.001;
  const initialClipTop = hasExpansionDifference ? sourceInsetTop : 0;
  const initialClipRight = hasExpansionDifference ? sourceInsetRight : 0;
  const initialClipBottom = hasExpansionDifference ? sourceInsetBottom : 0;
  const initialClipLeft = hasExpansionDifference ? sourceInsetLeft : 0;

  return {
    "--scene-expand-width": `${canvasWidth.toFixed(3)}%`,
    "--scene-expand-height": `${canvasHeight.toFixed(3)}%`,
    "--scene-expand-clip-top": `${initialClipTop.toFixed(3)}%`,
    "--scene-expand-clip-right": `${initialClipRight.toFixed(3)}%`,
    "--scene-expand-clip-bottom": `${initialClipBottom.toFixed(3)}%`,
    "--scene-expand-clip-left": `${initialClipLeft.toFixed(3)}%`,
    "--scene-source-inset-top": `${sourceInsetTop.toFixed(3)}%`,
    "--scene-source-inset-right": `${sourceInsetRight.toFixed(3)}%`,
    "--scene-source-inset-bottom": `${sourceInsetBottom.toFixed(3)}%`,
    "--scene-source-inset-left": `${sourceInsetLeft.toFixed(3)}%`,
    "--scene-seam-left-opacity": sourceInsetLeft > 0.001 ? "1" : "0",
    "--scene-seam-right-opacity": sourceInsetRight > 0.001 ? "1" : "0",
    "--scene-seam-top-opacity": sourceInsetTop > 0.001 ? "1" : "0",
    "--scene-seam-bottom-opacity": sourceInsetBottom > 0.001 ? "1" : "0",
    "--scene-guide-opacity": isSquareCanvas || hasExpansionDifference ? "1" : "0",
  } as CSSProperties;
}

function isStaticExpansionRatio(ratio: string): boolean {
  const [width, height] = ratio.split("x").map((value) => Number(value.trim()));
  const targetAspectRatio = width > 0 && height > 0 ? width / height : 1;
  return Math.abs(targetAspectRatio - 1) < 0.001 || Math.abs(targetAspectRatio - expansionSourceAspectRatio) < 0.001;
}

function isVerticalExpansionRatio(ratio: string): boolean {
  const [width, height] = ratio.split("x").map((value) => Number(value.trim()));
  return width > 0 && height > width;
}

const historyItems = [
  {
    name: "横图扩展",
    image: "/thumbnails/thumb-cat-window.jpg",
    size: "93.2KB",
    dimensions: "1920 x 1081",
    createdAt: "09-09 14:20",
  },
  {
    name: "竖图扩展",
    image: "/prototype-assets/chinaz-scene-02.jpg",
    size: "257.7KB",
    dimensions: "1080 x 1935",
    createdAt: "09-08 10:29",
  },
  {
    name: "Perluasan Imej Menegak",
    image: "/prototype-assets/chinaz-scene-05.jpg",
    size: "166.5KB",
    dimensions: "1080 x 1935",
    createdAt: "09-08 09:35",
  },
  {
    name: "Vertical Image Expansion",
    image: "/thumbnails/thumb-cat-window.jpg",
    size: "109.0KB",
    dimensions: "1080 x 1935",
    createdAt: "09-08 09:33",
  },
];

// Review-only fixtures for the task-reward chest. This is intentionally
// separate from the one-time new-user benefit shown after login.
const prototypeTaskRewards = [
  {
    rewardId: "prototype:first-chat",
    taskName: "首次使用AI聊天",
    points: 100,
    icon: "chat" as const,
  },
  {
    rewardId: "prototype:first-image",
    taskName: "首次使用AI图像",
    points: 200,
    icon: "image" as const,
  },
  {
    rewardId: "prototype:first-video",
    taskName: "首次使用AI文案生视频",
    points: 1000,
    icon: "video" as const,
  },
];

const cutoutPreviewImage = "/prototype-assets/cutouts/cat-subject.png";
const prototypeStartingPoints = 416359;

function emitPrototypeEvent(name: string, detail: Record<string, string | undefined>) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

function SelectControl<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <label className="tc-select">
      <span>{label}</span>
      <div>
        <select
          value={value}
          onChange={(event) => onChange(event.target.value as T)}
        >
          {options.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <CaretDown size={13} weight="bold" />
      </div>
    </label>
  );
}

const backgroundColorGroups = [
  {
    label: "基础色",
    options: [
      ["白色", "#ffffff"],
      ["浅灰", "#edf0f5"],
      ["深灰", "#687385"],
      ["黑色", "#1d2028"],
      ["米白", "#f4efe4"],
      ["米色", "#e8d8c2"],
    ],
  },
  {
    label: "冷色系",
    options: [
      ["浅蓝", "#c9dafa"],
      ["天蓝", "#8fc8f4"],
      ["深蓝", "#425fa7"],
      ["青绿色", "#4bb9ab"],
      ["薄荷绿", "#c6e9dd"],
      ["墨绿色", "#2d6d59"],
    ],
  },
  {
    label: "暖色系",
    options: [
      ["浅粉", "#f5d7e1"],
      ["玫瑰粉", "#e9a1bf"],
      ["红色", "#e85c5e"],
      ["橙色", "#e69b3f"],
      ["黄色", "#f0d255"],
      ["金色", "#d5aa55"],
    ],
  },
  {
    label: "高级色",
    options: [
      ["奶茶色", "#ceb895"],
      ["香槟色", "#ead9b5"],
      ["暖灰", "#bbb5ae"],
      ["咖色", "#9a6d4e"],
      ["蓝紫", "#6a57c7"],
      ["紫色", "#9a5bd4"],
    ],
  },
  {
    label: "节日色",
    options: [
      ["红金", "#c84a45"],
      ["黑金", "#302b26"],
      ["蓝银", "#759bc9"],
      ["粉紫", "#ce7fbb"],
      ["绿金", "#648c5b"],
      ["彩色", "linear-gradient(135deg,#ef6d6d 0 25%,#f0c85b 25% 50%,#6bc0a8 50% 75%,#7889da 75%)"],
    ],
  },
] as const;

function PanelSelectControl<T extends string>({
  label,
  value,
  onChange,
  options,
  colorGroups,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  colorGroups?: ReadonlyArray<{
    label: string;
    options: readonly (readonly [string, string])[];
  }>;
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    placement: "above" as "above" | "below",
  });
  const selectedLabel = options.find((option) => option.value === value)?.label ?? value;

  const repositionMenu = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const menuHeight = menuRef.current?.getBoundingClientRect().height
      ?? (colorGroups ? 360 : Math.min(options.length * 34 + 20, 360));
    const availableAbove = rect.top - 16;
    const availableBelow = window.innerHeight - rect.bottom - 16;
    const placement = availableAbove >= menuHeight || availableAbove >= availableBelow ? "above" : "below";
    setMenuPosition({
      left: rect.left,
      top: placement === "above"
        ? Math.max(16 + menuHeight, rect.top - 8)
        : rect.bottom + 8,
      width: rect.width,
      placement,
    });
  }, [colorGroups, options.length]);

  useEffect(() => {
    if (!open) return;
    repositionMenu();
    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("resize", repositionMenu);
    document.addEventListener("scroll", repositionMenu, true);
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("resize", repositionMenu);
      document.removeEventListener("scroll", repositionMenu, true);
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, repositionMenu]);

  const choose = (nextValue: T) => {
    onChange(nextValue);
    setOpen(false);
  };

  const menu = open && typeof document !== "undefined"
    ? createPortal(
        <div
          ref={menuRef}
          className={`tc-panel-select-menu ${colorGroups ? "is-color-menu" : ""} ${menuPosition.placement === "below" ? "is-below" : ""}`}
          role="listbox"
          aria-label={`选择${label}`}
          style={{
            left: menuPosition.left,
            top: menuPosition.top,
            width: menuPosition.width,
          }}
        >
          {colorGroups ? (
            <>
              <button
                className={`tc-panel-select-option tc-panel-select-recommended ${value === "自动推荐" ? "selected" : ""}`}
                type="button"
                role="option"
                aria-selected={value === "自动推荐"}
                onClick={() => choose("自动推荐" as T)}
              >
                自动推荐
              </button>
              {colorGroups.map((group) => (
                <div className="tc-panel-select-color-group" key={group.label}>
                  <span>{group.label}</span>
                  <div>
                    {group.options.map(([optionValue, color]) => (
                      <button
                        className={`tc-panel-color-option ${value === optionValue ? "selected" : ""}`}
                        key={optionValue}
                        type="button"
                        role="option"
                        aria-label={optionValue}
                        aria-selected={value === optionValue}
                        onClick={() => choose(optionValue as T)}
                      >
                        <i style={{ background: color }} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </>
          ) : (
            options.map((option) => (
              <button
                className={`tc-panel-select-option ${value === option.value ? "selected" : ""}`}
                key={option.value}
                type="button"
                role="option"
                aria-selected={value === option.value}
                onClick={() => choose(option.value)}
              >
                {option.label}
              </button>
            ))
          )}
        </div>,
        document.body,
      )
    : null;

  return (
    <div className={`tc-panel-select ${open ? "is-open" : ""}`}>
      <button
        ref={triggerRef}
        className="tc-panel-select-trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span>{label}</span>
        <strong>{selectedLabel}</strong>
        <CaretDown size={17} weight="regular" />
      </button>
      {menu}
    </div>
  );
}

export function ConversionPrototype() {
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();
  const stateParam = query.get("state") as PrototypeState;
  const initialToolKey = query.get("tool") === "background" ? "background" : "expand";
  const queryImage = query.get("image");
  const sourceImage = queryImage && /^\/(?:prototype-assets|thumbnails)\//.test(queryImage)
    ? queryImage
    : "/thumbnails/thumb-cat-window.jpg";
  const targetRatio = query.get("target_ratio");
  const initialSceneId = initialToolKey === "background"
    ? backgroundScenes[0].id
    : targetRatio === "16:9"
      ? "landscape"
      : targetRatio === "1:1"
        ? "square"
        : targetRatio === "9:16"
          ? "portrait"
          : scenes[0].id;
  const [state, setState] = useState<PrototypeState>(
    validStates.has(stateParam) ? stateParam : "guest-ready",
  );
  const [variant, setVariant] = useState<Variant>(
    query.get("variant") === "baseline" ? "baseline" : "optimized",
  );
  const [toolKey, setToolKey] = useState<"expand" | "background">(initialToolKey);
  const [source, setSource] = useState<SourceStatus>(
    query.get("variant") === "baseline" ? "empty" : "carried",
  );
  const [loggedIn, setLoggedIn] = useState(() =>
    [
      "login-success",
      "submitting",
      "generating",
      "still-generating",
      "success",
      "failed-refunded",
      "insufficient-balance",
    ].includes(stateParam),
  );
  const [sceneId, setSceneId] = useState(
    initialSceneId,
  );
  const [touchExpandedSceneId, setTouchExpandedSceneId] = useState<string | null>(null);
  const [showCompare, setShowCompare] = useState(true);
  const [autoCutout, setAutoCutout] = useState(false);
  const [chestEnabled, setChestEnabled] = useState(query.get("reward") === "task");
  const [backgroundColor, setBackgroundColor] = useState("自动推荐");
  const [backgroundRatio, setBackgroundRatio] = useState("接近原图");
  const [taskChestOpen, setTaskChestOpen] = useState(query.get("reward") === "task");
  const [taskChestCollapsed, setTaskChestCollapsed] = useState(false);
  const [displayPoints, setDisplayPoints] = useState(prototypeStartingPoints);
  const [rewardEntryPulsing, setRewardEntryPulsing] = useState(false);
  const [newUserOpen, setNewUserOpen] = useState(false);
  const [newUser, setNewUser] = useState(true);
  // Keep the prototype review console visible so login/guest and task states
  // can be switched directly from the upper-right control area.
  const [toolbarOpen, setToolbarOpen] = useState(true);
  const [sourceError, setSourceError] = useState(false);
  const [zoomScene, setZoomScene] = useState<string | null>(null);
  const [resultTab, setResultTab] = useState<"result" | "original">("result");
  const [toast, setToast] = useState("");
  const [, setLogs] = useState<EventLog[]>(() => [
    {
      name: "tool_landing_view",
      detail: `source=material · variant=${variant} · imageCarried=true`,
      time: new Date().toLocaleTimeString("zh-CN", { hour12: false }),
    },
  ]);
  const [intentId, setIntentId] = useState<string | null>(null);
  const consumedIntent = useRef<string | null>(null);
  const timerIds = useRef<ReturnType<typeof setTimeout>[]>([]);
  const rewardEntryFlashTimer = useRef<number | null>(null);
  const settledTaskRewardIds = useRef<Set<string>>(new Set());
  const resultRef = useRef<HTMLDivElement>(null);
  const uploadRef = useRef<HTMLButtonElement>(null);
  const activeConfig = toolKey === "background" ? backgroundToolConfig : prototypeConfig.tool;
  const activeScenes = toolKey === "background" ? backgroundScenes : scenes;
  const scene = activeScenes.find((item) => item.id === sceneId) ?? activeScenes[0];
  const zoomedScene = activeScenes.find((item) => item.id === zoomScene);
  const attributedTool = query.get("target_tool") || toolKey;
  const sourcePage = query.get("source_page") || undefined;
  const sourcePosition = query.get("source_position") || undefined;
  const sourceImageId = query.get("image_id") || undefined;
  const showFreeCutoutPreview =
    toolKey === "background" && source !== "empty" && autoCutout;

  const syncUrl = useCallback(
    (
      nextState: PrototypeState,
      nextVariant = variant,
      nextTool: "expand" | "background" = toolKey,
    ) => {
      const params = new URLSearchParams({
        variant: nextVariant,
        state: nextState,
        tool: nextTool,
      });
      ["target_tool", "source_page", "source_position", "image_id", "image", "target_ratio"].forEach((key) => {
        const value = query.get(key);
        if (value) params.set(key, value);
      });
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, query, router, toolKey, variant],
  );
  const log = useCallback(
    (name: string, detail: string) =>
      setLogs((prev) => [
        ...prev.slice(-7),
        {
          name,
          detail,
          time: new Date().toLocaleTimeString("zh-CN", { hour12: false }),
        },
      ]),
    [],
  );
  const clearTimers = useCallback(() => {
    timerIds.current.forEach(clearTimeout);
    timerIds.current = [];
  }, []);
  const clearRewardAnimations = useCallback(() => {
    if (rewardEntryFlashTimer.current !== null) {
      window.clearTimeout(rewardEntryFlashTimer.current);
      rewardEntryFlashTimer.current = null;
    }
    setRewardEntryPulsing(false);
  }, []);
  const changeState = useCallback(
    (next: PrototypeState) => {
      clearTimers();
      setState(next);
      syncUrl(next);
    },
    [clearTimers, syncUrl],
  );
  const switchTool = useCallback(
    (nextTool: "expand" | "background") => {
      if (nextTool === toolKey) return;
      clearTimers();
      const nextScenes = nextTool === "background" ? backgroundScenes : scenes;
      setToolKey(nextTool);
      setSceneId(nextScenes[0].id);
      setState("guest-ready");
      setSourceError(false);
      setIntentId(null);
      consumedIntent.current = null;
      setResultTab("result");
      setTaskChestOpen(false);
      setTaskChestCollapsed(false);
      setNewUserOpen(false);
      syncUrl("guest-ready", variant, nextTool);
      log("tool_switch", `tool=${nextTool}`);
    },
    [clearTimers, log, syncUrl, toolKey, variant],
  );

  useEffect(
    () => () => {
      clearTimers();
      clearRewardAnimations();
    },
    [clearRewardAnimations, clearTimers],
  );

  const settleTaskRewards = useCallback(() => {
    const pendingRewards = prototypeTaskRewards.filter(
      (reward) => !settledTaskRewardIds.current.has(reward.rewardId),
    );
    if (pendingRewards.length === 0) {
      setTaskChestOpen(false);
      setTaskChestCollapsed(true);
      return;
    }

    pendingRewards.forEach((reward) => settledTaskRewardIds.current.add(reward.rewardId));
    const rewardPoints = pendingRewards.reduce((total, reward) => total + reward.points, 0);
    const toPoints = displayPoints + rewardPoints;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    clearRewardAnimations();
    setDisplayPoints(toPoints);

    setRewardEntryPulsing(true);
    rewardEntryFlashTimer.current = window.setTimeout(
      () => {
        setRewardEntryPulsing(false);
        rewardEntryFlashTimer.current = null;
      },
      prefersReducedMotion ? 180 : 1000,
    );
    setTaskChestCollapsed(true);
    setTaskChestOpen(false);
  }, [clearRewardAnimations, displayPoints]);

  const finish = useCallback(
    (success: boolean) => {
      const next = success ? "success" : "failed-refunded";
      if (success) setResultTab("result");
      setState(next);
      syncUrl(next);
      log(
        "generation_result",
        `success=${success} · mockDuration=3s · refunded=${!success}`,
      );
      if (sourcePage === "material_detail") {
        emitPrototypeEvent("ai_tool_generate_result", {
          tool: attributedTool,
          image_id: sourceImageId,
          source_page: sourcePage,
          source_position: sourcePosition,
          target_ratio: targetRatio || undefined,
          result: success ? "success" : "fail",
        });
      }
      timerIds.current.push(
        setTimeout(
          () =>
            resultRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            }),
          80,
        ),
      );
      if (success && chestEnabled)
        timerIds.current.push(setTimeout(() => setTaskChestOpen(true), 450));
    },
    [attributedTool, chestEnabled, log, sourceImageId, sourcePage, sourcePosition, syncUrl, targetRatio],
  );
  const submit = useCallback(
    (id: string) => {
      if (consumedIntent.current === id) return;
      consumedIntent.current = id;
      setIntentId(id);
      setState("submitting");
      syncUrl("submitting");
      log("generation_auto_resume", `intentId=${id} · submitCount=1`);
      if (sourcePage === "material_detail") {
        emitPrototypeEvent("ai_tool_generate", {
          tool: attributedTool,
          image_id: sourceImageId,
          source_page: sourcePage,
          source_position: sourcePosition,
          target_ratio: targetRatio || undefined,
        });
      }
      timerIds.current.push(
        setTimeout(() => {
          setState("generating");
          syncUrl("generating");
          timerIds.current.push(
            setTimeout(
              () => finish(true),
              prototypeConfig.timings.generatingMs,
            ),
          );
        }, prototypeConfig.timings.submittingMs),
      );
    },
    [attributedTool, finish, log, sourceImageId, sourcePage, sourcePosition, syncUrl, targetRatio],
  );
  const generate = () => {
    if (source === "empty") {
      setSourceError(true);
      uploadRef.current?.focus();
      uploadRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    if (
      state === "submitting" ||
      state === "generating" ||
      state === "still-generating"
    )
      return;
    log(
      "generate_click",
      `loginStatus=${loggedIn} · sceneId=${sceneId} · imageStatus=${source}`,
    );
    const id = `${Date.now()}-${sceneId}`;
    if (!loggedIn) {
      setIntentId(id);
      setState("login-open");
      syncUrl("login-open");
      log("login_modal_view", "trigger=generate");
      return;
    }
    submit(id);
  };
  const loginSuccess = () => {
    setLoggedIn(true);
    setState("login-success");
    syncUrl("login-success");
    if (newUser) {
      setNewUser(false);
      setNewUserOpen(true);
    }
    const id = intentId;
    log("login_success", `trigger=generate · intentId=${id ?? "none"}`);
    if (id) timerIds.current.push(setTimeout(() => submit(id), 260));
  };
  const reset = () => {
    clearTimers();
    consumedIntent.current = null;
    setState("guest-ready");
    setLoggedIn(false);
    setSource("carried");
    setSourceError(false);
    setNewUser(true);
    setTaskChestOpen(false);
    setTaskChestCollapsed(false);
    setNewUserOpen(false);
    settledTaskRewardIds.current.clear();
    setDisplayPoints(prototypeStartingPoints);
    clearRewardAnimations();
    setLogs([]);
    setIntentId(null);
    syncUrl("guest-ready");
  };
  const copyLink = async () => {
    await navigator.clipboard?.writeText(window.location.href);
    setToast("当前状态链接已复制");
    setTimeout(() => setToast(""), 1800);
  };
  const busy = ["submitting", "generating", "still-generating"].includes(state);

  return (
    <main
      className={`tool-conversion-prototype ${variant === "baseline" ? "is-baseline" : ""}`}
    >
      <div className="tc-app-layout">
        <aside className="tc-sidebar">
          <div className="tc-sidebar-head">
            <div className="tc-brand">
              <span className="tc-brand-mark">
                <Lightning size={22} weight="fill" />
              </span>
              <span>
                <b>AI应用广场</b>
                <small>多模型 · 多工具 · 便宜好用</small>
              </span>
            </div>
            <button className="tc-sidebar-toggle" aria-label="收起左侧菜单">
              <SidebarSimple size={16} weight="regular" />
            </button>
          </div>
          <button className="tc-sidebar-back">
            <ArrowLeft size={16} weight="regular" />
            AI图像工具
          </button>
          <nav className="tc-sidebar-nav" aria-label="AI图像工具菜单">
            <button
              className={toolKey === "expand" ? "active" : ""}
              onClick={() => switchTool("expand")}
            >
              <FrameCorners size={21} weight="regular" />
              AI扩图
            </button>
            <button
              className={toolKey === "background" ? "active" : ""}
              onClick={() => switchTool("background")}
            >
              <ImagesSquare size={21} weight="regular" />
              AI换背景
            </button>
            <button>
              <UserFocus size={21} weight="regular" />
              AI写真
            </button>
            <button>
              <Drop size={21} weight="regular" />
              AI配色重绘
            </button>
            <button>
              <Palette size={21} weight="regular" />
              AI风格转换
            </button>
            <button>
              <Briefcase size={21} weight="regular" />
              AI商品海报
            </button>
          </nav>
          <div
            className={`tc-sidebar-bottom ${loggedIn ? "is-logged-in" : "is-guest"}`}
          >
            {loggedIn && (
              <>
                <div
                  className="tc-score"
                  aria-live="polite"
                >
                  <span>剩余智点</span>
                  <b>{displayPoints.toLocaleString("en-US")}</b>
                </div>
                <button>
                  <HandCoins size={18} weight="regular" />
                  充值智点
                </button>
                <button
                  className={`tc-invite ${rewardEntryPulsing ? "is-reward-target" : ""}`}
                  data-reward-entry
                  onClick={() => {
                    if (!taskChestCollapsed) return;
                    setTaskChestCollapsed(false);
                    setTaskChestOpen(true);
                    log("reward_chest_expand", "source=reward-entry");
                  }}
                >
                  <Gift size={20} weight="regular" />
                  <span>做任务赚智点</span>
                </button>
              </>
            )}
            <button
              className="tc-account"
              onClick={() => !loggedIn && changeState("login-open")}
            >
              {loggedIn ? (
                <UserCircle size={31} weight="regular" />
              ) : (
                <SignIn size={25} weight="regular" />
              )}
              <span>
                <b>{loggedIn ? "chinaz_5441292" : "立即登录"}</b>
                <small>{loggedIn ? "" : "请登录后继续"}</small>
              </span>
              {loggedIn ? (
                <CaretDown className="tc-chevron" size={17} weight="regular" />
              ) : (
                <CaretRight className="tc-chevron" size={18} weight="regular" />
              )}
            </button>
          </div>
        </aside>
        <div className="tc-main">
          <section className="tc-surface">
            <header className="tc-online-topbar">
              <div className="tc-online-title">
                {toolKey === "background" ? (
                  <ImagesSquare size={24} weight="regular" />
                ) : (
                  <FrameCorners size={24} weight="regular" />
                )}
                <span>{activeConfig.name.replace("AI", "AI ")}</span>
              </div>
              <div className="tc-online-actions">
                <button>
                  <Star size={17} />
                  收藏
                </button>
                <button>
                  <ShareNetwork size={17} />
                  分享
                </button>
              </div>
            </header>
            <section className="tc-lab">
              <section className="tc-hero">
                <div className="tc-hero-note">
                  <span>使用指南</span>
                  <p>{activeConfig.description}</p>
                  {loggedIn && <small>使用费用：{activeConfig.costPoints} 智点/次（约 0.49 元）</small>}
                </div>
                <div className="tc-hero-visual">
                  <Image
                    src={activeConfig.heroImage}
                    alt={`${activeConfig.name}示例`}
                    fill
                    sizes="720px"
                    priority
                  />
                </div>
              </section>
              <section className="tc-builder">
                <aside className="tc-control-panel">
                  <button
                    ref={uploadRef}
                    className={`tc-upload ${source !== "empty" ? "has-source" : ""} ${sourceError ? "error" : ""}`}
                    onClick={() => {
                      setSource("replaced");
                      setSourceError(false);
                    }}
                  >
                    <Image
                      src={sourceImage}
                      alt="带入的素材原图"
                      fill
                      sizes="460px"
                      priority
                      className={source === "empty" ? "tc-empty-image" : ""}
                    />
                    {source === "empty" && (
                      <div className="tc-upload-empty">
                        <ImageSquare size={30} />
                        <b>上传参考图片</b>
                        <small>支持 PNG、JPG、JPEG、WebP</small>
                        <small>单张图片不超过 10MB</small>
                      </div>
                    )}
                    {source !== "empty" && (
                      <>
                        <span className="tc-reupload">重新上传</span>
                      </>
                    )}
                  </button>
                  {sourceError && (
                    <p className="tc-field-error">
                      <WarningCircle size={16} weight="fill" />
                      请先上传图片
                    </p>
                  )}
                  <p className="tc-upload-notice">
                    <Info size={14} />
                    上传即表示您确认拥有图片及其中人物、商品、素材的合法授权，并承诺不用于违法违规用途。
                  </p>
                  <div className={`tc-settings ${toolKey === "background" ? "is-background-settings" : ""}`}>
                    <div className="tc-settings-title">生成设置</div>
                    {toolKey === "background" ? (
                      <>
                        <PanelSelectControl
                          label="背景色"
                          value={backgroundColor}
                          onChange={setBackgroundColor}
                          options={[
                            "自动推荐",
                            "白色",
                            "浅灰",
                            "深灰",
                            "黑色",
                            "米白",
                            "米色",
                            "浅蓝",
                            "天蓝",
                            "深蓝",
                            "青绿色",
                            "薄荷绿",
                            "墨绿色",
                            "浅粉",
                            "玫瑰粉",
                            "红色",
                            "橙色",
                            "黄色",
                            "金色",
                            "奶茶色",
                            "香槟色",
                            "暖灰",
                            "咖色",
                            "蓝紫",
                            "紫色",
                            "红金",
                            "黑金",
                            "蓝银",
                            "粉紫",
                            "绿金",
                            "彩色",
                          ].map((value) => ({ value, label: value }))}
                          colorGroups={backgroundColorGroups}
                        />
                        <PanelSelectControl
                          label="比例"
                          value={backgroundRatio}
                          onChange={setBackgroundRatio}
                          options={["接近原图", "1:1", "4:3", "3:4", "16:9", "9:16"].map((value) => ({
                            value,
                            label: value,
                          }))}
                        />
                        <PanelSelectControl
                          label="风格"
                          value={sceneId}
                          onChange={setSceneId}
                          options={backgroundScenes.map((item) => ({
                            value: item.id,
                            label: item.name,
                          }))}
                        />
                      </>
                    ) : (
                      <>
                        <div className="tc-setting-row">
                          <span>最终输出尺寸</span>
                          <b>1920 x 1080</b>
                        </div>
                        <button className="tc-style-row" type="button">
                          <span>风格</span>
                          <b>{scene.name}</b>
                          <CaretDown size={15} />
                        </button>
                      </>
                    )}
                  </div>
                  <div className="tc-action">
                    <button
                      className="tc-generate"
                      onClick={generate}
                      disabled={busy}
                    >
                      {busy ? (
                        <>
                          <SpinnerGap size={19} className="tc-spin" />{" "}
                          {state === "submitting" ? "提交中..." : "正在生成..."}
                        </>
                      ) : (
                        <>
                          <MagicWand size={19} weight="regular" />
                          {activeConfig.generateLabel}
                        </>
                      )}
                    </button>
                    {!loggedIn && (
                      <div className="tc-guest-note">新用户可免费体验</div>
                    )}
                    {loggedIn && (
                      <div className="tc-cost-after-login">
                        <p className="tc-online-cost">
                          490 智点/次（约 0.49 元）
                        </p>
                      </div>
                    )}
                  </div>
                </aside>
                <div className={`tc-gallery ${toolKey === "background" ? "is-background-gallery" : ""}`}>
                  <div className="tc-section-head">
                    <div>
                      <b>选择想生成的效果</b>
                      <span>
                        {variant === "optimized" && toolKey === "background"
                          ? "选择背景后即时合成预览，无需生成"
                          : variant === "optimized"
                            ? "选择一种画面氛围，预览扩图效果"
                            : ""}
                      </span>
                    </div>
                  </div>
                  <div className="tc-scene-grid">
                    {activeScenes.map((item) => (
                      <article
                        key={item.id}
                        className={`tc-scene ${sceneId === item.id ? "selected" : ""}`}
                        onClick={() => {
                          setSceneId(item.id);
                          if (item.interaction === "expand" && window.matchMedia("(hover: none)").matches) {
                            setTouchExpandedSceneId((current) => (current === item.id ? null : item.id));
                          }
                          log(
                            "scene_card_click",
                            `tool=${toolKey} · sceneId=${item.id} · position=${activeScenes.indexOf(item) + 1} · variant=${variant}`,
                          );
                        }}
                      >
                        <button
                          className="tc-scene-preview"
                          aria-label={`查看${item.name}大图`}
                          title="查看大图"
                          onClick={(event) => {
                            event.stopPropagation();
                            setZoomScene(item.id);
                          }}
                        >
                          <FrameCorners size={17} weight="regular" />
                        </button>
                        <span
                          className={`tc-scene-visual ${showFreeCutoutPreview ? "has-free-composite" : ""} ${item.hoverImage ? "has-hover-preview" : ""} ${item.interaction === "expand" ? "has-expand-preview" : ""} ${item.interaction === "expand" && isStaticExpansionRatio(item.ratio) ? "is-static-expansion" : ""} ${item.interaction === "expand" && isVerticalExpansionRatio(item.ratio) ? "is-vertical-expansion" : ""} ${touchExpandedSceneId === item.id ? "is-touch-expanded" : ""} ${item.composite && showFreeCutoutPreview ? "has-sea-composite" : ""}`}
                          style={item.interaction === "expand" ? getExpansionPreviewStyle(item.ratio) : undefined}
                        >
                          {item.composite && showFreeCutoutPreview ? (
                            <>
                              <Image
                                src={item.composite.effectBackground}
                                alt={`${item.name}效果背景`}
                                fill
                                sizes="(max-width: 960px) 50vw, 250px"
                                className="tc-sea-background tc-sea-effect-background"
                              />
                              <Image
                                src={item.composite.originalBackground}
                                alt={`${item.name}原图背景`}
                                fill
                                sizes="(max-width: 960px) 50vw, 250px"
                                className="tc-sea-background tc-sea-original-background"
                              />
                              <Image
                                src={autoCutout ? item.composite.demoSubject ?? item.composite.subject : item.composite.subject}
                                alt={autoCutout ? "自动抠图演示主体" : "海边度假主体"}
                                fill
                                sizes="(max-width: 960px) 45vw, 220px"
                                className="tc-sea-subject"
                              />
                            </>
                          ) : item.composite ? (
                            <>
                              <Image
                                src={item.previewImage ?? item.image}
                                alt={item.name}
                                fill
                                sizes="(max-width: 960px) 50vw, 250px"
                                className="tc-scene-background tc-scene-result-base"
                              />
                              <Image
                                src={item.composite.subject}
                                alt={`${item.name}原图`}
                                fill
                                sizes="(max-width: 960px) 50vw, 250px"
                                className="tc-scene-hover-original"
                              />
                              <Image
                                src={item.previewImage ?? item.image}
                                alt={`${item.name}效果图`}
                                fill
                                sizes="(max-width: 960px) 50vw, 250px"
                                className="tc-scene-hover-result"
                              />
                            </>
                          ) : item.interaction === "expand" ? (
                            <>
                              <Image
                                src={item.previewImage ?? item.image}
                                alt={item.name}
                                fill
                                sizes="(max-width: 960px) 50vw, 250px"
                                className="tc-scene-expand-canvas"
                              />
                              <span className="tc-scene-expand-guides" aria-hidden="true">
                                <i className="tc-scene-expand-zone tc-scene-expand-zone-left" />
                                <i className="tc-scene-expand-zone tc-scene-expand-zone-right" />
                                <i className="tc-scene-expand-zone tc-scene-expand-zone-top" />
                                <i className="tc-scene-expand-zone tc-scene-expand-zone-bottom" />
                                <i className="tc-scene-expand-seam tc-scene-expand-seam-left" />
                                <i className="tc-scene-expand-seam tc-scene-expand-seam-right" />
                                <i className="tc-scene-expand-seam tc-scene-expand-seam-top" />
                                <i className="tc-scene-expand-seam tc-scene-expand-seam-bottom" />
                              </span>
                            </>
                          ) : (
                            <>
                              <Image
                                src={item.previewImage ?? item.image}
                                alt={item.name}
                                fill
                                sizes="(max-width: 960px) 50vw, 250px"
                                className={`tc-scene-background ${item.hoverImage ? "tc-scene-result-base" : ""}`}
                              />
                              {item.hoverImage && (
                                <>
                                  <Image
                                    src={item.hoverImage}
                                    alt={`${item.name}原图`}
                                    fill
                                    sizes="(max-width: 960px) 50vw, 250px"
                                    className="tc-scene-hover-original"
                                  />
                                  <Image
                                    src={item.previewImage ?? item.image}
                                    alt={`${item.name}效果图`}
                                    fill
                                    sizes="(max-width: 960px) 50vw, 250px"
                                    className="tc-scene-hover-result"
                                  />
                                </>
                              )}
                              {showFreeCutoutPreview && (
                                <Image
                                  src={cutoutPreviewImage}
                                  alt="已抠出的上传主体"
                                  fill
                                  sizes="(max-width: 960px) 45vw, 220px"
                                  className="tc-cutout-subject"
                                />
                              )}
                            </>
                          )}
                        </span>
                        <div>
                          <b>{item.name}</b>
                          {item.ratio && (
                            <span>
                              {item.ratio === "16:9" ? "1920 x 1080" : item.ratio}
                            </span>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </section>
              <section className="tc-status" ref={resultRef}>
                {busy && (
                  <div className="tc-result tc-result-loading">
                    <div className="tc-result-title">
                      <h2>生成结果</h2>
                    </div>
                    <div className="tc-result-layout tc-loading-layout">
                      <div className="tc-result-visual">
                        <div className="tc-loading-result">
                          <div className="tc-loading-scan" />
                          <div className="tc-loading-copy">
                            <SpinnerGap size={30} className="tc-spin" />
                            <h3>AI正在生成图片...</h3>
                            <p>生成通常需要10~30秒，请勿关闭页面</p>
                          </div>
                        </div>
                      </div>
                      <aside
                        className="tc-result-meta tc-loading-meta"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                )}
                {state === "failed-refunded" && (
                  <div className="tc-result tc-failed-result">
                    <div className="tc-result-title">
                      <h2>生成结果</h2>
                    </div>
                    <div className="tc-failed-result-content">
                      <WarningCircle size={48} weight="regular" />
                      <p>
                        <strong>图片生成失败</strong>
                        <span>模型服务繁忙，本次消耗智点已返还。请稍后重试。</span>
                      </p>
                    </div>
                  </div>
                )}
                {state === "success" && (
                  <div className="tc-result">
                    <div className="tc-result-title">
                      <h2>生成结果</h2>
                    </div>
                    <div className="tc-result-layout">
                      <div className="tc-result-visual">
                        <div className="tc-single-result">
                          {toolKey === "background" && resultTab === "result" ? (
                            <>
                              <Image
                                src={scene.result}
                                alt={`${scene.name}背景`}
                                fill
                                sizes="1000px"
                                className="tc-result-background"
                              />
                              <Image
                                src={cutoutPreviewImage}
                                alt="已适配背景的上传主体"
                                fill
                                sizes="760px"
                                className="tc-result-cutout-subject"
                              />
                            </>
                          ) : (
                            <Image
                              src={resultTab === "original" ? sourceImage : scene.result}
                              alt={resultTab === "original" ? "生成前原图" : "生成结果"}
                              fill
                              sizes="1000px"
                            />
                          )}
                          {variant === "optimized" && showCompare && (
                            <div className="tc-result-tabs" role="tablist" aria-label="结果查看方式">
                              <button
                                type="button"
                                role="tab"
                                aria-selected={resultTab === "result"}
                                className={resultTab === "result" ? "active" : ""}
                                onClick={() => setResultTab("result")}
                              >
                                生成效果
                              </button>
                              <button
                                type="button"
                                role="tab"
                                aria-selected={resultTab === "original"}
                                className={resultTab === "original" ? "active" : ""}
                                onClick={() => setResultTab("original")}
                              >
                                查看原图
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="tc-result-note">
                          <Info size={13} />
                          当前为带水印预览图，下载后可获取原图。右下角“AI生成”为合规标识，将随原图保留。
                        </p>
                      </div>
                      <aside className="tc-result-meta">
                        <h3>生成成功！</h3>
                        <p>AI生成内容，仅供参考，请勿用于违法违规用途。</p>
                        <div className="tc-result-facts">
                          <span>
                            <em>风格</em>
                            {scene.name}
                          </span>
                          <span>
                            <em>尺寸</em>1920 x 1072
                          </span>
                          <span>
                            <em>大小</em>83.0KB
                          </span>
                          <span>
                            <em>格式</em>JPG
                          </span>
                        </div>
                        <button>
                          <DownloadSimple size={17} />
                          下载图片
                        </button>
                      </aside>
                    </div>
                  </div>
                )}
              </section>
              {loggedIn && (
                <section className="tc-history">
                  <div className="tc-history-head">
                    <h2>生成历史</h2>
                    <p>
                      历史记录将为您保留 3
                      天。为避免过期丢失，请及时下载到本地设备。
                    </p>
                  </div>
                  <div className="tc-history-list">
                    {historyItems.map((item) => (
                      <div
                        className="tc-history-row"
                        key={`${item.name}-${item.createdAt}`}
                      >
                        <Image
                          src={item.image}
                          alt="生成历史缩略图"
                          width={76}
                          height={58}
                        />
                        <strong>{item.name}</strong>
                        <span>
                          <em>尺寸</em>
                          {item.dimensions}
                        </span>
                        <span>
                          <em>大小</em>
                          {item.size}
                        </span>
                        <span>
                          <em>创建时间</em>
                          {item.createdAt}
                        </span>
                        <button>
                          <DownloadSimple size={14} />
                          下载图片
                        </button>
                        <button className="tc-history-delete">
                          <Trash size={13} />
                          删除
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </section>
          </section>
        </div>
      </div>
      {toolbarOpen ? (
        <aside className="tc-toolbar">
          <div className="tc-toolbar-head">
            <b>原型评审控制台</b>
            <button onClick={() => setToolbarOpen(false)}>收起</button>
          </div>
          <button
            className="tc-landing-entry"
            onClick={() => router.push("/prototypes/material-detail?source=26091424322")}
          >
            <ArrowSquareOut size={14} />
            打开引流页
          </button>
          <SelectControl
            label="页面版本"
            value={variant}
            onChange={(next) => {
              setVariant(next);
              syncUrl(state, next);
            }}
            options={[
              { value: "baseline", label: "线上基准版" },
              { value: "optimized", label: "本次优化版" },
            ]}
          />
          <SelectControl
            label="用户状态"
            value={loggedIn ? "logged" : "guest"}
            onChange={(next) => setLoggedIn(next === "logged")}
            options={[
              { value: "guest", label: "未登录" },
              { value: "logged", label: "已登录" },
            ]}
          />
          <SelectControl
            label="任务状态"
            value={state}
            onChange={changeState}
            options={states}
          />
          <SelectControl
            label="源图状态"
            value={source}
            onChange={(next) => {
              setSource(next);
              setSourceError(false);
            }}
            options={[
              { value: "carried", label: "素材站已带入" },
              { value: "empty", label: "未上传" },
              { value: "replaced", label: "用户替换" },
            ]}
          />
          <div className="tc-switches">
            {[
              [showCompare, setShowCompare, "展示前后对比"],
              [autoCutout, setAutoCutout, "演示自动抠图"],
              [chestEnabled, setChestEnabled, "展示宝箱奖励"],
            ].map(([enabled, setEnabled, label]) => (
              <label key={String(label)}>
                <input
                  type="checkbox"
                  checked={Boolean(enabled)}
                  onChange={(event) => {
                    const checked = event.target.checked;
                    (setEnabled as (value: boolean) => void)(checked);
                    if (label === "演示自动抠图") {
                      log("cutout_demo_toggle", `enabled=${checked}`);
                      setToast(checked ? "已启用自动抠图演示" : "已关闭自动抠图演示");
                      timerIds.current.push(setTimeout(() => setToast(""), 1800));
                    }
                    if (label === "展示宝箱奖励") {
                      setTaskChestOpen(checked);
                      setTaskChestCollapsed(false);
                      log("reward_chest_toggle", `enabled=${checked}`);
                    }
                  }}
                />
                <span>{String(label)}</span>
              </label>
            ))}
          </div>
          <div className="tc-toolbar-actions">
            <button onClick={loginSuccess}>模拟登录成功</button>
            <button onClick={() => finish(true)}>模拟生成成功</button>
            <button onClick={() => finish(false)}>模拟生成失败</button>
            <button className="secondary" onClick={reset}>
              恢复初始状态
            </button>
          </div>
          <button className="tc-copy" onClick={copyLink}>
            <Copy size={15} />
            复制当前状态链接
          </button>
        </aside>
      ) : (
        <button
          className="tc-toolbar-reopen"
          onClick={() => setToolbarOpen(true)}
        >
          评审控制台
        </button>
      )}
      {toast && (
        <div className="tc-toast">
          <CheckCircle size={17} weight="fill" />
          {toast}
        </div>
      )}
      {state === "login-open" && (
        <div
          className="tc-modal-backdrop"
          onMouseDown={() => changeState("guest-ready")}
        >
          <section
            className="tc-login"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="tc-login-close"
              aria-label="关闭登录弹窗"
              onClick={() => changeState("guest-ready")}
            >
              <X size={20} />
            </button>
            <div className="tc-login-icon">
              <UserCircle size={34} weight="fill" />
            </div>
            <h2>手机验证码登录注册</h2>
            <div className="tc-phone">
              <span>+86</span>
              <span>请输入手机号</span>
            </div>
            <div className="tc-code">
              <span>请输入验证码</span>
              <b>获取验证码</b>
            </div>
            <button className="tc-login-submit" onClick={loginSuccess}>
              登 录
            </button>
            <button className="tc-login-test" onClick={loginSuccess}>
              模拟登录成功
            </button>
            <small>登录即代表同意《隐私政策》和《服务协议》</small>
          </section>
        </div>
      )}
      {state === "insufficient-balance" && (
        <div className="tc-modal-backdrop">
          <section className="tc-decision">
            <WarningCircle size={38} weight="fill" />
            <h2>智点余额不足</h2>
            <p>本次生成需要 490 智点，可先充值或完成任务赚取智点，再继续创作。</p>
            <div>
              <button
                onClick={() => {
                  setTaskChestOpen(true);
                  changeState("guest-ready");
                }}
              >
                去赚智点
              </button>
              <button onClick={() => changeState("guest-ready")}>
                去充值
              </button>
            </div>
          </section>
        </div>
      )}
      {zoomScene && (
        <div
          className="tc-modal-backdrop tc-zoom-backdrop"
          onMouseDown={() => setZoomScene(null)}
        >
          <section
            className="tc-zoom"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button aria-label="关闭大图" onClick={() => setZoomScene(null)}>
              <X size={22} />
            </button>
            <Image
              src={zoomedScene?.previewImage ?? zoomedScene?.result ?? zoomedScene?.image ?? ""}
              alt="场景案例大图"
              fill
              sizes="80vw"
            />
          </section>
        </div>
      )}
      {newUserOpen && (
        <div
          className="tc-reward-backdrop"
          onMouseDown={() => setNewUserOpen(false)}
        >
          <section
            className="tc-reward-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tc-new-user-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="tc-reward-art" aria-hidden="true">
              <Heart className="tc-reward-heart" size={96} weight="fill" />
              <Gift className="tc-reward-gift" size={52} weight="fill" />
              <span className="tc-reward-spark tc-reward-spark-one" />
              <span className="tc-reward-spark tc-reward-spark-two" />
              <span className="tc-reward-orbit tc-reward-orbit-one" />
              <span className="tc-reward-orbit tc-reward-orbit-two" />
            </div>
            <h2 id="tc-new-user-title">新人福利已到账</h2>
            <p>送您500智点，AI聊天、做图、做视频都能用，赶紧试一试~</p>
            <div className="tc-reward-amount">
              <Coins size={42} weight="duotone" aria-hidden="true" />
              <strong>
                500 <span>智点</span>
              </strong>
            </div>
            <button
              className="tc-reward-confirm"
              type="button"
              onClick={() => setNewUserOpen(false)}
            >
              开心收下
            </button>
          </section>
        </div>
      )}
      <NewUserBenefitToast
        open={taskChestOpen}
        rewards={prototypeTaskRewards}
        targetSelector="[data-reward-entry]"
        animateFromTarget
        onClose={settleTaskRewards}
      />
      <div className="tc-floating-actions" aria-label="辅助操作">
        <button aria-label="联系客服">
          <Headset size={22} weight="regular" />
        </button>
        <button aria-label="意见反馈">
          <ChatCenteredText size={22} weight="regular" />
        </button>
        <button aria-label="切换语言">
          <Globe size={22} weight="regular" />
        </button>
        <button aria-label="收起辅助操作">
          <CaretRight size={22} weight="regular" />
        </button>
      </div>
    </main>
  );
}
