import React, { Component } from 'react';
import { Consumer } from "../../../context/DataContext";
import './SearchAdvancedMobile.scss';
import LanguageZhTW from '../../../language/zh-TW';
import LanguageZhEn from '../../../language/en';

class SearchAdvancedMobile extends Component {
  render() {
    const { currentThemeIsTag,changeCurrentTheme } = this.props;
    return (
      <Consumer>
      {({selectTagThemes, tagTheme, selectAreaThemes, areaTheme, searchHandle, searchAdvancedMobileHandle, language}) => {
        let languageStatus;
        language === 'zh-TW' ? languageStatus = LanguageZhTW : languageStatus = LanguageZhEn;
        return (
          <>
            <div className="mobile searchAdvanced-content-wrap">
              <div className="searchAdvanced-selectBtns-wrap d-flex h-align-items-center h-justify-content-center">
                <button className={ currentThemeIsTag ? "tag-btn active" : "tag-btn"}
                  onClick={changeCurrentTheme}>{languageStatus.hero.themed}</button>
                <button className={!currentThemeIsTag ? "area-btn active" : "area-btn"}
                  onClick={changeCurrentTheme}>{languageStatus.hero.district}</button>
              </div>
              <div className="searchAdvanced-content d-flex h-flex-column h-align-items-center h-justify-content-center">
                <div className="searchAdvanced-items-wrap d-flex h-justify-content-center h-flex-wrap">
                  {currentThemeIsTag ? (currentThemeIsTag && tagTheme.map(item => {
                    return (
                      <button className={ item.active ? 'searchAdvanced-item active' : 'searchAdvanced-item' }
                        key={item.id}
                        data-index={item.id}
                        onClick={selectTagThemes}>
                          {item.name}
                      </button>
                    );
                  })) : (areaTheme.map(item => {
                    return (
                      <button
                        className={ item.active ? "searchAdvanced-item active" : "searchAdvanced-item"}
                        key={item.id}
                        data-index={item.id}
                        onClick={selectAreaThemes}>
                          {item.name}
                      </button>);
                  }))}
                </div>
                <button className="searchAdvanced-searchBtn" onClick={searchHandle}>{languageStatus.hero.searchAdvancedSerchBtn}</button>
              </div>
            </div>
            <div className="cover-bg" onClick={searchAdvancedMobileHandle}></div>
          </>
        )
      }}
      </Consumer>
    )
  }
}

export default SearchAdvancedMobile;
