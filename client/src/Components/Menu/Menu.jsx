import './Menu.css'

export default function Menu({setMenu}) {
  return (
    <div id='global-menu-container'>
      <div id='menu-container'>
      </div>

      <button id='modal-back' onClick={() => setMenu(m => !m)}>
      </button>
    </div>
  )
}
