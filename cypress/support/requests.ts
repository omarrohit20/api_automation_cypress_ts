// requests.ts - Request helpers migrated from Ruby requests.rb

let headersJson = { 'content-type': 'json', accept: 'json' };
let cookies: any = {};
let token: string | undefined;
let authTokenCookie: string | undefined;

export function headersCookiesManager(): { headers: any, cookies: any } {
  let headersToSend = {};
  let cookiesToSend = {};

  if (token) {
    headersToSend = { ...headersToSend, token };
  }
  if (cookies) {
    cookiesToSend = { ...cookiesToSend, ...cookies };
  }

  return { headers: headersToSend, cookies: cookiesToSend };
}

export function sendRequest(method: string, url: string, params: any = {}, customCookies?: any, customHeaders?: any, failOnStatusCode: boolean = true): Cypress.Chainable<Cypress.Response<any>> {
  const { headers: headersToSend, cookies: cookiesToSend } = headersCookiesManager();
  const finalHeaders = customHeaders || headersToSend;
  const finalCookies = customCookies || cookiesToSend;

  const requestOptions: Partial<Cypress.RequestOptions> = {
    method: method as Cypress.HttpMethod,
    url,
    headers: finalHeaders,
    failOnStatusCode: failOnStatusCode,
    ...params
  };

  if (Object.keys(finalCookies).length > 0) {
    // Cypress handles cookies differently, may need to set via cy.setCookie or use intercept
    // For simplicity, assuming headers
  }

  return cy.request(requestOptions).then((response) => {
    // Refresh authToken
    if (response.status === 200 && response.headers['set-cookie'] && response.headers['set-cookie'].includes('authToken')) {
      const cookieHeader = response.headers['set-cookie'];
      const authTokenMatch = cookieHeader.match(/authToken=([^;]+)/);
      if (authTokenMatch) {
        authTokenCookie = authTokenMatch[1];
        // refreshAccessTokenAboutToExpire(); // Implement if needed
      }
    }
    return response;
  });
}

export function sendGetRequest(apiUrl: string, headers?: any, failOnStatusCode: boolean = true): Cypress.Chainable<Cypress.Response<any>> {
  return sendRequest('GET', apiUrl, { failOnStatusCode }, undefined, headers, failOnStatusCode);
}

export function sendPostRequest(apiUrl: string, json?: any, headers?: any, failOnStatusCode: boolean = true): Cypress.Chainable<Cypress.Response<any>> {
  let payload = json;
  if (json && typeof json === 'object') {
    payload = JSON.stringify(json);
  }
  return sendRequest('POST', apiUrl, { body: payload, failOnStatusCode }, undefined, headers, failOnStatusCode);
}

export function sendDeleteRequest(apiUrl: string, failOnStatusCode: boolean = true): Cypress.Chainable<Cypress.Response<any>> {
  return sendRequest('DELETE', apiUrl, { failOnStatusCode }, undefined, undefined, failOnStatusCode);
}

export function sendArchiveRequest(apiUrl: string, json: any, failOnStatusCode: boolean = true): Cypress.Chainable<Cypress.Response<any>> {
  return sendPatchRequest(apiUrl, json, { 'PATCH': 'ARCHIVED' }, failOnStatusCode);
}

export function sendPatchRequest(apiUrl: string, json: any, patchHeader: any = {}, failOnStatusCode: boolean = true): Cypress.Chainable<Cypress.Response<any>> {
  let payload = json;
  if (json && typeof json === 'object') {
    payload = JSON.stringify(json);
  }
  return sendRequest('PATCH', apiUrl, { body: payload, failOnStatusCode }, undefined, patchHeader, failOnStatusCode);
}

export function sendPutRequest(apiUrl: string, json: any, failOnStatusCode: boolean = true): Cypress.Chainable<Cypress.Response<any>> {
  let payload = json;
  if (json && typeof json === 'object') {
    payload = JSON.stringify(json);
  }
  return sendRequest('PUT', apiUrl, { body: payload, failOnStatusCode }, undefined, undefined, failOnStatusCode);
}

export function getFile(apiUrl: string): Cypress.Chainable<Cypress.Response<any>> {
  return sendRequest('GET', apiUrl, {}, undefined, { accept: 'application/octet-stream' });
}

export function printLastRequest(options: any): void {
  console.log('Last request:', options);
}

export function printLastResponse(response: Cypress.Response<any>): void {
  console.log('Last response:', response);
}