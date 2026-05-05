// users.ts - Users API wrapper migrated from Ruby users.rb

import { convertToJson } from './common';
import { sendPostRequest, sendGetRequest, sendPutRequest, sendPatchRequest, sendDeleteRequest } from './requests';

declare const cy: Cypress.cy;

export class Users {
  public userPostPayloadRequest: any;
  public userPostResponse: any;
  public userGetResponse: any;
  public usersListResponse: any;
  public dotesthereUsersListResponse: any;
  public dotesthereUserResponse: any;
  public dotesthereCreateUserResponse: any;
  public dotesthereUpdateUserResponse: any;

  constructor() {
    this.initVariables();
  }

  dotesthereUsersUrl(): string {
    return Cypress.env('dotesthere_host') + '/api/users';
  }

  getUsersList(page: number = 1, limit: number = 10): Cypress.Chainable<Cypress.Response<any>> {
    return sendGetRequest(`${this.dotesthereUsersUrl()}?page=${page}&limit=${limit}`);
  }

  postUserDotesthere(user: any, failOnStatusCode: boolean = true): Cypress.Chainable<Cypress.Response<any>> {
    return sendPostRequest(this.dotesthereUsersUrl(), user, undefined, failOnStatusCode);
  }

  getUserDotesthere(id: string, failOnStatusCode: boolean = true): Cypress.Chainable<Cypress.Response<any>> {
    return sendGetRequest(`${this.dotesthereUsersUrl()}/${id}`, undefined, failOnStatusCode);
  }

  putUserDotesthere(id: string, user: any, failOnStatusCode: boolean = true): Cypress.Chainable<Cypress.Response<any>> {
    return sendPutRequest(`${this.dotesthereUsersUrl()}/${id}`, user, failOnStatusCode);
  }

  deleteUserDotesthere(id: string, failOnStatusCode: boolean = true): Cypress.Chainable<Cypress.Response<any>> {
    return sendDeleteRequest(`${this.dotesthereUsersUrl()}/${id}`, failOnStatusCode);
  }

  private initVariables(): void {
    this.userPostPayloadRequest = convertToJson('{\n      "name": "",\n      "job": ""\n    }');

    this.userPostResponse = convertToJson('{\n      "name": "",\n      "job": "",\n      "id": "should_not_be_null",\n      "createdAt": "skip"\n    }');

    this.userGetResponse = convertToJson('{\n      "data": {\n        "id": "should_not_be_null",\n        "email": "janet.weaver@reqres.in",\n        "first_name": "Janet",\n        "last_name": "Weaver",\n        "avatar": "https://reqres.in/img/faces/2-image.jpg"\n      },\n      "support": {\n        "url": "https://reqres.in/#support-heading",\n        "text": "To keep ReqRes free, contributions towards server costs are appreciated!"\n      }\n    }');

    this.usersListResponse = convertToJson(`{
      "page": 1,
      "per_page": 10,
      "total": "should_not_be_null",
      "total_pages": "should_not_be_null",
      "data": [
        {
          "id": "should_not_be_null",
          "email": "match_regex:/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/",
          "first_name": "only_chars",
          "last_name": "only_chars",
          "avatar": "match_regex:/^https?:\\/\\/.*\\.(jpg|png|jpeg|gif)$/"
        }
      ]
    }`);

    this.dotesthereUsersListResponse = {
      page: 1,
      per_page: 10,
      total: 'should_not_be_null',
      total_pages: 'should_not_be_null',
      data: [
        {
          id: 'should_not_be_null',
          email: 'match_regex:/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/',
          first_name: 'only_chars',
          last_name: 'only_chars',
          avatar: 'match_regex:/^https?:\\/\\/.*\\.(jpg|png|jpeg|gif)$/'
        }
      ]
    };

    this.dotesthereUserResponse = {
      data: {
        id: 'should_not_be_null',
        email: 'match_regex:/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/',
        first_name: 'only_chars',
        last_name: 'only_chars',
        avatar: 'match_regex:/^https?:\\/\\/.*\\.(jpg|png|jpeg|gif)$/'
      }
    };

    this.dotesthereCreateUserResponse = {
      name: '',
      job: '',
      id: 'should_not_be_null',
      createdAt: 'skip'
    };

    this.dotesthereUpdateUserResponse = {
      name: '',
      job: '',
      updatedAt: 'skip'
    };
  }
}