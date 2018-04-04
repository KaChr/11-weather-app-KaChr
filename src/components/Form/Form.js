import React, { Component } from 'react';
import Day from '../Day/Day';

import './Form.css';

class Form extends Component {
    constructor() {
        super();
        this.state = {
            weather: []
        }
    }

    onSubmit(event) {
        event.preventDefault();
    
        const cityname = event.nativeEvent.target.elements[0].value;
    
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

    render() {
        return(
            <div>
                <form className="form-inline my-2 my-lg-0 App-form" onSubmit={this.onSubmit.bind(this)}>
                    <input className="form-control mr-sm-2" type="text" placeholder="City name here" name="city" />
                    <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                </form>
                {this.state.weather && this.state.weather.length > 0 ? 
                    <div className="App-weather">
                        <ul>
                            <li>
                                <img src={`http://openweathermap.org/img/w/${this.state.weather[0].icon}.png`} title="Weather icon" alt="Weather icon" />   
                            </li>
                            <li>
                                <h2>{this.state.main.temp} &deg; C</h2>
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
                            return <Day key={index} interval={interval} />
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