# R1 — 악마의 변호인 (devil)

## 1. "30+ AI 에이전트" 통계 — 실제인가?
히어로 섹션 stats-bar에 "30+ AI 에이전트"라고 표시. 현재 아이클라우드 에이전트 파일 기준으로 실제 에이전트 수가 30개 이상인지 확인 필요. 허수 수치는 신뢰도를 오히려 낮춤.

## 2. "운영 중" 배지 — 모든 카드에 동일
4개 프로젝트 모두 "운영 중" 상태. sns-ops, ai-tools가 실제 운영 중인지, 개발 중인지 확인 필요. 거짓 상태 표시는 방문자 오해 유발.

## 3. 텔레그램 링크 `t.me/tti9494`
이 텔레그램 링크가 실제 존재하는지 확인 안 됨. 없는 링크는 404보다 나쁜 UX.

## 4. YouTube URL `youtube.com/@tti9494`
채널 핸들이 `@tti9494`인지 확인 필요. 유튜브는 채널 이름 변경 시 URL도 바뀜.

## 5. Pretendard 폰트 미로드
CSS에 `font-family: 'Pretendard'` 선언했지만 CDN 없음. 방문자 기기에 Pretendard 설치된 경우 거의 없음 → 실제로는 시스템 폰트가 항상 사용됨. 디자인 의도가 반영 안 됨.
→ jsDelivr CDN: `@font-face` 또는 `<link>` 추가 권장

## 6. 히어로 배경 그리드 — Safari 성능
`animation: gridMove 20s linear infinite` — background-position 애니메이션은 Safari에서 합성 레이어 미사용 → 낮은 사양 모바일에서 버벅임 가능.

## 판정
수치/링크 정확성 확인 필요. Pretendard CDN 추가 권장. 나머지는 수용 가능.
