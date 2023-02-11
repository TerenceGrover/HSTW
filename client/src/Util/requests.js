import { DateTime } from "luxon";
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

// retrieves the whole JSON object 
export async function getDateSpecificGlobalData(date, setter) {
  return fetch(`${url}/request?date=${date}`)
    .then((response) => response.json())
    .then((data) => setter(Object.values(data)))
    .catch((err) => err);
}

export async function getDateSpecificIndividualData(alphaCode, date) {
  return fetch(`${url}/request?code=${alphaCode}&date=${date}`)
    .then((response) => response.json())
    .then((data) => JSON.parse(data))
    .catch((err) => err);
}

export async function getDateSpecificIndividualIdx(alphaCode, date, setter) {
  try {
    return fetch(`${url}/idx?code=${alphaCode}&date=${date}`)
    .then((response) => response.json())
    .then((data) => setter(Object.values(data)[0]))
    .catch((err) => err)
  }
  catch {
    return 'No Data for Today'
  }
}

// get the previous day and deals with month and years too.
function getPreviousDay(date){
  const day = date.slice(0,2)
  const month = date.slice(3,5)
  const year = date.slice(6)
  const isoDate = `20${year}-${month}-${day}`;
  const yesterDate = DateTime.fromISO(isoDate).minus({days: 1});
  return(`${yesterDate.day}-${yesterDate.month}-${yesterDate.year}`);
}

export async function helperGetDateSpecificGlobalIdx(date, setter, data = null) {
  // call getDateSpecificGlobalIdx with the passed date. ( NO SETTER )
  let set = false;
  for (let i=0; i<31; i++) {
    let response = await getDateSpecificGlobalIdx(date)
    if (response) {
      set = true;
      setter(Object.values(response)[0])
      break;
    } 
    date = getPreviousDay(date);
  }
  return set ? '' : 'error' 
}


export async function getDateSpecificGlobalIdx(date) {
  return fetch(`${url}/idx?date=${date}`)
    .then((response) => {
      if(response.status.toString()[0] != 2) {
        return null
      }
      return response.json()
    })
    .then((data) => {
      if(data) return data;
      else return null;
    })
    .catch((err) => err);
}

export async function getWorldToday(setter) {
  return fetch(`${url}/today?code=world`)
    .then((response) => response.json())
    .then((data) => setter(data))
    .catch((err) => err);
}

export async function getCountryDetails(alphaCode) {
  return fetch(
    `https://restcountries.com/v3.1/alpha/${alphaCode}?fields=name,flag,capital,currencies,languages,region,capital,demonyms`
  )
    .then((response) => response.json())
    .catch((err) => err);
}

export async function getWorldPop() {
  return fetch(
    'http://api.worldbank.org/v2/population/SP.POP.TOTL/WLD?format=json'
  )
    .then((response) => response.json())
    .then((data) => JSON.parse(data))
    .catch((err) => err);
}

export async function getUserCountry(setter) {
  return fetch('https://ipapi.co/json/')
    .then((response) => response.json())
    .then((data) => setter({country_name : data.country_name, country_code : data.country_code}));
}

export async function getCountrySpecificPastData(country, days, setter) {
  return fetch(`${url}/past?code=${country}&days=${days}`)
    .then((response) => response.json())
    .then(data => {
      data = data.reverse()
      const chartData = {
        labels: data.map((item) => item.date.slice(0, 5)),
        datasets: [
          {
            label: "Happiness Index",
            data: data.map((item) => item.data.global * 10),
            backgroundColor: "rgba(75,192,192,0.4)",
            borderColor: "rgba(75,192,192,1)",
          },
        ],
      }
      setter(chartData);
    })
    .catch(()=> setter(undefined))
}