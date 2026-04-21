# examples/finance-broll

Remotion이 차트·숫자·타이포를 정확하게 그리고, AI 생성(Veo/Sora) 또는 스톡 라이브러리(Pexels/Pixabay) B-roll을 씬 사이에 끼워 넣는 **하이브리드 파이프라인** 예제.

> 이 패턴이 왜 중요한가 — 차트/숫자는 정확성이 생명(Remotion으로 100% 결정적), B-roll은 분위기 연출용(AI 생성으로 충분). 둘을 합치면 "프로덕션 퀄리티 파이낸스 영상"이 자동화 가능해진다.

## 실행

```bash
npm install
npm run build:mock     # B-roll 영상 없이 그라데이션 플레이스홀더로 렌더
# 또는 진짜 B-roll로 렌더
bash ../../scripts/fetch-pretendard.sh   # 폰트
# public/broll/ 디렉토리에 mp4 추가 후 (아래 가이드)
npm start              # Studio
npm run build          # out/finance-broll.mp4
```

`USE_MOCK_BROLL=true` 환경변수가 있거나 `public/broll/`에 mp4가 없으면 자동으로 그라데이션 배경으로 폴백한다 — **B-roll 자산 없이도 빌드 가능**.

## 구조

```
src/
  index.ts
  Root.tsx              # Composition + calculateMetadata
  FinanceBroll.tsx      # TransitionSeries로 데이터 ↔ B-roll 교차
  fonts.ts
  motion.ts
  schema.ts
  data/
    mock.ts             # KOSPI/환율 mock
    broll.ts            # B-roll 클립 매니페스트 + 선택 로직
  scenes/
    Opening.tsx
    KospiCard.tsx       # 차트 + 숫자 (Remotion이 정확하게)
    ExchangeCard.tsx    # 환율 카드
    BrollClip.tsx       # OffthreadVideo + 그라데이션 폴백
    Cta.tsx
public/
  broll/
    MANIFEST.md         # B-roll 자산 가이드
    *.mp4               # gitignore 됨 (직접 추가)
  fonts/
```

## B-roll 자산 어디서?

세 가지 경로:

1. **AI 생성 (Veo · Sora · Runway)** — "drone shot of seoul financial district at dusk, cinematic, 5 seconds" 같은 프롬프트. 1080p 5초 클립이 가장 흔히 쓰는 단위
2. **무료 스톡 (Pexels Videos · Pixabay)** — `pexels.com/videos/?search=financial%20district` — CC0/CC-BY 라이선스
3. **자체 촬영** — 안정성 최고, 비용 최저, 시간 가장 큼

받은 클립은 `public/broll/<id>.mp4` 형식으로 저장하고, `src/data/broll.ts`의 `BROLL_CLIPS` 배열에 메타데이터 등록.

## 학습 포인트

- `<OffthreadVideo>` 임베드 (FFmpeg 사전 추출로 빠른 렌더)
- `TransitionSeries` + `fade()` 트랜지션
- 데이터 레이어를 B-roll 위에 `AbsoluteFill`로 합성 (블러 + 어둡게 처리)
- `calculateMetadata`에서 B-roll 매니페스트 동적 선택
- Mock 모드로 자산 없이 빌드 가능

## 스킬 참고

이 예제의 합성 규칙은 [`skills/broll-composition.md`](../../skills/broll-composition.md)에 명시되어 있다 — Claude Code에 같은 패턴의 새 영상을 만들라고 지시할 때 사용.
