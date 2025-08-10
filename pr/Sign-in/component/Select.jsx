import React, { useState } from 'react'

function Select() {

  const [data,setdata] = useState('')

  const handle = (e)=>{
  const {value} = e.target;
  setdata(value)
  }
  return (
    <>
    <form  >
    <select  value={data} onChange={handle}>

      <option  value='s' >can</option>
      <option value='se' >dw</option>
      <option value='d' >d</option>
      <option value='r' >g</option>
      <option value='q' >feq</option>
    </select>

    </form>
    
    </>
  )
}

export default Select