import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router-dom';
import './AttractionCardHorizontal.scss';
import { Consumer } from '../../../context/DataContext';
import LanguageZhTW from '../../../language/zh-TW';
import LanguageEn from '../../../language/en';

export default class AttractionCardHorizontal extends Component {
  render() {
    const { contentText,backgroundImage,opentTIme,MRTColor,CAT2, _id, stitle, MRT, address,area,currentDay,currentActiveDay, stitle_en } = this.props.data;
    const { backgroundImageActive } = this.props;
    console.log(opentTIme,'opentTIme');
    return (
      <Consumer>
      {({uid,userData,clickHeartIconHandle,filterFavorite,language}) => {
        let languageStatus;
        let addClass;
        language === 'zh-TW' ? languageStatus = LanguageZhTW : languageStatus = LanguageEn;
        language === 'zh-TW' ? addClass = '' : addClass = ' en';
        return (
          <div className="col-12 col-lg-6" data-id={_id}>
            <Link to={`/attraction/${_id}`}>
              <div className="attractionCard Horizontal d-flex">
                <div className="attractionCard-photo" style={ backgroundImage }>
                  { MRT && (
                    <div className={`attractionCard-MRT d-flex ${MRTColor}`}>
                      <div className="attractionCard-MRT-icon"></div>
                      <span>{MRT}</span>
                    </div>
                  )}
                  <button className="attractionCard-heart" data-id={_id} onClick={(e) => clickHeartIconHandle(e,uid,userData)} >
                    <div className="heart" data-id={_id} style={ filterFavorite(userData,_id) ? backgroundImageActive : null }></div>
                  </button>
                </div>
                <div className="attractionCard-content">
                  <div className={language === 'zh-TW' ? 'attractionCard-tag h-align-items-center h-justify-content-center' : 'attractionCard-tag en h-align-items-center h-justify-content-center'}>
                    <span className="tagText-wrap">{language === 'zh-TW' ? CAT2.replace(/\s*/g,"") : CAT2}</span>
                  </div>
                  <div className="attractionCard-content-title-wrap">
                    <h1 className={language === 'zh-TW' ? 'attractionCard-content-title d-inline-block' : 'attractionCard-content-title en d-inline-block'}>
                      {language === 'zh-TW' ? stitle : stitle_en}
                    </h1>
                  </div>
                  <p className="attractionCard-content-subtilte d-flex h-align-items-center"><FontAwesome name="map-marker" className="map-marker"/>{area}</p>
                  <div className="attractionCard-content-addres-wrap"><p className="attractionCard-content-addres d-sm-none">{address}</p></div>
                  <p className={`attractionCard-content-texts d-none d-sm-block${addClass}`}>{`${contentText}....。`}</p>
                  <div className="attractionCard-details-wrap d-flex h-align-items-center h-justify-content-between">
                    <button className="attractionCard-details-btn">{languageStatus.card.detailsBtn}</button>
                    <div className="attractionCard-details-time d-flex">{opentTIme ? 
                      <p>{opentTIme}</p> : <p>{currentDay ? currentDay+` : ${languageStatus.card.openAllDay}` : currentActiveDay+` : ${languageStatus.card.openAllDay}`}</p>}
                    </div>
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
