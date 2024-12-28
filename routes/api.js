'use strict';

const { text } = require("body-parser");
const req = require("express/lib/request");
const bcrypt = require("bcrypt");
const saltRounds = 13;

module.exports = function (app) {
  var threads = [
    {
      board: 'test',
      text: 'test thread',
      delete_password: '$2b$13$nQWTrLrudfEV7LoFp9HIO.q2F0OCH85OywviN5iBikKltgFCghf5.',
      created_on: new Date(),
      replies: [{
        board: 'test',
        text: 'test reply',
        delete_password: '$2b$13$Uw0GvOk8ub55unWX9p60XePs9m3.N3K7m/VlCQ8290uGtN6u0sp6a',
        created_on: new Date(),
        _id: '52b55a7beaf543d5aec4fffa9aed6259',
        reported: false,
        bumped_on: new Date()
      }],
      _id: 'a365811c63254fffa17ba78805f00b69',
      reported: false,
      bumped_on: new Date()
    }
  ];

  function getId(){
      const { randomUUID } = require('crypto');
      const uuidWithDash = randomUUID();
      return uuidWithDash.replace(/-/g, "");
  }

  app.get('/api/threads/:board', (req, res) => {
    const board = req.params.board;
    const boardThreads = [];
    threads.forEach((thread)=>{
      if(thread.board === board){
         const copiedObject = JSON.parse(JSON.stringify(thread));
        delete copiedObject.delete_password;
        delete copiedObject.reported;
        copiedObject.replies.forEach(element => {
          delete element.delete_password;
          delete element.reported;
       });
       boardThreads.push(copiedObject);
      }
    });
    res.send(boardThreads);
  });

  app.post('/api/threads/:board', (req, res) => {
    const board = req.params.board;
    const text = req.body.text;
    const password = req.body.delete_password;
    const hash = bcrypt.hashSync(password, saltRounds);
    const thread = {
      board:board,
      text:text,
      delete_password:hash,
      created_on:new Date(), 
      replies:[],
      _id:getId(),
      reported:false,
      bumped_on:new Date()
    };
    threads.push(thread);
    res.send(thread);
  });

  app.put('/api/threads/:board', (req, res) => {
    const board = req.params.board;
    const id = req.body.thread_id;
    const text = req.body.text;
    const thread = threads.find((thread)=>{
      return thread.board === board && thread._id === id;
    });
    thread.text = text;
    thread.reported = true;
    res.send('reported');
  });

  app.delete('/api/threads/:board', (req, res) => {
    const board = req.params.board;
    const id = req.body.thread_id;
    const password = req.body.delete_password;
    const thread = threads.find((thread)=>{
      return thread.board === board && thread._id === id;
    });
    const checkPassword = bcrypt.compareSync(password, thread.delete_password);
    if(checkPassword){
      threads = threads.filter(thread => thread.board === board && thread._id === id);
      res.send('success');
    }else{
      res.send('incorrect password');
    }
  });
    
  app.get('/api/replies/:board', (req, res) => {
    const board = req.params.board;
    const threadId = req.query.thread_id;
    let thread = threads.find((t)=>{
      return t._id === threadId;
    });
    const copiedObject = JSON.parse(JSON.stringify(thread));
    delete copiedObject.delete_password;
        delete copiedObject.reported;
    copiedObject.replies.forEach(element => {
      delete element.delete_password;
      delete element.reported;
    });
    res.send(copiedObject);
  });

  app.post('/api/replies/:board', (req, res) => {
    const board = req.params.board;
    const text = req.body.text;
    const password = req.body.delete_password;
    const threadId = req.body.thread_id;
    const hash = bcrypt.hashSync(password, saltRounds);
    const replie = {
      board:board,
      text:text,
      delete_password:hash,
      created_on:new Date(), 
      _id:getId(),
      reported:false,
      bumped_on:new Date()
    };
    const thread = threads.find((t)=>{
      return t._id === threadId;
    });
    thread.bumped_on = replie.created_on;
    thread.replies.push(replie);
    const copiedObject = JSON.parse(JSON.stringify(replie));
    copiedObject.thread_id = threadId;
    res.send(copiedObject);
  });

  app.put('/api/replies/:board', (req, res) => {
    const board = req.params.board;
    const threadId = req.body.thread_id;
    const replyId =  req.body.reply_id;
    // const text = req.body.text;
    const thread = threads.find((t)=>{
      return  t._id === threadId;
    });
    const reply = thread.replies.find((r)=>{return r._id === replyId});
    reply.text = text;
    reply.reported = true;
    res.send('reported');
  });

  app.delete('/api/replies/:board', (req, res) => {
    const board = req.params.board;
    const threadId = req.body.thread_id;
    const replyId = req.body.reply_id;
    const password = req.body.delete_password;
    let thread = threads.find((t)=>{
      return  t._id === threadId;
    });
    const reply = thread.replies.find((r)=>{return r._id === replyId});
    const checkPassword = bcrypt.compareSync(password, reply.delete_password);
    if(checkPassword){
      reply.text = '[deleted]';
      res.send('success');
    }else{
      res.send('incorrect password');
    }
  });

};
