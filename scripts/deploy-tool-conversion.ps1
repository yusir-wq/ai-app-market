<#
.SYNOPSIS
Deploys the current AI APP Market runtime changes to the configured server.

.DESCRIPTION
Reads connection details and the SSH password from the local Desktop key.txt file,
uploads the current runtime files, builds remotely, then restarts
the existing PM2 application. Credentials are never stored in this repository.
#>
[CmdletBinding()]
param(
  [string]$ServerConfig = (Join-Path $env:USERPROFILE 'Desktop\key.txt'),
  [string]$RemotePath = '/var/www/ai-app-market-v2-new',
  [string]$Pm2App = 'ai-app-market-v2-new',
  [ValidateSet('baseline', 'optimized')]
  [string]$Variant = 'baseline'
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path -LiteralPath $ServerConfig)) {
  throw "未找到服务器配置文件：$ServerConfig"
}

$config = Get-Content -Raw -Encoding UTF8 -LiteralPath $ServerConfig
$hostMatch = [regex]::Match($config, '服务器公网IP[：:]\s*([^\s\r\n]+)')
$userMatch = [regex]::Match($config, '用户名[：:]\s*([^\s\r\n]+)')
$portMatch = [regex]::Match($config, 'SSH端口[：:]\s*(\d+)')
$passwordMatch = [regex]::Match($config, '(?m)^密码[：:]\s*([^\r\n]+)')

if (-not ($hostMatch.Success -and $userMatch.Success -and $portMatch.Success -and $passwordMatch.Success)) {
  throw 'key.txt 缺少服务器地址、用户名、SSH 端口或密码。'
}

