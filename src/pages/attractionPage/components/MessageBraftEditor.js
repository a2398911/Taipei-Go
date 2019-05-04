import React, { Fragment } from 'react';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import './MessageBraftEditor.css';
import { Consumer } from '../../../context/DataContext';
import LanguageZhTW from '../../../language/zh-TW';
import LanguageZhEn from '../../../language/en';

const controls =[
  'undo', 'redo', 'separator',
  'font-size', 'line-height', 'letter-spacing', 'separator',
  'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
  'remove-styles', 'emoji',  'separator', 'text-indent', 'text-align', 'separator',
  'list-ul', 'list-ol', 'blockquote', 'separator',
  'link', 'separator', 'hr', 'separator',
  'separator',
  'clear'
]

export default class MessageBraftEditor extends React.Component {
  state = {
    starIons: [5,4,3,2,1]
  }
  render () {
    const { editorState, editorHandleChange, clickStarHandle, star } = this.props;
    const { starIons } = this.state;
    console.log(star,'star')
    return (
      <Consumer>
      {({language}) => {
        let languageStatus;
        language === 'zh-TW' ? languageStatus = LanguageZhTW : languageStatus = LanguageZhEn;
        return (
          <div className="editor-wrap">
            <span className="editor-start-wrap d-flex">
              <p>{`${languageStatus.editor.title} :`}</p>
              <div className="rating">
                {starIons.map((item, index) => (
                  <Fragment key={item}>
                    <input type="radio" id={`star${item}`} name="rating" value={item} onClick={clickStarHandle}/>
                    <label className={ star >= item ? 'full active' : 'full' } htmlFor={`star${item}`}></label>
                  </Fragment>
                ))}
              </div>
            </span>
            <BraftEditor value={editorState} onChange={editorHandleChange} 
              language={language === 'zh-TW' ? 'zh-hant' : 'en'} placeholder={languageStatus.editor.placeholder} controls={controls} />
          </div>
        )
      }}
      </Consumer>
    )
  }

}