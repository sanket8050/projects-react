  import React from 'react'
  import { useEffect,useState,useRef } from 'react'
  function App() {

    const [password ,setpassword] = useState('')
    const [includechar , setincludechar] = useState(false)
    const [length,setlength] = useState(8)
    const [includenum, setincludenum] = useState(false)
    const passref = useRef(null)


    const generatePassword  = () => {

      let  chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      
      if(includechar) chars+= '!@#$%^&*()_-+=[]{}|;:,.<>?'
      if(includenum) chars += '01223456789'
      let result = ''
      
      for(let i =0 ;i<length;i++){
        let index = Math.floor(Math.random()*chars.length);
        result += chars[index];
      }

      setpassword(result);

      

    
    };
    const copypass = ()=>{
      window.navigator.clipboard.writeText(password)
      passref.current?.select()
    } 

    useEffect(()=>{generatePassword();
        },[includechar,includenum,length])

    return (
      <>
      <div className=" items-center mt-80 ml-120 border mr-120 rounded-3xl bg-purple-500 pl-3">
        <div className="items-center flex ">
          <input className='outline rounded-2xl bg-amber-200 w-150 py-1 font-bold px-3 my-5' type="text" 
          placeholder='password'
          value={password} 
          readOnly 
          ref = {passref}  
          />

          <button className='bg-green-700 font-medium flex  rounded-4xl p-1 pr-5 pl-5 border ml-1' onClick={copypass}>copy</button>
        </div>

        <div className='flex gap-10'>

          <div className='font-bold' >
            <input type="range" value={length} min={8} max={100}  onChange={(e)=>setlength(e.target.value)} />
            <label htmlFor="length" > length : {length}</label>
          </div>
          <div className='font-bold' >
            <input type="checkbox"  checked={includechar} onChange={()=>{setincludechar(prev => !prev)}} />
            <label htmlFor="char" >include char</label>
          </div>
          <div className='font-bold' >
            <input type="checkbox" checked={includenum} onClick={()=>{setincludenum(prev => !prev)}} />
            <label htmlFor="number">include number </label>
          </div>
        </div>
      </div>

      </>
      
    )
  }

  export default App