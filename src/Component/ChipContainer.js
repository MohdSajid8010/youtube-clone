import React, { useState, useEffect, useContext } from 'react'
import globalObj from '../context/context';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
const api_key = process.env.REACT_APP_YT_API_KEY//yt api key

let videoCategoriesUrl = "https://www.googleapis.com/youtube/v3/videoCategories";


const ChipContainer = () => {

    const [categories, setCategories] = useState("");
    const [index, setIndex] = useState(0)//for translateX


    useEffect(() => {

        function loadCategory() {
            axios.get(videoCategoriesUrl, {
                params: {
                    key: api_key,
                    part: "snippet",
                    // id: video_category_id,
                    regionCode: "IN",
                }
            }).then((response) => {
                // console.log(response.data.items);//arr snippet.title
                sessionStorage.setItem("categories", JSON.stringify(response.data.items))
                setCategories(response.data.items)
            })
        }

        let categories = JSON.parse(sessionStorage.getItem("categories")) || []
        if (categories.length > 0) {
            // console.log("from session storage categories", categories)
            setCategories(categories)
        } else {
            loadCategory()
        }
    }, [])


    let navigate = useNavigate()
    return (

        <div className='chips-container'>
            <button onClick={() => {
                setIndex(index - 1)
            }} disabled={index <= 0} className='left-btn'><FaChevronLeft className='left-icon' /></button>
            {
                categories &&
                (
                    categories.map((obj, i) => {
                        return (
                            <div key={`cat${i}`}>
                                <span onClick={() => {
                                    navigate(`/category/${obj.id}`)
                                }}
                                    key={obj.id}
                                    className='chip' style={{ transform: `translateX(-${index}00%)` }}>{obj.snippet.title}
                                </span>
                            </div>
                        )
                    })
                )
            }
            <button onClick={() => {
                setIndex(index + 1)
            }} disabled={index === 24} className='right-btn'><FaChevronRight className='right-icon' /></button>
        </div>



    )
}

export default ChipContainer;


