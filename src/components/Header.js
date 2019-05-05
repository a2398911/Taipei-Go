import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Consumer } from '../context/DataContext';
import { fireAuth } from '../config/firebase.js';
import FontAwesome  from 'react-fontawesome';
import memberIcon from '../img/member-icon.svg';
import languageIcon from '../img/language-icon.svg';
import LanguageEn from '../language/en';
import LanguageZhTW from '../language/zh-TW';
import './Header.scss';

class Header extends Component {
  state = {
    mobileMenu: false,
    languageSelect: false,
    languageMobileMenu: false,
  }
  signOutHandle = (setState) => {
    fireAuth.signOut();
    setState({ showRemindModel: 2 });
  }
  errorReminModelHandle = (uid,setState) => {
    !uid && setState({ showErrorReminModel: true });
  }
  mobileMenuHandle = () => {
    this.setState({
      mobileMenu: !this.state.mobileMenu,
      languageMobileMenu: false,
    })
  }
  showLanguageSelectHandle = (e) => {
    const currentActiveClassName = e.target.className;
    currentActiveClassName === 'menuLink-text' | currentActiveClassName === 'icon' 
      && this.setState({ languageSelect: !this.state.languageSelect });
  }
  showLanguageSelectModelHandle = () => {
    this.setState({ languageMobileMenu: !this.state.languageMobileMenu })
  }
  setCookieLanguage = (language,setState,getTaipeiDate,changeLanguageMRT,changeLanguageAdvance, isMobile = false) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + 1*24*60*60*1000);
    document.cookie = `language=${language}; max-age=${expires}; path=/`;
    this.setState({ languageSelect: false });
    setState({ 
      language: language,
      results: null,
      searchData: null,
    });
    getTaipeiDate(language);
    changeLanguageMRT(language);
    changeLanguageAdvance(language);
    isMobile && this.mobileMenuHandle();
  }
  render() {
    const { mobileMenu,languageSelect,languageMobileMenu } = this.state;
    return (
      <Consumer>
        {({ setState,uid,userData,resetSearchInput,getTaipeiDate,changeLanguageMRT,language,changeLanguageAdvance}) => {
          let languageStatus;
          language === 'zh-TW' ? languageStatus = LanguageZhTW : languageStatus = LanguageEn;
          return (
            <>
              <header className="header d-flex h-align-items-center">
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <nav className="nav d-flex h-justify-content-md-between h-align-items-center">
                        <Link to="/" className="logo d-inline-block" onClick={resetSearchInput}></Link>
                        <div className="menu-wrap d-none d-md-flex h-align-items-center">
                          {userData ? <span className="header-name">{`Hi，${userData.nickName}`}</span> : null}
                          <Link to={uid ? '/myHeart' : '/' } className="menuLink d-flex h-align-items-center" onClick={() => this.errorReminModelHandle(uid,setState)}>
                            <FontAwesome name="heart" className="heart"/>
                            <span className="menuLink-text">{languageStatus.navbar.favorite}</span>
                          </Link>
                          <span className="menuLink d-flex h-align-items-center">
                            <img className="icon" src={memberIcon} alt=""/>
                            {uid ? (
                              <span className="menuLink-text" onClick={() => this.signOutHandle(setState)}>{languageStatus.navbar.signOut}</span>
                            ) : (
                              <span className="menuLink-text" onClick={e => {
                                e.preventDefault();
                                setState({ showSignInModel: true })  
                              }}>
                                {languageStatus.navbar.signIn}
                              </span>
                            )}
                          </span>
                          <span className="menuLink d-flex h-align-items-center" onClick={this.showLanguageSelectHandle}>
                            <img className="icon" src={languageIcon} alt=""/>
                            <span className="menuLink-text">Language</span>
                            <ul className={languageSelect ? 'language-select show' : 'language-select'}>
                              <li className="language-select-item" onClick={() => this.setCookieLanguage('zh-TW',setState,getTaipeiDate,changeLanguageMRT,changeLanguageAdvance)}>中文(繁)</li>
                              <li className="language-select-item" onClick={() => this.setCookieLanguage('en',setState,getTaipeiDate,changeLanguageMRT,changeLanguageAdvance)}>English</li>
                            </ul>
                          </span>
                        </div>
                        <div className={mobileMenu ? 'menu-mobile-btn d-flex h-flex-column h-justify-content-between d-md-none h-align-items active' : 'menu-mobile-btn d-flex h-flex-column h-justify-content-between h-align-items d-md-none'} onClick={this.mobileMenuHandle}>
                          <span className="d-inline-block"></span>
                          <span className="d-inline-block"></span>
                          <span className="d-inline-block"></span>
                        </div>
                        <div className="memberIcon-mobile-wrap d-md-none" onClick={uid ? () => this.signOutHandle(setState) : () => setState({showSignInModel: true})}>
                          <img className="memberIcon d-inline-block" src={memberIcon} alt="" />
                          <span className="mobile-text">{uid ? languageStatus.navbar.signOutModel : languageStatus.navbar.signInModel}</span>
                        </div>
                      </nav>
                    </div>
                  </div>
                </div>
              </header>
              <nav className={mobileMenu ? 'mobile-menu-wrap d-md-none show' : 'mobile-menu-wrap d-md-none'}>
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <Link to={uid ? '/myHeart' : '/' } className="menuLink d-flex h-align-items-center" onClick={() => this.errorReminModelHandle(uid,setState)}>
                        <span className="menuLink-text" onClick={() => this.setState({ mobileMenu: false })}>{languageStatus.navbar.favorite}</span>
                      </Link>
                      <div className="menuLink itemLink-2" onClick={this.showLanguageSelectModelHandle}>Language</div>
                    </div>
                  </div>
                </div>
              </nav>
              <nav className={languageMobileMenu ? 'mobile-menu-wrap language d-md-none show' : 'mobile-menu-wrap language d-md-none'}>
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <div className="language-wrap">
                        <div className="menuLink language-item" onClick={() => this.setCookieLanguage('zh-TW',setState,getTaipeiDate,changeLanguageMRT,changeLanguageAdvance,true)}>中文(繁體)</div>
                        <div className="menuLink language-item" onClick={() => this.setCookieLanguage('en',setState,getTaipeiDate,changeLanguageMRT,changeLanguageAdvance,true)}>English</div>
                      </div>
                    </div>
                  </div>
                </div>
              </nav>
            </>
          )
        }}
      </Consumer>
    )
  }
}

export default Header;