import { useEffect, useState } from 'react';
import './Individual.css';
import { getCountryDetails, getTodayIndividualData } from '../../Util/requests';

export default function Individual({ geoProps, scrollFunc = () => {} }) {
  const [country, setCountry] = useState();
  const [countryData, setCountryData] = useState();

  useEffect(() => {
    scrollFunc();
  }, [country]);

  function generateColor(code, currentState = undefined) {
    const col = countryData.idx;
    let colorReturn;

    if (col) {

      const colObj = {
        r:
          col.global < 0
            ? Math.abs(col.global) * 50 + 25 + col.N
            : 1 / Math.abs(col.global),
        g:
          col.global > 0
            ? Math.abs(col.global) * 50 + 25 + col.P
            : 1 / Math.abs(col.global),
        b: Math.abs(col.M * 255 - col.Nu * 255) / 10,
      };

      if (currentState === 'hover') {
        colorReturn = `rgb(${colObj.r + 50},${colObj.g + 50},${colObj.b + 50})`;
      } else if (currentState === 'click') {
        colorReturn = `rgb(${colObj.r + 100},${colObj.g + 100},${
          colObj.b + 100
        })`;
      } else {
        colorReturn = `rgb(${colObj.r},${colObj.g},${colObj.b})`;
      }

    } else {
      return 'rgb(120,120,120)';
    }

    if (col.global > 1 || col.global < -1) {
      return colorReturn;
      }
    else {
      return 'rgb(200,200,0)'
    }
  }

  useEffect(() => {
    if (geoProps['Alpha-2']) {
      fetchCountry();
      getTodayIndividualData(geoProps['Alpha-2'], setCountryData);
    }
  }, [geoProps]);

  async function fetchCountry() {
    if (geoProps['Alpha-2'] !== 'world') {
      getCountryDetails(geoProps['Alpha-2']).then((response) => {
        setCountry(response);
      });
    } else {
      setCountry({
        flag: '🇺🇳',
        name: { official: 'The World' },
        currencies: [{ name: 'Various' }],
        languages: ['Various'],
        region: 'None',
        demonyms: { eng: { m: 'Beings' } },
        capital: 'Unknown',
      });
    }
  }

  return (
    <>
      {country && country.name && countryData ? (
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
            <div
              id="indiv-right-top"
              className="floaty-container"
              style={{ backgroundColor: generateColor() }}
            >
              <div id="index-display">
                Today, {country.name.official} has a happiness score of :{' '}
                {countryData.idx
                  ? parseInt(countryData.idx.global * 10)
                  : 'Unknown'}
              </div>
            </div>
            <div id="indiv-right-bottom">
              {countryData ? (
                <>
                  <div id="indiv-main-topics-container">
                    <span className="header-bottom">
                      Most used word in this country :{' '}
                    </span>
                    <ul id="indiv-main-topics" className="indiv-list">
                      {countryData.topics ? (
                        countryData.topics.map((topic) => (
                          <li key={topic[0]}>{topic[0]}</li>
                        ))
                      ) : (
                        <span>No Data</span>
                      )}
                    </ul>
                  </div>
                  <div id="indiv-headlines-container" className="indiv-list">
                    <span className="header-bottom">
                      What the news look like over ther :{' '}
                    </span>
                    <ul id="indiv-headlines">
                      {countryData.HL ? (
                        countryData.HL.slice(0, 3).map((Headline) => (
                          <li key={Headline}>{Headline}</li>
                        ))
                      ) : (
                        <span>No Data</span>
                      )}
                    </ul>
                  </div>
                </>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  );
}
