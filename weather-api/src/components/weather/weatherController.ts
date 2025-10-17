import { weatherService } from '../weather/weatherService.js';
import { Request, Response } from 'express';

export class WeatherController {
  async weatherController(request: Request, response: Response) {
    try {
      const dataWeather = await weatherService();

      return response.status(200).json(dataWeather);
    } catch (error: any) {
      console.error('Error fetching weather:', error);

      return response.status(500).json({
        error: error.message || 'Internal server error',
      });
    }
  }
}
