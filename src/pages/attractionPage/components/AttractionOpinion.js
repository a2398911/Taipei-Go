import React from 'react';
import FontAwesome from "react-fontawesome";
import { Consumer } from '../../../context/DataContext';

const AttractionOpinion = ({data,editMessageHandle,currentAttractionId,deleteMessageHandle}) => {
  const { time,star,id,userName,message,userId } = data;
  const starArray = [1,2,3,4,5];
  const messageTime =  (new Date(time)).toLocaleString('zh');
  return (
    <Consumer>
    {({userData,setState}) => (
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
          onClick={(e) => deleteMessageHandle(e,setState,currentAttractionId)}>刪除留言</button>}
        {userData && userData.uid === userId && <button className="eidt" data-id={id} data-currentid={currentAttractionId} 
          onClick={editMessageHandle} >編輯內容</button>}
      </div>
    )}
    </Consumer>
  )
}

export default AttractionOpinion

