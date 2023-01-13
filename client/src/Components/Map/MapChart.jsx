import { useState, useEffect } from 'react';
import './Map.css';
import { getDateSpecificGlobalIdx } from '../../Util/requests';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { Space } from 'react-zoomable-ui';

const geoUrl = process.env.PUBLIC_URL + '/assets/Topology.json';

export default function MapChart({ clickSet, clicked }) {
  const [hover, setHover] = useState('');
  const [positionx, setPositionx] = useState(-100);
  const [positiony, setPositiony] = useState(-100);
  const [mobile, setMobile] = useState(false);
  const [idx, setIdx] = useState(false);

  const flatcol = 240;
  const hovercol = flatcol - 30;
  const clickcol = flatcol - 100;
  const defaultFill = `rgb(${flatcol},${flatcol},${flatcol})`;
  const hoverFill = `rgb(${hovercol},${hovercol},${hovercol})`;
  const clickFill = `rgb(${clickcol},${clickcol},${clickcol})`;

  function generateColor(code, currentState = undefined) {

    const col = idx[code]
    let colorReturn

    if (col) {

      const colObj = {
        r : (col.global < 0 ? Math.abs(col.global) * 30 + 30 + col.N : 1/Math.abs(col.global)),
        g : (col.global > 0 ? Math.abs(col.global) * 30 + 30 + col.P : 1/Math.abs(col.global)),
        b : (Math.abs((col.M*255) - (col.Nu * 255))) / 10
      }
      if (currentState === 'hover') {
        colorReturn = `rgb(${colObj.r + 50},${colObj.g + 50},${colObj.b + 50})`
      }
      else if (currentState === 'click') {
        colorReturn = `rgb(${colObj.r + 100},${colObj.g + 100},${colObj.b + 100})`
      }
      else {
        colorReturn = `rgb(${colObj.r},${colObj.g},${colObj.b})`
      }
    }

    else {
      return 'rgb(120,120,120)'
    }

    return colorReturn
  }

  // This function will check the position of the cursor on hover
  function handleHover(e) {
    setPositionx(e.pageX);
    setPositiony(e.pageY);
  }

  function handleWindowSizeChange() {
    window.innerWidth <= 500 ? setMobile(true) : setMobile(false);
  }

  useEffect(() => {
    window.innerWidth <= 500 ? setMobile(true) : setMobile(false);
    window.addEventListener('resize', handleWindowSizeChange);

    const date = '13-01-23'
    getDateSpecificGlobalIdx(date , setIdx)

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  return (
    <div id="map-container">
      {/* I am here setting the hover modal */}
      {mobile ? (
        ''
      ) : (
        <div
          id="modal"
          style={{ top: `${positiony - 40}px`, left: `${positionx}px` }}
        >
          <img
            src={`${
              process.env.PUBLIC_URL
            }/assets/32x32/${hover.toLowerCase()}.png`}
            alt="FLAG"
          />
          {/* Little easter egg */}
          {hover === 'SE' ? 'KarlLand' : hover}
        </div>
      )}

      <hr />
      {mobile ? (
        <div id="space-container">
          <Space
            onCreate={(vp) => {
              vp.setBounds({ x: [-10, 390], y: [-10, 290], zoom: [0, 3] });
            }}
            onDecideHowToHandlePress="hola"
          >
            <div id="global-map">
              {/* Scale and center had to be changed to fit the screen correctly */}
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  scale: 131,
                  center: [7, 44],
                }}
              >
                {/* Mapping every individual geography from my topojson file */}
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        onClick={() => {
                          clickSet(geo.properties);
                        }}
                        key={geo.rsmKey}
                        className={
                          clicked['Alpha-2'] === geo.properties['Alpha-2']
                            ? 'selected-geo'
                            : ''
                        }
                        geography={geo}
                        style={{
                          default: {
                            fill: idx ? generateColor(geo.properties['Alpha-2']) : defaultFill,
                          },
                          hover: {
                            fill: idx ? generateColor(geo.properties['Alpha-2'], 'hover') : hoverFill,
                          },
                          pressed: {
                            fill: idx ? generateColor(geo.properties['Alpha-2'], 'click') : clickFill,
                          },
                        }}
                        stroke="#000000"
                      />
                    ))
                  }
                </Geographies>
              </ComposableMap>
            </div>
          </Space>
        </div>
      ) : (
        <div id="global-map">
          {/* Scale and center had to be changed to fit the screen correctly */}
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 131,
              center: [7, 44],
            }}
          >
            {/* Mapping every individual geography from my topojson file */}
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    onMouseEnter={(e) => {
                      e.target.style.strokeWidth = '2';
                      setHover(
                        geo.properties['Alpha-2']
                      );
                    }}
                    onMouseMove={handleHover}
                    onClick={() => {
                      clickSet(geo.properties);
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.strokeWidth = '1';
                      setHover('');
                      setPositionx(-100);
                      setPositiony(-100);
                    }}
                    key={geo.rsmKey}
                    className={
                      clicked['Alpha-2'] === geo.properties['Alpha-2']
                        ? 'selected-geo'
                        : ''
                    }
                    geography={geo}
                    style={{
                      default: {
                        fill: idx ? generateColor(geo.properties['Alpha-2']) : defaultFill,
                      },
                      hover: {
                        fill: idx ? generateColor(geo.properties['Alpha-2'], 'hover') : hoverFill,
                      },
                      pressed: {
                        fill: idx ? generateColor(geo.properties['Alpha-2'], 'click') : clickFill,
                      },
                    }}
                    stroke="#000000"
                  />
                ))
              }
            </Geographies>
          </ComposableMap>
        </div>
      )}

      <hr />
    </div>
  );
}
