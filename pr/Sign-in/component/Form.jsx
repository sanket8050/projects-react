import React, { useState } from 'react'


function Form() {

  const [data,setdata ] = useState({
    name : '',
    age : '',
    email:''
  })

  const handledata = (e)=>{
    const {name, value} = e.target;
    setdata({
      ...data,
      [name] : value
    })
  }

  const handlesubmit = (e)=>{
    e.preventDefault();
    console.log({data});
    setdata({
      name:'',
      age:'',
      email:''
    })
    
  }
  return (
    <>
    <form action="" onSubmit={handlesubmit}>

      <label htmlFor="name"></label>
      <input type="text" id='name' name='name' value={data.name.target} placeholder='name of' onChange={handledata}/>

      <label htmlFor="age"></label>
      <input type="number" id='age' name='age' value={data.age.target} placeholder='age of' onChange={handledata}/>

      <label htmlFor="email"></label>
      <input type="email" id='email' name='email' value={data.email.target} placeholder='email of' onChange={handledata}/>


    <button  type='submit'> submit</button>
    </form>

    <p>data ={ JSON.stringify(data)}</p>
    </>
  )
}

export default Form