(function (P) {
  'use strict';

  const { el, safeHref } = P.dom;

  function list(items) {
    return el('ul', {}, items.map((text) => el('li', {}, text)));
  }

  function detailRow(label, content) {
    if (!content || (Array.isArray(content) && !content.length)) return null;
    const body = Array.isArray(content) ? list(content) : content;
    return [el('dt', {}, label), el('dd', {}, body)];
  }

  function thumb(project, index) {
    if (project.thumbnail) {
      return el(
        'div',
        { class: 'card__thumb' },
        el('img', { src: project.thumbnail, alt: `${project.title} 미리보기`, loading: 'lazy' })
      );
    }
    // 썸네일이 없으면 번호로 대체 (장식용이므로 스크린리더에서 숨김)
    return el('div', { class: 'card__thumb', 'aria-hidden': 'true' }, String(index + 1).padStart(2, '0'));
  }

  function links(project) {
    const items = [
      ['Live Demo', safeHref(project.links?.demo)],
      ['GitHub', safeHref(project.links?.repo)],
    ].filter(([, href]) => href);

    if (!items.length) return null;
    return el(
      'div',
      { class: 'card__links' },
      items.map(([label, href]) =>
        el(
          'a',
          { href, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `${project.title} ${label} (새 창)` },
          `${label} ↗`
        )
      )
    );
  }

  function card(project, index) {
    return el(
      'article',
      { class: 'card' },
      thumb(project, index),
      el('h3', { class: 'card__title' }, project.title),
      el('p', { class: 'card__summary' }, project.summary),
      el('ul', { class: 'chips', 'aria-label': '사용 기술' }, (project.tags ?? []).map((t) => el('li', { class: 'chip' }, t))),
      el(
        'details',
        { class: 'card__more' },
        el('summary', {}, '프로젝트 상세 보기'),
        el(
          'dl',
          {},
          detailRow('ROLE', project.role),
          detailRow('PROBLEM', project.problem),
          detailRow('SOLUTION', project.solution),
          detailRow('RESULT', project.result)
        )
      ),
      links(project)
    );
  }

  function renderProjects(root, projects) {
    root.replaceChildren(el('div', { class: 'projects-grid' }, projects.map(card)));
  }

  P.render = P.render || {};
  P.render.projects = renderProjects;
})((window.Portfolio = window.Portfolio || {}));
