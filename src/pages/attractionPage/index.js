import React, { Component } from 'react';
import FontAwesome from "react-fontawesome";
import TaipeiMRT from '../../taipei-MRT.json';
import TaipeiMRT_EN from '../../taipei-MRT_EN';
import GoogleMap from './components/GoogleMap';
import AttractionOpinion from './components/AttractionOpinion';
import AttractionCard from '../homePage/components/AttractionCard';
import WeatherWrap from './components/WeatherWrap';
import { Consumer } from "../../context/DataContext";
import firebase from "../../config/firebase";
import MessageBraftEditor from './components/MessageBraftEditor';
import activeHeartIcon from '../../img/heart-hover-icon.svg';
import BraftEditor from 'braft-editor';
import './index.scss';
import LanguageZhTW from '../../language/zh-TW';
import LanguageEn from '../../language/en';

// const api = 'https://data.taipei/opendata/datalist/apiAccess?scope=resourceAquire&rid=e6831708-02b4-4ef8-98fa-4b4ce53459d9&q=%E8%87%BA%E5%8C%97%E5%B8%82';
const api = 'https://weather.yfxie.com/api?region=taipei_city&_=1555515701988';

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
      console.log(data);
      const { currentTemperature, week } = data;
      this.setState({
        weather: week,
        currentTemperature
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
  filterMRTLine = (MRTName, language) => {
    let TaipeiMRTData;
    language === 'zh-TW' ? TaipeiMRTData = TaipeiMRT : TaipeiMRTData = TaipeiMRT_EN;
    return TaipeiMRTData.filter(item => {
      return item.name === MRTName
    })
  }
  switchMRTLine = (MRTLine, language) => {
    let currentMRTLineColor;
    if (language === 'zh-TW') {
      switch (MRTLine) {
        case '文山內湖線' :
          currentMRTLineColor = 'MRT-brown'
          break;
        case '淡水、信義線' :
          currentMRTLineColor = 'MRT-red'
          break;
        case '小南門、新店線' :
          currentMRTLineColor = 'MRT-green'
          break;
        case '中和、蘆洲、新莊線' :
          currentMRTLineColor = 'MRT-yellow'
          break;
        default:
          currentMRTLineColor = 'MRT-blue'
          break;
      }
    } else {
      switch (MRTLine) {
        case 'Wenhu Line':
          currentMRTLineColor = 'MRT-brown'
          break;
        case 'Tamsui-Xinyi Line':
          currentMRTLineColor = 'MRT-red'
          break;
        case 'Songshan-Xindian Line':
          currentMRTLineColor = 'MRT-green'
          break;
        case 'Zhonghe-Xinlu Line':
          currentMRTLineColor = 'MRT-yellow'
          break;
        default:
          currentMRTLineColor = 'MRT-blue'
          break;
      }
    }
    return currentMRTLineColor;
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
      firebase.database().ref(`/TouristMessage/${currentAttractionId}/${editId}`).set(MessageData).then(() => {
        this.setState({ editId: null }); 
        firebase.database().ref(`taipeiData/${_id}/star_rating`).set(this.state.totalStarScore);
        firebase.database().ref(`taipeiData/${_id}/message_num`).set(this.state.messageData.length);
        firebase.database().ref(`taipeiData_EN/${_id}/star_rating`).once('value', (snapshot) => {
          if(snapshot.val()) {
            firebase.database().ref(`taipeiData_EN/${_id}/star_rating`).set(this.state.totalStarScore);
            firebase.database().ref(`taipeiData_EN/${_id}/message_num`).set(this.state.messageData.length);
          }
        })
      });
    } else {
      firebase.database().ref(`/TouristMessage/${_id}`).push(MessageData).then(() => {
        firebase.database().ref(`taipeiData/${_id}/star_rating`).set(this.state.totalStarScore);
        firebase.database().ref(`taipeiData/${_id}/message_num`).set(this.state.messageData.length);
        firebase.database().ref(`taipeiData_EN/${_id}/star_rating`).once('value', (snapshot) => {
          if(snapshot.val()) {
            firebase.database().ref(`taipeiData_EN/${_id}/star_rating`).set(this.state.totalStarScore);
            firebase.database().ref(`taipeiData_EN/${_id}/message_num`).set(this.state.messageData.length);
          } 
        })
      })
    }
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
    console.log(id, currentAttractionId);
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
      this.setState({ messageData,totalStarScore });
    })
  }
  TextBreakLineHandle = (text, smallBreak = false) => {
    const textArray = text.split(/[\r\n]/);
    const textArrayFilter = textArray.filter(item => item.length && item !== '&nbsp;');
    return smallBreak ? textArrayFilter.join('<br />') : textArrayFilter.join('<br /><br />');
  }
  monthsWordHandle = (months) => {
    return months.split(',').sort();
  }
  render() {
    if(!this.props.data) { return null };
    console.log(this.props.data,'currentData');
    const { stitle, stitle_en, xbody, CAT2, images, address, MRT, opening_hours, latitude, longitude, _id, open_time, official_site, remind, ticket, target, months, tel, service } = this.props.data[0];
    const { nearbyAllData, weather, currentTemperature, showMessageTextarea, editorState, messageData, star, totalStarScore } = this.state;
    const starIcons = [1,2,3,4,5];
    let MRTLine;
    let MRTColor;
    let currenIdNearbyData;
    let photo;
    images && (photo = images[0].src);
    nearbyAllData && (currenIdNearbyData =  this.getCurrenIdNearbyId(_id));
    let newXbody =  this.TextBreakLineHandle(xbody);
    let newOpenTime = this.TextBreakLineHandle(open_time,true);
    let newRemind = this.TextBreakLineHandle(remind,true);
    let newTicket = this.TextBreakLineHandle(ticket,true);
    let backgroundImageActive = { backgroundImage: `url(${activeHeartIcon})`};
    let backgroundImage = {
      backgroundImage: `url(${photo})`,
    };
    return (
      <Consumer>
      {({uid,userData,clickHeartIconHandle,filterFavorite,language,setState,results}) => {
        MRT && (this.filterMRTLine(MRT,language))[0] && (MRTLine = (this.filterMRTLine(MRT,language))[0].line) && (MRTColor = this.switchMRTLine(MRTLine,language));
        let languageStatus;
        let detailsTitleClass;
        language === 'zh-TW' ? languageStatus = LanguageZhTW : languageStatus = LanguageEn;
        language === 'zh-TW' ? detailsTitleClass = 'details-title' : detailsTitleClass = 'details-title en';
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
                        <span className="starNum">({messageData && messageData.length})</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="attraction-info-wrap">
                      <div className="attraction-img" style={ backgroundImage }>
                        <button className="attractionCard-heart" data-id={_id} onClick={(e) => clickHeartIconHandle(e,uid,userData)}>
                          <div className="heart" data-id={_id} style={ filterFavorite(userData,_id) ? backgroundImageActive : null }></div>  
                        </button>
                      </div>
                      <div className={language === 'zh-TW' ? 'attraction-info' : 'attraction-info en'} dangerouslySetInnerHTML={{ __html: newXbody}}></div>
                      <div className="attraction-detailsInfo-wrap">
                        <div className="attraction-details-title title">{languageStatus.attractionPage.infoTitle}</div>
                        <ul className="attraction-details-item d-flex">
                          <li className={detailsTitleClass}>{languageStatus.attractionPage.tag}</li>
                          <li className="dtails-content-text"><FontAwesome name="tag" className="tag"/>{CAT2.replace(/\s*/g,"")}</li>
                        </ul>
                        {target ? (
                          <ul className="attraction-details-item d-flex">
                            <li className={detailsTitleClass}>{languageStatus.attractionPage.category}</li>
                            {target.map(item => (
                              <li className="dtails-content-text target" key={item.id}><FontAwesome name="map-pin" className="map-pin"/>{item.name}</li>
                            ))}
                          </ul>
                        ) : null}
                        {address ? (
                          <ul className="attraction-details-item d-flex">
                            <li className={detailsTitleClass}>{languageStatus.attractionPage.address}</li>
                            <li className="dtails-content-text"><FontAwesome name="map-marker" className="map-marker"/>{address}</li>
                          </ul>
                        ) : null}
                        {months ? (
                          <ul className="attraction-details-item d-flex h-align-items-center">
                            <li className={detailsTitleClass}>{languageStatus.attractionPage.month}</li>
                            <li className="dtails-content-text d-flex h-flex-wrap">{this.monthsWordHandle(months).map((item, index) => <span className="dtails-months d-flex h-justify-content-center" key={index}>{item}</span>)}</li>
                          </ul>
                        ) : null}
                        <ul className="attraction-details-item d-flex">
                          <li className={detailsTitleClass}>{languageStatus.attractionPage.openTime}</li>
                          <li className="dtails-content-text">{ opening_hours ? (opening_hours.map((item,index) => {
                            return <span className="d-block opentTime-list" key={index}>{item}</span>
                          })): languageStatus.card.openAllDay}</li>
                        </ul>
                        {newOpenTime ? (
                          <ul className="attraction-details-item d-flex">
                            <li className={detailsTitleClass}>{languageStatus.attractionPage.openRemind}</li>
                            <li className="dtails-content-text" dangerouslySetInnerHTML={{ __html: newOpenTime}} ></li>
                          </ul>
                        ) : null}
                        {newRemind ? (
                          <ul className="attraction-details-item d-flex">
                            <li className={detailsTitleClass}>{languageStatus.attractionPage.Remind}</li>
                            <li className="dtails-content-text" dangerouslySetInnerHTML={{ __html: newRemind}}></li>
                          </ul>
                        ) : null}
                        {ticket ? (
                          <ul className="attraction-details-item d-flex">
                            <li className={detailsTitleClass}>{languageStatus.attractionPage.ticket}</li>
                            <li className="dtails-content-text" dangerouslySetInnerHTML={{ __html: newTicket}}></li>
                          </ul>
                        ) : null}
                        {service ? (
                          <ul className="attraction-details-item d-flex">
                            <li className={detailsTitleClass}>{languageStatus.attractionPage.service}</li>
                            <li className="dtails-content-text">{service.map(item => <span className="details-service" key={item.id}><FontAwesome name="check-square" className="check-square" />{item.name}</span> )}</li>
                          </ul>
                        ) : null}
                        {official_site ? (
                          <ul className="attraction-details-item d-flex">
                            <li className={detailsTitleClass}>{languageStatus.attractionPage.web}</li>
                            <a href={official_site} target="_blank" className="details-official-site" rel="noopener noreferrer">{language === 'zh-TW' ? stitle : stitle_en}</a>
                          </ul>
                        ) : null}
                        {tel ? (
                          <ul className="attraction-details-item d-flex h-align-items-center">
                            <li className={detailsTitleClass}>{languageStatus.attractionPage.tel}</li>
                            <a href={`tel:${tel}`} className="details-official-site" rel="noopener noreferrer">
                              <FontAwesome name="phone" className="phone"/>{tel}
                            </a>
                          </ul>
                        ) : null}
                        {MRTLine ? (
                          <ul className="attraction-details-item d-flex h-align-items-center">
                            <li className={detailsTitleClass}>{languageStatus.attractionPage.mrt}</li>
                            <li className="dtails-content-text mobile-MRT"><span className={`MRT-line ${MRTColor}`}>{MRTLine}</span><span>{MRT}</span></li>
                          </ul>
                          ) : null}
                        <ul className="attraction-details-item d-flex h-align-items-center">
                          <li className={detailsTitleClass}>{languageStatus.attractionPage.traffic}</li>
                          <li className="dtails-content-text"><a href={`https://www.google.com/maps?daddr=${latitude},${longitude}&hl=${language}`}
                            target="_blank" rel="noopener noreferrer" className="googleMap-link">{languageStatus.attractionPage.trafficContentText}</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="google-map">
                      <div className="google-map-tilte">{languageStatus.attractionPage.mapTitle}</div>
                      <GoogleMap data={this.props.data[0]} language={language} />
                      {/* <iframe style={{ width:"600",height:"450",frameborder:"0" }} src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJ604BuRapQjQR6JNutnPhit0&key=AIzaSyBBMko9344y32hbPtFedASD3zGcWrx_gus&language" allowfullscreen></iframe> */}
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
                        console.log(item)
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
                <div className="row">
                  <div className="col-12">
                    <h1 className="nearby-title">
                      <FontAwesome name="street-view" className="street-view"/>
                      {languageStatus.attractionPage.nearbyAttractions}
                    </h1>
                  </div>
                </div>
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