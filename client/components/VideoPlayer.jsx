import React from 'react';
import VideoControls from './VideoControls.jsx';
import Player from "./../javascript/Player.js";
import HoverHelper from "./HoverHelper.jsx";

const $ = require("jquery");
const textContent = require("./../../config.js");

export default class VideoPlayer extends React.Component {
  constructor(props){
    super(props)
    this.state = {

    }
  }
  componentDidMount() {
    window.player = new Player("main-video", [textContent.sampleVideo]);
    this.player = window.player;
    //this.player.play();
  }
  onHoverEvent(e) {
    this.refs[e.target.id].showSelf(e.target.id);
  }
  onMouseLeave(e) {
    this.refs[e.target.id].hideSelf(e.target.id)
  }
  render () {
    return (
      <div className="player-module-wrapper">
        <div className="player-wrapper" id="main-player">
          <video id="main-video" muted controls></video>
        </div>
      </div>
    );
  }
}
