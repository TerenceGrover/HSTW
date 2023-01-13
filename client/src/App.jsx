import MapChart from './Components/Map/MapChart';
import HappyIndex from './Components/HappyIndex/happyIndex';
import Individual from './Components/Individual/Individual';
import Title from './Components/Title';
import { useState, useRef } from 'react';

export default function App() {
  function scroll() {
    scrollToRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  const scrollToRef = useRef();
  const [clicked, setClicked] = useState(false);

  return (
    <div id="global-container">
      <Title />
      <MapChart clickSet={setClicked} clicked={clicked} />
      <HappyIndex />
      <div ref={scrollToRef}>
        {clicked ? <Individual geoProps={clicked} scrollFunc={scroll} /> : ''}
      </div>
    </div>
  );
}
