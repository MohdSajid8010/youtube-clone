import React, { useState, useContext } from 'react';
import globalObj from '../context/context';
import { useNavigate } from 'react-router-dom';
import { FaRegHeart } from "react-icons/fa";
import { PiShareFatLight, PiThumbsUpLight, PiThumbsDownLight } from "react-icons/pi";
import { parseISO8601Duration, format_like } from "../App"

const Videoplay = () => {
    const [showMore, setShowMore] = useState(false)
    let {  VideoPlayObj, setVideoPlayObj, format_time, format_view, moreVd, setMoreVd } = useContext(globalObj)
    let navigate = useNavigate();
    console.log(VideoPlayObj, moreVd)

    return (


        <div>

            {
                VideoPlayObj && (
                    <div className='vd-play-cont'>

                        <div className='oneVd'>
                            <div >
                                <iframe src={`https://www.youtube.com/embed/${VideoPlayObj.id.videoId ? (VideoPlayObj.id.videoId) : (VideoPlayObj.id)}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                            </div>
                            <h3>{VideoPlayObj.snippet.title}</h3>

                            <div className='like-cont'>
                                <div className='left'>
                                    <img src={VideoPlayObj.logoUrl} alt="logo Url" className='channelLogoImg' />
                                    <div>
                                        <strong>{VideoPlayObj.snippet.channelTitle}</strong>
                                        <div>6.87M subscribers</div>
                                    </div>
                                    <button>Subcribe</button>
                                </div>
                                <div className='right'>
                                    <div>
                                        <button>  <PiThumbsUpLight /> {format_like(VideoPlayObj.statistics.likeCount)} <span><PiThumbsDownLight /></span></button>
                                    </div>
                                    {/* <button style={{fontSize:"24px"}}><FaRegHeart /> {format_like(VideoPlayObj.statistics.favoriteCount)}</button> */}
                                    <button> <PiShareFatLight /> Share</button>


                                </div>
                            </div>

                            <div className='descriptio-cont'>
                                <span>{format_view(VideoPlayObj.statistics.viewCount)} </span>
                                <span>{format_time(VideoPlayObj.snippet.publishedAt)}</span>

                                {
                                    !showMore ? (
                                        <div>{VideoPlayObj.snippet.description.slice(0, 100)}<span onClick={() => setShowMore(true)}> Show more....</span>
                                        </div>
                                    ) : (
                                        <div>
                                            <>
                                                {VideoPlayObj.snippet.description}

                                                <span onClick={() => setShowMore(false)}> Show Less....</span>
                                            </>
                                        </div>
                                    )
                                }



                            </div>

                            <div style={{ fontSize: "18px" }}>{format_like(VideoPlayObj.statistics.commentCount)} Comments</div>

                        </div>

                        {
                            moreVd && (
                                <div className='moreVd'>
                                    {
                                        moreVd.map((obj, i) => {
                                            return <div className='moreVd-one' onClick={() => { setVideoPlayObj(obj); setMoreVd([...moreVd]); navigate(`/${obj.id.videoId ? obj.id.videoId : obj.id}`) }} key={i}>
                                                <div style={{ position: "relative" }}>
                                                    <img src={obj.snippet.thumbnails.high.url} alt={obj.snippet.description} className='thumbnailmainT' />
                                                    <div id="durationS">
                                                        {parseISO8601Duration(obj.contentDetails.duration)}
                                                    </div>
                                                </div>
                                                <div className='right'>
                                                    <h3>{obj.snippet.title.slice(0, 55)} </h3>
                                                    <div>{obj.snippet.channelTitle}</div>
                                                    <span>{format_view(obj.statistics.viewCount)} {format_time(obj.snippet.publishedAt)}</span>
                                                </div>
                                                <div id="right-side2" >
                                                    <img src={obj.logoUrl} alt="logo Url" className='channelLogoImg' />
                                                    <div>
                                                        <h3>{obj.snippet.title}</h3>

                                                        <div className="flex3">
                                                            <span>{obj.snippet.channelTitle} </span>
                                                            <span >{`  -  `} </span>

                                                            <span>{format_view(obj.statistics.viewCount)}</span>
                                                            <span>{"  -  "}</span>

                                                            <span >{format_time(obj.snippet.publishedAt)}</span>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        })
                                    }


                                </div>
                            )
                        }
                    </div>
                )
            }
        </div>
    )
}

export default Videoplay
