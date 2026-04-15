# R4 — 최종 보안 검토 (security)

## 수정 전후 비교

| 취약점 | 수정 전 | 수정 후 |
|--------|---------|---------|
| 탭재킹 | ❌ rel 없음 | ✅ noopener noreferrer |
| localhost 노출 | ❌ prod URL 아님 | ✅ hub.arsen-ai.com |
| XSS | ✅ 원래 안전 | ✅ 유지 |
| 정보 노출 | ✅ 원래 없음 | ✅ 유지 |

## 잔존 이슈 (허용 가능)
- CSP 헤더: 서버(Nginx/GCP) 설정 수준에서 추가 권장. HTML에서 인라인 JS 때문에 'unsafe-inline' 필요 → 제한적 효과.
- 인라인 JS: 외부 파일 분리 시 CSP 강화 가능하나, 현재 규모에서 과도함.

## 최종 판정: 배포 승인
정적 랜딩 페이지로서 보안 수준 충분.
