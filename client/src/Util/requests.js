const url = 'http://127.0.0.1:5000'

// IMPORITNG THE SETTER FUNCTION AS AN ARGUMENT ALLOWS US
// TO SKIP AN AWAIT ALL TOGETHER

// export async function getIdx (setter) {
//   fetch(url)
//   .then(response => response.text())
//   .then(data => setter(data))
// }

export function getCountryDetails(alphaCode) {
  return fetch(`https://restcountries.com/v3.1/alpha/${alphaCode}?fields=name,flag,capital,currencies,languages,region,capital,demonyms`)
  .then(response => response.text())
  .then(data => JSON.parse(data))
  .catch(err => err)
}