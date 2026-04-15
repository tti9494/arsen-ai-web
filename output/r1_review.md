# R1 — 코드 리뷰 (inspector)

## HTML
- ✅ DOCTYPE, charset, viewport 완비
- ✅ lang="ko" 설정
- ✅ meta description 있음
- ⚠️ OG 메타 없음 (og:title, og:description, og:image)
- ⚠️ favicon 없음

## CSS
- ✅ CSS 변수 일관 사용
- ✅ clamp() 반응형 폰트
- ✅ 미디어 쿼리 768px / 480px
- ✅ transition 명시 (성능 양호)
- ✅ `will-change` 불필요하게 남용 안 함
- 수정됨: `flex-wrap: gap` → `flex-wrap: wrap`

## JavaScript
- ✅ 전역 변수 최소화 (wi, ci, deleting, el 만 전역)
- ✅ IntersectionObserver 적절한 threshold: 0.1
- ✅ 타이핑 애니메이션: setTimeout 재귀, 메모리 문제 없음
- ⚠️ `el` 변수명이 querySelectorAll 루프의 `el`와 충돌 가능성 (446번째 줄)
  → 루프 내 `el`은 블록 스코프 const이므로 실제 충돌 없음. 가독성 문제만 있음.

## 보안
- ⚠️ 외부 링크에 rel="noopener noreferrer" 없음 (target="_blank" 5개)
  → 탭재킹(tabnapping) 취약점 — 수정 필요

## 접근성
- ⚠️ 모바일 버튼 `<button class="nav-mobile-btn">☰</button>` aria-label 없음
- ⚠️ 이미지/아이콘 alt 없음 (이모지 아이콘은 스크린리더에서 읽힘 — 허용 가능)

## 수정 필요 항목
1. 모든 `target="_blank"` 링크에 `rel="noopener noreferrer"` 추가 (보안)
2. 모바일 버튼 `aria-label="메뉴 열기"` 추가 (접근성)
3. OG 메타 추가 권장 (선택)
