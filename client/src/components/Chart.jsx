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

export default class Chart extends Component {
  constructor(props){
    super(props);
    this.state = {
      data : randomDataSet(),
      capeData : null,
      dropDownOptions: [
      ],
      currentSubject: 'ANAR'
    }
    this.searchSubject = this.searchSubject.bind(this);
    this.returnFromSearch = this.returnFromSearch.bind(this);
    this.selectSubject = this.selectSubject.bind(this);
  }

  returnFromSearch (result){
    const resultWithRndmColor = result.map((entry) => {
      entry.color = randomHue();
      return entry;
    })
    this.setState({
      capeData: resultWithRndmColor
    })
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
      currentSubject: 'All'
    })
  }

  componentDidMount(){
    Query.getSubjectList((result)=>{this.setState({dropDownOptions: result, currentSubject:result[0]})});
    Query.search(this.state.currentSubject, this.returnFromSearch);
  }

  render() {
    const chart = this.state.capeData !== null ? ( <ScatterPlot {...this.state} {...styles}/>) : null;

    const dropDownOptions = this.state.dropDownOptions.map((courses, index) => (
      <option value={courses} key={index}>{courses}</option>
    ))
    return (<div>
        <h1> Results for {this.state.currentSubject} </h1>
          <div className='control'>
            <select style={{display:'inline'}} onChange={(event)=>this.selectSubject(event)}>
              {dropDownOptions}
            </select>
            <button style={{display:'inline'}} onClick={()=>this.overView()}>All Subjects</button>
          </div>
        {chart}
      </div>)
  }
}
