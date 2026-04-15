# R2 — 토론 및 우선순위 (debate)

## 필수 수정 (즉시)

| # | 항목 | 이유 |
|---|------|------|
| 1 | `rel="noopener noreferrer"` 추가 | 보안 모범사례, 비용 0 |
| 2 | 모바일 버튼 aria-label 추가 | 접근성, 한 줄 수정 |

## 권장 수정 (이번 배포 전)

| # | 항목 | 이유 |
|---|------|------|
| 3 | Pretendard CDN 추가 | 디자인 의도 실현 |
| 4 | OG 메타 추가 | SNS 공유 미리보기 |
| 5 | 통계 수치 확인 (30+ 에이전트) | 신뢰도 |

## 논쟁 포인트

**devil vs architect — Pretendard CDN 필요한가?**
- devil: 없으면 디자인 미반영
- architect: 외부 의존성 제로가 장점. 시스템 폰트도 충분히 좋음.
- **결론**: 추가. jsDelivr CDN은 안정적이고 GDPR 이슈 없음. `font-display: swap`으로 성능 보장.

**devil vs inspector — Safari 그리드 애니메이션**
- devil: 낮은 사양 모바일에서 버벅임
- inspector: prefers-reduced-motion 미디어 쿼리로 해결 가능
- **결론**: `@media (prefers-reduced-motion: reduce)` 추가. 배터리/접근성 모두 해결.

## 최종 수정 목록 (fixer에게 전달)
1. 모든 target="_blank" → rel="noopener noreferrer"
2. 모바일 버튼 aria-label
3. Pretendard CDN (jsDelivr)
4. OG 메타 (기본 4개)
5. prefers-reduced-motion 대응
