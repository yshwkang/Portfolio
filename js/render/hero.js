(function (P) {
  'use strict';

  const { el, safeHref } = P.dom;

  function renderHero(profile) {
    for (const node of document.querySelectorAll('[data-bind]')) {
      const value = profile[node.dataset.bind];
      if (typeof value === 'string') node.textContent = value;
    }

    document.title = `${profile.name} | ${profile.role}`;

    document.getElementById('hero-keywords').replaceChildren(
      ...(profile.keywords ?? []).map((k) => el('li', { class: 'chip' }, k))
    );

    // 이력서 링크: 경로가 없으면 버튼을 숨긴다
    const resume = safeHref(profile.resume);
    for (const link of document.querySelectorAll('[data-resume]')) {
      if (resume) link.href = resume;
      else link.hidden = true;
    }
  }

  P.render = P.render || {};
  P.render.hero = renderHero;
})((window.Portfolio = window.Portfolio || {}));
