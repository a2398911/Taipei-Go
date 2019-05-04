import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { Consumer } from "../../../context/DataContext";
import "./PageNumber.scss";

class PageNumber extends Component {
  // handleShowPage = (num) => {
  //   console.log(num)
  //   let groupNum = [];
  //   for(let i=0; i<num.length; i+=5) {
  //     groupNum.push(num.slice(i,i+5))
  //   }
  //   return groupNum;
  // }
  render() {
    return (
      <Consumer>
      {({currentPage, changePageNum, pageNum}) => (
        <div className="container">
        <div className="row">
          <div className="col-12">
            {pageNum.length ? (
              <div className="pageNum-wrap d-flex h-justify-content-center h-align-items-center">
              <FontAwesome name="angle-left" 
                    className="angle-left" 
                    data-num={currentPage-1} 
                    onClick={changePageNum}/>
              <ul className="pageNum-ul d-flex h-flex-wrap">
                {pageNum.map((listNum, index) => {
                  let classNames = 'pageNum-li d-flex h-align-items-center h-justify-content-center';
                  +index === (currentPage - 1) ? (classNames += ' active') : (classNames += '');
                  return (
                    <li className={classNames}
                      key={listNum}
                      onClick={changePageNum}>
                        {listNum}
                    </li>
                  );
                })}
              </ul>
              <FontAwesome name="angle-right" 
                className="angle-right" 
                data-num={currentPage+1}
                onClick={changePageNum}/>
            </div>
            ) : null }
          </div>
        </div>
      </div>
      )}
      </Consumer>
    );
  }
}

export default PageNumber;
