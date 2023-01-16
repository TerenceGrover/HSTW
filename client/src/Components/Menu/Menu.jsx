import './Menu.css'
import { generateColor } from '../../Util/Utility'

export default function Menu({setMenu, userCountry, idx}) {

  function parse(index) {
    return parseInt(index*10)
  }

  return (
    <div id='global-menu-container'>
      <div id='menu-container'>
        <div id='menu-content-container'>
          <div className='indicator-menu-container'>
            <span className='indicator-menu'>World index today : </span>
            <span 
            className='indicator-menu menu-index'
            style={{'backgroundColor' : generateColor(idx.world)}}
            >{parse(idx.world.global)}</span>
          </div>
          <div className='indicator-menu-container'>
            <span className='indicator-menu'>{userCountry.country_name} index : </span>
            <span 
            className='indicator-menu menu-index'
            style={{'backgroundColor' : generateColor(idx[userCountry.country_code])}}
            >{parse(idx[userCountry.country_code].global)}</span>
          </div>
        <hr style={{'width' : '100%', 'marginTop' : '15px'}} />
        </div>
      </div>
      <button id='modal-back' onClick={() => setMenu(m => !m)}>
      </button>
    </div>
  )
}
