/**
 * 사전 토큰화된 코드 스니펫.
 * 실전에선 Shiki 또는 Prism을 calculateMetadata에서 돌려 자동 생성 가능.
 * 여기선 의존성 최소화를 위해 수동 토큰 배열.
 */

export type Token = {
  text: string;
  /** 없으면 PALETTE.text 사용 */
  color?: string;
};

export type CodeLine = Token[];

/** VSCode Dark+ 테마 근사치 */
export const PALETTE = {
  keyword: "#C586C0",  // const, return, import, export
  string: "#CE9178",   // "..."
  function: "#DCDCAA", // 함수명
  variable: "#9CDCFE", // 변수
  type: "#4EC9B0",     // 타입
  comment: "#6A9955",  // //
  number: "#B5CEA8",   // 숫자
  bracket: "#FFD700",  // {}[]()
  jsxTag: "#569CD6",   // <h1>
  text: "#D4D4D4",     // 기본
  lineNumber: "#5A5A5A",
  bg: "#1E1E1E",
  highlightBg: "rgba(255, 215, 0, 0.08)",
};

const K = PALETTE.keyword;
const S = PALETTE.string;
const F = PALETTE.function;
const V = PALETTE.variable;
const T = PALETTE.type;
const B = PALETTE.bracket;
const J = PALETTE.jsxTag;

export const SNIPPET: CodeLine[] = [
  [
    { text: "import", color: K },
    { text: " { " },
    { text: "AbsoluteFill", color: T },
    { text: " } " },
    { text: "from", color: K },
    { text: " " },
    { text: '"remotion"', color: S },
    { text: ";" },
  ],
  [],
  [
    { text: "export", color: K },
    { text: " " },
    { text: "const", color: K },
    { text: " " },
    { text: "TitleCard", color: F },
    { text: " = " },
    { text: "(", color: B },
    { text: ")", color: B },
    { text: " => " },
    { text: "{", color: B },
  ],
  [
    { text: "  return", color: K },
    { text: " " },
    { text: "(", color: B },
  ],
  [
    { text: "    <", color: J },
    { text: "AbsoluteFill", color: J },
    { text: " " },
    { text: "style", color: V },
    { text: "=" },
    { text: "{", color: B },
    { text: "{" },
    { text: " backgroundColor: " },
    { text: '"#0F172A"', color: S },
    { text: " }" },
    { text: "}", color: B },
    { text: ">", color: J },
  ],
  [
    { text: "      <", color: J },
    { text: "h1", color: J },
    { text: " " },
    { text: "style", color: V },
    { text: "=" },
    { text: "{", color: B },
    { text: "{" },
    { text: " color: " },
    { text: '"white"', color: S },
    { text: ", fontSize: " },
    { text: "120", color: PALETTE.number },
    { text: " }" },
    { text: "}", color: B },
    { text: ">", color: J },
    { text: "안녕" },
    { text: "</", color: J },
    { text: "h1", color: J },
    { text: ">", color: J },
  ],
  [
    { text: "    </", color: J },
    { text: "AbsoluteFill", color: J },
    { text: ">", color: J },
  ],
  [
    { text: "  )", color: B },
    { text: ";" },
  ],
  [
    { text: "}", color: B },
    { text: ";" },
  ],
];

/** 스니펫의 총 글자 수 (공백 포함) */
export function totalChars(lines: CodeLine[]): number {
  let sum = 0;
  for (const line of lines) {
    for (const t of line) sum += t.text.length;
    sum += 1; // 개행
  }
  return sum;
}
