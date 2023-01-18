import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <div id='footer-container'>
    <p id='paragraph-footer'>
      <span>This page is done for easing the process of reading news</span>
      <span>The project is <a className='footer-highlight' href='https://github.com/TerenceGrover/HSTW'>open-source</a> . Any contribution is appreciated</span>
      <span>For transparency concern, all calculations can be found in the Transparency page</span>
    </p>
    <div id='link-container'>
      <Link to='/about' className='footer-link'>About the Page</Link>
      <Link to='/transparency' className='footer-link'>Transparency</Link>
    </div>
    <div id='logo-container'>
      <a className='logo-footer' href="https://github.com/TerenceGrover/HSTW"><i className="fa fa-github"></i></a>
      <a className='logo-footer' href="https://www.linkedin.com/in/terence-grover-monaco/"><i className="fa fa-linkedin-square"></i></a>
    </div>
    </div>
  )
}