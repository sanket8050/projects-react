import   { useEffect, useState } from 'react'

function Fetch() {

    const [data , setdata] = useState([]);
    
    useEffect(()=>{
        fetch("https://jsonplaceholder.typicode.com/users")
        .then((res)=>res.json())
        .then((res)=>setdata(res))  
    },[])
  return (
    <>
    <p>user</p>
    <ul>

        {data.map((e)=>(
            <li key={e.id}>{e.name}</li>
            
        ))}
    </ul>
    
    </>
  )
}

export default Fetch