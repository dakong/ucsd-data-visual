import React, { Component } from 'react';


export default class Tooltip extends Component {
  render(){
    return(
      <g>
        <text style={{pointerEvents: 'none', fontSize: 12}}></text>
      </g>
    )
  }
}
