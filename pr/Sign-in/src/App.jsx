import { useState } from 'react'
import Form from '../component/Form'
import './App.css'
import Select from '../component/Select'
import Navbar from '../component/Navbar'


import {  Routes,Route  } from 'react-router-dom' 
import Home from '../component/Home'
import Blogs from '../component/Blogs'
import Contact from '../component/Contact'

function App() {
 

  return (
   <>
  {/* <Form />
  <Select/>
  <Navbar/> */}
  <Navbar/>

  <Routes>
    <Route path='/' element={<Home/> }/>
    <Route path='/Blogs' element={<Blogs/> }/>
    <Route path='/Contact' element={<Contact/> }/>
  </Routes>
        
   </>
  )
}

export default App
