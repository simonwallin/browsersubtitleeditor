const Hls = require("hls.js");
const Dash = require("dashjs")

class SourceList {
  constructor(sourceList){
    this.sourceList = sourceList || [];
    this.sourceIndex = 0;
  }
  next() {
    if(this.sourceIndex + 1 >= this.sourceList.length){
      this.sourceIndex = 0;
      return true;
    }
    this.sourceIndex += 1;
    return true;
  }
  previous() {
    if(this.sourceIndex - 1 < 0){
      this.sourceIndex = this.sourceList.length -1;
      return true;
    }
    this.sourceIndex -= 1;
    return true;
  }
}

class Player {
  constructor(elementId, sourceList, config) {
    this.hlsTech = new Hls();
    this.dashTech = Dash.MediaPlayer().create()
    this.videoElement = document.getElementById(elementId);
    this.sourceList = new SourceList(["http://dash.edgesuite.net/envivio/EnvivioDash3/manifest.mpd"]);
    this.config = config || {};
  }
  play() {
    const toPlay = this.sourceList.sourceList[this.sourceList.sourceIndex];
    if(this.getSourceType(toPlay) === "m3u8"){
      this.loadHlsSource(toPlay);
    }else if(this.getSourceType(toPlay) === "mpd"){
      this.loadDashSource(toPlay);
    }else if(this.getSourceType(toPlay) === "mp4" || this.getSourceType(toPlay) === "ogg" || this.getSourceType(toPlay) === "webm"){   // TODO add all suported formats
      this.videoElement.src = toPlay;
    }else{
      this.videoElement.src = toPlay;
    }
    this.videoElement.play();
  }
  pause() {
    this.videoElement.pause()
  }
  load() {

  }
  next() {
    const next = this.sourceList.next();
    if(next) {
      this.play();
    }
  }
  previous() {
    const prev = this.sourceList.previous()
    if(prev) {
      this.play();
    }
  }
  loadHlsSource(src) {
    this.hlsTech.loadSource(src);
    this.hlsTech.attachMedia(this.videoElement);
  }
  loadDashSource(src) {
    this.dashTech.getDebug().setLogToBrowserConsole(false)
    this.dashTech.initialize(this.videoElement, src);
  }
  getSourceType(srcString) {
    return srcString.split(".")[srcString.split(".").length -1];
  }
}
module.exports = Player;
