import MapChart from './Components/Map/MapChart';
import HappyIndex from './Components/HappyIndex/happyIndex';
import Individual from './Components/Individual/Individual';
import Navbar from './Components/Navbar/Navbar';
import Menu from './Components/Menu/Menu';
import Title from './Components/Title';
import Footer from './Components/Footer/Footer';
import { Dna } from 'react-loader-spinner';
import { getUserCountry, getDateSpecificGlobalIdx } from './Util/requests';
import { parseDate } from './Util/Utility';
import { useState, useRef, useEffect } from 'react';

export default function App() {
  const scrollToRef = useRef();
  const [clicked, setClicked] = useState({ name: 'world', 'Alpha-2': 'world' });
  const [userCountry, setUserCountry] = useState(false);
  const [idx, setIdx] = useState();
  const [mobile, setMobile] = useState();
  const [innerWidth, setInnerWidth] = useState();
  const [menu, setMenu] = useState(false);
  const [loader, setLoader] = useState(true);

  // eslint-disable-next-line no-restricted-globals
  screen.orientation.lock()

  useEffect(() => {
    window.innerWidth <= 500 ? setMobile(true) : setMobile(false);
    window.addEventListener('resize', handleWindowSizeChange);
    
    const date = parseDate(new Date())
    getUserCountry(setUserCountry);
    setTimeout(() => {
      setLoader(false);
    }, 1250);

    getDateSpecificGlobalIdx(date, setIdx);

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  function handleWindowSizeChange() {
    window.innerWidth <= 500 ? setMobile(true) : setMobile(false);
    setInnerWidth(window.innerWidth);
  }

  function scroll() {
    scrollToRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div id="global-container">
      <Navbar setMenu={setMenu} mobile={mobile} />
      {menu
      ?
      <Menu 
      idx = {idx}
      setMenu={setMenu}
      userCountry = {userCountry}
       />
      :
      ''
      }
      {loader ? (
        <div id="loader-container">
          <Dna
            visible={true}
            height="100"
            width="100"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />
        </div>
      ) : (
        <div id='sub-container' className={mobile ? 'mobile-padding' : ''}>
          <Title index={idx} mobile={mobile} />
          <MapChart
            clickSet={setClicked}
            clicked={clicked}
            mobile={mobile}
            innerWidth={innerWidth}
          />
          {/* <HappyIndex /> */}
          <div ref={scrollToRef}>
            <Individual clicked={clicked} scrollFunc={scroll} mobile={mobile} />
          </div>
          <Footer />
        </div>
      )}
      {/* <span>{userCountry ? 'You currently are in ' + userCountry.country_name : ':)'}</span> */}
    </div>
  );
}
