import axios from "axios";

export default async function handler(req, res) {
  const { city, predefined } = req.query;
  const apiKey = process.env.WEATHER_API_KEY;

  if (predefined) {
    const cities = ["Ulaanbaatar", "Tokyo", "London", "Sydney", "Berlin"];

    try {
      const weatherData = await Promise.all(
        cities.map(async (_city) => {
          const response = await axios.get(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${_city}?unitGroup=metric&elements=datetime%2CdatetimeEpoch%2Ctemp%2Chumidity%2Cprecipprob%2Cpreciptype%2Cwindspeed%2Cconditions%2Cdescription&include=alerts%2Ccurrent%2Cstats&key=${apiKey}&contentType=json`
          );
          const data = response.data;
          return data;
        })
      );
      res.status(200).json(weatherData);
    } catch {
      res.status(500).json({ error: "Failed to fetch weather data." });
    }
    return;
  }

  if (city) {
    try {
      const response = await axios.get(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`
      );

      res.status(200).json(response.data);
    } catch {
      res.status(500).json({ error: "City not found." });
    }
  } else {
    res.status(400).json({ error: "City is required." });
  }
}
