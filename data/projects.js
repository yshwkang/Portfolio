window.Portfolio = window.Portfolio || {};
window.Portfolio.data = window.Portfolio.data || {};

window.Portfolio.data.projects = [
  {
    id: 'a11y-ui-kit',
    title: '접근성 중심 UI 컴포넌트 모음',
    summary: '모달, 탭, 드롭다운 등 자주 쓰는 UI를 키보드·스크린리더 기준으로 바닐라 JS로 구현한 컴포넌트 모음입니다.',
    tags: ['Vanilla JS', 'Accessibility', 'Web Components'],
    thumbnail: null,
    links: { demo: 'https://example.com/demo-a', repo: 'https://github.com/your-id/project-a' },
    role: '개인 프로젝트 (기획·설계·구현 100%)',
    problem: '기존 프로젝트의 커스텀 UI가 키보드 조작과 스크린리더에서 제대로 동작하지 않았습니다.',
    solution: [
      'WAI-ARIA Authoring Practices 패턴을 기준으로 포커스 관리와 키보드 인터랙션 설계',
      '공통 이벤트/포커스 트랩 로직을 모듈로 분리해 컴포넌트 간 재사용',
    ],
    result: [
      'Lighthouse 접근성 점수 ○○점 달성',
      '스크린리더(NVDA) 수동 테스트 시나리오 ○○건 통과',
    ],
  },
  {
    id: 'realtime-dashboard',
    title: '실시간 데이터 대시보드',
    summary: '여러 지표를 실시간으로 시각화하는 대시보드의 프론트엔드를 팀 프로젝트로 개발했습니다.',
    tags: ['JavaScript', 'REST API', '팀 프로젝트'],
    thumbnail: null,
    links: { demo: 'https://example.com/demo-b', repo: 'https://github.com/your-id/project-b' },
    role: '프론트엔드 담당 (팀 ○명: 프론트 ○ · 백엔드 ○ · 디자인 ○)',
    problem: '데이터 갱신 주기가 짧아 렌더링이 잦아지면서 화면이 끊기는 문제가 있었습니다.',
    solution: [
      '변경된 데이터만 부분 갱신하도록 렌더링 로직을 분리',
      'requestAnimationFrame 기반으로 갱신을 묶어 처리하고, 화면 밖 차트는 갱신 중단',
      'PR 리뷰와 브랜치 전략(Git Flow)으로 팀 협업 규칙 정립',
    ],
    result: [
      '차트 갱신 시 렌더링 시간 ○○% 단축',
      '팀 내 코드 리뷰 체크리스트 문서화',
    ],
  },
  {
    id: 'portfolio',
    title: '인터랙티브 포트폴리오 (이 사이트)',
    summary: '프레임워크 없이 Canvas 파티클, 다크 모드, 데이터 기반 렌더링을 구현한 포트폴리오입니다.',
    tags: ['Vanilla JS', 'Canvas', 'Performance'],
    thumbnail: null,
    links: { demo: '', repo: 'https://github.com/your-id/portfolio' },
    role: '개인 프로젝트 (기획·디자인·구현 100%)',
    problem: '화려한 인터랙션과 접근성·성능을 함께 만족시키는 포트폴리오가 필요했습니다.',
    solution: [
      'Canvas 2D 파티클을 직접 구현하고, 화면 밖·탭 비활성 시 루프 중단',
      'prefers-reduced-motion, 시맨틱 태그, 키보드 내비게이션 대응',
      '콘텐츠를 데이터 파일로 분리해 코드 수정 없이 갱신',
    ],
    result: [
      'Lighthouse Performance / Accessibility ○○점',
      '신규 프로젝트 추가 시 data/projects.js에 한 블록만 추가',
    ],
  },
];
