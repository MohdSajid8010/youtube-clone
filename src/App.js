import React, { useState } from "react";
import "./styles/navbar.css"
import "./styles/chipContainer.css"
import "./styles/videoPlay.css"
import "./styles/trendindVideo.css"
import "./styles/searchContainer.css"
import "./styles/style.css"

import Navbar from "./Component/Navbar";
import ChipContainer from "./Component/ChipContainer";
import Search from "./Component/Search"
import TrendingVideo from "./Component/TrendingVideo";
import Videoplay from "./Component/Videoplay";
import CategoryComp from "./Component/CategoryComp";
import globalObj from "./context/context";
import { format_time, format_view } from './functionCommon/func'
import { Route, Routes } from "react-router-dom";




const App = () => {

    const [searchResult, setSearchResult] = useState("");
    const [VideoPlayObj, setVideoPlayObj] = useState("");
    const [loadVideoBOid, setLoadVideoBOid] = useState("");
    const [trendingVd, setTrendingVd] = useState("");
    const [searchStr, setSearchStr] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [moreVd, setMoreVd] = useState("");





    return (
        <div>

            <globalObj.Provider value={{
                searchResult, setSearchResult, VideoPlayObj, setVideoPlayObj, loadVideoBOid, setLoadVideoBOid,
                trendingVd, setTrendingVd,
                searchStr, setSearchStr, categoryId, setCategoryId, format_time, format_view, moreVd, setMoreVd
            }}>


                <Navbar />
                <ChipContainer />
                <Routes>
                    <Route path="/" element={<TrendingVideo />} />
                    <Route path={'/search'} element={<Search />} />
                    <Route path={`/category/:${categoryId}`} element={<CategoryComp />} />
                    {console.log(VideoPlayObj)}
                    <Route path={VideoPlayObj ? `/:${VideoPlayObj.id.videoId ? (VideoPlayObj.id.videoId) : (VideoPlayObj.id)}` : '/'} element={<Videoplay />} />
                </Routes>


            </globalObj.Provider>


        </div>
    )
}

export default App;




// REACT_APP_YT_API_KEY=AIzaSyDP8CgDIEIW91UWCdzXHb0Xgk3ljXAvODY
// REACT_APP_YT_API_KEY=AIzaSyBlPF3OCNPDbYRLATrZbj_z6sjGB-s8scI api key2