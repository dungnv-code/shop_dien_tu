import { useState } from 'react'

import './App.css'
import { path } from "./ultils/path";
import { Public, Home, Login, Blog, DetailProduct, Servicer, FAQ, Contact, FinalRegister } from "./page/public";
import { Route, Routes } from "react-router-dom";
function App() {

  return (
    <>
      <div>
        <Routes>
          <Route path={path.PUBLIC} element={<Public />}>
            <Route path={path.HOME} element={<Home />}></Route>
            <Route path={path.BLOG} element={<Blog />}></Route>
            <Route path={path.DETAIL_PRODUCT_PID_TITLE} element={<DetailProduct />}></Route>
            <Route path={path.FAQ} element={<FAQ />}></Route>
            <Route path={path.CONTACT} element={<Contact />}></Route>
            <Route path={path.OUT_SERVICER} element={<Servicer />}></Route>
            <Route path={path.FINAl_REGISTER} element={<FinalRegister />}></Route>
          </Route>
          <Route path={path.LOGIN} element={<Login />}></Route>
        </Routes >
      </div >
    </>
  )
}

export default App
