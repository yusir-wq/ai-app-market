'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  Briefcase,
  Check,
  DownloadSimple,
  DotsThreeOutline,
  ImagesSquare,
  List,
  MagicWand,
  MagnifyingGlass,
  Note,
  Palette,
  ShareNetwork,
  Star,
  UserFocus,
  X,
} from '@phosphor-icons/react'
import './material-detail.css'

const mainImage = '/prototype-assets/material-detail/main.png'

const categoryItems = [
  ['图片', 'x2.png'],
  ['字体', 'x3.png'],
  ['PPT', 'x4.png'],
  ['简历', 'x5.png'],
  ['音效', 'x7.png'],
  ['PSD', 'x8.png'],
  ['矢量', 'x9.png'],
  ['Flash', 'x10.png'],
  ['脚本', 'x11.png'],
  ['网页模板', 'x12.png'],
  ['3D建模', 'x15.png'],
]

const hotRows = [
  ['国外服务器', '可视化数据分析', '个人写真', '下载音乐', '私人服务器', '外服服务器', '漂亮的照片', '扑克游戏', '欧美服务器', '个人艺术照'],
  ['西瓜影视', '大鱼吃小鱼游戏', '私人家庭影院', '双人游戏', '高清电影库', '贵州六日游', '双人小游戏', '医用呼叫器', '艺考要花多少钱', '实木家具'],
  ['办公室', '数据分析平台', '电影院网站', '今日黄金价格', '海外留学', '国外服务器', '可视化数据分析', '个人写真', '下载音乐', '小型中医宝座机'],
]

const hotRank: Array<[string, boolean]> = [
  ['欧美背景素材', true],
  ['个人艺术照', false],
  ['免费素材', false],
  ['免费着片', false],
  ['五子棋在线玩', false],
  ['实木家具', false],
  ['文字模板', false],
  ['小型中医宝座机', false],
]

const relatedImages = [
  ['related-01.png', '白色T恤背带裤美女摄影图片'],
  ['related-02.png', '白色肚脐装T恤美女树林写真图片'],
  ['related-03.png', '白色T恤美女墙角自拍图片'],
  ['related-04.png', '蓝白条纹长T恤美女写真摄影图片'],
  ['related-05.jpg', '欧美戴眼镜灰色创意T恤美女图片'],
  ['related-06.jpg', '白色T恤背带裤美女写真摄影图片'],
  ['related-07.jpg', '欧美戴墨镜白色T恤美女图片'],
  ['related-08.jpg', '坐在地上的白色T恤美女图片'],
  ['related-09.jpg', '亚洲清纯白色T恤美女写真图片'],
  ['related-10.jpg', '欧美白色T恤微笑美女写真图片'],
]

const collectionTags = ['美女', '白色', '站在', 't恤', '绿植', 'T恤美女', '白色t恤', '美女图']
const relatedTags = ['白色T恤美女', 'T恤美女']

type AiTool = 'expand' | 'background' | 'portrait' | 'style' | 'poster' | 'palette'
type AiPosition = 'top_toolbar' | 'right_card' | 'download_success'
type AiRatio = '16:9' | '1:1' | '9:16'

type AiToolbarTool = { tool: AiTool | 'more'; name: string; description: string }

const aiToolbarPrimaryTools: AiToolbarTool[] = [
  { tool: 'expand', name: 'AI扩图', description: '扩展画面，不裁剪主体' },
  { tool: 'background', name: 'AI换背景', description: '一键更换图片场景' },
  { tool: 'portrait', name: 'AI写真', description: '生成不同写真效果' },
  { tool: 'style', name: '换个风格', description: '快速转换图片风格' },
]

const aiToolbarExpandedTools: AiToolbarTool[] = [
  ...aiToolbarPrimaryTools,
  { tool: 'poster', name: '商品海报', description: '一键生成营销海报' },
  { tool: 'palette', name: '换配色', description: '重新搭配图片色彩' },
]

const aiToolbarMoreTool: AiToolbarTool = { tool: 'more', name: '更多', description: '查看更多 AI 工具' }

