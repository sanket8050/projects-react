    import React, { useEffect, useState } from 'react'

    function Index() {

        const [data,setdata] = useState([]);
        useEffect(()=>{
            (async()=>{
                const array = await fetch('https://dummyjson.com/products')
                const x = await array.json();
                setdata(x)

            })()
        },[])

    return (
        <>
        <h1>{data}</h1>
        
        </>
    )
    }

    export default Index