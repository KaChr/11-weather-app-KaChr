import React, { Component } from 'react';
import Day from '../Day/Day';

import './Form.css';

class Form extends Component {
    constructor() {
        super();
        this.state = {
            weather: [],
            celcius: true,
            main: null,
            unit: 'C'
        }
        this.handleChange = this.handleChange.bind(this);
    }

    onSubmit(event) {
        event.preventDefault();
    
        const cityname = event.nativeEvent.target.elements[0].value;
    
        if (cityname) {
            this.setState ({
                unit: 'C'
            });
        }

        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&APPID=64a5d018d1e74df43bacb71c6a919c32&units=metric`)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    weather: res.weather,
                    wind: res.wind,
                    main: res.main,
                    sys: res.sys
                }, function() {
                console.log('Is okey?', this.state);
            })
        });

        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&APPID=64a5d018d1e74df43bacb71c6a919c32&units=metric`)
            .then(res => res.json())
            .then(res => {
              this.setState({
                  forecast: res.list
                }, function () {
                  console.log(res);
                  console.log('Is okey?', this.state.weather);
                }
              );
            })
            .catch(function (error) {
              console.log(error);
            });
    }


    setUnit() {
        this.setState ({
          unit: 'C'
        })
      }
      
    //   Helper 
      toCelsius(fahrenheit) {
        return ((fahrenheit - 32) * 5 / 9).toFixed(2);
      }
      
      toFahrenheit(celsius) {
        return ((celsius * 9 / 5) + 32).toFixed(2);
      }
      
    
    handleChange(e) {
        if (!this.state.main.temp) {
            return;
        }

        this.setState({unit: e.target.value},
        () => {
            if(this.state.unit === 'C') {
                let tempC = this.toCelsius(this.state.main.temp);
                let forecastC = this.state.forecast.map((interval, index) => {
                    let temp = interval.main.temp;
                    let newTemp = this.toCelsius(temp);
                    return {
                        ...interval,
                        main: {
                            ...interval.main,
                            temp: newTemp
                        }
                    } 
                });
                this.setState({
                  unit: 'C',
                  main: {
                    temp: tempC
                  },
                  forecast: forecastC
                })
              } else {

                let tempF = this.toFahrenheit(this.state.main.temp);
                let forecastF = this.state.forecast.map((interval, index) => {
                    let temp = interval.main.temp;
                    let newTemp = this.toFahrenheit(temp);
                    return {
                        ...interval,
                        main: {
                            ...interval.main,
                            temp: newTemp
                        }
                    } 
                });

                this.setState({
                  unit: 'F',
                  main: {
                    temp: tempF
                  },
                  forecast: forecastF
                })
              }
        });
    } 

    render() {
        const unit = this.state.unit;

        return(
            <div>
                <form className="form-inline my-2 my-lg-0 App-form" onSubmit={this.onSubmit.bind(this)}>
                    <input className="form-control mr-sm-2" type="text" placeholder="City name here" name="city" />
                    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                </form>
                <form>
                    <input type="radio" name="temp" value={'F'} onChange={this.handleChange} id="temp-f" checked={this.state.unit === 'F'} disabled={!this.state.main} />
                    <label htmlFor="temp-f">Fahrenheit</label><br /> 
                    <input type="radio" name="temp" value={'C'} onChange={this.handleChange} id="temp-c" checked={this.state.unit === 'C'} disabled={!this.state.main} />
                    <label htmlFor="temp-c">Celsius</label>
                </form>
                {this.state.weather && this.state.weather.length > 0 ? 
                    <div className="App-weather">
                        <ul>
                            <li>
                                <img src={`http://openweathermap.org/img/w/${this.state.weather[0].icon}.png`} title="Weather icon" alt="Weather icon" />   
                            </li>
                            <li>
                                <h2>{this.state.main.temp} &deg; {this.state.unit}</h2>
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
                    : <p>You have to search to get a result.</p>
                }
                {this.state.forecast && this.state.forecast.length > 0 ?
                    <div className="App-forecast">
                        {this.state.forecast.map((interval, index) => {
                            return <Day key={index} interval={interval} unit={this.state.unit} />
                        })
                        }
                    </div>
                    : ''
                }
            </div>
        );
    }

    calculateTime(time) {
        return new Date(time * 1e3).toISOString().slice(-13, -5);
    }
}

export default Form;