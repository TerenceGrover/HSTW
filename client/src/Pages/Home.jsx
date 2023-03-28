import MapChart from '../Components/Map/MapChart';
import Individual from '../Components/Individual/Individual';
import Title from '../Components/Title';
import Graph from '../Components/Graph/Graph';
import { Dna } from 'react-loader-spinner';
import { useState, useRef, useEffect } from 'react';

export default function Home({ mobile, innerWidth, idx, clicked, setClicked }) {

  const scrollToRef = useRef();
  const [loader, setLoader] = useState(true);


  // eslint-disable-next-line no-restricted-globals
  // screen.orientation.lock('portrait')

  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 1250);
  }, []);

  function scroll() {
    scrollToRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <>
      {loader ? (
        <>
          <div id='loader-placeholder'></div>
          <div id="loader-container">
            <Dna
              visible={true}
              height="200"
              width="200"
              ariaLabel="dna-loading"
              wrapperClass="dna-wrapper"
            />
          </div>
        </>
      ) : (
        <div id='home-wrapper'>
          <Title index={idx} mobile={mobile} />
          <MapChart
            clickSet={setClicked}
            clicked={clicked}
            mobile={mobile}
            innerWidth={innerWidth}
          />
          <div ref={scrollToRef}>
          </div>
          <Individual
            clicked={clicked}
            scrollFunc={scroll}
            mobile={mobile} />
          <Graph
            idx={idx}
            clicked={clicked}
            mobile={mobile}
          />
        </div>
      )}
    </>
  );
}
