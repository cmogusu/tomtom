import React from 'react';


export function loadScript() {
  const script = document.createElement('script');
  script.src = `${process.env.PUBLIC_URL}/sdk/tomtom.min.js`;
  document.body.appendChild(script);
  script.async = true;
  script.onload = () => {
    const mapsReadyEvent = new Event('tomtomReady');
    window.dispatchEvent(mapsReadyEvent);
  };
}


export function withTomtom(Component) {
  return class extends React.Component {
    state = {
      tomtom: {},
    }

    componentDidMount() {
      if (window.tomtom) {
        this.init();
      } else {
        window.addEventListener('tomtomReady', this.init);
      }
    }

    componentWillUnmount() {
      window.removeEventListener('tomtomReady', this.init);
    }

    init = () => {
      setTimeout(() => {
        const { tomtom } = window;

        this.setState({ tomtom });
      }, 100);
    }

    render() {
      const { tomtom } = this.state;
      return <Component tomtom={tomtom} {...this.props} />;
    }
  };
}
