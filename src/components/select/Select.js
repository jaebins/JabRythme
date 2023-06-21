import { useEffect, useState } from "react"
import Users from "../users";
import "./Select.css"
import SongsList from "./Songs.json"

const SONG_COUNT = 5;

export default function Select(){
    const[songCount, setSongCount] = useState(1); 

    const changePage = (addNum) => {
        if(addNum == -1 && songCount - 1 > 0){
            setSongCount(songCount + addNum)
        }
        else if(addNum == 1 && songCount + 1 <= SONG_COUNT){
            setSongCount(songCount + addNum)
        }
        console.log(songCount);
    }

    const selectSong = (diff) => {
        var bpm = SongsList.songs[songCount - 1].bpm;
        var songTitle = SongsList.songs[songCount - 1].title;
        var diff = diff;

        window.location.href = `${process.env.PUBLIC_URL}/game?bpm=${bpm}&songTitle=${songTitle}&diff=${diff}`
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
                    <div id="Select-foot-level" onClick={() => selectSong(SongsList.songs[songCount - 1].diff.eazy)}>{SongsList.songs[songCount - 1].diff.eazy}</div>
                    <div id="Select-foot-level" onClick={() => selectSong(SongsList.songs[songCount - 1].diff.normal)}>{SongsList.songs[songCount - 1].diff.normal}</div>
                    <div id="Select-foot-level" onClick={() => selectSong(SongsList.songs[songCount - 1].diff.hard)}>{SongsList.songs[songCount - 1].diff.hard}</div>
                    <div id="Select-foot-level" onClick={() => selectSong(SongsList.songs[songCount - 1].diff.crazy)}>{SongsList.songs[songCount - 1].diff.crazy}</div>
                </div>
            </div>
        </div>
    )
}