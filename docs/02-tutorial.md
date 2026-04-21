# 튜토리얼: 10분 안에 "프롬프트 → 영상"

> 읽는 데 약 15분 (따라 하는 시간 10분 + 읽는 시간 5분)

오늘 동네 날씨에 따라 추천 메뉴가 바뀌는 카페 홍보용 10초 영상을 만든다.
기상청 API 호출은 mock으로 대체하고, 본 목표는 "Claude Code가 스킬을 보고 컴포지션을 자동으로 구성하는 과정"을 체험하는 것이다.
끝까지 따라 하면 `out/weather-menu.mp4`가 생긴다.

## 이 튜토리얼에서 만들 것

- 해상도 1080×1920 (세로 쇼츠)
- 길이 10초 / 30fps / 300 frames
- 구성: 오프닝(2초) → 날씨 아이콘(3초) → 추천 메뉴(4초) → CTA(1초)

## 0분 - 프로젝트 준비

```bash
npx create-video@latest weather-menu --template=blank
cd weather-menu && npm i
```

**이 단계에서 막히면?** `npx` 실행 시 "template not found" 에러가 나면 npm 캐시 문제다. `npm cache clean --force` 후 재시도.

## 2분 - 스킬 주입

이 저장소의 `skills/weather-menu.md`를 복사해서 `.claude/skills/`에 넣는다 (디렉토리 없으면 생성).
스킬 파일은 "composition 작성 규칙"과 "카페 영상 스타일 가이드" 두 섹션으로 나뉘어 있다.

**이 단계에서 막히면?** `.claude/` 디렉토리가 gitignore에 잡혀 커밋이 안 되는 경우가 있다. 의도한 것이니 그대로 두고 진행.

## 5분 - 첫 프롬프트

`claude`로 Claude Code를 띄우고 아래처럼 입력한다.

```
오늘 서울 날씨가 비라고 가정하고, 따뜻한 메뉴 3개(아메리카노/카페라떼/유자차)를
추천하는 10초 쇼츠를 만들어줘. 스킬은 weather-menu 참고.
```

에이전트가 `src/Weather.tsx`, `src/Menu.tsx`, `src/Root.tsx`를 생성/수정한다.

**이 단계에서 막히면?** 에이전트가 스킬을 무시하는 것 같다면 `CLAUDE.md`에 `spark skills/weather-menu.md 내용을 반드시 따를 것` 한 줄 추가.

## 7분 - 미리보기

```bash
npm start
```

브라우저에 Remotion Studio가 뜬다. 타임라인에서 Space로 재생. 이상하면 프롬프트를 수정해서 "카페라떼 색상 좀 더 진하게" 같은 후속 지시를 던진다.

**이 단계에서 막히면?** Studio가 흰 화면이면 브라우저 콘솔에 폰트 로딩 에러가 있을 확률 높음. [`01-setup.md`](./01-setup.md)의 한글 폰트 섹션 복귀.

## 9분 - 렌더링

```bash
npx remotion render Root out/weather-menu.mp4
```

기본값으로 H.264 MP4가 나온다. GIF가 필요하면 확장자만 `.gif`로.

**이 단계에서 막히면?** 렌더 진행률이 50%에서 멈추면 `--concurrency=1 --log=verbose`로 재실행해 어느 프레임에서 걸리는지 본다.

## 10분 - 커스터마이징

비가 아닌 "맑음" 케이스를 넣고 싶으면 `src/Weather.tsx`의 `condition` prop을 `'sunny'`로 바꾸고 추천 메뉴 배열을 교체. Claude Code에 "맑은 날 버전도 만들어줘"라고 시켜도 된다.

## 다음 단계

- 실제 기상청 API 연동 → [`docs/03-patterns.md`](./03-patterns.md)의 "데이터 기반 리포트" 패턴
- 여러 영상 일괄 생성 → `@remotion/lambda` 또는 `renderMediaOnCloudRun` 검토
- 자동 업로드 → GitHub Actions로 S3/Cloudinary 푸시

---

## ✍️ 두진아님이 직접 채워야 할 부분

- [ ] `skills/weather-menu.md` 실제 파일 작성 후 저장소에 커밋
- [ ] 각 단계의 스크린샷 (Remotion Studio 타임라인, 렌더 결과 썸네일)
- [ ] 완성본 영상을 `assets/demo/weather-menu.mp4`로 저장 후 README에 임베드
- [ ] "이 단계에서 막히면?"에 본인이 실제 만나본 에러 원문 1~2개 교체
- [ ] 10분 안에 도달 가능한지 본인이 스톱워치 켜고 재검증
