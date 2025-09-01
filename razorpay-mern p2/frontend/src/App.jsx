
import './App.css'
import Card from "../src/components/Card"
import axios from 'axios'



function App() {
  const checkout = async (amount)=>{
    const { data } =  await axios.post("http://localhost:4000/api/checkout",{
      amount
    })
      console.log(data);
    
  }
  
  
 

  return (
  <div className="flex flex-col md:flex-row gap-4 items-center  ">
    <Card amount={5000} img="https://cdn.pixabay.com/objects3d/2025/08/11/09-16-28-881/render_720_720_0_340_0.png" checkout={checkout}/>

    <Card amount={3000} img="https://cdn.pixabay.com/photo/2017/04/03/15/52/mobile-phone-2198770_1280.png" checkout={checkout}/>

    <Card  img={"https://cdn.pixabay.com/photo/2025/08/26/16/58/guy-9798371_1280.png"} amount={500} checkout={checkout}  />
</div>

  )
}

export default App
