import React, { Component, Fragment } from 'react';
import WeatherItem from './WeatherItem'
import './WeatherWrap.scss';

class WeatherWrap extends Component {

  render() {
    const { data,currentTemperature } = this.props;
    return (
      <div className="col-12">
        <div className="attraction-weather-wrap d-flex h-justify-content-between h-align-items-center">
          {data && data.map((item,index) => {
            const { day } = item;
            const currentTime = new Date();
            const currentHours = currentTime.getHours();
            let timeSlot;
            let currentStatus;       
            (currentHours <= 18 && currentHours >= 6) ? (timeSlot = 'morning') : (timeSlot = 'night');
            item[timeSlot].situation.includes('多雲時陰') && (currentStatus = 'wearth-cloudy-day');
            item[timeSlot].situation.includes('陣雨') && (currentStatus = 'wearth-rain');
            item[timeSlot].situation.includes('雷雨') && (currentStatus = 'wearth-thunderstorm');

            let date = day.substr(0,5);
            let addCalss = '';
            let lineCalss ='line';
            index === 2 && (lineCalss+=' d-none d-sm-inline-block');
            index === 3 && (addCalss+=' d-none d-sm-flex') && (lineCalss+=' d-none d-md-inline-block');
            index === 4 && (addCalss+=' d-none d-md-flex') && (lineCalss+=' d-none d-lg-inline-block');
            index === 5 | index === 6 && (addCalss+=' d-none d-lg-flex') && (lineCalss+=' d-none d-lg-inline-block');
            return (
              <Fragment key={index}>
                <WeatherItem class={addCalss} temperature={item[timeSlot].temperature} 
                  date={date} status={item[timeSlot].situation} day={day.substr(5,8)} icon={currentStatus}/>
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