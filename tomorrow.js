// Sample call:
// https://api.tomorrow.io/v4/timelines?location=41.9958219,-88.6987461&fields=temperature,temperatureApparentMax,temperatureApparentMin,humidity,precipitationProbability,temperatureApparent,weatherCode,windDirection,windSpeed,moonPhase,sunriseTime,sunsetTime&timesteps=current,1h,1d&startTime=now&endTime=nowPlus1d&units=imperial&apikey=REDACTED
var response = readFile(http_file_output);
response = response.replace('&&','').replace('\n','');
setGlobal("JsonStringData", response);

response = JSON.parse(response);
var day = response.data.timelines[0];
var hourly = response.data.timelines[1];
var current = response.data.timelines[2];

// Time
var nowTime = new Date();

// Moon
setGlobal("MoonPhase", day.intervals[0].values.moonPhase);

// Humidity
setGlobal("Humidity", Math.round(current.intervals[0].values.humidity));

var weatherCodesObj = {
  0: "Unknown",
  1000: "Clear, Sunny",
  1100: "Mostly Clear",
  1101: "Partly Cloudy",
  1102: "Mostly Cloudy",
  1001: "Cloudy",
  2000: "Fog",
  2100: "Light Fog",
  4000: "Drizzle",
  4001: "Rain",
  4200: "Light Rain",
  4201: "Heavy Rain",
  5000: "Snow",
  5001: "Flurries",
  5100: "Light Snow",
  5101: "Heavy Snow",
  6000: "Freezing Drizzle",
  6001: "Freezing Rain",
  6200: "Light Freezing Rain",
  6201: "Heavy Freezing Rain",
  7000: "Ice Pellets",
  7101: "Heavy Ice Pellets",
  7102: "Light Ice Pellets",
  8000: "Thunderstorm"
};

// Summary
setGlobal("WeatherSummary", weatherCodesObj[current.intervals[0].values.weatherCode]);

// Icons
setGlobal("WeatherIcon", current.intervals[0].values.weatherCode);
setGlobal("WeatherIconNext", hourly.intervals[2].values.weatherCode);
setGlobal("WeatherIconNext2", hourly.intervals[4].values.weatherCode);
setGlobal("WeatherIconNext3", hourly.intervals[6].values.weatherCode);

// Precipitation
setGlobal("Precipitation", current.intervals[0].values.precipitationProbability);

// Temperature
setGlobal("ActualTemperature", Math.round(current.intervals[0].values.temperature));
setGlobal("Temperature", Math.round(current.intervals[0].values.temperatureApparent));
setGlobal("NextTemperature", Math.round(hourly.intervals[2].values.temperatureApparent));
setGlobal("NextTemperature2", Math.round(hourly.intervals[4].values.temperatureApparent));
setGlobal("NextTemperature3", Math.round(hourly.intervals[6].values.temperatureApparent));
setGlobal("MaxTemp", Math.round(day.intervals[0].values.temperatureApparentMax));
setGlobal("MinTemp", Math.round(day.intervals[0].values.temperatureApparentMin));

// Time
var nextTimeDate = new Date(hourly.intervals[2].startTime)
var nextTime = nextTimeDate.getHours();
if(0==nextTime){
  nextTime = "12am";
} else if (12==nextTime){
  nextTime = "12pm";
} else {
  nextTime = nextTime > 12 ? nextTime - 12 + "pm" : nextTime + "am";
}

var nextTime2Date = new Date(hourly.intervals[4].startTime)
var nextTime2 = nextTime2Date.getHours();
if(0==nextTime2){
  nextTime2 = "12am";
} else if (12==nextTime2){
  nextTime2 = "12pm";
} else {
  nextTime2 = nextTime2 > 12 ? nextTime2 - 12 + "pm" : nextTime2 + "am";
}

var nextTime3Date = new Date(hourly.intervals[6].startTime)
var nextTime3 = nextTime3Date.getHours();
if(0==nextTime3){
  nextTime3 = "12am";
} else if (12==nextTime3){
  nextTime3 = "12pm";
} else {
  nextTime3 = nextTime3 > 12 ? nextTime3 - 12 + "pm" : nextTime3 + "am";
}

setGlobal("TimeChecked", nowTime.getHours() + ":" + nowTime.getMinutes());
setGlobal("NextTime", nextTime);
setGlobal("NextTime2", nextTime2);
setGlobal("NextTime3", nextTime3);

// Nighttime
var dayOneSunset = new Date(day.intervals[0].values.sunsetTime);
var dayOneSunrise = new Date(day.intervals[0].values.sunriseTime);
var dayTwoSunrise = new Date(day.intervals[1].values.sunriseTime);
var nightTime = nowTime > dayOneSunset || nowTime < dayOneSunrise;
setGlobal("NightTime", nightTime);

setGlobal("NightTimeNext", nextTimeDate > dayOneSunset || nextTimeDate < dayOneSunrise);
setGlobal("NightTimeNext2", nextTime2Date > dayOneSunset || nextTime2Date < dayOneSunrise);
setGlobal("NightTimeNext3", nextTime3Date > dayOneSunset || nextTime3Date < dayOneSunrise);

if (nowTime > dayOneSunrise && nowTime < dayOneSunset) {
  var dateSun = dayOneSunset;
} else {
  var dateSun = dayTwosunrise;
}
var dateSunHours = dateSun.getHours();
if(dateSunHours > 12) {
  dateSunHours = dateSunHours - 12;
}
var sunMinutes = dateSun.getMinutes();
if (sunMinutes < 10) {
  sunMinutes = "0" + sunMinutes;
}
setGlobal("SunEventTime", dateSunHours  + ":" + sunMinutes);

// Wind
setGlobal("WindSpeed", Math.round(current.intervals[0].values.windSpeed));
var bearing = 0;
if (typeof current.intervals[0].values.windDirection !== 'undefined') {
  bearing = Math.round(current.intervals[0].values.windDirection);
}
setGlobal("WindBearing", bearing);
