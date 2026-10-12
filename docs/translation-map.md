# 中英文对照表（待确认）

> 用途：界面英文字符串 → 建议中文。你确认/修改后，我按此表落地到代码。
> 说明：`位置` 是 `文件:行`；模板字符串里的 `{}` 是运行时变量，翻译时保留占位。
> 品牌名 OpenCut 一般保留不译。

---

## 1. 首页 / 项目列表（`src/app/projects/page.tsx`）

| English | 中文建议 | 位置 |
| --- | --- | --- |
| Untitled Project | 未命名项目 | 46 |
| Failed to create project | 创建项目失败 | 50 |
| Please try again | 请重试 | 51 |
| Could not open recent project | 无法打开最近的项目 | 70 |
| Open the .ocut file manually instead. | 请改为手动打开该 .ocut 文件 | 71 |
| Your projects are stored as local .ocut files. Open one to keep editing. | 项目以本地 .ocut 文件保存，打开一个继续编辑 | 86 |
| Opening and saving project files needs a Chromium-based browser (Chrome / Edge). | 打开与保存项目文件需要 Chromium 内核浏览器（Chrome / Edge） | 94 |
| New project | 新建项目 | 102 |
| Open project… | 打开项目… | 111 |
| Recent | 最近打开 | 117 |
| Loading… | 加载中… | 119 |
| No recent projects yet. | 暂无最近的项目 | 123 |
| Remove from recent | 从最近中移除 | 149 |

## 2. 编辑器页面（`src/app/editor/page.tsx`）

| English | 中文建议 | 位置 |
| --- | --- | --- |
| Loading project... | 正在加载项目… | 48 |
| Missing project id. | 缺少项目 ID | 60 |
| For the best experience, open OpenCut in Chrome. | 为获得最佳体验，请用 Chrome 打开 OpenCut | 89 |
| Dismiss | 关闭 | 95 |
| This project isn't open. Go back and open its .ocut file. | 该项目尚未打开，请返回并打开其 .ocut 文件 | editor-provider |

## 3. 编辑器头部 / 菜单（`src/components/editor/editor-header.tsx`）

| English | 中文建议 | 位置 |
| --- | --- | --- |
| Save | 保存 | 67 |
| Save project | 保存项目 | 67 |
| Save as… | 另存为… | 82 |
| Open project… | 打开项目… | 92 |
| Project file options | 项目文件选项 | 75 |
| Saving needs a Chromium-based browser | 保存需要 Chromium 内核浏览器 | 65 |
| Exit project | 退出项目 | 184 |
| Shortcuts | 快捷键 | 191 |
| Failed to rename project | 重命名项目失败 | 136/251 |
| Failed to delete project | 删除项目失败 | 154 |
| Please try again | 请重试 | 138/156/253 |
| Project thumbnail | 项目缩略图 | 171 |
| Project saved | 项目已保存 | project-manager |
| Failed to save project | 保存项目失败 | project-manager |
| Failed to open project | 打开项目失败 | project-manager |

## 4. 新手引导（`src/components/editor/onboarding.tsx`）

| English | 中文建议 | 位置 |
| --- | --- | --- |
| Welcome to OpenCut Beta! 🎉 | 欢迎使用 OpenCut Beta！🎉 | 30/46 |
| ⚠️ This is a super early beta! | ⚠️ 这是非常早期的 beta 版！ | 32 |
| 🦋 Have fun testing! | 🦋 祝你测试愉快！ | 34 |
| OpenCut Onboarding | OpenCut 新手引导 | 36 |
| You're among the first to try OpenCut - the fully open source CapCut alternative. | 你是最早体验 OpenCut 的用户之一——完全开源的剪映替代品 | 47 |
| Next | 下一步 | 49/61 |
| There's still a ton of things to do to make this editor amazing. | 还有很多工作要做，才能让这个编辑器更出色 | 57 |
| A lot of features are still missing. We're working hard to build them out! | 许多功能尚未完成，我们正在努力开发！ | 58 |
| If you're curious, check out our roadmap [here](https://opencut.app/roadmap) | 感兴趣的话可以查看我们的[路线图](https://opencut.app/roadmap) | 59 |
| Tip: press Ctrl+S to save your project as a local .ocut file. | 提示：按 Ctrl+S 把项目保存为本地 .ocut 文件 | 69 |
| Finish | 完成 | 71 |

## 5. 移动端提示（`src/components/editor/mobile-gate.tsx`）

| English | 中文建议 | 位置 |
| --- | --- | --- |
| Go back | 返回 | 45 |
| Desktop only (for now) | 目前仅支持桌面端 | 51 |
| OpenCut isn't optimized for mobile or iPad yet. Things will break and the layout will be a mess. Come back on a desktop for the real experience. | OpenCut 尚未针对手机/iPad 优化，界面会错乱、功能可能异常。请用桌面端获得完整体验 | 54 |
| Take a look anyway | 仍要看看 | 60 |

## 6. 资源面板（`src/components/editor/panels/assets/**`）

### 6.1 标签栏（`assets-panel-store.tsx`）

| English | 中文建议 | 位置 |
| --- | --- | --- |
| Media | 媒体 | 39 |
| Text | 文字 | 43 |
| Stickers | 贴纸 | 47 |
| Effects | 特效 | 51 |
| Transitions | 转场 | 55 |
| Captions | 字幕 | 59 |
| Adjustment | 调节 | 63 |
| Settings | 设置 | 67 |

### 6.2 其他（`index.tsx` / `drag-overlay.tsx` / `draggable-item.tsx`）

| English | 中文建议 | 位置 |
| --- | --- | --- |
| Transitions view coming soon... | 转场功能即将推出… | index 23 |
| Adjustment view coming soon... | 调节功能即将推出… | index 29 |
| Processing your files (${progress}%) | 正在处理你的文件（${progress}%） | drag-overlay 44 |
| Drag and drop videos, photos, and audio files here | 将视频、图片、音频文件拖到此处 | drag-overlay 45 |
| Add to timeline or drag to position | 添加到时间线或拖动定位 | draggable-item 190 |

