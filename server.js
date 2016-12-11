const express = require('express');
const fs = require('fs');
const sqlite = require('sql.js');

const filebuffer = fs.readFileSync('./db/cape.sqlite');
const db = new sqlite.Database(filebuffer);
const app = express();

app.set('port', (process.env.PORT || 3001));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'));
}

app.get('/api/getCourses/:subject', (req,res)=>{
  const subject = req.params.subject;
  var result = [];

  var statement = db.prepare('SELECT AVG(enroll) as enroll, subject, course, AVG(studyHoursPerWeek) as studyHoursPerWeek, AVG(avgGPAReceived) as avgGPAReceived, AVG(avgGPAExpected) as avgGPAExpected '
    + 'FROM ucsdcape '
    + 'WHERE cast(avgGPAReceived as integer) != 0 AND subject = :subjectVal '
    + 'GROUP BY subject, course ORDER BY subject ASC, course ASC');

  statement.bind({':subjectVal' : subject});

  while(statement.step())
    result.push(statement.getAsObject());

  res.json(result);
});

app.get('/api/getAllSubjects', (req,res) => {
  var result = [];

  var statement = db.prepare('SELECT AVG(enroll) as enroll, subject, AVG(studyHoursPerWeek) as studyHoursPerWeek, AVG(avgGPAReceived) as avgGPAReceived, AVG(avgGPAExpected) as avgGPAExpected '
    + 'FROM ucsdcape '
    + 'WHERE cast(avgGPAReceived as integer) != 0 AND cast(enroll as integer) != 0 '
    + 'GROUP BY subject '
    + 'ORDER BY subject ASC ');

  while(statement.step())
    result.push(statement.getAsObject());

  res.json(result);
});

app.get('/api/getSubjectList', (req,res) => {

  var result = [];
  var statement = db.prepare('SELECT DISTINCT subject '
    + 'FROM ucsdcape '
    + 'ORDER BY subject ASC');

  while(statement.step())
    result.push(statement.get()[0]);

  res.json(result);

})
app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
