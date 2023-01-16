import './Navbar.css'
import {Link} from 'react-router-dom'

export default function Navbar({mobile, setMenu}) {
  return (
    <div id='nav-top-container'>
      {mobile
      ?
      <div id='navbar-container-mobile'>
        <button id='ham-menu' onClick={() => setMenu(m => !m)}>
          <i className="fa fa-solid fa-bars"></i>
        </button>
        <Link to='/' id='mobile-header' className='navbar-header'>
          How's The World <span id="io">.io</span>
        </Link>
        <div style={{'width' : '30px'}}></div>
      </div>
      :
      <Link to='/' className='navbar-header'>
        How's The World <span id="io">.io</span>
      </Link>
      }
    </div>
  );
}
