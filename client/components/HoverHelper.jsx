import React from 'react';
const $ = require("jquery");

export default class HoverHelper extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      class: "hidden",
      left: 10,
      top: 10,
    }
  }
  showSelf(e){
    const newState = {
      class: "hoverHelper showing",
      left: this.props.left,
    }
    this.setState(newState);
  }
  hideSelf(e){
    const newState = {
      class: "hoverHelper hidden",
    }
    this.setState(newState);
  }
  render () {
    return (
      <div className={this.state.class} style={{left: this.state.left, top: this.state.top}}>
        <p>{this.props.message}</p>
      </div>
    );
  }
}
