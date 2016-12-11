import React, { Component } from 'react';
import Loader from 'react-loader';
import ScatterPlot from './ScatterPlot';
import Footer from './Footer';
import Query from '../API/SearchApi';
import '../css/ScatterPlot.css';

const styles = {
  width: 750,
  height: 500,
  padding: 50
}
const randomHue = () => 'rgba(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) +',.6)';
const fontSize = 12;
export default class Chart extends Component {
  constructor(props){
    super(props);

    this.state = {
      capeData : null,
      dropDownOptions: [
      ],
      currentSubject: 'all subjects',
      toggleSize: true,
      loaded: false,
      circleRadius: 8,
      radiusConstant: 8,
      tooltipSize: 12
    }

    this.searchSubject    = this.searchSubject.bind(this);
    this.returnFromSearch = this.returnFromSearch.bind(this);
    this.selectSubject    = this.selectSubject.bind(this);
    this.toggleSize       = this.toggleSize.bind(this);
    this.zoomCircles      = this.zoomCircles.bind(this);
    this.scaleTooltip     = this.scaleTooltip.bind(this);
  }

  returnFromSearch (result){
    const resultWithRndmColor = result.map((entry) => {
      entry.color = randomHue();
      return entry;
    })
    this.setState({
      capeData: resultWithRndmColor,
      loaded: true
    })
  }

  searchSubject (subject){
    Query.search(subject, this.returnFromSearch)
  }

  selectSubject(event){
    const option = event.target.value;
    if(option !== 'all'){
      this.searchSubject(event.target.value);
      this.setState({
        currentSubject: event.target.value
      });
    }
    else{
      this.overView();
    }
  }

  overView(){
    Query.searchAllSubjects(this.returnFromSearch);
    this.setState({
      currentSubject: 'all subjects'
    })
  }

  toggleSize(event){
    this.setState({
      toggleSize : event.target.checked
    });
  }

  zoomCircles = (zoomFactor) => {
    const newRadius = (this.state.radiusConstant * zoomFactor);
    this.setState({
      circleRadius: newRadius
    })
  }

  scaleTooltip = (zoomFactor) => {
    const newSize = Math.ceil(fontSize / zoomFactor);
    this.setState({
      tooltipSize: newSize
    })
  }

  componentDidMount(){
    Query.getSubjectList((result)=>{this.setState({dropDownOptions: result})});
    this.overView();
  }

  render() {
    const chart = this.state.capeData !== null ? (<ScatterPlot {...this.state} {...styles} scalePoints={this.zoomCircles} scaleTooltip={this.scaleTooltip}/>) : null;
    const dropDownOptions = this.state.dropDownOptions.map((courses, index) => (
      <option value={courses} key={index}>{courses}</option>
    ));

    return (<div id="page-container">
      <div id="chart-container">
        <h1 id="chart-title"> Results for {this.state.currentSubject} </h1>
          <div className='control'>
            <label><input type="checkbox" onChange={(event)=>this.toggleSize(event)} checked={this.state.toggleSize}/>&nbsp;Show enrollment size</label><br />
            <select onChange={(event)=>this.selectSubject(event)}>
              <option value="all" key="0">All Subjects</option>
              {dropDownOptions}
            </select> <br />
          </div>
        <Loader loaded={this.state.loaded}>
          <h2 className="y-axis-label">GPA</h2>
            {chart}
          <h2 className="x-axis-label">Hours of studying</h2>
        </Loader>
      </div>
      <Footer />
    </div>)
  }
}
