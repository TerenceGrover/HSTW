import { useState, useEffect, useRef } from 'react';
import './Map.css';
import Globe from 'react-globe.gl'
import { helperGetDateSpecificGlobalIdx } from '../../Util/requests';
import { generateColor } from '../../Util/Utility';

const geoUrl = process.env.PUBLIC_URL + '/assets/Topology.json';

export default function MapChart({ clickSet, mobile, innerWidth }) {

  const globeEl = useRef();
  const [idx, setIdx] = useState(false);
  const [countries, setCountries] = useState({features: []});
  const [hoverD, setHoverD] = useState()
  const [clickD, setClickD] = useState()

  useEffect(() => {
    let altitude = 2;
    if (window.innerWidth < 500) {
      altitude = 3;
    }

    const today = new Date()
    // here check will be true if everything went well, and false if something went horribly wrong.
    const check = helperGetDateSpecificGlobalIdx(today, setIdx);

      // load data
    fetch(geoUrl).then(res => res.json())
      .then(countries=> {
        setCountries(countries);
      });
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 0.3;
    globeEl.current.pointOfView({ altitude }, 3000);
  }, []);

  useEffect(() => {
    if (clickD) {
      globeEl.current.controls().autoRotate = false;
      const arrOfLat = clickD.geometry.coordinates[0]
      const midLat = arrOfLat[Math.floor(arrOfLat.length / 2)][1]
      const midLng = arrOfLat[Math.floor(arrOfLat.length / 2)][0]

      if (midLat > 0 && midLng > 0){
        globeEl.current.pointOfView({ lat: midLat, lng: midLng }, 1000);
      }
    }
  }, [clickD]);

  function GlobeProps(mobile) {

    const idxSelector = (d) => {
      return idx[
        d.properties.ISO_A2 !== "-99"
          ? d.properties.ISO_A2
          : d.properties.FIPS_10_
      ];
    }

    const commonProps = {
      globeImageUrl: "//unpkg.com/three-globe/example/img/earth-dark.jpg",
      backgroundImageUrl: "//unpkg.com/three-globe/example/img/night-sky.png",
      polygonsData: countries.features.filter((d) => d.properties.ISO_A2 !== "AQ"),
      polygonSideColor: (d) =>
        d === hoverD
          ? "steelblue"
          : generateColor(
              idxSelector(d),
              0.15
            ),
      polygonStrokeColor: () => "#111",
      polygonLabel: ({ properties: d }) => `${d.ADMIN} | ${d.ISO_A2}`,
      waitForGlobeReady: false,
      onPolygonClick: (d) => {
        clickSet({ name: d.properties.NAME, "Alpha-2": d.properties.ISO_A2 });
        setClickD(d);
      },
    };

    const mobileProps = {
      height: 500,
      width: innerWidth - 10,
      polygonCapColor: (d) =>
        generateColor(
          idxSelector(d),
          1,
          d === clickD ? "click" : undefined
        ),
      polygonAltitude: 0.04,
      polygonsTransitionDuration: 1000
    };

    const nonMobileProps = {
      height: window.innerHeight / 1.5,
      width: window.innerWidth - 40,
      polygonCapColor: (d) =>
        generateColor(
          idxSelector(d),
          1,
          d === hoverD ? "hover" : d === clickD ? "click" : undefined
        ),
      onPolygonHover: setHoverD,
      polygonAltitude: 0.07
    };

    return { ...commonProps, ...(mobile ? mobileProps : nonMobileProps) };
  }

  return (
    <>
      {mobile ? (
        <div id="mobile-container">
          <Globe ref={globeEl} {...GlobeProps(true)} />
        </div>
      ) : (
        <div id="map-container">
          <Globe ref={globeEl} {...GlobeProps(false)} />
        </div>
      )}
    </>
  );
}