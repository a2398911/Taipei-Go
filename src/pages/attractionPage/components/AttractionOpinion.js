import React from 'react';
import FontAwesome from "react-fontawesome";
import { Consumer } from '../../../context/DataContext';
import LanguageZhTW from '../../../language/zh-TW';
import LanguageEN from '../../../language/en';

const AttractionOpinion = ({data,editMessageHandle,currentAttractionId,deleteMessageHandle}) => {
  const { time,star,id,userName,message,userId } = data;
  const starArray = [1,2,3,4,5];
  const messageTime =  (new Date(time)).toLocaleString('zh');
  return (
    <Consumer>
    {({userData,setState,language}) => {
      let languageStatus;
      let addClass;
      language === 'zh-TW' ? languageStatus = LanguageZhTW : languageStatus = LanguageEN;
      language === 'zh-TW' ? addClass = '' : addClass = ' en';
      return (
        <div className="attraction-opinion-item" data-userid={userId}>
          <div className="attraction-opinion-infos d-flex">
            <span className="attraction-opinion-name">{userName}</span>
            <span className="attraction-opinion-stars">
              {starArray.map(item => (
                <FontAwesome name="star" className={item <= star ? 'star active' : 'star'} key={item}/>
              ))}
            </span>
            <span className="attraction-option-date">{messageTime}</span>
          </div>
          <div className="attraction-opinion-message" dangerouslySetInnerHTML={{ __html: message}}></div>
          {userData && userData.uid === userId && <button className="delet" data-id={id} data-currentid={currentAttractionId}
            onClick={(e) => deleteMessageHandle(e,setState,currentAttractionId)}>{languageStatus.editor.deleteMessage}</button>}
          {userData && userData.uid === userId && <button className={`edit${addClass}`} data-id={id} data-currentid={currentAttractionId} 
            onClick={editMessageHandle} >{languageStatus.editor.editMessage}</button>}
        </div>
      )
    }}
    </Consumer>
  )
}

export default AttractionOpinion

