const request = require('request');
const rp = require('request-promise');
const R = require('ramda');
const striptags = require('striptags');

const url = 'https://eolsapi-validate.apps.els-ols.com';

const postData = {
  "username": "eolsadmin",
  "password": "testing1"
};

const options = {
  method: 'post',
  body: postData,
  json: true,
  url: `${url}/login-service/login`
};

const createPowercard = (powerdeckId, powercardData) => {

  const options = {
    method: 'post',
    json: true,
    body: powercardData,
    url: `http://pnie.eu:8000/powerdeck/${powerdeckId}/powercard`
  };

  return rp(options)
    .then(response => {
      console.log('create powercard');
      console.log(response);
    })
};

const getQuestions = token => {
  console.log('Token: ' + token);

  const powerdeckId = '59a1b96fd6028c58061c13f7';
  const topic = 'Nutrition (Elsevier)';

  const payload = ["GD0041"];

  const options = {
    method: 'post',
    json: true,
    body: payload,
    headers: {
      Authorization: `Bearer ${token}`
    },
    url: `${url}/api/recommendation/eaq/isbn/9780323359313/user/0`
  };


  return rp(options)
    .then(response => {
      R.forEach(item => {
        const question = striptags(R.pathOr('', ['qtiData', 'prompt'], item));
        const correctAnswers = R.pathOr([], ['qtiData', 'correctResponse'], item);
        const answers = R.pathOr([], ['qtiData', 'responseChoices'], item);
        const name = R.pathOr('', ['qtiData', 'keyTopic', 0], item);
        const outputAnswers = R.map(key => {
          const rawAnswer = answers[key]
          return {
            question: striptags(rawAnswer),
            isCorrect: R.contains(key, correctAnswers)
          }
        }, R.keys(answers));

        const powercardData = {
          name,
          question,
          answers: outputAnswers
          //powerdeckId
        };

        console.log(powercardData);
        createPowercard(powerdeckId, powercardData);
      }, response);
    })
}

// const getQuestion = ([token, assesmentId]) => {
//   console.log('Token: ' + token);
//   console.log('AssesmentId: ' + assesmentId);
//
//   const options = {
//     method: 'get',
//     json: true,
//     headers: {
//       Authorization: `Bearer ${token}`
//     },
//     url: `${url}/api/eaq/assessment/question/type/eaq/assessment/${assesmentId}`
//   };
//
//   return rp(options)
//     .then(response => {
//       const question = striptags(R.pathOr('', ['qtiData', 'prompt'], response));
//       const correctAnswers = R.pathOr([], ['qtiData', 'correctResponse'], response);
//       const answers = R.pathOr([], ['qtiData', 'responseChoices'], response);
//       const name = R.pathOr('', ['qtiData', 'keyTopic'], response);
//       const outputAnswers = R.map(key => {
//         const rawAnswer = answers[key]
//         return {
//           question: striptags(rawAnswer),
//           isCorrect: R.contains(key, correctAnswers)
//         }
//       }, R.keys(answers));
//
//       const powercardData = {
//         name,
//         question,
//         answers: outputAnswers
//         //powerdeckId
//       };
//
//       console.log(powercardData);
//     })
// }

rp(options)
  .then(body => getQuestions(body.token))

// request.post(`${url}/login-service/login`, {form:{
//   "username": "eolsadmin",
//   "password": "testing1"
// }}, (err, response, body) => {
//   console.log(err);
//   console.log(response);
//   console.log(body);
// });