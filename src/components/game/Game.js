import { useCallback, useEffect, useRef, useState } from "react";
import useInterval from "../../useInterval.js";
import "./Game.css"

// /* x축은 532부터 154씩 나눠짐, Y축은 105에 시작, 760에 판정선에 닿음*/
const KEYS = ["d", "f", "j", "k"]
const JUDGE_X = [532, 686, 840, 994]
const JUDGE_Y = [105, 700, 830, 770, 740, 790]
const KEYS_COUNT = 4;
const APPEND_Y = 4;

export default function Game(){
    const[notes, setNotes] = useState([]);
    const[downNotes, setDownNotes] = useState([]);
    const[inJudgeNotes, setInJudgeNotes] = useState([]);
    const dummbyCombo = useRef(0);
    const[combo, setCombo] = useState(0);
    const[successLevel, setSuccessLevel] = useState("");

    const[songInfo, setSongInfo] = useState({})

    const pressJudge = (key, judgeImg) => {
        document.getElementById(key).src = `${process.env.PUBLIC_URL}/imgs/${judgeImg}`
    }

    const onScoresEffect = () => {
        dummbyCombo.current++;
        setCombo(dummbyCombo.current);
        document.getElementById("Game-successLevel").style.animation = "successLevel-effect 0.1s linear infinite"
        document.getElementById("Game-combo").style.animation = "combo-effect 0.08s linear infinite";
        setTimeout(() => {
            document.getElementById("Game-combo").style.animation = "none";
        document.getElementById("Game-successLevel").style.animation = "none"
        }, 80)
    }

    const inputEvent_up = () => {
        window.addEventListener("keyup", (e) => {
            for(var i = 0; i < KEYS_COUNT; i++){
                if(e.key == KEYS[i]){
                    pressJudge("judge" + e.key, "judgement.jpg")
                }
            }
        })
    }

    const inputEvent = useCallback(event => {
        const {key, keycode} = event
        for(var i = 0; i < KEYS_COUNT; i++){
            if(key === KEYS[i]){
                // 만약 키 x축과 판정 노트의 x축이 같다면
                for(var j = 0; j < inJudgeNotes.length; j++){
                    if(JUDGE_X[i] == inJudgeNotes[j].locX && !inJudgeNotes[j].isSuccess){
                        // 성공하면 노트 디자인 안보이게함
                        inJudgeNotes[j].isSuccess = true;
                        inJudgeNotes[j].note.style = "display: none;"

                        onScoresEffect();
                        break;
                    }
                }

                pressJudge("judge" + key, "judgement_press.jpg")
            }
        }
    }, [])

    // 키보드 입력 이벤트 적용
    useEffect(() => {
        window.addEventListener("keypress", inputEvent);
    }, [inputEvent])

    const gameSetiing = () => {
        try{
            const params = new URLSearchParams(window.location.search);

            var bpm = params.get("bpm");
            var secondPer = bpm / 60;
    
            var emp_songInfo = {
                songTitle: params.get("songTitle"),
                diff: params.get("diff"),
                downDelay: secondPer / ((JUDGE_Y[1] - JUDGE_Y[0]) / APPEND_Y) / 4, // 660 / APPEND_Y 만큼 내려옴
                downNotespawnDelay: secondPer / 4
            }
    
            setSongInfo(emp_songInfo);
        } catch(e){
            alert("오류가 발생하였습니다.")
            window.location.href = `${process.env.PUBLIC_URL}/select`
        }
    }

    useEffect(() => {
        gameSetiing();
        inputEvent_up();
        makeNote();
    }, [])

    const makeNote = () => {
        var noteArr = []

        // 노트 html에 추가
        for(var i = 0; i < 15; i++){
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
            // window.location.href = `${process.env.PUBLIC_URL}/select`
        }
    }, songInfo.downNotespawnDelay * 1000)

    const downNote = (note, locX, locY, isJudge) => {
        // 내려오는 노트 정보 갱신
        note.style = `z-index: 10; width:154px; height:54px; border: 2px solid black; position: fixed; left: ${locX}px; top: ${locY}px;`;
        // 판정 시작
        if(locY >= JUDGE_Y[1] && !isJudge){
            // 판정 배열에 넣어줌
            var inJudgeNotesArr = inJudgeNotes;
            inJudgeNotesArr.push({
                note: note, 
                locX: locX,
                isSuccess: false
            });
            setInJudgeNotes(inJudgeNotesArr)
            isJudge = true;
        }
        // 노트 숨김
        if(locY >= JUDGE_Y[3]){ 
            note.style ="display: none";
        }
        // 100% 정확한 판정
        if(locY >= JUDGE_Y[4] && locY <= JUDGE_Y[5] && inJudgeNotes[0].isSuccess){
            setSuccessLevel("Nice!!");
            document.getElementById("Game-successLevel").style.color = "#f43b47";

            deleteNote(note);
            return 0;
        }
        // 80% 정확한 판정
        if(locY >= JUDGE_Y[2]){
            if(!inJudgeNotes[0].isSuccess){
                setSuccessLevel("");
                dummbyCombo.current = 0;
                setCombo(dummbyCombo.current);   
            }
            else if(inJudgeNotes[0].isSuccess){
                setSuccessLevel("Good!!");
                document.getElementById("Game-successLevel").style.color = "#ff7eb3";
            }

            deleteNote(note);
            return 0;
        }
        
        locY += APPEND_Y;

        // 노트 내려오는 딜레이
        setTimeout(() => {
            downNote(note, locX, locY, isJudge);
        }, songInfo.downDelay * 1000)
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
            <div id="Game-back" onClick={() => window.location.href=`${process.env.PUBLIC_URL}/select`}>◀</div>
            <div id="Game-combo">{combo}<br/>combo!!</div>
            <div id="Game-successLevel">{successLevel}</div>
            <div className="Game-body">
                <img className="Game-body-judge" id={`judge${KEYS[0]}`} src={`${process.env.PUBLIC_URL}/imgs/judgement.jpg`}></img>
                <img className="Game-body-judge" id={`judge${KEYS[1]}`} src={`${process.env.PUBLIC_URL}/imgs/judgement.jpg`}></img>
                <img className="Game-body-judge" id={`judge${KEYS[2]}`} src={`${process.env.PUBLIC_URL}/imgs/judgement.jpg`}></img>
                <img className="Game-body-judge" id={`judge${KEYS[3]}`} src={`${process.env.PUBLIC_URL}/imgs/judgement.jpg`}></img>
            </div>
        </div>
    )
}