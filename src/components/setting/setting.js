import { useEffect, useState } from "react"
import "./setting.css"
import cookies from "react-cookies"

export default function Setting(){
    const[scrollSpeed, setScrollSpeed] = useState(0);

    useEffect(() => {
        setScrollSpeed(cookies.load("scrollSpeed") != undefined ? cookies.load("scrollSpeed") : 1 );
    }, [])

    const getScrollSpeed = () => {
        setScrollSpeed(Number(document.getElementById("Setting-scrollSpeed").value));
    }

    const saveScrollSpeed = () => {
        cookies.save("scrollSpeed", scrollSpeed);
    }

    return(
        <div className="Setting">
            <h2>스크롤 속도</h2>
            <div class="Setting-scroll">
                <input id="Setting-scrollSpeed" type="range" min="1" max="6" step="1" value={scrollSpeed} onChange={() => getScrollSpeed()} onMouseUp={() => saveScrollSpeed()}></input>
                <div id="Setting-scrollValue">{scrollSpeed}</div>
            </div>
        </div>
    )
}