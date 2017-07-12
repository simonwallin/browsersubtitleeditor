import React from 'react';
import EditorMenu from "./EditorMenu.jsx";
const $ = require("jquery");


class SubtitlesLoader{
  constructor(){
    this.subsparser = require("subtitles-parser");
    this.fileReader = new FileReader();
  }
  fromSrt(file, callback) {
    return new Promise((resolve, reject) => {
      this.fileReader.onload = (event) => {
        resolve(this.subsparser.fromSrt(event.target.result))
      }
      this.fileReader.readAsText(file)
    });
  }
}

class SubtitleCue{
  constructor(id, startTime, endTime, text, parent) {
    this.id = id;
    this.startTime = typeof startTime === 'string' ? startTime : this.getTimeString(startTime);
    this.endTime = typeof endTime === 'string' ? endTime : this.getTimeString(endTime);
    this.text = text;
    this.Cue= new VTTCue(this.getSecondsFromString(this.startTime), this.getSecondsFromString(this.endTime), this.text);
    this.Cue.id = this.id;
    this.parent = parent;
    this.parent.track.addCue(this.Cue);
  }
  delete() {
    this.parent.track.removeCue(this.Cue)
  }
  updateValues() {
    this.Cue.startTime = this.getSecondsFromString(this.startTime);
    this.Cue.endTime = this.getSecondsFromString(this.endTime);
    this.Cue.text = this.text;
    this.Cue.id = this.id;
  }
  getSecondsFromString(hms) {
    if(typeof hms === "string"){
      if(hms){
        var a = hms.replace(',', '.')
        a = a.split(':');
        var totalNumberOfSeconds = (+parseFloat(a[0])) * 60 * 60 + (+parseFloat(a[1])) * 60 + (+parseFloat(a[2]));
        return totalNumberOfSeconds;
      }else{
        return 0
      }
    }else{
      return hms;
    }
  }
  getCleanModel(){
    return {
      startTime: this.startTime,
      endTime: this.endTime,
      id: this.id,
      text: this.text,
    }
  }
  getTimeString(seconds) {
    let decimals;
    if(seconds.toString().length === 1){
      decimals = "000";
    }else{
      decimals = seconds.toString().split(".")[1].substring(0,3);
    }
    var h = this.addZero(Math.floor(seconds / 3600));
    var m = this.addZero(Math.floor(seconds % 3600 / 60));
    var s = this.addZero(Math.floor(seconds % 3600 % 60));
    return h +':' + m +':' + s + ',' + decimals;
  }
  addZero(num) {
    if(num < 10){
      return '0' + String(num);
    }else{
      return num;
    }
  }
}

