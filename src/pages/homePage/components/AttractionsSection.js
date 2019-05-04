import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { Consumer } from "../../../context/DataContext";
import AttractionCard from "./AttractionCard";
import PageNumber from "./PageNumber";
import BouncingLoader from '../../../components/BouncingLoader';
import square from '../../../img/square.svg';
import LanguageZhTW from '../../../language/zh-TW';
import LanguageEn from '../../../language/en';
import "./AttractionsSection.scss";

class AttractionsSection extends Component {
  state = {
    cardIsRow: false,
  }
  currentDataHandle = (results, searchData, currentPage) => {
    let data;
    searchData ? data = searchData : data = results;
    return data.filter((item, index) => {
      let defaultPage;
      defaultPage = (currentPage - 1)*21;
      return (
        defaultPage <= index && index <= defaultPage + 20
      );
    });
  }
  changeCardArrangement = () => {
    this.setState({
      cardIsRow: !this.state.cardIsRow
    })
  }
  render() {
    const { cardIsRow } = this.state
    let backgroundImage = {
      backgroundImage: `url(${square})`,
    };
    return (
      <Consumer>
      {({count, searchData, resultsSortmode,changeTaipeiDataSortHandle, results, currentPage, language}) => {
        let currentCount;
        let currentData;
        let languageStatus;
        let currentCountText;
        results && (currentData = this.currentDataHandle(results, searchData, currentPage));
        searchData ? (currentCount = searchData.length) : (currentCount = count);
        !currentCount && (currentCount = 0);
        language === 'zh-TW' ? languageStatus = LanguageZhTW : languageStatus = LanguageEn;
        language === 'zh-TW' ? currentCountText = `共有 ${currentCount} 處景點` : currentCountText = `${currentCount} Attractions`;
        return (
          <section>
            <div className="container">
              <main className="attractions-wrap">
                <div className="row">
                  <div className="col-12">
                    <div className="attraction-texts">
                      <h1 className="title">{languageStatus.contentSection.title}</h1>
                      {<div className="subtitle">{currentCountText}</div>}
                      <button className="changeList" onClick={this.changeCardArrangement}>
                        {cardIsRow ? <div className="list-icon" style={backgroundImage}></div> 
                          : <FontAwesome name="list" />}
                      </button>
                    </div>
                    <div className="hr" />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <div className="order d-flex h-align-items-center">
                      <span className="sort-amount-down d-inline-block" />
                      <button className={resultsSortmode === 'star' ? 'mostScore active' : 'mostScore'} onClick={() => (changeTaipeiDataSortHandle('star'))}>{languageStatus.contentSection.mostScore}</button>
                      <button className={resultsSortmode === 'message' ? 'mostComment active' : 'mostComment'} onClick={() => (changeTaipeiDataSortHandle('message'))}>{languageStatus.contentSection.mostComment}</button>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {!results ? <BouncingLoader /> : (
                    currentData.length ? (currentData.map(item => <AttractionCard key={item._id} data={item} cardIsRow={cardIsRow} />)) : (
                      <div className="container">
                        <div className="row">
                          <div className="col-12">
                            <h2 className="srarch-results"><FontAwesome name="exclamation-triangle" className="exclamation-triangle" />{languageStatus.contentSection.searchNothing}</h2>
                          </div>
                        </div>
                      </div>)
                  )}
                </div>
                <div className="row">
                  <div className="col-12">
                    <PageNumber />
                  </div>
                </div>
              </main>
            </div>
          </section>
        )
      }}
      </Consumer>
    );
  }
}

export default AttractionsSection;
