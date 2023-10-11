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
import LoadingBar from "react-top-loading-bar";
import ErrorComp from "./Component/ErrorComp";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const App = () => {

    const [trendingVd, setTrendingVd] = useState("");
    const [loadVideoBOid, setLoadVideoBOid] = useState("");
    const [searchStr, setSearchStr] = useState("");
    const [searchResult, setSearchResult] = useState("");
    const [VideoPlayObj, setVideoPlayObj] = useState("");
    const [moreVd, setMoreVd] = useState("");
    const [progress, setProgress] = useState(0)




    return (
        <div>

            <globalObj.Provider value={{
                trendingVd, setTrendingVd, loadVideoBOid, setLoadVideoBOid,
                searchStr, setSearchStr, searchResult, setSearchResult, VideoPlayObj, setVideoPlayObj,
                moreVd, setMoreVd, setProgress, format_time, format_view,
            }}>


                <ToastContainer />
                <LoadingBar color='#f11946' height={3} progress={progress} onLoaderFinished={() => setProgress(0)} />
                <Navbar />
                <ChipContainer />

                <Routes>
                    <Route path="/" element={<TrendingVideo />} />
                    <Route path={'/search/:searchStr'} element={<Search />} />
                    <Route path={`/category/:categoryId`} element={<CategoryComp />} />
                    <Route path={'/videoPlay'} element={<Videoplay />} />
                    <Route path={"*"} element={<ErrorComp />} />
                </Routes>

            </globalObj.Provider>


        </div>
    )
}

export default App;




// REACT_APP_YT_API_KEY=AIzaSyDP8CgDIEIW91UWCdzXHb0Xgk3ljXAvODY
// REACT_APP_YT_API_KEY=AIzaSyBlPF3OCNPDbYRLATrZbj_z6sjGB-s8scI api key2