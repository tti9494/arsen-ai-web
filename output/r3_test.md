# R3 — 테스트 체크리스트 (tester)

## 정적 분석 (HTML/CSS/JS)

### HTML 유효성
- ✅ DOCTYPE 선언
- ✅ lang 속성
- ✅ 모든 태그 올바르게 닫힘
- ✅ 중복 id 없음 (navbar, navLinks, mobileBtn, typingText — 모두 유일)
- ✅ script 위치: body 끝

### CSS 유효성
- ✅ `flex-wrap: wrap` (수정됨)
- ✅ `clamp()` 지원 — Chrome 79+, Safari 13.1+, FF 75+
- ✅ `backdrop-filter` — Safari prefix (`-webkit-backdrop-filter`) 포함

### JavaScript 로직
- ✅ 타이핑 애니메이션: `wi`, `ci`, `deleting` 상태 관리 정확
  - 단어 끝 → 1800ms 대기 → 지우기 → 다음 단어
  - 배열 순환: `(wi + 1) % words.length`
- ✅ IntersectionObserver: `.visible` 클래스 추가로 fade-in
- ✅ 모바일 메뉴: 링크 클릭 시 자동 닫힘
- ✅ 스크롤 이벤트: scrollY > 20 시 scrolled 클래스

### 링크 유효성
- ✅ GitHub: https://github.com/tti9494
- ✅ YouTube: https://youtube.com/@tti9494
- ✅ 텔레그램: https://t.me/tti9494
- ✅ AI 모임 신청: https://hub.arsen-ai.com/frontend/join-full.html
- ✅ 모든 external 링크 rel="noopener noreferrer"

### 반응형
- ✅ 768px: 네비 숨김, 프로젝트 1열, 에이전트 2열
- ✅ 480px: 버튼 세로 정렬

## 최종 판정
모든 체크 통과. 배포 준비 완료.
