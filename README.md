# OpenCut（纯静态网页剪辑器）

一个完全运行在浏览器里的视频剪辑器，源自 [OpenCut](https://github.com/opencut-app/opencut)（Legacy）。
解码、GPU 合成、预览、导出全部在客户端完成——**无任何后端**。

本副本已被裁剪为**纯静态站点**，并部署在子路径 `/pr/` 下
（`https://www.hptd.cn/pr/`）。

---

## 技术栈

- Next.js 16（静态导出，`output: "export"`）
- React 19 + Tailwind CSS 4
- `mediabunny` + WebCodecs 负责解码 / 编码
- `opencut-wasm`（WASM GPU 合成器）
- 媒体存储在浏览器本地：IndexedDB（项目）+ OPFS（文件）

推荐使用 **Chrome / Edge**（File System Access API、WebCodecs 支持最好）。

## 环境要求

- [Bun](https://bun.sh)（包管理器）——安装：`npm install -g bun`
- 运行时不需要 Node.js（纯静态），但构建由 Bun 驱动

## 本地开发

```bash
bun install
bun run dev
```

打开 **http://localhost:3000/pr/**

> `basePath` 是 `/pr`，站点位于 `/pr/` 下。直接访问
> `http://localhost:3000/` 会返回 404。

首页会跳转到 `/pr/projects/`；新建项目后进入
`/pr/editor/?project_id=xxx`。首次启动会联网下载 Google Fonts。

## 构建

```bash
bun run build
```

产物输出到 **`out/`** —— 把它的内容放到服务器上、对外提供 `/pr/` 路径即可
（示例：`/www/wwwroot/hptd/pr/`）。

完整的迁移说明见 [`docs/static-editor-deploy.md`](docs/static-editor-deploy.md)，
nginx 的 location 配置见 [`deploy/nginx-pr.conf`](deploy/nginx-pr.conf)
（`try_files` 回退 + `_next/static` 长缓存）。

## 目录结构

```
src/            应用代码（app/、components/、timeline/、preview/、services/ 等）
public/         静态资源（图标、logo、字体、特效、国旗、形状）
scripts/        字体精灵图生成脚本（可选）
next.config.ts  静态导出 + basePath=/pr
deploy/         nginx 配置
docs/           部署文档
```

## 项目文件（`.ocut`）

项目保存为一个本地的 `.ocut` 文件（zip 容器，内嵌全部素材）：

- **保存**：编辑器右上角 "Save" 按钮，或 `Ctrl+S`；首次保存用 "Save as…" 选择路径
- **打开**：首页 "Open project…"，或编辑器菜单里的 "Open project…"
- **最近打开**：首页列出最近用过的 `.ocut` 文件，可直接reopen
- 覆盖保存时先写临时文件、完成后再原子替换，旧文件安全
- 文件句柄存在浏览器里，重开页面后只需重新授权一次

> 需要 **Chromium 内核浏览器**（Chrome / Edge）——File System Access API 是前提。

## 已知限制

- 项目**不再自动保存**到浏览器；未点保存就关闭页面会丢失改动（关闭前会提示）。
- 在线音效库（Freesound 代理）已移除。
- 外部依赖：Google Fonts、HuggingFace 模型（语音转写），以及你导入的云端视频
  URL —— 离线或对方不支持 CORS 时不可用。
- 通过 URL 引用云端素材（而非内嵌）**尚未实现**。

## 许可证

[MIT](LICENSE)
