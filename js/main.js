/* =============================================
   main.js - 포트폴리오 인터랙션 전체 담당
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     1. 타이핑 애니메이션 (Hero 섹션)
  ───────────────────────────────────────── */
  const typingTarget = document.getElementById('typingText');
  const roles = [
    '서비스 기획자',
    'UX 기획자',
    'Product Manager',
    '문제 해결사',
  ];
  let roleIdx   = 0;
  let charIdx   = 0;
  let isDeleting = false;
  let typingTimer;

  function type() {
    const current = roles[roleIdx];

    if (isDeleting) {
      typingTarget.textContent = current.slice(0, charIdx - 1);
      charIdx--;
    } else {
      typingTarget.textContent = current.slice(0, charIdx + 1);
      charIdx++;
    }

    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIdx === current.length) {
      // 다 썼으면 1.5초 후 지우기 시작
      delay = 1500;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      // 다 지웠으면 다음 단어로
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 300;
    }

    typingTimer = setTimeout(type, delay);
  }

  type();


  /* ─────────────────────────────────────────
     2. 헤더 스크롤 스타일 변경
  ───────────────────────────────────────── */
  const header = document.getElementById('header');

  function onScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveNav();
  }

  window.addEventListener('scroll', onScroll, { passive: true });


  /* ─────────────────────────────────────────
     3. 스크롤 시 활성 네비게이션 하이라이트
  ───────────────────────────────────────── */
  const navLinks  = document.querySelectorAll('.nav__link');
  const sections  = document.querySelectorAll('main section[id]');

  function updateActiveNav() {
    let currentId = '';
    const scrollY = window.scrollY + window.innerHeight * 0.35;

    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop) {
        currentId = sec.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${currentId}`
      );
    });
  }


  /* ─────────────────────────────────────────
     4. 스크롤 reveal 애니메이션
  ───────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // 같은 부모 내 형제 요소들에 약간의 딜레이
          const siblings = Array.from(
            entry.target.parentElement.querySelectorAll('.reveal')
          );
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, idx * 80);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach(el => revealObserver.observe(el));


  /* ─────────────────────────────────────────
     5. 스킬 바 애니메이션 (화면에 보일 때)
  ───────────────────────────────────────── */
  const skillBars = document.querySelectorAll('.skill-bar__fill');

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const width  = target.dataset.width;
          // 약간의 지연 후 애니메이션 실행
          setTimeout(() => {
            target.style.width = `${width}%`;
          }, 300);
          skillObserver.unobserve(target);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillBars.forEach(bar => skillObserver.observe(bar));


  /* ─────────────────────────────────────────
     6. 프로젝트 필터링
  ───────────────────────────────────────── */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 활성 버튼 변경
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const match =
          filter === 'all' || card.dataset.category === filter;

        if (match) {
          card.classList.remove('hidden');
          // reveal이 이미 visible 처리 됐을 수 있으므로 강제 visible
          card.classList.add('visible');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  /* ─────────────────────────────────────────
     7. 프로젝트 모달
  ───────────────────────────────────────── */
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose   = document.getElementById('modalClose');

  // 모달 열기
  function openModal(card) {
    document.getElementById('modalBadge').textContent   = card.dataset.tags.split(' ')[0].replace('#', '');
    document.getElementById('modalTitle').textContent   = card.dataset.title;
    document.getElementById('modalPeriod').textContent  = card.dataset.period;
    document.getElementById('modalProblem').textContent = card.dataset.problem;
    document.getElementById('modalResearch').textContent = card.dataset.research;
    document.getElementById('modalInsight').textContent = card.dataset.insight;
    document.getElementById('modalFeature').textContent = card.dataset.feature;
    document.getElementById('modalResult').textContent  = card.dataset.result;
    document.getElementById('modalReview').textContent  = card.dataset.review;

    // 태그 렌더링
    const tagsEl = document.getElementById('modalTags');
    tagsEl.innerHTML = '';
    card.dataset.tags.split(' ').forEach(t => {
      const span = document.createElement('span');
      span.className   = 'tag tag--sm';
      span.textContent = t;
      tagsEl.appendChild(span);
    });

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // 모달 닫기
  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // "자세히 보기" 버튼 클릭
  document.querySelectorAll('.project-card__more').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.project-card');
      openModal(card);
    });
  });

  // 오버레이 클릭으로 닫기
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // 닫기 버튼
  modalClose.addEventListener('click', closeModal);

  // ESC 키로 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });


  /* ─────────────────────────────────────────
     8. 이메일 클립보드 복사 + 토스트
  ───────────────────────────────────────── */
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const toast        = document.getElementById('toast');
  let   toastTimer;

  function showToast(msg) {
    toast.innerHTML = `<i class="fa-solid fa-check"></i> ${msg}`;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.dataset.email;

      // Clipboard API 우선, 실패 시 fallback
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email)
          .then(() => showToast(`${email} 이(가) 복사되었습니다!`))
          .catch(() => fallbackCopy(email));
      } else {
        fallbackCopy(email);
      }
    });
  }

  function fallbackCopy(text) {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
    document.body.appendChild(el);
    el.select();
    try {
      document.execCommand('copy');
      showToast(`${text} 이(가) 복사되었습니다!`);
    } catch {
      showToast('복사 실패. 직접 주소를 복사해주세요.');
    }
    document.body.removeChild(el);
  }


  /* ─────────────────────────────────────────
     9. 모바일 햄버거 메뉴
  ───────────────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navList   = document.querySelector('.nav__list');

  navToggle.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('open');
    navToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // 메뉴 링크 클릭 시 닫기
  navList.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
      navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
      document.body.style.overflow = '';
    });
  });


  /* ─────────────────────────────────────────
     10. 스무스 스크롤 (앵커 클릭)
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = header.offsetHeight + 16;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ─────────────────────────────────────────
     11. 초기 실행
  ───────────────────────────────────────── */
  onScroll(); // 새로고침 시 현재 스크롤 위치 반영

}); // DOMContentLoaded 종료
