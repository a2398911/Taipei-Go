import React, { Component, Fragment } from 'react';
import WeatherItem from './WeatherItem'
import './WeatherWrap.scss';

class WeatherWrap extends Component {

  render() {
    const { data } = this.props;
    return (
      <div className="col-12">
        <div className="attraction-weather-wrap d-flex h-justify-content-between h-align-items-center">
          {data && data.map((item,index) => {
            let currentStatus;       
            item.situation.includes('多雲時陰') && (currentStatus = 'wearth-cloudy-day');
            item.situation.includes('陣雨') && (currentStatus = 'wearth-rain');
            item.situation.includes('雷雨') && (currentStatus = 'wearth-thunderstorm');

            let date;
            let day;
            item.nightDay ? date = item.nightDay.substr(0,5) : date = item.morningDay.substr(0,5);
            item.nightDay ? day = item.nightDay.substr(5,8) : day = item.morningDay.substr(5,8);

            let addCalss = '';
            let lineCalss ='line';
            index === 2 && (lineCalss+=' d-none d-sm-inline-block');
            index === 3 && (addCalss+=' d-none d-sm-flex') && (lineCalss+=' d-none d-md-inline-block');
            index === 4 && (addCalss+=' d-none d-md-flex') && (lineCalss+=' d-none d-lg-inline-block');
            index === 5 | index === 6 && (addCalss+=' d-none d-lg-flex') && (lineCalss+=' d-none d-lg-inline-block');
            return (
              <Fragment key={index}>
                <WeatherItem class={addCalss} temperature={item.temperature} 
                  date={date} status={item.situation} day={day} icon={currentStatus}/>
                {index < 6 ? <span className={ lineCalss }></span> : null}
              </Fragment>
            )
          })}
        </div>
      </div>
    )
  }
}

export default WeatherWrap;