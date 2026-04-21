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

function compareResponseHashes(
  actualHash: unknown,
  expectedHash: unknown,
  path: string = "root"
): void {
 
  // ✅ Skip handling
  if (expectedHash === "skip") {
    return;
  }
 
  // ✅ Primitive values
  if (
    typeof actualHash !== "object" ||
    actualHash === null ||
    typeof expectedHash !== "object" ||
    expectedHash === null
  ) {
    const message = `${path} is wrong! actual: ${actualHash} expected: ${expectedHash}`;
    compareValues(actualHash, expectedHash, message);
    return;
  }
 
  // ✅ Array handling
  if (Array.isArray(actualHash) && Array.isArray(expectedHash)) {
    expect(
      Array.isArray(actualHash),
      `TYPE MISMATCH at ${path}: actual is not an array`
    ).to.be.true;
 
    expect(
      Array.isArray(expectedHash),
      `TYPE MISMATCH at ${path}: expected is not an array`
    ).to.be.true;
 
    const actualArr = actualHash as unknown[];
    const expectedArr = expectedHash as unknown[];
 
    // expect(
    //   actualArr.length,
    //   `ARRAY LENGTH MISMATCH at ${path}`
    // ).to.eql(expectedArr.length);
 
    actualArr.forEach((item, index) => {
      compareResponseHashes(
        item,
        expectedArr[index],
        `${path}[${index}]`
      );
    });
 
    return;
  }
 
  // ✅ Object handling
  const actualObj = actualHash as Record<string, unknown>;
  const expectedObj = expectedHash as Record<string, unknown>;
 
  // 🔴 ASSERT missing keys
  for (const key of Object.keys(expectedObj)) {
    if (!(key in actualObj)) {
      throw new Error(
        `❌ MISSING KEY at ${path}.${key} | expected value: ${JSON.stringify(expectedObj[key])}`
      );
    }
  }
 
  // 🔴 ASSERT unexpected keys
  for (const key of Object.keys(actualObj)) {
    if (!(key in expectedObj)) {
      throw new Error(
        `❌ UNEXPECTED KEY at ${path}.${key} | actual value: ${JSON.stringify(actualObj[key])}`
      );
    }
  }
 
  // ✅ Deep compare
  for (const key of Object.keys(expectedObj)) {
    compareResponseHashes(
      actualObj[key],
      expectedObj[key],
      `${path}.${key}`
    );
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