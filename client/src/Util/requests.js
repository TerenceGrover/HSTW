const url = 'https://hstwdrop.co';

// IMPORITNG THE SETTER FUNCTION AS AN ARGUMENT ALLOWS US
// TO SKIP AN AWAIT ALL TOGETHER

// export async function getIdx (setter) {
//   fetch(url)
//   .then(response => response.text())
//   .then(data => setter(data))
// }

export async function getTodayIndividualData(alphaCode, setter) {
  return fetch(`${url}/today?code=${alphaCode}`)
    .then((response) => response.json())
    .then((data) => setter(Object.values(data)[0]))
    .catch((err) => err);
}

export async function getDateSpecificGlobalData(date, setter) {
  return fetch(`${url}/request?date=${date}`)
    .then((response) => response.json())
    .then((data) => setter(Object.values(data)))
    .catch((err) => err);
}

export async function getDateSpecificIndividualData(alphaCode, date, setter) {
  return fetch(`${url}/request?code=${alphaCode}&date=${date}`)
    .then((response) => response.json())
    .then((data) => JSON.parse(data))
    .catch((err) => err);
}

export async function getDateSpecificIndividualIdx(alphaCode, date, setter) {
  return fetch(`${url}/idx?code=${alphaCode}&date=${date}`)
    .then((response) => response.json())
    .then((data) => setter(Object.values(data)[0]))
    .catch((err) => err);
}

export async function getDateSpecificGlobalIdx(date, setter) {
  return fetch(`${url}/idx?date=${date}`)
    .then((response) => response.json())
    .then((data) => setter(Object.values(data)[0]))
    .catch((err) => err);
}

export async function getWorldToday(setter) {
  return fetch(`${url}/today?code=world`)
    .then((response) => response.json())
    .then((data) => setter(data))
    .catch((err) => err);
}

export async function getCountryDetails(alphaCode, setter) {
  return fetch(
    `https://restcountries.com/v3.1/alpha/${alphaCode}?fields=name,flag,capital,currencies,languages,region,capital,demonyms`
  )
    .then((response) => response.json())
    .catch((err) => err);
}
