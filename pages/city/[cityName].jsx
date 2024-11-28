import Image from "next/image";
import Card from "../components/Card";
import Layout from "../components/Layout";
import DayForecast from "../components/DayForecast";
import Divider from "../components/Divider";
import { useGlobalState } from "@/context/GlobalStateContext";
import { celsiusToFahrenheit } from "@/utils/conversion";
import dynamic from "next/dynamic";
const WeatherChart = dynamic(() => import("../components/WeatherChart"), {
  ssr: false,
});

export default function City({ cityWeather }) {
  const { globalState } = useGlobalState();

  if (!cityWeather || !cityWeather.currentConditions) {
    return (
      <Layout>
        <div className="p-6">
          <h1 className="text-2xl font-bold">City Not Found</h1>
          <p>We could not find weather data for the requested city.</p>
        </div>
      </Layout>
    );
  }

  const hourlyData =
    cityWeather?.days?.[0]?.hours?.map((hour) => hour.temp) || [];

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="flex flex-col gap-4">
          <Card>
            <div className="flex flex-col gap-1">
              <span>
                Current Weather (<strong>{cityWeather?.address || ""}</strong>)
              </span>
              <span className="font-semibold">
                {cityWeather?.currentConditions?.datetime}
              </span>
              <div className="flex flex-row gap-4 items-start my-4 ">
                <Image
                  src="/sunny.svg"
                  alt="Weather icon"
                  width={40}
                  height={40}
                />
                <span className="text-4xl">
                  {globalState?.temperature === "C°"
                    ? cityWeather?.currentConditions?.temp
                    : celsiusToFahrenheit(cityWeather?.currentConditions?.temp)}
                  {globalState?.temperature}
                </span>
                <div className="text-sm">
                  {cityWeather?.currentConditions?.conditions || ""}
                  <div>
                    Feels like:{" "}
                    {globalState?.temperature === "C°"
                      ? cityWeather?.currentConditions?.feelslike
                      : celsiusToFahrenheit(
                          cityWeather?.currentConditions?.feelslike
                        )}
                    {globalState?.temperature}
                  </div>
                </div>
              </div>
              <span>{cityWeather?.description || ""}</span>
            </div>
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              {
                icon: "/air-quality.svg",
                label: "Sun Set",
                value: cityWeather?.currentConditions?.sunset || "N/A",
              },
              {
                icon: "/wind.svg",
                label: "Wind",
                value: cityWeather?.currentConditions?.windspeed || "N/A",
              },
              {
                icon: "/humidity.svg",
                label: "Humidity",
                value: `${cityWeather?.currentConditions?.humidity || 0}%`,
              },
              {
                icon: "/visibility.svg",
                label: "Visibility",
                value: `${cityWeather?.currentConditions?.visibility || 0} mi`,
              },
              {
                icon: "/pressure.svg",
                label: "Pressure",
                value: `${cityWeather?.currentConditions?.pressure || 0} in`,
              },
              {
                icon: "/precipitation.svg",
                label: "Precipitation",
                value: `${cityWeather?.currentConditions?.precipprob || 0}%`,
              },
            ].map((metric, index) => (
              <Card key={index}>
                <div className="flex flex-row gap-2 items-start">
                  <Image
                    src={metric.icon}
                    alt={metric.label}
                    width={20}
                    height={20}
                  />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm">{metric.label}</span>
                    <span className="font-semibold text-lg">
                      {metric.value}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card>
            <span>Temperatures today</span>
            <WeatherChart hourlyData={hourlyData} />
          </Card>
        </div>

        <div className="flex flex-col">
          <Card>
            <div className="flex flex-col gap-1">
              <span>Weather forecast</span>
              {cityWeather?.days?.slice(0, 7).map((forecast, i) => (
                <>
                  <DayForecast data={forecast} key={i} />
                  {i !== 6 && <Divider />}
                </>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const cities = ["Ulaanbaatar", "Tokyo", "London", "Sydney", "Berlin"];
  const paths = cities.map((city) => ({
    params: { cityName: city.toLowerCase() },
  }));
  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const { cityName } = params;
  const baseUrl = process.env.BASE_URL;
  const res = await fetch(`${baseUrl}/api/weather?city=${cityName}`);
  const cityWeather = res.ok ? await res.json() : null;

  return {
    props: {
      cityWeather,
    },
    revalidate: 300,
  };
}
