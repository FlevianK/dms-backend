const app = require('../../app');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

process.env.NODE_ENV = 'test';

// testing as regular user

describe('Documents for regular test', () => {
  let token = '';
  beforeEach('it should return 200 response with a token when loging in with correct credecials', (done) => {
    chai.request(app)
      .post('/api/users/login')
      .send({
        email: "regular@gmail.com",
        password: "regular"
      })
      .end((err, res) => {
        res.should.have.status(200);
        token = res.body.token;
        done();
      });
  });
  describe('/GET/documents', () => {
    it('it should return 404 response when listing documents and non exists', (done) => {
      chai.request(app)
        .get('/api/documents/')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
  describe('/POST', () => {
    it('should return a 201 response', (done) => {
      chai.request(app)
        .post('/api/documents/')
        .set('x-access-token', token)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({
          title: "Tour to Quebeq",
          content: "Day to remember",
          access: "public",
        })
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });
  });

  describe('/GET', () => {
    it('it should 200 response and data when listng all documents and atleast one exist', (done) => {
      chai.request(app)
        .get('/api/documents/')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/GET', () => {
    it('it should 200 response when listng documents while paginate using an existing range ', (done) => {
      chai.request(app)
        .get('/api/documents/?limit=1&offset=0')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/GET/documents', () => {
    it('it should return 404 listing documents while paginate range does not exist', (done) => {
      chai.request(app)
        .get('/api/documents/?limit=8&offset=9')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('/GET/documents', () => {
    it('it should return 400 response when listing documents while paginate using wrong datatype input', (done) => {
      chai.request(app)
        .get('/api/documents/?limit=khjgjf&offset=jhgngcbx')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });


  describe('/api/users/:userId/documents', () => {
    it('it should GET a documents using wrong datatype for user id', (done) => {
      chai.request(app)
        .get('/api/users/jghnfbdd/documents')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  describe('/GET/search/documents/?q={}', () => {
    it('it should 200 response and data when searching a document that exist', (done) => {
      chai.request(app)
        .get('/api/search/documents/?q=Tour%20to%20Quebeq')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  describe('/GET/search/documents/?q={}', () => {
    it('it should 200 response and data when searching documents that exist while paginating', (done) => {
      chai.request(app)
        .get('/api/search/documents/?q=Tour%20to%20Quebeq&limit=6&offset=0')
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
  describe('/GET/ roles by non admin', () => {
    it('it should return 401 response for unauthorization', (done) => {
      chai.request(app)
        .get('/api/roles')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

});
