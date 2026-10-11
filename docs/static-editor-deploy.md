# 静态化改造说明（OpenCut Legacy → 纯静态 / pr/ 子目录）

> 目标：把经典版 Next.js 应用改成**纯客户端静态站点**，部署到 `https://www.hptd.cn/pr/`，nginx 直接托管，无任何后端。
>
> 本仓库已**扁平化**：原 `apps/web/` 的内容现在直接位于仓库根目录，`apps/` 层级已删除。
>
> ⚠️ 本文档只覆盖"静态化 + 子路径部署"。**手动保存项目 zip（File System Access API、Ctrl+S）是尚未实现的新功能**，不在本次改动范围内。

---

## 1. 结论

改造后：

- 服务器只托管静态文件（HTML/JS/CSS/WASM/字体/图标），**无需 Node、数据库、Redis、Cloudflare Worker**。
- 所有编辑能力（解码 / GPU 合成 / 预览 / 导出）本来就全在浏览器，未改架构。
- 新增 `basePath: /pr`，站点运行在 `www.hptd.cn/pr/`。

---

## 2. 关键文件改动

| 文件 | 改动 |
| --- | --- |
| `next.config.ts` | `output: "standalone"` → `"export"`；新增 `basePath: "/pr"`、`trailingSlash: true`；`images.unoptimized: true`；移除 `withBotId`、`withContentCollections` 包装 |
| `src/app/layout.tsx` | 移除 `BotIdClient`、`webEnv`、`ChangelogNotification`、Databuddy 统计脚本 |
| `src/app/page.tsx` | 首页改为客户端重定向到 `/projects` |
| `src/app/editor/[project_id]/page.tsx` | **删除**，改为 `src/app/editor/page.tsx`，用查询参数 `?project_id=` 取项目 id，并加 `Suspense` 包裹 |
| `src/app/projects/page.tsx` | 移除 `ChangelogNotification`；`/editor/{id}` 链接改为 `/editor?project_id={id}`；Home 指向 `/projects` |
| `src/components/providers/editor-provider.tsx` | 新建项目后 `router.replace` 目标改为 `/editor?project_id=...` |
| `src/components/editor/editor-header.tsx` | 移除 `FeedbackPopover` |
| `src/components/editor/mobile-gate.tsx` | 移除指向已删路由 `/roadmap` 的链接 |
| `public/manifest.json` | `start_url` 与图标路径加 `/pr` 前缀 |
| `public/browserconfig.xml` | 图标路径加 `/pr` 前缀 |
| `tsconfig.json` | 移除 `content-collections` 路径映射 |
| `package.json` | 移除服务端依赖与 `db:*`/`preview`/`deploy` 脚本 |
| `src/site/brand.ts` | `SITE_URL` / `DEFAULT_LOGO_URL` / OG 图 → `www.hptd.cn/pr/` |
| `src/app/metadata.ts` | 图标 / manifest / browserconfig 路径加 `/pr` |
| `src/fonts/google-fonts.ts`、`src/services/renderer/effect-preview.ts`、`src/stickers/providers/flags.ts` | 运行时读取的 public 资源路径加 `/pr` |
| `src/components/editor/panels/assets/*` | 移除 "Sounds" 标签页 |
| `src/services/storage/service.ts`、`types.ts` | 移除 saved-sounds 存储逻辑 |

### 为什么把动态路由改成查询参数

`output: export` 要求所有动态段在**构建时**用 `generateStaticParams` 枚举。项目 id 存在用户浏览器的 IndexedDB 里，构建时根本不存在，无法枚举。改成 `?project_id=` 后，`/editor/` 成为一个普通静态页，id 在运行时由客户端读取。

---

## 3. 已删除内容

### 3.1 后端 + 站点内容

- 后端：`src/app/api/`（auth / feedback / health / sounds）、`src/auth/`、`src/db/`、`src/env/`、`src/feedback/`、`src/app/rss.xml/`
- 站点内容：`src/app/{blog,brand,changelog,contributors,privacy,roadmap,sponsors,terms}/`、`src/blog/`、`src/changelog/`、`src/app/{robots.ts,sitemap.ts,base-page.tsx}`
- 营销组件：`src/components/{landing,header.tsx,footer.tsx,gitHub-contribute-section.tsx}`
- 站点数据：`src/site/{external-tools.ts,sponsors.ts}`
- 在线音效：`src/sounds/`（搜索 UI、sounds-store、类型）及 storage 中的 saved-sounds 逻辑
- 部署/构建配置：`open-next.config.ts`、`wrangler.jsonc`、`content-collections.ts`、`Dockerfile`、`drizzle.config.ts`、`migrations/`

### 3.2 扁平化时删除的 monorepo 内容

