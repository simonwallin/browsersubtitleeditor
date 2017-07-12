import React from 'react';
import HoverHelper from "./HoverHelper.jsx";
import MessageBox from "./MessageBox.jsx"

const textContent = require("./../../config.js");
const $ = require("jquery");

class MenuPopup extends React.Component {
  constructor(props) {
    super(props)
  }
  toggle() {
    $("#" + this.props.id).toggle();
  }
  componentDidMount() {

  }
  render() {
    return(
      <div className="editor-menu-popup" id={this.props.id}>
        <label htmlFor="upl">Select a file to edit</label>
        <p>or paste a link to a .m3u8, .mpd, .mp4, .ogg or .webm file</p>
        <input id="link-load"></input>
      </div>
    )
  }
}

export default class EditorMenu extends React.Component {
  constructor(props){
    super(props)

  }
  onHoverEvent(e) {
    this.refs[e.target.id].showSelf(e.target.id);
  }
  componentDidMount() {

  }
  onMouseLeave(e) {
    this.refs[e.target.id].hideSelf(e.target.id)
  }
  updateVideoSrc() {
    const files = $("#upl").get(0).files;
    if(files.length > 0){
      const url = URL.createObjectURL(files[0]);
      window.player.sourceList.sourceList = [url];
      window.player.play();
      this.refs.uplPopup.hide($("#upl-popup")[0]);

    }
  }
  uplClick() {
    this.refs.uplPopup.show();
  }
  playLink() {
    window.player.sourceList.sourceList = [$("#input-link").val()];
    window.player.play();
  }
  uplHtmlContent() {
    return(
      <div className="select-video-form">
        <label htmlFor="upl" ><i id="video-icon" className="fa fa-film fa-2x menu-icon"></i></label>
        <input id="upl" onChange={this.updateVideoSrc.bind(this)} type="file" name="upl" accept="video/*"></input>
        <input id="input-link"></input>
        <button onClick={this.playLink}>Load</button>
      </div>
    )
  }
  render () {
    return (
      <div className="editor-menu">
        <HoverHelper ref="download-icon" message={textContent.helpers.download} class="hidden" left={140}/>
        <HoverHelper ref="add-icon" message={textContent.helpers.subtitleRow} left={140} />
        <HoverHelper ref="video-icon" message={textContent.helpers.videoFile} left={140}/>
        <HoverHelper ref="upload-icon" message={textContent.helpers.uploadSrt} left={140}/>
        <input id="srt-upl" onChange={this.props.subsParse} type="file" name="srt-upl"></input>
        <label htmlFor="srt-upl"><i onMouseEnter={this.onHoverEvent.bind(this)} onMouseLeave={this.onMouseLeave.bind(this)} id="upload-icon" className="fa fa-upload fa-2x menu-icon"></i></label>

        <MessageBox htmlContent={this.uplHtmlContent()} ref="uplPopup" id="upl-popup" content={textContent.uplPopupContent} class="hidden" />
        <label onClick={this.uplClick.bind(this)} ><i onMouseEnter={this.onHoverEvent.bind(this)} onMouseLeave={this.onMouseLeave.bind(this)} id="video-icon" className="fa fa-film fa-2x menu-icon"></i></label>

        <i onMouseEnter={this.onHoverEvent.bind(this)} onMouseLeave={this.onMouseLeave.bind(this)} onClick={this.props.addSubtitleCue} id="add-icon" className="fa fa-plus-circle fa-2x menu-icon"></i>
        <i onMouseEnter={this.onHoverEvent.bind(this)} onMouseLeave={this.onMouseLeave.bind(this)} onClick={this.props.save} id="download-icon" className="fa fa-download fa-2x menu-icon"></i>
      </div>
    );
  }
}
