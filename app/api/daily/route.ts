import { NextResponse } from "next/server";
import { loadDailyData } from "../../../src/lib/loadDailyData";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
    const data = await loadDailyData();
    return NextResponse.json(data);
}
