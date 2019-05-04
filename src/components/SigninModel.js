import React, { Component } from 'react';
import { Consumer } from '../context/DataContext';
import SigninContent from './SigninContent';
import SignupContent from './SignupContent';
import LanguageZhTW from '../language/zh-TW';
import LanguageEn from '../language/en';
import './SigninModel.scss';

class SigninModel extends Component {
  state = {
    signinBtnActive: true,
    signInErrorMessage: null,
    signUpErrorMessage: null,
  }
  signUpErrorHandle = (message, language) => {
    let errorMessage;
    switch(message) {
      case '請填寫，不能為空值':
        errorMessage = '請填寫，不能為空值'
        break;
      case '信箱已經註冊過':
        errorMessage = '信箱已經註冊過'
        break;
      case '密碼和確認密碼不一致':
        errorMessage = '密碼和確認密碼不一致'
        break;
      case 'The email address is already in use by another account.':
        errorMessage = '此信箱已經註冊過'
        break;
      case 'The email address is badly formatted.':
        errorMessage = '信箱格式錯誤'
        break;
      case 'There is no user record corresponding to this identifier. The user may have been deleted.':
        errorMessage = '沒有此信箱的會員資料，請註冊'
        break;
      case 'The password is invalid or the user does not have a password.':
        errorMessage = '密碼錯誤，或是帳戶無效'
        break;
      default:
        errorMessage = '密碼必須為六位數'
        break;
    }
    this.setState({
      signUpErrorMessage: errorMessage
    })
  }
  render() {
    const { signinBtnActive,signUpErrorMessage } = this.state;
    return (
      <Consumer>
      {({ setState, language }) => {
        let languageStatus;
        language === 'zh-TW' ? languageStatus = LanguageZhTW : languageStatus = LanguageEn;
        return (
          <div className="signIn-wrap">
            <div className="signIn-box">
              <div className="button-wrap">
                <button className={ signinBtnActive ? 'signIn-select select-btn active' : 'signIn-select select-btn' }
                  onClick={ () => {
                    this.setState({ signinBtnActive: true })
                  }}>{languageStatus.model.signInTitle}</button>
                <button className={ signinBtnActive ? 'signUp-select select-btn' : 'signUp-select select-btn active' }
                  onClick={ () => {
                    this.setState({ signinBtnActive: false })
                  }}>{languageStatus.model.signUpTitle}</button>
              </div>
              {signinBtnActive ? <SigninContent signUpErrorHandle={this.signUpErrorHandle} /> : <SignupContent signUpErrorHandle={this.signUpErrorHandle} /> }
              {signUpErrorMessage ? (
                <div className="error-message d-flex h-align-items-center h-justify-content-center">{signUpErrorMessage}</div>
                ) : null}
            </div>
            <div className="cover-bg" onClick={ e => {
              e.preventDefault();
              setState({ showSignInModel: false })
            }}></div>
        </div>
        )
      }}
      </Consumer>
    )
  }
}

export default SigninModel;
