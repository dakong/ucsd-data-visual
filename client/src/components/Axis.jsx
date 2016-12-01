import React, {Component} from 'react';
import * as d3 from 'd3';

export default class Axis extends Component {

  componentDidMount(){
    this.renderAxis();
  }

  componentDidUpdate(){
    this.renderAxis();
  }

  renderAxis(){
    var node = this.refs.axis;
    var axis;

    if(this.props.orient === 'left'){
      axis = d3.axisLeft().ticks(5).scale(this.props.scale);
    }
    else{
      axis = d3.axisBottom().ticks(5).scale(this.props.scale);
    }

    d3.select(node).call(axis);
  }
  render(){
    return <g className="axis" ref="axis" transform={this.props.translate} />
  }
}
