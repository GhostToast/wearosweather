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
  0: { text: "Unknown", code: "unknown" },
  1000: { text: "Clear, Sunny", code: "clear-day" },
  1100: { text: "Mostly Clear", code: "clear-day" },
  1101: { text: "Partly Cloudy", code: "partly-cloudy-day" },
  1102: { text: "Mostly Cloudy", code: "cloudy" },
  1001: { text: "Cloudy", code: "cloudy" },
  2000: { text: "Fog", code: "fog" },
  2100: { text: "Light Fog", code: "fog" },
  4000: { text: "Drizzle", code: "rain" },
  4001: { text: "Rain", code: "rain" },
  4200: { text: "Light Rain", code: "rain" },
  4201: { text: "Heavy Rain", code: "rain" },
  5000: { text: "Snow", code: "snow" },
  5001: { text: "Flurries", code: "snow" },
  5100: { text: "Light Snow", code: "snow" },
  5101: { text: "Heavy Snow", code: "snow" },
  6000: { text: "Freezing Drizzle", code: "sleet" },
  6001: { text: "Freezing Rain", code: "sleet" },
  6200: { text: "Light Freezing Rain", code: "sleet" },
  6201: { text: "Heavy Freezing Rain", code: "sleet" },
  7000: { text: "Ice Pellets", code: "sleet" },
  7101: { text: "Heavy Ice Pellets", code: "sleet" },
  7102: { text: "Light Ice Pellets", code: "sleet" },
  8000: { text: "Thunderstorm", code: "rain" }
};

// Summary
setGlobal("WeatherSummary", weatherCodesObj[current.intervals[0].values.weatherCode].text);

// Icons
setGlobal("WeatherIcon", weatherCodesObj[current.intervals[0].values.weatherCode].code);
setGlobal("WeatherIconNext", weatherCodesObj[hourly.intervals[2].values.weatherCode].code);
setGlobal("WeatherIconNext2", weatherCodesObj[hourly.intervals[4].values.weatherCode].code);
setGlobal("WeatherIconNext3", weatherCodesObj[hourly.intervals[6].values.weatherCode].code);

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
