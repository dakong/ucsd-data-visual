import React, { Component } from 'react';
import ScatterPlot from './ScatterPlot';
import './ScatterPlot.css';
import Query from './SearchApi';

const numDataPoints = 25;
const styles = {
  width: 750,
  height: 500,
  padding: 30
}
const randomX = () => Math.round(10 * (Math.random() * 30))/10;
const randomY = () => Math.round(10 * (Math.random() * 4))/10;
const randomSize = () => 100 + Math.floor(Math.random() * 300);
const randomHue = () => 'rgba(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) +',.6)';

//TODO Change to an array of objects, and make coordinates an array
const randomDataSet = () => {
  return Array.apply(null, {length: numDataPoints}).map(()=>[randomX(), randomY(), randomSize(), randomHue()]);
}

const calculateStandardDeviation = (dataSet) => {
  const dataSetLength = dataSet.length;
  var mean = dataSet.reduce((a,b) => (a + b.enroll), 0);
  var stdDev = Math.sqrt(dataSet.reduce((a,b) => (a + Math.sqrt(Math.abs(b.enroll - mean))),0)/dataSetLength);
  return stdDev;
}

export default class Chart extends Component {
  constructor(props){
    super(props);
    this.state = {
      capeData : null,
      dropDownOptions: [
      ],
      currentSubject: 'ANAR',
      toggleSize: 'on'
    }
    this.searchSubject = this.searchSubject.bind(this);
    this.returnFromSearch = this.returnFromSearch.bind(this);
    this.selectSubject = this.selectSubject.bind(this);
    this.toggleSize = this.toggleSize.bind(this);
  }

  returnFromSearch (result){
    const resultWithRndmColor = result.map((entry) => {
      entry.color = randomHue();
      return entry;
    })
    this.setState({
      capeData: resultWithRndmColor
    })

    var stddev = calculateStandardDeviation(result);
    //console.log('standard deviation ', stddev);

  }

  searchSubject (subject){
    Query.search(subject, this.returnFromSearch)
  }

  selectSubject(event){
    this.searchSubject(event.target.value);
    this.setState({
      currentSubject: event.target.value
    });
  }

  randomizeDataSet(){
    this.setState({
      data: randomDataSet()
    })
  }

  overView(){
    Query.searchAllSubjects(this.returnFromSearch);
    this.setState({
      currentSubject: 'all subjects'
    })
  }

  toggleSize(){
    if(this.state.toggleSize === 'on'){
      this.setState({toggleSize: 'off'});
    } else{

      this.setState({toggleSize: 'on'});
    }
  }

  componentDidMount(){
    Query.getSubjectList((result)=>{this.setState({dropDownOptions: result, currentSubject:result[0]})});
    Query.search(this.state.currentSubject, this.returnFromSearch);
  }

  render() {
    const chart = this.state.capeData !== null ? ( <ScatterPlot {...this.state} {...styles}/>) : null;
    const dropDownOptions = this.state.dropDownOptions.map((courses, index) => (
      <option value={courses} key={index}>{courses}</option>
    ));

    return (<div id="chart-container">
        <h1 id="chart-title"> Results for {this.state.currentSubject} </h1>
          <div className='control'>
            <label>Show enroll size&nbsp;<input type="checkbox" onClick={()=>this.toggleSize()} /></label> <br />
            <select onChange={(event)=>this.selectSubject(event)}>
              {dropDownOptions}
            </select> <br />
            <button onClick={()=>this.overView()}>All Subjects</button> <br />
          </div>
        {chart}
      </div>)
  }
}
