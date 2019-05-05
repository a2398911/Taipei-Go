import React, { Component } from 'react';
import { Consumer } from "../../../context/DataContext";
import TaipeiMRT from '../../../taipei-MRT.json';
import TaipeiMRT_EN from '../../../taipei-MRT_EN.json';
import activeHeartIcon from '../../../img/heart-hover-icon.svg';
import './AttractionCard.scss';
import AttractionCardStraight from './AttractionCardStraight';  
import AttractionCardHorizontal from './AttractionCardHorizontal';

class AttractionCard extends Component {
  getDay = (language) => {
    const time = new Date();
    const day = time.getDay();
    let currentDay;
    if (language === 'zh-TW') {
      switch (day) {
        case 0:
          currentDay = '星期日'
          break;
        case 1:
          currentDay = '星期一'
          break;
        case 2:
          currentDay = '星期二'
          break;
        case 3:
          currentDay = '星期三'
          break;
        case 4:
          currentDay = '星期四'
          break;
        case 5:
          currentDay = '星期五'
          break;
        default:
          currentDay = '星期六'
          break;
      }
    } else {
      switch (day) {
        case 0:
          currentDay = 'Sunday'
          break;
        case 1:
          currentDay = 'Monday'
          break;
        case 2:
          currentDay = 'Tuesday'
          break;
        case 3:
          currentDay = 'Wednesday'
          break;
        case 4:
          currentDay = 'Thursday'
          break;
        case 5:
          currentDay = 'Friday'
          break;
        default:
          currentDay = 'Saturday'
          break;
      }
    }
    
    return currentDay;
  }
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
  filterOpenTime = (opentTime, searchDay = this.getDay(), language) => {
    if (!opentTime) return;
    let filterTime;
    if ( opentTime && language === 'zh-TW') {
      filterTime = opentTime.filter(item => {
        let day = item.substr(0,3);
        return searchDay === day
      })
    } else if (opentTime && language !== 'zh-TW') {
      filterTime = opentTime.filter(item => item.includes(searchDay))
    }
    return filterTime[0]
  }
  contentTextBreakLineHandle = (text) => {
    const textArray = text.split(/[\r\n]/);
    const textArrayFilter = textArray.filter(item => item.length && item !== '&nbsp;');
    return textArrayFilter;
  }
  render() {
    if(!this.props.data) { return null }
    const { CAT2, _id, stitle, stitle_en, MRT, address, xbody, images, area, opening_hours, language_status } = this.props.data;
    const { cardIsRow, strTmp } = this.props;
    let MRTLine;
    let MRTColor;
    let photo;
    images && (photo = images[0].src);
    let backgroundImage = { backgroundImage: `url(${photo})` };
    let backgroundImageActive = { backgroundImage: `url(${activeHeartIcon})`};
    return (
      <Consumer>
        {({ currentDay,language }) => {
          let opentTIme;
          let currentActiveDay = this.getDay(language);
          let contentText;
          xbody && (language === 'zh-TW' ? contentText = (this.contentTextBreakLineHandle(xbody))[0].substr(0, 40) : contentText = this.contentTextBreakLineHandle(xbody.substr(0, 30)));
          MRT && (this.filterMRTLine(MRT, language))[0] && (MRTLine = (this.filterMRTLine(MRT, language))[0].line) && (MRTColor = this.switchMRTLine(MRTLine, language));
          !currentDay && (opentTIme = this.filterOpenTime(opening_hours));
          currentDay && (opentTIme = this.filterOpenTime(opening_hours, currentDay));
          let data = {contentText,backgroundImage,opentTIme,MRTColor,strTmp,CAT2, _id, stitle, stitle_en, MRT, address,area,currentDay,currentActiveDay};
          return (
            cardIsRow ? <AttractionCardHorizontal data={data} contentText={contentText} backgroundImageActive={backgroundImageActive}/> 
              : <AttractionCardStraight data={data} contentText={contentText} backgroundImageActive={backgroundImageActive}/>
          )
        }}
      </Consumer>
    )
  }
}
export default AttractionCard;