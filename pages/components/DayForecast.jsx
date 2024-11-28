import React from "react";
import { useGlobalState } from "@/context/GlobalStateContext";
import { celsiusToFahrenheit } from "@/utils/conversion";
import Image from "next/image";

export default function DayForecast({ data }) {
  const { globalState } = useGlobalState();

  return (
    <div className="grid grid-cols-3 gap-1 p-1 sm:p-4">
      <div className="flex flex-row items-start gap-2">
        <Image
          src="/thunderstorm.svg"
          alt="Weather Icon"
          width={40}
          height={40}
        />
        <div className="flex flex-col gap-[2px]">
          <span className="text-sm">{data?.datetime || ""}</span>
          <span className="font-medium">{data?.conditions || ""}</span>
        </div>
      </div>

      <span className="text-lg sm:text-3xl text-center">
        {globalState?.temperature === "C°"
          ? data?.temp
          : celsiusToFahrenheit(data?.temp)}
        {globalState?.temperature}
      </span>

      <div className="flex flex-col gap-[2px]">
        <span>Wind: {data?.windspeed || ""}</span>
        <span>Humidity: {data?.humidity || ""}%</span>
      </div>
    </div>
  );
}
