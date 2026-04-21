// users.ts - Users API wrapper migrated from Ruby users.rb

import { convertToJson } from './common';
import { sendPostRequest, sendGetRequest, sendPutRequest, sendPatchRequest, sendDeleteRequest } from './requests';

declare const cy: Cypress.cy;

export class Users {
  public userPostPayloadRequest: any;
  public userPostResponse: any;
  public userGetResponse: any;
  public usersListResponse: any;

  constructor() {
    this.initVariables();
  }

  usersUrl(): string {
    return Cypress.env('reqres_host') + '/api/users';
  }

  dotesthereUsersUrl(): string {
    return Cypress.env('dotesthere_host') + '/api/users';
  }

  postUser(user: any): Cypress.Chainable<Cypress.Response<any>> {
    return sendPostRequest(this.usersUrl(), user);
  }

  getUser(id: string): Cypress.Chainable<Cypress.Response<any>> {
    return sendGetRequest(this.usersUrl() + `/${id}`);
  }

  putUser(id: string, user: any): Cypress.Chainable<Cypress.Response<any>> {
    return sendPutRequest(this.usersUrl() + `/${id}`, user);
  }

  patchUser(id: string, user: any): Cypress.Chainable<Cypress.Response<any>> {
    return sendPatchRequest(this.usersUrl() + `/${id}`, user);
  }

  deleteUser(id: string): Cypress.Chainable<Cypress.Response<any>> {
    return sendDeleteRequest(this.usersUrl() + `/${id}`);
  }

  getUsersList(page: number = 1, limit: number = 10): Cypress.Chainable<Cypress.Response<any>> {
    return sendGetRequest(`${this.dotesthereUsersUrl()}?page=${page}&limit=${limit}`);
  }

  private initVariables(): void {
    this.userPostPayloadRequest = convertToJson('{\n      "name": "",\n      "job": ""\n    }');

    this.userPostResponse = convertToJson('{\n      "name": "",\n      "job": "",\n      "id": "should_not_be_null",\n      "createdAt": "skip"\n    }');

    this.userGetResponse = convertToJson('{\n      "data": {\n        "id": "should_not_be_null",\n        "email": "janet.weaver@reqres.in",\n        "first_name": "Janet",\n        "last_name": "Weaver",\n        "avatar": "https://reqres.in/img/faces/2-image.jpg"\n      },\n      "support": {\n        "url": "https://reqres.in/#support-heading",\n        "text": "To keep ReqRes free, contributions towards server costs are appreciated!"\n      }\n    }');

    this.usersListResponse = convertToJson('{\n      "page": 1,\n      "per_page": 10,\n      "total": "should_not_be_null",\n      "total_pages": "should_not_be_null",\n      "data": [\n        {\n          "id": "should_not_be_null",\n          "email": "match_regex",\n          "first_name": "only_chars",\n          "last_name": "only_chars",\n          "avatar": "should_not_be_null"\n        }\n      ]\n    }');
  }
}