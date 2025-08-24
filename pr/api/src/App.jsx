import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [data,setdata] = useState([]);
  const [loading,setloading] = useState(false)
  const [error ,seterror] = useState(false)

 

  async function fething() {
    try {
      setloading(true)
      const response = await fetch('https://dummyjson.com/products')
      const data = await response.json();
      setdata(data)
    } catch (error) {
      
      
    }finally{
      setloading(false)
    }
  }
  useEffect(()=>{
    fething()
  })
  return (
    <>
    { loading ? <p>loading...</p> : 
    
    (

      <ul>{data.length > 0 ? (data.map((data)=>{}))}</ul>
    )
    }
    </>
  )
}

export default App
