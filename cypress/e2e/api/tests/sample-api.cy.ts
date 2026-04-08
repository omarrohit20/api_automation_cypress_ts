import { verifyResponse, verifyResponseCode, verifyResponseIsSuccessful } from '../../support/assertions';

describe('API Tests', () => {
  it('should get users', () => {
    cy.request('GET', '/users').then((response) => {
      verifyResponseIsSuccessful(response);
      expect(response.body).to.be.an('array');
    });
  });

  it('should create a user', () => {
    cy.request('POST', '/users', { name: 'John', email: 'john@example.com' }).then((response) => {
      verifyResponseCode(response, 201);
      expect(response.body).to.have.property('id');
    });
  });
});