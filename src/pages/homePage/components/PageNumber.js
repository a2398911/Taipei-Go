import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { Consumer } from "../../../context/DataContext";
import "./PageNumber.scss";

class PageNumber extends Component {
  state = {
    groupCount: 5,
    startPage: 1,
  }
  go(currentPage, totalPage, changePageNum, groupCount, setState) {
    // const { groupCount } = this.state;
    // 處理上一頁的狀態
    currentPage % groupCount === 1 && setState({startPage: currentPage});
    currentPage % groupCount === 0 && setState({startPage: currentPage - groupCount + 1});
    totalPage - currentPage < 1 && setState({startPage: totalPage - groupCount});
    changePageNum(currentPage);
  }
  // 頁面向前
  goPrev = (e, currentPage, totalPage, changePageNum, groupCount, setState) => {
    e.preventDefault();
    if (--currentPage === 0) return;
    this.go(currentPage, totalPage, changePageNum, groupCount, setState);
  };
  // 頁面向後
  goNext = (e, currentPage, totalPage, changePageNum, groupCount, setState) => {
    e.preventDefault();
    if (++currentPage > totalPage) return;
    this.go(currentPage, totalPage, changePageNum, groupCount, setState);
  };
  creatFivePages = (startPage,currentPage,totalPage,changePageNum, groupCount, setState) => {
    let pages = [];
    for (let i = startPage; i < 5 + startPage; i++) {
      let classNames = 'pageNum-li d-flex h-align-items-center h-justify-content-center';
      currentPage === i ? (classNames += ' active') : (classNames += '');
      i<=totalPage - 1 && (pages.push(
        <li className={classNames}
          key={i}
          onClick={() => this.go(i, totalPage, changePageNum, groupCount, setState)}>
            {i}
        </li>
      ))
    }
    return pages;
  }
  render() {
    return (
      <Consumer>
        {({currentPage, changePageNum, pageNum, groupCount, startPage, setState}) => {
          const totalPage = pageNum.length;
          {/* const { startPage, groupCount} = this.state; */}
          const fivePages = this.creatFivePages(startPage,currentPage,totalPage,changePageNum, groupCount, setState);
          if (!pageNum.length) {return}
          return (
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="pageNum-wrap d-flex h-justify-content-center h-align-items-center">
                    <FontAwesome name="angle-left" 
                      className="angle-left" 
                      data-num={currentPage-1} 
                      onClick={(e) => this.goPrev(e, currentPage, totalPage, changePageNum, groupCount, setState)}/>
                    {totalPage <= 10 ? (
                      <ul className="pageNum-ul d-flex h-flex-wrap">
                        {pageNum.map((listNum, index) => {
                          let classNames = 'pageNum-li d-flex h-align-items-center h-justify-content-center';
                          currentPage === index+1 ? (classNames += ' active') : (classNames += '');
                          return (
                            <li className={classNames}
                              key={listNum}
                              onClick={() => this.go(index+1, totalPage, changePageNum, groupCount, setState)}>
                                {listNum}
                            </li>);
                          })}
                      </ul>
                    ) : (
                      <ul className="pageNum-ul d-flex h-flex-wrap">
                        {startPage > groupCount && (
                          <>
                            <li className={currentPage === 1 ? 'pageNum-li d-flex h-align-items-center h-justify-content-center active'
                              :'pageNum-li d-flex h-align-items-center h-justify-content-center'}
                              key={0}
                              onClick={e => this.go(1, totalPage, changePageNum, groupCount, setState)}>
                                1
                            </li>
                            <li className="ellipsis d-flex h-align-items-center" key={-2}>
                              <span className="btn btn-sm btn-outline-primary text-primary"
                                onClick={() => this.go(startPage - 5, totalPage, changePageNum, groupCount, setState)}>
                                ···
                              </span>
                            </li>
                          </>
                        )}
                        {fivePages}
                        {totalPage - startPage > groupCount && (
                          <li className="ellipsis d-flex h-align-items-center" key={-1}>
                            <span className="btn btn-sm btn-outline-primary text-primary"
                              onClick={() => this.go(startPage + 5, totalPage, changePageNum, groupCount, setState)}>
                              ···
                            </span>
                          </li>
                        )}
                        <li className={currentPage === totalPage ? 'pageNum-li d-flex h-align-items-center h-justify-content-center active'
                              :'pageNum-li d-flex h-align-items-center h-justify-content-center'}
                          key={0}
                          onClick={() => this.go(totalPage, totalPage, changePageNum, groupCount, setState)}>
                            {totalPage}
                        </li>
                      </ul>
                    )}
                    <FontAwesome name="angle-right" 
                      className="angle-right" 
                      data-num={currentPage+1}
                      onClick={e => this.goNext(e, currentPage, totalPage, changePageNum, groupCount, setState)}/>
                  </div>
                </div>
              </div>
            </div>
          )
        }}
      </Consumer>
    );
  }
}

export default PageNumber;