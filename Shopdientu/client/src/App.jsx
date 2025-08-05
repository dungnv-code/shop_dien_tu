import { useState } from 'react'

import './App.css'
import { path } from "./ultils/path";
import { Public, Home, Login } from "./page/public";
import { Route, Routes } from "react-router-dom";
function App() {

  return (
    <>
      <div>
        <Routes>
          <Route path={path.PUBLIC} element={<Public />}>
            <Route path={path.HOME} element={<Home />}></Route>
            <Route path={path.LOGIN} element={<Login />}></Route>
          </Route>
        </Routes >
      </div >
    </>
  )
}

export default App
