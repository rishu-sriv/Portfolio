import { NextResponse } from "next/server";
import type { WeatherData } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const city   = searchParams.get("city") ?? process.env.WEATHER_CITY ?? "Mumbai";

  // If no API key, return plausible mock data so the widget still renders
  if (!apiKey || apiKey === "your_openweathermap_api_key_here") {
    const mock: WeatherData = {
      city,
      temperature: 28,
      condition: "Partly Cloudy",
      humidity: 72,
      iconCode: "02d",
    };
    return NextResponse.json(mock);
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`,
      { next: { revalidate: 600 } }
    );

    if (!res.ok) {
      throw new Error(`OpenWeatherMap error: ${res.status}`);
    }

    const data = await res.json();
    const weather: WeatherData = {
      city: data.name,
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].description
        .split(" ")
        .map((w: string) => w[0].toUpperCase() + w.slice(1))
        .join(" "),
      humidity: data.main.humidity,
      iconCode: data.weather[0].icon,
    };

    return NextResponse.json(weather);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch weather" },
      { status: 500 }
    );
  }
}
