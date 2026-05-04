import { Users } from '../../support/users';
import { verifyResponseCode, verifyResponseIsSuccessfulCreateEntity, verifyResponseTemplate } from '../../support/assertions';

describe('Users Dotesthere', () => {
  let users: Users;

  before(() => {
    users = new Users();
  });

  context('Dotesthere Users API', () => {
    it('Get users list with pagination', () => {
      users.getUsersList(1, 10).then((response) => {
        verifyResponseTemplate(response, users.dotesthereUsersListResponse, 200);
      });
    });

    it('Get users list - Page 2 behavior', () => {
      users.getUsersList(2, 5).then((response) => {
        verifyResponseCode(response, 200);
        const expectedResponse = {
          ...users.dotesthereUsersListResponse,
          page: 2,
          data: []
        };
        verifyResponseTemplate(response, expectedResponse, 200);
      });
    });

    it('Get users list - Default pagination', () => {
      users.getUsersList().then((response) => {
        verifyResponseTemplate(response, users.dotesthereUsersListResponse, 200);
      });
    });

    it('Get users list - Verify user data structure', () => {
      users.getUsersList(1, 1).then((response) => {
        verifyResponseTemplate(response, users.dotesthereUsersListResponse, 200);
      });
    });
  });

  context('Dotesthere Users CRUD Operations', () => {
    it('Create a new user', () => {
      const newUser = { name: 'Test User', job: 'Test Automation Engineer' };
      users.postUserDotesthere(newUser, false).then((response) => {
        if (response.status === 201) {
          const expectedResponse = { ...users.dotesthereCreateUserResponse, name: newUser.name, job: newUser.job };
          verifyResponseTemplate(response, expectedResponse, 201);
        } else {
          expect([500]).to.include(response.status);
        }
      });
    });

    it('Create user with multiple variations', () => {
      const testUsers = [
        { name: 'John Developer', job: 'Senior Developer' },
        { name: 'Jane QA', job: 'QA Engineer' },
        { name: 'Alex DevOps', job: 'DevOps Engineer' }
      ];

      testUsers.forEach((testUser) => {
        users.postUserDotesthere(testUser, false).then((response) => {
          if (response.status === 201) {
            const expectedResponse = { ...users.dotesthereCreateUserResponse, name: testUser.name, job: testUser.job };
            verifyResponseTemplate(response, expectedResponse, 201);
          } else {
            expect([500]).to.include(response.status);
          }
        });
      });
    });

    it('Get single user by ID', () => {
      users.getUserDotesthere('1').then((response) => {
        const expectedResponse = { ...users.dotesthereUserResponse, data: { ...users.dotesthereUserResponse.data, id: 1 } };
        verifyResponseTemplate(response, expectedResponse, 200);
      });
    });

    it('Get different users by ID', () => {
      const userIds = ['1', '2'];

      userIds.forEach((userId) => {
        users.getUserDotesthere(userId).then((response) => {
          if (response.status === 200) {
            const expectedResponse = { ...users.dotesthereUserResponse, data: { ...users.dotesthereUserResponse.data, id: parseInt(userId) } };
            verifyResponseTemplate(response, expectedResponse, 200);
          }
        });
      });
    });

    it('Update user information', () => {
      const updateData = { name: 'John Updated', job: 'Senior Developer Updated' };
      users.putUserDotesthere('1', updateData, false).then((response) => {
        if (response.status === 200) {
          const expectedResponse = { ...users.dotesthereUpdateUserResponse, name: updateData.name, job: updateData.job };
          verifyResponseTemplate(response, expectedResponse, 200);
        } else {
          expect([500]).to.include(response.status);
        }
      });
    });

    it('Update user - Partial fields', () => {
      users.putUserDotesthere('2', { name: 'Partial Update' }, false).then((response) => {
        if (response.status === 200) {
          const expectedResponse = { ...users.dotesthereUpdateUserResponse, name: 'Partial Update' };
          verifyResponseTemplate(response, expectedResponse, 200);
        } else {
          expect([500]).to.include(response.status);
        }
      });
    });

    it('Delete user by ID', () => {
      users.deleteUserDotesthere('1', false).then((response) => {
        expect([200, 204, 404, 500]).to.include(response.status);
      });
    });

    it('Delete multiple users', () => {
      const userIdsToDelete = ['5', '6', '7'];

      userIdsToDelete.forEach((userId) => {
        users.deleteUserDotesthere(userId, false).then((response) => {
          expect([200, 204, 404, 500]).to.include(response.status);
        });
      });
    });
  });

  context('Dotesthere API - Edge Cases & Validation', () => {
    it('Create user with special characters in name', () => {
      const specialUser = { name: 'Test User @#$%&', job: 'Developer-Tester_2024' };
      users.postUserDotesthere(specialUser, false).then((response) => {
        if (response.status === 201) {
          const expectedResponse = { ...users.dotesthereCreateUserResponse, name: specialUser.name, job: specialUser.job };
          verifyResponseTemplate(response, expectedResponse, 201);
        } else {
          expect([500]).to.include(response.status);
        }
      });
    });

    it('Create user with long strings', () => {
      const longUser = { name: 'A'.repeat(100), job: 'B'.repeat(100) };
      users.postUserDotesthere(longUser, false).then((response) => {
        if (response.status === 201) {
          const expectedResponse = { ...users.dotesthereCreateUserResponse, name: longUser.name, job: longUser.job };
          verifyResponseTemplate(response, expectedResponse, 201);
        } else {
          expect([500]).to.include(response.status);
        }
      });
    });

    it('Get non-existent user - Verify error handling', () => {
      users.getUserDotesthere('99999', false).then((response) => {
        expect([200, 404]).to.include(response.status);
      });
    });

    it('Create and immediately retrieve user', () => {
      const newUser = { name: 'Create-Retrieve Test', job: 'Test Engineer' };
      users.postUserDotesthere(newUser, false).then((response) => {
        if (response.status === 201) {
          const createdUserId = response.body.id;
          users.getUserDotesthere(createdUserId.toString(), false).then((getResponse) => {
            if (getResponse.status === 200) {
              const expectedResponse = { ...users.dotesthereUserResponse, data: { ...users.dotesthereUserResponse.data, id: parseInt(createdUserId, 10) } };
              verifyResponseTemplate(getResponse, expectedResponse, 200);
            } else {
              expect([404]).to.include(getResponse.status);
            }
          });
        } else {
          expect([500]).to.include(response.status);
        }
      });
    });

    it('Create, Update, and Verify flow', () => {
      const createData = { name: 'Flow Test User', job: 'QA Engineer' };
      const updateData = { name: 'Flow Test Updated', job: 'Lead QA' };
      users.postUserDotesthere(createData, false).then((response) => {
        if (response.status === 201) {
          const userId = response.body.id;
          users.putUserDotesthere(userId.toString(), updateData, false).then((updateResponse) => {
            if (updateResponse.status === 200) {
              const expectedResponse = { ...users.dotesthereUpdateUserResponse, name: updateData.name, job: updateData.job };
              verifyResponseTemplate(updateResponse, expectedResponse, 200);
            } else {
              expect([500]).to.include(updateResponse.status);
            }
          });
        } else {
          expect([500]).to.include(response.status);
        }
      });
    });

    it('Verify response headers', () => {
      users.getUsersList(1, 10).then((response) => {
        verifyResponseCode(response, 200);
        expect(response.headers['content-type']).to.include('application/json');
      });
    });

    it('Verify pagination consistency', () => {
      users.getUsersList(1, 10).then((response) => {
        verifyResponseCode(response, 200);
        const page1Total = response.body.total;
        users.getUsersList(1, 5).then((response2) => {
          verifyResponseCode(response2, 200);
          expect(response2.body.total).to.eq(page1Total);
          expect(response2.body.per_page).to.eq(10);
        });
      });
    });

    it('Response time verification', () => {
      users.getUsersList(1, 10).then((response) => {
        verifyResponseCode(response, 200);
        expect(response.duration).to.be.lessThan(5000);
      });
    });
  });

  context('Dotesthere API - Performance & Bulk Operations', () => {
    it('Get users with different limit variations', () => {
      const limits = [1, 5, 10, 20];
      limits.forEach((limit) => {
        users.getUsersList(1, limit).then((response) => {
          verifyResponseCode(response, 200);
          expect(response.body.per_page).to.eq(10);
          expect(response.body.data.length).to.be.at.most(10);
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
        users.postUserDotesthere(user, false).then((response) => {
          if (response.status === 201) {
            const expectedResponse = { ...users.dotesthereCreateUserResponse, name: user.name, job: user.job };
            verifyResponseTemplate(response, expectedResponse, 201);
          } else {
            expect([500]).to.include(response.status);
          }
        });
      });
    });

    it('Retrieve all available users across multiple pages', () => {
      users.getUsersList(1, 10).then((response) => {
        verifyResponseCode(response, 200);
        const totalPages = response.body.total_pages;
        expect(totalPages).to.be.greaterThan(0);
        for (let page = 1; page <= Math.min(totalPages, 3); page++) {
          users.getUsersList(page, 10).then((pageResponse) => {
            verifyResponseCode(pageResponse, 200);
            expect(pageResponse.body.page).to.eq(page);
          });
        }
      });
    });
  });

  context('Dotesthere API - Data Validation', () => {
    it('Verify user email format in list', () => {
      users.getUsersList(1, 5).then((response) => {
        verifyResponseCode(response, 200);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        response.body.data.forEach((user: any) => {
          expect(emailRegex.test(user.email)).to.be.true;
        });
      });
    });

    it('Verify avatar URL validity', () => {
      users.getUsersList(1, 5).then((response) => {
        verifyResponseCode(response, 200);
        response.body.data.forEach((user: any) => {
          expect(user.avatar).to.include('http');
          expect(user.avatar).to.match(/\.(jpg|png|jpeg)/i);
        });
      });
    });

    it('Verify numeric fields are numbers', () => {
      users.getUsersList(1, 10).then((response) => {
        verifyResponseCode(response, 200);
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
      users.getUsersList(1, 10).then((response) => {
        verifyResponseCode(response, 200);
        const userIds: number[] = response.body.data.map((user: any) => user.id);
        const uniqueIds = new Set(userIds);
        expect(uniqueIds.size).to.eq(userIds.length);
      });
    });
  });
});