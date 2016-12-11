import React, {Component} from 'react';
import * as d3 from 'd3';


export default class XYAxis extends Component {

  componentDidMount(){
    this.renderAxis();
  }

  componentDidUpdate(){
    this.renderAxis();
  }

  renderAxis(){
    var xAxisNode = this.refs.xAxis.childNodes[0];
    var yAxisNode = this.refs.yAxis.childNodes[0];

    var yAxis = d3.axisLeft().ticks(5).tickPadding(-30).scale(this.props.yScale);
    var xAxis = d3.axisBottom().ticks(10).tickPadding(-30).scale(this.props.xScale);

    d3.select(xAxisNode).call(xAxis);
    d3.select(yAxisNode).call(yAxis);
  }

  render(){
    const xSettings = {
      translate: `translate(0, ${this.props.height})`,
      scale : this.props.xScale,
    }
    const ySettings = {
      translate: `translate(-2, 0)`,
      scale: this.props.yScale,
    }
    return <g className="xy-axis">
      <g ref="xAxis"><g className="axis" transform={xSettings.translate} /> </g>
      <g ref="yAxis"><g className="axis" transform={ySettings.translate} /> </g>

    </g>
  }
}
