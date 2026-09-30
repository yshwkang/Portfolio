(function (P) {
  'use strict';

  const { renderMessage } = P.dom;

  const LOAD_ERROR = '콘텐츠를 불러오지 못했습니다. data/ 폴더의 데이터 파일이 index.html에 연결되어 있는지 확인해주세요.';

  function mount(rootId, data, render) {
    const root = document.getElementById(rootId);
    if (data) render(root, data);
    else renderMessage(root, LOAD_ERROR);
  }

  function main() {
    const { profile, skills, projects, experience } = P.data ?? {};

    P.initTheme(document.getElementById('theme-toggle'));
    P.initNav();
    document.getElementById('footer-year').textContent = new Date().getFullYear();

    if (profile) {
      P.render.hero(profile);
      const hero = document.getElementById('top');
      // 파티클이 시작된 경우에만 h1을 시각적으로 숨긴다 (실패하면 텍스트 h1이 그대로 보임)
      const particles = P.initParticles({
        container: hero,
        canvas: document.getElementById('hero-canvas'),
        text: profile.name,
      });
      if (particles) hero.classList.add('is-canvas');
    }

    mount('about-content', profile, P.render.about);
    mount('skills-content', skills, P.render.skills);
    mount('projects-content', projects, P.render.projects);
    mount('experience-content', experience, P.render.experience);
    mount('contact-content', profile, P.render.contact);
  }

  main();
})((window.Portfolio = window.Portfolio || {}));
