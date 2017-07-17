process.env.NODE_ENV = 'test';

const app = require('../../app');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp)

describe('App', () => {
  it('should return 403 status for access denial', (done) => {
    chai.request(app)
      .get('/api/users/login/l')
      .end((err, res) => {
        res.should.have.status(403);
        done();
      });
  });
});
