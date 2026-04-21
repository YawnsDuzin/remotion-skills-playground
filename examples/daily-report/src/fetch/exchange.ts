import { cached } from "./cache";

export async function fetchUsdKrw(date: string) {
  return cached({ kind: "usdkrw", date }, async () => {
    const key = process.env.BOK_API_KEY;
    if (!key) throw new Error("BOK_API_KEY missing");
    const ymd = date.replaceAll("-", "");
    const url = `https://ecos.bok.or.kr/api/StatisticSearch/${key}/json/kr/1/1/731Y001/D/${ymd}/${ymd}/0000001`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`BOK ${res.status}`);
    const json = (await res.json()) as { StatisticSearch?: { row?: Array<{ DATA_VALUE: string }> } };
    const value = parseFloat(json.StatisticSearch?.row?.[0]?.DATA_VALUE ?? "0");
    return { usdKrw: value };
  });
}
