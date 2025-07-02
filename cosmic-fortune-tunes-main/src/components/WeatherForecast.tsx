import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cloud, Sun, CloudRain, Thermometer, Eye, Droplets } from 'lucide-react';

interface WeatherData {
  temperature: number;
  weatherCode: number;
  humidity: number;
  visibility: number;
  location: string;
}

const WeatherForecast = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-5 h-5 text-amber-400" />;
    if (code <= 3) return <Cloud className="w-5 h-5 text-slate-300" />;
    return <CloudRain className="w-5 h-5 text-blue-300" />;
  };

  const getWeatherDescription = (code: number) => {
    const descriptions: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Light rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      80: 'Light showers',
      81: 'Moderate showers',
      82: 'Violent showers'
    };
    return descriptions[code] || 'Unknown';
  };

  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const latitude = 40.7128;
        const longitude = -74.0060;
        
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,visibility&timezone=auto`
        );
        
        if (!response.ok) {
          throw new Error('Weather data unavailable');
        }
        
        const data = await response.json();
        
        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          weatherCode: data.current.weather_code,
          humidity: data.current.relative_humidity_2m,
          visibility: data.current.visibility / 1000,
          location: 'Your Location'
        });
        
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError('Unable to fetch weather data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (isLoading) {
    return (
      <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-white/20 rounded-full animate-pulse" />
            <div className="space-y-1.5">
              <div className="h-3 w-32 bg-white/20 rounded-full animate-pulse" />
              <div className="h-2 w-24 bg-white/10 rounded-full animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className="bg-red-500/10 backdrop-blur-lg border border-red-400/20 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 text-red-300">
            <Cloud className="w-5 h-5" />
            <span className="text-sm font-medium">
              {error || 'Weather unavailable'}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
              {getWeatherIcon(weather.weatherCode)}
            </div>
            <div>
              <h4 className="text-sm font-medium text-white/90">
                Today's Earth Weather
                <p className="text-xs text-white/60 weatherforcode">
                {getWeatherDescription(weather.weatherCode)}
              </p>
              </h4>
              
              <div className="flex gap-2 mt-3">
                <Badge variant="outline" className="bg-blue-500/10 border-blue-400/20 text-blue-200">
                  <Eye className="w-3 h-3 mr-1" />
                  {weather.visibility.toFixed(1)}km
                </Badge>
                <Badge variant="outline" className="bg-purple-500/10 border-purple-400/20 text-purple-200">
                  <Droplets className="w-3 h-3 mr-1" />
                  {weather.humidity}%
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-2xl font-bold text-white">
              {weather.temperature}°C
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;