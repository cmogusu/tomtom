import React from 'react';
import { withTomtom } from './functions.js';
import apiKey from './apiKey.js';

type Props = {
  tomtom: {},
  center?: {},
};

class Map extends React.Component<Props> {
  static defaultProps = {
    center: {
      lat: 37.769167,
      lng: -122.478468,
    },
  };

  tomtom = null;

  map = null;

  componentDidUpdate(prevProps) {
    const { tomtom } = prevProps;

    if (tomtom !== this.tomtom) {
      this.renderMap();
      this.tomtom = tomtom;
    }
  }

  renderMap() {
    const { tomtom, center } = this.props;

    if (this.map) {
      return;
    }

    this.map = tomtom.L.map('map', {
      key: apiKey,
      source: 'vector',
      basePath: '/sdk',
      zoom: 15,
      center,
    });
  }

  render() {
    return <div id="map" />;
  }
}

export default withTomtom(Map);
