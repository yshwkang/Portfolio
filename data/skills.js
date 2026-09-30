window.Portfolio = window.Portfolio || {};
window.Portfolio.data = window.Portfolio.data || {};

window.Portfolio.data.skills = [
  {
    group: 'Language',
    items: [
      { name: 'JavaScript (ES6+)', note: '모듈, 비동기 처리, 이벤트 기반 UI 구현' },
      { name: 'HTML5 / CSS3', note: '시맨틱 마크업, Grid·Flexbox 기반 반응형 레이아웃' },
      { name: 'TypeScript', note: '타입 기반 API 연동 및 공통 모듈 작성' },
    ],
  },
  {
    group: 'Framework · Library',
    items: [
      { name: 'React', note: '컴포넌트 설계와 상태 관리' },
      { name: 'Vanilla JS', note: '프레임워크 없이 라우팅·렌더링·상태 구현' },
    ],
  },
  {
    group: 'Tooling',
    items: [
      { name: 'Vite / Webpack', note: '번들링 설정과 빌드 최적화' },
      { name: 'Lighthouse / DevTools', note: '성능·접근성 측정 및 개선' },
      { name: 'ESLint / Prettier', note: '팀 코드 컨벤션 적용' },
    ],
  },
  {
    group: 'Collaboration',
    items: [
      { name: 'Git / GitHub', note: '브랜치 전략, PR 기반 코드 리뷰' },
      { name: 'Figma', note: '디자이너와 스펙 협의 및 디자인 토큰 정리' },
    ],
  },
];
