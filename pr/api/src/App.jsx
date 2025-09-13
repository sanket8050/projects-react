import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { li } from 'framer-motion/client';

function App() {
  const [data,setdata] = useState([]);
  const [loading,setloading] = useState(false)
  const [error ,seterror] = useState(false)

 

  async function fething() {
    try {
      setloading(true)
      const response = await fetch('https://dummyjson.com/products')
      const data = await response.json();
      setdata(data.products)
    } catch (error) {
      
      
    }finally{
      setloading(false)
    }
  }
  useEffect(()=>{
    fething()
  },[])
  return (
    <>
    {loading ? <h1>Loading...</h1> : data.map((e)=>
      <li key={e.id}>{e.title }</li>
      // console.log(e.title);
      // console.log(e.id);
      // console.log(e);
      
    )}
    </>
  )
}
export default App
