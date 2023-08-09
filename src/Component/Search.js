import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import globalObj from "../context/context";
import { useNavigate } from "react-router-dom";
import { parseISO8601Duration } from "../App"

// const api_key = "AIzaSyDP8CgDIEIW91UWCdzXHb0Xgk3ljXAvODY"//yt api key
const api_key = process.env.REACT_APP_YT_API_KEY//yt api key

let url1 = "https://www.googleapis.com/youtube/v3/search";
// const url1 = 'https://www.googleapis.com/youtube/v3/videos';//fro video
const Search = () => {

    let { searchResult, setSearchResult, VideoPlayObj, setVideoPlayObj, loadVideoBOid, setLoadVideoBOid, trendingVd, setTrendingVd, searchStr, setSearchStr, format_time, format_view, setMoreVd } = useContext(globalObj);




    useEffect(() => {

        handle_async_code()
    }, [])


    function handleSearch() {
        return new Promise((resolve, reject) => {
            axios.get(url1, {
                params: {
                    key: api_key,
                    q: searchStr,
                    type: "video",
                    part: 'snippet',
                    maxResults: 5,
                    // key: api_key,
                    // part: 'contentDetails,snippet,statistics',
                    // metrics: 'views',
                    // chart: 'mostPopular',
                    regionCode: 'IN',
                    // maxResults: 5,
                }
            }).then((response) => {

                console.log("line 30", response.data.items)//obj.snippet, obj.snippet.thumbnails
                resolve(response.data.items)//arr

            }).catch((error) => { console.log(error); reject(error.message) })
        })
    }

    function add_channe_logo(arr) {

        // return new Promise((resolve, reject) => {
        //     let promise_arr = []
        //     for (let obj of arr) {

        //         let channelId = obj.snippet.channelId;

        //         promise_arr.push(axios.get(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${api_key}`))
        //     }
        //     Promise.all(promise_arr).then((res_arr) => {
        //         for (let i = 0; i < res_arr.length; i++) {
        //             arr[i].logoUrl = res_arr[i].data.items[0].snippet.thumbnails.default.url;
        //         }
        //         resolve(arr)
        //     }).catch((err) => { console.log(err); reject(err) })
        // })
        return new Promise((resolve, reject) => {
            let id_arr = []
            for (let obj of arr) {

                let channelId = obj.snippet.channelId;
                id_arr.push(channelId);
            }
            axios.get(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${id_arr.toString()}&key=${api_key}`)
                .then((res_arr) => {
                    // console.log("res_arr", res_arr, res_arr.data.items.length)
                    for (let i = 0; i < res_arr.data.items.length; i++) {
                        arr[i].logoUrl = res_arr.data.items[i].snippet.thumbnails.default.url;
                    }
                    resolve(arr)

                }).catch((err) => { console.log(err); reject(err) })
        })

    }

    function add_view_count(arr) {
        return new Promise((resolve, reject) => {
            let id_arr = []
            for (let obj of arr) {
                let video_id = obj.id.videoId;
                id_arr.push(video_id);

            }
            axios.get(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet,statistics&id=${id_arr.toString()}&key=${api_key}`)
                .then((response) => {
                    console.log("in view count ka response", response)
                    for (let i = 0; i < response.data.items.length; i++) {
                        arr[i].statistics = response.data.items[i].statistics
                        arr[i].contentDetails = response.data.items[i].contentDetails

                   
                    }
                    resolve(arr)
                }).catch((err) => { console.log(err); reject(err) })
        })
    }

    async function handle_async_code() {
        try {
            if (!searchStr) return;

            let arr = JSON.parse(sessionStorage.getItem("ytube_arr")) || []
            if (arr.length > 0) {
                setSearchResult(arr);
                // setSearchStr("")
                setLoadVideoBOid('')
                setTrendingVd('')
                console.log("form local storage", arr)
            } else {
                if (!searchStr) return;

                let arr = await handleSearch();
                console.log("line 86", arr)
                await add_channe_logo(arr);
                console.log("line 90", arr)
                await add_view_count(arr);
                console.log("line 103", arr);
                sessionStorage.setItem("ytube_arr", JSON.stringify(arr))
                setSearchResult(arr);
                // setSearchStr("")
                setLoadVideoBOid('')
                setTrendingVd('')
            }



        } catch (error) {
            console.log(error, error.message)
        }
    }

    let navigate = useNavigate();
    return (



        <>{
            searchResult && (
                <div id='content'>
                    <div id='filter-main'>
                        {
                            searchResult && (
                                searchResult.map((obj, i) => {


                                    return <div id="main" onClick={() => { setVideoPlayObj(obj); setMoreVd(searchResult.filter((obj2) => obj2.id.videoId !== obj.id.videoId)); navigate(`/${obj.id.videoId}`) }} key={i}>
                                        <div style={{ position: "relative" }}>
                                            <img src={obj.snippet.thumbnails.high.url} alt={obj.snippet.description} className='thumbnailmain' />
                                            <div id="durationS">
                                                <p >{parseISO8601Duration(obj.contentDetails.duration)}</p>
                                            </div>
                                        </div>

                                        <div id="right-side">
                                            <h3>{obj.snippet.title}</h3>

                                            <div className="flex1">
                                                <span>{format_view(obj.statistics.viewCount)}</span>
                                                <span>{format_time(obj.snippet.publishTime)}</span>
                                            </div>

                                            <div className="flex2">
                                                <img src={obj.logoUrl} alt="logo Url" className='channelLogoImg' />
                                                <span>{obj.snippet.channelTitle} </span>
                                            </div>


                                            <span>{obj.snippet.description}</span>
                                        </div>


                                        <div id="right-side2">
                                            <img src={obj.logoUrl} alt="logo Url" className='channelLogoImg' />
                                            <div>
                                                <h3>{obj.snippet.title.slice(0, 50)}</h3>

                                                <div className="flex3">
                                                    <span>{obj.snippet.channelTitle} </span>
                                                    <span >{`  -  `} </span>

                                                    <span>{format_view(obj.statistics.viewCount)}</span>
                                                    <span>{"  -  "}</span>

                                                    <span >{format_time(obj.snippet.publishTime)}</span>
                                                </div>
                                            </div>

                                        </div>

                                    </div>

                                })
                            )
                        }
                    </div>
                </div>
            )
        }</>
    )
}

export default Search;
// YouTube Data API v3 has not been used in project 103941921192 before or it is disabled. Enable it by visiting https://console.developers.google.com/apis/api/youtube.googleapis.com/overview?project=103941921192 then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry.