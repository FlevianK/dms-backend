process.env.NODE_ENV = 'test';

const app = require('../../app');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp)

describe('Roles', () => {
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
  describe('/POST', () => {

    it('should return a 201 response when create guest role', (done) => {
      chai.request(app)
        .post('/api/roles')
        .set('x-access-token', token)
        .send({
          title: "guest"
        })
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });
  });
  describe('/POST', () => {
    it('should return a 201 response create fellow role', (done) => {
      chai.request(app)
        .post('/api/roles')
        .set('x-access-token', token)
        .send({
          title: "fellow"
        })
        .end((err, res) => {
          res.should.have.status(201);
          done();
        });
    });
  });

  describe('/POST', () => {
    it('should return a 400 response create wrong field name', (done) => {
      chai.request(app)
        .post('/api/roles')
        .set('x-access-token', token)
        .send({
          te: "fellow"
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  describe('/GET/ roles', () => {
    it('it should return 200 response and data', (done) => {
      chai.request(app)
        .get('/api/roles')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/GET/ roles while paginating the results', () => {
    it('it should return 200 response and data', (done) => {
      chai.request(app)
        .get('/api/roles/?limit=4&offset=0')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  describe('/GET/ roles while paginating the results by non existing range', () => {
    it('it should return 404 response', (done) => {
      chai.request(app)
        .get('/api/roles/?limit=67&offset=90')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
  describe('/GET/ roles while paginating the results using incorrect data type for the query', () => {
    it('it should return 400 response', (done) => {
      chai.request(app)
        .get('/api/roles/?limit=uy&offset=op')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  describe('/DELETE', () => {
    it('should return a 204 response delete an existing role that is not admin', (done) => {
      chai.request(app)
        .delete('/api/roles/fellow')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(204);
          done();
        });
    });
  });

  describe('/DELETE', () => {
    it('should return a 404 response when deleting a role does not exist', (done) => {
      chai.request(app)
        .delete('/api/roles/fellow')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('/DELETE', () => {
    it('should return a 401 response when deleting an admin role', (done) => {
      chai.request(app)
        .delete('/api/roles/admin')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe('/DELETE', () => {
    it('should return a 401 response when deleting a default role', (done) => {
      chai.request(app)
        .delete('/api/roles/regular')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
  describe('/GET/search/roles/?q={}', () => {
    it('it should GET a role by searching', (done) => {
      chai.request(app)
        .get('/api/search/roles/?q=admin')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/GET/search/roles/?q={}', () => {
    it('it should return 404 searching a role that does not exist', (done) => {
      chai.request(app)
        .get('/api/search/roles/?q=MCA')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
  describe('/GET/search/roles/?q={}', () => {
    it('it should return 200 searching roles who exist while paginating the result ', (done) => {
      chai.request(app)
        .get('/api/search/roles/?q=admin&limit=5&offset=0')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  describe('/GET/search/roles/?q={}', () => {
    it('it should return 400 searching roles who exist while paginating the result using wrong data type ', (done) => {
      chai.request(app)
        .get('/api/search/roles/?q=MCA&limit=jfd&offset=oiu')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
  describe('/GET/search/roles/?q={}', () => {
    it('it should return 404 searching roles who does not exist exist while paginating the result ', (done) => {
      chai.request(app)
        .get('/api/search/roles/?q=MCA&limit=5&offset=0')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});
