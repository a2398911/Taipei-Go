import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import FontAwesome from "react-fontawesome";
import './ErrorMessage.scss';

class ErrorMessage extends Component {
  render() {
    return (
      <>
        <div className="errorMessage-wrp">
          <div className="errorMessage d-flex h-align-items-center h-flex-column h-justify-content-center">
            <FontAwesome name="exclamation-triangle" className="errorMessage-exclamation-triangle" />
            <h3 className="errorMessage-title">Oops，此頁面並不存在</h3>
            <p className="errorMessage-text">點擊確認回到首頁</p>
            <Link to="/" className="backHomePage-btn">確認</Link>
          </div>
        </div>
        <div className="errorMessage-bg"></div>
      </>
    )
  }
}

export default ErrorMessage;
