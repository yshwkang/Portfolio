(function (P) {
  'use strict';

  const { el, safeHref } = P.dom;

  const LINKS = [
    ['github', 'GitHub'],
    ['blog', 'Blog'],
    ['linkedin', 'LinkedIn'],
  ];

  function renderContact(root, profile) {
    const { contact = {} } = profile;
    const email = contact.email && safeHref(`mailto:${contact.email}`);
    const resume = safeHref(profile.resume);

    const socials = LINKS.map(([key, label]) => [label, safeHref(contact[key])]).filter(([, href]) => href);

    root.replaceChildren(
      el(
        'div',
        { class: 'contact' },
        email && el('a', { class: 'contact__mail', href: email }, contact.email),
        el(
          'div',
          { class: 'contact__links' },
          socials.map(([label, href]) =>
            el('a', { class: 'btn', href, target: '_blank', rel: 'noopener noreferrer' }, `${label} ↗`)
          ),
          resume && el('a', { class: 'btn btn--primary', href: resume, download: true }, '이력서 다운로드')
        )
      )
    );
  }

  P.render = P.render || {};
  P.render.contact = renderContact;
})((window.Portfolio = window.Portfolio || {}));
