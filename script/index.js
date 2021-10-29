// VARIABLES

// variable used when changing cities to display
let chosenCity = locations[0];

// varible containing all relevant data to currently display
let dataSet;

// variables containing three dates
let today = new Date();
let tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
let twoDaysFromNow = new Date(tomorrow);
twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 1);
let currentHour = today.getHours();

let controls = [
  document.querySelector('#listTemp'),
  document.querySelector('#listRain'),
  document.querySelector('#listWind'),
  document.querySelector('#listHum'),
];

const select = document.querySelector('select');

// FUNCTIONS

// get a location to display, pass an object from the locations variable
async function fetchLocation(city) {
  let currentLocation = new Location(city);
  let response = await currentLocation.getData();

  console.log(currentLocation);
  // console.log(response);

  dataSet = currentLocation;
  init();
}

// function to display the current weather in the chosen city
function todaysWeather() {
  let currentTimestamp = dataSet.data.properties.timeseries[0];
  console.log(currentTimestamp);
  let index = currentHour - currentTimestamp.time.slice(11, 13);
  console.log(index);
  currentTimestamp = dataSet.data.properties.timeseries[index];
  let icon = currentTimestamp.data.next_1_hours.summary.symbol_code;

  let elements = [
    document.querySelector('#cityName'),
    document.querySelector('#temperatureNow'),
    document.querySelector('.windText'),
    document.querySelector('.rainText'),
    document.querySelector('#updateTime'),
  ];

  emptyElements(elements);

  document.querySelector('#cityName').append(dataSet.locationName);
  document.querySelector(
    '#currentWeather > img'
  ).src = `weathericon/svg/${icon}.svg`;
  document
    .querySelector('#temperatureNow')
    .append(
      dataSet.data.properties.timeseries[index].data.instant.details
        .air_temperature + '°'
    );
  document
    .querySelector('.windText')
    .append(
      dataSet.data.properties.timeseries[index].data.instant.details
        .wind_speed + 'm/s'
    );
  document
    .querySelector('.rainText')
    .append(
      dataSet.data.properties.timeseries[index].data.next_1_hours.details
        .precipitation_amount + 'mm'
    );
  document
    .querySelector('#updateTime')
    .append(
      `Updated at: ${dataSet.data.properties.meta.updated_at.slice(11, 16)}`
    );
}

// function to empty elements
function emptyElements(elements) {
  elements.forEach((element) => {
    element.innerHTML = '';
  });
}

// function to fill the scrollable list with the chosen day (fillList())
function updateList() {
  let element = document.querySelector('#scrollableView');
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }

  // filter out the timestamps to show
  let timestamps = dataSet.data.properties.timeseries;
  console.log(timestamps);
  let filteredList = [];

  timestamps.forEach((timestamp, index) => {
    let remainingHours = 24 - today.getHours();
    let totalHours = remainingHours + 38;

    if (index < totalHours) {
      filteredList.push(timestamp);
    }
  });
  console.log(filteredList);

  filteredList.forEach((timestamp) => {
    let listItem = document.createElement('div');
    listItem.classList.add('visible');

    //get the info that's to be appended from the timestamps
    let listInfo = [
      timestamp.time.slice(11, 16),
      timestamp.data.next_1_hours.summary.symbol_code,
      timestamp.data.instant.details.air_temperature + '°',
      timestamp.data.next_1_hours.details.precipitation_amount + 'mm',
      timestamp.data.instant.details.wind_speed,
      timestamp.data.instant.details.relative_humidity + '% humidity',
    ];

    listInfo.forEach((item, index) => {
      let itemToAppend;
      if (index != 1) {
        itemToAppend = document.createElement('p');
        itemToAppend.append(item);
      } else {
        itemToAppend = document.createElement('img');
        itemToAppend.src = `weathericon/svg/${item}.svg`;
      }

      switch (index) {
        case 2:
          itemToAppend.classList.add('listTemp');
          break;
        case 3:
          itemToAppend.classList.add('listRain');
          break;
        case 4:
          itemToAppend.classList.add('listWind');
          itemToAppend.append('m/s');
          itemToAppend.value = item;
          break;
        case 5:
          itemToAppend.classList.add('listHum');
          break;
      }
      listItem.append(itemToAppend);
    });

    document.querySelector('#scrollableView').append(listItem);
  });
}

// function to initialize the filling of information after the request has been recieved (init())
function init() {
  todaysWeather();
  updateList();
}

// function to handle accessability by toggling with keys
function toggleChecked(element) {
  element.checked = !element.checked;
}

function handleKeys(keyValue) {
  console.log(keyValue);
  let element;
  switch (keyValue) {
    case 'i':
      console.log('i');
      document.querySelector('#popupBg').classList.toggle('popupVisible');
      break;
    case 'Enter':
      console.log('i');
      document.querySelector('#popupBg').classList.remove('popupVisible');
      break;
    case 'p':
      element = document.querySelector('#cityList');
      element.focus();
      break;
    case 'l':
      element = document.querySelector('#scrollableView');
      element.focus();
      break;
    case 't':
      element = document.querySelector('#listTemp');
      toggleChecked(element);
      triggerEvent(element, 'change');
      break;
    case 'r':
      element = document.querySelector('#listRain');
      toggleChecked(element);
      triggerEvent(element, 'change');
      break;
    case 'w':
      element = document.querySelector('#listWind');
      toggleChecked(element);
      triggerEvent(element, 'change');
      break;
    case 'h':
      element = document.querySelector('#listHum');
      toggleChecked(element);
      triggerEvent(element, 'change');
      break;
    case 'f':
      element = document.querySelector('#windFilter');
      toggleChecked(element);
      triggerEvent(element, 'change');
      break;
    default:
      break;
  }
}

// function to handle programmatically clicked filters
function triggerEvent(element, eventName) {
  let event = new Event(eventName);
  element.dispatchEvent(event);
}

// EVENT HANDLERS

document.querySelector('select').addEventListener('change', (e) => {
  let index = document.querySelector('select').value;
  chosenCity = locations[index];
  fetchLocation(chosenCity);
});

controls.forEach((control) => {
  control.addEventListener('change', () => {
    let elements = document.querySelectorAll(`.${control.id}`);
    elements.forEach((element) => {
      element.classList.toggle('collapse');
    });
  });
});

document.querySelector('#windFilter').addEventListener('change', () => {
  let elements = document.querySelectorAll('#scrollableView > div');
  elements.forEach((element) => {
    let child = element.childNodes[4];
    if (child.value < 10) {
      element.classList.toggle('semiTransparent');
    }
  });
});

document.addEventListener('keydown', (e) => {
  handleKeys(e.key);
});

// DIRECT CODE

// get the desired locations data
fetchLocation(chosenCity);

// fill the select tag with available options
for (index in locations) {
  select.options[select.options.length] = new Option(
    locations[index].name,
    index
  );
}

// uncheck filters at refresh
controls.forEach((control) => {
  control.checked = false;
});

document.querySelector('#windFilter').checked = false;
