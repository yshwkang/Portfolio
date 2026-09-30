(function (P) {
  'use strict';

  const KEY = 'theme';
  const root = document.documentElement;
  const systemDark = matchMedia('(prefers-color-scheme: dark)');

  function current() {
    return root.dataset.theme || (systemDark.matches ? 'dark' : 'light');
  }

  function notify() {
    window.dispatchEvent(new CustomEvent('themechange'));
  }

  P.initTheme = function initTheme(button) {
    button.addEventListener('click', () => {
      const next = current() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try {
        localStorage.setItem(KEY, next);
      } catch {}
      notify();
    });

    // 사용자가 직접 고르지 않았다면 시스템 설정 변경을 따라간다
    systemDark.addEventListener('change', () => {
      if (!root.dataset.theme) notify();
    });
  };
})((window.Portfolio = window.Portfolio || {}));
