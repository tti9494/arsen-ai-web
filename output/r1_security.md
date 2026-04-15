# R1 — 보안 점검 (security)

## XSS
- ✅ 사용자 입력 없음 → XSS 공격면 없음
- ✅ innerHTML 사용 없음 (textContent만 사용)
- ✅ eval() 없음

## 탭재킹 (Tabnapping)
- ❌ `target="_blank"` 링크 5개에 rel 속성 없음
  - GitHub (nav, contact, footer)
  - YouTube (youtube, footer)
  - 텔레그램 (contact)
- **위험도**: 낮음 (외부 링크가 신뢰할 수 있는 서비스이나 모범사례 미준수)
- **수정**: rel="noopener noreferrer" 추가

## 정보 노출
- ✅ API 키, 시크릿 없음
- ✅ 내부 구조 노출 없음

## CSP
- ⚠️ Content-Security-Policy 헤더 없음 — 서버 설정에서 추가 권장
- HTML 메타로 기본 CSP 추가 가능: `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'unsafe-inline';">`
  → 인라인 JS 사용으로 'unsafe-inline' 필요 → 실질적 보호 제한적. 서버 레벨 권장.

## 결론
정적 HTML 특성상 공격면 매우 작음. rel="noopener noreferrer" 수정 필수.
