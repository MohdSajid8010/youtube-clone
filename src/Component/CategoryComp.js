import React, { useContext, useEffect } from 'react'
import globalObj from "../context/context";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { parseISO8601Duration } from '../functionCommon/func';
const api_key = process.env.REACT_APP_YT_API_KEY//yt api key


//load video based on particulat category ID
const CategoryComp = () => {


    let { setSearchResult, setVideoPlayObj, loadVideoBOid, setLoadVideoBOid, setTrendingVd, categoryId, format_time, format_view, setMoreVd } = useContext(globalObj);

    function loadVideoBOid_helper_func(category_id) {
        console.log("category_id", category_id)
        return new Promise((resolve, reject) => {
            axios.get("https://www.googleapis.com/youtube/v3/search", {
                params: {
                    part: "snippet",
                    type: "video",
                    videoCategoryId: category_id,
                    key: api_key,
                    maxResults: 5,
                }
            }).then((response) => {
                resolve(response.data.items);
            }).catch((error) => {
                console.log(error.message)
                reject(error)
            })
        })
    }

    function add_channe_logo(arr) {


        return new Promise((resolve, reject) => {
            let channelId_arr = []
            for (let obj of arr) {
                let channelId = obj.snippet.channelId;
                channelId_arr.push(channelId)
            }
            console.log(channelId_arr)
            axios.get(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId_arr.toString()}&key=${api_key}`)
                .then((response) => {
                    console.log("response", response)
                    for (let i = 0; i < response.data.items.length; i++) {
                        arr[i].logoUrl = response.data.items[i].snippet.thumbnails.default.url;
                    }
                    resolve(arr)
                }).catch((err) => reject(err))
        })
    }

    function add_view_count(arr) {

        return new Promise((resolve, reject) => {
            let video_id_arr = []
            for (let obj of arr) {
                let video_id = obj.id.videoId;
                video_id_arr.push(video_id);

            }
            axios.get(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet,statistics&id=${video_id_arr.toString()}&key=${api_key}`)
                .then((response) => {
                    console.log("response category ka", response)
                    for (let i = 0; i < response.data.items.length; i++) {
                        arr[i].statistics = response.data.items[i].statistics
                        arr[i].contentDetails = response.data.items[i].contentDetails


                    }
                    resolve(arr)
                }).catch((err) => reject(err))
        })
    }

    async function handle_async(category_id) {
        try {
            // let arr = JSON.parse(sessionStorage.getItem(`category_id${category_id}`)) || []
            // if (arr.length > 0) {
            //     console.log("from session storege", category_id, arr)
            //     setLoadVideoBOid(arr);
            //     setSearchResult("")
            //     setTrendingVd("")

            // } else {
            let arr = await loadVideoBOid_helper_func(category_id)//load video based on category id
            console.log("line 108", arr)
            arr = await add_channe_logo(arr)//add channel logo
            console.log("line 110", arr)
            await add_view_count(arr)//add view count
            console.log("line 112", arr);

            sessionStorage.setItem(`category_id${category_id}`, JSON.stringify(arr));
            setLoadVideoBOid(arr);
            setSearchResult("");
            setTrendingVd("");
            // }
        } catch (error) {
            console.log(error, error.message)
        }
    }

    useEffect(() => {
        let arr = JSON.parse(sessionStorage.getItem(`category_id${categoryId}`)) || []
        if (arr.length > 0) {
            console.log("from session storege", categoryId, arr)
            setLoadVideoBOid(arr);
            // setSearchResult("");
            // setTrendingVd("");

        } else {

            handle_async(categoryId)
        }
    }, [categoryId])

    let navigate = useNavigate();

    //when user click on any particular video
    function handleVideoClick(obj) {
        setVideoPlayObj(obj);
        setMoreVd(loadVideoBOid.filter((obj2) => obj2.id.videoId !== obj.id.videoId));
        navigate(`/${obj.id.videoId}`)
    }
    return (
        <div>{
            loadVideoBOid && (
                <div id="trendVdo">
                    {
                        loadVideoBOid && (
                            loadVideoBOid.map((obj, i) => {

                                return <div id="mainT" onClick={() => handleVideoClick(obj)} key={i}>
                                    <div>
                                        <img src={obj.snippet.thumbnails.high.url} alt={obj.snippet.description} className='thumbnailmainT' />
                                    </div>
                                    <div id="duration">
                                        <p id="durP">{parseISO8601Duration(obj.contentDetails.duration)}</p>
                                    </div>
                                    <div className='channel-logo-cont'>
                                        <img src={obj.logoUrl} alt="logo Url" className='channelLogoImg' />
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
        }</div>
    )
}

export default CategoryComp

