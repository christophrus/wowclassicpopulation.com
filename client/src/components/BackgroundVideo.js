/* eslint-disable jsx-a11y/media-has-caption */
import React, { Component } from 'react';
import './BackgroundVideo.css';

class BackgroundVideo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      videoURL: 'videos/br.webm'
    };
  }

  render() {
    const { videoURL } = this.state;
    return (
      <div className="fullscreen-bg">
        <div className="overlay">
          <video className="video-bg" loop muted autoPlay poster="images/main.jpg">
            <source src={videoURL} type="video/webm" />
          </video>
        </div>
      </div>
    );
  }
}

export default BackgroundVideo;
