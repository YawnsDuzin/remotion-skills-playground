import { cached } from "./cache";

export async function fetchKospi(date: string) {
  return cached({ kind: "kospi", date }, async () => {
    const url = `https://api.finance.naver.com/siseJson.naver?symbol=KOSPI&requestType=1&startTime=${date.replaceAll("-", "")}&endTime=${date.replaceAll("-", "")}&timeframe=day`;
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) throw new Error(`KOSPI ${res.status}`);
    const text = await res.text();
    const rows: number[][] = JSON.parse(text.replace(/'/g, '"'));
    const [, , , , close] = rows[rows.length - 1] ?? [];
    return { close: close ?? 0, raw: rows };
  });
}
