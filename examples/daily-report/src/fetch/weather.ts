import { cached } from "./cache";

type Condition = "sunny" | "cloudy" | "rainy" | "snowy";

export async function fetchWeather(city: string, date: string) {
  return cached({ kind: "weather", city, date }, async () => {
    const key = process.env.KMA_API_KEY;
    if (!key) throw new Error("KMA_API_KEY missing");
    // 실제 운영에선 nx/ny 격자 좌표 변환 필요. 여기선 서울 격자(60, 127) 하드코딩
    const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${encodeURIComponent(key)}&pageNo=1&numOfRows=100&dataType=JSON&base_date=${date.replaceAll("-", "")}&base_time=0500&nx=60&ny=127`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`KMA ${res.status}`);
    const json = (await res.json()) as { response?: { body?: { items?: { item?: Array<{ category: string; fcstValue: string }> } } } };
    const items = json.response?.body?.items?.item ?? [];
    const tmn = parseFloat(items.find((it) => it.category === "TMN")?.fcstValue ?? "0");
    const tmx = parseFloat(items.find((it) => it.category === "TMX")?.fcstValue ?? "0");
    const sky = items.find((it) => it.category === "SKY")?.fcstValue ?? "1";
    const pty = items.find((it) => it.category === "PTY")?.fcstValue ?? "0";
    return { tempLow: tmn, tempHigh: tmx, condition: classify(sky, pty) };
  });
}

function classify(sky: string, pty: string): Condition {
  if (pty === "3") return "snowy";
  if (pty !== "0") return "rainy";
  if (sky === "1") return "sunny";
  return "cloudy";
}
