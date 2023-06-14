import { useEffect, useState } from "react"
import Users from "../users";
import "./Select.css"
import SongsList from "./Songs.json"

const SONG_COUNT = 5;

export default function Select(){
    const[songCount, setSongCount] = useState(2); 

    const changePage = (addNum) => {
        if(addNum == -1 && songCount - 1 > 0){
            setSongCount(songCount + addNum)
        }
        else if(addNum == 1 && songCount + 1 <= SONG_COUNT){
            setSongCount(songCount + addNum)
        }
        console.log(songCount);
    }

    useEffect(() => {
    }, [])

    return(
        <div className="Select">
            <div className="Select-head">
                <Users></Users>
                <div className="head-title" onClick={() => window.location.href=`${process.env.PUBLIC_URL}/`}>{SongsList.songs[songCount - 1].title}</div>
            </div>
            <div className="Select-neck">
            </div>
            <div className="Select-body Select-mainSize">
                <div className="Select-body-songsList">
                    <img className="Select-body-song Select-body-visibleSong" src={songCount + 1 <= SONG_COUNT ? `${process.env.PUBLIC_URL}/imgs/song${songCount + 1}.jpg` : `${process.env.PUBLIC_URL}/imgs/white.jpg`}></img>
                    <img className="Select-body-song Select-body-nowSong" src={`${process.env.PUBLIC_URL}/imgs/song${songCount}.jpg`}></img>
                    <img className="Select-body-song Select-body-visibleSong" src={songCount - 1 > 0 ? `${process.env.PUBLIC_URL}/imgs/song${songCount - 1}.jpg` : `${process.env.PUBLIC_URL}/imgs/white.jpg`}></img>
                </div>
                <div className="Select-body-sides">
                    <img id="Select-body-arrow" onClick={() => changePage(1)} src={`${process.env.PUBLIC_URL}/imgs/arrow.png`} style={{marginBottom: ""}}></img>
                    <img id="Select-body-arrow" onClick={() => changePage(-1)} src={`${process.env.PUBLIC_URL}/imgs/arrow.png`} style={{transform: "rotate(180deg)", marginTop: ""}}></img>
                </div>
            </div>
            <div className="Select-foot Select-mainSize">
                <div className="Select-foot-levels">
                    <div id="Select-foot-level">1</div>
                    <div id="Select-foot-level">3</div>
                    <div id="Select-foot-level">5</div>
                    <div id="Select-foot-level">7</div>
                </div>
            </div>
        </div>
    )
}