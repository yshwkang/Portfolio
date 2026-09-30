# CLAUDE.md

프론트엔드 개발자 개인 포트폴리오 웹앱. 기획 상세는 [PRD.md](PRD.md)를 참고한다. 이 문서는 코드를 수정할 때 지켜야 할 제약과 결정 사항만 담는다.

## 프로젝트 개요

- **목적**: 대기업 프론트엔드 채용 지원용 포트폴리오
- **디자인 톤**: 크리에이티브 (키네틱 타이포, 강한 포인트 컬러, 인터랙션 중심)
- **Hero 비주얼**: 이름이 Canvas 2D 파티클로 모이고 포인터에 반응
- **소통 언어**: 사용자와는 한국어로 대화한다.

## 절대 지켜야 할 제약

1. **`file://` 더블클릭으로 동작해야 한다.** 서버·빌드 도구를 요구하는 변경은 하지 않는다.
   - `fetch`, `type="module"`, `import`/`export`를 쓰지 않는다 (Chrome은 `file://`에서 모듈 스크립트도 막는다).
   - History API 경로 라우팅(`pushState`로 경로 변경)은 `file://`에서 막히므로, 라우팅이 필요하면 해시(`#/...`)만 쓴다.
2. **바닐라 JS만 사용한다.** 프레임워크·라이브러리·번들러를 추가하지 않는다.
3. **데이터는 `textContent`로만 넣는다.** `innerHTML`을 쓰지 않는다. 링크는 반드시 `safeHref()`를 거친다.
4. **접근성 가드레일**을 깨지 않는다: `prefers-reduced-motion` 대응, 스크롤 하이재킹 금지, 핵심 정보는 애니메이션 완료 전에도 읽혀야 함.

## 구조와 코드 패턴

```
index.html
css/   variables.css(디자인 토큰·다크모드) · base.css · components.css
js/    dom.js · theme.js · nav.js · main.js
       render/      hero · about · skills · projects · experience · contact
       components/  particles.js
data/  profile.js · skills.js · projects.js · experience.js
assets/             (resume.pdf 는 사용자가 직접 추가)
```

- **네임스페이스**: 모든 스크립트는 `(function (P) { ... })(window.Portfolio = window.Portfolio || {});` 형태의 IIFE로 작성하고 `window.Portfolio`에 붙인다 (`P.dom`, `P.render.*`, `P.initTheme`, `P.initNav`, `P.initParticles`, `P.data.*`).
- **로드 순서가 곧 의존 순서**다. `index.html`의 `<script defer>` 목록(데이터 → dom → theme/nav → render → particles → main)을 지키고, 새 파일은 의존하는 파일 뒤, `main.js` 앞에 추가한다.
- **콘텐츠 수정은 `data/*.js`만** 고친다. 코드 수정 없이 섹션 내용이 바뀌어야 한다. 데이터 스크립트는 `window.Portfolio.data.<이름> = ...` 을 채운다.
- **DOM 생성**은 `P.dom.el(tag, props, ...children)`을 쓴다 (`null`/`false` 자식은 무시, 배열은 평탄화).
- **정적 HTML의 섹션 제목/골격은 `index.html`에**, 내용은 렌더러가 `#<섹션>-content`에 채운다. 데이터 로드에 실패하면 `renderMessage`로 안내 문구를 보여준다.
- **스타일**: 색·폰트·간격은 `variables.css` 토큰만 사용한다. 다크 값은 `prefers-color-scheme`용과 `[data-theme="dark"]`용 두 곳에 있으므로 함께 수정한다. 테마는 `<head>` 인라인 스크립트가 렌더링 전에 적용한다(깜빡임 방지).
- 본문은 `word-break: keep-all`(한글 어절 단위 줄바꿈). `[hidden]`은 `display: none !important`로 보장한다.

## 파티클(js/components/particles.js) 메모

- 오프스크린 캔버스에 이름을 그려 `getImageData`로 샘플링 → 목표 좌표. 파티클 수 상한: 데스크톱 1500 / 모바일(≤720px) 500 (샘플링 간격을 늘려 맞춤, 점 반지름은 간격에 비례).
- 루프는 화면 밖(IntersectionObserver)·탭 비활성·모든 파티클 정지 시 멈추고 포인터 입력으로 재시작한다.
- 시간 간격 `dt`는 `[0.1, 2.5]`로 클램프한다 (rAF 타임스탬프가 `performance.now()`보다 앞설 수 있음).
- 파티클 초기화에 성공하면 `main.js`가 `#top`에 `.is-canvas`를 붙이고, 이때만 `<h1>`이 sr-only가 된다. 실패하면 텍스트 `<h1>`이 그대로 보인다.
- 캔버스는 `aria-hidden`. 이름 텍스트는 항상 DOM(`h1`)에 존재해야 한다.

## 검증 방법

- 문법: `node --check <파일>` (모든 JS), 브라우저에서 `index.html`을 `file://`로 직접 열어 확인한다.
- 화면 검증은 Chrome 헤드리스 + CDP(원격 디버깅)로 **실시간** 스크린샷을 찍는다. `--virtual-time-budget`은 requestAnimationFrame이 돌지 않아 파티클이 흩어진 채로 찍히므로 애니메이션 검증에 쓰지 않는다.
- 확인 항목: 다크/라이트, 모바일(390px) 가로 스크롤 없음, reduced-motion(정지 상태로 이름 표시), 마우스 반발, 콘솔 오류 없음.

## 콘텐츠 규칙

- 현재 데이터는 **샘플**이다 (이름 `홍길동`, 이메일 `hello@example.com`, 링크 `your-id`). 성과 수치는 지어내지 않고 `○○`로 남긴다. 사용자가 실제 내용을 주기 전까지 임의의 수치·경력을 만들지 않는다.
- 사용자의 개인 정보(이메일 등)를 사용자 요청 없이 사이트 콘텐츠에 넣지 않는다.
- 프로젝트 항목은 `role / problem / solution[] / result[]` 구조로 "문제 → 해결 → 결과"를 전달한다.

## 진행 현황

| 단계 | 상태 |
|---|---|
| **1차 (MVP)** | 완료: Hero(파티클), About, Skills, Projects(`<details>` 상세), Experience, Contact, Resume 링크, 반응형, 다크모드, 디자인 토큰 |
| **2차** | 미착수: 커스텀 커서, 스크롤 애니메이션, 프로젝트 필터·상세 모달, 접근성 점검 |
| **3차** | 미착수: 블로그, GitHub 위젯, 컴포넌트 Playground, i18n(`data/i18n/{ko,en}.js`), SEO/OG, 성능 튜닝 |

### 남은 결정 사항
- 블로그를 사이트 내부에서 운영할지, 외부 블로그와 연동할지
- 배포 플랫폼과 도메인
- 지원 기업군(IT / 제조·금융 등)에 따른 프로젝트 강조점

### 사용자가 직접 해야 할 일
- `data/*.js`를 실제 내용으로 교체
- `assets/resume.pdf` 추가 (없으면 이력서 링크가 열리지 않음. `profile.js`의 `resume`을 비우면 버튼이 숨겨짐)
