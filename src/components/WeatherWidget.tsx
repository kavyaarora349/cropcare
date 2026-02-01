import { useState, useEffect } from "react";
import { Cloud, CloudSun, CloudRain, Sun, Wind, Droplets, MapPin, Loader2, Thermometer } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface WeatherData {
    temperature: number;
    humidity: number;
    weatherCode: number;
}

const WeatherWidget = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [locationName, setLocationName] = useState("Locating...");

    const getWeatherIcon = (code: number) => {
        if (code === 0 || code === 1) return <Sun className="w-5 h-5 text-yellow-500 animate-spin-slow" />;
        if (code === 2) return <CloudSun className="w-5 h-5 text-orange-400" />;
        if (code === 3) return <Cloud className="w-5 h-5 text-gray-400" />;
        if (code >= 51 && code <= 67) return <CloudRain className="w-5 h-5 text-blue-400 animate-bounce-slow" />;
        if (code >= 95) return <Wind className="w-5 h-5 text-purple-400" />; // Thunderstorm
        return <CloudSun className="w-5 h-5 text-yellow-500" />;
    };

    const getWeatherLabel = (code: number) => {
        if (code === 0) return "Sunny";
        if (code === 1 || code === 2) return "Partly Cloudy";
        if (code === 3) return "Overcast";
        if (code >= 45 && code <= 48) return "Foggy";
        if (code >= 51 && code <= 67) return "Rainy";
        if (code >= 71 && code <= 86) return "Snowy";
        if (code >= 95) return "Thunderstorm";
        return "Clear";
    };

    const fetchWeather = async (lat: number, lon: number) => {
        try {
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`
            );

            if (!response.ok) throw new Error("Weather fetch failed");

            const data = await response.json();
            setWeather({
                temperature: Math.round(data.current.temperature_2m),
                humidity: data.current.relative_humidity_2m,
                weatherCode: data.current.weather_code
            });
            setError(false);
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const getLocation = () => {
        setLoading(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    setLocationName("Your Farm");
                    await fetchWeather(position.coords.latitude, position.coords.longitude);
                },
                async (error) => {
                    console.error("Geolocation error:", error);
                    // Fallback to New Delhi
                    setLocationName("New Delhi");
                    await fetchWeather(28.6139, 77.2090);
                }
            );
        } else {
            // Fallback
            setLocationName("India");
            fetchWeather(20.5937, 78.9629);
        }
    };

    useEffect(() => {
        getLocation();
    }, []);

    if (error) {
        return (
            <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex text-muted-foreground gap-2 text-xs"
                onClick={getLocation}
            >
                <CloudSun className="w-4 h-4" />
                <span>Weather Unavailable</span>
            </Button>
        );
    }

    if (loading) {
        return (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted/20 rounded-full border border-border/50 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-medium w-16">Loading...</span>
            </div>
        );
    }

    return (
        <div className="hidden md:flex items-center gap-4 px-4 py-1.5 bg-background/50 backdrop-blur-sm rounded-full border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-center gap-2 border-r border-border pr-3">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-foreground">{locationName}</span>
            </div>

            <div className="flex items-center gap-3">
                {weather && (
                    <>
                        <div className="flex items-center gap-1.5" title={getWeatherLabel(weather.weatherCode)}>
                            {getWeatherIcon(weather.weatherCode)}
                            <div className="flex flex-col leading-none">
                                <span className="text-sm font-bold text-foreground">{weather.temperature}°C</span>
                            </div>
                        </div>

                        <div className="w-[1px] h-6 bg-border/50" />

                        <div className="flex items-center gap-1.5" title="Humidity">
                            <Droplets className="w-3.5 h-3.5 text-cyan-500" />
                            <span className="text-xs font-medium text-muted-foreground">{weather.humidity}%</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default WeatherWidget;
