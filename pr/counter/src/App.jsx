import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'



function App() {

  let [counter,setCounter] = useState(0)

const increase = ()=>{
  if(counter < 20 ){
    setCounter(counter+1);
  }
  else{
    alert("limit is 20")
  }
};
const decrease =()=>{
  if(counter >0){
    setCounter (counter-1);

  }
  else{
    alert("limit is 0")
  }
}
 

  return (
   <>
   <h2>counter</h2>

    <h3>counting : {counter}</h3>
   <button onClick={increase()}>increase</button>
   <button onClick={decrease}>decrease</button>
   </>
  )
}

export default App
