# DreamTrajectory — GitHub Pages 发布指南

本项目已经包含 GitHub Pages 自动部署工作流：

```text
.github/workflows/deploy.yml
```

只要 GitHub 仓库的 `main` 分支发生 push，GitHub Actions 就会自动重新发布网页。

## 推荐方式：Terminal 上传 + GitHub Actions 自动部署

### 1. 创建一个空 GitHub 仓库

在 GitHub 点击 **New repository**，例如命名为：

```text
DreamTrajectory
```

建议：

- Public（论文项目页最方便）
- 不要勾选 Add a README
- 不要添加 `.gitignore`
- 不要添加 License（除非你已经决定好许可证）

创建后复制仓库地址，例如：

```text
https://github.com/YOUR_USERNAME/DreamTrajectory.git
```

### 2. 确保 7 个视频已放入

```text
assets/demo/overview.mp4
assets/demo/sim_pick_fruit.mp4
assets/demo/real_pick_fruit.mp4
assets/demo/sim_open_drawer.mp4
assets/demo/real_open_drawer.mp4
assets/demo/sim_close_fridge.mp4
assets/demo/real_close_drawer.mp4
```

### 3. 在项目目录打开 Terminal

确认当前目录中能看到：

```text
index.html
style.css
script.js
.github/
assets/
```

然后执行：

```bash
git init
git add .
git commit -m "Publish DreamTrajectory project page"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/DreamTrajectory.git
git push -u origin main
```

如果 `origin` 已经存在，使用：

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/DreamTrajectory.git
git push -u origin main
```

### 4. GitHub 上只需配置一次 Pages

打开仓库：

```text
Settings → Pages
```

在 **Build and deployment → Source** 中选择：

```text
GitHub Actions
```

之后无需再设置。

### 5. 查看发布状态

进入：

```text
Actions → Deploy to GitHub Pages
```

绿色勾表示部署完成。

项目页地址通常是：

```text
https://YOUR_USERNAME.github.io/DreamTrajectory/
```

以后每次修改网页，只需：

```bash
git add .
git commit -m "Update project page"
git push
```

网页会自动更新。

---

## 重要：7 个视频的 GitHub 大小限制

GitHub 普通 Git 仓库不能接受单个超过 100 MiB 的文件；GitHub Pages 也不能使用 Git LFS。因此，建议每个 MP4 都压缩到 **100 MiB 以下**，论文网页视频最好控制在 5–30 MB 左右。

如果视频太大，可以用 ffmpeg：

```bash
ffmpeg -i input.mp4 \
  -c:v libx264 \
  -crf 24 \
  -preset medium \
  -movflags +faststart \
  -an \
  output.mp4
```

其中：

- `-an`：直接移除音轨，与你的网页永久静音需求一致
- `-movflags +faststart`：让网页视频更快开始播放
- `-crf 24`：适合网页展示；数值越大文件越小

如果还是太大，可以使用 `-crf 26` 或降低分辨率：

```bash
ffmpeg -i input.mp4 \
  -vf "scale=-2:720" \
  -c:v libx264 \
  -crf 24 \
  -preset medium \
  -movflags +faststart \
  -an \
  output.mp4
```

推荐论文主页视频：H.264 MP4、720p/1080p、无音轨、网页 faststart。

---

## 不推荐：直接在 GitHub 网页拖拽所有视频

GitHub 网页端上传单个文件的限制比 Git 命令行更严格。对于带多个 MP4 的论文主页，推荐使用 `git push`，而不是浏览器 Upload files。

---

## 项目根目录必须正确

GitHub 仓库根目录应该直接是：

```text
DreamTrajectory/
├── .github/
├── .nojekyll
├── index.html
├── style.css
├── script.js
├── assets/
├── README.md
└── DEPLOY_GITHUB.md
```

不要变成：

```text
DreamTrajectory/
└── DreamTrajectory-project-page/
    └── index.html
```

否则项目页根路径会不符合当前部署配置。
