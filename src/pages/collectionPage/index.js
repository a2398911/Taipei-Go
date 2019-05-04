import React, { Component } from 'react';
import AttractionCard from '../homePage/components/AttractionCard';
import FontAwesome from "react-fontawesome";
import { Consumer } from "../../context/DataContext";
import LanguageZhTW from '../../language/zh-TW';
import LanguageEn from '../../language/en';
import './index.scss';

class CollectionPage extends Component {
  checkSigninStateus = (uid) => {
    !uid && (window.location.href='/');
  }
  favoriteDataHandle = (userData,results) => {
    let favoriteFilterData;
    userData && (favoriteFilterData =  userData.favorite.filter(item => item !== 0));
    let filterResultes = [];
    results && results.forEach(resultesItem => {
      favoriteFilterData && favoriteFilterData.forEach(item => {
        resultesItem._id === +item && filterResultes.push(resultesItem);
      })
    })
    return filterResultes;
  }
  filterTagData = (userFavoriteData,tag) => {
    const favoriteTag = userFavoriteData.filter(item => item.CAT2 === tag);
    return favoriteTag.length
  }
  render() {
    return (
      <Consumer>
      {({ userData,uid,results,language }) => {
        const userFavoriteData = this.favoriteDataHandle(userData,results);
        let languageStatus;
        let addCategoryClass;
        language === 'zh-TW' ? languageStatus = LanguageZhTW : languageStatus = LanguageEn;
        language === 'zh-TW' ? addCategoryClass = '' : addCategoryClass = ' en';
        return(
          <section>
            <div className="container">
              <div className="collection-wrap">
                <div className="row">
                  <div className="col-12">
                    <div className="collection-title">
                      <FontAwesome name="heart" className="collection-heart-icon" />
                      {languageStatus.favoritePage.title}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                  <div className="collection-member-wrap">
                    <div className="member-info d-flex h-align-items-center">
                      <FontAwesome name="user" className="collection-user" />
                      <span className="member-name">{userData && userData.nickName}</span>
                    </div>
                    <div className="member-collectionNum">
                      <div className="collectionNum-title">{languageStatus.favoritePage.subTitle}</div>
                      <ul className={`collection-category-wrap d-flex${addCategoryClass}`}>
                        <li className={`category-item all${addCategoryClass}`}>{userFavoriteData.length}</li>
                        <li className={`category-item item-0${addCategoryClass}`}>{this.filterTagData(userFavoriteData, languageStatus.favoritePage.tagTheme[0])}</li>
                        <li className={`category-item item-1${addCategoryClass}`}>{this.filterTagData(userFavoriteData, languageStatus.favoritePage.tagTheme[1])}</li>
                        <li className={`category-item item-2${addCategoryClass}`}>{this.filterTagData(userFavoriteData, languageStatus.favoritePage.tagTheme[2])}</li>
                        <li className={`category-item item-3${addCategoryClass}`}>{this.filterTagData(userFavoriteData, languageStatus.favoritePage.tagTheme[3])}</li>
                        <li className={`category-item item-4${addCategoryClass}`}>{this.filterTagData(userFavoriteData, languageStatus.favoritePage.tagTheme[4])}</li>
                        <li className={`category-item item-5${addCategoryClass}`}>{this.filterTagData(userFavoriteData, languageStatus.favoritePage.tagTheme[5])}</li>
                        <li className={`category-item item-6${addCategoryClass}`}>{this.filterTagData(userFavoriteData, languageStatus.favoritePage.tagTheme[6])}</li>
                        <li className={`category-item item-7${addCategoryClass}`}>{this.filterTagData(userFavoriteData, languageStatus.favoritePage.tagTheme[7])}</li>
                        <li className={`category-item item-8${addCategoryClass}`}>{this.filterTagData(userFavoriteData, languageStatus.favoritePage.tagTheme[8])}</li>
                      </ul>
                    </div>
                  </div>
                  </div>
                </div>
                <div className="collection-cards">
                  <div className="row">
                    { userFavoriteData.map(item => <AttractionCard data={item} key={item._id} /> )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
      }}
      </Consumer>
    )
  }
}

export default CollectionPage;
