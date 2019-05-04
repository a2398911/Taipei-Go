import React, { Component } from 'react';
import './RemindMessage.scss';
import { Consumer } from '../context/DataContext';
import FontAwesome from 'react-fontawesome';
import LanguageZhTW from '../language/zh-TW';
import LanguageZhEn from '../language/en';

class RemindMessage extends Component {
  changeTitleHandle = (modelStatus,language) => {
    let text;
    if (language === 'zh-TW') {
      switch (modelStatus) {
        case 1:
          text = '登入成功，歡迎您'
          break;
        case 2:
          text = '已成功登出'
          break;
        case 3:
          text = '註冊成功，歡迎加入'
          break;
        case 4:
          text = '已成功送出評價'
          break;
        case 5:
          text = '已成功加入最愛'
          break;
        case 6:
          text = '已成功移除最愛'
          break;
        default:
          text = '已成功刪除留言'
          break;
        }
    } else {
      switch (modelStatus) {
        case 1:
          text = 'Login is successful, welcome'
          break;
        case 2:
          text = 'Successfully logged out'
          break;
        case 3:
          text = 'Registration is successful, welcome to join'
          break;
        case 4:
          text = 'Successfully sent a rating'
          break;
        case 5:
          text = 'successfully joined the favorite'
          break;
        case 6:
          text = 'Successfully removed favorite'
          break;
        default:
          text = 'Message deleted successfully'
          break;
        }
    }
    return text;
  }
  modelStatusHandle = (showErrorReminModel,setState) => {
    showErrorReminModel 
    ? setState({ showErrorReminModel:false, showSignInModel: 1 }) 
    :setState({ showRemindModel:false })
  }
  render() {
    return (
      <Consumer>
      {({ setState,showRemindModel,userName,showErrorReminModel,language}) => {
        let languageStatus;
        language === 'zh-TW' ? languageStatus = LanguageZhTW : languageStatus = LanguageZhEn;
        return (
          <div className="remind-wrap" onClick={() => setState({ showErrorReminModel: false })}>
            <div className="remind-box d-flex h-align-items-center h-flex-column h-justify-content-center">
              <div className="content-wrap d-flex h-flex-column">
                {showErrorReminModel ? <FontAwesome name="exclamation-circle" className="exclamation-circle"/> : <div className="checkmark"></div>}
                <h1 className="remind-title">{showErrorReminModel ? languageStatus.remindModel.signInRemind : this.changeTitleHandle(showRemindModel,language)}</h1> 
                <button className="remind-btn" onClick={ () => this.modelStatusHandle(showErrorReminModel,setState) }>{languageStatus.remindModel.btn}</button>
              </div>
            </div>
          </div>
        )
      }}
      </Consumer>
    )
  }
}

export default RemindMessage;
