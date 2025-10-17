import { WeatherData } from './interfaces.js';

process.loadEnvFile();

export async function weatherService(): Promise<WeatherData> {
  const API_KEY: string | undefined = process.env.WEATHER_API_KEY;

  if (!API_KEY) {
    throw new Error(
      'API key not found. Make sure WEATHER_API_KEY is set in .env'
    );
  }

  const URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/nicaragua?unitGroup=us&key=${API_KEY}&contentType=json`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(URL, { signal: controller.signal });

    clearTimeout(timeout);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Weather API error: ${response.status} ${response.statusText} - ${text}`
      );
    }

    const data = (await response.json()) as WeatherData;
    return data;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Weather API request timed out');
    }
    console.error('Error in weatherService:', error);
    throw error;
  }
}
