import React from 'react';
import ReactDOM from 'react-dom/client';
import cookies from "react-cookies"
import './index.css';
import Main from './components/main/Main.js';
import Select from './components/select/Select.js';
import Game from "./components/game/Game.js"
import Setting from "./components/setting/setting.js"
import Login from './components/login/Login.js';
import Register from './components/login/Register.js';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Main/>}></Route>
      <Route path='/select' element={<Select/>}></Route>
      <Route path="/game" element={<Game/>}></Route>
      <Route path="/setting" element={<Setting/>}></Route>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/register" element={<Register/>}></Route>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
