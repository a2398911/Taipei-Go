import React, { Component } from 'react';
import FontAwesome from "react-fontawesome";
import { Consumer } from "../../../context/DataContext";
import LanguageZhTW from '../../../language/zh-TW';
import LanguageEn from '../../../language/en';
class SearchBarWeb extends Component {
  render() {
    const { showOptionDate,optionDateShow,
            closeOptionDate,showOptionMRT,week,
            optionMRTShow,toggleSearchAdvanced,searchAdvanced,
            currentThemeIsTag,changeCurrentTheme 
          } = this.props; 
    return (
      <Consumer>
      {({searchInput, changeInputHandle, language, selectDayOptionHandle, selectMrtOptionHandle, searchDay,
        searchMRT, TaipeiMRT, searchHandle, selectTagThemes, tagTheme, selectAreaThemes, areaTheme, removeSelectItem }) => {
        let languageStatus;
        let theme;
        language === 'zh-TW' ? languageStatus = LanguageZhTW : languageStatus = LanguageEn;  
        currentThemeIsTag ? theme = 'tag' : theme = 'area';
        return (
          <div className="searchBar-wrap">
            <div className="search-wrap">
              <input
                type="text"
                className="search"
                value={searchInput}
                onChange={changeInputHandle}
                onKeyDown={(e) => e.keyCode === 13 && searchHandle(e)}
              />
              {!searchInput && (
              <span className="placeholder d-flex h-align-items-center">
                <FontAwesome name="compass" className="compass" />
                {languageStatus.hero.search}
              </span>
              )}
            </div>
            <div className="select-wrap">
              <button
                className="select d-flex h-align-items-center"
                onFocus={showOptionDate}
                onClick={selectDayOptionHandle}/>
              <div className="placeholder d-flex h-align-items-center">
                <FontAwesome name="calendar" className="calendar" />
                <span className="select-text">{searchDay ? searchDay : languageStatus.hero.date}</span>
                <FontAwesome
                  name="chevron-down"
                  className="chevron-down"
                />
              </div>
              <ul className={ optionDateShow ? "option" : "option d-none"} onClick={closeOptionDate}>
                {week.map((item, index) => <li key={index} onClick={selectDayOptionHandle}>{item}</li>)}
              </ul>
            </div>
            <div className="select-wrap">
              <button
                className="select d-flex h-align-items-center"
                onFocus={showOptionMRT}
                onClick={selectMrtOptionHandle}/>
              <div className="placeholder d-flex h-align-items-center">
                <FontAwesome name="location-arrow" className="location-arrow"/>
                <span className="select-text">
                  {!searchMRT ? languageStatus.hero.MRT : searchMRT}
                </span>
                <FontAwesome name="chevron-down" className="chevron-down"/>
              </div>
              <ul className={ optionMRTShow && !searchMRT ? "option" : "option d-none" }>
                {TaipeiMRT.map(item => (
                  <li key={item.id} onClick={selectMrtOptionHandle}>
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
            <button className="search-btn" onClick={searchHandle}>{languageStatus.hero.searchBtn}</button>
            <button className="searchAdvanced-btn" onClick={toggleSearchAdvanced}>
              <FontAwesome name="sliders" className="sliders" />
              {languageStatus.hero.advancedSearchBtn}
            </button>
            <div className={ searchAdvanced ? "searchAdvanced-content-wrap" : "searchAdvanced-content-wrap d-none" }>
              <div className="searchAdvanced-selectBtns-wrap d-flex h-align-items-center h-justify-content-center">
                <button
                  className={ currentThemeIsTag ? "tag-btn active" : "tag-btn"}
                  onClick={changeCurrentTheme}>
                  {languageStatus.hero.themed}
                </button>
                <button
                  className={ !currentThemeIsTag ? "area-btn active" : "area-btn" }
                  onClick={changeCurrentTheme}>
                  {languageStatus.hero.district}
                </button>
              </div>
              <div className="searchAdvanced-content d-flex h-flex-column h-align-items-center h-justify-content-center">
                <div className="searchAdvanced-items-wrap d-flex h-justify-content-center h-flex-wrap">
                  {currentThemeIsTag && tagTheme.map(item => (
                    <button className={ item.active ? "searchAdvanced-item active" : "searchAdvanced-item" }
                      key={item.id}
                      data-index={item.id}
                      onClick={selectTagThemes}>
                      {item.name}
                    </button>
                  ))}
                  {!currentThemeIsTag && areaTheme.map(item => (
                    <button
                      className={ item.active ? "searchAdvanced-item active" : "searchAdvanced-item" }
                      key={item.id}
                      data-index={item.id}
                      onClick={selectAreaThemes}>
                        {item.name}
                    </button>
                  ))}
                </div>
                <div className="searchAdvanced-wrap">
                  <button className="searchAdvanced-clear" onClick={() => { removeSelectItem(theme) }}>{languageStatus.hero.searchAdvancedClearBtn}</button>
                  <button className="searchAdvanced-serch" onClick={searchHandle}>{languageStatus.hero.searchAdvancedSerchBtn}</button>
                </div>
              </div>
            </div>
          </div>
        )
      }}
      </Consumer>
      
    )
  }
}

export default SearchBarWeb;
