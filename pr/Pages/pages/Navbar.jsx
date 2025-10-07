
import {Link} from 'react-router-dom'

function Navbar() {
  return (
    <>
   <div className=' '>
     <nav className=''>
        <ul className="flex gap-6">
            <li>
                <Link to="/Home">Home</Link>
            </li>
            <li>
                <Link to="/About">cnvn</Link>
            </li>
            <li>
                <Link to="/Blog">Blog</Link>
            </li>

            <li>
                <Link to="*"></Link>
            </li>
        </ul>

    </nav>
   </div>
    </>
  )
}

export default Navbar