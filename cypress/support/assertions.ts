// assertions.ts - Utility functions for API response assertions in Cypress

export function verifyResponse(response: Cypress.Response<any>, expectedResponse: any, expectedResponseCode: number): void {
  verifyResponseCode(response, expectedResponseCode);
  expect(response.body).to.eql(expectedResponse);
}

export function verifyResponseCode(response: Cypress.Response<any>, expectedResponseCode: number): void {
  expect(response.status).to.eq(expectedResponseCode);
}

export function verifyResponseIsSuccessful(response: Cypress.Response<any>): void {
  expect(response.status).to.eq(200);
}

export function verifyResponseIsSuccessfulCreateEntity(response: Cypress.Response<any>): void {
  expect(response.status).to.eq(201);
}

export function verifyResponseMessageEquals(response: any, message: string): void {
  const messageJson = JSON.parse(message);
  expect(response).to.eql(messageJson);
}

export function verifyResponseMessageIncludes(response: any, message: string): void {
  const messageJson = JSON.parse(message);
  expect(response).to.include(messageJson);
}

export function verifyResponseTemplate(response: Cypress.Response<any>, expectedResponse: any, expectedResponseCode: number): void {
  verifyResponseCode(response, expectedResponseCode);
  verifyResponseMatchExpected(response.body, expectedResponse);
}

export function verifyResponseMatchExpected(actualResponse: any, expectedResponse: any): void {
  if (Array.isArray(actualResponse) && Array.isArray(expectedResponse)) {
    actualResponse.forEach((actual, index) => {
      compareResponseHashes(actual, expectedResponse[index]);
    });
    expectedResponse.forEach((expected, index) => {
      compareResponseHashes(actualResponse[index], expected);
    });
  } else {
    compareResponseHashes(actualResponse, expectedResponse);
  }
}

function compareResponseHashes(actualHash: any, expectedHash: any): void {
  if (typeof actualHash === 'object' && actualHash !== null || Array.isArray(actualHash)) {
    try {
      Object.keys(actualHash).forEach(key => {
        try {
          const value = actualHash[key];
          if (typeof value === 'object' && value !== null && expectedHash[key] !== 'skip') {
            compareResponseHashes(value, expectedHash[key]);
          } else if (Array.isArray(value) && Array.isArray(expectedHash[key])) {
            value.forEach((val, index) => {
              compareResponseHashes(val, expectedHash[key][index]);
            });
          } else {
            if (expectedHash.hasOwnProperty(key)) {
              const message = `${key} is wrong! actual: ${value} expected: ${expectedHash[key]}`;
              compareValues(value, expectedHash[key], message);
            } else {
              cy.log(`Warning: ${key} is not expected`);
            }
          }
        } catch (e) {
          if (e instanceof Error && e.message.includes('undefined')) {
            throw new Error(`Haven't found ${key}=${actualHash[key]} in ${expectedHash}`);
          } else {
            throw e;
          }
        }
      });
    } catch (e) {
      if (e instanceof Error && e.message.includes('undefined')) {
        throw new Error(`Haven't found ${expectedHash} in actual`);
      } else {
        throw e;
      }
    }
  } else {
    const message = `actual: ${actualHash} expected: ${expectedHash}`;
    compareValues(actualHash, expectedHash, message);
  }
}

function compareValues(actual: any, expected: any, errorMessage: string): void {
  if (typeof expected === 'string') {
    if (expected.includes('match_regex')) {
      const regexMatch = expected.match(/\/(?<regex>.*)\//);
      if (regexMatch) {
        const regex = new RegExp(regexMatch.groups!.regex);
        expect(actual.toString()).to.match(regex);
      }
    } else if (expected === 'only_digits') {
      expect(actual.toString()).to.match(/\d+/);
    } else if (expected === 'only_chars') {
      expect(actual.toString()).to.match(/[a-zA-Z]/);
    } else if (expected === 'skip') {
      // do nothing
    } else if (expected === 'should_not_be_null') {
      expect(actual).not.to.be.null;
    } else {
      expect(actual).to.eql(expected);
    }
  } else {
    expect(actual).to.eql(expected);
  }
}