# Social Post Manager

## 项目简介

Social Post Manager 是一个基于 Next.js 和 NestJS 的全栈应用，允许用户在多个社交媒体平台上同时发布内容。目前支持 Twitter、小红书和即刻。

## 主要特性

- 多平台同步发布
- 图片上传支持
- 响应式设计，适配移动端
- 预览模式

## 技术栈

- 前端：Next.js, React, Emotion, Ant Design
- 后端：NestJS, GraphQL
- 部署：Vercel

## 本地开发

1. 克隆仓库：
   ```
   git clone https://github.com/your-username/social-post-manager.git
   cd social-post-manager
   ```

2. 安装依赖：
   ```
   pnpm install
   ```

3. 设置环境变量：
   复制 `.env.example` 到 `.env`，并填写必要的 API 密钥和访问令牌。

4. 启动开发服务器：
   ```
   pnpm run dev
   ```

5. 打开浏览器访问 `http://localhost:3000`

## Vercel 部署步骤

1. 在 Vercel 上创建一个新项目，并连接到你的 GitHub 仓库。

2. 在项目设置中，设置以下环境变量：
   - `TWITTER_API_KEY`
   - `TWITTER_API_SECRET`
   - `TWITTER_ACCESS_TOKEN`
   - `TWITTER_ACCESS_TOKEN_SECRET`
   - `JIKE_API_URL`
   - `JIKE_ACCESS_TOKEN`

3. 在 "Build & Development Settings" 中：
   - Framework Preset: Other
   - Root Directory: ./
   - 设置 Build Command 为 `cd apps/web && npm run build`
   - 设置 Output Directory 为 `apps/web/.next`

4. 点击 "Deploy" 按钮开始部署。

5. 部署完成后，Vercel 会提供一个 URL，你可以通过该 URL 访问你的应用。

## 贡献

欢迎提交 Pull Requests 来改进这个项目。对于重大更改，请先开 issue 讨论你想要改变的内容。

## 许可证

[MIT](https://choosealicense.com/licenses/mit/)