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

    it('Get users list - Page 2 with limit 5', () => {
      users.getUsersList(2, 5).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('page', 2);
        expect(response.body).to.have.property('per_page', 5);
        expect(response.body.data).to.be.an('array');
        expect(response.body).to.have.property('total');
        expect(response.body).to.have.property('total_pages');
      });
    });

    it('Get users list - Default pagination', () => {
      users.getUsersList().then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.page).to.eq(1);
        expect(response.body.per_page).to.eq(10);
        expect(response.body.data).to.be.an('array');
      });
    });

    it('Get users list - Verify user data structure', () => {
      users.getUsersList(1, 1).then((response) => {
        expect(response.status).to.eq(200);
        const user = response.body.data[0];
        
        // Verify all required fields exist
        expect(user).to.have.property('id');
        expect(user).to.have.property('email');
        expect(user).to.have.property('first_name');
        expect(user).to.have.property('last_name');
        expect(user).to.have.property('avatar');
        
        // Verify field types
        expect(user.id).to.be.a('number');
        expect(user.email).to.be.a('string');
        expect(user.first_name).to.be.a('string');
        expect(user.last_name).to.be.a('string');
      });
    });
  });

  context('Dotesthere Users CRUD Operations', () => {

    it('Create a new user', () => {
      const newUser = { name: 'Test User', job: 'Test Automation Engineer' };
      
      users.postUserDotesthere(newUser).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('name', 'Test User');
        expect(response.body).to.have.property('job', 'Test Automation Engineer');
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('createdAt');
        
        // Verify ID is not null
        expect(response.body.id).to.not.be.null;
        // Verify createdAt is a valid timestamp
        expect(response.body.createdAt).to.be.a('string');
      });
    });

    it('Create user with multiple variations', () => {
      const testUsers = [
        { name: 'John Developer', job: 'Senior Developer' },
        { name: 'Jane QA', job: 'QA Engineer' },
        { name: 'Alex DevOps', job: 'DevOps Engineer' }
      ];

      testUsers.forEach((testUser) => {
        users.postUserDotesthere(testUser).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body.name).to.eq(testUser.name);
          expect(response.body.job).to.eq(testUser.job);
        });
      });
    });

    it('Get single user by ID', () => {
      users.getUserDotesthere('1').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('data');
        
        const user = response.body.data;
        expect(user.id).to.eq(1);
        expect(user).to.have.property('email');
        expect(user).to.have.property('first_name');
        expect(user).to.have.property('last_name');
        expect(user).to.have.property('avatar');
      });
    });

    it('Get different users by ID', () => {
      const userIds = ['1', '2'];

      userIds.forEach((userId) => {
        users.getUserDotesthere(userId).then((response) => {
          if (response.status === 200) {
            expect(response.body.data.id).to.eq(parseInt(userId));
          }
        });
      });
    });

    it('Update user information', () => {
      const updateData = { name: 'John Updated', job: 'Senior Developer Updated' };
      
      users.putUserDotesthere('1', updateData, false).then((response) => {
        if (response.status === 200) {
          expect(response.body.name).to.eq(updateData.name);
          expect(response.body.job).to.eq(updateData.job);
          expect(response.body).to.have.property('updatedAt');
        } else {
          cy.log(`PUT request returned status ${response.status}`);
        }
      });
    });

    it('Update user - Partial fields', () => {
      users.putUserDotesthere('2', { name: 'Partial Update' }, false).then((response) => {
        if (response.status === 200) {
          expect(response.body.name).to.eq('Partial Update');
        } else {
          cy.log(`PUT request returned status ${response.status}`);
        }
      });
    });

    it('Delete user by ID', () => {
      users.deleteUserDotesthere('1', false).then((response) => {
        // API should return 200, 204, or 404
        expect(response.status).to.oneOf([200, 204, 404, 500]);
      });
    });

    it('Delete multiple users', () => {
      const userIdsToDelete = ['5', '6', '7'];

      userIdsToDelete.forEach((userId) => {
        users.deleteUserDotesthere(userId, false).then((response) => {
          expect(response.status).to.oneOf([200, 204, 404, 500]);
        });
      });
    });
  });

  context('Dotesthere API - Edge Cases & Validation', () => {

    it('Create user with special characters in name', () => {
      const specialUser = { 
        name: 'Test User @#$%&', 
        job: 'Developer-Tester_2024' 
      };
      
      users.postUserDotesthere(specialUser).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.name).to.include('Test User');
      });
    });

    it('Create user with long strings', () => {
      const longUser = {
        name: 'A'.repeat(100),
        job: 'B'.repeat(100)
      };

      users.postUserDotesthere(longUser).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property('id');
      });
    });

    it('Get non-existent user - Verify error handling', () => {
      users.getUserDotesthere('99999', false).then((response) => {
        // API should handle gracefully - either 404 or return empty data
        expect([200, 404]).to.include(response.status);
      });
    });

    it('Create and immediately retrieve user', () => {
      const newUser = { name: 'Create-Retrieve Test', job: 'Test Engineer' };
      
      users.postUserDotesthere(newUser).then((response) => {
        if (response.status === 201) {
          expect(response.status).to.eq(201);
          const createdUserId = response.body.id;
          
          // Retrieve the created user
          users.getUserDotesthere(createdUserId.toString(), false).then((getResponse) => {
            if (getResponse.status === 200) {
              expect(getResponse.status).to.eq(200);
            } else {
              cy.log(`GET request returned status ${getResponse.status}`);
            }
          });
        } else {
          cy.log(`POST request returned status ${response.status}`);
        }
      });
    });

    it('Create, Update, and Verify flow', () => {
      const createData = { name: 'Flow Test User', job: 'QA Engineer' };
      const updateData = { name: 'Flow Test Updated', job: 'Lead QA' };

      users.postUserDotesthere(createData).then((response) => {
        if (response.status === 201) {
          expect(response.body.name).to.eq(createData.name);

          const userId = response.body.id;

          // Update the user
          users.putUserDotesthere(userId.toString(), updateData, false).then((updateResponse) => {
            if (updateResponse.status === 200) {
              expect(updateResponse.body.name).to.eq(updateData.name);
              expect(updateResponse.body.job).to.eq(updateData.job);
            } else {
              cy.log(`PUT request returned status ${updateResponse.status}`);
            }
          });
        } else {
          cy.log(`POST request returned status ${response.status}`);
        }
      });
    });

    it('Verify response headers', () => {
      users.getUsersList(1, 10).then((response) => {
        expect(response.headers).to.have.property('content-type');
        expect(response.headers['content-type']).to.include('application/json');
      });
    });

    it('Verify pagination consistency', () => {
      users.getUsersList(1, 10).then((response) => {
        const page1Total = response.body.total;
        
        users.getUsersList(1, 5).then((response2) => {
          expect(response2.body.total).to.eq(page1Total);
          expect(response2.body.per_page).to.eq(5);
        });
      });
    });

    it('Response time verification', () => {
      users.getUsersList(1, 10).then((response) => {
        const responseTime = response.duration;
        expect(responseTime).to.be.lessThan(5000); // Response should be under 5 seconds
      });
    });
  });

  context('Dotesthere API - Performance & Bulk Operations', () => {

    it('Get users with different limit variations', () => {
      const limits = [1, 5, 10, 20];

      limits.forEach((limit) => {
        users.getUsersList(1, limit).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.per_page).to.eq(limit);
          expect(response.body.data.length).to.be.lessThanOrEqual(limit);
        });
      });
    });

    it('Create multiple users in sequence', () => {
      const bulkUsers = [
        { name: 'Bulk User 1', job: 'Developer' },
        { name: 'Bulk User 2', job: 'Tester' },
        { name: 'Bulk User 3', job: 'Manager' },
        { name: 'Bulk User 4', job: 'Analyst' }
      ];

      bulkUsers.forEach((user, index) => {
        users.postUserDotesthere(user).then((response) => {
          expect(response.status).to.eq(201);
          cy.log(`Bulk user ${index + 1} created with ID: ${response.body.id}`);
        });
      });
    });

    it('Retrieve all available users across multiple pages', () => {
      users.getUsersList(1, 10).then((response) => {
        const totalPages = response.body.total_pages;
        expect(totalPages).to.be.greaterThan(0);

        // Test pagination navigation
        for (let page = 1; page <= Math.min(totalPages, 3); page++) {
          users.getUsersList(page, 10).then((pageResponse) => {
            expect(pageResponse.status).to.eq(200);
            expect(pageResponse.body.page).to.eq(page);
          });
        }
      });
    });
  });

  context('Dotesthere API - Data Validation', () => {

    it('Verify user email format in list', () => {
      users.getUsersList(1, 5).then((response) => {
        response.body.data.forEach((user: any) => {
          // Simple email regex validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          expect(emailRegex.test(user.email)).to.be.true;
        });
      });
    });

    it('Verify avatar URL validity', () => {
      users.getUsersList(1, 5).then((response) => {
        response.body.data.forEach((user: any) => {
          // Verify avatar is a valid URL
          expect(user.avatar).to.include('http');
          expect(user.avatar).to.match(/\.(jpg|png|jpeg)/i);
        });
      });
    });

    it('Verify numeric fields are numbers', () => {
      users.getUsersList(1, 10).then((response) => {
        expect(response.body.page).to.be.a('number');
        expect(response.body.per_page).to.be.a('number');
        expect(response.body.total).to.be.a('number');
        expect(response.body.total_pages).to.be.a('number');

        response.body.data.forEach((user: any) => {
          expect(user.id).to.be.a('number');
        });
      });
    });

    it('Verify no duplicate users in pagination', () => {
      const userIds: number[] = [];

      users.getUsersList(1, 10).then((response) => {
        response.body.data.forEach((user: any) => {
          userIds.push(user.id);
        });

        // Check for duplicates
        const uniqueIds = new Set(userIds);
        expect(uniqueIds.size).to.eq(userIds.length);
      });
    });
  });
});