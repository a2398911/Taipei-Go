import React, { Component } from 'react';
import { Consumer } from '../../../context/DataContext';
import FontAwesome from "react-fontawesome";
import activeHeartIcon from '../../../img/heart-hover-icon.svg';
import LanguageZhTW from '../../../language/zh-TW';
import LanguageEn from '../../../language/en';
import TaipeiMRT from '../../../taipei-MRT.json';
import TaipeiMRT_EN from '../../../taipei-MRT_EN';

class AttractionDetailsInfo extends Component {
  filterMRTLine = (MRTName, language) => {
    let TaipeiMRTData;
    language === 'zh-TW' ? TaipeiMRTData = TaipeiMRT : TaipeiMRTData = TaipeiMRT_EN;
    return TaipeiMRTData.filter(item => {
      return item.name === MRTName
    })
  }
  switchMRTLine = (MRTLine, language) => {
    let currentMRTLineColor;
    if (language === 'zh-TW') {
      switch (MRTLine) {
        case '文山內湖線' :
          currentMRTLineColor = 'MRT-brown'
          break;
        case '淡水、信義線' :
          currentMRTLineColor = 'MRT-red'
          break;
        case '小南門、新店線' :
          currentMRTLineColor = 'MRT-green'
          break;
        case '中和、蘆洲、新莊線' :
          currentMRTLineColor = 'MRT-yellow'
          break;
        default:
          currentMRTLineColor = 'MRT-blue'
          break;
      }
    } else {
      switch (MRTLine) {
        case 'Wenhu Line':
          currentMRTLineColor = 'MRT-brown'
          break;
        case 'Tamsui-Xinyi Line':
          currentMRTLineColor = 'MRT-red'
          break;
        case 'Songshan-Xindian Line':
          currentMRTLineColor = 'MRT-green'
          break;
        case 'Zhonghe-Xinlu Line':
          currentMRTLineColor = 'MRT-yellow'
          break;
        default:
          currentMRTLineColor = 'MRT-blue'
          break;
      }
    }
    return currentMRTLineColor;
  }
  monthsWordHandle = (months) => {
    return months.split(',').sort();
  }
  TextBreakLineHandle = (text, smallBreak = false) => {
    const textArray = text.split(/[\r\n]/);
    const textArrayFilter = textArray.filter(item => item.length && item !== '&nbsp;');
    return smallBreak ? textArrayFilter.join('<br />') : textArrayFilter.join('<br /><br />');
  }
  render() {
    const { _id,target,address,months,ticket,opening_hours,CAT2,service,
      official_site,tel,latitude,longitude,MRT,xbody,open_time,remind,images,stitle,stitle_en } = this.props.data;
      let MRTLine;
      let MRTColor;
      let photo;
      let newXbody =  this.TextBreakLineHandle(xbody);
      let newOpenTime = this.TextBreakLineHandle(open_time,true);
      let newRemind = this.TextBreakLineHandle(remind,true);
      let newTicket = this.TextBreakLineHandle(ticket,true);
      images && (photo = images[0].src);
      let backgroundImageActive = { backgroundImage: `url(${activeHeartIcon})`};
      let backgroundImage = {
        backgroundImage: `url(${photo})`,
      };
    return (
      <Consumer>
        {({uid,userData,clickHeartIconHandle,filterFavorite,language}) => {
          let languageStatus;
          let detailsTitleClass;
          language === 'zh-TW' ? languageStatus = LanguageZhTW : languageStatus = LanguageEn;
          language === 'zh-TW' ? detailsTitleClass = 'details-title' : detailsTitleClass = 'details-title en';
          MRT && (this.filterMRTLine(MRT,language))[0] && (MRTLine = (this.filterMRTLine(MRT,language))[0].line) && (MRTColor = this.switchMRTLine(MRTLine,language));
          return (
            <div className="attraction-info-wrap">
              <div className="attraction-img" style={ backgroundImage }>
                <button className="attractionCard-heart" data-id={_id} onClick={(e) => clickHeartIconHandle(e,uid,userData)}>
                  <div className="heart" data-id={_id} style={ filterFavorite(userData,_id) ? backgroundImageActive : null }></div>  
                </button>
              </div>
              <div className={language === 'zh-TW' ? 'attraction-info' : 'attraction-info en'} dangerouslySetInnerHTML={{ __html: newXbody}}></div>
              <div className="attraction-detailsInfo-wrap">
                <div className="attraction-details-title title">{languageStatus.attractionPage.infoTitle}</div>
                <ul className="attraction-details-item d-flex">
                  <li className={detailsTitleClass}>{languageStatus.attractionPage.tag}</li>
                  <li className="dtails-content-text"><FontAwesome name="tag" className="tag"/>{CAT2.replace(/\s*/g,"")}</li>
                </ul>
                {target ? (
                  <ul className="attraction-details-item d-flex">
                    <li className={detailsTitleClass}>{languageStatus.attractionPage.category}</li>
                    {target.map(item => (
                      <li className="dtails-content-text target" key={item.id}><FontAwesome name="map-pin" className="map-pin"/>{item.name}</li>
                    ))}
                  </ul>
                ) : null}
                {address ? (
                  <ul className="attraction-details-item d-flex">
                    <li className={detailsTitleClass}>{languageStatus.attractionPage.address}</li>
                    <li className="dtails-content-text"><FontAwesome name="map-marker" className="map-marker"/>{address}</li>
                  </ul>
                ) : null}
                {months ? (
                  <ul className="attraction-details-item d-flex h-align-items-center">
                    <li className={detailsTitleClass}>{languageStatus.attractionPage.month}</li>
                    <li className="dtails-content-text d-flex h-flex-wrap">{this.monthsWordHandle(months).map((item, index) => <span className="dtails-months d-flex h-justify-content-center" key={index}>{item}</span>)}</li>
                  </ul>
                ) : null}
                <ul className="attraction-details-item d-flex">
                  <li className={detailsTitleClass}>{languageStatus.attractionPage.openTime}</li>
                  <li className="dtails-content-text">{ opening_hours ? (opening_hours.map((item,index) => {
                    return <span className="d-block opentTime-list" key={index}>{item}</span>
                  })): languageStatus.card.openAllDay}</li>
                </ul>
                {newOpenTime ? (
                  <ul className="attraction-details-item d-flex">
                    <li className={detailsTitleClass}>{languageStatus.attractionPage.openRemind}</li>
                    <li className="dtails-content-text" dangerouslySetInnerHTML={{ __html: newOpenTime}} ></li>
                  </ul>
                ) : null}
                {newRemind ? (
                  <ul className="attraction-details-item d-flex">
                    <li className={detailsTitleClass}>{languageStatus.attractionPage.Remind}</li>
                    <li className="dtails-content-text" dangerouslySetInnerHTML={{ __html: newRemind}}></li>
                  </ul>
                ) : null}
                {ticket ? (
                  <ul className="attraction-details-item d-flex">
                    <li className={detailsTitleClass}>{languageStatus.attractionPage.ticket}</li>
                    <li className="dtails-content-text" dangerouslySetInnerHTML={{ __html: newTicket}}></li>
                  </ul>
                ) : null}
                {service ? (
                  <ul className="attraction-details-item d-flex">
                    <li className={detailsTitleClass}>{languageStatus.attractionPage.service}</li>
                    <li className="dtails-content-text">{service.map(item => <span className="details-service" key={item.id}><FontAwesome name="check-square" className="check-square" />{item.name}</span> )}</li>
                  </ul>
                ) : null}
                {official_site ? (
                  <ul className="attraction-details-item d-flex">
                    <li className={detailsTitleClass}>{languageStatus.attractionPage.web}</li>
                    <a href={official_site} target="_blank" className="details-official-site" rel="noopener noreferrer">{language === 'zh-TW' ? stitle : stitle_en}</a>
                  </ul>
                ) : null}
                {tel ? (
                  <ul className="attraction-details-item d-flex h-align-items-center">
                    <li className={detailsTitleClass}>{languageStatus.attractionPage.tel}</li>
                    <a href={`tel:${tel}`} className="details-official-site" rel="noopener noreferrer">
                      <FontAwesome name="phone" className="phone"/>{tel}
                    </a>
                  </ul>
                ) : null}
                {MRTLine ? (
                  <ul className="attraction-details-item d-flex h-align-items-center">
                    <li className={detailsTitleClass}>{languageStatus.attractionPage.mrt}</li>
                    <li className="dtails-content-text mobile-MRT"><span className={`MRT-line ${MRTColor}`}>{MRTLine}</span><span>{MRT}</span></li>
                  </ul>
                  ) : null}
                <ul className="attraction-details-item d-flex h-align-items-center">
                  <li className={detailsTitleClass}>{languageStatus.attractionPage.traffic}</li>
                  <li className="dtails-content-text"><a href={`https://www.google.com/maps?daddr=${latitude},${longitude}&hl=${language}`}
                    target="_blank" rel="noopener noreferrer" className="googleMap-link">{languageStatus.attractionPage.trafficContentText}</a></li>
                </ul>
              </div>
            </div>
          )
        }}
      </Consumer>
    )
  }
}

export default AttractionDetailsInfo;
