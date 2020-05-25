import React, { Component } from "react";
import Day from "../Day/Day";

import "./Form.css";

class Form extends Component {
  constructor() {
    super();
    this.state = {
      time: {},
      weather: [],
      celcius: true,
      main: null,
      unit: "C",
      cityname: "",
      weatherHere: {
        wind: {},
        speed: {},
        main: {},
        humidity: {},
        sys: {},
        sunrise: {},
        sunset: {}
      },
      longitude: 0,
      latitude: 0
    };
    this.error = this.error.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  UNSAFE_componentWillMount() {
    navigator.geolocation.getCurrentPosition(this.getLocation, this.error);
  }

  getLocation(position) {
    this.setState(
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      function() {
        this.location();
      }
    );
  }

  error() {
    alert(
      "Could not find any result for your current location so here is the result for Stockholm instead. :)"
    );
    this.setState(
      {
        latitude: 59.334591,
        longitude: 18.06324
      },
      function() {
        this.location();
      }
    );
  }

  location() {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${
        this.state.latitude
      }&lon=${
        this.state.longitude
      }&APPID=64a5d018d1e74df43bacb71c6a919c32&units=metric`
    )
      .then(res => res.json())
      .then(res => {
        this.setState(
          {
            weatherHere: res
          }
        );
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  onSubmit(event) {
    event.preventDefault();

    const cityname = event.nativeEvent.target.elements[0].value;

    if (cityname) {
      this.setState({
        unit: "C",
        cityname: cityname
      });
    }

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&APPID=64a5d018d1e74df43bacb71c6a919c32&units=metric`
    )
      .then(res => res.json())
      .then(res => {
        this.setState({
          weather: res.weather,
          wind: res.wind,
          main: res.main,
          sys: res.sys
        });
      });

    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&APPID=64a5d018d1e74df43bacb71c6a919c32&units=metric`
    )
      .then(res => res.json())
      .then(res => {
        this.setState({
          forecast: res.list
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  setUnit() {
    this.setState({
      unit: "C"
    });
  }

  toCelsius(fahrenheit) {
    return (((fahrenheit - 32) * 5) / 9).toFixed(0);
  }

  toFahrenheit(celsius) {
    return ((celsius * 9) / 5 + 32).toFixed(0);
  }

  updateForecast(unit, convertedTemp) {
    let newTemp = "";

    if (this.state.forecast) {
      const newForecast = this.state.forecast.map(interval => {
        let temp = interval.main.temp;

        if (unit === "C") {
          newTemp = this.toCelsius(temp);
        } else {
          newTemp = this.toFahrenheit(temp);
        }

        return {
          ...interval,
          main: {
            ...interval.main,
            temp: newTemp
          }
        };
      });

      this.setState({
        unit: unit,
        main: {
          temp: newTemp
        },
        forecast: newForecast
      });
    } else {
      this.setState({
        ...this.state,
        weatherHere: {
          ...this.state.weatherHere,
          main: {
            ...this.state.weatherHere.main,
            temp: convertedTemp
          }
        }
      });
    }
  }

  handleChange(e) {
    if (!this.state.main && !this.state.weatherHere.main.temp) {
      return;
    }

    const currentTempValue = !!this.state.weatherHere
      ? this.state.weatherHere.main.temp
      : this.state.main;

    this.setState({ unit: e.target.value }, () => {
      if (this.state.unit === "C") {
        let convertedTemp = this.toCelsius(currentTempValue);
        this.updateForecast(this.state.unit, convertedTemp);
      } else {
        let convertedTemp = this.toFahrenheit(currentTempValue);
        this.updateForecast(this.state.unit, convertedTemp);
      }
    });
  }

  calculateTime(time) {
    return new Date(time * 1e3).toISOString().slice(-13, -5);
  }

  render() {

    return (
      <div>
        <form
          className="form-inline my-2 my-lg-0 App-form"
          onSubmit={this.onSubmit.bind(this)}
          >
          <input
            className="form-control mr-sm-2"
            type="text"
            placeholder="City name here"
            name="city"
            />
          <button
            className="btn btn-outline-success my-2 my-sm-0"
            type="submit"
            >
            Search
          </button>
        </form>
        <hr />
        <form>
          <input
            type="radio"
            name="temp"
            value={"F"}
            onChange={this.handleChange}
            id="temp-f"
            checked={this.state.unit === "F"}
            disabled={!this.state.main && !this.state.weatherHere.main.temp}
            />
          <label htmlFor="temp-f">Fahrenheit</label>
          <br />
          <input
            type="radio"
            name="temp"
            value={"C"}
            onChange={this.handleChange}
            id="temp-c"
            checked={this.state.unit === "C"}
            disabled={!this.state.main && !this.state.weatherHere.main.temp}
            />
          <label htmlFor="temp-c">Celsius</label>
        </form>

        {!this.state.forecast ?
          this.state.weatherHere.weather &&
          this.state.weatherHere.weather.length > 0 ? (
            <div className="App-location">
              <ul>
                <li>
                  <h3>
                    My location: <strong>{this.state.weatherHere.name}</strong>
                  </h3>
                </li>
                <li>
                  <img
                    src={`http://openweathermap.org/img/w/${
                      this.state.weatherHere.weather[0].icon
                    }.png`}
                    title="Weather icon"
                    alt="Weather icon"
                    />
                </li>
                <li>
                  <h2>
                    {this.state.weatherHere.main.temp} &deg; {this.state.unit}
                  </h2>
                </li>
                <li>
                  <p>
                    And {this.state.weatherHere.weather[0].description} outside.
                  </p>
                </li>
                <li>
                  <p>
                    Current windspeed is {this.state.weatherHere.wind.speed}m/s.
                  </p>
                </li>
                <li>
                  <p>
                    Current humidity is {this.state.weatherHere.main.humidity}%.
                  </p>
                </li>
                <li>
                  <p>
                    Sunrise:{" "}
                    {this.calculateTime(this.state.weatherHere.sys.sunrise)}
                  </p>
                </li>
                <li>
                  <p>
                    Sunset:{" "}
                    {this.calculateTime(this.state.weatherHere.sys.sunset)}
                  </p>
                </li>
              </ul>
            </div>
          ) : (
            ""
            )
            : (
              ""
              )}
        <hr />
        {this.state.weather && this.state.weather.length > 0 ? (
          <div className="App-weather">
            <ul>
              <li>
                <h3>
                  City name: <strong>{this.state.cityname}</strong>
                </h3>
              </li>
              <li>
                <img
                  src={`http://openweathermap.org/img/w/${
                    this.state.weather[0].icon
                  }.png`}
                  title="Weather icon"
                  alt="Weather icon"
                  />
              </li>
              <li>
                <h2>
                  {this.state.main.temp} &deg; {this.state.unit}
                </h2>
              </li>
              <li>
                <p>And {this.state.weather[0].description} outside.</p>
              </li>
              <li>
                <p>Current windspeed is {this.state.wind.speed}m/s.</p>
              </li>
              <li>
                <p>Current humidity is {this.state.main.humidity}%.</p>
              </li>
              <li>
                <p>Sunrise: {this.calculateTime(this.state.sys.sunrise)}</p>
              </li>
              <li>
                <p>Sunset: {this.calculateTime(this.state.sys.sunset)}</p>
              </li>
            </ul>
          </div>
        ) : (
          ""
          )}
        {this.state.forecast && this.state.forecast.length > 0 ? (
          <div className="App-forecast">
            {this.state.forecast.map((interval, index) => {
              return (
                <Day key={index} interval={interval} unit={this.state.unit} />
                );
              })}
          </div>
        ) : (
          ""
          )}
      </div>
    );
  }
}

export default Form;
