/* Magic Mirror Module: MMM-FAA-Delay
 * Version: 1.0.0
 *
 * By Nigel Daniels https://github.com/nigel-daniels/
 * MIT Licensed.
 */

Module.register('MMM-3Day-Forecast', {

	defaults: {
    api_key: '',
    lat: 0.0,
    lon: 0.0,
		units: 'M',
		lang: 'en',
		horizontalView:	false,
    interval: 900000 // Every 15 mins
  },

  start:  function() {
    Log.log('Starting module: ' + this.name);

    // Set up the local values, here we construct the request url to use
    this.units = this.config.units==='I'?'imperial':'metric';
    this.loaded = false;
		//this.url = 'https://api.openweathermap.org/data/2.5/forecast?appid=' + this.config.api_key + '&lat=' + this.config.lat + '&lon=' + this.config.lon + '&units=' + this.units + '&lang=' + this.config.lang + '&cnt=24';
		this.url = 'https://api.openweathermap.org/data/3.0/onecall?appid=' + this.config.api_key
		  + '&lat=' + this.config.lat + '&lon=' + this.config.lon
		  + '&units=' + this.units + '&lang=' + this.config.lang
		  + 'exclude=current,minutely,hourly,alerts';
    this.forecast = [];
		this.horizontalView = this.config.horizontalView;

    // Trigger the first request
    this.getWeatherData(this);
  },


  getStyles: function() {
    return ['font-awesome.css', '3day_forecast.css'];
  },


  getTranslations: function() {
    return  {
			da:	'translations/da.json',
			de:	'translations/de.json',
      en: 'translations/en.json',
      fr: 'translations/fr.json',
			it:	'translations/it.json',
			nb:	'translations/nb.json',
			nl:	'translations/nl.json',
			pt: 'translations/pt.json'
    };
  },

  getWeatherData: function(_this) {
    // Make the initial request to the helper then set up the timer to perform the updates
    _this.sendSocketNotification('GET-3DAY-FORECAST', _this.url);
    setTimeout(_this.getWeatherData, _this.config.interval, _this);
  },

  iconMap: {
    "01d" : "sun",
    "01n" : "moon",
    "02d" : "cloud-sun",
    "02n" : "cloud-moon",
    "03d" : "cloud",
    "03n" : "cloud",
    "04d" : "cloud",
    "04n" : "cloud",
    "09d" : "cloud-showers-heavy",
    "09n" : "cloud-showers-heavy",
    "10d" : "cloud-sun-rain",
    "10n" : "cloud-moon-rain",
    "11d" : "cloud-bolt",
    "11n" : "cloud-bolt",
    "13d" : "snowflake",
    "13n" : "snowflake",
    "50d" : "smog",
    "50n" : "smog"
  },


  getDom: function() {
    // Set up the local wrapper
    var wrapper = null;


    // If we have some data to display then build the results
    if (this.loaded) {

			if (this.horizontalView) {
				wrapper = document.createElement('table');
				wrapper.className = 'small';

				// Set up the forecast for three three days
	      for (var i = 0; i < 3; i++) {
	        var title = '';
					var maxC = '--';
					var maxF = '--';
					var minC = '--';
					var minF = '--';

					// Determine which day we are detailing
	        switch (i) {
	          case 0:
	            title = this.translate('TODAY');
	            break;
	          case 1:
	            title = this.translate('TOMORROW');
	            break;
	          case 2:
	            title = this.translate('DAYAFTER');
	            break;
	        }

					if (this.forecast[i].high !== '--') {
						if (this.units === 'metric') {
							maxC = this.forecast[i].high;
							minC = this.forecast[i].low;
						} else {
							maxF = this.forecast[i].high;
							minF = this.forecast[i].low;
						}
					}

					row1 = document.createElement('tr');

					forecastIconCell = document.createElement('td');
					forecastIconCell.className = 'forecastIcon2';
					forecastIconCell.setAttribute('rowspan', '2');

					forecastIcon = document.createElement('img');
	        forecastIcon.setAttribute('height', '50');
	        forecastIcon.setAttribute('width', '50');
	        forecastIcon.src = this.generateIconSrc(this.iconMap[this.forecast[i].icon]);

					forecastTitleCell = document.createElement('td');
					forecastTitleCell.className = 'forecastTitle2 bright';
					forecastTitleCell.setAttribute('colspan', '4');
					forecastTitleCell.innerHTML = title;

					row2 = document.createElement('tr');

					tempIconCell = document.createElement('td');
					tempIconCell.className = 'detailIcon2';

					tempIcon = document.createElement('img');
	        tempIcon.setAttribute('height', '15');
	        tempIcon.setAttribute('width', '15');
	        tempIcon.src = this.generateIconSrc('i-temperature');

					tempCell = document.createElement('td');
					tempCell.className = 'detailText2';
					if (this.units === 'metric') {
	          tempCell.innerHTML = Math.round(minC) + ' &deg;C / ' + Math.round(maxC) + ' &deg;C';
	        } else {
	          tempCell.innerHTML = Math.round(minF) + ' &deg;F / ' + Math.round(maxF) + ' &deg;F';
	        }

					rainIconCell = document.createElement('td');
					rainIconCell.className = 'detailIcon2';

					rainIcon = document.createElement('img');
	        rainIcon.setAttribute('height', '15');
	        rainIcon.setAttribute('width', '15');
	        rainIcon.src = this.generateIconSrc('i-rain');

					rainCell = document.createElement('td');
					rainCell.className = 'detailText2';
					rainCell.innerHTML = Math.round(this.forecast[i].pop * 100) + ' %';

					row3 = document.createElement('tr');

					forecastTextCell = document.createElement('td');
					forecastTextCell.className = 'forecastText2';
					forecastTextCell.innerHTML = this.forecast[i].conditions;

					humidityIconCell = document.createElement('td');
					humidityIconCell.className = 'detailIcon2';

					humidityIcon = document.createElement('img');
	        humidityIcon.setAttribute('height', '15');
	        humidityIcon.setAttribute('width', '15');
	        humidityIcon.src = this.generateIconSrc('i-humidity');

					humidityCell = document.createElement('td');
					humidityCell.className = 'detailText2';
					humidityCell.innerHTML = Math.round(this.forecast[i].humid) + ' %';

					windIconCell = document.createElement('td');
					windIconCell.className = 'detailIcon2';

					windIcon = document.createElement('img');
	        windIcon.setAttribute('height', '15');
	        windIcon.setAttribute('width', '15');
	        //windIcon.src = './modules/MMM-3Day-Forecast/images/dir/' + this.forecast[i].wdir + '.png';
	        windIcon.src = this.generateIconSrc('i-wind');

					windCell = document.createElement('td');
					windCell.className = 'detailText2';

					if (this.units === 'metric') {
	          windCell.innerHTML = Math.round((this.forecast[i].wspd * 10 ) / 10) + ' ' + this.translate('MPS');
	        } else {
	          windCell.innerHTML = Math.round((this.forecast[i].wspd * 10 ) / 10) + ' ' + this.translate('MPH');
	        }

					forecastIconCell.appendChild(forecastIcon);

					tempIconCell.appendChild(tempIcon);
					rainIconCell.appendChild(rainIcon);
					humidityIconCell.appendChild(humidityIcon);
					windIconCell.appendChild(windIcon);

					row1.appendChild(forecastIconCell);
					row1.appendChild(forecastTitleCell);

					row2.appendChild(tempIconCell);
					row2.appendChild(tempCell);
					row2.appendChild(rainIconCell);
					row2.appendChild(rainCell);

					row3.appendChild(forecastTextCell);
					row3.appendChild(humidityIconCell);
					row3.appendChild(humidityCell);
					row3.appendChild(windIconCell);
					row3.appendChild(windCell);

					wrapper.appendChild(row1);
					wrapper.appendChild(row2);
					wrapper.appendChild(row3);
				}

			} else {
			  console.log(this.forecast);
	      wrapper = document.createElement('table');
			  wrapper.className = 'forecast small';

	      forecastRow = document.createElement('tr');

	      // Set up the forecast for three three days
	      for (var i = 0; i < 3; i++) {
	        var forecastClass = '';
	        var title = '';
					var maxC = '--';
					var maxF = '--';
					var minC = '--';
					var minF = '--';

	        // Determine which day we are detailing
	        switch (i) {
	          case 0:
	            forecastClass = 'today';
	            title = this.translate('TODAY');
	            break;
	          case 1:
	            forecastClass = 'tomorrow';
	            title = this.translate('TOMORROW');
	            break;
	          case 2:
	            forecastClass = 'dayAfter';
	            title = this.translate('DAYAFTER');
	            break;
	        }

					//if (this.forecast[i].high !== '--') {
					//	if (this.units === 'metric') {
					//		C = this.forecast[i].high;
					//		F = ((((C*9)/5)+32) * 10 ) / 10;
					//	} else {
					//		F = this.forecast[i].high;
					//		C = ((((F-32)*5)/9) * 10 ) / 10;
					//	}
				  //}
					if (this.forecast[i].high !== '--') {
						if (this.units === 'metric') {
							maxC = this.forecast[i].high;
							minC = this.forecast[i].low;
						} else {
							maxF = this.forecast[i].high;
							minF = this.forecast[i].low;
						}
					}

	        // Create the details for this day
	        forcastDay = document.createElement('td');
	        forcastDay.className = 'forecastday ' + forecastClass;

	        forcastTitle = document.createElement('div');
	        forcastTitle.className = 'forecastTitle';
	        forcastTitle.innerHTML = title;

	        forecastIcon = document.createElement('i');
	        forecastIcon.className = 'fa fa-' + this.iconMap[this.forecast[i].icon] + ' fa-2x forecastIcon2';
	        forecastIcon.setAttribute('height', '50');
	        forecastIcon.setAttribute('width', '50');

	        forecastText = document.createElement('div');
	        forecastText.className = 'forecastText horizontalView bright';
	        forecastText.innerHTML = this.forecast[i].conditions;

	        forecastBr = document.createElement('br');

	        // Create div to hold all of the detail data
	        forecastDetail = document.createElement('div');
	        forecastDetail.className = 'forecastDetail';

	        // Build up the details regarding temprature
	        tempIcon = document.createElement('i');
	        tempIcon.className = 'fa fa-temperature-half fa-fw detailIcon2';
	        tempIcon.setAttribute('height', '15');
	        tempIcon.setAttribute('width', '15');

	        tempText = document.createElement('span');
	        tempText.className = 'normal';
	        //if (this.units === 'metric') {
	        // tempText.innerHTML = Math.round(C) + '&deg; C (' + Math.round(F) + '&deg; F)';
	        //} else {
					//	tempText.innerHTML = Math.round(F) + '&deg; F (' + Math.round(C) + '&deg; C)';
	        //}
					if (this.units === 'metric') {
	          tempText.innerHTML = Math.round(minC) + ' &deg;C / ' + Math.round(maxC) + ' &deg;C';
	        } else {
	          tempText.innerHTML = Math.round(minF) + ' &deg;F / ' + Math.round(maxF) + ' &deg;F';
	        }
	        tempBr = document.createElement('br');

	        // Build up the details regarding precipitation %
	        rainIcon = document.createElement('i');
	        rainIcon.className = 'fa fa-umbrella fa-fw detailIcon2';
	        rainIcon.setAttribute('height', '15');
	        rainIcon.setAttribute('width', '15');

	        rainText = document.createElement('span');
	        rainText.innerHTML = Math.round(this.forecast[i].pop * 100) + ' %';

	        rainBr = document.createElement('br');

	        // Build up the details regarding humidity %
	        humidIcon = document.createElement('i');
	        humidIcon.className = 'fa fa-droplet fa-fw detailIcon2';
	        humidIcon.setAttribute('height', '15');
	        humidIcon.setAttribute('width', '15');

	        humidText = document.createElement('span');
	        humidText.className = 'normal';
	        humidText.innerHTML = Math.round(this.forecast[i].humid) + ' %';

	        humidBr = document.createElement('br');

	        // Build up the details regarding wind
	        windIcon = document.createElement('i');
	        windIcon.className = 'fa fa-wind fa-fw detailIcon2';
	        windIcon.setAttribute('height', '15');
	        windIcon.setAttribute('width', '15');

	        windText = document.createElement('span');
	        if (this.units === 'metric') {
	          windText.innerHTML = Math.round((this.forecast[i].wspd * 10 ) / 10) + ' ' + this.translate('MPS') + ' ' + this.forecast[i].wdir;
	        } else {
	          windText.innerHTML = Math.round((this.forecast[i].wspd * 10 ) / 10) + ' ' + this.translate('MPH') + ' ' + this.forecast[i].wdir;
	        }

	        //windBr = document.createElement('br');

	        // Now assemble the details
	        forecastDetail.appendChild(tempIcon);
	        forecastDetail.appendChild(tempText);
	        forecastDetail.appendChild(tempBr);
	        forecastDetail.appendChild(rainIcon);
	        forecastDetail.appendChild(rainText);
	        forecastDetail.appendChild(rainBr);
	        forecastDetail.appendChild(humidIcon);
	        forecastDetail.appendChild(humidText);
	        forecastDetail.appendChild(humidBr);
	        forecastDetail.appendChild(windIcon);
	        forecastDetail.appendChild(windText);
	        //forecastDetail.appendChild(windBr);

	        forcastDay.appendChild(forcastTitle);
	        forcastDay.appendChild(forecastIcon);
	        forcastDay.appendChild(forecastText);
	        forcastDay.appendChild(forecastBr);
	        forcastDay.appendChild(forecastDetail);

	        // Now assemble the final output
	        forecastRow.appendChild(forcastDay);
	      }

	      wrapper.appendChild(forecastRow);
			}
    } else {
      // Otherwise lets just use a simple div
      wrapper = document.createElement('div');
      wrapper.innerHTML = this.translate('LOADING');
    }

    return wrapper;
  },


  socketNotificationReceived: function(notification, payload) {
    // check to see if the response was for us and used the same url
    if (notification === 'GOT-3DAY-FORECAST' && payload.url === this.url) {
      // we got some data so set the flag, stash the data to display then request the dom update
      this.loaded = true;
      this.forecast = payload.forecast;
      this.updateDom(1000);
    }
  },


});