export default class SubtitleEditor extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      subtitles: [],
    }
    this.loader = new SubtitlesLoader();
    this.getCollection();
  }
  createTextTrack() {
    this.track = document.getElementsByTagName("video")[0].addTextTrack("captions");
    this.track.mode = "showing";
  }
  save(){
    //TODO some sort of check to see if everything is alright.
    const State = $.extend({}, this.state);
    const cleanModel = [];
    State.subtitles.forEach((item) => {
      cleanModel.push(item.getCleanModel());
    });
    $.ajax({
      url: "/api/download",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(cleanModel),
      success: (data) => {
        if(data===true){
          window.location.pathname = "/api/download"
        }
      }
    })
  }
  addSubtitleCue() {
    const newState = $.extend({}, this.state);
    newState.subtitles.push(new SubtitleCue(new Date().getUTCMilliseconds().toString(), document.getElementsByTagName("video")[0].currentTime, document.getElementsByTagName("video")[0].currentTime + 3, "new line", this));
    newState.subtitles.sort(this.compare);
    this.setState(newState);
  }
  normalizeIds(){
    this.state.subtitles.forEach((sub) => {
      console.log(sub.id);
    });
  }
  compare(a, b){
    return a.startTime > b.startTime;
  }
  subsParse(){
    this.deleteAllCues();
    this.loader.fromSrt($("#srt-upl").get(0).files[0]).then((data) => {
      const subtitles = [];
      data.forEach((item) => {
        subtitles.push(new SubtitleCue(item.id, item.startTime, item.endTime, item.text, this))
      });
      const newState =  $.extend({}, this.state)
      newState.subtitles = subtitles;
      this.setState(newState);
    });
  }
  badTimeFormat(text) {
    return !Boolean(text.match(/[0-9][0-9]:[0-9][0-9]:[0-9][0-9],[0-9][0-9][0-9]/g));
  }
  deleteSubtitleCue(e) {
    const newState = $.extend({}, this.state);
    newState.subtitles = newState.subtitles.filter((item) => {
      if(item.id === e.target.id) {
        item.delete();
      }
      return item.id != e.target.id;
    })
    this.setState(newState);
  }
  deleteAllCues() {
    this.state.subtitles.forEach((item) => {
      item.delete();
    })
  }
  getCollection(){
    $.get("/api/load", data => {
      let subtitles = [];
      if(document.getElementsByTagName("video")[0].textTracks.length < 1){
        this.createTextTrack()
      }
      data.forEach((item) => {
        subtitles.push(new SubtitleCue(item.id, item.startTime, item.endTime, item.text, this))
      })
      this.setState({subtitles: subtitles});
    });
  }
  onSubtitleChange(e) {
    const newState = $.extend({ }, this.state);
    newState.subtitles = newState.subtitles.map((item) => {
      if(item.id === e.target.id){
        if(this.badTimeFormat(e.target.value) && e.target.name != "text"){
          $(e.target).addClass("warning-highlight");
        }else{
          $(e.target).removeClass("warning-highlight");
        }
        item[e.target.name] = e.target.value;
        item.updateValues();
      }
      return item;
    });
    newState.subtitles.sort(this.compare);
    this.setState(newState);
  }
  highlight(e) {
    $(e.target).addClass("highlight");
  }
  unlighlight(e) {
    $(e.target).removeClass("highlight");
  }
  highlightActive(e) {
    setInterval(() => {
      if(!this.video.paused && this.video.currentTime > 0 && !this.video.ended){
        $(".sub-text").each((index, element) => {
          $(element).removeClass("highlight");
        });
        if(this.track.activeCues && this.track.activeCues.length){
          this.highlight({target: $("#" + this.track.activeCues[0].id.toString()).find(".sub-text")[0]})
        }
      }
    }, 100);
  }
  componentDidMount() {
    this.video = $("video").get(0);
    this.highlightActive();
  }
  setTime(e) {
    const time = this.state.subtitles.filter((item) => {
      return item.id === e.target.id;
    })
    if(!$(e.target).hasClass("fa") && time.length > 0){
      this.video.currentTime = time[0].getSecondsFromString(time[0].startTime);
    }
  }
  render () {
    return (
      <div className = "editor-wrapper">
        <EditorMenu addSubtitleCue={this.addSubtitleCue.bind(this)} save={this.save.bind(this)} subsParse={this.subsParse.bind(this)}/>
        <div className="editor-table">
          <table>
            <thead>
              <tr>
                <th>Start</th>
                <th>End</th>
                <th>Text</th>
              </tr>
            </thead>
            <tbody>
              {
                this.state.subtitles.map((cue) => {
                  return(
                    <tr onClick={this.setTime.bind(this)} key={cue.id} id={cue.id} >
                      <td><input id={cue.id} name="startTime" onChange={this.onSubtitleChange.bind(this)} value={cue.startTime}></input></td>
                      <td><input id={cue.id} name="endTime" onChange={this.onSubtitleChange.bind(this)} value={cue.endTime}></input></td>
                      <td><input className="sub-text" id={cue.id} name="text" onBlur={this.unlighlight} onFocus={this.highlight} onChange={this.onSubtitleChange.bind(this)} value={cue.text}></input></td>
                      <td id={cue.id}><i id={cue.id} onClick={this.deleteSubtitleCue.bind(this)} className="fa fa-times-circle" aria-hidden="true"></i></td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
