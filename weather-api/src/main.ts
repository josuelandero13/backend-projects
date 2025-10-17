import express from 'express';
import { WeatherController } from './components/weather/weatherController.js';

const weatherController = new WeatherController();

const app: express.Express = express();
app.use(express.json());

app.get('/api/weather', weatherController.weatherController);

export default app;
