'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Agent } from '@/lib/mock-data'
import { AgentSceneCards } from '@/components/agent/agent-scene-cards'
import { AgentSpeechToTextIntro } from '@/components/agent/agent-speech-to-text-intro'
import { AgentTextToSpeechIntro } from '@/components/agent/agent-text-to-speech-intro'
import { VideoToTextExperience } from '@/components/agent/agent-video-to-text-experience'
import { AgentVideoToTextIntro } from '@/components/agent/agent-video-to-text-intro'
import { AgentCopywritingIntro } from '@/components/agent/agent-copywriting-intro'
import { AgentCopywritingToVideoIntro } from '@/components/agent/agent-copywriting-to-video-intro'
import { AgentVideoTranslateIntro } from '@/components/agent/agent-video-translate-intro'
import { VideoTranslateExperience } from '@/components/agent/agent-video-translate-experience'
import { VideoSubtitleExperience } from '@/components/agent/agent-video-subtitle-experience'
import { AgentVideoSubtitleIntro } from '@/components/agent/agent-video-subtitle-intro'
import { VideoDubbingExperience } from '@/components/agent/agent-video-dubbing-experience'
import { AgentVideoDubbingIntro } from '@/components/agent/agent-video-dubbing-intro'
import { VideoWatermarkRemovalExperience } from '@/components/agent/agent-video-watermark-removal-experience'
import { AgentVideoWatermarkRemovalIntro } from '@/components/agent/agent-video-watermark-removal-intro'
import { CopywritingExperience } from '@/components/agent/agent-copywriting-experience'
import { CopywritingToVideoExperience } from '@/components/agent/agent-copywriting-to-video-experience'
import { ImageToVideoExperience } from '@/components/agent/agent-image-to-video-experience'
import { AgentImageToVideoIntro } from '@/components/agent/agent-image-to-video-intro'
import { AgentInputArea } from '@/components/agent/agent-input-area'
import { AgentResultArea } from '@/components/agent/agent-result-area'
import { TextToSpeechExperience } from '@/components/agent/agent-text-to-speech-experience'
import { SpeechToTextExperience } from '@/components/agent/agent-speech-to-text-experience'
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  Loader2,
  FileText,
  Calendar,
  ChevronRight,
  X,
  Copy,
  Trash2,
  Download,
  Clock,
} from 'lucide-react'
import { toast } from 'sonner'

interface AgentDetailViewProps {
  agent: Agent
  onBack: () => void
  onViewResult?: (resultId: string, fileName?: string) => void
  prefillText?: string
  onNavigateToAgent?: (agentId: string) => void
}

// ============================================================
// Mock 历史任务数据
// ============================================================

interface HistoryTask {
  id: string
  title: string
  status: 'completed' | 'failed' | 'processing' | 'expired'
  createdAt: string
  resultPreview: string
  resultId: string
  videoThumbnail?: string // 视频预览图（AI 文案生视频、AI 图生视频、AI 视频翻译、AI 字幕生成、AI 视频配音、AI 视频去水印使用）
}

