import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { cursorBlink } from "../motion";
import { PALETTE, SNIPPET, totalChars, type CodeLine, type Token } from "../data/snippets";

/**
 * 핵심 컴포넌트 — 토큰 단위 타이핑 + 커서 블링크 + 라인 번호
 */
export const CodeBlock = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const total = totalChars(SNIPPET);
  // 30s 동안 전체를 타이핑 — 씬 길이에 맞게 조정하면 됨
  const typeEndFrame = fps * 30;
  const charsToShow = Math.max(
    0,
    Math.min(total, Math.floor(interpolate(frame, [0, typeEndFrame], [0, total])))
  );

  // 각 라인/토큰에 얼마나 보일지 계산
  let consumed = 0;
  const rendered: { line: CodeLine; lineConsumed: number; done: boolean }[] = [];
  for (const line of SNIPPET) {
    const lineLen = line.reduce((s, t) => s + t.text.length, 0);
    const remaining = charsToShow - consumed;
    if (remaining <= 0) {
      rendered.push({ line, lineConsumed: 0, done: false });
    } else if (remaining >= lineLen + 1) {
      rendered.push({ line, lineConsumed: lineLen, done: true });
    } else {
      rendered.push({ line, lineConsumed: Math.min(remaining, lineLen), done: false });
    }
    consumed += lineLen + 1;
  }

  const typingActive = charsToShow < total;
  const cursorOpacity = typingActive ? 1 : cursorBlink(frame, fps);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0A0F1C",
        padding: "80px 40px",
        fontFamily: "'JetBrains Mono', Menlo, Consolas, 'Courier New', monospace",
        fontSize: 32,
        lineHeight: 1.55,
      }}
    >
      <div
        style={{
          color: "#94A3B8",
          fontSize: 26,
          fontFamily: "Pretendard, system-ui, sans-serif",
          marginBottom: 32,
          letterSpacing: 2,
        }}
      >
        CLAUDE CODE ↓ src/TitleCard.tsx
      </div>
      <div
        style={{
          backgroundColor: PALETTE.bg,
          borderRadius: 16,
          padding: "32px 24px",
          border: "1px solid #2A2A2A",
          boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
        }}
      >
        {rendered.map((r, lineIdx) => (
          <LineRow
            key={lineIdx}
            line={r.line}
            lineIndex={lineIdx}
            lineConsumed={r.lineConsumed}
            isCurrent={!r.done && r.lineConsumed > 0 && typingActive}
            cursorOpacity={cursorOpacity}
            lastDoneLine={isLastDone(rendered, lineIdx)}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

function isLastDone(
  rendered: { done: boolean; lineConsumed: number }[],
  idx: number
): boolean {
  if (!rendered[idx].done) return false;
  const next = rendered[idx + 1];
  if (!next) return true;
  return next.lineConsumed === 0;
}

const LineRow = ({
  line,
  lineIndex,
  lineConsumed,
  isCurrent,
  cursorOpacity,
  lastDoneLine,
}: {
  line: CodeLine;
  lineIndex: number;
  lineConsumed: number;
  isCurrent: boolean;
  cursorOpacity: number;
  lastDoneLine: boolean;
}) => {
  // 토큰별로 잘라서 렌더
  let used = 0;
  const tokens: { t: Token; visibleLen: number }[] = [];
  for (const t of line) {
    const left = Math.max(0, lineConsumed - used);
    const visibleLen = Math.min(t.text.length, left);
    tokens.push({ t, visibleLen });
    used += t.text.length;
  }

  const showCursor = isCurrent || lastDoneLine;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "1.55em",
        backgroundColor: showCursor ? PALETTE.highlightBg : "transparent",
        borderRadius: 4,
      }}
    >
      <div
        style={{
          width: 56,
          color: PALETTE.lineNumber,
          textAlign: "right",
          paddingRight: 20,
          userSelect: "none",
          flexShrink: 0,
        }}
      >
        {lineIndex + 1}
      </div>
      <div style={{ flex: 1, color: PALETTE.text, whiteSpace: "pre" }}>
        {tokens.map((tk, i) => (
          <span key={i} style={{ color: tk.t.color ?? PALETTE.text }}>
            {tk.t.text.slice(0, tk.visibleLen)}
          </span>
        ))}
        {showCursor ? (
          <span
            style={{
              display: "inline-block",
              width: 12,
              height: "1.2em",
              backgroundColor: "#38BDF8",
              verticalAlign: "text-bottom",
              marginLeft: 2,
              opacity: cursorOpacity,
            }}
          />
        ) : null}
      </div>
    </div>
  );
};
