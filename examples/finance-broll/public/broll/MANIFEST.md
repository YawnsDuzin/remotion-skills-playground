# public/broll — B-roll 자산 가이드

이 디렉토리에는 데이터 씬 사이에 끼워넣을 짧은 영상 클립을 둔다.
실제 mp4 파일은 `.gitignore`에 잡혀 있으므로 직접 추가해야 한다.

## 기본 매니페스트

`src/data/broll.ts`의 `BROLL_CLIPS` 배열에 등록된 ID — 같은 이름으로 mp4를 저장한다.

| ID | 파일명 | 추천 해상도 | 길이 | 톤 |
|---|---|---|---|---|
| `skyline-day` | `skyline-day.mp4` | 1080x1920 (세로) | 5~10초 | 밝음, 도시 |
| `trading-floor` | `trading-floor.mp4` | 1080x1920 | 5~8초 | 어두움, 모니터 |
| `skyline-night` | `skyline-night.mp4` | 1080x1920 | 5~10초 | 야경, 차분 |

해상도가 9:16이 아니어도 동작 — `objectFit: cover`로 자동 잘라냄.

## 어디서 받나

### 1. AI 생성 (가장 추천)

- **Veo 3** — Google의 영상 생성 모델. 프롬프트 예:
  - `aerial drone shot of seoul financial district at noon, cinematic, slow zoom in, no people, vertical 9:16, 5 seconds`
  - `modern trading floor interior, multiple monitors with charts, blue lighting, no people, vertical 9:16, 5 seconds`
  - `seoul skyline at night with light trails, time-lapse, cinematic, vertical 9:16, 5 seconds`
- **Sora** — OpenAI. 비슷한 프롬프트
- **Runway Gen-3** — 더 짧은 클립에 적합

비용: 클립당 약 $0.50~$2 (모델·길이별)

### 2. 무료 스톡

- **Pexels Videos**: https://pexels.com/videos/?search=financial+district (CC0)
- **Pixabay Videos**: https://pixabay.com/videos/search/skyline/ (CC0)
- **Mixkit**: https://mixkit.co/free-stock-video/ (Free License)
- 다운로드 후 `ffmpeg`로 9:16 크롭 권장

### 3. ffmpeg 크롭 예시

```bash
# 가로 1920x1080 → 세로 1080x1920로 중앙 크롭
ffmpeg -i source.mp4 -vf "crop=ih*9/16:ih,scale=1080:1920" -c:v libx264 -an public/broll/skyline-day.mp4
```

`-an`으로 오디오 트랙 제거 (BGM은 별도로 입힐 것).

## 새 클립 추가 절차

1. mp4 파일을 `public/broll/<id>.mp4`로 저장
2. `src/data/broll.ts`의 `BROLL_CLIPS` 배열에 메타데이터 추가
3. `src/schema.ts`의 `defaultProps.brollIds` 또는 props로 사용 ID 지정
4. `npm start`로 Studio에서 확인

## 라이선스 주의

- AI 생성: 모델 약관에 따라 상업 사용 가능 여부 확인 (Veo는 유료 플랜에서 상업 OK)
- Pexels/Pixabay/Mixkit: 대부분 CC0 또는 그에 준함, 출처 표기 권장
- YouTube 다운로드: **저작권 침해 가능성 매우 높음** — 사용 금지
