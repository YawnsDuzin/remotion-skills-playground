# 렌더링 — 로컬 / Lambda / Cloud Run

> 읽는 데 약 13분 · 기준일 2026-04-15

영상을 만드는 것보다 "여러 영상을 빠르게 뽑는 것"이 항상 더 어렵다.
Remotion은 세 가지 렌더 경로를 제공한다 — 로컬 머신, AWS Lambda, GCP Cloud Run. 각각의 손익분기점을 알면 비용·시간 모두 절약된다.

## 셋의 비교

| 경로 | 셋업 비용 | 영상당 비용 | 동시 처리 | 적합 |
|---|---|---|---|---|
| 로컬 | 0원 | 전기료 | CPU 코어 수 | 개발, 일 10편 미만 |
| AWS Lambda | 5분 | $0.001 / 1080p 30초 | 사실상 무한 | 일 100편 이상, 트래픽 폭발 대응 |
| GCP Cloud Run | 10분 | Lambda 대비 ±10% | 1000+ | GCP 생태계 사용 시 |

손익분기 — 일 100편 미만이면 로컬 충분. 그 이상이면 Lambda. Vercel/Netlify 같은 서버리스 함수에선 시간 제한 때문에 Remotion 렌더가 거의 불가능.

## 로컬 렌더 — CLI 옵션 전수

기본 명령:

```bash
npx remotion render <entry-point> <composition-id> <output-path>
```

자주 쓰는 옵션을 한 번에:

```bash
npx remotion render src/index.ts WeatherMenu out/v1.mp4 \
  --concurrency=4 \
  --codec=h264 \
  --crf=18 \
  --pixel-format=yuv420p \
  --props='{"city":"서울","condition":"rainy"}' \
  --log=verbose
```

| 옵션 | 의미 | 권장값 |
|---|---|---|
| `--concurrency=N` | 동시 렌더 워커 수 | CPU 물리 코어 수 - 1 |
| `--codec` | 출력 코덱 | `h264`(MP4), `h265`(HEVC), `vp9`(WebM), `gif`, `prores` |
| `--crf=N` | 품질 (0=무손실, 51=최저) | 18~23 |
| `--pixel-format` | 픽셀 포맷 | `yuv420p` (호환성), `yuv444p` (고품질) |
| `--props` | 컴포지션에 넘길 props (JSON) | — |
| `--frames=START-END` | 부분 렌더 | 디버깅 시 유용 |
| `--quality=N` | JPEG 중간 품질 (1~100) | 80 |
| `--gl=swiftshader` | GPU 백엔드 | Lambda/리눅스에선 자동 |
| `--log=verbose` | 상세 로그 | 디버깅 시 |

## 코덱 선택

- **H.264 (`h264`)**: 기본. 모든 곳에서 재생됨. 호환성 최우선.
- **H.265 / HEVC (`h265`)**: 절반 용량으로 같은 품질. 사파리·iOS는 OK, 일부 안드로이드 구형 기기 미지원.
- **VP9 (`vp9`)**: WebM 컨테이너. 유튜브 업로드 시 권장. 파일 약간 크지만 무손실 알파 지원.
- **ProRes (`prores`)**: 후편집용. 용량 큼 (10초 1080p ≈ 200MB).
- **GIF (`gif`)**: 5초 이하 짧은 영상에만. 색 한정 256개.
- **PNG sequence (`--image-format=png --frame-range`)**: 알파 채널 필요 시.

## Studio에서 렌더 — 버튼 한 번

`npm start`로 Studio가 떠 있으면 우측 상단 "Render" 버튼으로 GUI 렌더 가능. 옵션이 폼으로 노출돼 CLI를 외울 필요 없음. 다만 자동화엔 부적합 — 자동화는 CLI나 Node API.

## Node API — 프로그램으로 렌더

CLI를 셸에서 부르기 어려운 환경(Express 서버, 큐 워커)에선 Node API.

```ts
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

const bundled = await bundle({ entryPoint: "src/index.ts" });
const comp = await selectComposition({
  serveUrl: bundled,
  id: "WeatherMenu",
  inputProps: { city: "서울" },
});
await renderMedia({
  composition: comp,
  serveUrl: bundled,
  codec: "h264",
  outputLocation: "out/result.mp4",
  inputProps: { city: "서울" },
});
```

`bundle`은 한 번만 하고 캐시 가능 — N개 영상을 같은 컴포지션으로 뽑을 때 바인딩 비용을 안 낸다.

## AWS Lambda — 5분 셋업

```bash
# 1. AWS 자격증명을 ~/.aws/credentials에 세팅
# 2. 함수 배포 (1회)
npx remotion lambda functions deploy --memory=2048 --timeout=240

# 3. 사이트 빌드 후 S3에 업로드 (1회 또는 코드 변경 시)
npx remotion lambda sites create src/index.ts --site-name=weather-menu

# 4. 렌더 (영상마다)
npx remotion lambda render <function-name> https://<bucket>.s3.amazonaws.com/sites/<site-id>/index.html WeatherMenu \
  --props='{"city":"서울"}'
```

비용 — 1080p 30초 영상 1개 약 $0.001~$0.003. 메모리 2048MB, 동시 100개 기준 월 1,000편이면 $1~$3 수준.

**함정**:
- Lambda 함수 이름이 자동 생성되므로 `npx remotion lambda functions ls`로 확인
- 사이트는 `sites create`로 매번 새로 만들지 말고 `sites update`로 갱신
- 함수 timeout이 240초여도, 30초 이상 걸리는 영상은 메모리 늘리는 게 빠름 (3008MB까지 가능)

## GCP Cloud Run

문법은 Lambda와 거의 동일 — `lambda` 자리에 `cloudrun`. 자세한 건 [`@remotion/cloudrun` 공식 문서](https://www.remotion.dev/docs/cloudrun) 참조.

GCP 결제 계정 연결 + Cloud Run/Cloud Build/Storage API 활성화 필요. 한국 사용자는 도쿄 리전(`asia-northeast1`)이 레이턴시 가장 낮음.

## 일괄 렌더 — Node 스크립트로 N개 한 번에

100개 SNS 쇼츠 같은 경우.

```ts
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import topics from "./topics.json";

const bundled = await bundle({ entryPoint: "src/index.ts" });
const concurrency = 4;
for (let i = 0; i < topics.length; i += concurrency) {
  const batch = topics.slice(i, i + concurrency);
  await Promise.all(batch.map(async (t, j) => {
    const comp = await selectComposition({ serveUrl: bundled, id: "Shorts", inputProps: t });
    await renderMedia({
      composition: comp,
      serveUrl: bundled,
      codec: "h264",
      outputLocation: `out/${t.slug}.mp4`,
      inputProps: t,
    });
  }));
}
```

CPU가 8코어라면 `concurrency=4`(워커 4개 × 코어 2개씩)가 안전. 더 올리면 OS가 swap을 시작하면서 오히려 느려진다.

## 렌더 결과 검증

자동 파이프라인이라면 결과물이 진짜 만들어졌는지 확인하는 코드 필수.

```ts
import fs from "node:fs";

const stats = fs.statSync(outputPath);
if (stats.size < 100_000) {
  throw new Error(`Render produced suspiciously small file: ${stats.size} bytes`);
}
```

빈 영상이나 검은 영상은 종종 0 바이트가 아니라 100KB 정도 나오므로, 임계값은 영상 길이/해상도에 맞춰 조정.

다음 — 이 렌더를 GitHub Actions cron으로 자동화하려면 [`docs/10-deployment.md`](./10-deployment.md).
