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
          title: "guest",
          description: "guest role"
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
          title: "fellow",
          description: "fellow role"
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
          te: "fellow",
          description: "fellow"
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
        .delete('/api/roles/3')
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
        .delete('/api/roles/46')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('/DELETE', () => {
    it('should return a 400 response when deleting role using incoorrect datatype', (done) => {
      chai.request(app)
        .delete('/api/roles/sdjgh')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  describe('/DELETE', () => {
    it('should return a 401 response when deleting a default role admin', (done) => {
      chai.request(app)
        .delete('/api/roles/1')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
  describe('/DELETE', () => {
    it('should return a 401 response when deleting a default role regular', (done) => {
      chai.request(app)
        .delete('/api/roles/2')
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
  describe('/PUT', () => {
    it('should return a 200 response when updating role details', (done) => {
      chai.request(app)
        .put('/api/roles/4')
        .set('x-access-token', token)
        .send({
          title: "facilitator"
        })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
  describe('/PUT', () => {
    it('should return a 400 when updating using wrong time role id', (done) => {
      chai.request(app)
        .put('/api/roles/kjhgf')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('x-access-token', token)
        .send({
          title: "fel"
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
  describe('/PUT', () => {
    it('should return a 401 when updating default roles admin details', (done) => {
      chai.request(app)
        .put('/api/roles/1')
        .set('x-access-token', token)
        .send({
          title: "fello"
        })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
  describe('/PUT', () => {
    it('should return a 401 when updating default role regular details', (done) => {
      chai.request(app)
        .put('/api/roles/2')
        .set('x-access-token', token)
        .send({
          title: "fello"
        })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });
  describe('/PUT', () => {
    it('should return a 400 when updating using role that exists', (done) => {
      chai.request(app)
        .put('/api/roles/4')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('x-access-token', token)
        .send({
          title: "admin"
        })
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
  describe('/PUT', () => {
    it('should return a 404 response when updating role that does not exist', (done) => {
      chai.request(app)
        .put('/api/roles/80')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('x-access-token', token)
        .send({
          title: "fello"
        })
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
  describe('/GET/:id user', () => {
    it('it should return 400 retreving a user using bad request', (done) => {
      chai.request(app)
        .get('/api/users/uy')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });
  describe('/GET/:roleId', () => {
    it('it should return 200 when fetching an existing role by the given id', (done) => {
      chai.request(app)
        .get('/api/roles/4')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('description');
          res.body.should.have.property('title');
          done();
        });
    });
  });
  describe('/GET/:roleId', () => {
    it('it should return 404 when fetching a non existing role by the given id', (done) => {
      chai.request(app)
        .get('/api/roles/90')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });
});
