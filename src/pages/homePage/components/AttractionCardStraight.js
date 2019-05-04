import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import { Consumer } from '../../../context/DataContext';
import LanguageZhTW from '../../../language/zh-TW';
import LanguageEn from '../../../language/en';

class AttractionCardStraight extends Component {
  strTmpLanguageHandle = (strTmp) => {
    if (strTmp.includes('公里')) {
      return strTmp.match(/\d+(.\d+)?/g) + ' KM';
    } else if (strTmp.includes('公尺')) {
      return strTmp.match(/\d+(.\d+)?/g) + 'M';
    }
  }
  render() {
    const { contentText,backgroundImage,opentTIme,MRTColor,strTmp,CAT2, _id, stitle, stitle_en, MRT, address,area,currentDay,currentActiveDay } = this.props.data;
    const { backgroundImageActive } = this.props;
    return (
      <Consumer>
      {({uid,userData,clickHeartIconHandle,filterFavorite,language}) => {
        let languageStatus;
        let strTmpText;
        let addClass;
        language === 'zh-TW' ? languageStatus = LanguageZhTW : languageStatus = LanguageEn;
        strTmp && (language === 'zh-TW' ? strTmpText = `距離 ${strTmp}` : strTmpText = this.strTmpLanguageHandle(strTmp));
        language === 'zh-TW' ? addClass = '' : addClass = ' en';
        return (
          <div className="col-lg-4" data-id={_id}>
            <Link to={`/attraction/${_id}`} className="attractionCard d-flex d-lg-block">
              <div className="attractionCard-photo" style={ backgroundImage }>
                { MRT && (
                  <div className={`attractionCard-MRT d-flex ${MRTColor}`}>
                    <div className="attractionCard-MRT-icon"></div>
                    <span>{MRT}</span>
                  </div>
                )}
                {strTmp ? (
                  <div className="attractionCard-dist d-flex h-align-items-center">
                    <FontAwesome name="map-marker" className="map-marker"/>
                    {strTmpText}
                  </div>) 
                  : null }
                <button className="attractionCard-heart" data-id={_id} onClick={(e) => clickHeartIconHandle(e,uid,userData)} >
                  <div className="heart" data-id={_id} style={ filterFavorite(userData,_id) ? backgroundImageActive : null }></div>
                </button>
              </div>
              <div className="attractionCard-content">
                <div className={language === 'zh-TW' ? 'attractionCard-tag h-align-items-center h-justify-content-center' : 'attractionCard-tag en h-align-items-center h-justify-content-center'}>
                  <span className="tagText-wrap">{language === 'zh-TW' ? CAT2.replace(/\s*/g,"") : CAT2}</span>
                </div>
                <div className="attractionCard-content-title-wrap">
                  <h1 className= 'attractionCard-content-title d-inline-block'>
                    {language === 'zh-TW' ? stitle : stitle_en}
                  </h1>
                </div>
                <p className="attractionCard-content-subtilte d-flex h-align-items-center"><FontAwesome name="map-marker" className="map-marker"/>{area}</p>
                <div className="attractionCard-content-addres-wrap"><p className="attractionCard-content-addres d-sm-none">{address}</p></div>
                <p className={`attractionCard-content-texts d-none d-sm-block${addClass}`}>{`${contentText}....。`}</p>
                <div className="attractionCard-details-wrap d-flex h-align-items-center h-justify-content-between">
                  <button className="attractionCard-details-btn">{languageStatus.card.detailsBtn}</button>
                  <div className="attractionCard-details-time d-flex h-align-items-center">{opentTIme ? 
                    <p>{opentTIme}</p> : <p>{currentDay ? currentDay+` : ${languageStatus.card.openAllDay}` : currentActiveDay+` : ${languageStatus.card.openAllDay}`}</p>}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )
      }}
      </Consumer>
    )
  }
}

export default AttractionCardStraight;
