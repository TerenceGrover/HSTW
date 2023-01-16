import './Navbar.css'

export default function Navbar({mobile, setMenu}) {
  return (
    <div>
      {mobile
      ?
      <div id='navbar-container-mobile'>
        <button id='ham-menu' onClick={() => setMenu(m => !m)}>
          <i className="fa fa-solid fa-bars"></i>
        </button>
        <h2 id='header-title'>
          How's The World <span id="io">.io</span>
        </h2>
        <div style={{'width' : '30px'}}></div>
      </div>
      :
      <h2 id='navbar-header'>
        How's The World <span id="io">.io</span>
      </h2>
      }
    </div>
  );
}