const aiRatioOptions: Array<{ value: AiRatio; label: string }> = [
  { value: '16:9', label: '16:9 横图' },
  { value: '1:1', label: '1:1 方图' },
  { value: '9:16', label: '9:16 竖图' },
]

function AiToolIcon({ tool }: { tool: AiTool | 'more' }) {
  if (tool === 'expand') return <MagicWand size={21} weight="regular" />
  if (tool === 'background') return <ImagesSquare size={21} weight="regular" />
  if (tool === 'portrait') return <UserFocus size={21} weight="regular" />
  if (tool === 'style' || tool === 'palette') return <Palette size={21} weight="regular" />
  if (tool === 'poster') return <Briefcase size={21} weight="regular" />
  return <DotsThreeOutline size={21} weight="regular" />
}

function emitAiEvent(name: string, detail: Record<string, string | undefined>) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(name, { detail }))
}

export function MaterialDetailPrototype() {
  const router = useRouter()
  const [imageId] = useState(() => {
    if (typeof window === 'undefined') return '26091424322'
    return new URLSearchParams(window.location.search).get('source') || '26091424322'
  })
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState<'small' | 'large'>('large')
  const [searchText, setSearchText] = useState('')
  const [notice, setNotice] = useState('')
  const [loginOpen, setLoginOpen] = useState(false)
  const [moreToolsOpen, setMoreToolsOpen] = useState(false)
  const [selectedAiRatio, setSelectedAiRatio] = useState<AiRatio | null>(null)
  const [downloadSucceeded, setDownloadSucceeded] = useState(false)
  const [downloadRecommendationDismissed, setDownloadRecommendationDismissed] = useState(false)
  const noticeTimer = useRef<number | null>(null)
  const toolbarRef = useRef<HTMLElement>(null)
  const rightRecommendationRef = useRef<HTMLElement>(null)
  const downloadRecommendationRef = useRef<HTMLElement>(null)
  const exposureSeenRef = useRef<Set<AiPosition>>(new Set())
  const selectedAiRatioLabel = selectedAiRatio
    ? aiRatioOptions.find((option) => option.value === selectedAiRatio)?.label || selectedAiRatio
    : ''

  useEffect(() => () => {
    if (noticeTimer.current !== null) window.clearTimeout(noticeTimer.current)
  }, [])

  useEffect(() => {
    const targets: Array<{ position: AiPosition; node: HTMLElement | null }> = [
      { position: 'top_toolbar', node: toolbarRef.current },
      { position: 'right_card', node: rightRecommendationRef.current },
      { position: 'download_success', node: downloadRecommendationRef.current },
    ]
    const report = (position: AiPosition) => {
      if (exposureSeenRef.current.has(position)) return
      exposureSeenRef.current.add(position)
      emitAiEvent('ai_tool_exposure', { position, image_id: imageId })
    }
    if (!('IntersectionObserver' in window)) {
      targets.forEach(({ position, node }) => node && report(position))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const position = (entry.target as HTMLElement).dataset.aiPosition as AiPosition
        if (position) report(position)
      }),
      { threshold: 0.25 },
    )
    targets.forEach(({ position, node }) => {
      if (!node) return
      node.dataset.aiPosition = position
      observer.observe(node)
    })
    return () => observer.disconnect()
  }, [downloadSucceeded, downloadRecommendationDismissed, imageId])

  const showNotice = (message: string) => {
    setNotice(message)
    if (noticeTimer.current !== null) window.clearTimeout(noticeTimer.current)
    noticeTimer.current = window.setTimeout(() => {
      setNotice('')
      noticeTimer.current = null
    }, 2200)
  }

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    showNotice(searchText.trim() ? `正在搜索：${searchText.trim()}` : '请输入想搜索的素材')
  }

  const navigateToAiTool = (tool: AiTool, position: AiPosition, targetRatio?: AiRatio) => {
    emitAiEvent('ai_tool_click', {
      tool,
      position,
      image_id: imageId,
      target_ratio: targetRatio,
    })
    const params = new URLSearchParams({
      variant: 'optimized',
      state: 'guest-ready',
      tool: tool === 'background' ? 'background' : 'expand',
      target_tool: tool,
      source_page: 'material_detail',
      source_position: position,
      image_id: imageId,
      image: mainImage,
    })
    if (targetRatio) params.set('target_ratio', targetRatio)
    router.push(`/prototypes/tool-conversion?${params.toString()}`)
  }

  const handleDownload = () => {
    const downloadSize = selectedSize === 'large' ? '864x1102' : '650x829'
    emitAiEvent('image_download', {
      image_id: imageId,
      download_size: downloadSize,
      result: 'success',
    })
    setDownloadSucceeded(true)
    showNotice(`已准备 ${downloadSize} PNG 下载`)
  }

  return (
    <main className="material-detail-prototype">
      <header className="md-header">
        <div className="md-container md-header-inner">
          <a className="md-logo" href="#top" aria-label="站长素材首页">
            <img src="/prototype-assets/material-detail/logo.png" alt="站长素材" />
          </a>
          <div className="md-category-wrap">
            <button
              type="button"
              className={`md-category-toggle ${categoryOpen ? 'is-open' : ''}`}
              onClick={() => setCategoryOpen((open) => !open)}
            >
              <span>分类</span>
              <List size={25} weight="regular" />
            </button>
            {categoryOpen && (
              <div className="md-category-menu">
                {categoryItems.map(([label, icon]) => (
                  <a key={label} href={`#${label}`} onClick={() => setCategoryOpen(false)}>
                    <img src={`/prototype-assets/material-detail/${icon}`} alt="" />
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>
          <form className="md-search" onSubmit={submitSearch}>
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="搜索您想要的素材"
              aria-label="搜索素材"
            />
            <button type="submit" aria-label="搜索">
              <MagnifyingGlass size={22} weight="regular" />
            </button>
          </form>
          <nav className="md-ai-nav" aria-label="站点导航">
            <a href="#ai-tools">AI应用</a>
            <a href="#ai-tutorial">AI教程</a>
          </nav>
          <div className="md-header-actions">
            <button type="button" className="md-favorite" onClick={() => showNotice('请按 Ctrl+D 收藏本站')}>
              <Star size={21} weight="regular" />
              收藏本站
            </button>
            <button type="button" className="md-login" onClick={() => setLoginOpen(true)}>登录</button>
          </div>
        </div>
      </header>

      <div id="top" className="md-page">
        <section className="md-hot-strip" aria-label="热门素材">
          <div className="md-container md-hot-inner">
            <div className="md-hot-grid">
              {hotRows.flatMap((row, rowIndex) => row.map((item, index) => (
                <a key={`${rowIndex}-${item}`} href={`#${item}`} className={rowIndex === 0 && index < 3 ? 'is-emphasis' : ''}>
                  {item}
                </a>
              )))}
            </div>
            <div className="md-hot-rank">
              {hotRank.map(([item, active], index) => (
                <a key={item} href={`#${item}`} className={active ? 'is-active' : ''}>
                  <b>{index + 1}</b>
                  <span>{item}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <div className="md-container md-content">
          <nav className="md-breadcrumb" aria-label="面包屑">
            <span>当前位置：</span>
            <a href="#site">站长素材</a><ArrowRight size={12} />
            <a href="#images">图片</a><ArrowRight size={12} />
            <a href="#people">人物图片</a><ArrowRight size={12} />
            <a href="#beauty">美女图片</a><ArrowRight size={12} />
            <b>站在绿植墙前的白色T恤美女图片</b>
          </nav>

          <div className="md-detail-grid">
            <section className="md-main-card">
              <div className="md-main-head">
                <h1>站在绿植墙前的白色T恤美女图片</h1>
                <button type="button" className="md-share" onClick={() => showNotice('分享链接已复制')}>
                  <ShareNetwork size={18} weight="regular" />
                  一键分享
                </button>
              </div>
              <section className="md-ai-toolbar" ref={toolbarRef} aria-labelledby="md-ai-toolbar-title">
                <h2 id="md-ai-toolbar-title">用 AI 继续创作</h2>
                <div className="md-ai-tool-grid">
                  {(moreToolsOpen ? aiToolbarExpandedTools : [...aiToolbarPrimaryTools, aiToolbarMoreTool]).map((item) => (
                    <button
                      key={item.tool}
                      type="button"
                      className={`md-ai-tool ${item.tool === 'more' && moreToolsOpen ? 'is-active' : ''}`}
                      onClick={() => item.tool === 'more'
                        ? setMoreToolsOpen((open) => !open)
                        : navigateToAiTool(item.tool as AiTool, 'top_toolbar')}
                      aria-expanded={item.tool === 'more' ? moreToolsOpen : undefined}
                      aria-label={`${item.name}：${item.description}`}
                    >
                      <AiToolIcon tool={item.tool} />
                      <span className="md-ai-tool-name">{item.name}</span>
                      <small className="md-ai-tool-tooltip" role="tooltip">{item.description}</small>
                    </button>
                  ))}
                </div>
              </section>
              <div className="md-image-box">
                <img src={mainImage} alt="站在绿植墙前的白色T恤美女图片" />
              </div>
              <div className="md-intro">
                <div className="md-intro-top">
                  <p className="md-label">图片简介</p>
                  <p className="md-description">
                    站在绿植墙前的白色T恤美女图片 冷白皮女生，皮肤通透白净带一丝粉调，棕色短发，一侧头发垂落遮住耳朵，表情安静舒展，嘴角微扬。她站在一面爬满绿植的墙前，双臂大大张开，姿态松弛开放。白色宽松棉质短袖，灰蓝色格子披肩随意搭在一侧肩上，蓝色牛仔阔腿裤。上方洒下的自然日光穿过绿叶，在脸部和手臂留下斑驳的浅金色光斑 图片大全 高清图片下载 编号为26091424322，图片格式为PNG文件，提供650x829、864x1102多种尺寸图片免费下载，支持电脑和手机图片软件编辑和修改。
                  </p>
                </div>
                <div className="md-intro-bottom">
                  <p className="md-label">不是想要的效果？试试这些词：</p>
                  <div className="md-chip-list">
                    {['美女', '上衣', '格子衣', '海军条纹'].map((tag) => <a key={tag} href={`#${tag}`}>{tag}</a>)}
                  </div>
                </div>
              </div>
            </section>

            <aside className="md-side-card">
              <div className="md-size-picker" aria-label="图片尺寸">
                <button type="button" className={selectedSize === 'small' ? 'is-selected' : ''} onClick={() => setSelectedSize('small')}>
                  <span className="md-radio"><Check size={11} weight="bold" /></span>
                  <span>650x829</span><b>PNG</b>
                </button>
                <button type="button" className={selectedSize === 'large' ? 'is-selected' : ''} onClick={() => setSelectedSize('large')}>
                  <span className="md-radio"><Check size={11} weight="bold" /></span>
                  <span>864x1102</span><b>PNG</b>
                </button>
              </div>
              <section className="md-ai-recommendation" ref={rightRecommendationRef} aria-labelledby="md-ai-recommendation-title">
                <h2 id="md-ai-recommendation-title">需要其他尺寸？</h2>
                <p>用 AI 自动补全画面，无需裁剪主体</p>
                <div className="md-ai-ratios" role="radiogroup" aria-label="扩图比例">
                  {aiRatioOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={selectedAiRatio === option.value}
                      className={selectedAiRatio === option.value ? 'is-selected' : ''}
                      onClick={() => setSelectedAiRatio(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="md-ai-recommendation-cta"
                  aria-label={selectedAiRatio ? `AI扩图：扩成 ${selectedAiRatioLabel}` : 'AI扩图'}
                  onClick={() => navigateToAiTool('expand', 'right_card', selectedAiRatio ?? undefined)}
                >
                  <MagicWand size={17} weight="regular" />
                  {selectedAiRatio ? `扩成 ${selectedAiRatioLabel}` : 'AI扩图'}
                </button>
              </section>
              <button type="button" className="md-download" onClick={handleDownload}>
                <DownloadSimple size={20} weight="regular" />
                立即下载
              </button>
              {downloadSucceeded && !downloadRecommendationDismissed && (
                <section className="md-download-recommendation" ref={downloadRecommendationRef} aria-labelledby="md-download-recommendation-title">
                  <button type="button" className="md-download-recommendation-close" aria-label="关闭下载推荐" onClick={() => setDownloadRecommendationDismissed(true)}><X size={16} /></button>
                  <b id="md-download-recommendation-title">图片已下载</b>
                  <p>还想让它更适合使用？</p>
                  <div>
                    <button type="button" onClick={() => navigateToAiTool('expand', 'download_success', '16:9')}>扩成横图</button>
                    <button type="button" onClick={() => navigateToAiTool('background', 'download_success')}>一键换背景</button>
                    <button type="button" onClick={() => navigateToAiTool('style', 'download_success')}>换个风格</button>
                  </div>
                </section>
              )}
              <div className="md-side-divider" />
              <div className="md-meta-list">
                <div><span>更新时间：</span><b>2026-09-14</b></div>
                <div><span>图片大小：</span><b>0.16M</b></div>
                <div><span>图片类别：</span><a href="#beauty">美女图片</a></div>
                <div><span>更多相关：</span><div className="md-inline-tags">{relatedTags.map((tag) => <a key={tag} href={`#${tag}`}>{tag}</a>)}</div></div>
                <div><span>更多集合：</span><div className="md-inline-tags">{collectionTags.map((tag) => <a key={tag} href={`#${tag}`}>{tag}</a>)}</div></div>
                <div className="md-note"><span>特别说明：</span><p>本站所有资源仅供学习与参考，请勿用于商业用途，否则产生的一切后果将由你自己承担！如有侵犯您的版权，请及时联系168660460#qq.com(#换@)，我们将尽快处理。</p></div>
                <div><span>投稿：</span><a href="#ai-image">AI图片</a></div>
              </div>
            </aside>
          </div>

          <section className="md-recommendations">
            <h2>相关推荐</h2>
            <div className="md-related-grid">
              {relatedImages.map(([image, title]) => (
                <a className="md-related-card" href={`#${title}`} key={title}>
                  <img src={`/prototype-assets/material-detail/${image}`} alt={title} />
                  <span>{title}</span>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>

      <aside className="md-quick-actions" aria-label="辅助入口">
        <button type="button" onClick={() => showNotice('图片版权服务')}><Note size={21} weight="regular" /><span>图片授权</span></button>
        <button type="button" onClick={() => showNotice('客服/商务咨询')}><span className="md-headset">◌</span><span>客服/商务</span></button>
      </aside>

      <footer className="md-footer">
        <div className="md-container"><a href="#about">关于站长之家</a><a href="#contact">联系我们</a><a href="#ad">广告商务</a><a href="#copyright">版权声明</a><a href="#links">友情链接</a><a href="#map">栏目地图</a><a href="#help">帮助说明</a><p>© CopyRight2002-2024, CHINAZ.COM, Inc.All Rights Reserved.</p></div>
      </footer>

      {notice && <div className="md-toast" role="status">{notice}</div>}

      {loginOpen && (
        <div className="md-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setLoginOpen(false)}>
          <div className="md-login-modal" role="dialog" aria-modal="true" aria-label="登录">
            <button type="button" className="md-modal-close" aria-label="关闭登录" onClick={() => setLoginOpen(false)}><X size={20} /></button>
            <h2>登录站长素材</h2>
            <p>登录后即可收藏和下载更多素材</p>
            <input placeholder="请输入手机号" aria-label="手机号" />
            <button type="button" className="md-login-submit" onClick={() => { setLoginOpen(false); showNotice('登录成功（原型演示）') }}>登录</button>
            <small>登录即代表同意《隐私政策》和《服务协议》</small>
          </div>
        </div>
      )}
    </main>
  )
}
