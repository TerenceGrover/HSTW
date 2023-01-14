import { useState, useEffect, useRef } from 'react';
import './Map.css';
import Globe from 'react-globe.gl'
import { getDateSpecificGlobalIdx } from '../../Util/requests';

const geoUrl = process.env.PUBLIC_URL + '/assets/Topology.json';

export default function MapChart({ clickSet, clicked }) {

  const [mobile, setMobile] = useState(false);
  const [idx, setIdx] = useState(false);
  const [countries, setCountries] = useState({ features: []});
  const [hoverD, setHoverD] = useState()

  function generateColor(code, currentState = undefined) {
    const col = idx[code];
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

  // This function will check the position of the cursor on hover

  function handleWindowSizeChange() {
    window.innerWidth <= 500 ? setMobile(true) : setMobile(false);
  }

  useEffect(() => {
    window.innerWidth <= 500 ? setMobile(true) : setMobile(false);
    window.addEventListener('resize', handleWindowSizeChange);

    const date = '13-01-23';
    getDateSpecificGlobalIdx(date, setIdx);

      // load data
    fetch(geoUrl).then(res => res.json())
      .then(countries=> {
        setCountries(countries);
      });

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);


  return (
    <div id="map-container">
      {mobile 
      ?
      <Globe 
      height={500}
      width={window.innerWidth - 40}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      polygonsData={countries.features.filter(d => d.properties.ISO_A2 !== 'AQ')}
      polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
      polygonCapColor={d => d === hoverD ? 'steelblue' : generateColor(d.properties.ISO_A2 !== '-99' ? d.properties.ISO_A2 : d.properties.FIPS_10_)}
      onPolygonHover={setHoverD}
      onPolygonClick={d => clickSet({name : d.properties.NAME, 'Alpha-2' : d.properties.ISO_A2})}
      polygonStrokeColor={() => '#111'}
      polygonLabel={({ properties: d }) => `${d.ADMIN} | ${d.ISO_A2}`}
      />
      :
      <Globe 
      height={600}
      width={window.innerWidth - 40}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      polygonsData={countries.features.filter(d => d.properties.ISO_A2 !== 'AQ')}
      polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
      polygonCapColor={d => d === hoverD ? 'steelblue' : generateColor(d.properties.ISO_A2 !== '-99' ? d.properties.ISO_A2 : d.properties.FIPS_10_)}
      onPolygonHover={setHoverD}
      onPolygonClick={d => clickSet({name : d.properties.NAME, 'Alpha-2' : d.properties.ISO_A2})}
      polygonStrokeColor={() => '#111'}
      polygonLabel={({ properties: d }) => `${d.ADMIN} | ${d.ISO_A2}`}
      />
     }
    </div>
  );
}
