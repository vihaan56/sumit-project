import React,{useState} from 'react'
import { FcDocument } from "react-icons/fc";
function Navbar() {

  const [untitled,setuntitled] = useState("Untitled Document");
  return (
    <div className='navbar'>
      <div className='left-side'>
        <div class="rename_area">
        <div className='logo'><FcDocument/></div>
        <div><input type="text" id="united_text" value={untitled} onChange={(e)=>setuntitled(e.target.value)}></input></div>
        </div>
      </div>
      <div className='right-side'>
        <button className="button_primary" type="button">Login</button>
      </div>

    </div>
  )
}

export default Navbar