const express = require('express');
const app = express();
const url = "mongodb+srv://Vesel:Matei10072006@cluster0.7tgj2id.mongodb.net/?retryWrites=true&w=majority";
var MongoClient = require('mongodb').MongoClient;
const mongodb = require('mongodb');
const bodyparser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mongodb = require('mongodb');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}))


app.use(cors());

app.post('/signup',async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    MongoClient.connect(url, function (err, db) {
    if (err)
      throw err;
    var dbo = db.db("todo");
    let hashedPassword = bcrypt.hashSync(password, 10);
    var myobj = { name: username, password: hashedPassword };
    let query = { name: username };
    dbo.collection('users').find(query).toArray((err, result1) => {
      if (err)
        throw err;
      if (result1.length > 0) {
        res.send("name issue");
      }

      else {
        dbo.collection('users').insertOne(myobj, function (err, results) {
          if (err) {
            res.send("Error");
            throw err;

          }
          console.log("1 document inserted ...");
          res.send("/login");
          db.close();

        });
      }
    });

  });
  })

  /*app.post('/login',(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("todo");
      let hashedPassword = bcrypt.hashSync(password,10);
      var myobj = { name: username, password: hashedPassword };
      dbo.collection('users').insertOne(myobj, function(err, results) {
        if (err)
        {
          res.send("Error");
          throw err;
          
        } 
        console.log("1 document inserted ...");
        res.send("/login");
        db.close();
  
      });
    });
  })*/
  app.post('/login',async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        
        var dbo = db.db("todo");
        var query = { name:username };
        dbo.collection("users").find(query).toArray(function(err, result) {
          if (err) throw err;
          if(result.length >=1)
          {
            if(bcrypt.compareSync(password,result[0].password))
            {
                res.send("logged in");
            }
            else
            {
              res.send("password issue");
            }
          }
          else
          {
            res.send("username issue");
          }
          console.log(result);
          db.close();
        });
      });
  })

  app.post('/addList',async (req,res)=>{
    const list = req.body.inputFields;
    const username = req.body.username;
    const title = req.body.title;
    MongoClient.connect(url,(err,db)=>{
      if(err) throw err;
      let dbo = db.db("todo");
      let myobj = {username:username, list:list,title:title};
      dbo.collection('lists').insertOne(myobj,(err,result)=>{
        if(err)
        {
          res.send('error');
          throw err;

        } 
        console.log("list inserted...");
        res.send("inserted")
      })
    })
  })
 
  app.post('/getLists',async (req,res)=>{
    const username = req.body.username;
    MongoClient.connect(url,(err,db)=>{
      if(err) throw err; 
      let dbo = db.db('todo');
      let query= {username:username};
      dbo.collection('lists').find(query).toArray((err,results)=>{
        if(err) throw err;
        console.log(results);
        res.send(results);
      })
    })
  })

  app.post('/deleteList',async (req,res)=>{
    const id = req.body.id;
    MongoClient.connect(url,(err,db)=>{
      if(err) throw err;
      let dbo = db.db('todo');
      let query = {_id:new mongodb.ObjectId(`${id}`)};
      dbo.collection('lists').deleteOne(query,(err,result)=>{
        if (err) throw err;
        console.log("deleted");
        console.log(result);
        res.send('deleted');
      })
      console.log(`ObjectId('${id}')`);
      /*dbo.collection('lists').find(query).toArray((err,results)=>{
        if(err) throw err;
        console.log(results);
        res.send(results);
      })*/
    })
  })
  
  const PORT = 5000;
  app.listen(process.env.PORT || 5000,() =>{
      console.log(`Server started on port ${PORT}...`);
    });