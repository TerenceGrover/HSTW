import { useEffect, useState } from 'react';
import './Individual.css';
import { getCountryDetails, getTodayIndividualData } from '../../Util/requests';

export default function Individual({ geoProps, scrollFunc = () => {}}) {
  const [country, setCountry] = useState();
  const [countryData, setCountryData] = useState();

  useEffect(() => {
    scrollFunc();
  }, [country]);

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
        region : 'Milky Way',
        demonyms : {'eng' : {'m' : 'Living Beings'}},
        capital : 'Unknown'
      })
    }
  }

  return (
    <>
      {country ? (
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
            <div id="indiv-right-top" className="floaty-container"></div>
            <div id="indiv-right-bottom">
              <div id="indiv-main-topics-container">
                <span>Main Topics:</span>
                <ul id="indiv-main-topics" className="indiv-list">
                  {countryData && countryData.topics
                  ?
                    countryData.topics.map(topic =>
                      <li key = {topic[0]}>{topic[0]}</li>
                      )
                  :
                  ''
                  }
                </ul>
              </div>
              <div id="indiv-headlines-container" className="indiv-list">
                <span>Headlines:</span>
                <ul id="indiv-headlines">
                  {countryData && countryData.HL
                  ?
                    countryData.HL.slice(0,4).map(Headline =>
                      <li key = {Headline}>{Headline}</li>
                      )
                  :
                  ''
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
}
