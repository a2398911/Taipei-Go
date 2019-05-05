import React, { Component } from 'react';
import FontAwesome  from 'react-fontawesome'; 
import { Consumer } from "../../../context/DataContext";
import SearchAdvancedMobile from './SearchAdvancedMobile';
import LanguageZhTW from '../../../language/zh-TW';
import LanguageEn from '../../../language/en';
import './SearchBarMobile.scss';

class SearchBarMobile extends Component {
  render() {
    const { showOptionDate,optionDateShow,
      closeOptionDate,showOptionMRT,week,
      optionMRTShow,currentThemeIsTag,
      changeCurrentTheme, closeOptionDateOnSection 
    } = this.props; 
    return (
      <Consumer>
      {({showSearchAdvancedMobile, searchInput, changeInputHandle, selectDayOptionHandle,
      selectMrtOptionHandle, searchDay, searchMRT, TaipeiMRT, searchHandle, searchAdvancedMobileHandle, language}) => {
        let languageStatus;
        language === 'zh-TW' ? languageStatus = LanguageZhTW : languageStatus = LanguageEn;  
        return (
          <section className="searchBar-wrap-mobile h-align-items-center" onClick={closeOptionDateOnSection}>
            <div className="container">
              {showSearchAdvancedMobile
                  ? <SearchAdvancedMobile currentThemeIsTag={currentThemeIsTag} changeCurrentTheme={changeCurrentTheme}/> 
                  : null}
              <div className="row">
                <div className="col-12">
                <div className="search-wrap">
                  <input type="text" className="search" value={searchInput} onChange={changeInputHandle}/>
                    {!searchInput && (
                      <span className="placeholder d-flex h-align-items-center">
                        <FontAwesome name="compass" className="compass" />
                        {languageStatus.hero.search}
                      </span>
                    )}
                </div>
                </div>
                <div className="col-12">
                  <div className="select-wrap">
                    <button className="select d-flex h-align-items-center"
                      onFocus={showOptionDate}
                      onClick={selectDayOptionHandle}
                      onTouchStart={showOptionDate}
                      >
                    </button>
                    <div className="placeholder d-flex h-align-items-center">
                      <FontAwesome name="calendar" className="calendar" />
                      <span className="select-text">{searchDay ? searchDay : languageStatus.hero.date}</span>
                      <FontAwesome name="chevron-down" className="chevron-down" />
                    </div>
                    <ul className={ optionDateShow ? "option" : "option d-none"} onClick={closeOptionDate}>
                      { week.map((item, index) => {
                        return <li key={index} onClick={selectDayOptionHandle}>{item}</li>
                      }) }
                    </ul>
                  </div>
                </div>
                <div className="col-12">
                  <div className="select-wrap">
                    <button className="select d-flex h-align-items-center"
                      onFocus={showOptionMRT}
                      onClick={selectMrtOptionHandle}
                      onTouchStart={showOptionMRT}
                      >
                    </button>
                    <div className="placeholder d-flex h-align-items-center">
                      <FontAwesome name="location-arrow" className="location-arrow" />
                      <span className="select-text">{!searchMRT ? languageStatus.hero.MRT : searchMRT}</span>
                      <FontAwesome name="chevron-down" className="chevron-down" />
                    </div>
                    <ul className={ optionMRTShow && !searchMRT ? "option" : "option d-none" }>
                      {TaipeiMRT.map(item => (
                        <li key={item.id} onClick={selectMrtOptionHandle}>
                          {item.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="col-12">
                  <div className="search-btn-wrap d-flex">
                    <button className="search-btn" onClick={searchHandle}>{languageStatus.hero.searchBtn}</button>
                    <button className="searchAdvanced-btn" onClick={searchAdvancedMobileHandle}>
                      <FontAwesome name="sliders" className="sliders" />
                      {languageStatus.hero.advancedSearchBtn}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
      }}
      </Consumer>
    )
  }
}

export default SearchBarMobile;