const mockHistoryTasks: Record<string, HistoryTask[]> = {
  'speech-to-text': [
    { id: 'ht-1', title: 'meeting-recording.mp3', status: 'completed', createdAt: '2024-01-15 14:30', resultPreview: '会议讨论了Q4产品规划，确定了三个主要方向：一是继续深化AI语音识别在医疗、教育、金融等垂直行业的应用；二是加强多语言模型训练，支持50种以上语言的实时转写和翻译；三是在用户体验层面引入智能分段、自动摘要、关键词提取等新功能模块。会议还重点探讨了如何在有限算力条件下，通过模型蒸馏和量化压缩来实现产品落地，预计Q4将完成内部测试版本并向部分客户开放试点。', resultId: 'result-speech-to-text' },
    { id: 'ht-expired-1', title: 'interview-2023.mp3', status: 'expired', createdAt: '2023-12-20 10:00', resultPreview: '视频转写结果（已失效）', resultId: '' },
    { id: 'ht-expired-2', title: 'webinar-recording.mp3', status: 'expired', createdAt: '2023-11-15 15:30', resultPreview: '会议记录转写（超过30天已失效）', resultId: '' },
  ],
  'text-to-speech': [
    { id: 'ht-2', title: '请帮我写一段关于智能科技改变生活的品牌宣传文案，要求语言生动、富有感染力，适合用于视频配音，让听众沉浸其中。', status: 'completed', createdAt: '2024-01-14 09:15', resultPreview: '音频文件：product-ad.mp3', resultId: 'result-text-to-speech' },
    { id: 'ht-10', title: '萤火虫的秘密\n深夜，九岁的阿布悄悄溜出外婆家，提着一盏熄灭的马灯走向神秘的黑森林。\n他想抓住传说中能实现愿望的"黄金萤火虫"，来治好外婆的眼睛。', status: 'completed', createdAt: '2024-01-13 16:30', resultPreview: '温柔的AI女声演绎品牌故事…', resultId: 'result-text-to-speech-2' },
    { id: 'ht-11', title: '在这个快速迭代的时代，科技创新正以前所未有的速度改变着我们的生活。从清晨智能闹钟的轻柔唤醒，到夜晚智能助手的贴心陪伴，科技已经融入了我们生命中的每一个角落。', status: 'completed', createdAt: '2024-01-12 11:00', resultPreview: '已生成3章节课程旁白音频…', resultId: 'result-text-to-speech-3' },
    { id: 'ht-expired-3', title: '产品介绍旁白（已失效）', status: 'expired', createdAt: '2023-10-05 14:20', resultPreview: '音频已过期，无法下载', resultId: '' },
  ],
  'video-to-text': [
    { id: 'ht-3', title: 'product-launch-2024.mp4', status: 'completed', createdAt: '2024-01-13 15:20', resultPreview: '各位来宾，欢迎参加我们2024年度新品发布会。今天我将为大家介绍三款全新产品。第一款是我们最新研发的智能语音助手V2，它采用了全新的端侧AI芯片，响应速度提升了300%，支持离线唤醒和连续对话。无论是在嘈杂的地铁还是安静的办公室，它都能精准识别你的指令。第二款产品是面向B端的企业级AI中台。可以帮助企业在不招募AI团队的情况下，快速搭建自己的智能客服、智能推荐和智能质检系统。目前已经有超过200家企业接入使用。', resultId: 'result-video-to-text', videoThumbnail: '/thumbnails/thumb-business-conference.jpg' },
    { id: 'ht-12', title: 'q4-strategy-meeting.mov', status: 'completed', createdAt: '2024-01-11 09:00', resultPreview: '今天会议的主要议题是Q4的产品战略规划。首先我们回顾一下Q3的整体表现，AI语音助手V1的市场占有率从15%提升到了22%，企业级AI中台的客户续费率达到了91%。接下来我们要讨论的是如何在Q4将新产品推向更广阔的市场，特别是海外市场的拓展计划。技术团队已经完成了多语言模型的预训练，预计下个月可以上线测试。', resultId: 'result-video-to-text', videoThumbnail: '/thumbnails/thumb-team-meeting.jpg' },
    { id: 'ht-13', title: 'online-course-ai-basics.webm', status: 'completed', createdAt: '2024-01-08 14:45', resultPreview: '大家好，欢迎来到AI基础入门课程。今天我们要学习的是深度学习的核心概念。首先，什么是神经网络？简单来说，它是模仿人脑神经元连接方式的计算模型。一个基本的神经网络由输入层、隐藏层和输出层组成，每一层包含多个节点，节点之间通过带权重的连接进行信息传递。通过反向传播算法，网络可以自动调整这些权重，从而不断优化预测结果。', resultId: 'result-video-to-text', videoThumbnail: '/thumbnails/thumb-online-course.jpg' },
  ],
  'topic-to-copywriting': [
    { id: 'ht-4', title: '新品智能耳机发布', status: 'completed', createdAt: '2024-01-09 16:30', resultPreview: '已生成5段视频脚本及12个热门关键词：#新品首发 #降噪耳机 #NeoBudsPro3 #真无线耳机...', resultId: 'result-topic-to-copywriting' },
    { id: 'ht-14', title: '夏季防晒霜推广', status: 'completed', createdAt: '2024-01-06 10:15', resultPreview: '已生成4段种草脚本及10个关键词：#夏日必备 #防晒推荐 #敏感肌友好...', resultId: 'result-topic-to-copywriting' },
    { id: 'ht-15', title: '亲子露营VLOG脚本', status: 'completed', createdAt: '2024-01-03 14:00', resultPreview: '已生成4段温馨脚本及12个关键词：#亲子时光 #周末露营 #治愈系VLOG...', resultId: 'result-topic-to-copywriting' },
  ],
  'copywriting-to-video': [
    { id: 'ht-5', title: '真实的质感，画质细腻清晰，电脑屏幕里的女生在车里坐着，突然女生开心的朝屏幕前面挥了挥手，然后把手伸了出来打破了屏幕的界限，将手放在了屏幕外面的手上，光聚焦在了手上，两只手互相紧握，真实感与动画的无缝融合，动作细腻流畅',
      status: 'completed', createdAt: '2024-01-08 09:00',
      resultPreview: '已生成6镜分镜脚本...', resultId: 'result-copywriting-to-video',
      videoThumbnail: '/thumbnails/thumb-girl-car.jpg' },
    { id: 'ht-16', title: '让图片中的人喝口饮料 旁白: 啊~真甜',
      status: 'completed', createdAt: '2024-01-07 15:30',
      resultPreview: '已生成8镜分镜脚本...', resultId: 'result-copywriting-to-video',
      videoThumbnail: '/thumbnails/thumb-person-drinking.jpg' },
    { id: 'ht-17', title: '一个女生在森林里奔跑，阳光透过树叶洒在她身上，镜头跟随她穿过溪流，画面唯美治愈，电影质感',
      status: 'completed', createdAt: '2024-01-06 10:45',
      resultPreview: '已生成5镜分镜脚本...', resultId: 'result-copywriting-to-video',
      videoThumbnail: '/thumbnails/thumb-forest-running.jpg' },
    { id: 'ht-18', title: '产品展示：新款智能手表特写旋转镜头，屏幕亮起显示心率、步数等数据，表盘细节金属光泽清晰可见',
      status: 'completed', createdAt: '2024-01-05 14:20',
      resultPreview: '已生成7镜分镜脚本...', resultId: 'result-copywriting-to-video',
      videoThumbnail: '/thumbnails/thumb-smartwatch.jpg' },
    { id: 'ht-19', title: '猫咪在窗台上晒太阳，慵懒地打了个哈欠，尾巴轻轻摇晃，柔和的午后阳光营造温馨氛围',
      status: 'completed', createdAt: '2024-01-04 09:15',
      resultPreview: '已生成6镜分镜脚本...', resultId: 'result-copywriting-to-video',
      videoThumbnail: '/thumbnails/thumb-cat-window.jpg' },
  ],
  'image-to-video': [
    { id: 'ht-6', title: '让图片中的瀑布动起来，水流倾泻而下，水雾在阳光下形成彩虹，画面气势磅礴',
      status: 'completed', createdAt: '2024-01-12 10:30',
      resultPreview: '已生成15秒运镜视频...', resultId: 'result-image-to-video-1',
      videoThumbnail: '/thumbnails/thumb-waterfall.jpg' },
    { id: 'ht-20', title: '这张产品图，让镜头从左到右缓慢推进，灯光逐一亮起，营造科技感揭幕仪式',
      status: 'completed', createdAt: '2024-01-11 09:15',
      resultPreview: '已生成10秒产品运镜...', resultId: 'result-image-to-video-2',
      videoThumbnail: '/thumbnails/thumb-product-lights.jpg' },
    { id: 'ht-21', title: '让风景照中的云朵缓缓飘动，湖面泛起微波，打造延时摄影效果',
      status: 'completed', createdAt: '2024-01-09 16:40',
      resultPreview: '已生成8秒延时视频...', resultId: 'result-image-to-video-3',
      videoThumbnail: '/thumbnails/thumb-landscape-clouds.jpg' },
    { id: 'ht-22', title: '让人物肖像的眼睛慢慢睁开，嘴角微微上扬，头发轻轻飘动，赋予静态照片生命',
      status: 'completed', createdAt: '2024-01-07 14:20',
      resultPreview: '已生成5秒人像动态...', resultId: 'result-image-to-video-4',
      videoThumbnail: '/thumbnails/thumb-portrait.jpg' },
    { id: 'ht-23', title: '让美食照片中的热气缓缓上升，汤汁轻轻晃动，筷子夹起食物的瞬间慢动作',
      status: 'completed', createdAt: '2024-01-05 11:00',
      resultPreview: '已生成12秒美食视频...', resultId: 'result-image-to-video-5',
      videoThumbnail: '/thumbnails/thumb-food.jpg' },
  ],
  'video-translate': [
    { id: 'ht-7', title: 'product_launch_2024.mp4', status: 'completed', createdAt: '2025-01-15 14:30', resultPreview: '已生成12条中英双语字幕', resultId: 'result-video-translate', videoThumbnail: '/thumbnails/thumb-smartwatch.jpg' },
    { id: 'ht-24', title: 'online_course_ai.mp4', status: 'completed', createdAt: '2025-01-14 09:15', resultPreview: '已生成18条日中双语字幕', resultId: 'result-video-translate', videoThumbnail: '/thumbnails/thumb-online-course.jpg' },
    { id: 'ht-25', title: 'marketing_sizzle_reel.mov', status: 'completed', createdAt: '2025-01-13 16:40', resultPreview: '已生成10条中英双语字幕', resultId: 'result-video-translate', videoThumbnail: '/thumbnails/thumb-marketing-reel.jpg' },
    { id: 'ht-26', title: 'tutorial_edit_basics.mp4', status: 'completed', createdAt: '2025-01-12 11:20', resultPreview: '已生成15条韩中双语字幕', resultId: 'result-video-translate', videoThumbnail: '/thumbnails/thumb-online-course.jpg' },
    { id: 'ht-27', title: 'conference_keynote.mp4', status: 'completed', createdAt: '2025-01-11 08:45', resultPreview: '已生成22条法中双语字幕', resultId: 'result-video-translate', videoThumbnail: '/thumbnails/thumb-business-conference.jpg' },
  ],
  'video-dubbing': [
    { id: 'ht-8', title: 'product_demo.mp4', status: 'completed', createdAt: '2025-01-10 11:20', resultPreview: '已生成三角色配音版本', resultId: 'result-video-dubbing', videoThumbnail: '/thumbnails/thumb-product-lights.jpg' },
    { id: 'ht-32', title: 'tutorial_voiceover.mp4', status: 'completed', createdAt: '2025-01-09 09:15', resultPreview: '已生成磁性男声配音', resultId: 'result-video-dubbing', videoThumbnail: '/thumbnails/thumb-online-course.jpg' },
    { id: 'ht-33', title: 'brand_story.mp4', status: 'completed', createdAt: '2025-01-08 14:30', resultPreview: '已生成沉稳男声配音', resultId: 'result-video-dubbing', videoThumbnail: '/thumbnails/thumb-brand-story.jpg' },
    { id: 'ht-34', title: 'kids_animation.mp4', status: 'completed', createdAt: '2025-01-07 10:45', resultPreview: '已生成可爱童声配音', resultId: 'result-video-dubbing', videoThumbnail: '/thumbnails/thumb-kids-animation.jpg' },
    { id: 'ht-35', title: 'news_report.mp4', status: 'completed', createdAt: '2025-01-06 16:00', resultPreview: '已生成温柔女声配音', resultId: 'result-video-dubbing', videoThumbnail: '/thumbnails/thumb-news-report.jpg' },
  ],
  'video-subtitle': [
    { id: 'ht-9', title: 'tutorial_edit_basics.mp4', status: 'completed', createdAt: '2025-01-12 10:30', resultPreview: '已生成10条中英双语字幕', resultId: 'result-video-subtitle', videoThumbnail: '/thumbnails/thumb-online-course.jpg' },
    { id: 'ht-28', title: 'product_overview.mp4', status: 'completed', createdAt: '2025-01-11 09:15', resultPreview: '已生成8条日中双语字幕', resultId: 'result-video-subtitle', videoThumbnail: '/thumbnails/thumb-smartwatch.jpg' },
    { id: 'ht-29', title: 'team_meeting_recap.mp4', status: 'completed', createdAt: '2025-01-10 16:40', resultPreview: '已生成12条字幕轨道', resultId: 'result-video-subtitle', videoThumbnail: '/thumbnails/thumb-team-meeting.jpg' },
    { id: 'ht-30', title: 'social_vlog_2025.mp4', status: 'completed', createdAt: '2025-01-09 14:20', resultPreview: '已生成15条中英双语字幕', resultId: 'result-video-subtitle', videoThumbnail: '/thumbnails/thumb-vlog-social.jpg' },
    { id: 'ht-31', title: 'keynote_presentation.mov', status: 'completed', createdAt: '2025-01-08 11:00', resultPreview: '已生成18条法中双语字幕', resultId: 'result-video-subtitle', videoThumbnail: '/thumbnails/thumb-business-conference.jpg' },
  ],
  'video-watermark-removal': [
    { id: 'ht-36', title: 'tutorial_watermark.mp4', status: 'completed', createdAt: '2025-01-05 09:30', resultPreview: '已去除右下角Logo水印', resultId: 'result-video-watermark-removal', videoThumbnail: '/thumbnails/thumb-online-course.jpg' },
    { id: 'ht-37', title: 'brand_cleanup.mp4', status: 'completed', createdAt: '2025-01-04 14:15', resultPreview: '已去除顶部字幕和角标', resultId: 'result-video-watermark-removal', videoThumbnail: '/thumbnails/thumb-brand-story.jpg' },
    { id: 'ht-38', title: 'vlog_subtitle_removal.mp4', status: 'completed', createdAt: '2025-01-03 11:00', resultPreview: '已消除3处硬字幕', resultId: 'result-video-watermark-removal', videoThumbnail: '/thumbnails/thumb-vlog-social.jpg' },
    { id: 'ht-39', title: 'presentation_clean.mov', status: 'completed', createdAt: '2025-01-02 16:45', resultPreview: '已移除画面中心和底部水印', resultId: 'result-video-watermark-removal', videoThumbnail: '/thumbnails/thumb-business-conference.jpg' },
    { id: 'ht-40', title: 'stock_footage_fix.mp4', status: 'completed', createdAt: '2025-01-01 10:20', resultPreview: 'AI填充修复左上角版权标记', resultId: 'result-video-watermark-removal', videoThumbnail: '/thumbnails/thumb-marketing-reel.jpg' },
  ],
}

