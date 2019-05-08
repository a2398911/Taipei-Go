import React, { Component } from 'react';
import BouncingLoader from '../../../components/BouncingLoader';
import './AttracionPageLoad.scss';


class AttractionPageLoad extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12 d-flex h-justify-content-center">
            <div className="attraction-load-wrap">
              <BouncingLoader />
            </div>
            <div className="attraction-load-bg"></div>
          </div>
        </div>
      </div>
    )
  }
}

export default AttractionPageLoad;
