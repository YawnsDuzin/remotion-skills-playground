import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { enterFromBottom } from "../motion";
import type { DailyReportProps } from "../schema";

type Props = NonNullable<DailyReportProps["data"]>["exchange"];

export const ExchangeCard = ({ usdKrw, changePercent }: Props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const color = changePercent >= 0 ? "#EF4444" : "#3B82F6";
  const sign = changePercent >= 0 ? "+" : "";

  return (
    <AbsoluteFill style={{ backgroundColor: "#1E293B", padding: 80, justifyContent: "center", alignItems: "center" }}>
      <div style={{ ...enterFromBottom({ frame, fps }, 30), color: "#94A3B8", fontSize: 48 }}>USD/KRW</div>
      <div style={{ ...enterFromBottom({ frame: Math.max(0, frame - 4), fps }, 40), color: "#F8FAFC", fontSize: 160, fontWeight: 800, marginTop: 16 }}>
        ₩{usdKrw.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}
      </div>
      <div style={{ ...enterFromBottom({ frame: Math.max(0, frame - 8), fps }, 30), color, fontSize: 64, fontWeight: 700, marginTop: 8 }}>
        {sign}{changePercent.toFixed(2)}%
      </div>
    </AbsoluteFill>
  );
};
