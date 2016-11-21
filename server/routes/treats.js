var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/sigma';

router.get('/', function(req, res) {
  console.log('get request');
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }
    client.query('SELECT * FROM treats ORDER BY id', function(err, result) {
      done(); // close the connection.
      // console.log('the client!:', client);
      if(err) {
        console.log('select query error: ', err);
        res.sendStatus(500);
      }
      res.send(result.rows);
    });
  });
});

router.post('/', function(req, res) {
  var newTreat = req.body;
  console.log(newTreat);
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }
    client.query(
      'INSERT INTO treats (name, description, pic) ' +
      'VALUES ($1, $2, $3)',
      [newTreat.name, newTreat.description, newTreat.url],
      function(err, result) {
        done();
        if(err) {
          console.log('insert query error: ', err);
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }
      });
  });
});

router.get('/:id', function(req, res) {
  treatID = req.params.id;
  console.log('treat to search for: ', treatID);
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log('connection error: ', err);
      res.sendStatus(500);
    }
    client.query('SELECT * FROM treats WHERE name= $1',
    [treatID],
    function(err, result) {
      done(); // close the connection.
      // console.log('the client!:', client);
      if(err) {
        console.log('select query error: ', err);
        res.sendStatus(500);
      }
      res.send(result.rows);
      });
    });
});


module.exports = router;
