process.env.NODE_ENV = 'test';

const app = require('../../app');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp)

//testing as an admin

describe('Documents for admin test', () => {
  let token= '';
  beforeEach('it should return 200 response with a token when loging in with correct credecials', (done) => {
    chai.request(app)
      .post('/api/users/login')
      .send({
        email: "admin@live.com",
        password: "admin"
      })
      .end((err, res) => {
        res.should.have.status(200);
        token = res.body.token;
        done();
      });
  });
  describe('/GET/documents', () => {
    it('it should GET documents while paginate and no not document exist', (done) => {
      chai.request(app)
        .get('/api/documents/')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
  describe('/GET/documents', () => {
    it('it should GET documents while paginate and no not document exist for roles access type', (done) => {
      chai.request(app)
        .get('/api/roles/documents/')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('/GET/documents', () => {
    it('it should 404 response lists documents and non exist for role access type', (done) => {
      chai.request(app)
        .get('/api/roles/documents/')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
  describe('/POST', () => {
    it('should return a 201 response creating a document successfuly', (done) => {
      chai.request(app)
        .post('/api/documents/')
        .set('x-access-token', token)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          title: "Tour to Quebeq",
          content: "Day to remember",
          access: "public",
          userId: 1
        })
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });
  });

  describe('/POST', () => {
    it('should return a 201 response creating a document successfuly', (done) => {
      chai.request(app)
        .post('/api/documents/')
        .set('x-access-token', token)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          title: "Tour Quebeq",
          content: "Day remember",
          access: "admin",
          userId: 1
        })
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });
  });

  describe('/POST', () => {
    it('should return a 403 response while some specified fields are empty', (done) => {
      chai.request(app)
        .post('/api/documents/')
        .set('x-access-token', token)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          title: "Tour to Quebeq",
          content: "Day to remember",
          access: "",
          userId: ""
        })
        .end((err, res) => {
          res.should.have.status(403);
          done();
        });
    });
  });

  describe('/GET/<id>', () => {
    it('it should 400 fetching a document by wrong datatype id', (done) => {
      chai.request(app)
        .get('/api/documents/jmhnvbcc')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  describe('/POST', () => {
    it('should return a 201 response created a document successfully', (done) => {
      chai.request(app)
        .post('/api/documents/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('x-access-token', token)
        .send({
          title: "Sick leave",
          content: "Submit a sick leave form after going to hospital",
          access: "private",
          userId: 1,
        })
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });
  });

  describe('/POST', () => {
    it('should return a 201 response created a document successfully', (done) => {
      chai.request(app)
        .post('/api/documents/')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('x-access-token', token)
        .send({
          title: "December holiday",
          content: "Going to vist children homes in Kampala",
          access: "admin",
          userId: 1,
        })
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });
  });

  describe('/PUT', () => {
    it('should return a 200 response updating a dcument with a document id that exist', (done) => {
      chai.request(app)
        .put('/api/documents/1')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('x-access-token', token)
        .send({
          title: "Fair day",
          content: "Dancing and shouting",
          access: "public",
          UserId: 2,
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/PUT', () => {
    it('should return a 400 response when updating a document using a wrong document id type', (done) => {
      chai.request(app)
        .put('/api/documents/jmnbcvx')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('x-access-token', token)
        .send({
          title: "Fair day",
          content: "Dancing and shouting",
          access: "private",
          UserId: 2,
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  describe('/PUT', () => {
    it('should return a 404 response when updating a document that does not exist', (done) => {
      chai.request(app)
        .put('/api/documents/80')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('x-access-token', token)
        .send({
          title: "Fair day",
          content: "Dancing and shouting",
          access: "private",
          UserId: 1,
        })
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('/GET/<document>', () => {
    it('it should return 200 response and data when retriving a document thaat exist', (done) => {
      chai.request(app)
        .get('/api/documents/3')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('title');
          res.body.should.have.property('content');
          res.body.should.have.property('access');
          done();
        });
    });
  });

  describe('/GET/documents', () => {
    it('it should 200 response and data lists documents and atleast one exist', (done) => {
      chai.request(app)
        .get('/api/documents/')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/GET/documents', () => {
    it('it should 200 response and data listing documents while paginate with a range that exist', (done) => {
      chai.request(app)
        .get('/api/documents/?limit=1&offset=1')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/GET/documents', () => {
    it('it should 404 rensponse when listing documents while paginate with non existing range', (done) => {
      chai.request(app)
        .get('/api/documents/?limit=80&offset=60')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('/GET/documents', () => {
    it('it should return 400 response when documents while paginate using wrong datatype input', (done) => {
      chai.request(app)
        .get('/api/documents/?limit=khjgjf&offset=jhgngcbx')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  describe('/DELETE', () => {
    it('should return a 204 response when deleting a document that exists using correct document id datatype', (done) => {
      chai.request(app)
        .delete('/api/documents/2')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(204);
          done();
        });
    });
  });

  describe('/DELETE', () => {
    it('should return a  400 when deleting a document using wrong datatype', (done) => {
      chai.request(app)
        .delete('/api/documents/ljkhgfbf')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  describe('/DELETE', () => {
    it('should return a 404 response when deleteing document that does not exist', (done) => {
      chai.request(app)
        .delete('/api/documents/2')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });


  describe('/GET/<document>', () => {
    it('it should return 404 when retring a document that does not exist', (done) => {
      chai.request(app)
        .get('/api/documents/2')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
  
  describe('/GET/search/documents/?q={}', () => {
    it('it should 200 response and data when searching a document that exist', (done) => {
      chai.request(app)
        .get('/api/search/documents/?q=Fair%20day')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/api/users/:userId/documents', () => {
    it('it should 404 response when retriving documents for non existing user', (done) => {
      chai.request(app)
        .get('/api/users/2/documents')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  
  describe('/api/users/:userId/documents', () => {
    it('it should 200 response when retriving documents for an existing user', (done) => {
      chai.request(app)
        .get('/api/users/1/documents')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  describe('/api/users/:userId/documents', () => {
    it('it should 200 response when retriving documents for an existing user while paginating', (done) => {
      chai.request(app)
        .get('/api/users/1/documents/?limit=4&offset=0')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/api/users/:userId/documents', () => {
    it('it should 400 response when retriving documents using wrong datatype for user id', (done) => {
      chai.request(app)
        .get('/api/users/jghnfbdd/documents')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
  describe('/api/users/:userId/documents', () => {
    it('it should 400 response when retriving documents using wrong datatype for user id while paginating', (done) => {
      chai.request(app)
        .get('/api/users/jghnfbdd/documents?limit=4&offset=0')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
  describe('/api/users/:userId/documents', () => {
    it('it should 404 response when retriving documents using user id that does not exist while paginating', (done) => {
      chai.request(app)
        .get('/api/users/90/documents?limit=4&offset=0')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
  describe('/DELETE', () => {
    it('should return a 204 response when deleting an existing document with the correct document id datatype', (done) => {
      chai.request(app)
        .delete('/api/documents/1')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(204);
          done();
        });
    });
  });

  describe('/POST', () => {
    it('should return a 201 response creating a document successfuly for roles', (done) => {
      chai.request(app)
        .post('/api/documents/')
        .set('x-access-token', token)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          title: "Tour to Quebeq",
          content: "Day to remember",
          access: "admin",
          userId: 1
        })
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });
  });
  
  describe('/GET/documents', () => {
    it('it should 200 response and data lists documents and atleast one exist for role access type', (done) => {
      chai.request(app)
        .get('/api/roles/documents/')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/GET/documents', () => {
    it('it should 200 response and data listing documents while paginate with a range that exist for roles access type', (done) => {
      chai.request(app)
        .get('/api/roles/documents/?limit=1&offset=0')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/GET/documents', () => {
    it('it should 404 rensponse when listing documents while paginate with non existing range for roles access type', (done) => {
      chai.request(app)
        .get('/api/roles/documents/?limit=80&offset=60')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('/GET/documents', () => {
    it('it should return 400 response when documents while paginate using wrong datatype input for role access type', (done) => {
      chai.request(app)
        .get('/api/roles/documents/?limit=khjgjf&offset=jhgngcbx')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  describe('/GET/search/documents/?q={}', () => {
    it('it should 404 response when searching a document that does not exist', (done) => {
      chai.request(app)
        .get('/api/search/documents/?q=Toolkjj')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
  describe('/GET/search/documents/?q={}', () => {
    it('it should 200 response and data when searching documents that exist while paginating', (done) => {
      chai.request(app)
        .get('/api/search/documents/?q=o&limit=6&offset=0')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  describe('/GET/search/documents/?q={}', () => {
    it('it should 404 response and data when searching documents that does not exist while paginating', (done) => {
      chai.request(app)
        .get('/api/search/documents/?q=topping%20Quebeq&limit=6&offset=0')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
  describe('/GET/search/documents/?q={}', () => {
    it('it should 400response and data when searching documents using incorrect data types for the range', (done) => {
      chai.request(app)
        .get('/api/search/documents/?q=topping%20Quebeq&limit=pl&offset=0')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
});
