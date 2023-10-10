import React, { useContext } from 'react'
import globalObj from '../context/context'
import { useNavigate } from 'react-router-dom';
import { RiVideoAddLine } from "react-icons/ri";
import { FaSistrix, FaMicrophone, FaRegBell } from "react-icons/fa6";
const Navbar = () => {
  let { searchStr, setSearchStr } = useContext(globalObj);

  let navigate = useNavigate();

  function handle_onkeypress(e) {
    // console.log(e.key, e.key.length)
    // console.log("pressed", searchStr)
    if (searchStr.trim() && e.key === "Enter") {
      navigate(`search/${searchStr}`)
    }
  }
  function handle_onchange(e) {
    setSearchStr(e.target.value)
  }
  function handle_onclick() {

    if (searchStr.trim())
      navigate(`search/${searchStr}`)

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
          onChange={(e) => handle_onchange(e)} onKeyPress={handle_onkeypress} />
        <button id="find" onClick={handle_onclick}>
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