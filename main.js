const express = require('express')
const app = express()

//Powerdeck
app.get('/powerdeck/', function (req, res) {
  res.json({
    powerdeck: [{
      id: 1,
      name: 'Awesome powerdeck'
    }]
  });
});

app.post('/powerdeck/', function (req, res) {
  res.json({
    id: 1
  });
});

app.post('/powerdeck/:id/edit', function (req, res) {
  res.json({
    id: req.params.id
  });
});

app.delete('/powerdeck/:id', function (req, res) {
  res.json({
    id: req.params.id
  });
});

//Powercards
app.get('/powerdeck/:id/powercard', function (req, res) {
  res.json({
    powercards: [{
      id: 1,
      name: 'Awesome powercard'
    }, {
      id: 2,
      name: 'Another powercard'
    }]
  });
});

app.post('/powercards/:id/powercard', function (req, res) {
  res.json({
    id: 1,
    text: 'What is the sens of life?'
  });
});

app.post('/powerdeck/:id/edit', function (req, res) {
  res.json({
    id: req.params.id
  });
});

app.delete('/powerdeck/:id', function (req, res) {
  res.json({
    id: req.params.id
  });
});

//Answers
app.post('/powerdeck/:id/correct_answer', function (req, res) {
  res.json({
    msg: 'You are smart'
  });
});

app.post('/powercards/:id/incorrect_answer', function (req, res) {
  res.json({
    msg: 'Study more!'
  });
});

app.listen(8000);
