import  { useEffect, useState } from 'react'

function Clock() {
    const [time,settime] = useState(new Date())

    useEffect(()=>{
        const interval = setInterval(() => {
            settime(new Date())
        }, 1000);
        return ()=>clearInterval(interval);
    },[])

    const formattime = (time)=>
        (time < 10 ? `0${time}` : time);
    
  return (
    <>
        <h1>
            {formattime(time.getHours())}:
            {formattime(time.getMinutes())}:
            {formattime(time.getSeconds())}
        </h1>
    </>
  )
}

export default Clock