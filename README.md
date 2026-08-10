# DreamTrajectory Project Page

Interactive project website for **DreamTrajectory: Trajectory-Guided Action Generation with World Model Alignment for Mobile Manipulation**.

## Features

- Responsive academic project page
- Paper figures and interactive method/results sections
- Seven real HTML5 demo video slots
- Videos autoplay, loop, play inline, and remain muted
- Poster images prevent empty video areas while media loads
- Click-to-zoom figures
- Simulation / real-world filters
- Copyable BibTeX
- GitHub Pages auto-deployment with GitHub Actions

## Video files

Place exactly these seven MP4 files in `assets/demo/`:

```text
overview.mp4
sim_pick_fruit.mp4
real_pick_fruit.mp4
sim_open_drawer.mp4
real_open_drawer.mp4
sim_close_fridge.mp4
real_close_drawer.mp4
```

All video elements are already wired in `index.html` with `autoplay muted loop playsinline`. `script.js` additionally enforces `muted = true` and `volume = 0`.

For web delivery, H.264 MP4 is recommended. Keep each video below GitHub's normal Git file limit; do not use Git LFS for a GitHub Pages site.

## Publish on GitHub Pages

This package already contains:

```text
.github/workflows/deploy.yml
```

After pushing the project to the `main` branch, open your repository on GitHub and select:

```text
Settings → Pages → Build and deployment → Source → GitHub Actions
```

After that, every push to `main` automatically republishes the site.

See **`DEPLOY_GITHUB.md`** for the full Chinese deployment guide and copy-paste commands.

## Main files

- `index.html` — page structure and content
- `style.css` — visual system and responsive layout
- `script.js` — interactions and video mute enforcement
- `assets/figure/` — paper figures
- `assets/demo/` — seven demo videos
- `.github/workflows/deploy.yml` — automatic GitHub Pages deployment
- `.nojekyll` — serve the static site without Jekyll processing
