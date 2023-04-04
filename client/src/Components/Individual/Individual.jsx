import { useEffect, useState } from 'react';
import './Individual.css';
import { getCountryDetails, getTodayIndividualData } from '../../Util/requests';
import { generateColor } from '../../Util/Utility';
import { IoIosBrowsers } from 'react-icons/io';

export default function Individual({ clicked, scrollFunc = () => { }, mobile }) {
  const [country, setCountry] = useState({
    flag: '🇺🇳',
    name: { official: 'The World' },
    currencies: [{ name: 'Various' }],
    languages: ['Various'],
    region: 'None',
    demonyms: { eng: { m: 'Beings' } },
    capital: 'Unknown',
  });
  const [topics, setTopics] = useState([]);
  const [headlines, setHeadlines] = useState([]);
  const [countryData, setCountryData] = useState();

  useEffect(() => {
    const arrOfTopics = [];
    let arrOfHL = [];
    if (countryData && countryData.topics) {
      countryData.topics.forEach((topic) => {
        if (/[a-zA-Z0-9]/.test(topic[0])) {
          arrOfTopics.push({ topic: topic[0], weight: topic[1] });
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
      const response = await getCountryDetails(clicked['Alpha-2']);
      setCountry(response);
      getCountryDetails(clicked['Alpha-2']).then((response) => {
        setCountry(response);
      });
    } else {
      setCountry({
        flag: '🇺🇳',
        name: { official: 'The World', common: 'The World' },
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
              <span id="indiv-name">
                {country.name.official || countryData.name}
              </span>
            </div>
            <div id="country-properties">
              <span>
                <span id="prop-name">Currency</span> :
                {Object.values(country.currencies)[0]['name']}
              </span>
              <span>
                <span id="prop-name">Languages</span> :
                {Object.values(country.languages).join(', ')}
              </span>
              <span>
                <span id="prop-name">Continent</span> : {country.region}
              </span>
              <span>
                <span id="prop-name">Demonym</span> :
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
                    {country.name.common}'s happiness :
                    {countryData.idx
                      ? parseInt(countryData.idx.global * 10)
                      : 'Unknown'}
                  </span>
                ) : (
                  <span id="index-title">
                    Today, {country.name.common} has a happiness score of :
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
                  {country.name.official !== 'The World' ? (
                    mobile ? (
                      <span className="header-bottom">Headlines :</span>
                    ) : (
                      <span className="header-bottom">Headlines :</span>
                    )
                  ) : null}
                  <div id="indiv-headlines-container" className="indiv-list">
                    <ul id="indiv-headlines">
                      {headlines ? (
                        headlines.slice(0, 5).map((Headline) => (
                          <a
                            target="_blank"
                            className="link"
                            href={Headline.link}
                            key={Headline.title}
                          >
                            <img key={Headline.title + 'img'} style={{ marginRight: '5px' }} width={16} src={"https://s2.googleusercontent.com/s2/favicons?domain_url=" + Headline.link + "&size=64"} alt="Website Icon" /> {Headline.title} <IoIosBrowsers />
                          </a>
                        ))
                      ) : (
                        country.name.official !== 'The World' ? (
                          <span>No Data</span>)
                          : <span>Topics of the Day: </span>
                      )}
                      <div id="indiv-main-topics-container">
                        <div id="indiv-main-topics" className="indiv-list">
                          {topics.length ? (
                            topics.map((topic) => (
                              <span className="topics" key={topic.topic}>
                                {topic.topic}
                              </span>
                            ))
                          ) : (
                            <span>No Data</span>
                          )}
                        </div>
                      </div>
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
