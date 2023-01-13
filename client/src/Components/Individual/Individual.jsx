import { useEffect, useState, useRef } from 'react';
import './Individual.css';
import { getCountryDetails } from '../../Util/requests';

export default function Individual({ geoProps, scrollFunc }) {
  const [country, setCountry] = useState();

  useEffect(() => {
    scrollFunc();
    console.log(country);
  }, [country]);

  useEffect(() => {
    fetchCountry(setCountry);
  }, [geoProps]);

  async function fetchCountry(setter) {
    getCountryDetails(geoProps['Alpha-2']).then((response) => {
      setter(response);
      console.log(response);
    });
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
                  <li>Lorem Ipsum Dolor e tutti quanti</li>
                  <li>Lorem Ipsum Dolor e tutti quanti</li>
                </ul>
              </div>
              <div id="indiv-headlines-container" className="indiv-list">
                <span>Headlines:</span>
                <ul id="indiv-headlines">
                  <li>Lorem Ipsum Dolor e tutti quanti</li>
                  <li>Lorem Ipsum Dolor e tutti quanti</li>
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
