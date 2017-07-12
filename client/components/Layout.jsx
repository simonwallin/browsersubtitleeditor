import React from 'react';
import Header from './Header.jsx';
import SubtitleEditor from './SubtitleEditor.jsx';
import VideoPlayer from './VideoPlayer.jsx';
import MessageBox from "./MessageBox.jsx";
const $ = require("jquery");


export default class Layout extends React.Component {
  constructor(props){
    super(props)

  }
  render () {
    return (
      <div id="content"> 
        <div id="main-content">
          <SubtitleEditor />
          <VideoPlayer />
        </div>
      </div>
    );
  }
}
