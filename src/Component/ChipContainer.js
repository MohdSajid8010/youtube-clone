// let video_category_id = "1,2,10,15,17,18,19,20,21,22,34,24,25,26,27,28,29,30,31,32,33,35,36,37,38,39,40,41,42,43,44"
// let url2 = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId={category_id}&key={YOUR_API_KEY}"
import React, { useState, useEffect, useContext } from 'react'
import globalObj from '../context/context';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
const api_key = process.env.REACT_APP_YT_API_KEY//yt api key

let videoCategoriesUrl = "https://www.googleapis.com/youtube/v3/videoCategories";


const ChipContainer = () => {

    let { setCategoryId } = useContext(globalObj)
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
                console.log(response.data.items.map((obj) => obj.snippet.title))
            })
        }

        let categories = JSON.parse(sessionStorage.getItem("categories")) || []
        if (categories.length > 0) {
            console.log("from session storage categories", categories)
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
                console.log(index)
            }} disabled={index <= 0} className='left-btn'><FaChevronLeft className='left-icon' /></button>
            {
                categories &&
                (
                    categories.map((obj) => {
                        return (
                            <div >
                                <span onClick={() => { setCategoryId(obj.id); navigate(`/category/${obj.id}`) }} key={obj.id}
                                    className='chip' style={{ transform: `translateX(-${index}00%)` }}>{obj.snippet.title}
                                </span>
                            </div>
                        )
                    })
                )
            }
            <button onClick={() => {
                setIndex(index + 1)
                console.log(index)
            }} disabled={index === 24} className='right-btn'><FaChevronRight className='right-icon' /></button>
        </div>



    )
}

export default ChipContainer;


