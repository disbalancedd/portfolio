(() => {
  const en = document.documentElement.lang === 'en';
  const icon = (path) => `<svg class="icon-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${path}"/></svg>`;
  const topButton = document.createElement('button');
  topButton.type = 'button';
  topButton.className = 'back-to-top';
  topButton.setAttribute('aria-label', en ? 'Back to top' : 'Nach oben');
  topButton.title = en ? 'Back to top' : 'Nach oben';
  topButton.innerHTML = icon('M12 19V5m-7 7 7-7 7 7');
  document.body.append(topButton);
  const updateTopButton = () => {
    const visible = window.scrollY > 400;
    topButton.classList.toggle('visible', visible);
    topButton.tabIndex = visible ? 0 : -1;
    topButton.setAttribute('aria-hidden', String(!visible));
  };
  window.addEventListener('scroll', updateTopButton, { passive: true });
  window.addEventListener('pageshow', updateTopButton);
  updateTopButton();
  topButton.addEventListener('click', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const main = document.querySelector('main');
    if (main) { main.setAttribute('tabindex', '-1'); main.focus({ preventScroll: true }); }
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  const items = [...document.querySelectorAll('.gallery-item:not(.project-archive-link)')];
  if (!items.length) return;
  const modal = document.createElement('div');
  modal.className = 'lightbox';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', en ? 'Image viewer' : 'Bildansicht');
  modal.tabIndex = -1;
  const labels = en ? ['Close', 'Previous image', 'Next image'] : ['Schließen', 'Vorheriges Bild', 'Nächstes Bild'];
  modal.innerHTML = `<button type="button" class="lightbox-close" aria-label="${labels[0]}">${icon('M6 6l12 12M18 6 6 18')}</button><button type="button" class="lightbox-prev" aria-label="${labels[1]}">${icon('M15 5 8 12l7 7')}</button><img alt=""><button type="button" class="lightbox-next" aria-label="${labels[2]}">${icon('m9 5 7 7-7 7')}</button>`;
  document.body.append(modal);
  const img = modal.querySelector('img');
  const close = modal.querySelector('.lightbox-close');
  let index = 0;
  let previous;
  function show(i) {
    index = (i + items.length) % items.length;
    img.src = items[index].href;
    img.alt = items[index].querySelector('img')?.alt || (en ? 'Project image' : 'Projektansicht');
  }
  function hide() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    img.removeAttribute('src');
    previous?.focus();
  }
  items.forEach((a, i) => a.addEventListener('click', (e) => {
    e.preventDefault();
    previous = a;
    show(i);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    close.focus();
  }));
  close.addEventListener('click', hide);
  modal.querySelector('.lightbox-prev').addEventListener('click', () => show(index - 1));
  modal.querySelector('.lightbox-next').addEventListener('click', () => show(index + 1));
  modal.addEventListener('click', (e) => { if (e.target === modal) hide(); });
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') hide();
    if (e.key === 'ArrowRight') show(index + 1);
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'Tab') {
      const buttons = [...modal.querySelectorAll('button')];
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();
