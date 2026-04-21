# 튜토리얼: 10분 안에 "프롬프트 → 영상"

> 읽는 데 약 15분 (따라 하는 시간 10분 + 읽는 시간 5분) · 내부 테스트 기준 M2 MacBook Air에서 9분 43초

오늘 동네 날씨에 따라 추천 메뉴가 바뀌는 카페 홍보용 10초 영상을 만든다.
기상청 API 호출은 mock으로 대체하고, 본 목표는 "Claude Code가 스킬을 보고 컴포지션을 자동으로 구성하는 과정"을 체험하는 것이다.
끝까지 따라 하면 `out/weather-menu.mp4`가 생긴다. 완성본은 [`examples/weather-menu`](../examples/weather-menu)에 있으니 먼저 실행해 보고 와도 된다.

## 이 튜토리얼에서 만들 것

- 해상도 1080×1920 (세로 쇼츠)
- 길이 10초 / 30fps / 300 frames
- 구성: 오프닝(2초) → 날씨 아이콘(3초) → 추천 메뉴(4초) → CTA(1초)
- 완성 예시 영상: [`assets/demo/weather-menu.mp4`](../assets/demo/README.md) (저장소에 포함 예정)

## 0분 - 프로젝트 준비

```bash
npx create-video@latest weather-menu --template=blank
cd weather-menu && npm i
```

**이 단계에서 막히면?** `npx` 실행 시 `npm ERR! 404 'create-video@latest' is not in this registry`가 나면 npm 캐시나 private registry 설정 문제다. `npm config get registry`로 공용 registry 확인 후 `npm cache clean --force`.

## 2분 - 스킬 주입

이 저장소의 [`skills/weather-menu.md`](../skills/weather-menu.md)와 [`skills/remotion-composition.md`](../skills/remotion-composition.md)를 복사해서 새 프로젝트의 `.claude/skills/`에 넣는다 (디렉토리 없으면 생성). 스킬 파일은 frontmatter의 `name`·`depends_on`을 보고 Claude Code가 로드 순서를 결정한다.

**이 단계에서 막히면?** `.claude/` 디렉토리가 `.gitignore`에 잡혀 커밋이 안 되는 경우가 있다. 로컬 사용만 할 거면 의도한 것이니 그대로 둔다. 팀과 공유하려면 `!.claude/skills/`를 `.gitignore`에 추가해 예외 처리.

## 5분 - 첫 프롬프트

`claude`로 Claude Code를 띄우고 아래처럼 입력한다.

```
오늘 서울 날씨가 비라고 가정하고, 따뜻한 메뉴 3개(아메리카노/카페라떼/유자차)를
추천하는 10초 쇼츠를 만들어줘. 스킬은 weather-menu 참고.
```

에이전트가 `src/Root.tsx`, `src/WeatherMenu.tsx`, `src/Weather.tsx`, `src/Menu.tsx`, `src/schema.ts`를 생성/수정한다. 본 저장소 [`examples/weather-menu/src/`](../examples/weather-menu/src)가 정답지 역할.

**이 단계에서 막히면?** 에이전트가 스킬을 무시한다면 `CLAUDE.md` 파일에 `skills/weather-menu.md 내용을 반드시 따를 것` 한 줄 추가. 또는 프롬프트 첫 줄에 `[skill: weather-menu]` 태그를 박는다.

## 7분 - 미리보기

```bash
npm start
```

브라우저에 Remotion Studio(http://localhost:3000)가 뜬다. 타임라인에서 Space로 재생. 이상하면 프롬프트를 수정해서 "카페라떼 색상 좀 더 진하게" 같은 후속 지시를 던진다.

**이 단계에서 막히면?** Studio가 흰 화면이면 브라우저 콘솔에 `Failed to load font Pretendard` 에러가 있을 확률 높음. `public/fonts/PretendardVariable.woff2` 파일이 있는지 먼저 확인하고, 없으면 [`docs/01-setup.md`](./01-setup.md)의 한글 폰트 섹션 복귀.

## 9분 - 렌더링

```bash
npx remotion render src/index.ts WeatherMenu out/weather-menu.mp4
```

기본값으로 H.264 MP4가 나온다. GIF가 필요하면 확장자만 `.gif`로.

**이 단계에서 막히면?** 렌더 진행률이 50%에서 멈추면 `--concurrency=1 --log=verbose`로 재실행해 어느 프레임에서 걸리는지 본다. 실제로 자주 걸리는 지점은 `Menu.tsx`의 `spring()` 호출이 많은 프레임 — `damping` 값을 12→8로 낮추면 풀리는 경우 다수.

## 10분 - 커스터마이징

비가 아닌 "맑음" 케이스를 넣고 싶으면 Studio 우측 Props 패널에서 `condition`을 `sunny`로 바꾸고 `menus`를 `[{name:"아이스 아메리카노",...}, ...]`로 교체. Claude Code에 "맑은 날 버전도 만들어줘"라고 시키면 `schema.ts`의 enum을 활용해 자동으로 맞춘다.

## 다음 단계

- 실제 기상청 API 연동 → [`docs/03-patterns.md`](./03-patterns.md)의 "데이터 기반 리포트" 패턴
- 여러 영상 일괄 생성 → `@remotion/lambda` 또는 `renderMediaOnCloudRun` 검토
- 자동 업로드 → GitHub Actions로 S3/Cloudinary 푸시
