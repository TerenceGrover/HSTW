import { useState, useEffect, useRef } from 'react';
import './Map.css';
import Globe from 'react-globe.gl'
import { getDateSpecificGlobalIdx } from '../../Util/requests';
import { generateColor, parseDate } from '../../Util/Utility';

const geoUrl = process.env.PUBLIC_URL + '/assets/Topology.json';

export default function MapChart({ clickSet, clicked }) {

  const globeEl = useRef();

  const [mobile, setMobile] = useState(false);
  const [idx, setIdx] = useState(false);
  const [countries, setCountries] = useState({ features: []});
  const [hoverD, setHoverD] = useState()
  // This function will check the position of the cursor on hover

  function handleWindowSizeChange() {
    window.innerWidth <= 500 ? setMobile(true) : setMobile(false);
  }

  useEffect(() => {
    const today = new Date()
    window.innerWidth <= 500 ? setMobile(true) : setMobile(false);
    window.addEventListener('resize', handleWindowSizeChange);

    getDateSpecificGlobalIdx(parseDate(today), setIdx);

      // load data
    fetch(geoUrl).then(res => res.json())
      .then(countries=> {
        setCountries(countries);
      });
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 0.3;

    globeEl.current.pointOfView({ altitude: 2 }, 3000);

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);


  return (
    <>
    {mobile 
      ?
      <div id="mobile-container">
      <Globe 
      ref = {globeEl}
      height={500}
      width={window.innerWidth - 24}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      polygonsData={countries.features.filter(d => d.properties.ISO_A2 !== 'AQ')}
      polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
      polygonCapColor={d => generateColor(idx[d.properties.ISO_A2 !== '-99' ? d.properties.ISO_A2 : d.properties.FIPS_10_])}
      onPolygonClick={d => clickSet({name : d.properties.NAME, 'Alpha-2' : d.properties.ISO_A2})}
      polygonStrokeColor={() => '#111'}
      polygonLabel={({ properties: d }) => `${d.ADMIN} | ${d.ISO_A2}`}
      polygonAltitude={0.04}
      polygonsTransitionDuration={1000}
      />
      </div>
      :
      <div id="map-container">
      <Globe 
      ref = {globeEl}
      height={window.innerHeight / 1.5}
      width={window.innerWidth - 40}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
      polygonsData={countries.features.filter(d => d.properties.ISO_A2 !== 'AQ')}
      polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
      polygonCapColor={d => d === hoverD ? 'steelblue' : generateColor(idx[d.properties.ISO_A2 !== '-99' ? d.properties.ISO_A2 : d.properties.FIPS_10_])}
      onPolygonHover={setHoverD}
      onPolygonClick={d => clickSet({name : d.properties.NAME, 'Alpha-2' : d.properties.ISO_A2})}
      polygonStrokeColor={() => '#111'}
      polygonAltitude={0.07}
      polygonLabel={({ properties: d }) => `${d.ADMIN} | ${d.ISO_A2}`}
      />
      </div>
     }
     </>
  );
}
