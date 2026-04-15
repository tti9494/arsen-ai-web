# meta-devil — 잔존 약점 탐색

## 미처 짚지 못한 것들

### 1. favicon.ico 없음
브라우저 탭에 빈 아이콘. 브랜드 인상 저하.
→ 텍스트 favicon (SVG) 추가 가능: `<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🤖</text></svg>">`

### 2. scroll-padding-top 없음
고정 네비게이션(~60px) 있는데 anchor 링크 이동 시 콘텐츠가 nav 뒤에 가림.
→ `html { scroll-padding-top: 80px; }` 추가 필요.

### 3. 히어로 CTA 첫 번째 버튼 앵커
`href="#projects"` — 프로젝트 섹션 이동 시 scroll-padding-top 없으면 헤딩이 잘림.

### 4. 에이전트 팀 섹션 `#agents` CSS
`.section` padding 100px인데 `#agents`에 배경 그라디언트는 올바르게 적용됨. OK.

### 5. Pretendard CDN 로드 실패 시 fallback
`font-family: 'Pretendard', -apple-system, ...` — CDN 실패해도 fallback 정의됨. OK.

## 우선 수정 권장
- scroll-padding-top: 80px (1줄 추가, UX 직접 영향)
- favicon SVG (1줄 추가, 브랜드)
