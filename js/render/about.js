(function (P) {
  'use strict';

  const { el } = P.dom;

  function renderAbout(root, profile) {
    root.replaceChildren(
      el(
        'div',
        { class: 'about' },
        el(
          'div',
          { class: 'about__text' },
          profile.philosophy && el('blockquote', { class: 'about__quote' }, profile.philosophy),
          (profile.about ?? []).map((p) => el('p', {}, p))
        ),
        el(
          'aside',
          { class: 'about__side' },
          el('h3', {}, 'INTERESTS'),
          el('ul', {}, (profile.interests ?? []).map((i) => el('li', {}, i)))
        )
      )
    );
  }

  P.render = P.render || {};
  P.render.about = renderAbout;
})((window.Portfolio = window.Portfolio || {}));