- `apps/`（内容已上移到根）、`rust/`、`Cargo.toml`、`Cargo.lock`、`target/`
- `notes/`、`script/`、`eslint/`、`biome.json`、`eslint.config.mjs`、`.prettierrc.json`、`.prettierignore`
- `turbo.json`、`.dockerignore`、`.npmrc`、`.tokeignore`、`.vscode`、根 `README.md`

> 保留：`src/`、`public/`、`scripts/`、`next.config.ts`、`postcss.config.mjs`、`tsconfig.json`、`package.json`、`components.json`、`bun.lock`、`deploy/`（nginx）、`docs/`、`LICENSE`。
>
> 备份位置（本项目无 git，误删可从这里恢复）：
> - 扁平化前：`C:\Users\cyzx119\AppData\Local\Temp\opencode\opencut-flatbak-20261011-124338`
> - 静态化前：`C:\Users\cyzx119\AppData\Local\Temp\opencode\opencut-backup-20261011-115242`

---

## 4. 构建与本地预览

安装依赖（Bun）：

```bash
bun install
```

本地开发：

```bash
bun run dev
```

打开 **http://localhost:3000/pr/**（因为 `basePath = /pr`，根路径 `/` 会 404）。

首页自动跳 `http://localhost:3000/pr/projects/`；新建项目后进入 `http://localhost:3000/pr/editor/?project_id=xxx`。首次启动会联网下载 Google Fonts。

构建静态产物：

```bash
bun run build
```

产物目录：**`out/`**（静态 HTML/JS/CSS + `_next/` 资源 + `public` 内文件）。

> 注意：本次改动**未经过构建验证**（约束禁止执行 build）。首次构建若报类型/引用错误，按报错补齐即可；最可能出问题的点是静态预渲染阶段 `EditorCore` 是否触碰浏览器 API。

预览构建产物（验证静态导出）：

```bash
bun run build
npx serve out
# 因为 basePath=/pr，本地静态服务器需把 out/ 挂在 /pr 路径下
```

---

## 5. 部署目录结构

把 `out/` 的**内容**整体放到服务器的 `/pr/` 目录下（示例路径 `/www/wwwroot/hptd/pr/`）：

```
/www/wwwroot/hptd/
├── (域名根目录的其他站点文件...)
└── pr/                          ← out/ 的内容
    ├── index.html               ← 根重定向页
    ├── projects/index.html
    ├── editor/index.html
    ├── _next/static/...         ← JS / CSS / 字体
    ├── icons/
    ├── logos/
    ├── fonts/
    ├── effects/  flags/  shapes/
    ├── favicon.ico
    ├── manifest.json
    └── ...（public 下的其余资源）
```

因为 `basePath = /pr`，页面里引用的资源 URL 形如 `/pr/_next/...`，与上面目录一一对应。

---

## 6. nginx 配置

见仓库内 `deploy/nginx-pr.conf`。核心片段：

```nginx
location = /pr { return 301 /pr/; }

location /pr/ {
    alias /www/wwwroot/hptd/pr/;
    try_files $uri $uri/ /pr/index.html;
    index index.html;
}

location /pr/_next/static/ {
    alias /www/wwwroot/hptd/pr/_next/static/;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

重载：`nginx -t && nginx -s reload`。

---

## 7. 已知限制 / 待办（重要）

1. **在线音效功能已整块移除**：`src/sounds/` 已删除；资源面板移除 "Sounds" 标签页（`assets-panel-store.tsx`、`assets/index.tsx`）；`services/storage/service.ts` 中的 saved-sounds 存储逻辑一并删除。
2. **路径已统一到 `www.hptd.cn/pr/`**：`src/site/brand.ts`（`SITE_URL`、`DEFAULT_LOGO_URL`、OG 图）、`src/app/metadata.ts`（图标/manifest/browserconfig）、`public/manifest.json`、`public/browserconfig.xml`、`src/fonts/google-fonts.ts`（font atlas）、`src/services/renderer/effect-preview.ts`（预览图）、`src/stickers/providers/flags.ts`（国旗 SVG）均已加 `/pr` 前缀。
3. **外部依赖（非你的后端）**：Google Fonts、HuggingFace 转写模型、用户引用的云端视频 URL——离线或对方不支持 CORS 时不可用。
4. **项目文件（`.ocut`）已实现**：zip 容器内嵌全部媒体；`FileSystemFileHandle` 存在 IndexedDB；`Ctrl+S` / Save / Save As / Open；覆盖保存走"写临时文件 → `close()` 原子替换"。浏览器项目列表已停用，改为首页"打开文件 + 最近打开"。仍需 Chromium 内核。
5. **仍需 IndexedDB/OPFS 作会话草稿**：媒体二进制在编辑会话中仍需落脚点（GB 级不能全进内存）。

---

## 8. 回滚

本项目无 git。要从备份恢复，把备份目录内容覆盖回仓库根，然后 `bun install`。
