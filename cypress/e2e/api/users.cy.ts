import { Users } from '../../support/users';
import { verifyResponseTemplate } from '../../support/assertions';

describe('Users Reqres', { tags: ['users'] }, () => {
  let users: Users;

  before(() => {
    users = new Users();
  });

  context('Users CRUD : parameterized', () => {
    const testData = [
      { name: 'morpheus', job: 'leader' },
      { name: 'name1', job: 'job1' }
    ];

    testData.forEach((testCase) => {
      it.skip(`Add ${testCase.name}, Update and Get`, () => {
        const postUserRequest = { ...users.userPostPayloadRequest, name: testCase.name, job: testCase.job };
        users.postUser(postUserRequest).then((response) => {
          // verifyResponseCode(response, 200);
          // verifyResponse(response, users.userPostResponse);
          const expectedResponse = { ...users.userPostResponse, name: testCase.name, job: testCase.job };
          verifyResponseTemplate(response, expectedResponse, 201); // Assuming 201 for create
        });
      });
    });
  });

  context('Users CRUD : CSV', () => {
    // Hardcoded for simplicity, replace with CSV reading if needed
    const csvData = [
      { name: 'morpheus_dd', job: 'leader_dd' },
      { name: 'name1_dd', job: 'job1_dd' }
    ];

    csvData.forEach((testCase) => {
      it.skip(`Add ${testCase.name}, Update and Get`, { tags: ['wip'] }, () => {
        const postUserRequest = { ...users.userPostPayloadRequest, name: testCase.name, job: testCase.job };
        users.postUser(postUserRequest).then((response) => {
          // verifyResponseCode(response, 200);
          // verifyResponse(response, users.userPostResponse);
          const expectedResponse = { ...users.userPostResponse, name: testCase.name, job: testCase.job };
          verifyResponseTemplate(response, expectedResponse, 201);
        });
      });
    });
  });

  context('Dotesthere Users API', () => {
    
    it('Get users list with pagination', () => {
      users.getUsersList(1, 10).then((response) => {
        
        cy.log(`Users API response received`)
        cy.log(JSON.stringify(response.body, null, 2))

        verifyResponseTemplate(response, users.usersListResponse, 200);
      });
    });
  });
});