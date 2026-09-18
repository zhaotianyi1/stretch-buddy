# Stretch Buddy · 拉伸搭子

按身体部位读懂肌肉与神经，获得循证的拉伸剂量、分步动作方案与经核验的 YouTube 物理治疗示范。内容核对记录见 `SOURCES.md`。

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build      # 输出到 dist/
npm run preview    # 本地预览构建结果
```

## 部署

纯静态站点，任何静态托管都可以。

- **GitHub Pages**：`npm run deploy:gh-pages` 会以 `/stretch-buddy/` 为基础路径构建，并把 `dist/` 推送到 `gh-pages` 分支。
- **Vercel**：`npx vercel --prod`（自动识别 Vite，构建命令 `npm run build`，输出目录 `dist`）。
- **Netlify**：`npx netlify-cli deploy --prod`，配置见 `netlify.toml`。
- **Cloudflare Pages**：`npm run build && npx wrangler pages deploy dist`。

子路径托管时用 `BASE_PATH=/子路径/ npm run build`。
