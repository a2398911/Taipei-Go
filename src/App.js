import React, { Component } from "react";
import HomePage from "./pages/homePage";
import AttractionPage from "./pages/attractionPage";
import AttractionPageLoad from './pages/attractionPage/components/AttractionPageLoad';
import Header from "./components/Header";
import Footer from "./components/Footer";
import SigninModel from './components/SigninModel';
import CollectionPage from './pages/collectionPage';
import { Provider } from "./context/DataContext";
import { HashRouter, Route, Switch  } from 'react-router-dom';
import firebase, { fireAuth } from './config/firebase.js';
import TaipeiMRT from "./taipei-MRT";
import TaipeiMRT_EN from './taipei-MRT_EN';
import touristOpenTime from "./tourist.json";
import touristOpenTime_en from './tourist_en.json';
import ScrollToTop from "./components/ScrollToTop";
import RemindModel from './components/RemindMessage';

class App extends Component {
  state = {
    results: null,
    resultsSortmode: 'star',
    currentResult: null,
    count: null,
    pageNum: [],
    currentPage: 1,
    groupCount: 5,
    startPage: 1,
    pageAllGroup: null,
    TaipeiMRT,
    searchInput: "",
    searchMRT: null,
    searchDay: null,
    currentDay: null,
    tagTheme: [
      { name: "養生溫泉", active: false, id: 0 },
      { name: "單車遊蹤", active: false, id: 1 },
      { name: "歷史建築", active: false, id: 2 },
      { name: "宗教信仰", active: false, id: 3 },
      { name: "藝文館所", active: false, id: 4 },
      { name: "公共藝術", active: false, id: 5 },
      { name: "藍色公路", active: false, id: 6 },
      { name: "親子共遊", active: false, id: 7 },
      { name: "戶外踏青", active: false, id: 8 },
    ],
    areaTheme: [
      { name: "北投區", active: false, id: 0 },
      { name: "士林區", active: false, id: 1 },
      { name: "內湖區", active: false, id: 2 },
      { name: "松山區", active: false, id: 3 },
      { name: "中山區", active: false, id: 4 },
      { name: "大同區", active: false, id: 5 },
      { name: "南港區", active: false, id: 6 },
      { name: "信義區", active: false, id: 7 },
      { name: "大安區", active: false, id: 8 },
      { name: "中正區", active: false, id: 9 },
      { name: "萬華區", active: false, id: 10 },
      { name: "文山區", active: false, id: 11 }
    ],
    currentTagThemes: [],
    currentAreaThemes: [],
    searchData: null,
    showSearchAdvancedMobile: false,
    showSignInModel: false,
    showRemindModel: false,
    showErrorReminModel: false,
    uid: null,
    userData: null,
    language: 'zh-TW',
    hasError: false,
  };
  componentDidMount() {
    this.checkSigninStatus();
    this.getCookieByName('language');
  }
  getCookieByName = (name) => {
    let cookie;
    const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
    if((cookie=document.cookie.match(reg))){
      this.setState({ language:cookie[2]},() => {
        this.getTaipeiDate(this.state.language);
        this.changeLanguageMRT(this.state.language);
        this.changeLanguageAdvance(this.state.language);
      });
    } else {
      this.getTaipeiDate(this.state.language);
    }
  }
  changeLanguageMRT = (language) => {
    language === 'zh-TW' ? this.setState({ TaipeiMRT }) : this.setState({ TaipeiMRT:TaipeiMRT_EN  });
  }
  changeLanguageAdvance = (language) => {
    if (language === 'zh-TW') {
      this.setState({
        tagTheme: [
          { name: "養生溫泉", active: false, id: 0 },
          { name: "單車遊蹤", active: false, id: 1 },
          { name: "歷史建築", active: false, id: 2 },
          { name: "宗教信仰", active: false, id: 3 },
          { name: "藝文館所", active: false, id: 4 },
          { name: "公共藝術", active: false, id: 5 },
          { name: "藍色公路", active: false, id: 6 },
          { name: "親子共遊", active: false, id: 7 },
          { name: "戶外踏青", active: false, id: 8 },
        ],
        areaTheme: [
          { name: "北投區", active: false, id: 0 },
          { name: "士林區", active: false, id: 1 },
          { name: "內湖區", active: false, id: 2 },
          { name: "松山區", active: false, id: 3 },
          { name: "中山區", active: false, id: 4 },
          { name: "大同區", active: false, id: 5 },
          { name: "南港區", active: false, id: 6 },
          { name: "信義區", active: false, id: 7 },
          { name: "大安區", active: false, id: 8 },
          { name: "中正區", active: false, id: 9 },
          { name: "萬華區", active: false, id: 10 },
          { name: "文山區", active: false, id: 11 }
        ]
      })
    } else {
      this.setState({
        tagTheme: [
          { name: "SPA", active: false, id: 0 },
          { name: "Cycling", active: false, id: 1 },
          { name: "Historic Buildings", active: false, id: 2 },
          { name: "Faith", active: false, id: 3 },
          { name: "Art Gallery", active: false, id: 4 },
          { name: "Public Art", active: false, id: 5 },
          { name: "Bule Highway", active: false, id: 6 },
          { name: "Family Activities", active: false, id: 7 },
          { name: "Outdoor Walking", active: false, id: 8 },
        ],
        areaTheme: [
          { name: "Beitou Dist.", active: false, id: 0 },
          { name: "Shilin Dist.", active: false, id: 1 },
          { name: "Neihu Dist.", active: false, id: 2 },
          { name: "Songshan Dist.", active: false, id: 3 },
          { name: "Zhongshan Dist.", active: false, id: 4 },
          { name: "Datong Dist.", active: false, id: 5 },
          { name: "Nangang Dist.", active: false, id: 6 },
          { name: "Xinyi Dist.", active: false, id: 7 },
          { name: "Da'an Dist", active: false, id: 8 },
          { name: "Zhongzheng Dist.", active: false, id: 9 },
          { name: "Wanhua Dist.", active: false, id: 10 },
          { name: "Wenshan Dist.", active: false, id: 11 }
        ]
      })
    }
  }
  changeInputHandle = e => {
    this.setState({
      searchInput: e.target.value
    });
  };
  selectMrtOptionHandle = e => {
    e.target.textContent && this.setState({
      searchMRT: e.target.textContent
    });
    !e.target.textContent && this.setState({
      searchMRT: null
    })
  };
  selectDayOptionHandle = e => {
    e.target.textContent && this.setState({
      searchDay: e.target.textContent
    })
    !e.target.textContent && this.setState({
      searchDay: null
    })
  }
  changePageNum = (currentPage) => {
    this.setState({
      currentPage
    });
    document.querySelector('.attraction-texts').scrollIntoView({
      block: 'start',
      behavior: 'auto'
    });
  };
  selectTagThemes = e => {
    let filterTagThems;
    let currentIndex = e.target.dataset.index;
    let newTagTheme = this.state.tagTheme.map((item, index) => {
      parseInt(currentIndex) === index && (item.active = !item.active);
      return item;
    });
    this.setState({
      tagTheme: newTagTheme
    });

    this.state.currentTagThemes.indexOf(e.target.textContent) < 0 &&
      this.setState({
        currentTagThemes: [...this.state.currentTagThemes, e.target.textContent]
      });
    this.state.currentTagThemes.indexOf(e.target.textContent) > -1 &&
      (filterTagThems = this.state.currentTagThemes.filter(
        item => item !== e.target.textContent
      )) &&
      this.setState({
        currentTagThemes: filterTagThems
      });
  };
  selectAreaThemes = e => {
    let filterAreaThemes;
    let currentIndex = e.target.dataset.index;
    let newAreaThemes = this.state.areaTheme.map((item, index) => {
      parseInt(currentIndex) === index && (item.active = !item.active);
      return item;
    });
    this.setState({
      areaTheme: newAreaThemes
    });

    this.state.currentAreaThemes.indexOf(e.target.textContent) < 0 &&
      this.setState({
        currentAreaThemes: [
          ...this.state.currentAreaThemes,
          e.target.textContent
        ]
      });
    this.state.currentAreaThemes.indexOf(e.target.textContent) > -1 &&
      (filterAreaThemes = this.state.currentAreaThemes.filter(
        item => item !== e.target.textContent
      )) &&
      this.setState({
        currentAreaThemes: filterAreaThemes
      });
  };
  removeSelectItem = (theme) => {
    const newTagThemes = this.state.tagTheme.map(item => {
      item.active = false
      return item
    });
    const newAreaThemes = this.state.areaTheme.map(item => {
      item.active = false
      return item
    })
    switch (theme) {
      case 'tag':
        this.setState({ 
          currentTagThemes: [],
          tagTheme: newTagThemes,
        })
        break;
      default:
        this.setState({ 
          currentAreaThemes: [],
          areaTheme: newAreaThemes,
        })
        break;
    }
  }
  searchAdvancedMobileHandle = (e) => {
    let className = e.target.className;
    let showSearchAdvancedMobile;
    switch(className) {
      case 'searchAdvanced-searchBtn':
        showSearchAdvancedMobile = false
        break;
      case 'mobile-searchAdvanced-bg':
        showSearchAdvancedMobile = false
        break;
      case 'searchAdvanced-btn':
        showSearchAdvancedMobile = true
        break;
      default:
        showSearchAdvancedMobile = false
        break;
    }
    this.setState({
      showSearchAdvancedMobile: showSearchAdvancedMobile,
    })
  }
  searchHandle = (e) => {
    e.preventDefault();
    if (!this.state.searchInput.trim()) {
      this.setState({
        searchData: null,
        currentPage: 1
      });
    }
    this.searchAdvancedMobileHandle(e);
    this.setState({
      currentDay: this.state.searchDay
    })
    document.querySelector('.attraction-texts').scrollIntoView({
      block: 'start',
      behavior: 'smooth'
    });
    let filterTextData = this.searchTextHandle();
    let filterMrtData = this.searchMrtHandle();
    let filterTagData = this.searchTagHandle();
    let filterAreaData = this.searchAreaHandle();

    this.state.searchInput && this.filterDataHandle(filterTextData);
    this.state.searchMRT && this.filterDataHandle(filterMrtData);
    this.state.searchInput && this.state.searchMRT &&
      this.filterDataHandle(this.searchTextHandle(filterMrtData));
    this.state.currentTagThemes.length && this.filterDataHandle(filterTagData);
    this.state.currentTagThemes.length && this.state.searchMRT &&
      this.filterDataHandle(this.searchMrtHandle(filterTagData));
    this.state.currentTagThemes.length &&
      this.state.searchMRT &&
      this.state.searchInput && 
      this.filterDataHandle(this.searchTextHandle(this.searchMrtHandle(filterTagData)));
    this.state.currentAreaThemes.length && this.filterDataHandle(filterAreaData);
    this.state.currentAreaThemes.length && this.state.searchMRT &&
      this.filterDataHandle(this.searchMrtHandle(filterAreaData))
    this.state.currentAreaThemes.length && 
      this.state.searchInput &&
      this.state.searchMRT  &&
      this.filterDataHandle(this.searchTextHandle(this.searchMrtHandle(filterAreaData)))
    !this.state.currentAreaThemes.length && 
      !this.state.currentTagThemes.length &&
      !this.state.searchMRT &&
      !this.state.searchInput &&
      this.filterDataHandle()
  };
  searchTextHandle = (data = this.state.results) => {
    let searchStitle;
    this.state.language === 'zh-TW' ? searchStitle = 'stitle' : searchStitle = 'stitle_en';
    let filterTextData = data.filter(item =>{
        return item[searchStitle].toUpperCase().includes((this.state.searchInput).toUpperCase())
      }
    );
    return filterTextData;
  };
  searchMrtHandle = (data = this.state.results) => {
    let filterMRTData = data.filter(item => item.MRT === this.state.searchMRT);
    return filterMRTData;
  };
  searchTagHandle = (data = this.state.results) => {
    let filterTagData = [];
    data.forEach(item => {
      this.state.currentTagThemes.forEach(tagItem =>
        tagItem === item.CAT2 ? filterTagData.push(item) : null
      );
    });
    return filterTagData;
  };
  searchAreaHandle = (data = this.state.results) => {
    let filterAreaData = [];
    data.forEach(item => {
      this.state.currentAreaThemes.forEach(areaItem => (
        areaItem === item.area ? filterAreaData.push(item) : null
      ));
    });
    return filterAreaData;
  }
  filterDataHandle = (filterData = this.state.results) => {
    let pageNumArray = [];
    let pageNum = Math.ceil(+filterData.length / 21);
    for (let i = 1; i <= pageNum; i++) {
      pageNumArray.push(i);
    }
    filterData && this.setState({
      searchData: filterData,
      currentPage: 1,
      startPage: 1,
      pageNum: pageNumArray
    });
  };
  filterCurrentAttraction =(id) => {
    if(!id) return;
    let currentAttraction;
    this.state.results && (currentAttraction = this.state.results.filter(item => {
      return item._id === +id
    }))
    return currentAttraction;
  }
  resetSearchInput = () => {
    this.setState({
      searchInput: '',
      searchMRT: null,
      searchDay: null,
      searchData: null,
      currentTagThemes: [],
      currentAreaThemes: [],
    })
    this.filterDataHandle();
  }
  checkSigninStatus = () => {
    fireAuth.onAuthStateChanged((user) => {
      if ( this.state.uid !== user && user !== null ) {
        let reminStatus;
        this.state.showRemindModel === 3 ? reminStatus = 3 : reminStatus = 1
        this.setState({ 
          uid: user.uid,
          showRemindModel: reminStatus,
        });
        this.getUserData(user.uid)
      }
      if (this.state.uid !== user && user === null) {
        this.setState({
          uid: user,
          showSignInModel: false,
          userData: null,
        })
      }
    })
  }
  getUserData = (id) => {
    const userIdRef = firebase.database().ref(`user/${id}`);
    userIdRef.on('value', (snapshot) => {
      this.setState({ userData: snapshot.val() })
    })
  }
  getTaipeiDate = (language) => {
    let DataRef;
    let openTimeData;
    if (language === 'zh-TW') {
      DataRef = firebase.database().ref('taipeiData');
      openTimeData = touristOpenTime;
    } else if (language === 'en') {
      DataRef = firebase.database().ref('taipeiData_EN');
      openTimeData = touristOpenTime_en;
    }
    DataRef.on('value', (snapshot) => {
      const taipeiData = snapshot.val();
      let pageNumArray = [];
      taipeiData.forEach(item => {
        openTimeData.Tourist.forEach(touristItem => {
          +item._id === +touristItem.id && (item.opening_hours = touristItem.opening_hours)
        });
      })
      const newTaipeiData = taipeiData.filter(item => item !== null);
      const count = newTaipeiData.length;
      let pageNum = Math.ceil(+count / 21);
      for (let i = 1; i <= pageNum; i++) { pageNumArray.push(i) };
      newTaipeiData.sort((a, b) => b.star_rating > a.star_rating ? 1 : -1);
      this.setState({
        results: newTaipeiData,
        count,
        pageNum: pageNumArray,
      }, () => this.setPageAllGroup(this.state.pageNum));
    }, (error) => {
      console.log(error,'error');
    });
  }
  setPageAllGroup = (pageNum) => {
    let pageAllGroup = [];
    for(let i=0; i<pageNum.length; i+=5) {
      pageAllGroup.push(pageNum.slice(i,i+5))
    }
    this.setState({ pageAllGroup })
  }
  changeTaipeiDataSortHandle = (mode) => {
    const taipeiData = this.state.results;
    switch (mode) {
      case 'star':
        taipeiData.sort((a, b) => b.star_rating > a.star_rating ? 1 : -1);
        this.setState({ resultsSortmode: 'star' });
        break;
      default:
      taipeiData.sort((a, b) => b.message_num > a.message_num ? 1 : -1);
      this.setState({ resultsSortmode: 'message' });
        break;
    }
    this.setState({ results: taipeiData });
  }
  clickHeartIconHandle = (e,uid,userData) => {
    const activeCurrentClassName = e.target.className;
    const activeCurrentId = e.target.dataset.id;
    if (activeCurrentClassName === 'attractionCard-heart' || activeCurrentClassName === 'heart') {
      e.preventDefault();
      e.stopPropagation();
      if (uid) {
        let favoriteArray;
        let filterFavoriteArray;
        userData.favorite && (favoriteArray = [...userData.favorite]);
        if (favoriteArray.includes(activeCurrentId)) {
          filterFavoriteArray = favoriteArray.filter(item => item !== activeCurrentId);
          this.setState({ showRemindModel: 6 });
        } else {
          filterFavoriteArray = [...favoriteArray,activeCurrentId]
          this.setState({ showRemindModel: 5 })        
        }
        firebase.database().ref(`/user/${uid}/favorite`).set(filterFavoriteArray);
      } else {
        this.setState({ showErrorReminModel: true })
      }
    }
  }
  filterFavorite = (userData,id) => {
    let favorite;
    userData && (favorite = userData.favorite);
    return favorite && favorite.some(item => {
      return +item === +id
    })
  }
  render() {
    const contextValue = {
      ...this.state,
      changePageNum: this.changePageNum,
      changeInputHandle: this.changeInputHandle,
      selectTagThemes: this.selectTagThemes,
      selectAreaThemes: this.selectAreaThemes,
      searchHandle: this.searchHandle,
      selectMrtOptionHandle: this.selectMrtOptionHandle,
      selectDayOptionHandle: this.selectDayOptionHandle,
      filterOpenTime: this.filterOpenTime,
      searchAdvancedMobileHandle: this.searchAdvancedMobileHandle,
      removeSelectItem: this.removeSelectItem,
      clickHeartIconHandle: this.clickHeartIconHandle,
      filterFavorite: this.filterFavorite,
      resetSearchInput: this.resetSearchInput,
      changeTaipeiDataSortHandle: this.changeTaipeiDataSortHandle,
      getTaipeiDate: this.getTaipeiDate,
      changeLanguageMRT: this.changeLanguageMRT,
      changeLanguageAdvance: this.changeLanguageAdvance,
      setState: this.setState.bind(this),
    };
    return (
      <HashRouter>
        <ScrollToTop>
          <Provider value={contextValue}>
            <Header />
            {this.state.showRemindModel || this.state.showErrorReminModel ? <RemindModel /> : null}
            {this.state.showSignInModel && !this.state.uid ? <SigninModel language={this.state.language} /> : null }
            <Switch>
              <Route exact path="/" render={() => <HomePage /> }/>
              <Route exact path="/attraction/:id" render={({ match }) => {
                const currentData = this.filterCurrentAttraction((match.params.id));
                return currentData ? <AttractionPage data={currentData} id={match.params.id}/> : <AttractionPageLoad />;
              }}/>
              <Route exact path="/myHeart" render={() => <CollectionPage /> }/>
              <Route exact path='/myHeart/*' component={CollectionPage} />
              <Route path='*' component={HomePage} />
            </Switch>
            <Footer />
          </Provider>
        </ScrollToTop>
      </HashRouter>
    );
  }
}

export default App;
