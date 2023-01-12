const url = 'localhost:5001'

// IMPORITNG THE SETTER FUNCTION AS AN ARGUMENT ALLOWS US
// TO SKIP AN AWAIT ALL TOGETHER

// export async function getIdx (setter) {
//   fetch(url)
//   .then(response => response.text())
//   .then(data => setter(data))
// }

export function getTodayIndividualData(alphaCode) {
  return fetch(`${url}/today?code=${alphaCode}`)
    .then(response => response.json())
    .then(data => JSON.parse(data))
}

export function getDateSpecificIndividualData(alphaCode, date) {
  return fetch(`${url}/request?code=${alphaCode}&date=${date}`)
    .then(response => response.json())
    .then(data => JSON.parse(data))
}

export function getWorldToday() {
  return fetch(`${url}/today?code=world`)
    .then(response => response.json())
    .then(data => JSON.parse(data))
}

export function getCountryDetails(alphaCode) {
  return fetch(`https://restcountries.com/v3.1/alpha/${alphaCode}?fields=name,flag,capital,currencies,languages,region,capital,demonyms`)
    .then(response => response.text())
    .then(data => JSON.parse(data))
    .catch(err => err)
}