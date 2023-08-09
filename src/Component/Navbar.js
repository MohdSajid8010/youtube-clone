import React, { useContext } from 'react'
import globalObj from '../context/context'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  let { searchStr, setSearchStr } = useContext(globalObj);
  let navigate = useNavigate();
  function handle_onkeypress(e) {
    if (e.key === "Enter") {
      console.log("pressed")
      // handle_async_code() navigate
      if (searchStr)
        navigate("/search")
    }
  }
  return (
    <div id="navbar">
      <div id="navbar-left">
        <div id="utubelogo">
          <img
            src="https://logodownload.org/wp-content/uploads/2014/10/youtube-logo-9.png"
            alt="utubelogo"
          />
        </div>
        <p>IN</p>
      </div>

      <div id="navbar-mid">
        <input type="text" placeholder="Search" id="search" value={searchStr} onChange={(e) => setSearchStr(e.target.value)} onKeyPress={handle_onkeypress} />
        <button id="find" onClick={() => { if (searchStr) navigate('/search') }}>
          <i className="fa-sharp fa-solid fa-magnifying-glass"></i>
        </button>
        <span id="mic"><i className="fa-solid fa-microphone"></i></span>
      </div>

      <div id="navbar-right">
        <span
        ><img
            src="https://tse2.mm.bing.net/th?id=OIP.taACaGo1_28G9E-UqijqSgHaEo&pid=Api&P=0"
            alt=""
          /></span>
        <span><i className="fa-regular fa-bell"></i></span>
        <span>
          <h4 id="alpha">S</h4>
        </span>
      </div>
    </div>
  )
}

export default Navbar
// value={searchStr} 
{/* <button id="find" onClick={handle_async_code}> */ }