function getHistoryTasks(agentId: string): HistoryTask[] {
  return mockHistoryTasks[agentId] || mockHistoryTasks['speech-to-text'] || []
}

export function AgentDetailView({ agent, onBack, onViewResult, prefillText, onNavigateToAgent }: AgentDetailViewProps) {
  const [activeTab, setActiveTab] = useState<string>('experience')
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState(prefillText || '')
  const [paramValues, setParamValues] = useState<Record<string, any>>(() => {
    const defaults: Record<string, any> = {}
    agent.parameters.forEach((p) => {
      defaults[p.id] = p.defaultValue
    })
    return defaults
  })
  const [uploadError, setUploadError] = useState<string>()
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressSteps, setProgressSteps] = useState<{ label: string; status: 'pending' | 'running' | 'done' }[]>([])

  // 参数变化处理
  const handleParamChange = useCallback((id: string, value: any) => {
    setParamValues((prev) => ({ ...prev, [id]: value }))
  }, [])

  // 文件变化校验
  const handleFileChange = useCallback(
    (newFile: File | null) => {
      setUploadError(undefined)
      if (!newFile) {
        setFile(null)
        return
      }
      const ext = `.${newFile.name.split('.').pop()?.toLowerCase()}`
      if (agent.acceptedFiles && !agent.acceptedFiles.includes(ext)) {
        setUploadError(`不支持的文件格式，请上传 ${agent.acceptedFiles.join('、')} 格式`)
        return
      }
      if (agent.maxFileSize && newFile.size > agent.maxFileSize * 1024 * 1024) {
        setUploadError(`文件大小不能超过 ${agent.maxFileSize}MB`)
        return
      }
      setFile(newFile)
      toast.success(`已选择文件：${newFile.name}`)
    },
    [agent.acceptedFiles, agent.maxFileSize]
  )

  // 生成处理步骤
  const generateSteps = useCallback((): { label: string; status: 'pending' | 'running' | 'done' }[] => {
    switch (agent.id) {
      case 'speech-to-text':
      case 'video-to-text':
        return [
          { label: '上传文件', status: 'done' },
          { label: '音频解码', status: 'running' },
          { label: '语音识别', status: 'pending' },
          { label: '文本整理', status: 'pending' },
        ]
      case 'text-to-speech':
        return [
          { label: '文本分析', status: 'done' },
          { label: '语音合成', status: 'running' },
          { label: '音频渲染', status: 'pending' },
        ]
      case 'copywriting-to-video':
        return [
          { label: '文案分析', status: 'done' },
          { label: '分镜设计', status: 'running' },
          { label: '画面生成', status: 'pending' },
          { label: '配音合成', status: 'pending' },
          { label: '字幕生成', status: 'pending' },
          { label: '视频合成', status: 'pending' },
        ]
      case 'image-to-video':
        return [
          { label: '图片分析', status: 'done' },
          { label: '生成图像', status: 'running' },
          { label: '图像优化', status: 'pending' },
          { label: '准备视频生成', status: 'pending' },
        ]
      case 'topic-to-copywriting':
        return [
          { label: '主题分析', status: 'done' },
          { label: '脚本撰写', status: 'running' },
          { label: '关键词提炼', status: 'pending' },
          { label: '格式整理', status: 'pending' },
        ]
      default:
        return [
          { label: '接收任务', status: 'done' },
          { label: 'AI处理中', status: 'running' },
          { label: '结果生成', status: 'pending' },
        ]
    }
  }, [agent.id])

  // 语音转文字 / 视频转文字：上传文件后自动开始处理
  useEffect(() => {
    if (agent.id !== 'speech-to-text' && agent.id !== 'video-to-text') return
    if (file && !isProcessing) {
      const timer = setTimeout(() => {
        handleProcess()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [agent.id, file, isProcessing])

  // 开始处理
  const handleProcess = useCallback((skipValidation?: boolean) => {
    if (!skipValidation) {
      // image-to-video 由体验区组件内部管理图片上传，跳过文件校验
      if (agent.id !== 'image-to-video') {
        if (agent.inputType === 'file' || agent.inputType === 'both') {
          if (!file) {
            setUploadError('请先上传文件')
            return
          }
        }
      }
      if (agent.inputType === 'text' || agent.inputType === 'both' || agent.id === 'image-to-video') {
        if (!text.trim()) {
          setUploadError('请输入内容')
          return
        }
        if (text.length > 5000) {
          setUploadError('内容不能超过5000字')
          return
        }
      }
    }
    
    // image-to-video：体验组件内部自管理对话流程，此处仅标记开始处理
    if (agent.id === 'image-to-video') {
      setUploadError(undefined)
      setIsProcessing(true)
      // 不做进度模拟和结果页跳转，组件自行管理完成后的重置
      setTimeout(() => {
        setIsProcessing(false)
      }, 6000)
      return
    }

    // video-translate：由体验组件内部管理处理流程
    if (agent.id === 'video-translate') {
      setUploadError(undefined)
      setIsProcessing(true)
      return
    }

    // video-dubbing / video-subtitle / video-watermark-removal：由体验组件内部管理处理流程
    if (agent.id === 'video-dubbing' || agent.id === 'video-subtitle' || agent.id === 'video-watermark-removal') {
      setUploadError(undefined)
      setIsProcessing(true)
      return
    }

    setUploadError(undefined)
    setIsProcessing(true)
    setProgress(0)

    const steps = generateSteps()
    setProgressSteps(steps)

    // Mock 处理进度 + 步骤更新
    let currentStep = 0
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 12) + 4
        if (next >= 100) {
          clearInterval(interval)
          return 100
        }
        const stepIndex = Math.floor((next / 100) * steps.length)
        if (stepIndex > currentStep && stepIndex < steps.length) {
          currentStep = stepIndex
          setProgressSteps(prevSteps =>
            prevSteps.map((s, i) =>
              i < stepIndex ? { ...s, status: 'done' }
                : i === stepIndex ? { ...s, status: 'running' }
                : s
            )
          )
        }
        return next
      })
    }, 600)

    // Mock 处理完成 → 直接跳转结果详情页
    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      setProgressSteps(prev => prev.map(s => ({ ...s, status: 'done' })))
      setIsProcessing(false)
      onViewResult?.(`result-${agent.id}`, file?.name)
    }, 3500)
  }, [agent, file, text, generateSteps, onViewResult])

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-white">
      {/* 五段式模板，全宽渲染，不受限宽容器约束 */}
      {agent.id === 'speech-to-text' ? (
        <SpeechToTextExperience
          agent={agent}
          onBack={onBack}
          onViewResult={onViewResult}
        />
      ) : agent.id === 'text-to-speech' ? (
        <TextToSpeechExperience
          agent={agent}
          onBack={onBack}
          onViewResult={onViewResult}
        />
      ) : agent.id === 'video-to-text' ? (
        <VideoToTextExperience
          agent={agent}
          onBack={onBack}
          onViewResult={onViewResult}
        />
      ) : agent.id === 'topic-to-copywriting' ? (
        <CopywritingExperience
          agent={agent}
          onBack={onBack}
          onViewResult={onViewResult}
          onNavigateToAgent={(agentId, params) => {
            // This will be handled by the parent component
            if (params?.text) {
              // Store the text for prefilling
              window.dispatchEvent(new CustomEvent('navigateToAgent', { detail: { agentId, params } }))
            }
          }}
        />
      ) : agent.id === 'copywriting-to-video' ? (
        <CopywritingToVideoExperience
          agent={agent}
          onBack={onBack}
          onViewResult={onViewResult}
          onNavigateToAgent={onNavigateToAgent}
        />
      ) : agent.id === 'image-to-video' ? (
        <ImageToVideoExperience
          agent={agent}
          onBack={onBack}
          onViewResult={onViewResult}
          onNavigateToAgent={onNavigateToAgent}
        />
      ) : agent.id === 'video-translate' ? (
        <VideoTranslateExperience
          agent={agent}
          onBack={onBack}
          onViewResult={onViewResult}
        />
      ) : agent.id === 'video-dubbing' ? (
        <VideoDubbingExperience
          agent={agent}
          onBack={onBack}
          onViewResult={onViewResult}
        />
      ) : agent.id === 'video-subtitle' ? (
        <VideoSubtitleExperience
          agent={agent}
          onBack={onBack}
          onViewResult={onViewResult}
        />
      ) : agent.id === 'video-watermark-removal' ? (
        <VideoWatermarkRemovalExperience
          agent={agent}
          onBack={onBack}
          onViewResult={onViewResult}
        />
      ) : (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full p-4 md:p-6">
        {/* 返回按钮 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-muted-foreground w-fit"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          返回智能体广场
        </Button>

        {/* ========== 内容区域 ========== */}
        <div className="flex-1 min-w-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="intro" className="text-sm">
                场景介绍
              </TabsTrigger>
              <TabsTrigger value="experience" className="text-sm">
                使用应用
              </TabsTrigger>
              <TabsTrigger value="history" className="text-sm">
                历史任务
              </TabsTrigger>
            </TabsList>

            {/* === 场景介绍 Tab === */}
            <TabsContent value="intro" className="mt-0">
              {agent.id === 'speech-to-text' ? (
                <AgentSpeechToTextIntro />
              ) : agent.id === 'text-to-speech' ? (
                <AgentTextToSpeechIntro />
              ) : agent.id === 'topic-to-copywriting' ? (
                <AgentCopywritingIntro />
              ) : agent.id === 'copywriting-to-video' ? (
                <AgentCopywritingToVideoIntro />
              ) : agent.id === 'video-translate' ? (
                <AgentVideoTranslateIntro />
              ) : agent.id === 'image-to-video' ? (
                <AgentImageToVideoIntro />
              ) : agent.id === 'video-dubbing' ? (
                <AgentVideoDubbingIntro />
              ) : agent.id === 'video-subtitle' ? (
                <AgentVideoSubtitleIntro />
              ) : agent.id === 'video-watermark-removal' ? (
                <AgentVideoWatermarkRemovalIntro />
              ) : (
                <AgentSceneCards scenes={agent.scenes} />
              )}
            </TabsContent>

            {/* === 体验应用 Tab === */}
            <TabsContent value="experience" className="mt-0 space-y-4">
              {/* 五段式应用已移至外层路由，此处仅处理未重构的应用 */}
              <>
                  {/* 输入区 */}
                  <AgentInputArea
                    agent={agent}
                    file={file}
                    text={text}
                    paramValues={paramValues}
                    onFileChange={handleFileChange}
                    onTextChange={setText}
                    onParamChange={handleParamChange}
                    error={uploadError}
                    isProcessing={isProcessing}
                    progress={progress}
                    progressSteps={progressSteps}
                    onStartProcess={(agent.id === 'speech-to-text' || agent.id === 'video-to-text') ? () => handleProcess(true) : undefined}
                  />

                  {/* 操作按钮：非语音转文字显示 */}
                  {agent.id !== 'speech-to-text' && agent.id !== 'video-to-text' && (
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => handleProcess()}
                      disabled={isProcessing}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {isProcessing ? '处理中...' : '开始处理'}
                    </Button>
                  )}

                  {/* 结果区：仅展示处理进度动画 */}
                  {isProcessing && agent.id !== 'speech-to-text' && agent.id !== 'video-to-text' && (
                    <AgentResultArea
                      isProcessing={true}
                      progress={progress}
                      progressSteps={progressSteps}
                      costPoints={agent.costPoints}
                      processTime={agent.avgProcessTime}
                    />
                  )}
                </>
            </TabsContent>

            {/* === 历史任务 Tab === */}
            <TabsContent value="history" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(() => {
                  const tasks = getHistoryTasks(agent.id)
                  return tasks.length === 0 ? (
                  <Card className="border-border/60 col-span-full">
                    <CardContent className="p-8 text-center">
                      <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        暂无历史任务
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  tasks.map((task) => (
                    <Card
                      key={task.id}
                      className="border-border/60 hover:border-primary/30 transition-all duration-300 cursor-pointer group flex flex-col overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 gap-0"
                      onClick={() => onViewResult?.(task.resultId, task.title)}
                    >
                      {/* 所有视频相关智能体：显示视频预览图 */}
                      {(agent.id === 'copywriting-to-video' || agent.id === 'image-to-video' || agent.id === 'video-translate' || agent.id === 'video-subtitle' || agent.id === 'video-dubbing' || agent.id === 'video-watermark-removal' || agent.id === 'video-to-text') && task.videoThumbnail ? (
                        <>
                          {/* 视频预览图 */}
                          <div className="relative aspect-video bg-black">
                            <img
                              src={task.videoThumbnail}
                              alt={task.title}
                              className="w-full h-full object-cover"
                            />
                            {/* 播放按钮遮罩 */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                                <Play className="h-6 w-6 text-black ml-1 fill-current" />
                              </div>
                            </div>
                            {/* 状态角标 */}
                            {task.status === 'completed' ? (
                              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                                <CheckCircle2 className="h-4 w-4 text-white" />
                              </div>
                            ) : task.status === 'failed' ? (
                              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive flex items-center justify-center">
                                <X className="h-4 w-4 text-white" />
                              </div>
                            ) : task.status === 'expired' ? (
                              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
                                <Clock className="h-3.5 w-3.5 text-white" />
                              </div>
                            ) : (
                              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                <Loader2 className="h-4 w-4 text-white animate-spin" />
                              </div>
                            )}
                          </div>
                          {/* 底部信息 */}
                          <CardContent className="p-3">
                            <h4 className="text-sm font-medium text-foreground mb-1 line-clamp-2">
                              {task.title}
                            </h4>
                            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {task.createdAt}
                              </span>
                              <ChevronRight className="h-3 w-3 text-muted-foreground/50 group-hover:hidden transition-colors" />
                            </div>
                            {/* Hover 操作按钮 */}
                            <div className="hidden group-hover:flex items-center gap-1 pt-2 mt-1 border-t border-border/20">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toast.info('下载功能模拟中...')
                                }}
                              >
                                <Download className="h-3.5 w-3.5" />
                                下载
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toast.info('删除功能模拟中...')
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                删除
                              </Button>
                            </div>
                          </CardContent>
                        </>
                      ) : (
                        /* 其他应用：保持原卡片样式 */
                        <CardContent className="p-4 flex flex-col flex-1">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                              task.status === 'completed'
                                ? 'bg-gradient-to-br from-emerald-400 to-emerald-600'
                                : task.status === 'failed'
                                  ? 'bg-gradient-to-br from-red-400 to-rose-600'
                                  : task.status === 'expired'
                                    ? 'bg-gradient-to-br from-gray-400 to-gray-500'
                                    : 'bg-gradient-to-br from-blue-400 to-indigo-600'
                            }`}>
                              {task.status === 'completed' ? (
                                <CheckCircle2 className="h-5 w-5 text-white" />
                              ) : task.status === 'failed' ? (
                                <X className="h-5 w-5 text-white" />
                              ) : task.status === 'expired' ? (
                                <Clock className="h-4 w-4 text-white" />
                              ) : (
                                <Loader2 className="h-5 w-5 text-white animate-spin" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="text-sm font-medium text-foreground line-clamp-5 whitespace-pre-line leading-relaxed">
                                  {task.title}
                                </h4>
                                <Badge
                                  variant={
                                    task.status === 'completed'
                                      ? 'secondary'
                                      : task.status === 'failed'
                                        ? 'destructive'
                                        : task.status === 'expired'
                                          ? 'outline'
                                          : 'default'
                                  }
                                  className="text-[10px] shrink-0 mt-0.5"
                                >
                                  {task.status === 'completed'
                                    ? '已完成'
                                    : task.status === 'failed'
                                      ? '失败'
                                      : task.status === 'expired'
                                        ? '已失效'
                                        : '处理中'}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-5 mb-1.5 flex-1">
                                {task.resultPreview}
                              </p>
                              <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-auto">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {task.createdAt}
                                </span>
                                <ChevronRight className="h-3 w-3 ml-auto text-muted-foreground/50 group-hover:hidden transition-colors" />
                              </div>
                            </div>
                          </div>
                          {/* Hover 操作按钮 */}
                          <div className="hidden group-hover:flex items-center gap-1 pt-2 mt-1 border-t border-border/20">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                              onClick={(e) => {
                                e.stopPropagation()
                                navigator.clipboard.writeText(task.resultPreview)
                                toast.success('已复制到剪贴板')
                              }}
                            >
                              <Copy className="h-3.5 w-3.5" />
                              复制
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                toast.info('删除功能模拟中...')
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              删除
                            </Button>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))
                )})()}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        </div>
      )}
    </div>
  )
}
