
import './App.css'
  
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Paymentsuccess from './components/Paymentsuccess'
import Navbar from './components/Navbar'

function App() {
  return (
<Router>
  <Routes>
    
    <Route path="/" element={<Home/>} />
    {/* <Route path="/successPayment" element={<Paymentsuccess/>} /> */}
    <Route path="/paymentsuccess" element={<Paymentsuccess />} />
  </Routes>
</Router>

  )
}


export default App
