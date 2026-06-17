'use client'

import { useState, useMemo } from 'react'
import { ModelListRow } from './model-list-row'
import { ModelSearchDialog } from './model-search-dialog'
import { HomeInputArea } from './home-input-area'
import { mockModels, type Model } from '@/lib/mock-data'
import { Sparkles, MessageSquare, Image, Video, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const recommendedModelIds = ['deepseek-v4-pro', 'gpt-image-2', 'doubao-seedance-2-0-260128']

interface HomeContentProps {
  onSendMessage: (message: string, modelIds: string[]) => void
  onNavigateToModel: (model: Model) => void
  onToggleSearch: () => void
  onToggleThinking: () => void
  enableSearch: boolean
  enableThinking: boolean
}

export function HomeContent({
  onSendMessage,
  onNavigateToModel,
  onToggleSearch,
  onToggleThinking,
  enableSearch,
  enableThinking,
}: HomeContentProps) {
  const [searchDialogOpen, setSearchDialogOpen] = useState(false)
  const [activeHomeModel, setActiveHomeModel] = useState<Model | null>(null)

  const chatModels = useMemo(() => mockModels.filter(m => m.type === 'chat'), [])
  const imageModels = useMemo(() => mockModels.filter(m => m.type === 'image'), [])
  const videoModels = useMemo(() => mockModels.filter(m => m.type === 'video'), [])
  const recommendedModels = useMemo(
    () => recommendedModelIds.map(id => mockModels.find(m => m.id === id)!).filter(Boolean),
    []
  )

  const chatModelIds = useMemo(() => chatModels.map(m => m.id), [chatModels])

  // 推荐模型栏：toggle 选中态，不跳转
  const handleSelectHomeModel = (model: Model) => {
    setActiveHomeModel(prev => prev?.id === model.id ? null : model)
  }

  return (
    <div className="flex-1 flex flex-col items-center min-w-0 overflow-y-auto bg-background">
      <div className="flex flex-col items-center w-full max-w-[720px] mx-auto px-4 md:px-6 pt-[150px] pb-[150px]">
        <div className="flex items-center justify-center gap-3 mb-8 md:mb-10 shrink-0">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">AI 应用广场</h1>
        </div>

        {/* 推荐模型栏 */}
        <div className="w-full flex items-center justify-start md:justify-center gap-2 mb-4 shrink-0 overflow-x-auto scrollbar-hide">
          {recommendedModels.map(model => {
            const isActive = activeHomeModel?.id === model.id
            return (
              <button
                key={model.id}
                disabled={model.disabled}
                onClick={() => handleSelectHomeModel(model)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0',
                  isActive
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:border-primary/30 hover:bg-accent text-foreground'
                )}
              >
                <span>{model.logo}</span>
                <span>{model.name}</span>
              </button>
            )
          })}
          <button
            onClick={() => setSearchDialogOpen(true)}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-border hover:border-primary/30 hover:bg-accent transition-colors cursor-pointer shrink-0"
          >
            <Search className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* 共享输入区 */}
        <div className="w-full mb-6 shrink-0">
          <HomeInputArea
            model={activeHomeModel}
            defaultModelIds={activeHomeModel ? [activeHomeModel.id] : chatModelIds}
            onSend={(message, modelIds) => onSendMessage(message, modelIds)}
            enableSearch={enableSearch}
            enableThinking={enableThinking}
            onToggleSearch={onToggleSearch}
            onToggleThinking={onToggleThinking}
          />
        </div>

        <div className="w-full space-y-6 shrink-0">
          <ModelListRow
            title="聊天模型"
            icon={<MessageSquare className="h-4 w-4 text-blue-500" />}
            models={chatModels}
            onSelectModel={onNavigateToModel}
            compact
            showDisabled
          />
          <ModelListRow
            title="图片模型"
            icon={<Image className="h-4 w-4 text-green-500" />}
            models={imageModels}
            onSelectModel={onNavigateToModel}
            compact
            showDisabled
          />
          <ModelListRow
            title="视频模型"
            icon={<Video className="h-4 w-4 text-purple-500" />}
            models={videoModels}
            onSelectModel={onNavigateToModel}
            compact
            showDisabled
          />
        </div>
      </div>

      {/* 备案信息 */}
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/60 pb-6">
        <span>闽ICP备08105208号-3</span>
        <span>闽公网安备35020302000061号</span>
      </div>

      {/* 模型搜索弹窗 */}
      <ModelSearchDialog
        open={searchDialogOpen}
        onOpenChange={setSearchDialogOpen}
        onSelectModel={onNavigateToModel}
        showDisabled
      />
    </div>
  )
}
