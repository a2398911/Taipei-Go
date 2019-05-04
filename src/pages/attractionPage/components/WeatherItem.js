import React, { Component } from 'react';
import { Consumer } from '../../../context/DataContext';

class WeatherItem extends Component {
  dateLanguageHandle = (day) => {
    let newDay;
    switch (day) {
      case '星期一':
        newDay = 'Monday'
        break;
      case '星期二':
        newDay = 'Tuesday'
        break;
      case '星期三':
        newDay = 'Wednesday'
        break;
      case '星期四':
        newDay = 'Thursday'
        break;
      case '星期五':
        newDay = 'Friday'
        break;
      case '星期六':
        newDay = 'Saturday'
        break;
      default:
        newDay = 'Sunday'
        break;
    }
    return newDay
  }
  render() {
    return (
      <Consumer>
      {({language}) => (
        <div className={`weather-item h-flex-column h-justify-content-center h-align-items-center ${this.props.class}`}>
          <div className="weather-date d-inline-block">{this.props.date}</div>
          <div className={`weather-icon ${this.props.icon}`}></div>
          <div className="temperature">{this.props.temperature}</div>
          <div className="weather-day">{language === 'zh-TW' ? this.props.day : this.dateLanguageHandle(this.props.day)}</div>
          {language === 'zh-TW' ? <p className="weatherStatus">{this.props.status}</p> : null}
        </div>
      )}
      </Consumer>
    )
  }
}

export default WeatherItem;
