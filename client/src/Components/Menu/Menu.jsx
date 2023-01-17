import './Menu.css';
import { generateColor } from '../../Util/Utility';
import { useState, useEffect } from 'react';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';

export default function Menu({ setMenu, userCountry, idx, setClicked }) {
  const localArr = JSON.parse(window.localStorage.getItem('arr'));
  const [list, setList] = useState();
  const [deleteMode, setDeleteMode] = useState(false);
  const [displayedIndexes, setDisplayIndexes] = useState(
    localArr || [
      { name: 'World', code: 'world' },
      { name: userCountry.country_name, code: userCountry.country_code },
    ]
  );

  const ISO2List = process.env.PUBLIC_URL + '/assets/ISO2.json';

  useEffect(() => {
    fetch(ISO2List)
      .then((res) => res.json())
      .then((codes) => {
        setList(codes);
      });
  }, []);

  function parse(index) {
    return parseInt(index * 10);
  }

  function storeToLocaleStorage(arrOfIdx) {
    const stringified = JSON.stringify(arrOfIdx);
    window.localStorage.setItem('arr', stringified);
  }

  function handleSubmit(e) {
    const tempArr = [...displayedIndexes];
    tempArr.push(e);
    storeToLocaleStorage(tempArr);
    setDisplayIndexes(tempArr);
  }

  function handleSelect(obj) {
    setMenu(false);
    setClicked(obj);
  }

  function handleDelete(country) {
    const tempArr = [...displayedIndexes];
    const newTemp = tempArr.filter((x) => x.name !== country.name);
    storeToLocaleStorage(newTemp);
    setDisplayIndexes(newTemp);
  }

  return (
    <div id="global-menu-container">
      <div id="menu-container">
        <div id="menu-content-container">
          <button id="edit-countries" onClick={() => setDeleteMode((d) => !d)}>
            Edit Countries
          </button>
          {displayedIndexes.map((display) => {
            try {
              return (
                <button
                  onClick={() =>
                    deleteMode
                      ? handleDelete({
                          name: display.name,
                          'Alpha-2': display.code,
                        })
                      : handleSelect({
                          name: display.name,
                          'Alpha-2': display.code,
                        })
                  }
                  key={display.code}
                  className="indicator-menu-container"
                  id={deleteMode ? 'delete' : ''}
                >
                  <span className="indicator-menu">
                    {display.name} index :{' '}
                  </span>
                  <span
                    className="indicator-menu menu-index"
                    style={{
                      backgroundColor: generateColor(idx[display.code]),
                    }}
                  >
                    {parse(idx[display.code].global)}
                  </span>
                </button>
              );
            } catch {
              return (
                <button
                  onClick={() =>
                    deleteMode
                      ? handleDelete({
                          name: display.name,
                          'Alpha-2': display.code,
                        })
                      : handleSelect({
                          name: display.name,
                          'Alpha-2': display.code,
                        })
                  }
                  key={display.code}
                  className="indicator-menu-container"
                  id={deleteMode ? 'delete' : ''}
                >
                  <span className="indicator-menu">
                    {display.name} index :{' '}
                  </span>
                  <span
                    className="indicator-menu menu-index"
                    style={{ backgroundColor: generateColor(undefined) }}
                  >
                    N/A
                  </span>
                </button>
              );
            }
          })}
          <hr style={{ width: '100%', marginTop: '15px' }} />
          <div id="buttons-menu">
            <div id="search-bar-styler">
              <ReactSearchAutocomplete
                placeholder="Add a Country"
                key="auto-complete"
                type="text"
                id="add-country-field"
                items={list}
                onSelect={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
      <button id="modal-back" onClick={() => setMenu((m) => !m)}></button>
    </div>
  );
}
