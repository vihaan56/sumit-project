import React, { useState, useEffect } from "react";
import { FcDocument } from "react-icons/fc";
import { MdOutlineMessage } from "react-icons/md";
import { BsFolder } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import MessageIcon from "@mui/icons-material/Message";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import IosShareIcon from "@mui/icons-material/IosShare";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";

import { Navigate } from "react-router-dom";
import GroupsIcon from "@mui/icons-material/Groups";
// import MouseOverPopover from "../../Popover";
import { Button, colors } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";
import { deepOrange, deepPurple, teal, pink } from "@mui/material/colors";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";

function Navbar({
  handleform,
  handledocument,
  handlejoinroom,
  handleexitroom,
  handlepopup,
  socket,
  handlechatbox,
}) {
  const colors = [deepOrange[500], deepPurple[500], teal[500], pink[500]];
  const [untitled, setuntitled] = useState("Untitled Document");
  const [activename, setactivename] = useState([]);
  const [count, setcount] = useState(0);
  useEffect(() => {
    if (localStorage.getItem("doc_id")) {
      axios({
        url: "http://localhost:3002/api/v1/routes/document_title",
        method: "POST",
        data: { doc_id: localStorage.getItem("doc_id") },
      })
        .then((response) => {
          setuntitled(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    // if(localStorage.getItem("roomName")){
    //     axios({
    //       url: "http://localhost:3002/api/v1/routes/num_room_user",
    //       method: "POST",
    //       data: { room_name: localStorage.getItem("roomName") },
    //     })
    //       .then((response) => {
    //         setcount(response.data.data.length);
    //       })
    //       .catch((error) => {
    //         console.log(error);
    //       });
    //     };
  }, []);

  if (socket) {
    socket.on("broadcast_update_title", (data) => {
      setuntitled(data);
    });
  }
  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {});

      socket.on("activeUsersCount", ({ activeusers }) => {
        if (activeusers) {
          setactivename(activeusers);
          setcount(activeusers.length);
        }
        //  setcount(count);
      });
    }
  }, [socket]);
  const handleinput = (e) => {
    const doc_id = localStorage.getItem("doc_id");
    var update_title = e.target.value;

    axios({
      url: "http://localhost:3002/api/v1/routes/document_title_update",
      method: "POST",
      data: { doc_id: doc_id, update_title: update_title },
    })
      .then((response) => {
        if (socket) {
          socket.emit("update_title", update_title);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // here we axios request
  };
  const handlechange = (event) => {
    setuntitled(event.target.value);
  };

  return (
    <div className="navbar">
      <div className="left-side">
        <div className="rename_area">
          <div className="logo">
            <FcDocument />
          </div>
          <div>
            {(localStorage.getItem("token"))  ? (
              <input
                type="text"
                id="united_text"
                value={untitled}
                onChange={handlechange}
                onBlur={handleinput}
              />
            ) :(localStorage.getItem("roomName") === undefined || localStorage.getItem("roomName") == null)?(
                 <input
                type="text"
                id="united_text"
                value={untitled}
                onChange={handlechange}
                onBlur={handleinput}
              />

            ): (
              <div id="united_text">{untitled}</div>
            )}
          </div>
        </div>
      </div>
      <div
        className="right-side"
        style={{ display: "flex", flexDirection: "row" }}
      >
        {!localStorage.getItem("roomName") ? (
          <>
            <div className="button_group">
              <Button
                onClick={handleform}
                variant="contained"
                className="nav_button"
              >
                create room
              </Button>
            </div>
          </>
        ) : (
          ""
        )}

        <div className="righttray">
          {!localStorage.getItem("roomName") ? (
            <>
              <div className="logs">
                <Tooltip title="join room">
                  <IconButton onClick={handlejoinroom}>
                    <GroupsIcon style={{ fontSize: "1.09em" }} />
                  </IconButton>
                </Tooltip>
              </div>
            </>
          ) : (
            <>
              <div className="room_name">
                {localStorage.getItem("roomName")}
              </div>

              <div className="avatar">
                <AvatarGroup total={count}>
                  {count > 3
                    ? activename &&
                      activename.slice(0, 3).map((data, index) => {
                        var splitstring = data.split("$$");
                        console.log(splitstring);
                        return (
                          <Avatar
                            sx={{ fontSize: "12px", bgcolor: colors[index] }}
                          >
                            {splitstring[2][0]}
                          </Avatar>
                        );
                      })
                    : activename &&
                      activename.map((data, index) => {
                        var splitstring = data.split("$$");
                        console.log(splitstring);

                        return (
                          <Avatar
                            sx={{ fontSize: "12px", bgcolor: colors[index] }}
                          >
                            {splitstring[2][0].toUpperCase()}
                          </Avatar>
                        );
                      })}
                </AvatarGroup>
              </div>
              <div className="exit_room">
                <Tooltip title="Exit from room">
                  <IconButton onClick={handleexitroom}>
                    <ExitToAppIcon style={{ fontSize: "1.09em" }} />
                  </IconButton>
                </Tooltip>
              </div>

              <div className="share_room">
                <Tooltip title="Share room link" onClick={handlepopup}>
                  <IconButton>
                    <IosShareIcon style={{ fontSize: "1.09em" }} />
                  </IconButton>
                </Tooltip>
              </div>
            </>
          )}

          {/* <div className="chat">
            <Tooltip title="chat">
              <IconButton onClick={handlechatbox}>
                <MessageIcon style={{ fontSize: "1.09em" }} />
              </IconButton>
            </Tooltip>
          </div> */}
          {/* <div className="logs">
            <Tooltip title="documents">
              <IconButton onClick={handledocument}>
                <FolderOpenIcon style={{ fontSize: "1.09em" }} />
              </IconButton>
            </Tooltip>
          </div> */}

          {/* <div className="profile icon">
            <IconButton>
              <PermIdentityIcon style={{ fontSize: "1.09em" }} />
            </IconButton>
          </div> */}
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
