(function (P) {
  'use strict';

  const { el } = P.dom;

  const TYPE_LABEL = { work: '경력', education: '교육', award: '수상', cert: '자격' };

  function renderExperience(root, entries) {
    root.replaceChildren(
      el(
        'ol',
        { class: 'timeline' },
        entries.map((e) =>
          el(
            'li',
            { class: 'timeline__item' },
            el(
              'div',
              { class: 'timeline__meta' },
              el('span', { class: 'badge' }, TYPE_LABEL[e.type] ?? e.type),
              el('span', {}, e.period)
            ),
            el('h3', { class: 'timeline__title' }, e.title),
            e.org && el('p', { class: 'timeline__org' }, e.org),
            e.description && el('p', { class: 'timeline__desc' }, e.description)
          )
        )
      )
    );
  }

  P.render = P.render || {};
  P.render.experience = renderExperience;
})((window.Portfolio = window.Portfolio || {}));
