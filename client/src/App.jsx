import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Menu from './Components/Menu/Menu';
import Footer from './Components/Footer/Footer';
import { getUserCountry, helperGetDateSpecificGlobalIdx } from './Util/requests';
import { parseDate } from './Util/Utility';
import { useState, useEffect } from 'react';
import Home from './Pages/Home';
import About from './Pages/About';
import Transparency from './Pages/Transparency';

export default function App() {
  const [innerWidth, setInnerWidth] = useState();
  const [clicked, setClicked] = useState({ name: 'world', 'Alpha-2': 'world' });
  const [mobile, setMobile] = useState();
  const [menu, setMenu] = useState(false);
  const [userCountry, setUserCountry] = useState(false);
  const [idx, setIdx] = useState();

  // eslint-disable-next-line no-restricted-globals

  function handleWindowSizeChange() {
    window.innerWidth <= 500 ? setMobile(true) : setMobile(false);
    setInnerWidth(window.innerWidth);
  }

  useEffect(() => {
    window.innerWidth <= 500 ? setMobile(true) : setMobile(false);
    window.addEventListener('resize', handleWindowSizeChange);

    const date = parseDate(new Date());
    getUserCountry(setUserCountry);

    // here check will be true if everything went well, and false if something went horribly wrong.
    const today = new Date();
    const check = helperGetDateSpecificGlobalIdx(today, setIdx);
    if (!check) {
      console.log('Something went wrong with the API call');
    } else {
      console.log('API call was successful');
    }

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  return (
    <div id="global-container">
      <Router>
        <Navbar setMenu={setMenu} mobile={mobile} />
        {menu ? (
          <Menu
            idx={idx}
            setMenu={setMenu}
            userCountry={userCountry}
            setClicked={setClicked}
          />
        ) : (
          ''
        )}
        <div id="sub-container" className={mobile ? 'mobile-padding' : ''}>
          <Routes>
            <Route
              path="/"
              exact
              element={
                <Home
                  idx={idx}
                  mobile={mobile}
                  innerWidth={innerWidth}
                  setClicked={setClicked}
                  clicked={clicked}
                />
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/transparency" element={<Transparency />} />
          </Routes>
          <Footer />
        </div>
      </Router>
      {/* <span>{userCountry ? 'You currently are in ' + userCountry.country_name : ':)'}</span> */}
    </div>
  );
}
