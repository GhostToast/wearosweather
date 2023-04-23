var response = readFile(http_file_output);
response = response.replace('&&','').replace('\n','');
setGlobal("JsonStringData", response);

response = JSON.parse(response);
var timelines = response.data.timelines[0].intervals;

//var day = response.daily.data[0];
var now = timelines[0].values;
var next = timelines[2].values;
var next2 = timelines[4].values;
var next3 = timelines[6].values;
//var alerts = !! response.alerts;

// Humidity
setGlobal("Humidity", now.humidity);

//setGlobal("WeatherAlert", alerts);

// Moon
//var moonPhase = Math.floor(day.moonPhase*16);
//setGlobal("MoonPhase", moonPhase);

// Summary
//setGlobal("WeatherSummary", now.weatherCode);

// Icons
setGlobal("WeatherIcon", now.weatherCode);
setGlobal("WeatherIconNext", next.weatherCode);
setGlobal("WeatherIconNext2", next2.weatherCode);
setGlobal("WeatherIconNext3", next3.weatherCode);

// Precipitation
setGlobal("Precipitation", hour.precipitationProbability);

// Temperature
setGlobal("Temperature", Math.round(now.apparentTemperature));
setGlobal("NextTemperature", Math.round(next.apparentTemperature));
setGlobal("NextTemperature2", Math.round(next2.apparentTemperature));
setGlobal("NextTemperature3", Math.round(next3.apparentTemperature));
setGlobal("MaxTemp", Math.round(day.apparentTemperatureMax));
setGlobal("MinTemp", Math.round(day.apparentTemperatureMin));

// Time
var dateNow = new Date(now.time*1000);

var nextTime = new Date(next.time*1000).getHours();
if(0==nextTime){
  nextTime = "12am";
} else if (12==nextTime){
  nextTime = "12pm";
} else {
  nextTime = nextTime > 12 ? nextTime - 12 + "pm" : nextTime + "am";
}

var nextTime2 = new Date(next2.time*1000).getHours();
if(0==nextTime2){
  nextTime2 = "12am";
} else if (12==nextTime2){
  nextTime2 = "12pm";
} else {
  nextTime2 = nextTime2 > 12 ? nextTime2 - 12 + "pm" : nextTime2 + "am";
}

var nextTime3 = new Date(next3.time*1000).getHours();
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
