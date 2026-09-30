(function (P) {
  'use strict';

  const { el } = P.dom;

  function renderSkills(root, groups) {
    root.replaceChildren(
      el(
        'div',
        { class: 'skills-grid' },
        groups.map((group) =>
          el(
            'article',
            { class: 'skill-card' },
            el('h3', { class: 'skill-card__title' }, group.group),
            el(
              'ul',
              {},
              group.items.map((item) =>
                el(
                  'li',
                  {},
                  el('span', { class: 'skill-card__name' }, item.name),
                  item.note && el('span', { class: 'skill-card__note' }, item.note)
                )
              )
            )
          )
        )
      )
    );
  }

  P.render = P.render || {};
  P.render.skills = renderSkills;
})((window.Portfolio = window.Portfolio || {}));
