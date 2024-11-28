import { useGlobalState } from "@/context/GlobalStateContext";
import Link from "next/link";

export default function Header() {
  const { globalState, toggleTemperatureUnit } = useGlobalState();

  return (
    <div className="bg-white text-black shadow-md">
      <div className="max-w-6xl mx-auto flex flex-row items-center justify-between gap-8  p-4">
        <Link href="/">
          <h4 className="text-2xl font-bold">UWeather</h4>
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTemperatureUnit}
            className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-lg shadow-sm hover:bg-gray-200 transition-all"
          >
            <span className="text-center">{globalState.temperature}</span>
          </button>

          {/* <button
            onClick={toggleDistanceUnit}
            className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-lg shadow-sm hover:bg-gray-200 transition-all"
          >
            <span className="text-center">{globalState.distance}</span>
          </button> */}
        </div>
      </div>
    </div>
  );
}
