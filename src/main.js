const express = require('express');
const app = express();
const multer  = require('multer');

console.log(process.env)

const bodyParser = require('body-parser');
const initDB = require('./initDB');
const upload = multer({ dest: 'uploads/' });
const R = require('ramda');
var ObjectId = require('mongodb').ObjectId;

// Connection URL
const url = 'mongodb://localhost:27017/powercards';
// Use connect method to connect to the Server

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const removeUnderscoreId = item => R.merge(
  R.omit(['_id'], item),
  {
    id: item._id
  }
);

const removeUnderscoreIdFromResult = R.map(removeUnderscoreId);

initDB()
  .then(({ db, powerdecks, powercards }) => {

    //Powerdeck
    //get
    app.get('/powerdeck/', (req, res) => {
      powerdecks.find({}).toArray((err, results) => {
        console.log(results)
        if (err) {
          res.json({
            err
          })
        } else {
          res.json(removeUnderscoreIdFromResult(results));
        }
      })
    });

    const pickPowerdeckData = R.pick(['name', 'isShared', 'creationDate', 'subTitle'])

    //create
    app.post('/powerdeck/', (req, res) => {
      console.log('Creates powerdeck!!!');
      const powerdeckData = pickPowerdeckData(req.body);
      console.log(powerdeckData);
      if (powerdeckData.name) {
        powerdecks.insertOne(powerdeckData, err => {
          if (err) {
            res.json({
              err
            });
          } else {
            res.json(R.merge(
              removeUnderscoreId(powerdeckData),
              {
                cards: 0
              }
            ));
          }
        });
      } else {
        res.json({
          err: 'Incorrect input format'
        });
      }
    });

    //edit
    app.post('/powerdeck/:id', (req, res) => {
      const powerdeckData = pickPowerdeckData(req.body);
      const id = req.params.id;
      powerdecks.findOneAndUpdate({
        _id: new ObjectId(id)
      }, {
        $set: powerdeckData
      }, err => {
        if (err) {
          res.json({
            err
          });
        } else {
          res.json(removeUnderscoreId(powerdeckData));
        }
      })
    });

    //delete
    app.delete('/powerdeck/:id', (req, res) => {
      const id = req.params.id;
      powerdecks.findOneAndDelete({
        _id: new ObjectId(id)
      }, err => {
        if (err) {
          res.json({
            err
          });
        } else {
          res.json({
            success: true
          });
        }
      })
    });

//Powercards
    const pickPowercardData = R.pick(['name', 'subTitle', 'image', 'question', 'answers']);

    //get
    app.get('/powerdeck/:id/powercard', function (req, res) {
      const powerdeckId = req.params.id;
      powercards.find({
        powerdeckId
      }).toArray((err, results) => {
        console.log(results)
        if (err) {
          res.json({
            err
          })
        } else {
          res.json(removeUnderscoreIdFromResult(results));
        }
      })
    });

    //create
    app.post('/powerdeck/:id/powercard', function (req, res) {
      console.log
      const powerdeckId = req.params.id;
      const powercardData = R.merge(
        pickPowercardData(req.body),
        { powerdeckId }
      );

      powercards.insertOne(powercardData, err => {
        if (err) {
          res.json({
            err
          });
        } else {
          powerdecks.findOneAndUpdate({
            _id: new ObjectId(powerdeckId)
          }, {
            $inc: {
              cards: 1
            }
          });

          res.json(removeUnderscoreId(powercardData));
        }
      });
    });

    //edit
    app.post('/powercard/:id', function (req, res) {
      const powercardData = pickPowercardData(req.body);
      const id = req.params.id;
      powercards.findOneAndUpdate({
        _id: new ObjectId(id)
      }, {
        $set: powercardData
      }, err => {
        if (err) {
          res.json({
            err
          });
        } else {
          res.json(removeUnderscoreId(powercardData));
        }
      });
    });

    //delete
    app.delete('/powercard/:id', function (req, res) {
      const id = req.params.id;
      powercards.findOneAndDelete({
        _id: new ObjectId(id)
      }, err => {
        if (err) {
          res.json({
            err
          });
        } else {
          res.json({
            success: true
          });
        }
      });
    });

    // //Answers
    // app.post('/powerdeck/:id/correct_answer', function (req, res) {
    //   res.json({
    //     msg: 'You are smart'
    //   });
    // });
    //
    // app.post('/powercards/:id/incorrect_answer', function (req, res) {
    //   res.json({
    //     msg: 'Study more!'
    //   });
    // });

  });

app.listen(8000);
