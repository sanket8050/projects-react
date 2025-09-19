"use client"
import { useState } from 'react'

function Home() {

    const [data,setdata] = useState("")
    const [loading,setloading] = useState(false)

    const handlesubmit = async ()=>{
    
    }
  return (
    <form onSubmit={handlesubmit} className='flex min-h-screen flex-col items-center justify-center m-auto' >
        <input type="text" placeholder='sanket'/>
        <input type="text" placeholder='sanket'/>
        <input type="text" placeholder='sanket'/>

        <button type='submit' >post</button>
    </form>
  )
}

export default Home

