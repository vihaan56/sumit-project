import React,{useState} from "react";
import { FcDocument } from "react-icons/fc";
import { MdOutlineMessage } from "react-icons/md";
import { BsFolder } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import MessageIcon from "@mui/icons-material/Message";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import GroupsIcon from "@mui/icons-material/Groups";
// import MouseOverPopover from "../../Popover";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

function Navbar({ handleform, handledocument, handlejoinroom ,socket}) {
  const arr = ["chat", "log", "acc"];
  const [untitled,setuntitled] = useState("Untitled Document");
  const handleinput = (e)=>{
    console.log(e.target.value);
    // here we axios request
  }
  const handlechange = (event)=>{
       setuntitled(event.target.value)
  }
  return (
    <div className="navbar">
      <div className="left-side">
        <div className="rename_area">
          <div className="logo">
            <FcDocument />
          </div>
          <div>
            <input type="text" id="united_text" value={untitled} onChange={handlechange} onBlur={handleinput} />
          </div>
        </div>
      </div>
      <div
        className="right-side"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <div className="button_group">
         
            <Button
              onClick={handleform}
              variant="contained"
              className="nav_button"
            >
              create room
            </Button>
          
        </div>
        <div className="righttray">
          <div className="chat">
            <Tooltip title="chat">
              <IconButton>
                <MessageIcon style={{ fontSize: "1.09em" }} />
              </IconButton>
            </Tooltip>
          </div>
          <div className="logs">
            <Tooltip title="documents">
              <IconButton  onClick={handledocument}>
                <FolderOpenIcon
                  style={{ fontSize: "1.09em" }}
                />
              </IconButton>
            </Tooltip>
          </div>

          <div className="logs">
            <Tooltip title="join room">
              <IconButton onClick={handlejoinroom}>
                <GroupsIcon
                  style={{ fontSize: "1.09em" }}
                />
              </IconButton>
            </Tooltip>
          </div>

          <div className="profile icon">
            <IconButton>
              <PermIdentityIcon style={{ fontSize: "1.09em" }} />
            </IconButton>
          </div>
        </div>
        {/* {
          arr.map(val => (
            <div onClick={() => alert(val)} style={{ display: 'flex', flexDirection: 'row'  }}>
              <MouseOverPopover children={val} />
            </div>
          ))
        } */}

        {/* <CommentRoundedIcon value='chat' sx={{ fontSize: 30 }} style={{ marginRight: 30, cursor: 'pointer' }} v/>
        <PublishedWithChangesIcon value='restore' sx={{ fontSize: 30 }} style={{ marginRight: 30, cursor: 'pointer' }} />
        <AccountCircleIcon value='account' sx={{ fontSize: 30 }} style={{ marginRight: 30, cursor: 'pointer' }}/> */}
      </div>
    </div>
  );
}

export default Navbar;