$serverHost = $hostMatch.Groups[1].Value
$serverUser = $userMatch.Groups[1].Value
$serverPort = $portMatch.Groups[1].Value
$sshAskPass = Join-Path ([System.IO.Path]::GetTempPath()) "ai-app-market-deploy-$PID.cmd"
$projectRoot = Split-Path -Parent $PSScriptRoot
$sourceFiles = @(
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'next-env.d.ts',
  'eslint.config.mjs',
  'app/api/rewards/display/route.ts',
  'app/api/rewards/pending/route.ts',
  'lib/mock-data.ts',
  'lib/reward-store.ts',
  'components/chat/markdown-content.tsx',
  'components/workspace/mcp-service-list.tsx',
  'components/workspace/nav-panel.tsx',
  'components/workspace/new-user-benefit-toast.tsx',
  'components/workspace/new-user-benefit-toast.module.css',
  'components/workspace/workspace.tsx',
  'components/agent/agent-image-to-video-intro.tsx',
  'components/agent/agent-input-area.tsx',
  'components/agent/agent-result-area.tsx',
  'components/agent/agent-result-preview.tsx',
  'components/agent/agent-scene-cards.tsx',
  'components/agent/agent-upload-zone.tsx',
  'components/agent/agent-video-dubbing-experience.tsx',
  'components/agent/agent-video-dubbing-intro.tsx',
  'components/agent/agent-video-subtitle-intro.tsx',
  'components/agent/agent-video-translate-experience.tsx',
  'components/agent/agent-video-translate-intro.tsx',
  'components/agent/agent-video-translate-result.tsx',
  'components/agent/agent-video-watermark-removal-intro.tsx',
  'components/agent/copywriting-to-video-experience.tsx',
  'components/agent/image-to-video-experience.tsx',
  'app/prototypes/tool-conversion/page.tsx',
  'app/prototypes/material-detail/page.tsx',
  'components/prototypes/tool-conversion/conversion-prototype.tsx',
  'components/prototypes/tool-conversion/prototype-config.ts',
  'components/prototypes/tool-conversion/prototype-types.ts',
  'components/prototypes/tool-conversion/prototype.css',
  'components/prototypes/material-detail/material-detail-prototype.tsx',
  'components/prototypes/material-detail/material-detail.css',
  'public/prototype-assets/chinaz-hero-image-expand.jpg',
  'public/prototype-assets/chinaz-hero-image-background.jpg',
  'public/prototype-assets/chinaz-logo.png',
  'public/prototype-assets/chinaz-scene-01.jpg',
  'public/prototype-assets/chinaz-scene-landscape-result.jpg',
  'public/prototype-assets/chinaz-expansion-source.png',
  'public/prototype-assets/chinaz-scene-02.jpg',
  'public/prototype-assets/chinaz-scene-02-result.jpg',
  'public/prototype-assets/chinaz-scene-03.jpg',
  'public/prototype-assets/chinaz-scene-03-result.jpg',
  'public/prototype-assets/chinaz-scene-04.jpg',
  'public/prototype-assets/chinaz-scene-04-result.jpg',
  'public/prototype-assets/chinaz-scene-05.jpg',
  'public/prototype-assets/chinaz-scene-05-result.jpg',
  'public/prototype-assets/chinaz-scene-06.jpg',
  'public/prototype-assets/chinaz-scene-06-result.jpg',
  'public/prototype-assets/chinaz-scene-07.jpg',
  'public/prototype-assets/chinaz-scene-07-result.jpg',
  'public/prototype-assets/chinaz-scene-08.jpg',
  'public/prototype-assets/chinaz-scene-08-result.jpg',
  'public/prototype-assets/chinaz-scene-09.jpg',
  'public/prototype-assets/chinaz-scene-09-result.jpg',
  'public/prototype-assets/chinaz-scene-10.jpg',
  'public/prototype-assets/chinaz-scene-10-result.jpg',
  'public/prototype-assets/chinaz-scene-11.jpg',
  'public/prototype-assets/chinaz-scene-11-result.jpg',
  'public/prototype-assets/chinaz-scene-12.jpg',
  'public/prototype-assets/chinaz-scene-12-result.jpg',
  'public/prototype-assets/chinaz-scene-13.jpg',
  'public/prototype-assets/chinaz-scene-13-result.jpg',
  'public/prototype-assets/chinaz-scene-14.jpg',
  'public/prototype-assets/chinaz-scene-14-result.jpg',
  'public/prototype-assets/chinaz-scene-15.jpg',
  'public/prototype-assets/chinaz-scene-15-result.jpg',
  'public/prototype-assets/chinaz-scene-16.jpg',
  'public/prototype-assets/chinaz-scene-16-result.jpg',
  'public/prototype-assets/chinaz-scene-17.jpg',
  'public/prototype-assets/chinaz-scene-17-result.jpg',
  'public/prototype-assets/chinaz-scene-18.jpg',
  'public/prototype-assets/chinaz-scene-18-result.jpg',
  'public/prototype-assets/chinaz-scene-19.jpg',
  'public/prototype-assets/chinaz-scene-19-result.jpg',
  'public/prototype-assets/chinaz-scene-20.jpg',
  'public/prototype-assets/chinaz-scene-20-result.jpg',
  'public/prototype-assets/chinaz-scene-21.jpg',
  'public/prototype-assets/chinaz-scene-21-result.jpg',
  'public/prototype-assets/chinaz-scene-22.jpg',
  'public/prototype-assets/chinaz-scene-22-result.jpg',
  'public/prototype-assets/chinaz-scene-23.jpg',
  'public/prototype-assets/chinaz-scene-23-result.jpg',
  'public/prototype-assets/chinaz-scene-24.jpg',
  'public/prototype-assets/chinaz-scene-24-result.jpg',
  'public/prototype-assets/cutouts/cat-subject.png',
  'public/prototype-assets/rewards/task-reward-chest-modal.png',
  'public/prototype-assets/material-detail/main.png',
  'public/prototype-assets/material-detail/logo.png',
  'public/prototype-assets/material-detail/x2.png',
  'public/prototype-assets/material-detail/x3.png',
  'public/prototype-assets/material-detail/x4.png',
  'public/prototype-assets/material-detail/x5.png',
  'public/prototype-assets/material-detail/x7.png',
  'public/prototype-assets/material-detail/x8.png',
  'public/prototype-assets/material-detail/x9.png',
  'public/prototype-assets/material-detail/x10.png',
  'public/prototype-assets/material-detail/x11.png',
  'public/prototype-assets/material-detail/x12.png',
  'public/prototype-assets/material-detail/x15.png',
  'public/prototype-assets/material-detail/related-01.png',
  'public/prototype-assets/material-detail/related-02.png',
  'public/prototype-assets/material-detail/related-03.png',
  'public/prototype-assets/material-detail/related-04.png',
  'public/prototype-assets/material-detail/related-05.jpg',
  'public/prototype-assets/material-detail/related-06.jpg',
  'public/prototype-assets/material-detail/related-07.jpg',
  'public/prototype-assets/material-detail/related-08.jpg',
  'public/prototype-assets/material-detail/related-09.jpg',
  'public/prototype-assets/material-detail/related-10.jpg',
  'public/prototype-assets/background-scenes/scene-01.jpg',
  'public/prototype-assets/background-scenes/scene-01-result.jpg',
  'public/prototype-assets/background-scenes/scene-02.jpg',
  'public/prototype-assets/background-scenes/scene-02-result.jpg',
  'public/prototype-assets/background-scenes/scene-03.jpg',
  'public/prototype-assets/background-scenes/scene-03-result.jpg',
  'public/prototype-assets/background-scenes/scene-04.jpg',
  'public/prototype-assets/background-scenes/scene-04-result.jpg',
  'public/prototype-assets/background-scenes/scene-05.jpg',
  'public/prototype-assets/background-scenes/scene-05-result.jpg',
  'public/prototype-assets/background-scenes/scene-06.jpg',
  'public/prototype-assets/background-scenes/scene-06-result.jpg',
  'public/prototype-assets/background-scenes/scene-07.jpg',
  'public/prototype-assets/background-scenes/scene-07-result.jpg',
  'public/prototype-assets/background-scenes/scene-08.jpg',
  'public/prototype-assets/background-scenes/scene-08-result.jpg',
  'public/prototype-assets/background-scenes/scene-09.jpg',
  'public/prototype-assets/background-scenes/scene-09-result.jpg',
  'public/prototype-assets/background-scenes/scene-10.jpg',
  'public/prototype-assets/background-scenes/scene-10-original.png',
  'public/prototype-assets/background-scenes/scene-10-subject.png',
  'public/prototype-assets/background-scenes/scene-10-original-background.png',
  'public/prototype-assets/background-scenes/scene-10-effect-background.png',
  'public/prototype-assets/background-scenes/scene-11.jpg',
  'public/prototype-assets/background-scenes/scene-11-result.jpg',
  'public/prototype-assets/background-scenes/scene-12.jpg',
  'public/prototype-assets/background-scenes/scene-12-result.jpg',
  'public/prototype-assets/background-scenes/scene-13.jpg',
  'public/prototype-assets/background-scenes/scene-13-result.jpg',
  'public/prototype-assets/background-scenes/scene-14.jpg',
  'public/prototype-assets/background-scenes/scene-14-result.jpg',
  'public/prototype-assets/background-scenes/scene-15.jpg',
  'public/prototype-assets/background-scenes/scene-15-result.jpg',
  'public/prototype-assets/background-scenes/scene-16.jpg',
  'public/prototype-assets/background-scenes/scene-16-result.jpg',
  'public/prototype-assets/background-scenes/scene-17.jpg',
  'public/prototype-assets/background-scenes/scene-17-result.jpg',
  'public/prototype-assets/background-scenes/scene-18.jpg',
  'public/prototype-assets/background-scenes/scene-18-result.jpg',
  'public/prototype-assets/background-scenes/scene-19.jpg',
  'public/prototype-assets/background-scenes/scene-19-result.jpg',
  'public/prototype-assets/background-scenes/scene-20.jpg',
  'public/prototype-assets/background-scenes/scene-20-result.jpg',
  'public/prototype-assets/background-scenes/scene-21.jpg',
  'public/prototype-assets/background-scenes/scene-21-result.jpg',
  'public/prototype-assets/background-scenes/scene-22.jpg',
  'public/prototype-assets/background-scenes/scene-22-result.jpg',
  'public/prototype-assets/background-scenes/scene-23.jpg',
  'public/prototype-assets/background-scenes/scene-23-result.jpg',
  'public/prototype-assets/background-scenes/scene-24.jpg',
  'public/prototype-assets/background-scenes/scene-24-result.jpg'
)

