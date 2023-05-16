import React from 'react'
import { FcDocument } from "react-icons/fc";
import { useNavigate, useParams } from "react-router-dom";
import MouseOverPopover from '../../Popover';
import { Button } from '@mui/material';
import BasicPopover from '../../OnClickpopover'

function Navbar() {
  const { id } = useParams();

  const arr = ['chat', 'log', 'acc'];
  const navigate = useNavigate();
  return (
    <div className='navbar'>
      <div className='left-side'>
        <div class="rename_area">
          <div className='logo'><FcDocument /></div>
          <div><input type="text" id="united_text" placeholder='enter name' style={{ border: '1px solid black', borderRadius: '7px' }} /></div>
        </div>
      </div>

      {id &&
        <div className='right-side' style={{ display: 'flex', flexDirection: 'row' }}>
          <BasicPopover>
            Create Room
          </BasicPopover>
          {
            arr.map(val => (
              <div onClick={() => alert(val)} style={{ display: 'flex', flexDirection: 'row' }}>
                <MouseOverPopover children={val} />
              </div>
            ))
          }
      


          {/* <CommentRoundedIcon value='chat' sx={{ fontSize: 30 }} style={{ marginRight: 30, cursor: 'pointer' }} v/>
        <PublishedWithChangesIcon value='restore' sx={{ fontSize: 30 }} style={{ marginRight: 30, cursor: 'pointer' }} />
        <AccountCircleIcon value='account' sx={{ fontSize: 30 }} style={{ marginRight: 30, cursor: 'pointer' }}/> */}

        </div>
      }
    </div>
  )
}

export default Navbar