### 6.3 媒体库（`views/assets.tsx`）

| English | 中文建议 | 位置 |
| --- | --- | --- |
| No active project | 无活动项目 | 83 |
| Assets | 素材 | 195/220 |
| Delete | 删除 | 321 |
| Delete ${idsToDelete.length} items | 删除 ${n} 个素材 | 321 |
| Export clips | 导出片段 | 327 |
| Video | 视频 | 485 |
| Audio | 音频 | 496 |
| Unknown | 未知 | 504 |
| Switch to list view | 切换到列表视图 | 549 |
| Switch to grid view | 切换到网格视图 | 549 |
| Name | 名称 | 570 |
| Type | 类型 | 577 |
| Duration | 时长 | 584 |
| File size | 文件大小 | 591 |
| Sort by {sortBy} ({ascending/descending}) | 按 {字段} 排序（升序/降序） | 601 |
| Import | 导入 | 615 |

### 6.4 设置视图（`views/settings/**`）

| English | 中文建议 | 位置 |
| --- | --- | --- |
| Project info | 项目信息 | index 225 |
| Background | 背景 | index 226 |
| Name | 名称 | index 235 |
| Frame rate | 帧率 | index 243 |
| Select a frame rate | 选择帧率 | index 252 |
| Aspect ratio | 画面比例 | index 270 |
| Custom | 自定义 | index 289 |
| Canvas width | 画布宽度 | index 298 |
| Canvas height | 画布高度 | index 306 |
| Select ${blur.label} blur | 选择${模糊等级}模糊 | background 70 |
| Select background ${bg} | 选择背景${bg} | background 125 |
| Pick a custom background color | 选择自定义背景颜色 | background 161 |
| Colors | 颜色 | background 183 |
| Pattern craft | Pattern Craft | background 184 |
| Syntax UI | Syntax UI | background 185 |
| Blur | 模糊 | background 266 |
| Light | 轻 | background/blur |
| Medium | 中 | background/blur |
| Heavy | 重 | background/blur |

## 7. 属性面板（`src/components/editor/panels/properties/**`）

| English | 中文建议 | 位置 |
| --- | --- | --- |
| It's empty here | 这里是空的 | empty-view 13 |
| Click an element on the timeline to edit its properties | 点击时间线上的元素以编辑其属性 | empty-view 15 |
| Transform | 变换 | registry 85 |
| Blending | 混合 | registry 105 |
| Audio | 音频 | registry 125 |
| Speed | 速度 | registry 145 |
| Masks | 遮罩 | registry 158 |
| Effects | 特效 | registry 171 |
| Text | 文字 | registry 182 |
| Graphic | 图形 | registry 202 |
| Toggle {param} keyframe | 切换{参数}关键帧 | property-param-field 53 |

## 8. 时间线（`src/timeline/**`）

### 8.1 工具栏 / 元素菜单（`components/timeline-toolbar.tsx`、`timeline-element.tsx`、`index.tsx`）

| English | 中文建议 | 位置 |
| --- | --- | --- |
| Extract audio | 提取音频 | toolbar 124 |
| Recover audio | 恢复音频 | audio-separation 115 |
| Split element | 分割片段 | toolbar 147 |
| Split left | 分割并保留左侧 | toolbar 153 |
| Split right | 分割并保留右侧 | toolbar 159 |
| Duplicate element | 复制片段 | toolbar 180 |
| Freeze frame (coming soon) | 定格帧（即将推出） | toolbar 188 |
| Delete element | 删除片段 | toolbar 195 |
| Add bookmark | 添加标签 | toolbar 207 |
| Remove bookmark | 删除标签 | toolbar 207 |
| Open graph editor | 打开曲线编辑器 | graph use-controller 171 |
| No Scene | 无场景 | toolbar 255 |
| Auto snapping | 自动吸附 | toolbar 289 |
| Ripple editing | 波纹编辑 | toolbar 296 |
| Split | 分割 | element 430 |
| Duplicate | 复制 | element 438 |
| Collapse keyframes | 收起关键帧 | element 480 |
| Expand keyframes | 展开关键帧 | element 480 |
| Reveal media | 定位素材 | element 491 |
| Replace media | 替换素材 | element 497 |
| Left/Right resize handle | 左/右 调整手柄 | element 652 |
| Select keyframe | 选择关键帧 | element 725/878 |
| Copy | 复制 | element 1190 |
| Mute / Unmute | 静音 / 取消静音 | element 1217 |
| Show / Hide | 显示 / 隐藏 | element 1249 |
| Delete {n} elements | 删除 {n} 个片段 | element 1272 |
| Timeline | 时间线 | index 437 |
| Paste elements | 粘贴片段 | index 846 |
| Mute track / Unmute track | 静音轨道 / 取消静音 | index 856 |
| Show track / Hide track | 显示轨道 / 隐藏轨道 | index 867 |
| Delete track | 删除轨道 | index 879 |
| Select {track.name} track | 选择{轨道名}轨道 | timeline-track 55 |
| Timeline ruler | 时间线标尺 | ruler 104 / bookmarks 95 |
| Timeline playhead | 时间线播放头 | playhead 110 |
| Drag playhead | 拖动播放头 | playhead 129 |
| Drag to adjust clip volume | 拖动调整片段音量 | audio-volume-line 253 |

### 8.2 关键帧曲线编辑器（`components/graph-editor/**`）