try {
  Set-Content -LiteralPath $sshAskPass -Value "@echo off`r`necho $($passwordMatch.Groups[1].Value)" -NoNewline -Encoding ascii
  $env:SSH_ASKPASS = $sshAskPass
  $env:SSH_ASKPASS_REQUIRE = 'force'
  $env:DISPLAY = ':0'

  $sshBase = @('-p', $serverPort, '-o', 'StrictHostKeyChecking=accept-new')
  $scpBase = @('-P', $serverPort, '-o', 'StrictHostKeyChecking=accept-new')
  $remoteDirectories = @(
    'app/api/rewards/display',
    'app/api/rewards/pending',
    'app/prototypes/tool-conversion',
    'app/prototypes/material-detail',
    'components/prototypes/tool-conversion',
    'components/prototypes/material-detail',
    'components/workspace',
    'lib',
    'public/prototype-assets',
    'public/prototype-assets/material-detail',
    'public/prototype-assets/background-scenes',
    'public/prototype-assets/cutouts',
    'public/prototype-assets/rewards'
  ) | ForEach-Object { "'$RemotePath/$_'" }
  & ssh @sshBase "$serverUser@$serverHost" "mkdir -p $($remoteDirectories -join ' ')"
  if ($LASTEXITCODE -ne 0) { throw '无法创建服务器部署目录。' }

  foreach ($relativePath in $sourceFiles) {
    $localPath = Join-Path $projectRoot $relativePath
    if (-not (Test-Path -LiteralPath $localPath)) { throw "缺少待部署文件：$relativePath" }
    $remoteDirectory = (Split-Path $relativePath -Parent) -replace '\\', '/'
    & scp @scpBase $localPath "$serverUser@$serverHost`:$RemotePath/$remoteDirectory/"
    if ($LASTEXITCODE -ne 0) { throw "上传失败：$relativePath" }
  }

  & ssh @sshBase "$serverUser@$serverHost" "cd '$RemotePath' && npm run build && pm2 restart '$Pm2App' --update-env && pm2 save"
  if ($LASTEXITCODE -ne 0) { throw '远程构建或 PM2 重启失败。' }

  Write-Host "部署完成：http://${serverHost}:3004/prototypes/tool-conversion?variant=$Variant&state=guest-ready"
}
finally {
  if (Test-Path -LiteralPath $sshAskPass) {
    Remove-Item -LiteralPath $sshAskPass -Force
  }
}
