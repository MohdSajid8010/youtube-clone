// const url1 = 'https://www.googleapis.com/youtube/v3/videos';//for video
// const api_key = "AIzaSyDP8CgDIEIW91UWCdzXHb0Xgk3ljXAvODY"//yt api key
import React, { useEffect, useContext } from "react";
import axios from "axios";
import globalObj from "../context/context";
import { useNavigate, useParams } from "react-router-dom";
import { parseISO8601Duration } from "../functionCommon/func";
import { toast } from "react-toastify";

const api_key = process.env.REACT_APP_YT_API_KEY//yt api key

let searchUrl = "https://www.googleapis.com/youtube/v3/search";


const Search = () => {

    let { searchResult, setSearchResult, setVideoPlayObj, format_time, format_view, setMoreVd, setProgress } = useContext(globalObj);


    let navigate = useNavigate();
    let { searchStr } = useParams()

    useEffect(() => {

        //load video base on perticular search/query                                     
        if (searchStr) {
            let arr = JSON.parse(sessionStorage.getItem(`searchRes${searchStr}`)) || [];
            // let arr = JSON.parse(sessionStorage.getItem(`searchRes`)) || [];

            if (arr.length > 0) {

                setSearchResult(arr);
                setProgress(100)
                // console.log("from sessionStorage search result,", searchStr, arr)
            } else {

                handle_async_code()
            }

        } else {
            navigate("/")
        }
    }, [searchStr])


    function handleSearch() {
        return new Promise((resolve, reject) => {
            axios.get(searchUrl, {
                params: {
                    key: api_key,
                    q: searchStr,
                    type: "video",
                    part: 'snippet',
                    maxResults: 15,
                    // key: api_key,
                    // part: 'contentDetails,snippet,statistics',
                    // metrics: 'views',
                    // chart: 'mostPopular',
                    regionCode: 'IN',
                    // maxResults: 15,
                }
            }).then((response) => {

                // console.log("line 30", response, response.data.items)//obj.snippet, obj.snippet.thumbnails
                resolve(response.data.items)//arr

            }).catch((error) => { reject(error) })
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

                }).catch((err) => { reject(err) })
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
                    // console.log("in view count ka response", response)
                    for (let i = 0; i < response.data.items.length; i++) {
                        arr[i].statistics = response.data.items[i].statistics
                        arr[i].contentDetails = response.data.items[i].contentDetails


                    }
                    resolve(arr)
                }).catch((err) => { reject(err) })
        })
    }

    async function handle_async_code() {
        try {
            setProgress(20)
            let arr = await handleSearch();
            // console.log("search result", arr)
            setProgress(40)
            await add_channe_logo(arr);
            // console.log(" added channel logo", arr)
            setProgress(70)
            await add_view_count(arr);
            setProgress(100)
            // console.log("added view count", arr);
            sessionStorage.setItem(`searchRes${searchStr}`, JSON.stringify(arr))
            // sessionStorage.setItem(`searchRes`, JSON.stringify(arr))
            setSearchResult(arr);
        } catch (error) {
            setProgress(100)
            console.log(error)
            console.log(error.response?.data?.error?.errors[0]?.reason ?? error.message);
            toast.error(`${error.response?.data?.error?.errors[0]?.reason ?? error.message}`, {

            })
        }
    }




    //onclick of the perticular video
    function handleVideoClick(obj) {
        setVideoPlayObj(obj);
        setMoreVd(searchResult.filter((obj2) => obj2.id.videoId !== obj.id.videoId));
        // navigate(`/${obj.id.videoId}`)
        navigate(`/videoPlay`)
    }

    return (



        <>{
            searchResult && (
                <div id='search-cont'>
                    {
                        searchResult && (
                            searchResult.map((obj, i) => {


                                return <div id="main" onClick={() => handleVideoClick(obj)} key={i}>
                                    <div style={{ position: "relative" }}>
                                        <img src={obj.snippet.thumbnails.high.url} alt={""} className='thumbnailmain' />
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
                                            <img src={obj.logoUrl ?? obj.snippet.thumbnails.high.url} alt="" className='channelLogoImg' />
                                            <span>{obj.snippet.channelTitle} </span>
                                        </div>


                                        <span>{obj.snippet.description}</span>
                                    </div>


                                    <div id="right-side2">
                                        <img src={obj.logoUrl ?? obj.snippet.thumbnails.high.url} alt="" className='channelLogoImg' />
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
            )
        }</>
    )
}

export default Search;
// YouTube Data API v3 has not been used in project 103941921192 before or it is disabled. Enable it by visiting https://console.developers.google.com/apis/api/youtube.googleapis.com/overview?project=103941921192 then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry.