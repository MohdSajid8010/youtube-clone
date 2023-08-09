import React, { useState, useEffect, useContext } from 'react'
import globalObj from '../context/context';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
const api_key = process.env.REACT_APP_YT_API_KEY//yt api key
let url = "https://www.googleapis.com/youtube/v3/videoCategories";
let video_category_id = "1,2,10,15,17,18,19,20,21,22,34,24,25,26,27,28,29,30,31,32,33,35,36,37,38,39,40,41,42,43,44"

// let url2 = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId={category_id}&key={YOUR_API_KEY}"


const ChipContainer = () => {

    let { setCategoryId } = useContext(globalObj)
    const [categories, setCategories] = useState("");
    const [showCategories, setShowCategories] = useState("")
    const [index, setIndex] = useState({ left: 0, right: 10 })
    useEffect(() => {

        function loadCategory() {
            axios.get(url, {
                params: {
                    key: api_key,
                    part: "snippet",
                    id: video_category_id,
                }
            }).then((response) => {
                // console.log(response.data.items);//arr snippet.title
                sessionStorage.setItem("categories", JSON.stringify(response.data.items))
                setCategories(response.data.items)
                setShowCategories(response.data.items.slice(index.left, index.right))
            })
        }

        let categories = JSON.parse(sessionStorage.getItem("categories")) || []
        if (categories.length > 0) {
            console.log("from session storage categories", categories)
            setCategories(categories)
            setShowCategories(categories.slice(index.left, index.right))
        } else {
            loadCategory()
        }
    }, [])


    let navigate = useNavigate()
    return (
        <>
            <div className='chips-container'>
                <button onClick={() => {
                    setShowCategories(categories.slice(index.left - 1, index.right - 1))
                    setIndex({ left: index.left - 1, right: index.right - 1 })
                }} disabled={index.left <= 0} className='left-btn'><FaChevronLeft className='left-icon' /></button>
                {
                    showCategories &&
                    (
                        showCategories.map((obj) => {
                            return (
                                <div onClick={() => { setCategoryId(obj.id); navigate(`/category/:${obj.id}`) }} key={obj.id} className='chip'>{obj.snippet.title}</div>
                            )
                        })
                    )
                }
                <button onClick={() => {
                    setShowCategories(categories.slice(index.left + 1, index.right + 1));
                    setIndex({ left: index.left + 1, right: index.right + 1 })
                }} disabled={index.right === categories.length} className='right-btn'><FaChevronRight className='right-icon' /></button>
            </div>

            <div className='chips-container2'>

                {
                    categories &&
                    (
                        categories.map((obj) => {
                            return (
                                <div onClick={() => { setCategoryId(obj.id); navigate(`/category/:${obj.id}`) }} key={obj.id} className='chip'>{obj.snippet.title}</div>
                            )
                        })
                    )
                }
            </div>
        </>
    )
}

export default ChipContainer;


