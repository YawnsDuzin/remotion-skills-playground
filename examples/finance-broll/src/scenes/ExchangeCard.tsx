import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { enterFromBottom } from "../motion";
import type { FinanceBrollProps } from "../schema";

type Props = FinanceBrollProps["exchange"];

export const ExchangeCard = ({ usdKrw, changePercent }: Props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const color = changePercent >= 0 ? "#EF4444" : "#3B82F6";
  const sign = changePercent >= 0 ? "+" : "";

  return (
    <AbsoluteFill
      style={{
        padding: 80,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Pretendard, system-ui, sans-serif",
      }}
    >
      <div style={{ ...enterFromBottom({ frame, fps }, 30), color: "#94A3B8", fontSize: 48, letterSpacing: 4 }}>
        USD / KRW
      </div>
      <div
        style={{
          ...enterFromBottom({ frame: Math.max(0, frame - 4), fps }, 40),
          color: "#F8FAFC",
          fontSize: 180,
          fontWeight: 800,
          marginTop: 24,
          textShadow: "0 4px 24px rgba(0,0,0,0.6)",
        }}
      >
        ₩{usdKrw.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}
      </div>
      <div
        style={{
          ...enterFromBottom({ frame: Math.max(0, frame - 8), fps }, 30),
          color,
          fontSize: 72,
          fontWeight: 700,
          marginTop: 8,
          textShadow: "0 2px 12px rgba(0,0,0,0.5)",
        }}
      >
        {sign}
        {changePercent.toFixed(2)}%
      </div>
    </AbsoluteFill>
  );
};
