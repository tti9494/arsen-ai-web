# R3 — 디버그/수정 완료 (fixer + debugger)

## 적용된 수정 사항

| # | 항목 | 변경 내용 |
|---|------|----------|
| 1 | localhost URL × 2 | `http://localhost:8100` → `https://hub.arsen-ai.com` |
| 2 | CSS 오타 | `flex-wrap: gap` → `flex-wrap: wrap` |
| 3 | rel 보안 속성 × 6 | 모든 target="_blank" 링크에 rel="noopener noreferrer" |
| 4 | 접근성 | 모바일 버튼 aria-label="메뉴 열기" |
| 5 | Pretendard CDN | jsDelivr CDN link 추가 |
| 6 | OG 메타 × 4 | og:title, og:description, og:type, og:url |
| 7 | prefers-reduced-motion | 애니메이션 비활성화 미디어 쿼리 추가 |

## 수정 후 상태
- 보안: 탭재킹 취약점 제거됨
- 접근성: 스크린리더 모바일 메뉴 버튼 읽힘
- 성능: 모션 민감 사용자 배터리 절약
- SEO/SNS: OG 태그로 공유 미리보기 지원
- 디자인: Pretendard 실제 로드됨
