import React, { Component } from "react";
import SearchBarWeb from './SearchBarWeb';
import SearchBarMobile from "./SearchBarMobile";
import { Consumer } from "../../../context/DataContext";
import "./Hero.scss";
import LanguageZhTW from '../../../language/zh-TW';
import LanguageEn from '../../../language/en';

class Hero extends Component {
  constructor(props) {
    super(props);
    this.state = {
      optionDateShow: false,
      optionMRTShow: false,
      searchAdvanced: false,
      currentThemeIsTag: true,
      currentSelectMRT: null,
      week: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
      weekEn: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      heroBg: 1,
    };
    this.heroBg_1Ref = React.createRef();
    this.heroBg_2Ref = React.createRef();
    this.heroBg_3Ref = React.createRef();
  }
  componentDidMount(){
    const intervalId = setInterval(this.timer, 15000);
    this.setState({intervalId: intervalId});
  }
  timer = () => {
    const { heroBg } = this.state;
    if ( heroBg === 1) {
      this.heroBg_2Ref.current.classList.remove('d-none');
      this.heroBg_1Ref.current.classList.remove('z-index');
      this.heroBg_3Ref.current.classList.add('d-none');
      this.setState({ heroBg: 2 });
    } else if (heroBg === 2) {
      this.heroBg_3Ref.current.classList.remove('d-none'); 
      this.heroBg_1Ref.current.classList.add('d-none');
      this.setState({ heroBg: 3 });
    } else if (heroBg === 3) {
      this.heroBg_2Ref.current.classList.add('d-none');
      this.heroBg_1Ref.current.classList.remove('d-none');
      this.heroBg_1Ref.current.classList.add('z-index');
      this.setState({ heroBg: 1 });
    }
  }
  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }
  showOptionDate = () => {
    this.setState({
      optionDateShow: true,
      searchAdvanced: false,
      optionMRTShow: false
    });
  };
  closeOptionDate = (e) => {
    e.stopPropagation();
    this.setState({
      optionDateShow: false
    });
  };
  closeOptionDateOnSection = (e) => {
    if (e.target.className === 'select d-flex h-align-items-center') return;
    this.setState({
      optionDateShow: false,
      optionMRTShow: false
    });
  }
  showOptionMRT = () => {
    this.setState({
      optionMRTShow: true,
      searchAdvanced: false,
      optionDateShow: false,
    });
  };
  closeOptionMRT = () => {
    this.setState({
      optionMRTShow: false
    });
  };
  toggleSearchAdvanced = () => {
    this.setState({
      searchAdvanced: !this.state.searchAdvanced,
      optionMRTShow: false,
      optionDateShow: false,
    });
  };
  changeCurrentTheme = () => {
    this.setState({
      currentThemeIsTag: !this.state.currentThemeIsTag
    });
  };
  render() {
    return (
      <Consumer>
      {({language}) => {
        let languageStatus;
        let week;
        language === 'zh-TW' ? languageStatus = LanguageZhTW : languageStatus = LanguageEn;
        language === 'zh-TW' ? week = this.state.week : week = this.state.weekEn;
        return (
          <>
            <section className="hero d-flex h-align-items-center" onClick={this.closeOptionDateOnSection}>
              <div className="hero-bg" ref={this.heroBg_1Ref}></div>
              <div className="hero-bg _2 d-none" ref={this.heroBg_2Ref}></div>
              <div className="hero-bg _3 d-none" ref={this.heroBg_3Ref}></div>
              <div className="container z-index mt-50">
                <div className="row">
                  <div className="col-12">
                    <h1 className="hero-title">{languageStatus.hero.title}</h1>
                    <p className="hero-subtitle">
                      What is your impression of Taipei?
                      <br />
                      Everyone has an unique story to tell about the wondrous Taipei
                      that’s
                      <br />
                      definitely worth telling. Let’s hear about what celebrities
                      have to say
                      <br />
                      about Taipei, and unleash our imagination!
                      <br />
                    </p>
                  </div>
                  <div className="col-12 d-flex h-justify-content-center">
                    <SearchBarWeb showOptionDate={this.showOptionDate} optionDateShow={this.state.optionDateShow} 
                      closeOptionDate={this.closeOptionDate} showOptionMRT={this.showOptionMRT} week={week}
                      optionMRTShow={this.state.optionMRTShow} toggleSearchAdvanced={this.toggleSearchAdvanced}
                      searchAdvanced={this.state.searchAdvanced} currentThemeIsTag={this.state.currentThemeIsTag}
                      changeCurrentTheme={this.changeCurrentTheme}
                    />
                  </div>
                </div>
              </div>
            </section>
            <SearchBarMobile showOptionDate={this.showOptionDate} optionDateShow={this.state.optionDateShow} 
              closeOptionDate={this.closeOptionDate} showOptionMRT={this.showOptionMRT} week={week}
              optionMRTShow={this.state.optionMRTShow} toggleSearchAdvanced={this.toggleSearchAdvanced}
              searchAdvanced={this.state.searchAdvanced} currentThemeIsTag={this.state.currentThemeIsTag}
              changeCurrentTheme={this.changeCurrentTheme} closeOptionDateOnSection={this.closeOptionDateOnSection}/>
          </>
        )
      }}
      </Consumer>
    );
  }
}

export default Hero;
