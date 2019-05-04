import React, { Component } from 'react';
import FontAwesome from "react-fontawesome";
import './Footer.scss';
import { Consumer } from "../context/DataContext";
import LanguageZhTW from '../language/zh-TW';
import LanguageZhEn from '../language/en';

class Footer extends Component {
  render() {
    return (
      <Consumer>
      {({language}) => {
        let languageStatus;
        language === 'zh-TW' ? languageStatus = LanguageZhTW : languageStatus = LanguageZhEn;
        return (
          <footer className="footer-bg">
            <div className="footer">
              <div className="container d-flex h-flex-column h-flex-sm-row h-align-items-center h-align-items-sm-end h-justify-content-between">
                <div className="logo-wrap d-flex">
                  <div className="logo"></div>
                  <div className="footer-info d-none d-md-block">
                    <div>{languageStatus.footer.address}</div>
                    <div>{languageStatus.footer.tel}</div>
                    <div>{languageStatus.footer.serviceTime}</div>
                  </div>
                </div>
                <div className="footer-link-wrap d-flex h-flex-column">
                  <div className="footer-icon-wrap d-none d-sm-flex">
                    <FontAwesome name="github" className="github"/>
                    <FontAwesome name="facebook-square" className="facebook-square"/>
                  </div>
                  <div className="copyright">COPYRIGHT © 2019 TAIPEIGO All rights reserved.</div>
                </div>
              </div>
            </div>
          </footer>
        )
      }}
      </Consumer>
    )
  }
}

export default Footer;