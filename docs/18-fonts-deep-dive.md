# 폰트 심화 — Pretendard, Google Fonts, 다국어, Subset

> 읽는 데 약 12분 · 기준일 2026-04-15

한글 렌더가 한 번에 깨지는 가장 흔한 원인은 폰트다.
01-setup에선 `FontFace` 패턴만 다뤘으니, 이 문서는 실전에서 부딪히는 "Google Fonts 자동화", "파일 크기 절반으로 줄이기", "이모지 + 한글 + 영문 섞이기"를 정리한다.

## 한국어 웹폰트 후보

| 폰트 | 파일 크기 (Regular 기준) | 특징 |
|---|---|---|
| **Pretendard Variable** | 1.4 MB (Variable 단일) | 자연스러운 웨이트 전환, 제목/본문 모두 |
| Noto Sans KR | 웨이트당 약 150 KB | CJK 전 범위 지원, 정통적 |
| IBM Plex Sans KR | 웨이트당 약 200 KB | 모노스페이스 라인업과 통일감 |
| 나눔고딕/나눔명조 | 웨이트당 약 200 KB | 안정성, 정부 사이트 호환 |
| Apple SD Gothic Neo | — | 시스템 폰트 (fallback 용) |

99%의 영상에서 Pretendard Variable 1개면 충분. 필요 시 2차 fallback으로 Apple SD Gothic / Malgun Gothic.

## `@remotion/google-fonts` — 가장 편한 방법 (영문)

```bash
npm i @remotion/google-fonts
```

```tsx
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily, waitUntilDone } = loadFont("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

// Root.tsx에서 import만 하면 자동 로드. fontFamily를 style에 쓰기만 하면 끝
```

**한국어는 공식 지원 안 함** — Google Fonts에 Noto Sans KR이 있긴 하지만 `@remotion/google-fonts`의 패키지 생성 스크립트가 CJK를 건너뛴다. 한국어는 직접 `FontFace` 패턴 유지.

## 직접 로드 — `FontFace` 패턴

본 저장소 모든 예제가 쓰는 방식.

```ts
// src/fonts.ts
import { continueRender, delayRender, staticFile } from "remotion";

const handle = delayRender("Loading Pretendard");
const font = new FontFace(
  "Pretendard",
  `url(${staticFile("fonts/PretendardVariable.woff2")}) format("woff2-variations")`,
  { weight: "45 920" }  // Variable 폰트의 허용 범위
);
font.load().then((loaded) => {
  document.fonts.add(loaded);
  continueRender(handle);
}).catch(() => continueRender(handle));
```

`weight: "45 920"`가 중요하다 — Pretendard Variable은 45~920 범위의 모든 값을 지원. `"100 900"` 같은 일반 범위로 쓰면 일부 브라우저가 무시한다.

## Subset — 파일 크기 절반으로

1.4 MB가 부담스러우면 사용하는 글자만 추출. 예를 들어 제목만 쓰고 본문이 없는 타이틀 카드라면 subset으로 100KB 이하 가능.

```bash
# fonttools로 특정 유니코드 범위만 추출
pip install fonttools brotli
pyftsubset PretendardVariable.woff2 \
  --output-file=PretendardTitle.woff2 \
  --flavor=woff2 \
  --unicodes="U+0020-007E,U+AC00-D7AF" \
  --layout-features='*' \
  --no-hinting
```

유니코드 범위:
- `U+0020-007E`: 기본 ASCII
- `U+AC00-D7AF`: 한글 완성형 전체 (11,172자)
- `U+3130-318F`: 한글 자모
- `U+FF00-FFEF`: 전각 기호 (ex: 「」)

원하는 글자만 있는 실제 영상 스크립트로 `--text-file=` 옵션 쓰면 더 극단적으로 줄 수 있음 — 1MB → 50KB 규모.

## 다국어 — 한글 + 영문 + 이모지

세 종류를 섞으면 fallback 체인을 명시해야 한다.

```tsx
<div style={{
  fontFamily: 'Pretendard, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
  fontSize: 64,
}}>
  안녕 Hello 🎉
</div>
```

- Pretendard에 없는 글자(이모지 등) → 다음 폰트로 자동 fallback
- 이모지 폰트가 OS마다 다름 (Apple Color Emoji / Segoe UI Emoji / Noto Color Emoji) — 3개 다 명시
- 렌더 환경은 대체로 Linux → Noto Color Emoji가 실제 사용됨

Lambda 렌더의 Chromium에는 Noto Color Emoji가 기본 포함. 로컬 Linux에선 `fonts-noto-color-emoji` 패키지 설치 필요.

## Variable 폰트로 애니메이션

Variable 폰트의 진짜 가치 — 웨이트를 프레임마다 부드럽게 바꿀 수 있다.

```tsx
const weight = interpolate(frame, [0, 30], [300, 800], { extrapolateRight: "clamp" });
<div style={{ fontFamily: "Pretendard", fontVariationSettings: `"wght" ${weight}` }}>
  숨쉬는 텍스트
</div>
```

`fontVariationSettings`가 핵심. `fontWeight`만 쓰면 일반 폰트처럼 100 단위로 스냅되어 부드럽지 않다.

## 성능 — 폰트는 캐시된다

`delayRender`로 로드한 폰트는 같은 Remotion 세션에서 재마운트되어도 재다운로드 없음. 여러 컴포지션에서 같은 폰트를 쓰면 `fonts.ts` 한 파일에서만 로드하고 각 컴포지션 Root에서 `import "./fonts"` 한 줄만 추가.

Lambda·Cloud Run에선 함수 재사용(warm start) 중에는 캐시 유지, cold start마다 재다운로드. 그래서 폰트를 `public/`에 넣으면 Lambda 패키지에 포함되어 CDN 요청 자체가 사라짐 — 권장.

## 흔한 함정

1. **"글자가 네모(□)로 렌더됨"** — 폰트 로드 전에 렌더 시작. `delayRender` 누락이 99%
2. **Studio에선 보이는데 렌더만 깨짐** — Studio는 시스템 폰트를 찾지만, 렌더는 Chromium 단독 실행 → 시스템 폰트 접근 불가
3. **CJK 글자 일부만 깨짐** — Noto Sans KR의 일부 subset만 로드한 경우. 완성형 전체(`U+AC00-D7AF`) 포함 확인
4. **`font-weight: 700`인데 굵게 안 보임** — Variable 폰트인데 `weight` 범위 지정이 잘못됨. `"45 920"` 형식 확인
5. **이모지만 크기가 이상함** — 이모지 폰트는 일반 폰트와 기본 라인 높이가 달라, `line-height: 1.4` 같이 명시해야 안정

다음 — 이제 테스트하자: [`docs/19-testing.md`](./19-testing.md).
