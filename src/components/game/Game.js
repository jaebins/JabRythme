import { useCallback, useEffect, useRef, useState } from "react";
import cookies from "react-cookies"
import useInterval from "../../useInterval.js";
import "./Game.css"
import chart_json from "./Chart.json"
import { clear } from "@testing-library/user-event/dist/clear.js";

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
    const[chart, setChart] = useState({
        time: 1
    });
    const[music, setMusic] = useState(0);
    const[isMusicEnd, setIsMusicEnd] = useState(false)
    const[isEnd, setIsEnd] = useState(false);
 
    const[songInfo, setSongInfo] = useState({})
    const[rsInfo, setRsInfo] = useState({
        mCombo: 0,
        score: 0
    })

    const pressJudge = (key, judgeImg) => {
        document.getElementById(key).src = `${process.env.PUBLIC_URL}/imgs/${judgeImg}`
    }

    const changeRs = (score) => {
        dummbyCombo.current++;
        setCombo(dummbyCombo.current);

        var emp_rsInfo = {
            mCombo: dummbyCombo.current >= rsInfo.mCombo ? dummbyCombo.current : rsInfo.mCombo,
            score: rsInfo.score += score
        }

        setRsInfo(emp_rsInfo);
        console.log(rsInfo);
    }

    const comboEffect = () => {
        document.getElementById("Game-successLevel").style.animation = "successLevel-effect 0.1s linear infinite"
        document.getElementById("Game-combo").style.animation = "combo-effect 0.08s linear infinite";
        setTimeout(() => {
            document.getElementById("Game-combo").style.animation = "none";
            document.getElementById("Game-successLevel").style.animation = "none"
        }, 80)
    }

    const inputEvent_up = () => {
        window.addEventListener("keyup", (e) => {
            for(let i = 0; i < KEYS_COUNT; i++){
                if(e.key == KEYS[i]){
                    pressJudge("judge" + e.key, "judgement.jpg")
                }
            }
        })
    }

    const gameSetiing = () => {
        try{
            if(cookies.load("scrollSpeed") == undefined){
                cookies.save("scrollSpeed", 1);
            }

            const params = new URLSearchParams(window.location.search);
            if(params.size < 3){
                window.location.href = `${process.env.PUBLIC_URL}/select`
            }
            
            let bpm = params.get("bpm");
            let secondPer = bpm / 60;
            
            let emp_songInfo = {
                songTitle: params.get("songTitle"),
                diff: params.get("diff"),
                downDelay: (secondPer / ((JUDGE_Y[1] - JUDGE_Y[0]) / APPEND_Y)) / (cookies.load("scrollSpeed") / 2), // 660 / APPEND_Y 만큼 내려옴
                downNotespawnDelay: secondPer
            }
            
            setSongInfo(emp_songInfo);
            
            var audio = document.getElementById("Game-music");
            audio.src = `${process.env.PUBLIC_URL}/songs/${emp_songInfo.songTitle}/${emp_songInfo.songTitle}.mp3`
            audio.onloadedmetadata = () => {
                var musicLengthBar = document.getElementById("Game-musicLength");
                musicLengthBar.value = 0;
                musicLengthBar.min = 0;
                musicLengthBar.max = Math.floor(audio.duration);
                audio.play();
                setMusic(audio);
            }
        } catch(e){
            alert(e)
            window.location.href = `${process.env.PUBLIC_URL}/select`
        }
    }

    const makeNote = () => {
        let noteArr = []

        // 노트 html에 추가
        for(let i = 0; i < 30; i++){
            let noteName = `Game-note${i}`
            let note = document.createElement("img")

            note.id = noteName;
            note.style = `display: none;`;
            note.src = `${process.env.PUBLIC_URL}/imgs/note.jpg`
            document.getElementById("Game").prepend(note);

            noteArr.push(note);
            setNotes(noteArr);
        }
    }

    useEffect(() => {
        inputEvent_up();
        gameSetiing();
        makeNote();

        return () => {
            window.removeEventListener("keyup", inputEvent_up);
        }
    }, [])

    const inputEvent = useCallback(e => {
        const {key, keycode} = e;
        for(let i = 0; i < KEYS_COUNT; i++){
            if(key === KEYS[i]){
                // 만약 키 x축과 판정 노트의 x축이 같다면
                for(let j = 0; j < inJudgeNotes.length; j++){
                    if(JUDGE_X[i] == inJudgeNotes[j].locX && !inJudgeNotes[j].isSuccess){
                        // 성공하면 노트 디자인 안보이게함
                        inJudgeNotes[j].isSuccess = true;
                        inJudgeNotes[j].note.style = "display: none;"
                        comboEffect();
                        
                        break;
                    }
                }

                pressJudge("judge" + key, "judgement_press.jpg");
            }
        }
    }, [])

    // 키보드 입력 이벤트 적용
    useEffect(() => {
        if(!isEnd)
            window.addEventListener("keypress", inputEvent);
    }, [inputEvent])

    useEffect(() => {
        setIsMusicEnd(music.currentTime >= music.duration)

        if(isMusicEnd){
            setTimeout(() => {
                setIsEnd(true);
            }, 3000)
        }
        else{
            document.getElementById("Game-musicLength").value = music.currentTime;
        }
    }, [music.currentTime])
    
    const noteEvent = useInterval(() => {
        if(!isMusicEnd){
            try{
                let emp_chart = {
                    time: chart_json.pattern[0].time[Math.floor(Math.random() * chart_json.pattern[0].time.length)],
                    loc: chart_json.pattern[0].loc[Math.floor(Math.random() * chart_json.pattern[0].loc.length)], 
                    cnt : chart_json.pattern[0].cnt[Math.floor(Math.random() * chart_json.pattern[0].cnt.length)]
                }
                setChart(emp_chart);
                // 내려오는 노트 정보
                let note = notes.pop()
                
                // 내려오는 노트 정보 배열에 넣어줌
                let downNotesArr = downNotes;
                downNotesArr.push(note);
                setDownNotes(downNotesArr);
                
                // 노트 나오는 위치 난수 설정
                let index = Math.floor(Math.random() * 4)
                downNote(note, JUDGE_X[index], JUDGE_Y[0], false);
            } catch(e){
                window.location.href = `${process.env.PUBLIC_URL}/select`
            }
        }
    }, (songInfo.downNotespawnDelay / chart.time) * 1000)

    const downNote = (note, locX, locY, isJudge) => {
        // 내려오는 노트 정보 갱신
        note.style = `z-index: 10; width:154px; height:54px; border: 2px solid black; position: fixed; left: ${locX}px; top: ${locY}px;`;
        // 판정 시작
        if(locY >= JUDGE_Y[1] && !isJudge){
            // 판정 배열에 넣어줌
            let inJudgeNotesArr = inJudgeNotes;
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
            changeRs(1500);
            
            document.getElementById("Game-successLevel").style.color = "#f43b47";

            deleteNote(note);
            return 0;
        }
        // 80% 정확한 판정
        if(locY >= JUDGE_Y[2]){
            // 실패시
            if(!inJudgeNotes[0].isSuccess){
                setSuccessLevel("");
                dummbyCombo.current = 0;
                setCombo(dummbyCombo.current);   
            }
            else if(inJudgeNotes[0].isSuccess){
                setSuccessLevel("Good!!");
                changeRs(750);

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
        let downNotesArr = downNotes;
        let note = downNotesArr.shift();
        setDownNotes(downNotesArr);

        note.style = `display: none;`;

        // 판정선에 닿은 내려오는 노트 원래 노트 스택에 넣어줌
        let notesArr = notes;
        notesArr.push(note);
        setNotes(notesArr);

        // 판정 배열에서 뱀
        let inJudgeNotesArr = inJudgeNotes;
        inJudgeNotesArr.shift();
        setInJudgeNotes(inJudgeNotesArr)
    } 

    return(
        <div className="Game" id="Game">
            {!isEnd ? 
                <div>
                    <audio id="Game-music"></audio>
                    <div className="Game-head">
                        <div id="Game-back" onClick={() => window.location.href=`${process.env.PUBLIC_URL}/select`}>◀</div>
                        <input id="Game-musicLength" type="range"></input>
                    </div>
                    <div id="Game-combo">{combo}<br/>combo!!</div>
                    <div id="Game-successLevel">{successLevel}</div>
                    <div className="Game-body">
                        <img className="Game-body-judge" id={`judge${KEYS[0]}`} src={`${process.env.PUBLIC_URL}/imgs/judgement.jpg`}></img>
                        <img className="Game-body-judge" id={`judge${KEYS[1]}`} src={`${process.env.PUBLIC_URL}/imgs/judgement.jpg`}></img>
                        <img className="Game-body-judge" id={`judge${KEYS[2]}`} src={`${process.env.PUBLIC_URL}/imgs/judgement.jpg`}></img>
                        <img className="Game-body-judge" id={`judge${KEYS[3]}`} src={`${process.env.PUBLIC_URL}/imgs/judgement.jpg`}></img>
                    </div>
                </div>
             :
                <div className="Result">
                    <div className="Result-head">
                        <div id="Result-head-title">RESULT</div>
                    </div>
                    <div className="Result-body">
                        <div id="Result-body-mCombo">MAX COMBO : {rsInfo.mCombo}</div>
                        <div id="Result-body-score">SCORE : {rsInfo.score}</div>
                        <div id="Result-body-rank">RANK : {rsInfo.rank}</div>
                    </div>
                </div>
            }
        </div>
    )
}