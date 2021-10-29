class Location {
  // pass object with location name plus it's coordinates and data from fetch request
  constructor(locationObj) {
    this.locationName = locationObj.name;
    this.latitude = locationObj.coordinateArr[0];
    this.longitude = locationObj.coordinateArr[1];
    this.data;
  }

  // get the desired data from the API regarding chosen location
  async getData() {
    const lat = this.latitude;
    const long = this.longitude;

    // create fetch request to get data from API based on constructor-values
    let response = await fetch(
      `https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${lat}&lon=${long}`
    )
      .then((response) => response.json())
      .then((response) => (this.data = response));

    return response;
  }
}
