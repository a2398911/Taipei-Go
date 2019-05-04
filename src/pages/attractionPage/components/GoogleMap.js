import React, { Component } from "react";
import $script from "scriptjs";

var openwindow;

class GoogleMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: {},
      markers: [],
      language: this.props.language
    };
    this.mapRef = React.createRef();
  }
  componentDidMount() {
    $script(
      `https://maps.googleapis.com/maps/api/js?key=AIzaSyBBMko9344y32hbPtFedASD3zGcWrx_gus&language=${this.state.language}`,
      this.createMap
    );
  }
  createMap = () => {
    const { stitle, latitude, longitude } = this.props.data;
    this.setState({
      map: new window.google.maps.Map(this.mapRef.current)
    });
    this.state.map.setCenter({ lat: +latitude, lng: +longitude });
    this.state.map.setZoom(17);

    let tempArr;
    tempArr = this.state.markers;
    let marker = new window.google.maps.Marker({
      position: { lat: +latitude, lng: +longitude },
      map: this.state.map,
      animation: window.google.maps.Animation.DROP
    });
    let infowindow = new window.google.maps.InfoWindow({
      content: "<h4>" + stitle + "</h4>"
    });
    marker.addListener("click", e => {
      if (openwindow) {
        openwindow.close();
      }
      openwindow = infowindow;
      infowindow.open(this.state.map, marker);
    });
    tempArr.push(marker);
    this.setState({ markers: tempArr });
  };
  render() {
    return <div className="google-map-show" ref={this.mapRef} />
  }
}

export default GoogleMap;
