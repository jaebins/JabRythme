import { useEffect, useState } from "react"
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
                <div className="head-title" onClick={() => window.location.href=`${process.env.PUBLIC_URL}/`}>Title</div>
            </div>
            <div className="Select-neck">
            </div>
            <div className="Select-body">
                <div className="Select-body-songsList">
                    <img className="Select-body-song Select-body-visibleSong" src={songCount + 2 <= SONG_COUNT ? `${process.env.PUBLIC_URL}/imgs/song${songCount + 2}.jpg` : null}></img>
                    <img className="Select-body-song Select-body-visibleSong" src={songCount + 1 <= SONG_COUNT ? `${process.env.PUBLIC_URL}/imgs/song${songCount + 1}.jpg` : null}></img>
                    <img className="Select-body-song Select-body-nowSong" src={`${process.env.PUBLIC_URL}/imgs/song${songCount}.jpg`}></img>
                    <img className="Select-body-song Select-body-visibleSong" src={songCount - 1 > 0 ? `${process.env.PUBLIC_URL}/imgs/song${songCount - 1}.jpg` : null}></img>
                    <img className="Select-body-song Select-body-visibleSong" src={songCount - 2 > 0 ? `${process.env.PUBLIC_URL}/imgs/song${songCount - 2}.jpg` : null}></img>
                </div>
                <div className="Select-body-sides">
                    <img id="Select-body-arrow" onClick={() => changePage(1)} src={`${process.env.PUBLIC_URL}/imgs/arrow.png`} style={{marginBottom: "50px"}}></img>
                    <div id="Select-body-songTitle">{SongsList.songs[songCount - 1].title.length <= 7 ? SongsList.songs[songCount - 1].title : SongsList.songs[songCount - 1].title.substring(0, 7) + ".."}</div>
                    <img id="Select-body-arrow" onClick={() => changePage(-1)} src={`${process.env.PUBLIC_URL}/imgs/arrow.png`} style={{transform: "rotate(180deg)", marginTop: "100px"}}></img>
                </div>
            </div>
            <div className="Select-foot">
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