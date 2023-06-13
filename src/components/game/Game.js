import { useEffect, useState } from "react";
import "./Game.css"

var KEYS = ["d", "f", "j", "k"]
    // https://kjsari99.tistory.com/3/ 리듬게임 박자 계산 블로그
// /* x축은 532부터 154씩 나눠짐, Y축은 105에 시작, 760에 판정선에 닿음*/
var JUDGE_X = [532, 686, 840, 994]
var JUDGE_Y = [105, 765, 790]

var bpm = 82
var appendYLoc = 4
var secondPer = bpm / 60;
var downDelay = secondPer / (660 / appendYLoc) // 660 / appendYLOC 만큼 내려옴

export default function Game(){
    const[noteCount, setNoteCount] = useState(0);

    useEffect(() => {
        document.addEventListener("keypress", (e) => {
            if(e.key == KEYS[0] || e.key == KEYS[1] || e.key == KEYS[2] || e.key == KEYS[3]){
                pressJudge("judge" + e.key, "judgement_press.jpg")
            }
        })
        document.addEventListener("keyup", (e) => {
            if(e.key == KEYS[0] || e.key == KEYS[1] || e.key == KEYS[2] || e.key == KEYS[3]){
                pressJudge("judge" + e.key, "judgement.jpg")
            }
        })

        makeNote(JUDGE_X[0]);
    }, [])

    const pressJudge = (key, judgeImg) => {
        document.getElementById(key).src = `${process.env.PUBLIC_URL}/imgs/${judgeImg}`
    }
    
    const makeNote = (locX) => {
        var noteName = `Game-note${noteCount}`
        var note = document.createElement("img")

        note.id = noteName;
        note.style = `border: 2px solid black; position: relative; left: ${locX}px;`;
        note.src = `${process.env.PUBLIC_URL}/imgs/note.jpg`
        document.getElementById("Game").prepend(note);
        
        setNoteCount(noteCount + 1);
        
        downNote(noteName, locX, JUDGE_Y[0], performance.now());
    }

    const downNote = (noteName, locX, locY, start) => {
        document.getElementById(noteName).style = `border: 2px solid black; position: relative; left: ${locX}px; top: ${locY}px;`;
        
        if(locY > JUDGE_Y[1]){
            console.log(performance.now())
            clearInterval(downNote)
            return 0;
        }
        
        locY += appendYLoc;
        setTimeout(() => {
            downNote(noteName, locX, locY);
        }, downDelay * 1000)
    }

    return(
        <div className="Game" id="Game">
            <div className="Game-head">
            </div>
            <div className="Game-body">
                <img className="Game-body-judge" id={`judge${KEYS[0]}`} src={`${process.env.PUBLIC_URL}/imgs/judgement.jpg`}></img>
                <img className="Game-body-judge" id={`judge${KEYS[1]}`} src={`${process.env.PUBLIC_URL}/imgs/judgement.jpg`}></img>
                <img className="Game-body-judge" id={`judge${KEYS[2]}`} src={`${process.env.PUBLIC_URL}/imgs/judgement.jpg`}></img>
                <img className="Game-body-judge" id={`judge${KEYS[3]}`} src={`${process.env.PUBLIC_URL}/imgs/judgement.jpg`}></img>
            </div>
        </div>
    )
}