import { useEffect, useState } from "react";
import useInterval from "../../useInterval.js";
import "./Game.css"

// /* x축은 532부터 154씩 나눠짐, Y축은 105에 시작, 760에 판정선에 닿음*/
const KEYS = ["d", "f", "j", "k"]
const JUDGE_X = [532, 686, 840, 994]
const JUDGE_Y = [105, 720, 770]
const KEYS_COUNT = 4;


var bpm = 82
var secondPer = bpm / 60;
var appendYLoc = 4
var downDelay = secondPer / ((JUDGE_Y[1] - JUDGE_Y[0]) / appendYLoc) // 660 / appendYLOC 만큼 내려옴
var downNotespawnDelay = secondPer / 2;

export default function Game(){
    const[notes, setNotes] = useState([]);
    const[downNotes, setDownNotes] = useState([]);
    const[inJudgeNotes, setInJudgeNotes] = useState([]);
    const[score, isScore] = useState(0);

    const pressJudge = (key, judgeImg) => {
        document.getElementById(key).src = `${process.env.PUBLIC_URL}/imgs/${judgeImg}`
    }

    useEffect(() => {
        document.addEventListener("keypress", (e) => {
            for(var i = 0; i < KEYS_COUNT; i++){
                if(e.key === KEYS[i]){
                    // 만약 키 x축과 판정 노트의 x축이 같다면
                    for(var j = 0; j < inJudgeNotes.length; j++){
                        if(JUDGE_X[i] == inJudgeNotes[j].locX){
                            console.log("성공");
                            inJudgeNotes[0].note.style = "display: none"
                            isScore(score + 1);
                            break;
                        }
                    }
                    pressJudge("judge" + e.key, "judgement_press.jpg")
                }
            }
        })
        document.addEventListener("keyup", (e) => {
            for(var i = 0; i < KEYS_COUNT; i++){
                if(e.key == KEYS[i]){
                    pressJudge("judge" + e.key, "judgement.jpg")
                }
            }
        })

        makeNote();
    }, [])

    const makeNote = () => {
        var noteArr = []

        // 노트 html에 추가
        for(var i = 0; i < 9; i++){
            var noteName = `Game-note${i}`
            var note = document.createElement("img")

            note.id = noteName;
            note.style = `display: none;`;
            note.src = `${process.env.PUBLIC_URL}/imgs/note.jpg`
            document.getElementById("Game").prepend(note);

            noteArr.push(note);
            setNotes(noteArr);
        }
    }
    
    const noteEvent = useInterval(() => {
        try{
            // 내려오는 노트 정보
            var note = notes.pop()
    
            // 내려오는 노트 정보 배열에 넣어줌
            var downNotesArr = downNotes;
            downNotesArr.push(note);
            setDownNotes(downNotesArr);
            
            // 노트 나오는 위치 난수 설정
            var index = Math.floor(Math.random() * 4)
            downNote(note, JUDGE_X[index], JUDGE_Y[0], false);
        } catch(e){
            alert(e);
        }
    }, downNotespawnDelay * 1000)

    const downNote = (note, locX, locY, isJudge) => {
        // 내려오는 노트 정보 갱신
        note.style = `z-index: 10; width:154px; height:54px; border: 2px solid black; position: fixed; left: ${locX}px; top: ${locY}px;`;
        if(locY >= JUDGE_Y[1] && !isJudge){
            // 판정 배열에 넣어줌
            var inJudgeNotesArr = inJudgeNotes;
            inJudgeNotesArr.push({
                note: note, 
                locX: locX
            });
            setInJudgeNotes(inJudgeNotesArr)
            isJudge = true;
        }
        if(locY >= JUDGE_Y[2]){
            deleteNote(note);
            
            // 내려오는 이벤트 종료
            clearInterval(downNote);
            return 0;
        }
        
        locY += appendYLoc;

        // 노트 내려오는 딜레이
        setTimeout(() => {
            downNote(note, locX, locY, isJudge);
        }, downDelay * 1000)
    }

    const deleteNote = () => {
        
        // 판정선에 닿은 내려오는 노트 스택에서 뺌
        var downNotesArr = downNotes;
        var note = downNotesArr.shift();
        setDownNotes(downNotesArr);

        note.style = `display: none;`;

        // 판정선에 닿은 내려오는 노트 원래 노트 스택에 넣어줌
        var notesArr = notes;
        notesArr.push(note);
        setNotes(notesArr);

        // 판정 배열에서 뱀
        var inJudgeNotesArr = inJudgeNotes;
        inJudgeNotesArr.shift();
        setInJudgeNotes(inJudgeNotesArr)
    } 

    return(
        <div className="Game" id="Game">
            <h1>{score}</h1>
            <div className="Game-body">
                <img className="Game-body-judge" id={`judge${KEYS[0]}`} src={`${process.env.PUBLIC_URL}/imgs/judgement.jpg`}></img>
                <img className="Game-body-judge" id={`judge${KEYS[1]}`} src={`${process.env.PUBLIC_URL}/imgs/judgement.jpg`}></img>
                <img className="Game-body-judge" id={`judge${KEYS[2]}`} src={`${process.env.PUBLIC_URL}/imgs/judgement.jpg`}></img>
                <img className="Game-body-judge" id={`judge${KEYS[3]}`} src={`${process.env.PUBLIC_URL}/imgs/judgement.jpg`}></img>
            </div>
        </div>
    )
}