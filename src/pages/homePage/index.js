import React, { Component } from 'react';
import Hero from './components/Hero';
import AttractionsSection from './components/AttractionsSection';

class HomePage extends Component {
  render() {
    return (
      <>
        <Hero />
        <AttractionsSection />
      </>
    )
  }
}

export default HomePage;