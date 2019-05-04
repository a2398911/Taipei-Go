import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import firebase, { fireAuth } from '../config/firebase.js';
import { Consumer } from '../context/DataContext';
import LanguageZhTW from '../language/zh-TW';
import LanguageEn from '../language/en';


class SignupContent extends Component {
  state = {
    nickName: '',
    email: '',
    password: '',
    confirmPassword: '',
    passwordInputError: false,
    confirmPasswordInputError: false,
    nickNameInputError: false,
    emailInputError: false,
    passwordInputError: false,
  }
  nickNameInputHandle = (e) => {
    this.setState({
      nickName: e.target.value
    })
  }
  emailInputHandle = (e) => {
    this.setState({
      email: e.target.value
    })
  }
  passwordInputHandle = (e) => {
    this.setState({
      password: e.target.value
    })
  }
  confirmPasswordInputHandle = (e) => {
    this.setState({
      confirmPassword: e.target.value
    })
  }
  signUpHandle = (setState) => {
    const { email, password, confirmPassword, nickName } = this.state;
    if(password !== confirmPassword) {
      this.props.signUpErrorHandle('密碼和確認密碼不一致');
      this.setState({
        passwordInputError: true,
        confirmPasswordInputError: true,
      })
      return;
    } else {
      this.setState({
        passwordInputError: false,
        confirmPasswordInputError: false,
      })
    }
    if(nickName === '' || email === '' || password === ''|| confirmPassword === '') {
      this.props.signUpErrorHandle('請填寫，不能為空值');
      nickName === '' ? this.setState({ nickNameInputError: true}) : this.setState({ nickNameInputError: false});
      email === '' ? this.setState({ emailInputError: true }) : this.setState({ emailInputError: false });
      password === '' ? this.setState({ passwordInputError: true }) : this.setState({ passwordInputError: false });
      confirmPassword === '' ? this.setState({ confirmPasswordInputError: true }) : this.setState({ confirmPasswordInputError: false });
      return;
    }
    this.signUpFirebase(email, password, nickName, setState);
  }
  signUpFirebase = (email, password, nickName, setState) => {
    fireAuth.createUserWithEmailAndPassword(email,password).then((user) => {
      const uid = user.user.uid;
      const userData = {
        email,
        nickName,
        uid,
        favorite: [0]
      }
      setState({ showRemindModel: 3 })
      firebase.database().ref(`/user/${uid}`).set(userData);
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorMessage === 'The email address is badly formatted.' 
        || errorMessage === 'The email address is already in use by another account.') {
          this.setState({ emailInputError: true })
      }
      if (errorMessage === 'Password should be at least 6 characters') {
        this.setState({ 
          passwordInputError: true,
          confirmPasswordInputError: true, 
        })
      } else {
        this.setState({ 
          passwordInputError: false, 
          confirmPasswordInputError: false, 
        });
      }
      this.props.signUpErrorHandle(errorMessage);
      console.log('errorCode',errorCode,'errorMessage',errorMessage);
    })
  }
  render() {
    const { nickName,email,password,
      confirmPassword,passwordInputError,
      confirmPasswordInputError,nickNameInputError,emailInputError } = this.state;
    return (
      <Consumer>
        {({ setState, language }) => {
          let languageStatus;
          language === 'zh-TW' ? languageStatus = LanguageZhTW : languageStatus = LanguageEn;
          return (
            <div className="signup-content d-flex h-align-items-center">
              <div className="signup-wrap d-flex h-flex-column h-align-items-center">
                <h2 className="signup-title">{languageStatus.model.signUpSubTitle}</h2>
                <div className="signup-input-wrap">
                  <input type="text" className={ nickNameInputError ? 'signIn-input error' : 'signIn-input' } value={nickName} onChange={this.nickNameInputHandle} />
                  {!nickName && (
                    <span className="placeholder d-flex h-align-items-center">
                      <FontAwesome name="user" className="user"/>
                      {languageStatus.model.nickNameInput}
                    </span>
                  )}
                </div>
                <div className="signup-input-wrap">
                  <input type="text" className={ emailInputError ? 'signIn-input error' : 'signIn-input' } value={email} onChange={this.emailInputHandle}/>
                  {!email && (
                    <span className="placeholder d-flex h-align-items-center">
                      <FontAwesome name="envelope" className="envelope"/>
                      {languageStatus.model.emailInput}
                    </span>
                  )}
                </div>
                <div className="signIn-input-wrap">
                  <input type="password" className={passwordInputError ? 'signIn-input error' : 'signIn-input'} 
                    value={password} onChange={this.passwordInputHandle} />
                  {!password && (
                    <span className="placeholder d-flex h-align-items-center">
                      <FontAwesome name="lock" className="lock" />
                      {languageStatus.model.passwordInput}
                    </span>
                  )}
                </div>
                <div className="signIn-input-wrap">
                  <input type="password" className={confirmPasswordInputError ? 'signIn-input error' : 'signIn-input'} 
                    value={confirmPassword} onChange={this.confirmPasswordInputHandle}/>
                  {!confirmPassword && (
                    <span className="placeholder d-flex h-align-items-center">
                      <FontAwesome name="lock" className="lock" />
                      {languageStatus.model.checkPasswordInput}
                    </span>
                  )}
                </div>
                <button className="signUp" onClick={() => this.signUpHandle(setState)}>{languageStatus.model.signUpTitle}</button>
              </div>
            </div>
          )
        }}
      </Consumer>
    )
  }
}

export default SignupContent;
