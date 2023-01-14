import MapChart from './Components/Map/MapChart';
import HappyIndex from './Components/HappyIndex/happyIndex';
import Individual from './Components/Individual/Individual';
import Navbar from './Components/Navbar';
import Title from './Components/Title';
import { getUserCountry, getDateSpecificIndividualIdx } from './Util/requests';
import { useState, useRef, useEffect } from 'react';

export default function App() {
  const scrollToRef = useRef();
  const [clicked, setClicked] = useState(false);
  const [userCountry, setUserCountry] = useState(false);
  const [idx, setIdx] = useState();

  useEffect(() => {
    getUserCountry(setUserCountry);
    getDateSpecificIndividualIdx('world', '13-01-23', setIdx);
  }, []);

  useEffect(() => {
    setClicked({
      name: userCountry.country_name,
      'Alpha-2': userCountry.country_code,
    });
  }, [userCountry]);

  function scroll() {
    scrollToRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div id="global-container">
      {clicked ? console.log(clicked) : ''}
      <Navbar />
ƒ
      <MapChart clickSet={setClicked} clicked={clicked} />
      <HappyIndex />
      <div ref={scrollToRef}>
        <Individual geoProps={clicked} scrollFunc={scroll} />
      </div>
    </div>
  );
}
