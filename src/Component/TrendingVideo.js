import React, { useEffect, useContext } from 'react'
import globalObj from '../context/context';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { parseISO8601Duration } from '../functionCommon/func';
import { toast } from 'react-toastify';
// const api_key = process.env.REACT_APP_YT_API_KEY//yt api key
let api_key = process.env.REACT_APP_YT_API_KEY

const TrendingVideo = () => {

    let { setVideoPlayObj, trendingVd, setTrendingVd, format_time, format_view, setMoreVd, setProgress } = useContext(globalObj)



    useEffect(() => {

        let arr = JSON.parse(sessionStorage.getItem("trendingVdo")) || []
        if (arr.length > 0) {
            // console.log("trending vd from sessions storage", arr)
            setTrendingVd(arr)
        } else {
            // console.log("trending vd not from sessions storage")

            handle_async()
        }
    }, [])


    function add_channe_logo(arr) {

        return new Promise((resolve, reject) => {
            let channelId_arr = []
            for (let obj of arr) {
                let channelId = obj.snippet.channelId;
                channelId_arr.push(channelId)
            }
            axios.get(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId_arr.toString()}&key=${api_key}`)
                .then((response) => {
                    // console.log("response channel", response, response.data.items.length)
                    for (let i = 0; i < response.data.items.length; i++) {
                        arr[i].logoUrl = response.data.items[i].snippet.thumbnails.default.url;
                    }
                    resolve(arr)
                }).catch((err) => reject(err))
        })
    }
    function gettrendingVdo() {
        return new Promise((resolve, reject) => {
            axios.get(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet,statistics&metrics=views&chart=mostPopular&regionCode=IN&maxResults=15&key=${api_key}`)
                .then((res) => {
                    if (res.status === 200) {
                        resolve(res.data.items);
                    } else {
                        reject(`Err with status code ${res.status}`);
                    }
                }).catch((err) => reject(err))
        })
    }

    async function handle_async() {
        try {
            setProgress(20)
            let arr = await gettrendingVdo();
            // console.log("arr", arr)
            setProgress(60)
            arr = await add_channe_logo(arr)
            // console.log("arr", arr)
            setProgress(100)
            sessionStorage.setItem("trendingVdo", JSON.stringify(arr))
            setTrendingVd(arr)

        } catch (error) {
            setProgress(100)
            console.log(error)
            console.log(error.response?.data?.error?.errors[0]?.reason ?? error.message);
            toast.error(`${error.response?.data?.error?.errors[0]?.reason ?? error.message}`, {

            })
        }
    }
    let navigate = useNavigate();



    //when user click on any particular video
    function handleVideoClick(obj) {
        setVideoPlayObj(obj);
        setMoreVd(trendingVd.filter((obj2) => obj2.id !== obj.id));
        // navigate(`/${obj.id}`)
        navigate(`/videoPlay`)
    }

    return (
        <>

            {
                trendingVd && (
                    <div id='trendVdo'>
                        {
                            trendingVd && (
                                trendingVd.map((obj, i) => {


                                    return <div id="mainT" onClick={() => handleVideoClick(obj)} key={i}>
                                        <div>
                                            <img src={obj.snippet.thumbnails.high.url} alt={""} className='thumbnailmainT' />
                                        </div>
                                        <div id="duration">
                                            <p id="durP">{parseISO8601Duration(obj.contentDetails.duration)}</p>
                                        </div>
                                        <div className='channel-logo-cont'>
                                            <img src={obj.logoUrl ?? "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Solid_white_bordered.svg/600px-Solid_white_bordered.svg.png"} alt="" className='channelLogoImg' />
                                            <div>
                                                <h3>{obj.snippet.title}</h3>

                                                <div className='flexDiv2'>
                                                    <span>{obj.snippet.channelTitle}</span>
                                                    <div id="flexDiv">
                                                        <span>{format_view(obj.statistics.viewCount)}</span>
                                                        <span>{format_time(obj.snippet.publishedAt)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                })
                            )
                        }
                    </div>
                )
            }
        </>
    )
}

export default TrendingVideo



