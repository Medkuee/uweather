import Image from "next/image";
import Layout from "./components/Layout";
import Link from "next/link";
import Card from "./components/Card";
import { useEffect, useState } from "react";
import { useGlobalState } from "@/context/GlobalStateContext";
import { celsiusToFahrenheit } from "@/utils/conversion";
import { toast } from "react-toastify";

const validateCityName = (city) => {
  const trimmedCity = city.trim();
  const regex = /^[a-zA-Z\s-]+$/;
  if (!trimmedCity) {
    return "City name cannot be empty.";
  }
  if (!regex.test(trimmedCity)) {
    return "City name can only contain letters, spaces, and hyphens.";
  }
  return null;
};

export default function Home({ initialCitiesWeather }) {
  const { globalState } = useGlobalState();

  const [citiesWeather, setCitiesWeather] = useState(initialCitiesWeather);
  const [additionalCitiesWeather, setAdditionalCitiesWeather] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchCity, setSearchCity] = useState("");

  const getCityWeather = async () => {
    const validationError = validateCityName(searchCity);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/weather?city=${searchCity}`);
      if (!res.ok) {
        throw new Error("City not found.");
      }
      const data = await res.json();
      if (data) {
        setAdditionalCitiesWeather((prev) => [...prev, data]);
        toast.success("Weather data fetched successfully!");
      }
      setLoading(false);
    } catch {
      toast.error("Failed to fetch weather data.");
      setLoading(false);
    }
  };

  const getUpdatedWeather = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/weather?predefined=true");
      const data = await res.json();
      setCitiesWeather(data);
      toast.success("Weather data updated successfully!");
    } catch {
      toast.error("Failed to update weather data!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(getUpdatedWeather, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <div className="p-6 bg-gray-100">
        <h1 className="text-3xl font-bold text-center mb-8">
          Weather Dashboard
        </h1>

        <div className="flex justify-center mb-8">
          <button
            onClick={getUpdatedWeather}
            className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Refreshing" : "Refresh"}
          </button>
        </div>

        <div className="flex justify-center mb-4 gap-2">
          <div className="flex items-center gap-2 p-2 rounded-lg border-2 border-gray-200 shadow-sm max-w-96 w-full">
            <Image
              src="/search-icon.svg"
              alt="Search Icon"
              width={20}
              height={20}
            />
            <input
              type="text"
              placeholder="Search City"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="text-sm outline-none border-none flex-1 bg-transparent"
            />
          </div>
          <button
            onClick={getCityWeather}
            disabled={loading}
            className={`bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Search
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...citiesWeather, ...additionalCitiesWeather].map((city) => (
            <Card key={city.name}>
              <div className="bg-white flex flex-col items-center">
                <div className="flex flex-col items-center mb-4">
                  <Image
                    src="/snowy.svg"
                    alt={`${city.address} Flag`}
                    width={80}
                    height={50}
                    className="rounded-sm"
                  />
                  <h2 className="text-xl font-semibold mt-2">
                    {city?.address}
                  </h2>
                </div>

                <p className="text-lg font-medium text-gray-700">
                  Temperature:{" "}
                  {globalState?.temperature === "C°"
                    ? city?.currentConditions?.temp
                    : celsiusToFahrenheit(city?.currentConditions?.temp)}
                  {globalState?.temperature}
                </p>
                <p className="text-gray-600 capitalize">
                  {city?.currentConditions?.conditions || ""}
                </p>

                <div className="flex flex-col mt-4 text-sm text-gray-500">
                  <p>
                    Wind Speed: {city?.currentConditions?.windspeed || ""} km/h
                  </p>
                  <p>Humidity: {city?.currentConditions?.humidity || ""}%</p>
                </div>

                <Link href={`/city/${city?.address.toLowerCase()}`}>
                  View More Details
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const baseUrl = process.env.BASE_URL;
  const res = await fetch(`${baseUrl}/api/weather?predefined=true`);
  const data = await res.json();

  return {
    props: {
      initialCitiesWeather: data,
    },
  };
}
