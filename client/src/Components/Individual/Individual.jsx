import { useEffect, useState } from 'react';
import './Individual.css';
import { getCountryDetails, getTodayIndividualData } from '../../Util/requests';
import { generateColor } from '../../Util/Utility';

export default function Individual({ clicked, scrollFunc = () => {}, mobile }) {
  const [country, setCountry] = useState();
  const [topics, setTopics] = useState([]);
  const [headlines, setHeadlines] = useState([]);
  const [countryData, setCountryData] = useState();

  useEffect(() => {
    const arrOfTopics = [];
    let arrOfHL = [];
    if (countryData && countryData.topics) {
      countryData.topics.forEach((topic) => {
        if (/[a-zA-Z0-9]/.test(topic[0])) {
          arrOfTopics.push(`${topic[0]} [${topic[1]}]`);
        }
        arrOfHL = countryData.HL;
      });
    }
    setTopics(arrOfTopics);
    setHeadlines(arrOfHL);
  }, [countryData]);

  useEffect(() => {
    if (clicked['Alpha-2']) {
      fetchCountry();
      getTodayIndividualData(clicked['Alpha-2'], setCountryData);
      if (clicked['Alpha-2'] !== 'world') {
        scrollFunc();
      }
    }
  }, [clicked]);

  async function fetchCountry() {
    if (clicked['Alpha-2'] !== 'world') {
      getCountryDetails(clicked['Alpha-2']).then((response) => {
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
              style={{ backgroundColor: generateColor(countryData.idx) }}
            >
              <div id="index-display">
                {mobile ? (
                  <span id="index-title-mobile">
                    {country.name.official}'s happiness :
                    {countryData.idx
                      ? parseInt(countryData.idx.global * 10)
                      : 'Unknown'}
                  </span>
                ) : (
                  <span id="index-title">
                    Today, {country.name.official} has a happiness score of :
                    {countryData.idx
                      ? parseInt(countryData.idx.global * 10)
                      : 'Unknown'}
                  </span>
                )}
              </div>
            </div>
            <div id="indiv-right-bottom" className="floaty-container">
              {countryData ? (
                <>
                    {mobile ? (
                      <span className="header-bottom">
                        Most used word there :
                      </span>
                    ) : (
                      <span className="header-bottom">
                        Most used word in this country :
                      </span>
                    )}
                  <div id="indiv-main-topics-container">
                    <div id="indiv-main-topics" className="indiv-list">
                      {topics.length ? (
                        <span id='topics'>{topics.join(' - ')}</span>
                      ) : (
                        <span>No Data</span>
                      )}
                    </div>
                  </div>
                    {mobile ? (
                      <span className="header-bottom">
                        What the news look like :
                      </span>
                    ) : (
                      <span className="header-bottom">
                        What the news look like over there :
                      </span>
                    )}
                  <div id="indiv-headlines-container" className="indiv-list">
                    <ul id="indiv-headlines">
                      {headlines ? (
                        headlines
                          .slice(0, 5)
                          .map((Headline) => <a href={Headline.link} key={Headline}>{Headline.title}</a>)
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
