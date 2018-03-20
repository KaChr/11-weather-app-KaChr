import React, { Component } from 'react';

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
    
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&APPID=7254d050ae7bb47c60b4718eac4b2132&units=metric`)
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
    }

    render() {
        return(
            <div>
                <form onSubmit={this.onSubmit.bind(this)}>
                    <input type="text" placeholder="City name here" name="city" />
                    <button type="submit">Search</button>
                </form>
                {this.state.weather && this.state.weather.length > 0 ? 
                    <div className="App-weather">
                        <ul>
                            <li>
                                <img src={`http://openweathermap.org/img/w/${this.state.weather[0].icon}.png`} title="Weather icon" alt="Weather icon" />
                            </li>
                            <li>
                                <h2>{this.state.main.temp} Celsius</h2>
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
            </div>
        );
    }
    
    calculateTime(time) {
        return new Date(time * 1e3).toISOString().slice(-13, -5);
    }
}

export default Form;