(() => {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  const navAnchors = [...document.querySelectorAll('.nav-links a')];
  const progress = document.querySelector('.reading-progress i');
  const toast = document.querySelector('.toast');

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 1600);
  };

  const closeMenu = () => {
    links?.classList.remove('open');
    toggle?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  };

  toggle?.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  navAnchors.forEach(anchor => anchor.addEventListener('click', closeMenu));

  const updateScrollUI = () => {
    nav?.classList.toggle('scrolled', window.scrollY > 24);
    if (progress) {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      progress.style.transform = `scaleX(${Math.min(window.scrollY / max, 1)})`;
    }
  };
  updateScrollUI();
  window.addEventListener('scroll', updateScrollUI, { passive: true });

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -28px 0px' });

  document.querySelectorAll('.reveal').forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index % 4, 3) * 45}ms`;
    revealObserver.observe(el);
  });

  const sections = [...document.querySelectorAll('main section[id]')];
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-32% 0px -58% 0px', threshold: 0 });
  sections.forEach(section => sectionObserver.observe(section));

  // Interactive method stages.
  const methodCopy = {
    1: 'Observation forms the shared context for trajectory planning and whole-body control.',
    2: 'The trajectory stream becomes an explicit intention-level plan that conditions whole-body action generation.',
    3: 'The trajectory world model predicts what motion each candidate action chunk would physically induce.',
    4: 'Test-time scoring closes the plan–execution gap by selecting the smooth candidate that best matches the planned trajectory.'
  };
  const steps = [...document.querySelectorAll('.step[data-step]')];
  const focusIndex = document.querySelector('.method-focus-index');
  const focusText = document.querySelector('.method-focus strong');
  const activateStep = (step) => {
    const id = Number(step.dataset.step);
    steps.forEach(x => x.classList.toggle('active', x === step));
    if (focusIndex) focusIndex.textContent = `Stage ${String(id).padStart(2, '0')}`;
    if (focusText) {
      focusText.animate?.([{opacity:.25, transform:'translateY(3px)'}, {opacity:1, transform:'none'}], {duration:220, easing:'ease-out'});
      focusText.textContent = methodCopy[id];
    }
  };
  steps.forEach(step => {
    step.addEventListener('click', () => activateStep(step));
    step.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activateStep(step); }
    });
  });

  // Results: absolute success ↔ improvement over π0.5.
  const resultButtons = [...document.querySelectorAll('[data-result-mode]')];
  const setResultMode = (mode) => {
    resultButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.resultMode === mode));
    document.querySelectorAll('.result-card').forEach(card => {
      const highlight = card.querySelector('[data-result-highlight]');
      if (highlight) {
        highlight.classList.add('updating');
        setTimeout(() => {
          highlight.textContent = mode === 'gain' ? card.dataset.highlightGain : card.dataset.highlightAbsolute;
          highlight.classList.remove('updating');
        }, 110);
      }
      card.querySelectorAll('.bar-row[data-absolute]').forEach(row => {
        const value = Number(mode === 'gain' ? row.dataset.gain : row.dataset.absolute);
        const bar = row.querySelector('i');
        const label = row.querySelector('b');
        const width = mode === 'gain' ? Math.min((value / 30) * 100, 100) : value;
        if (bar) {
          bar.style.setProperty('--value', `${width}%`);
          bar.style.width = `${width}%`;
          bar.dataset.tooltip = mode === 'gain' ? `${value.toFixed(1)} pp gain` : `${value.toFixed(1)}% success`;
        }
        if (label) label.textContent = mode === 'gain' ? (value > 0 ? `+${value.toFixed(1)}` : '0.0') : value.toFixed(1);
      });
    });
  };
  resultButtons.forEach(btn => btn.addEventListener('click', () => setResultMode(btn.dataset.resultMode)));
  setResultMode('absolute');

  // Task domain filter: hide whole groups so no orphaned/empty grid cells remain.
  const taskButtons = [...document.querySelectorAll('[data-task-filter]')];
  const taskGroups = [...document.querySelectorAll('.task-group[data-domain]')];
  const setTaskFilter = (filter) => {
    taskButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.taskFilter === filter));
    let firstVisibleAssigned = false;
    taskGroups.forEach(group => {
      const show = filter === 'all' || group.dataset.domain === filter;
      group.hidden = !show;
      group.classList.remove('first-visible');
      if (show && !firstVisibleAssigned) {
        group.classList.add('first-visible');
        firstVisibleAssigned = true;
      }
    });
  };
  taskButtons.forEach(btn => btn.addEventListener('click', () => setTaskFilter(btn.dataset.taskFilter)));


  // Keep every paper video permanently muted and autoplay when possible.
  const paperVideos = document.querySelectorAll('video.paper-video');
  paperVideos.forEach(video => {
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    const enforceMute = () => {
      if (!video.muted) video.muted = true;
      if (video.volume !== 0) video.volume = 0;
    };
    video.addEventListener('volumechange', enforceMute);
    video.addEventListener('loadedmetadata', () => {
      enforceMute();
      const attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
    });
  });

  // Image lightbox. Legacy video-placeholder helper is kept harmlessly for compatibility.
  const modal = document.getElementById('media-modal');
  const modalImage = modal?.querySelector('.modal-image');
  const modalCaption = modal?.querySelector('.modal-caption');
  const videoHelp = modal?.querySelector('.modal-video-help');
  const videoCode = videoHelp?.querySelector('code');
  const closeButton = modal?.querySelector('.modal-close');
  let lastFocused = null;

  const openModal = () => {
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    closeButton?.focus();
  };
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    lastFocused?.focus?.();
  };
  const openImage = (container) => {
    const img = container.querySelector('img');
    if (!img || !modalImage || !videoHelp || !modalCaption) return;
    modalImage.hidden = false;
    videoHelp.hidden = true;
    modalImage.src = img.currentSrc || img.src;
    modalImage.alt = img.alt;
    const figcaption = container.querySelector('figcaption');
    modalCaption.textContent = container.dataset.caption || figcaption?.innerText || img.alt;
    openModal();
  };
  document.querySelectorAll('.zoomable').forEach(el => {
    el.addEventListener('click', () => openImage(el));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openImage(el); }
    });
  });
  const openVideoHelp = (el) => {
    if (!modalImage || !videoHelp || !videoCode || !modalCaption) return;
    modalImage.hidden = true;
    videoHelp.hidden = false;
    videoCode.textContent = el.dataset.videoPath;
    modalCaption.textContent = 'Video placeholder — layout dimensions are already reserved.';
    openModal();
  };
  document.querySelectorAll('.interactive-placeholder[data-video-path]').forEach(el => {
    el.addEventListener('click', () => openVideoHelp(el));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openVideoHelp(el); }
    });
  });
  closeButton?.addEventListener('click', closeModal);
  modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal?.classList.contains('open')) closeModal(); });

  // Clipboard support.
  document.querySelectorAll('[data-copy-target]').forEach(button => {
    button.addEventListener('click', async () => {
      const target = document.getElementById(button.dataset.copyTarget);
      if (!target) return;
      try {
        await navigator.clipboard.writeText(target.textContent.trim());
        const original = button.textContent;
        button.textContent = 'Copied';
        showToast('BibTeX copied');
        setTimeout(() => { button.textContent = original; }, 1600);
      } catch {
        button.textContent = 'Copy failed';
      }
    });
  });
})();
