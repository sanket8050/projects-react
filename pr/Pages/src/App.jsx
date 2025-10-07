import { BrowserRouter as Router ,Route,Routes } from 'react-router-dom'
import { useState } from 'react'
import './App.css'
import Navbar from '../pages/Navbar.jsx'
import Home from '../pages/Home'
import About from '../pages/About'
import Blog from '../pages/Blog'
import NotFound from '../pages/NotFound'


function App() {
 

  return (
    <>
    <Router>
      <Navbar/>
      
      <Routes>
        <Route path='/Home' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path = '/Blog' element={<Blog/>} />
        <Route path='*' element={<NotFound/>} />  
      </Routes>
    </Router>
    
    </>
  )
}

export default App
