# 웹디자이너 — arsen-ai 디자인 설계

## 컬러 팔레트
```
배경:     #0F0F1A (딥 다크 네이비)
카드:     #16162A (약간 밝은 다크)
테두리:   #2A2A4A (글로우 효과용)
주색:     #4F46E5 (인디고)
보조색:   #7C3AED (퍼플)
그라디언트: linear-gradient(135deg, #4F46E5, #7C3AED)
텍스트:   #F1F1FF (거의 흰색)
뮤트:     #8888AA
성공:     #10B981
```

## 폰트
- 제목: 'Pretendard' (한국어 최적화) → CDN 없으면 system-ui
- 본문: -apple-system, BlinkMacSystemFont
- 코드/강조: monospace

## 레이아웃
- max-width: 1200px, 중앙 정렬
- 섹션 패딩: 100px 상하
- 모바일: 16px 좌우 패딩, 단일 컬럼

## 컴포넌트 설계

### 네비게이션
- position: fixed, backdrop-filter: blur(12px)
- 배경: rgba(15,15,26,0.8)
- 스크롤 시 border-bottom 나타남

### 히어로
- 전체 화면 높이 (100vh)
- 배경: animated grid (CSS only)
- 타이틀: 4rem, 그라디언트 텍스트
- 타이핑 텍스트: 2rem, 인디고색

### 프로젝트 카드
- 2x2 그리드 (모바일: 1열)
- 배경: #16162A
- 호버: border 글로우 + translateY(-4px)
- 상단 아이콘 + 제목 + 설명 + 태그

### 에이전트 팀 그리드
- 4열 (모바일: 2열)
- 아이콘 + 팀명 + 역할 한 줄

### 애니메이션
- 스크롤 진입: fade-in + translateY(20px)
- 카드 호버: box-shadow 글로우
- 히어로 배경: CSS keyframes grid 이동
- 타이핑: JavaScript setInterval
