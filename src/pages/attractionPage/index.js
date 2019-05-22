import React, { Component } from 'react';
import FontAwesome from "react-fontawesome";
import GoogleMap from './components/GoogleMap';
import AttractionOpinion from './components/AttractionOpinion';
import AttractionCard from '../homePage/components/AttractionCard';
import WeatherWrap from './components/WeatherWrap';
import { Consumer } from "../../context/DataContext";
import firebase from "../../config/firebase";
import MessageBraftEditor from './components/MessageBraftEditor';
import BraftEditor from 'braft-editor';
import './index.scss';
import LanguageZhTW from '../../language/zh-TW';
import LanguageEn from '../../language/en';
import AttractionDetailsInfo from '../../pages/attractionPage/components/AttractionDetailsInfo';
import ErrorMessage from '../../components/ErrorMessage';

const api = 'https://data.taipei/opendata/datalist/apiAccess?scope=resourceAquire&rid=e6831708-02b4-4ef8-98fa-4b4ce53459d9&q=%E8%87%BA%E5%8C%97%E5%B8%82';

class AttractionPage extends Component {
  state = {
    nearbyAllData: null,
    weather: null,
    currentTemperature: null,
    showMessageTextarea: false,
    editorState: BraftEditor.createEditorState(null),
    messageData: null,
    star: 0,
    totalStarScore: 0,
    editId: null,
  }
  componentDidMount() {
    this.getNearbyDataFromFirebase();
    this.getWeatherData(api);
  }
  componentDidUpdate() {
    this.getMessageData();
  }
  getNearbyDataFromFirebase = () => {
    let dataRef = firebase.database().ref('FilterNearbyAttractions');
    dataRef.once('value',(snapshot) => {
      this.setState({
        nearbyAllData: snapshot.val()
      })
    })
  }
  getWeatherData = (url) => {
    fetch(url).then(rs => {
      if (rs.status >= 200 && rs.status < 300) {
        return rs.json();
      } else {
        var error = new Error(rs.statusText)
        error.rs = rs
        throw error
      }
    }).then(data => {
      const result = data.result.results;
      let week = [];
      result.length > 0 && result.forEach(item => {
        let objectDay = {};
        objectDay.temperature = `${item.parameterName3}~${item.parameterName2}`;
        objectDay.situation = item.parameterName1;
        objectDay.id = item._id;
        const startTime = new Date(item.startTime).getHours();
        const month = new Date(item.startTime).getMonth();
        const date = new Date(item.startTime).getDate();
        const day =  new Date(item.startTime).getDay();
        let newDay;
        switch (day) {
          case 1:
            newDay = '星期一'
            break;
          case 2:
            newDay = '星期二'
            break;
          case 3:
            newDay = '星期三'
            break;
          case 4:
            newDay = '星期四'
            break;
          case 5:
            newDay = '星期五'
            break;
          case 6:
            newDay = '星期六'
            break;
          default:
            newDay = '星期日'
            break;
        }
        let timeSlot;
        if (startTime === 18) {
          timeSlot = 'nightDay';
        } else if (startTime === 6) {
          timeSlot = 'morningDay';
        } else {
          timeSlot = 'midnightDay';
        }
        objectDay[timeSlot] = `${ month+1 < 10 ? '0'+(month+1) : month+1 }/${date < 10 ? '0'+date : date}${newDay}`;
        week.push(objectDay);
      })
      const filterWeek = week.filter((item,index) => item.morningDay || item.id === 1 & !item.midnightDay);
      const newWeek = filterWeek.filter((item,index) => index < 7);
      this.setState({
        weather: newWeek,
      })
    })
  }
  getCurrenIdNearbyId = (id) => {
    let data = [];
    let filterData = this.state.nearbyAllData.filter((item, index) => {
      return index === id
    })
    for(let key in filterData[0]) {
      data.push(filterData[0][key])
    }
    return data;
  }
  getNearbyData = (allData,id) => {
    return allData.filter(item => {
      return item._id === id
    })
  }
  showMessageTextarea = () => {
    this.editorHandleChange(BraftEditor.createEditorState(null));
    this.setState({
      showMessageTextarea: !this.state.showMessageTextarea,
      editId: null,
      star: 0
    })
  }
  editorHandleChange = (editorState) => {
    this.setState({ editorState })
  }
  clickStarHandle = (e) => {
    this.setState({ star: e.target.value })
  }
  sendMessageHandle = (e,_id,name,userId,star,setState) => {
    if(this.state.editorState.toHTML() === '<p></p>') { return };
    const currentAttractionId = e.target.dataset.currentid;
    const { editId } = this.state;
    const MessageData = {
      message: this.state.editorState.toHTML(),
      userName: name,
      userId: userId,
      star: star,
      time: +new Date()
    }
    setState({ showRemindModel: 4 });
    this.showMessageTextarea();
    document.querySelector('.attraction-opinion-wrap').scrollIntoView({
      block: 'start',
      behavior: 'smooth'
    });

    if (editId) {
      let MessageRef = `/TouristMessage/${currentAttractionId}/${editId}`;
      firebase.database().ref(MessageRef).set(MessageData).then(() => {
        this.editFirebaseDateHandle(_id);
      });
    } else {
      let MessageRef = `/TouristMessage/${_id}`;
      firebase.database().ref(MessageRef).push(MessageData).then(() => {
        this.editFirebaseDateHandle(_id);
      });
    }
  }
  editFirebaseDateHandle = (_id) => {
    this.setState({ editId: null }); 
    firebase.database().ref(`taipeiData/${_id}/star_rating`).set(this.state.totalStarScore);
    firebase.database().ref(`taipeiData/${_id}/message_num`).set(this.state.messageData.length);
    firebase.database().ref(`taipeiData_EN/${_id}/star_rating`).once('value', (snapshot) => {
      if(snapshot.val()) {
        firebase.database().ref(`taipeiData_EN/${_id}/star_rating`).set(this.state.totalStarScore);
        firebase.database().ref(`taipeiData_EN/${_id}/message_num`).set(this.state.messageData.length);
      }
    })
  }
  editMessageHandle = e => {
    const id = e.target.dataset.id;
    const currentAttractionId = e.target.dataset.currentid;
    firebase.database().ref(`/TouristMessage/${currentAttractionId}/${id}`).once('value', (snapshot) => {
      const message = snapshot.val().message;
      const star = snapshot.val().star;
      this.editorHandleChange(BraftEditor.createEditorState(`${message}`));
      this.setState({ editId: id, showMessageTextarea: true, star })
    })
  }
  deleteMessageHandle = (e,setState,_id) => {
    const id = e.target.dataset.id;
    const currentAttractionId = e.target.dataset.currentid;
    setState({ showRemindModel: 7 });
    firebase.database().ref(`/TouristMessage/${currentAttractionId}/${id}`).remove().then(() => {
      firebase.database().ref(`taipeiData/${_id}/star_rating`).set(this.state.totalStarScore);
      firebase.database().ref(`taipeiData/${_id}/message_num`).set(this.state.messageData.length);
      firebase.database().ref(`taipeiData_EN/${_id}/star_rating`).once('value', (snapshot) => {
        if(snapshot.val()) {
          firebase.database().ref(`taipeiData_EN/${_id}/star_rating`).set(this.state.totalStarScore);
          firebase.database().ref(`taipeiData_EN/${_id}/message_num`).set(this.state.messageData.length);
        } 
      })
    });
  }
  getMessageData = () => {
    const id = this.props.id;
    const dataRef = firebase.database().ref(`/TouristMessage/${id}`);
    dataRef.on('value', (snapshot) => {
      const data = snapshot.val();
      let messageData = [];
      for(let key in data) {
        data[key].id = key;
        messageData.push(data[key]);
      }
      messageData.reverse();
      const starList = messageData.map(item => Object.values(item)[1]);
      let totalStarScore;
      if (starList.length) {
        totalStarScore = Math.round(starList.reduce((prev,item) => +prev + +item, 0) / starList.length);
      } else {
        totalStarScore = 0;
      }
      this.state.messageData !== messageData && this.state.totalStarScore !== totalStarScore && this.setState({ messageData,totalStarScore });
    })
  }
  render() {
    if (this.props.data.length === 0) { return <ErrorMessage /> }
    const { stitle, stitle_en, _id} = this.props.data[0];
    const { nearbyAllData, weather, currentTemperature, showMessageTextarea, editorState, messageData, star, totalStarScore } = this.state;
    const starIcons = [1,2,3,4,5];
    let currenIdNearbyData;
    nearbyAllData && (currenIdNearbyData =  this.getCurrenIdNearbyId(_id));
    return (
      <Consumer>
      {({uid,userData,language,setState,results}) => {
        let languageStatus;
        language === 'zh-TW' ? languageStatus = LanguageZhTW : languageStatus = LanguageEn;
        return (
          <section>
            <div className="container">
              <div className="attraction-wrap">
                <div className="row">
                  <div className="col-12">
                    <div className="attraction-title d-flex h-align-items-center">
                      <div className="title-wrap">
                        <FontAwesome name="map" className="map"/>
                        {language === 'zh-TW' ? stitle : stitle_en}
                      </div>
                      <span className="attraction-star d-flex h-align-items-center">
                        <span className="start-wrap">
                          {starIcons.map(item => <FontAwesome name={item <= totalStarScore ? 'star active' : 'star'} className="star" key={item} />)}
                        </span>
                        <span className="starNum">({messageData ? messageData.length : 0})</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <AttractionDetailsInfo data={this.props.data[0]} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="google-map">
                      <div className="google-map-tilte">{languageStatus.attractionPage.mapTitle}</div>
                      <GoogleMap data={this.props.data[0]} language={language} />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <WeatherWrap data={weather} currentTemperature={currentTemperature}/>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="attraction-opinion-wrap">
                      <div className="attraction-opinion-title">
                        {languageStatus.attractionPage.messageTitle}
                        <span className="attraction-message-num">({messageData ? messageData.length : 0})</span>
                      </div>
                      {messageData && messageData.map(item => {
                        return <AttractionOpinion data={item} key={item.id} editMessageHandle={this.editMessageHandle} 
                          currentAttractionId={_id} deleteMessageHandle={this.deleteMessageHandle}/>
                      })}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    {showMessageTextarea && <MessageBraftEditor editorState={editorState} 
                      editorHandleChange={this.editorHandleChange}
                      clickStarHandle={this.clickStarHandle}
                      star={star} />}
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 d-flex h-justify-content-center">
                    {uid && (
                      <button className="messageBtn" onClick={this.showMessageTextarea}>
                        <FontAwesome name="comments" className="comments"/>
                        {showMessageTextarea ? languageStatus.attractionPage.cancelMessage : languageStatus.attractionPage.leaveComments}
                      </button>
                      )}
                    {showMessageTextarea ? (
                      <button className="senMessageBtn" data-id={uid} data-currentid={_id} onClick={ (e) => this.sendMessageHandle(e,_id,userData.nickName,uid,star,setState) } >
                        <FontAwesome name="paper-plane" className="paper-plane"/>
                        {languageStatus.attractionPage.sendMessage}
                      </button>
                    ) : null }
                  </div>
                </div>
                {currenIdNearbyData && currenIdNearbyData.length ? (
                  <div className="row">
                    <div className="col-12">
                      <h1 className="nearby-title">
                        <FontAwesome name="street-view" className="street-view"/>
                        {languageStatus.attractionPage.nearbyAttractions}
                      </h1>
                    </div>
                  </div>
                ) : null }
                <div className="row">
                  {currenIdNearbyData && currenIdNearbyData.map(item => <AttractionCard  key={item.id} data={(this.getNearbyData(results, item.id))[0]} strTmp={item.strTmp} />)}
                </div>
              </div>
            </div>
          </section>
        );
      }}
      </Consumer>
    )
  }
}

export default AttractionPage;