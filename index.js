const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./database/dbHelpers.js')
const server = express();

server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send('Its Alive!');
});

// protect this route, only authenticated users should see it
server.get('/api/users', (req, res) => {
  db('users')
    .select('id', 'username')
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});


server.post('/api/register', (req, res) => {
  const user = req.body;
  user.password = bcrypt.hashSync(user.password, 16); // 16 is how many times it hashes
  db.insertUser(user)
    .then(ids => {
      res.status(201).json({ id: ids[0] })
    })
    .catch(err => {
      res.status(500).send(err)
    })
})


server.post('/api/login', (req,res) =>{
  //check that username exists and passwords match
  const bodyUser = req.body;
  db.findByUsername(bodyUser)
  .then(user => {
      //username valid, password from client == pw from db
    if(user.length && bcrypt.compareSync(bodyUser.password,users[0].password)){
      res.json({info: 'success'})
    } else {
      res.status(404).json({err: 'invalid password or username'});
    }
  })
  .catch(err => {
    res.status(500).send(err)
  })
});

server.listen(3300, () => console.log('\nrunning on port 3300\n'));
