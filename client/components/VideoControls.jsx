import React from 'react';



export default class VideoControls extends React.Component {
  constructor(props){
    super(props)
    this.state = {

    }
    console.log(this.props)
  }
  render () {
    return (
      <div className="video-controls">
        <button onClick={this.props.parent.play} className="play-pause-btn">Play</button>
      </div>
    );
  }
}
