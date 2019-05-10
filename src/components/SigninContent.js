import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import firebase, { fireAuth } from '../config/firebase.js';
import { Consumer } from '../context/DataContext';
import LanguageZhTW from '../language/zh-TW';
import LanguageEn from '../language/en';

class SigninContent extends Component {
  state = {
    email: '',
    password: '',
    emailInputError: false,
    passwordInputError: false,
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
  signInHandle = (e) => {
    console.log(e.target.className)
    if(e.target.className !== 'signIn' && e.keyCode !== 13) return;
    const { email,password } = this.state;
    if(email === '' || password === '') {
      this.props.signUpErrorHandle('請填寫，不能為空值');
      email === '' ? this.setState({ emailInputError: true }) : this.setState({ emailInputError: false });
      password === '' ? this.setState({ passwordInputError: true }) : this.setState({ passwordInputError: false });
      return;
    }
    fireAuth.signInWithEmailAndPassword(email, password).then((user) => {
      console.log(user,'登入');
    }).catch((error) => {
      const { code:errorCode, message:errorMessage } = error;
      this.props.signUpErrorHandle(errorMessage);
      errorMessage === 'The email address is badly formatted.' && this.setState({ emailInputError: true });
      errorMessage === 'The password is invalid or the user does not have a password.' && this.setState({ passwordInputError: true });
      errorMessage === 'There is no user record corresponding to this identifier. The user may have been deleted.' && this.setState({ emailInputError: true, passwordInputError: true })
      console.log('errorCode',errorCode,'errorMessage',errorMessage);
    })
  }
  googleSignInHandle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    fireAuth.signInWithPopup(provider).then((result) => {
      const { displayName:nickName,email,uid } = result.user;
      const userRef = firebase.database().ref(`/user/${uid}`);
      const userData = {
        email,
        nickName,
        uid,
        favorite: [0]
      }
      userRef.once('value', (snapshot) => {
        const user = snapshot.val();
        !user && userRef.set(userData);
      });
    }).catch((error) => {
      const { code:errorCode, message:errorMessage } = error;
      console.log('errorCode',errorCode,'errorMessage',errorMessage);
    });  
  }
  render() {
    const {email,password,emailInputError,passwordInputError} = this.state;
    return (
      <Consumer>
      {({language}) => {
        let languageStatus;
        language === 'zh-TW' ? languageStatus = LanguageZhTW : languageStatus = LanguageEn;
        return (
          <div className="signIn-content d-flex h-flex-column">
            <div className="signIn-email-wrap d-flex h-flex-column h-align-items-center h-justify-content-center">
              <h2 className="signIn-title">{languageStatus.model.signInSubTitle}</h2>
              <form action="" className="form d-flex h-flex-column h-align-items-center" onSubmit={this.signInHandle}>
                <div className="signIn-input-wrap">
                  <input type="text" className={ emailInputError ? 'signIn-input error' : 'signIn-input' } value={email} onChange={this.emailInputHandle}/>
                  {!email && (
                    <span className="placeholder d-flex h-align-items-center">
                      <FontAwesome name="envelope" className="envelope"/>
                      {languageStatus.model.emailInput}
                    </span>
                  )}
                </div>
                <div className="signIn-input-wrap">
                  <input type="password" className={ passwordInputError ? 'signIn-input error' : 'signIn-input' } value={password} onChange={this.passwordInputHandle}/>
                  {!password && (
                    <span className="placeholder d-flex h-align-items-center">
                      <FontAwesome name="lock" className="lock" />
                      {languageStatus.model.passwordInput}
                    </span>
                  )}
                </div>
                <button className="signIn" onClick={this.signInHandle}>{languageStatus.model.signInTitle}</button>
              </form>
            </div>
            <div className="signIn-google-wrap d-flex h-flex-column h-align-items-center h-justify-content-center">
              <h2 className="signIn-title">{languageStatus.model.googleSignIn}</h2>
              <button className="siginIn-google" onClick={this.googleSignInHandle}>
                <FontAwesome name="google" className="google"/>
                {languageStatus.model.googleSignInBtn}
              </button>
            </div>
          </div>
        )
      }}
      </Consumer>
    )
  }
}

export default SigninContent
