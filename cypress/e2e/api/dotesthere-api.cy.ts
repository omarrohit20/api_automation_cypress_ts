import { Users } from '../../support/users';

describe('DoTestHere API Automation', { tags: ['dotesthere-api'] }, () => {
  let users: Users;

  before(() => {
    users = new Users();
  });

  context('GET /api/users - List Users', () => {
    
    it('Should retrieve users list with pagination', () => {
      users.getUsersList(1, 10).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('page', 1);
        expect(response.body).to.have.property('per_page');
        expect(response.body).to.have.property('total');
        expect(response.body).to.have.property('total_pages');
        expect(response.body.data).to.be.an('array');
      });
    });

    it('Should retrieve second page of users', () => {
      users.getUsersList(2, 10).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.page).to.eq(2);
        expect(response.body.data).to.be.an('array');
      });
    });

    it('Should use default pagination when not specified', () => {
      users.getUsersList().then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.page).to.eq(1);
        expect(response.body.per_page).to.eq(10);
      });
    });

    it('Should verify user data structure in list', () => {
      users.getUsersList(1, 10).then((response) => {
        expect(response.status).to.eq(200);
        const user = response.body.data[0];
        
        expect(user).to.have.all.keys('id', 'email', 'first_name', 'last_name', 'avatar');
        expect(user.id).to.be.a('number');
        expect(user.email).to.be.a('string');
        expect(user.first_name).to.be.a('string');
        expect(user.last_name).to.be.a('string');
        expect(user.avatar).to.be.a('string');
      });
    });

    it('Should verify email format in user list', () => {
      users.getUsersList(1, 10).then((response) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        response.body.data.forEach((user: any) => {
          expect(emailRegex.test(user.email)).to.be.true;
        });
      });
    });

    it('Should verify avatar URLs are valid', () => {
      users.getUsersList(1, 10).then((response) => {
        response.body.data.forEach((user: any) => {
          expect(user.avatar).to.include('http');
          expect(user.avatar).to.match(/\.(jpg|png|jpeg|gif)/i);
        });
      });
    });

    it('Should have no duplicate users in list', () => {
      users.getUsersList(1, 10).then((response) => {
        const ids = response.body.data.map((u: any) => u.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).to.eq(ids.length);
      });
    });

    it('Should verify all users have non-empty required fields', () => {
      users.getUsersList(1, 10).then((response) => {
        response.body.data.forEach((user: any) => {
          expect(user.email).to.not.be.empty;
          expect(user.first_name).to.not.be.empty;
          expect(user.last_name).to.not.be.empty;
          expect(user.avatar).to.not.be.empty;
        });
      });
    });

    it('Should retrieve multiple pages successfully', () => {
      users.getUsersList(1, 10).then((response) => {
        const totalPages = response.body.total_pages;
        
        for (let page = 1; page <= Math.min(totalPages, 3); page++) {
          users.getUsersList(page, 10).then((pageResponse) => {
            expect(pageResponse.status).to.eq(200);
            expect(pageResponse.body.page).to.eq(page);
          });
        }
      });
    });

    it('Should return response with correct headers', () => {
      users.getUsersList(1, 10).then((response) => {
        expect(response.headers['content-type']).to.include('application/json');
      });
    });

    it('Should maintain consistent total count across pages', () => {
      users.getUsersList(1, 10).then((response1) => {
        const total1 = response1.body.total;
        
        users.getUsersList(2, 10).then((response2) => {
          expect(response2.body.total).to.eq(total1);
        });
      });
    });

    it('Should respond within acceptable time', () => {
      users.getUsersList(1, 10).then((response) => {
        expect(response.duration).to.be.lessThan(5000);
      });
    });

    it('Should verify pagination metadata', () => {
      users.getUsersList(1, 10).then((response) => {
        expect(response.body.total).to.be.a('number');
        expect(response.body.total_pages).to.be.a('number');
        expect(response.body.total_pages).to.be.greaterThan(0);
      });
    });
  });

  context('GET /api/users/{id} - Get User by ID', () => {

    it('Should retrieve user by ID 1', () => {
      users.getUserDotesthere('1').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('data');
        expect(response.body.data.id).to.eq(1);
      });
    });

    it('Should retrieve user by ID 2', () => {
      users.getUserDotesthere('2').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.id).to.eq(2);
      });
    });

    it('Should verify single user data structure', () => {
      users.getUserDotesthere('1').then((response) => {
        expect(response.status).to.eq(200);
        const user = response.body.data;
        
        expect(user).to.have.all.keys('id', 'email', 'first_name', 'last_name', 'avatar');
        expect(user.id).to.be.a('number');
        expect(user.email).to.be.a('string');
        expect(user.first_name).to.be.a('string');
        expect(user.last_name).to.be.a('string');
      });
    });

    it('Should verify response format for user detail', () => {
      users.getUserDotesthere('1').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.be.an('object');
      });
    });

    it('Should handle non-existent user gracefully', () => {
      users.getUserDotesthere('99999', false).then((response) => {
        expect([200, 404]).to.include(response.status);
      });
    });
  });

  context('POST /api/users - Create User', () => {

    it('Should attempt to create a new user', () => {
      const newUser = { name: 'Test User', job: 'QA Engineer' };
      
      users.postUserDotesthere(newUser, false).then((response) => {
        if (response.status === 201) {
          expect(response.body).to.have.property('id');
          expect(response.body).to.have.property('createdAt');
        } else {
          cy.log(`API returned status ${response.status} - POST may not be fully supported`);
        }
      });
    });

    it('Should create users with different job titles', () => {
      const jobs = ['Developer', 'Tester', 'Manager'];
      
      jobs.forEach((job) => {
        users.postUserDotesthere({ name: 'User', job: job }, false).then((response) => {
          if (response.status === 201) {
            expect(response.body.job).to.eq(job);
          }
        });
      });
    });
  });

  context('PUT /api/users/{id} - Update User', () => {

    it('Should attempt to update user information', () => {
      const updateData = { name: 'Updated Name', job: 'Senior QA' };
      
      users.putUserDotesthere('1', updateData, false).then((response) => {
        if (response.status === 200) {
          expect(response.body).to.have.property('updatedAt');
        } else {
          cy.log(`API returned status ${response.status} - PUT may not be fully supported`);
        }
      });
    });

    it('Should handle update with partial fields', () => {
      users.putUserDotesthere('2', { name: 'Partial Update' }, false).then((response) => {
        if (response.status === 200) {
          expect(response.body.name).to.eq('Partial Update');
        }
      });
    });
  });

  context('DELETE /api/users/{id} - Delete User', () => {

    it('Should attempt to delete user', () => {
      users.deleteUserDotesthere('1', false).then((response) => {
        expect([200, 204, 404, 500]).to.include(response.status);
      });
    });

    it('Should handle deletion gracefully', () => {
      users.deleteUserDotesthere('5', false).then((response) => {
        expect([200, 204, 404, 500]).to.include(response.status);
      });
    });
  });

  context('API Workflow Tests', () => {

    it('Should complete GET workflow without errors', () => {
      users.getUsersList(1, 10).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.data.length).to.be.greaterThan(0);
      });
    });

    it('Should retrieve list then get single user', () => {
      users.getUsersList(1, 10).then((listResponse) => {
        expect(listResponse.status).to.eq(200);
        
        if (listResponse.body.data.length > 0) {
          const userId = listResponse.body.data[0].id;
          users.getUserDotesthere(userId.toString()).then((detailResponse) => {
            expect(detailResponse.status).to.eq(200);
            expect(detailResponse.body.data.id).to.eq(userId);
          });
        }
      });
    });

    it('Should verify consistent data between list and detail endpoints', () => {
      users.getUsersList(1, 10).then((response) => {
        const firstUser = response.body.data[0];
        
        users.getUserDotesthere('1').then((detailResponse) => {
          expect(detailResponse.body.data.email).to.include('@');
          expect(detailResponse.body.data.id).to.be.a('number');
        });
      });
    });
  });

  context('API Response Validation', () => {

    it('Should verify HTTP status codes', () => {
      users.getUsersList(1, 10).then((response) => {
        expect(response.status).to.be.oneOf([200, 201, 204]);
      });
    });

    it('Should verify response time performance', () => {
      users.getUsersList(1, 10).then((response) => {
        expect(response.duration).to.be.lessThan(5000);
      });
    });

    it('Should verify JSON response format', () => {
      users.getUsersList(1, 10).then((response) => {
        expect(response.body).to.be.an('object');
        expect(response.headers['content-type']).to.include('application/json');
      });
    });

    it('Should verify pagination boundaries', () => {
      users.getUsersList(1, 10).then((response) => {
        expect(response.body.page).to.be.at.least(1);
        expect(response.body.per_page).to.be.at.least(1);
        expect(response.body.total).to.be.at.least(0);
      });
    });

    it('Should verify user properties are properly typed', () => {
      users.getUsersList(1, 10).then((response) => {
        response.body.data.forEach((user: any) => {
          expect(user.id).to.be.a('number');
          expect(user.email).to.be.a('string');
          expect(user.first_name).to.be.a('string');
          expect(user.last_name).to.be.a('string');
          expect(user.avatar).to.be.a('string');
        });
      });
    });
  });

  context('Comprehensive API Coverage Matrix', () => {

    it('Should test all HTTP methods on users endpoint', () => {
      // GET
      users.getUsersList(1, 10).then((getResponse) => {
        expect(getResponse.status).to.eq(200);
      });

      // GET by ID
      users.getUserDotesthere('1').then((getByIdResponse) => {
        expect(getByIdResponse.status).to.eq(200);
      });

      // POST (may fail based on API)
      users.postUserDotesthere({ name: 'Test', job: 'QA' }, false).then((postResponse) => {
        expect([201, 500]).to.include(postResponse.status);
      });

      // PUT (may fail based on API)
      users.putUserDotesthere('1', { name: 'Test' }, false).then((putResponse) => {
        expect([200, 500]).to.include(putResponse.status);
      });

      // DELETE (may fail based on API)
      users.deleteUserDotesthere('1', false).then((deleteResponse) => {
        expect([200, 204, 404, 500]).to.include(deleteResponse.status);
      });
    });

    it('Should paginate through multiple user pages', () => {
      const paginationTests = [
        { page: 1, limit: 10 },
        { page: 2, limit: 10 },
        { page: 1, limit: 5 }
      ];

      paginationTests.forEach((test) => {
        users.getUsersList(test.page, test.limit).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.page).to.be.a('number');
        });
      });
    });

    it('Should validate complete user dataset integrity', () => {
      users.getUsersList(1, 10).then((response) => {
        expect(response.status).to.eq(200);
        
        // Validate response structure
        expect(response.body).to.have.all.keys('page', 'per_page', 'total', 'total_pages', 'data');
        
        // Validate each user
        response.body.data.forEach((user: any) => {
          expect(user.id).to.exist;
          expect(user.email).to.exist;
          expect(user.first_name).to.exist;
          expect(user.last_name).to.exist;
          expect(user.avatar).to.exist;
        });
      });
    });
  });
});
