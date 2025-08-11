import { BrowserRouter as Router ,Route,Routes, BrowserRouter } from 'react-router-dom'
import { useState } from 'react'
import './App.css'
import Navbar from '../pages/Navbar'
import Home from '../pages/Home'
import About from '../pages/About'
import Blog from '../pages/Blog'
import NotFound from '../pages/NotFound'


function App() {
 

  return (
    <>
    <BrowserRouter>
      <Navbar/>

      <Routes>
        <Route path='/Home' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path = '/Blog' element={<Blog/>} />
        <Route path='*' element={<NotFound/>} />  
      </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default App
