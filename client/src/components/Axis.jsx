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
    var axisNode = this.refs.axis;
    var node = axisNode.childNodes[0];
    var axis;

    if(this.props.orient === 'left'){
      axis = d3.axisLeft().ticks(5).scale(this.props.scale);
      d3.select(axisNode).append('text').attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 0)
        .attr("x", -200)
        .attr("font-weight", 600)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("GPA");
    }
    else{
      axis = d3.axisBottom().ticks(5).scale(this.props.scale);
      d3.select(axisNode).append('text').attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("y", 495)
        .attr("x", 450)
        .attr("font-weight", 600)
        .attr("dx", ".75em")
        .text("Hours spent studying");
    }
    console.log(node);
    d3.select(node).call(axis);
  }
  render(){
    return <g ref="axis"><g className="axis" transform={this.props.translate} /> </g>
  }
}
