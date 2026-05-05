export interface ApiCall {
  method: string
  url: string
  response: Cypress.Response<any>
}

export let lastApiCall: ApiCall | null = null

export const trackApiCall = (
  method: string,
  url: string,
  response: Cypress.Response<any>
) => {
  lastApiCall = { method, url, response }
}