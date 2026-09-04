function decodeWeatherCode(code) {
  if (code === 0) return 'Clear Sky';
  if (code === 1) return 'Mainly Clear';
  if (code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Dense Fog';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 61 && code <= 63) return 'Moderate Rain';
  if (code === 65) return 'Heavy Monsoon Rain';
  if (code >= 71 && code <= 77) return 'Snow Fall';
  if (code >= 80 && code <= 82) return 'Rain Showers';
  if (code >= 95 && code <= 99) return 'Thunderstorm Alert';
  return 'Cloudy';
}

export async function getRiverDischarge(lat, lng) {
  try {
    const url = `https://flood-api.open-meteo.com/v1/flood?latitude=${lat}&longitude=${lng}&daily=river_discharge&forecast_days=1`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    const discharge = data.daily?.river_discharge?.[0];
    return typeof discharge === 'number' ? Math.round(discharge * 10) / 10 : null;
  } catch (e) {
    return null;
  }
}

export async function getCurrentWeather(lat, lng) {
  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}` +
    `&longitude=${lng}` +
    `&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_gusts_10m` +
    `&timezone=auto`;

  const [weatherRes, riverDischargeM3s] = await Promise.all([
    fetch(weatherUrl),
    getRiverDischarge(lat, lng)
  ]);

  if (!weatherRes.ok) {
    throw new Error(`Weather API error: ${weatherRes.status}`);
  }

  const data = await weatherRes.json();
  const current = data.current || {};
  const weatherCode = current.weather_code ?? 0;
  const condition = decodeWeatherCode(weatherCode);
  const precipitation = current.precipitation ?? 0;
  const windSpeed = current.wind_speed_10m ?? 0;
  const windGusts = current.wind_gusts_10m ?? 0;

  return {
    temperature: current.temperature_2m,
    humidity: current.relative_humidity_2m,
    precipitation,
    weatherCode,
    condition,
    windSpeed,
    windGusts,
    time: current.time,
    riverDischargeM3s: riverDischargeM3s ?? undefined,
    isHeavyRain: precipitation >= 5 || [65, 82, 95, 96, 99].includes(weatherCode),
    isHighWind: windGusts >= 40 || windSpeed >= 25,
    flightFeasibility: (windGusts > 45 || precipitation > 15) ? 'RESTRICTED' : (windGusts > 30 || precipitation > 5) ? 'CAUTION' : 'CLEAR',
    floodRiskLevel: precipitation > 10 ? 'HIGH' : precipitation > 2 ? 'MODERATE' : 'LOW'
  };
}