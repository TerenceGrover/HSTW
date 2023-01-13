import { useEffect, useState } from 'react';
import './Individual.css';
import { getCountryDetails, getTodayIndividualData } from '../../Util/requests';

export default function Individual({ geoProps, scrollFunc = () => {}}) {
  const [country, setCountry] = useState();
  const [countryData, setCountryData] = useState();

  useEffect(() => {
    scrollFunc();
  }, [country]);


  function generateColor() {

    const col = countryData.idx
    let colorReturn

    if (col) {

      const colObj = {
        r : (col.global < 0 ? Math.abs(col.global * 25.5) : Math.abs(col.global * 2.5)),
        g : (col.global > 0 ? Math.abs(col.global * 25.5) : Math.abs(col.global * 2.5)),
        b : ((col.M*255) - (col.Nu * 255)) / 5
      }

      const colObj_prev = {
        r : (col.P > col.N ? 6/(col.P  - col.N) : 200) - (col.Nu*255) / 3,
        g : (col.N > col.P ? 6/(col.N  - col.P) : 200) - (col.Nu*255) / 3,
        b : ((col.M*255) - (col.Nu * 255)) / 5
      }
        colorReturn = `rgb(${colObj.r},${colObj.g},${colObj.b})`
      }

    else {
      colorReturn = 'rgb(150,150,150)'
    }

    return colorReturn

  }

  useEffect(() => {
    fetchCountry();
    getTodayIndividualData(geoProps['Alpha-2'], setCountryData)
  }, [geoProps]);

  async function fetchCountry() {
    if (geoProps['Alpha-2'] != 'world') {
      getCountryDetails(geoProps['Alpha-2']).then((response) => {
        setCountry(response)
    })
    } else {
      setCountry({
        flag : '🇺🇳',
        name : {official : 'The World'},
        currencies : [{name : 'Various'}],
        languages : ['Various'],
        region : 'None',
        demonyms : {'eng' : {'m' : 'Beings'}},
        capital : 'Unknown'
      })
    }
  }

  return (
    <>
      {country && countryData ? (
        <div id="indiv-container">
          <div id="indiv-left-container" className="floaty-container">
            <div id="flag-name-container">
              <span id="indiv-flag">{country.flag}</span>
              <span id="indiv-name">{country.name.official}</span>
            </div>
            <div id="country-properties">
              <span>
                <span id="prop-name">Currency</span> :{' '}
                {Object.values(country.currencies)[0]['name']}
              </span>
              <span>
                <span id="prop-name">Languages</span> :{' '}
                {Object.values(country.languages).join(', ')}
              </span>
              <span>
                <span id="prop-name">Continent</span> : {country.region}
              </span>
              <span>
                <span id="prop-name">Demonym</span> :{' '}
                {country.demonyms['eng']['m']}
              </span>
              <span>
                <span id="prop-name">Capital</span> : {country.capital}
              </span>
            </div>
          </div>
          <div id="indiv-right-container">
            <div id="indiv-right-top" className="floaty-container" style={{'backgroundColor' : generateColor()}}>
              <div id='index-display'>
                Today, {country.name.official} has a happiness score of : {countryData.idx ? parseInt(countryData.idx.global * 10) : 'Unknown'}
              </div>
            </div>
            <div id="indiv-right-bottom">
              {countryData
              ?
              <>
              <div id="indiv-main-topics-container">
                <span className='header-bottom'>Most used word in this country : </span>
                <ul id="indiv-main-topics" className="indiv-list">
                  {countryData.topics
                  ?
                    countryData.topics.map(topic =>
                      <li key = {topic[0]}>{topic[0]}</li>
                      )
                  :
                  <span>No Data</span>
                  }
                </ul>
              </div>
              <div id="indiv-headlines-container" className="indiv-list">
                <span className='header-bottom'>What the news look like over ther : </span>
                <ul id="indiv-headlines">
                    {countryData.HL ? countryData.HL.slice(0,3).map(Headline =>
                      <li key = {Headline}>{Headline}</li>
                      ) 
                      : 
                      <span>No Data</span>}
                </ul>
              </div>
              </>
              :
              ''
              }
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
}
