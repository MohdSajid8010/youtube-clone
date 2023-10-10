import React, { useContext } from 'react'
import globalObj from '../context/context'
import { useNavigate } from 'react-router-dom';
import { RiVideoAddLine } from "react-icons/ri";
import { FaSistrix, FaMicrophone, FaRegBell } from "react-icons/fa6";
const Navbar = () => {
  let { searchStr, setSearchStr } = useContext(globalObj);

  let navigate = useNavigate();
  function handle_onkeypress(e) {
    console.log(e.key, e.key.length)
    if (e.key === "Enter") {
      console.log("pressed")
      if (searchStr.trim())
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
        <input type="search" placeholder="Search" id="search-input" value={searchStr}
          onChange={(e) => setSearchStr(e.target.value)} onKeyPress={handle_onkeypress} />
        <button id="find" onClick={() => { if (searchStr.trim()) navigate('/search') }}>
          <FaSistrix style={{ fontSize: "20px" }} />
        </button>
        <span id="mic"><FaMicrophone style={{ fontSize: "20px" }} /></span>
      </div>


      <div id="navbar-right">
        <span> <RiVideoAddLine style={{ fontSize: "20px" }} />
        </span>
        <span><FaRegBell style={{ fontSize: "20px" }} /></span>
        <span><h4 className="s-logo">S</h4> </span>
      </div>
    </div>
  )
}

export default Navbar
// value={searchStr} 