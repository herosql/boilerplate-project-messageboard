const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    // Creating a new thread: POST request to /api/threads/{board}
    test('Creating a new thread: POST request to /api/threads/{board}', function(done) {
      chai.request(server)
        .post('/api/threads/test')
        .send({
          text: 'test thread',
          delete_password: 'test'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          done();
        });
    });
    // Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}
    test('Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}', function(done) {
      chai.request(server)
        .get('/api/threads/test')
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          // assert.isAtMost(res.body.length, 10);
          done();
        });
    });

    // Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password
    test('Deleting a thread with the incorrect password: DELETE request to /api/threads/{board}', function(done) {
      chai.request(server)
        .delete('/api/threads/test')
        .send({
          thread_id: 'a365811c63254fffa17ba78805f00b69',
          delete_password: 'wrong_password'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
    });
    // Deleting a thread with the correct password: DELETE request to /api/threads/{board} with a valid delete_password
    test('Deleting a thread with the correct password: DELETE request to /api/threads/{board}', function(done) {
      chai.request(server)
        .delete('/api/threads/test')
        .send({
          thread_id: 'a365811c63254fffa17ba78805f00b69',
          delete_password: 'test'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
    });

    // Reporting a thread: PUT request to /api/threads/{board}
    test('Reporting a thread: PUT request to /api/threads/{board}', function(done) {
      chai.request(server)
        .put('/api/threads/test')
        .send({
          thread_id: 'a365811c63254fffa17ba78805f00b69',
          text:'reported'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'reported');
          done();
        });
    });

    // Creating a new reply: POST request to /api/replies/{board}
    test('Creating a new reply: POST request to /api/replies/{board}', function(done) {
      chai.request(server)
        .post('/api/replies/test')
        .send({
          thread_id: 'a365811c63254fffa17ba78805f00b69',
          text: 'test reply',
          delete_password: 'test'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          done();
        });
    });

  

    // Deleting a reply with the incorrect password: DELETE request to /api/replies/{board} with an invalid delete_password
    test('Deleting a reply with the incorrect password: DELETE request to /api/replies/{board}', function(done) {
      chai.request(server)
        .delete('/api/replies/test')
        .send({
          thread_id: 'a365811c63254fffa17ba78805f00b69',
          reply_id: '52b55a7beaf543d5aec4fffa9aed6259',
          delete_password: 'wrong_password'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
    });

    // Deleting a reply with the correct password: DELETE request to /api/replies/{board} with a valid delete_password
    test('Deleting a reply with the correct password: DELETE request to /api/replies/{board}', function(done) {
      chai.request(server)
        .delete('/api/replies/test')
        .send({
          thread_id: 'a365811c63254fffa17ba78805f00b69',
          reply_id: '52b55a7beaf543d5aec4fffa9aed6259',
          delete_password: 'test'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
    });
    // Reporting a reply: PUT request to /api/replies/{board}
    test('Reporting a reply: PUT request to /api/replies/{board}', function(done) {
      chai.request(server)
        .put('/api/replies/test')
        .send({
          thread_id: 'a365811c63254fffa17ba78805f00b69',
          reply_id: '52b55a7beaf543d5aec4fffa9aed6259',
          text:'text'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'reported');
          done();
        });
    });


      // Viewing a single thread with all replies: GET request to /api/replies/{board}
    test('Viewing a single thread with all replies: GET request to /api/replies/{board}', function(done) {
      chai.request(server)
        .get('/api/replies/test')
        .query({thread_id: 'a365811c63254fffa17ba78805f00b69'})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.property(res.body, 'replies');
          assert.isArray(res.body.replies);
          done();
        });
    });
});