| English | 中文建议 | 位置 |
| --- | --- | --- |
| Smooth | 平滑 | easing-presets 13 |
| Ease out | 缓出 | easing-presets 14 |
| Ease in | 缓入 | easing-presets 15 |
| In out | 缓入缓出 | easing-presets 16 |
| Pop | 弹跳 | easing-presets 17 |
| Linear | 线性 | easing-presets 18 |
| Custom {n} | 自定义 {n} | custom-presets-store 89 |
| Value | 值 | session 194 |
| Curve | 曲线 | session 339 |
| Edit graph | 编辑曲线 | session 599 |
| Edit graph for {n} properties | 编辑 {n} 条属性的曲线 | session 601 |
| Presets | 预设 | popover 129 |
| Saved | 已保存 | popover 132 |
| Save | 保存 | popover 181 |
| Curve preset preview | 曲线预设预览 | popover 324 |
| Bezier curve editor | 贝塞尔曲线编辑器 | bezier-graph 167 |
| Select at most two adjacent keyframes per property. | 每条属性最多选择两个相邻关键帧 | session 255 |
| The selected keyframe has no editable graph. | 所选关键帧没有可编辑的曲线 | session 262 |
| The selected keyframe has no editable graph channel. | 所选关键帧没有可编辑的曲线通道 | session 273 |
| The selected keyframe is not editable as a graph segment. | 所选关键帧无法作为曲线段编辑 | session 327/590 |
| Selected properties do not share a graph-editable channel. | 所选属性没有共同的曲线通道 | session 392/537 |
| Select a keyframe that has an outgoing segment. | 请选择有后续段的关键帧 | session 399 |
| Selected keyframes must be adjacent on each property. | 所选关键帧在每条属性上必须相邻 | session 409 |
| Hold segments have a fixed value - easing has no effect here. | 保持段的值固定，缓动在此无效 | session 416 |
| Select a keyframe to edit its curve. | 选择一个关键帧以编辑其曲线 | session 461/472 |
| The selected keyframe could not be resolved. | 无法解析所选关键帧 | session 483 |
| Selected keyframes must be on the same element. | 所选关键帧必须在同一元素上 | session 495 |

### 8.3 标签（`bookmarks/**`）

| English | 中文建议 | 位置 |
| --- | --- | --- |
| Bookmark at {t}s | {t} 秒处标签 | bookmarks 192 |
| Note | 备注 | bookmarks 352 |
| Add a note... | 添加备注… | bookmarks 354 |
| Color | 颜色 | bookmarks 361 |
| Reset to default color | 重置为默认颜色 | bookmarks 381 |
| Duration | 时长 | bookmarks 399 |
| delete bookmark | 删除标签 | bookmarks 435 |
| Show bookmark notes | 显示标签备注 | preview-overlay-source 12 |

## 9. 预览（`src/preview/**`）

| English | 中文建议 | 位置 |
| --- | --- | --- |
| Failed to copy snapshot | 复制快照失败 | context-menu 35 |
| Failed to save snapshot | 保存快照失败 | context-menu 46 |
| Please try again | 请重试 | context-menu 36/47 |
| Fit to screen | 适应屏幕 | context-menu 56 |
| Full screen | 全屏 | context-menu 60 |
| Save snapshot | 保存快照 | context-menu 63 |
| Copy snapshot | 复制快照 | context-menu 66 |
| Fit | 适应 | toolbar 105/122 |
| Guides | 参考线 | guide-popover 26 |
| Edit text | 编辑文字 | text-edit-overlay 125 |
| Preview canvas | 预览画布 | preview-interaction-overlay 73 |

## 10. 参考线定义（`src/guides/**`）

| English | 中文建议 | 位置 |
| --- | --- | --- |
| TikTok | TikTok | platforms 48 |
| Reels | Reels | platforms 53 |
| Shorts | Shorts | platforms 58 |
| Spotlight | Spotlight | platforms 63 |
| Grid | 网格 | grid 120 |
| Add guide line | 添加参考线 | custom 11 |
| Custom | 自定义 | custom 19 |
| TikTok Layout | TikTok 布局 | tiktok-layout 10 |

## 11. 特效 / 遮罩 / 图形 / 贴纸 / 文字 / 速度 / 字幕

### 11.1 特效（`src/effects/**`）

| English | 中文建议 | 位置 |
| --- | --- | --- |
| Effects | 特效 | assets-view 16 / effects-tab 146 |
| Effect | 特效 | effects-tab 59 |
| No effects | 无特效 | effects-tab 217 |
| Add effects to this layer from the Assets panel. | 从素材面板为此图层添加特效 | effects-tab 219 |
| Open effects | 打开特效 | effects-tab 227 |
| Toggle {name} | 切换 {name} | effects-tab 263 |
| Remove {name} | 移除 {name} | effects-tab 273 |
| Blur | 模糊 | definitions/blur 70 |
| Intensity | 强度 | definitions/blur 75 |

### 11.2 遮罩（`src/masks/**`）

| English | 中文建议 | 位置 |
| --- | --- | --- |
| Masks | 遮罩 | masks-tab 257 |
| Add mask | 添加遮罩 | masks-tab 270/283/848 |
| Only one mask is supported right now. If you need more, duplicate the clip and apply a different mask to each copy. | 目前仅支持一个遮罩。如需多个，请复制片段并分别应用不同遮罩 | masks-tab 277 |
| Toggle {name} mask inversion | 反转 {name} 遮罩 | masks-tab 343 |
| Remove {name} mask | 移除 {name} 遮罩 | masks-tab 359 |
| Position | 位置 | masks-tab 435 |
| Size | 大小 | masks-tab 472 / masks-tab 706 |
| Height | 高度 | masks-tab 508 / box-like 60 |
| Width | 宽度 | masks-tab 527 / box-like 52 |
| Scale | 缩放 | masks-tab 545 / box-like 77 / text 80 |
| Rotation | 旋转 | masks-tab 565 / box-like 68 / split 261 / text 71 |
| Feather | 羽化 | masks-tab 582 / registry 35 |
| Stroke | 描边 | masks-tab 595 |
| Letter spacing | 字间距 | masks-tab 647 |
| Line height | 行高 | masks-tab 658 |
| Content | 内容 | masks-tab 688 / text 44? (content) |
| Font | 字体 | masks-tab 697 |
| Spacing | 间距 | masks-tab 715 |
| No masks | 无遮罩 | masks-tab 842 |
| Add a mask to hide or reveal parts of this layer. | 添加遮罩以隐藏或显示此图层的部分区域 | masks-tab 844 |
| Stroke width | 描边宽度 | registry 45 |
| Stroke color | 描边颜色 | registry 54 |
| X / Y | X / Y | box-like 34/43, split 241/251, text 44/53 |
| Stroke Align | 描边对齐 | box-like 86 |
| Inside / Center / Outside | 内侧 / 居中 / 外侧 | box-like 90-92 |
| Cinematic Bars | 电影黑边 | cinematic-bars 76 |
| Diamond | 菱形 | diamond 50 |
| Ellipse | 椭圆 | ellipse 13 |
| Heart | 心形 | heart 83 |
| Rectangle | 矩形 | rectangle 50 |
| Split | 分割 | split/definitions 185 |
| Star | 星形 | star 90 |
| Text | 文字 | text/definitions 211 |
| Mask | 遮罩 | text/definitions 354 |
| Pen tool | 钢笔工具 | freeform/definition 293 |
| Rotation | 旋转 | freeform 64 |
| Scale | 缩放 | freeform 73 |

