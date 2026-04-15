# meta-structure — 구조 일관성 검토

## 섹션 흐름
hero → projects → agents → youtube → contact → footer
→ 01_plan.md UX 흐름과 완전 일치: 브랜드 인식 → 신뢰 형성 → 기술력 어필 → 커뮤니티 → CTA

## 스타일 일관성
- CSS 변수 사용 일관 (var(--bg), var(--primary) 등)
- 섹션 패딩: .section { padding: 100px 0 } — 모든 섹션 동일
- section-label / section-title / section-sub 패턴 일관
- 카드 컴포넌트: border-radius var(--radius) 일관

## 네이밍 일관성
- 클래스명: BEM 아닌 단순 semantic — 규모 적합
- ID: navbar, hero, projects, agents, youtube, contact — 명확

## 폰트 위계
- 히어로 타이틀: clamp(2.2rem, 6vw, 4.2rem) font-weight: 900
- 섹션 타이틀: clamp(1.8rem, 4vw, 2.8rem) font-weight: 800
- 카드 이름: 1.1rem font-weight: 700
- 본문: 0.9rem color: muted
→ 위계 명확

## 판정: ✅ 구조/일관성 우수
