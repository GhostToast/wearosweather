var response = readFile(http_file_output);
response = response.replace('&&','').replace('\n','');
setGlobal("JsonStringData", response);

response = JSON.parse(response);
var day = response.data.timelines[0];
var hourly = response.data.timelines[1];
var current = response.data.timelines[2];

// Time
var dateNow = new Date();

// Moon
setGlobal("MoonPhase", day.intervals[0].values.moonPhase);

// Humidity
setGlobal("Humidity", Math.round(current.intervals[0].values.humidity));

// Deprecated.
//var alerts = !! response.alerts;
//setGlobal("WeatherAlert", alerts);

// Summary
setGlobal("WeatherSummary", current.intervals[0].values.weatherCode);

// Icons
setGlobal("WeatherIcon", current.intervals[0].values.weatherCode);
setGlobal("WeatherIconNext", hourly.intervals[2].values.weatherCode);
setGlobal("WeatherIconNext2", hourly.intervals[4].values.weatherCode);
setGlobal("WeatherIconNext3", hourly.intervals[6].values.weatherCode);

// Precipitation
setGlobal("Precipitation", current.intervals[0].values.precipitationProbability);

// Temperature
setGlobal("Temperature", Math.round(current.intervals[0].values.apparentTemperature));
setGlobal("NextTemperature", Math.round(hourly.intervals[2].values.apparentTemperature));
setGlobal("NextTemperature2", Math.round(hourly.intervals[4].values.apparentTemperature));
setGlobal("NextTemperature3", Math.round(hourly.intervals[6].values.apparentTemperature));
setGlobal("MaxTemp", Math.round(day.intervals[0].values.temperatureApparentMax));
setGlobal("MinTemp", Math.round(day.intervals[0].values.temperatureApparentMin));

// Time
var nextTime = new Date(hourly.intervals[2].startTime).getHours();
if(0==nextTime){
  nextTime = "12am";
} else if (12==nextTime){
  nextTime = "12pm";
} else {
  nextTime = nextTime > 12 ? nextTime - 12 + "pm" : nextTime + "am";
}

var nextTime2 = new Date(hourly.intervals[4].startTime).getHours();
if(0==nextTime2){
  nextTime2 = "12am";
} else if (12==nextTime2){
  nextTime2 = "12pm";
} else {
  nextTime2 = nextTime2 > 12 ? nextTime2 - 12 + "pm" : nextTime2 + "am";
}

var nextTime3 = new Date(hourly.intervals[6].startTime).getHours();
if(0==nextTime3){
  nextTime3 = "12am";
} else if (12==nextTime3){
  nextTime3 = "12pm";
} else {
  nextTime3 = nextTime3 > 12 ? nextTime3 - 12 + "pm" : nextTime3 + "am";
}

setGlobal("TimeChecked", dateNow.getHours() + ":" + dateNow.getMinutes());
setGlobal("NextTime", nextTime);
setGlobal("NextTime2", nextTime2);
setGlobal("NextTime3", nextTime3);

// Nighttime
var nightTime = now.time > day.sunsetTime || now.time < day.sunriseTime;
setGlobal("NightTime", now.time > day.sunsetTime || now.time < day.sunriseTime);

setGlobal("NightTimeNext", next.time > day.sunsetTime || next.time < day.sunriseTime);

setGlobal("NightTimeNext2", next2.time > day.sunsetTime || next2.time < day.sunriseTime);

setGlobal("NightTimeNext3", next3.time > day.sunsetTime || next3.time < day.sunriseTime);

var dateSun = new Date(nightTime ? day.sunriseTime*1000 : day.sunsetTime*1000);
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
setGlobal("WindSpeed", Math.round(now.windSpeed));
var bearing = 0;
if (typeof now.windBearing !== 'undefined') {
bearing = Math.round(now.windBearing);
}
setGlobal("WindBearing", bearing);
