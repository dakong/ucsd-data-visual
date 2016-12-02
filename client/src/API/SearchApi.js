function search(query, cb){
  return fetch(`/api/getCourses/${query}`, {
    method: 'get',
    accept: 'application/json'
  }).then(checkStatus)
    .then(parseJson)
    .then(cb);
}

function searchAllSubjects(cb){
  return fetch('/api/getAllSubjects',{
    method: 'get',
    accept: 'application/json'
  }).then(checkStatus)
    .then(parseJson)
    .then(cb);
}

function getSubjectList(cb){
  return fetch('/api/getSubjectList', {
    method: 'get',
    accept: 'application/json'
  }).then(checkStatus)
    .then(parseJson)
    .then(cb);
}

function checkStatus(response){
  if(response.status === 200){
    return response;
  }
  else{
    console.log('there was an error processing the request');
  }
}

function parseJson(response){
  return response.json()
}

const SearchApi = { search, searchAllSubjects, getSubjectList};

export default SearchApi;