### 11.3 图形（`src/graphics/**`）

| English | 中文建议 | 位置 |
| --- | --- | --- |
| Stroke | 描边 | graphic-tab 169 |
| Fill | 填充 | definitions/* |
| Color | 颜色 | definitions/* |
| Width | 宽度 | definitions/* |
| Sides | 边数 | polygon 48 |
| Corner radius | 圆角 | polygon 58 / rectangle 42 |
| Polygon | 多边形 | polygon 169 |
| Rectangle | 矩形 | rectangle 54 |
| Ellipse | 椭圆 | ellipse 43 |
| Points | 角数 | star 43 |
| Depth | 深度 | star 53 |
| Star | 星形 | star 65 |
| Stroke align | 描边对齐 | shared 7 |
| Inside / Center / Outside | 内侧 / 居中 / 外侧 | shared 12-14 |

### 11.4 贴纸（`src/stickers/**`）

| English | 中文建议 | 位置 |
| --- | --- | --- |
| Search... | 搜索… | assets-view 58 |
| Sticker categories | 贴纸分类 | assets-view 82 |
| No stickers found | 未找到贴纸 | assets-view 144 |
| {n} results | {n} 个结果 | assets-view 208 |
| No stickers found for "{q}" | 未找到“{q}”相关贴纸 | assets-view 218/236 |
| No stickers available yet. | 暂无贴纸 | assets-view 238 |
| No stickers available in {category} yet. | {分类}中暂无贴纸 | assets-view 239 |
| Clear | 清除 | assets-view 291 |
| See all | 查看全部 | assets-view 304 |
| Failed to add sticker to timeline | 添加贴纸到时间线失败 | assets-view 383 |
| All | 全部 | categories 2 |
| Flags | 国旗 | categories 5 |
| Shapes | 形状 | categories 6 |
| Recently used | 最近使用 | index 246 |
| Square | 正方形 | providers/shapes 21 |
| Circle | 圆形 | providers/shapes 22 |
| Triangle | 三角形 | providers/shapes 25 |
| Hexagon | 六边形 | providers/shapes 30 |
| Diamond | 菱形 | providers/shapes 37 |
| Star | 星形 | providers/shapes 41 |

### 11.5 文字 / 速度 / 字幕（`src/text`、`src/speed`、`src/subtitles`）

| English | 中文建议 | 位置 |
| --- | --- | --- |
| Text | 文字 | text/assets-view 27 |
| Default text | 默认文本 | text/assets-view 29/32/40 |
| Speed | 速度 | speed-tab 114/118 |
| Change pitch | 改变音调 | speed-tab 143 |
| Loading model {n}% | 正在加载模型 {n}% | subtitles 104 |
| Transcribing... | 转写中… | subtitles 107 |
| Extracting audio... | 提取音频中… | subtitles 121 |
| Preparing audio... | 准备音频中… | subtitles 129 |
| Generating captions... | 生成字幕中… | subtitles 141 |
| No captions were generated | 未生成字幕 | subtitles 145/186 |
| An unexpected error occurred | 发生意外错误 | subtitles 157/205 |
| Reading subtitle file... | 读取字幕文件… | subtitles 167 |
| No valid subtitle cues were found in the subtitle file | 字幕文件中未找到有效字幕条目 | subtitles 178 |
| Importing subtitles... | 导入字幕中… | subtitles 183 |
| Imported {a} subtitle cue(s) and skipped {b} malformed cue(s). | 已导入 {a} 条字幕，跳过 {b} 条异常字幕 | subtitles 193 |
| Captions | 字幕 | subtitles 242 |
| Import | 导入 | subtitles 271 |
| Language | 语言 | subtitles 292 |
| Select a language | 选择语言 | subtitles 298 |
| Auto detect | 自动检测 | subtitles 301 |
| Generate transcript | 生成转写 | subtitles 319 |
| Unsupported subtitle format | 不支持的字幕格式 | parse 21 |
| Caption {n} | 字幕 {n} | build-subtitle-text-element 317 |
| (ASS 相关提示 5 条) | 见 subtitles/ass.ts 231-255 | ass.ts |

### 11.6 转写语言 / 模型（`src/transcription/**`）

| English | 中文建议 | 位置 |
| --- | --- | --- |
| English | 英语 | languages 2 |
| Spanish | 西班牙语 | languages 3 |
| Italian | 意大利语 | languages 4 |
| French | 法语 | languages 5 |
| German | 德语 | languages 6 |
| Portuguese | 葡萄牙语 | languages 7 |
| Russian | 俄语 | languages 8 |
| Japanese | 日语 | languages 9 |
| Chinese | 中文 | languages 10 |
| Tiny | 微型 | models 9 |
| Fastest, lower accuracy | 最快，准确率较低 | models 11 |
| Small | 小型 | models 15 |
| Good balance of speed and accuracy | 速度与准确率的良好平衡 | models 17 |
| Medium | 中型 | models 21 |
| Higher accuracy, slower | 准确率更高，速度更慢 | models 23 |
| Large v3 Turbo | 大型 v3 Turbo | models 27 |
| Best accuracy, requires WebGPU for good performance | 准确率最佳，需 WebGPU 才能有好性能 | models 29 |
| No audio detected. Add a clip with audio to the timeline first. | 未检测到音频。请先把带音频的片段加入时间线 | diagnostics 15 |

## 12. 参数名 & 选项标签（`src/params/registry.ts`、`fps`、`timeline`）

### 12.1 混合模式（`params/registry.ts` 77-93）

| English | 中文建议 |
| --- | --- |
| Normal | 正常 |
| Darken | 变暗 |
| Multiply | 正片叠底 |
| Color Burn | 颜色加深 |
| Lighten | 变亮 |
| Screen | 滤色 |
| Plus Lighter | 叠加变亮 |
| Color Dodge | 颜色减淡 |
| Overlay | 叠加 |
| Soft Light | 柔光 |
| Hard Light | 强光 |
| Difference | 差值 |
| Exclusion | 排除 |
| Hue | 色相 |
| Saturation | 饱和度 |
| Color | 颜色 |
| Luminosity | 明度 |

### 12.2 元素参数（`params/registry.ts`）

| English | 中文建议 |
| --- | --- |
| Position X / Position Y | 位置 X / 位置 Y |
| Scale X / Scale Y | 缩放 X / 缩放 Y |
| Rotate | 旋转 |
| Opacity | 不透明度 |
| Blend Mode | 混合模式 |
| Volume | 音量 |
| Muted | 静音 |
| Content | 内容 |
| Font Family | 字体 |
| Font Size | 字号 |
| Text Align | 对齐方式 |
| Left / Center / Right | 左 / 居中 / 右 |
| Font Weight | 字重 |
| Normal / Bold | 常规 / 加粗 |
| Font Style | 字体样式 |
| Normal / Italic | 常规 / 斜体 |
| Text Decoration | 文字装饰 |
| None / Underline / Line Through | 无 / 下划线 / 删除线 |
| Letter Spacing | 字间距 |
| Line Height | 行高 |
| Background Enabled | 启用背景 |
| Background Color | 背景颜色 |
| Background Radius | 背景圆角 |
| Background Padding X / Y | 背景内边距 X / Y |
| Background Offset X / Y | 背景偏移 X / Y |

### 12.3 时间线默认 & 轨道

| English | 中文建议 | 位置 |
| --- | --- | --- |
| Text | 文字 | timeline/defaults 33 |
| Default text | 默认文本 | timeline/defaults 39 |
| Main scene | 主场景 | timeline/scenes 14 |
| Cannot delete main scene | 无法删除主场景 | timeline/scenes 54 |
| Video track | 视频轨 | timeline/tracks 4 |
| Text track | 文字轨 | timeline/tracks 5 |
| Audio track | 音频轨 | timeline/tracks 6 |
| Graphic track | 图形轨 | timeline/tracks 7 |
| Effect track | 特效轨 | timeline/tracks 8 |
| Main Track | 主轨 | placement/main-track 4 |
| Position X / Y, Scale X / Y, Rotation, Opacity, Volume, Color, BG Color, BG Pad X/Y, BG Offset X/Y, Corner Radius | 位置X/Y、缩放X/Y、旋转、不透明度、音量、颜色、背景色、背景内边距X/Y、背景偏移X/Y、圆角 | expanded-layout 27-40 |

### 12.4 帧率（`src/fps/presets.ts`）

| English | 中文建议 |
| --- | --- |
| 24 fps | 24 帧/秒 |
| 25 fps | 25 帧/秒 |
| 30 fps | 30 帧/秒 |
| 60 fps | 60 帧/秒 |
| 120 fps | 120 帧/秒 |

## 13. 快捷键 & 动作说明（`src/actions/**`）

### 13.1 动作描述（`definitions.ts`）

| English | 中文建议 | 位置 |
| --- | --- | --- |
| Play/Pause | 播放/暂停 | 26 |
| Stop playback | 停止播放 | 30 |
| Seek forward 1 second | 向前 1 秒 | 34 |
| Seek backward 1 second | 向后 1 秒 | 39 |
| Frame step forward | 前进一帧 | 44 |
| Frame step backward | 后退一帧 | 48 |
| Jump forward 5 seconds | 向前 5 秒 | 52 |
| Jump backward 5 seconds | 向后 5 秒 | 57 |
| Go to timeline start | 跳到时间线开头 | 62 |
| Go to timeline end | 跳到时间线结尾 | 66 |
| Split elements at playhead | 在播放头处分割 | 70 |
| Split and remove left | 分割并删除左侧 | 74 |
| Split and remove right | 分割并删除右侧 | 78 |
| Delete current selection | 删除当前所选 | 82 |
| Copy selected elements | 复制所选元素 | 86 |
| Paste elements at playhead | 在播放头处粘贴 | 90 |
| Toggle snapping | 切换吸附 | 94 |
| Toggle ripple editing | 切换波纹编辑 | 98 |
| Extract or recover source audio | 提取或恢复原音频 | 102 |
| Select all elements | 全选元素 | 106 |
| Cancel current interaction | 取消当前操作 | 110 |
| Deselect all elements | 取消选择 | 114 |
| Duplicate selected element | 复制所选元素 | 118 |
| Mute/unmute selected elements | 静音/取消静音所选 | 122 |
| Show/hide selected elements | 显示/隐藏所选 | 126 |
| Toggle bookmark at playhead | 在播放头切换标签 | 130 |
| Undo | 撤销 | 134 |
| Redo | 重做 | 138 |
| Remove media asset | 移除素材 | 142 |
| Remove media assets | 移除素材（多个） | 147 |
| Save project to file | 保存项目到文件 | 152 |

### 13.2 动作分类（快捷键面板分组标题）

| English | 中文建议 |
| --- | --- |
| playback | 播放 |
| navigation | 导航 |
| editing | 编辑 |
| selection | 选择 |
| history | 历史 |
| timeline | 时间线 |
| controls | 控制 |
| assets | 素材 |

### 13.3 快捷键面板（`shortcuts-dialog.tsx`、`use-keyboard-shortcuts-help.ts`）

| English | 中文建议 | 位置 |
| --- | --- | --- |
| Keyboard shortcuts | 键盘快捷键 | 113 |
| Reset to default | 恢复默认 | 143 |
| or | 或 | 196 |
| Press any key combination... | 请按下组合键… | 226 |
| Click to edit shortcut | 点击编辑快捷键 | 226 |
| Key "{k}" is already bound to "{action}" | 按键“{k}”已绑定到“{action}” | 60 |
| Shift / Space / Home / Enter / End / Delete / Backspace | Shift / 空格 / Home / Enter / End / Delete / Backspace | formatKey |

## 14. 对话框 & 提示（`src/project/**`、`src/media/**`、`src/services/**`、UI 组件）

### 14.1 项目对话框

| English | 中文建议 | 位置 |
| --- | --- | --- |
| Rename project | 重命名项目 | rename 38 |
| New name | 新名称 | rename 42 |
| Enter a new name | 输入新名称 | rename 52 |
| Cancel | 取消 | rename 65 / delete 75 |
| Rename | 重命名 | rename 67 |
| Delete '{name}'? | 删除“{name}”？ | delete 41 |
| Delete {n} projects? | 删除 {n} 个项目？ | delete 48 |
| Warning | 警告 | delete 54 |
| This will permanently delete ... and all associated files. | 这将永久删除……及其所有关联文件 | delete 56 |
| Type "DELETE" to confirm | 输入 “DELETE” 以确认 | delete 63 |
| Delete project | 删除项目 | delete 78 |
| Updating project / Updating projects | 正在更新项目 | migration 20/21 |
| Upgrading "{name}" from v{a} to v{b} | 正在将“{name}”从 v{a} 升级到 v{b} | migration 23 |
| Duration | 时长 | info 54 |
| Created | 创建于 | info 56 |
| Modified | 修改于 | info 60 |
| Project ID | 项目 ID | info 64 |
| Close | 关闭 | info 74 / ui/dialog 69 / ui/sheet 89 |
| Done | 完成 | info 76 |
| Don't lose your projects | 别弄丢你的项目 | storage-persistence 21 |
| Your browser can automatically delete your projects when storage runs low. Allow OpenCut to protect them? | 存储不足时浏览器可能自动删除你的项目。允许 OpenCut 保护它们吗？ | storage-persistence 24 |
| Not now | 暂不 | storage-persistence 34 |
| Allow | 允许 | storage-persistence 36 |

### 14.2 媒体处理 / 上传提示（`src/media/**`）

| English | 中文建议 | 位置 |
| --- | --- | --- |
| {codec} cannot be decoded in this browser, so this clip may not preview correctly. Convert it to H.264 MP4 ... | 此浏览器无法解码 {codec}，该片段可能无法正确预览。请转成 H.264 MP4…… | processing 20/21 |
| File size is {size}. | 文件大小为 {size}。 | processing 34 |
| File size is {size}, but only {avail} is safely available in browser storage. | 文件大小为 {size}，但浏览器存储只剩 {avail}。 | processing 37 |
| Unsupported file type: {name} | 不支持的文件类型：{name} | processing 102 |
| Not enough browser storage for {name} | 浏览器存储空间不足以处理 {name} | processing 111 |
| Can't preview {name} | 无法预览 {name} | processing 147 |
| Could not process video | 无法处理视频 | processing 157 |
| Couldn't process {name} | 无法处理 {name} | processing 159 |
| Failed to process {name} | 处理 {name} 失败 | processing 189 |
| No video track found in the file | 文件中未找到视频轨道 | mediabunny 40 |
| Uploading {n} media asset(s)... | 正在上传 {n} 个素材… | upload-toast 32 |
| {name} has been uploaded | {name} 已上传 | upload-toast 37 |
| 1 media asset has been uploaded | 已上传 1 个素材 | upload-toast 38 |
| {n} media assets have been uploaded | 已上传 {n} 个素材 | upload-toast 42 |
| No media assets were uploaded | 没有素材被上传 | upload-toast 45 |
| Failed to upload {n} media asset(s) | 上传 {n} 个素材失败 | upload-toast 47 |

### 14.3 UI 通用组件（`src/components/ui/**`、`section.tsx`、`theme-toggle.tsx`）

| English | 中文建议 | 位置 |
| --- | --- | --- |
| Collapse section / Expand section | 收起 / 展开 | section 126 |
| Click to edit time | 点击编辑时间 | editable-timecode 156 |
| Light / Dark | 浅色 / 深色 | theme-toggle 36 |
| Storage not fully supported. Some features may not work. | 存储未完全支持，部分功能可能不可用 | storage-provider 52 |
| Unknown error | 未知错误 | storage-provider 70 |
| Select a mode | 选择模式 | color-picker 294 |
| Custom / Saved | 自定义 / 已保存 | color-picker 297/298 |
| HEX / RGB / HSL / HSV | HEX / RGB / HSL / HSV | color-picker 383-386 |
| All fonts / My fonts / Favorites | 全部字体 / 我的字体 / 收藏 | font-picker 22-24 |
| Select a font | 选择字体 | font-picker 101 |
| Search {tab}... | 搜索{tab}… | font-picker 123 |
| Loading fonts... | 正在加载字体… | font-picker 149 |
| Failed to load font previews. | 加载字体预览失败 | font-picker 155 |
| Retry | 重试 | font-picker 158 |
| No fonts found. | 未找到字体 | font-picker 166 |
| breadcrumb | 面包屑 | breadcrumb 7 |
| More | 更多 | breadcrumb 93 |
| Clear input | 清除输入 | input 114 |
| Hide password / Show password | 隐藏密码 / 显示密码 | input 128 |
| Drag to adjust value | 拖动调整数值 | number-field 259 |
| Reset to default | 重置为默认 | number-field 307 |
| Loading | 加载中 | spinner 10 |

## 15. 系统字体名（`src/fonts/system-fonts.ts`）

| English | 中文建议 |
| --- | --- |
| Arial / Helvetica / Times New Roman / Courier New / Verdana / Georgia | 保留原名（字体专名） |
| monospace | 等宽 |
| sans-serif | 无衬线 |
| serif | 衬线 |

## 16. 国旗贴纸：地区 + 国家名（`src/stickers/providers/countries-data.ts`）

> 约 200 条，用于国旗贴纸的名称/搜索。以下为对照（你确认后可整批替换）。

### 16.1 地区

| English | 中文 |
| --- | --- |
| Western Europe | 西欧 |
| Eastern Europe | 东欧 |
| Northern Europe | 北欧 |
| Southern Europe | 南欧 |
| South Asia | 南亚 |
| Southeast Asia | 东南亚 |
| East Asia | 东亚 |
| Central Asia | 中亚 |
| Middle East | 中东 |
| North Africa | 北非 |
| Sub-Saharan Africa | 撒哈拉以南非洲 |
| North America | 北美 |
| South America | 南美 |
| Central America | 中美洲 |
| Caribbean | 加勒比地区 |
| Oceania | 大洋洲 |
| Antarctica | 南极洲 |
| Atlantic Ocean | 大西洋 |
| North Atlantic | 北大西洋 |

### 16.2 国家 / 地区（按出现顺序）

| English | 中文 | English | 中文 |
| --- | --- | --- | --- |
| Andorra | 安道尔 | United Arab Emirates | 阿联酋 |
| Afghanistan | 阿富汗 | Antigua and Barbuda | 安提瓜和巴布达 |
| Anguilla | 安圭拉 | Albania | 阿尔巴尼亚 |
| Armenia | 亚美尼亚 | Angola | 安哥拉 |
| Antarctica | 南极洲 | Argentina | 阿根廷 |
| American Samoa | 美属萨摩亚 | Austria | 奥地利 |
| Australia | 澳大利亚 | Aruba | 阿鲁巴 |
| Aland Islands | 奥兰群岛 | Azerbaijan | 阿塞拜疆 |
| Bosnia and Herzegovina | 波黑 | Barbados | 巴巴多斯 |
| Bangladesh | 孟加拉国 | Belgium | 比利时 |
| Burkina Faso | 布基纳法索 | Bulgaria | 保加利亚 |
| Bahrain | 巴林 | Burundi | 布隆迪 |
| Benin | 贝宁 | Saint Barthelemy | 圣巴泰勒米 |
| Bermuda | 百慕大 | Brunei | 文莱 |
| Bolivia | 玻利维亚 | Caribbean Netherlands | 加勒比荷兰 |
| Brazil | 巴西 | Bahamas | 巴哈马 |
| Bhutan | 不丹 | Bouvet Island | 布韦岛 |
| Botswana | 博茨瓦纳 | Belarus | 白俄罗斯 |
| Belize | 伯利兹 | Canada | 加拿大 |
| Cocos (Keeling) Islands | 科科斯（基林）群岛 | Democratic Republic of the Congo | 刚果（金） |
| Central African Republic | 中非共和国 | Republic of the Congo | 刚果（布） |
| Switzerland | 瑞士 | Cote d'Ivoire | 科特迪瓦 |
| Cook Islands | 库克群岛 | Chile | 智利 |
| Cameroon | 喀麦隆 | China | 中国 |
| Colombia | 哥伦比亚 | Costa Rica | 哥斯达黎加 |
| Cuba | 古巴 | Cape Verde | 佛得角 |
| Curacao | 库拉索 | Christmas Island | 圣诞岛 |
| Cyprus | 塞浦路斯 | Czechia | 捷克 |
| Germany | 德国 | Djibouti | 吉布提 |
| Denmark | 丹麦 | Dominica | 多米尼克 |
| Dominican Republic | 多米尼加共和国 | Algeria | 阿尔及利亚 |
| Ecuador | 厄瓜多尔 | Estonia | 爱沙尼亚 |
| Egypt | 埃及 | Western Sahara | 西撒哈拉 |
| Eritrea | 厄立特里亚 | Spain | 西班牙 |
| Ethiopia | 埃塞俄比亚 | European Union | 欧盟 |
| Finland | 芬兰 | Fiji | 斐济 |
| Falkland Islands | 福克兰群岛 | Micronesia | 密克罗尼西亚 |
| Faroe Islands | 法罗群岛 | France | 法国 |
| Gabon | 加蓬 | England | 英格兰 |
| Northern Ireland | 北爱尔兰 | Scotland | 苏格兰 |
| Wales | 威尔士 | United Kingdom | 英国 |
| Grenada | 格林纳达 | Georgia | 格鲁吉亚 |
| French Guiana | 法属圭亚那 | Guernsey | 根西 |
| Ghana | 加纳 | Gibraltar | 直布罗陀 |
| Greenland | 格陵兰 | Gambia | 冈比亚 |
| Guinea | 几内亚 | Guadeloupe | 瓜德罗普 |
| Equatorial Guinea | 赤道几内亚 | Greece | 希腊 |
| South Georgia and the South Sandwich Islands | 南乔治亚和南桑威奇群岛 | Guatemala | 危地马拉 |
| Guam | 关岛 | Guinea-Bissau | 几内亚比绍 |
| Guyana | 圭亚那 | Hong Kong | 中国香港 |
| Heard Island and McDonald Islands | 赫德岛和麦克唐纳群岛 | Honduras | 洪都拉斯 |
| Croatia | 克罗地亚 | Haiti | 海地 |
| Hungary | 匈牙利 | Indonesia | 印度尼西亚 |
| Ireland | 爱尔兰 | Israel | 以色列 |
| Isle of Man | 马恩岛 | India | 印度 |
| British Indian Ocean Territory | 英属印度洋领地 | Iraq | 伊拉克 |
| Iran | 伊朗 | Iceland | 冰岛 |
| Italy | 意大利 | Jersey | 泽西 |
| Jamaica | 牙买加 | Jordan | 约旦 |
| Japan | 日本 | Kenya | 肯尼亚 |
| Kyrgyzstan | 吉尔吉斯斯坦 | Cambodia | 柬埔寨 |
| Kiribati | 基里巴斯 | Comoros | 科摩罗 |
| Saint Kitts and Nevis | 圣基茨和尼维斯 | North Korea | 朝鲜 |
| South Korea | 韩国 | Kuwait | 科威特 |
| Cayman Islands | 开曼群岛 | Kazakhstan | 哈萨克斯坦 |
| Laos | 老挝 | Lebanon | 黎巴嫩 |
| Saint Lucia | 圣卢西亚 | Liechtenstein | 列支敦士登 |
| Sri Lanka | 斯里兰卡 | Liberia | 利比里亚 |
| Lesotho | 莱索托 | Lithuania | 立陶宛 |
| Luxembourg | 卢森堡 | Latvia | 拉脱维亚 |
| Libya | 利比亚 | Morocco | 摩洛哥 |
| Monaco | 摩纳哥 | Moldova | 摩尔多瓦 |
| Montenegro | 黑山 | Saint Martin | 圣马丁 |
| Madagascar | 马达加斯加 | Marshall Islands | 马绍尔群岛 |
| North Macedonia | 北马其顿 | Mali | 马里 |
| Myanmar | 缅甸 | Mongolia | 蒙古 |
| Macao | 中国澳门 | Northern Mariana Islands | 北马里亚纳群岛 |
| Martinique | 马提尼克 | Mauritania | 毛里塔尼亚 |
| Montserrat | 蒙特塞拉特 | Malta | 马耳他 |
| Mauritius | 毛里求斯 | Maldives | 马尔代夫 |
| Malawi | 马拉维 | Mexico | 墨西哥 |
| Malaysia | 马来西亚 | Mozambique | 莫桑比克 |
| Namibia | 纳米比亚 | New Caledonia | 新喀里多尼亚 |
| Niger | 尼日尔 | Norfolk Island | 诺福克岛 |
| Nigeria | 尼日利亚 | Nicaragua | 尼加拉瓜 |
| Netherlands | 荷兰 | Norway | 挪威 |
| Nepal | 尼泊尔 | Nauru | 瑙鲁 |
| Niue | 纽埃 | New Zealand | 新西兰 |
| Oman | 阿曼 | Panama | 巴拿马 |
| Peru | 秘鲁 | French Polynesia | 法属波利尼西亚 |
| Papua New Guinea | 巴布亚新几内亚 | Philippines | 菲律宾 |
| Pakistan | 巴基斯坦 | Poland | 波兰 |
| Saint Pierre and Miquelon | 圣皮埃尔和密克隆 | Pitcairn Islands | 皮特凯恩群岛 |
| Puerto Rico | 波多黎各 | Palestine | 巴勒斯坦 |
| Portugal | 葡萄牙 | Palau | 帕劳 |
| Paraguay | 巴拉圭 | Qatar | 卡塔尔 |
| Reunion | 留尼汪 | Romania | 罗马尼亚 |
| Serbia | 塞尔维亚 | Russia | 俄罗斯 |
| Rwanda | 卢旺达 | Saudi Arabia | 沙特阿拉伯 |
| Solomon Islands | 所罗门群岛 | Seychelles | 塞舌尔 |
| Sudan | 苏丹 | Sweden | 瑞典 |
| Singapore | 新加坡 | Saint Helena | 圣赫勒拿 |
| Slovenia | 斯洛文尼亚 | Svalbard and Jan Mayen | 斯瓦尔巴和扬马延 |
| Slovakia | 斯洛伐克 | Sierra Leone | 塞拉利昂 |
| San Marino | 圣马力诺 | Senegal | 塞内加尔 |
| Somalia | 索马里 | Suriname | 苏里南 |
| South Sudan | 南苏丹 | Sao Tome and Principe | 圣多美和普林西比 |
| El Salvador | 萨尔瓦多 | Sint Maarten | 荷属圣马丁 |
| Syria | 叙利亚 | Eswatini | 斯威士兰 |
| Turks and Caicos Islands | 特克斯和凯科斯群岛 | Chad | 乍得 |
| French Southern Territories | 法属南部领地 | Togo | 多哥 |
| Thailand | 泰国 | Tajikistan | 塔吉克斯坦 |
| Tokelau | 托克劳 | Timor-Leste | 东帝汶 |
| Turkmenistan | 土库曼斯坦 | Tunisia | 突尼斯 |
| Tonga | 汤加 | Turkey | 土耳其 |
| Trinidad and Tobago | 特立尼达和多巴哥 | Tuvalu | 图瓦卢 |
| Taiwan | 中国台湾 | Tanzania | 坦桑尼亚 |
| Ukraine | 乌克兰 | Uganda | 乌干达 |
| United States | 美国 | Uruguay | 乌拉圭 |
| Uzbekistan | 乌兹别克斯坦 | Vatican City | 梵蒂冈 |
| Saint Vincent and the Grenadines | 圣文森特和格林纳丁斯 | Venezuela | 委内瑞拉 |
| British Virgin Islands | 英属维尔京群岛 | U.S. Virgin Islands | 美属维尔京群岛 |
| Vietnam | 越南 | Vanuatu | 瓦努阿图 |
| Wallis and Futuna | 瓦利斯和富图纳 | Samoa | 萨摩亚 |
| Kosovo | 科索沃 | Yemen | 也门 |
| Mayotte | 马约特 | South Africa | 南非 |
| Zambia | 赞比亚 | Zimbabwe | 津巴布韦 |

## 17. 站点信息（`src/site/brand.ts`、`src/app/metadata.ts`）

| English | 中文建议 | 位置 |
| --- | --- | --- |
| OpenCut | OpenCut（品牌保留） | brand 4 |
| A simple but powerful video editor that gets the job done. In your browser. | 一款简单而强大的视频剪辑器，直接在浏览器里完成。 | brand 5 |
| OpenCut Wordmark | OpenCut 字标 | metadata 20 |

---

> 说明：`src/stickers/providers/countries-data.ts` 的别名/分组键（`aliases`、`REGION_GROUPS`）仅用于搜索，不显示，不译。
> `src/export` 里的 `mp4/webm/low/medium/high/very_high` 是内部编码，UI 显示走导出面板文案（见第 3 节），不译。
