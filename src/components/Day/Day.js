import React, { Component } from 'react';

import './Day.css';

class Day extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { unit } = this.props;
        return (
            <div className="table-responsive">
                <table className="table App-table">
                    <thead>
                        <tr>
                            <th scope="col">Date:</th>
                            <th scope="col">Temp:</th>
                            <th scope="col">Description:</th>
                            <th scope="col">Wind speed:</th>
                            <th scope="col">Humidity:</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">{this.props.interval.dt_txt}</th>
                            <td>
                                <p>{this.props.interval.main.temp} &deg; {unit}</p>
                            </td>
                            <td>
                                <p>{this.props.interval.weather[0].description}</p>
                            </td>
                            <td>
                                <p>{this.props.interval.wind.speed}m/s</p>
                            </td>
                            <td>
                                <p>{this.props.interval.main.humidity}%</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Day;