# examples/blog-summary

마크다운 블로그 포스트를 입력받아 60초 요약 영상을 만든다.
한국어 TTS(Naver CLOVA Voice) 통합, 음성 길이로 컴포지션 길이 자동 조정, 문장 단위 자막 동기화 패턴.

## 실행

```bash
npm install
cp .env.example .env   # 키 입력 또는 USE_MOCK_TTS=true
npm start              # Studio
npm run build          # out/summary.mp4
```

## 입력

`src/sample-post.md`가 기본 입력. props로 `markdown` 문자열을 직접 넘기면 다른 포스트도 가능.

## 구조

```
src/
  index.ts
  Root.tsx              # Composition + calculateMetadata (TTS + 길이 계산)
  BlogSummary.tsx       # 메인 컴포넌트
  scenes/
    Title.tsx
    SentenceCard.tsx    # 문장 단위 카드
    Cta.tsx
  fetch/
    tts.ts              # CLOVA 호출 + 캐싱
    parser.ts           # 마크다운 → 문장 배열
  schema.ts
  motion.ts
sample-post.md
public/
  audio/                # TTS 결과 (gitignore)
```

## 학습 포인트

- 외부 텍스트(마크다운)를 컴포지션의 1차 입력으로 받기
- TTS 결과를 디스크 캐싱해 비용 절감
- `getAudioDurationInSeconds`로 음성 길이 측정 → `durationInFrames` 자동 계산
- 문장마다 `Series.Sequence`로 자막 자동 분리
- mock TTS로 키 없이도 컴포지션 빌드 가능

## 한계

- 단어 단위 자막 동기화는 미구현 (STT 기반 timestamp 필요). v0.3에서 추가 예정
- 마크다운 파서는 단순 — 복잡한 표/코드 블록은 무시
