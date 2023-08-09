import React, { useState, useEffect } from "react";
import Search from "./Component/Search"

import TrendingVideo from "./Component/TrendingVideo";
import Videoplay from "./Component/Videoplay";
import "./style.css"
import ChipContainer from "./Component/ChipContainer"
import Navbar from "./Component/Navbar";
import CategoryComp from "./Component/CategoryComp"
import globalObj from "./context/context";
import { Route, Routes } from "react-router-dom";

const App = () => {
    const [searchResult, setSearchResult] = useState("");//arr
    const [VideoPlayObj, setVideoPlayObj] = useState("");
    const [loadVideoBOid, setLoadVideoBOid] = useState("");
    const [trendingVd, setTrendingVd] = useState("");
    const [searchStr, setSearchStr] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [moreVd, setMoreVd] = useState("")

    function format_time(pub_time) {
        const diffInMs = new Date() - new Date(pub_time);
        const diffInMin = Math.floor(diffInMs / (1000 * 60));
        if (diffInMin < 60) {
            return diffInMin + " min ago"
        }
        const diffInHr = Math.floor(diffInMin / 60);
        if (diffInHr < 24) {
            return diffInHr + "h ago";
        }
        const diffInDays = Math.floor(diffInHr / 24);
        if (diffInDays < 30) {
            return diffInDays + "day ago";
        }
        const diffInMon = Math.floor(diffInDays / 30);
        if (diffInMon < 12) {
            return diffInMon + "month ago";
        }
        const diffInyear = diffInMon / 12;
        return diffInyear.toFixed(1) + "Year ago";

    }
    function format_view(view) {
        if (view < 1000) {
            return view + " views";
        } else if (view >= 1000 && view < 1000000) {
            view = (view / 1000);
            return view.toFixed(1) + "K views";
        } else {
            view = (view / 1000000);
            return view.toFixed(2) + "M views";
        }
    }
    


    return (
        <div>

            <globalObj.Provider value={{
                searchResult, setSearchResult, VideoPlayObj, setVideoPlayObj, loadVideoBOid, setLoadVideoBOid, trendingVd, setTrendingVd,
                searchStr, setSearchStr, categoryId, setCategoryId, format_time, format_view, moreVd, setMoreVd
            }}>

                <Navbar />
                <ChipContainer />
                <Routes>
                    {console.log("run")}
                    <Route path="/" element={<TrendingVideo />} />
                    <Route path={'/search'} element={<Search />} />
                    <Route path={`/category/:${categoryId}`} element={<CategoryComp />} />
                    <Route path={VideoPlayObj ? `/${VideoPlayObj.id.videoId ? (VideoPlayObj.id.videoId) : (VideoPlayObj.id)}` : '/'} element={<Videoplay />} />
                </Routes>


            </globalObj.Provider>


        </div>
    )
}

export default App;

export const parseISO8601Duration = (duration) => {
    const matches = duration.match(/[0-9]+[HMS]/g);
    let timeString = "";
    if (matches) {
        matches.forEach((match) => {
            const unit = match.charAt(match.length - 1);
            const value = parseInt(match.slice(0, -1), 10);

            if (unit === "H") timeString += value + ":";//hours
            else if (unit === "M") timeString += value + ":";//mins
            else if (unit === "S") timeString += value + "";//sec
        });
    }
    return timeString.trim();
}
export function format_like(view) {
    if (view < 1000) {
        return view + "";
    } else if (view >= 1000 && view < 1000000) {
        view = (view / 1000);
        return view.toFixed(1) + "K";
    } else {
        view = (view / 1000000);
        return view.toFixed(2) + "M";
    }
}
// REACT_APP_YT_API_KEY=AIzaSyDP8CgDIEIW91UWCdzXHb0Xgk3ljXAvODY  
// REACT_APP_YT_API_KEY=AIzaSyBlPF3OCNPDbYRLATrZbj_z6sjGB-s8scI api key2