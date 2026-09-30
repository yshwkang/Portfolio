// 모든 스크립트는 window.Portfolio 네임스페이스를 공유한다 (file:// 에서도 동작하도록 ES 모듈을 쓰지 않는다)
(function (P) {
  'use strict';

  // 데이터는 항상 textContent로 삽입하고 innerHTML은 쓰지 않는다.
  function el(tag, props = {}, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
      if (value == null || value === false) continue;
      if (key === 'class') node.className = value;
      else node.setAttribute(key, value === true ? '' : value);
    }
    append(node, children);
    return node;
  }

  function append(node, children) {
    for (const child of children) {
      if (child == null || child === false) continue;
      if (Array.isArray(child)) append(node, child);
      else node.append(child);
    }
  }

  // 스킴이 있으면 http(s)/mailto만 허용하고, 스킴이 없는 상대 경로는 그대로 허용
  const ALLOWED_SCHEMES = ['http', 'https', 'mailto'];

  function safeHref(url) {
    if (!url) return null;
    const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(url);
    if (!scheme) return url;
    return ALLOWED_SCHEMES.includes(scheme[1].toLowerCase()) ? url : null;
  }

  function renderMessage(root, message) {
    root.replaceChildren(el('p', { class: 'status-message' }, message));
  }

  P.dom = { el, safeHref, renderMessage };
})((window.Portfolio = window.Portfolio || {}));
