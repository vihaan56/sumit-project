import React, { useEffect, useRef, useState } from "react";
// import ReactQuill from "react-quill";
import Quill from "quill";
import * as Y from "yjs";
import { QuillBinding } from "y-quill";
import axios from "axios";
import Cursors from "quill-cursors";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

import "quill/dist/quill.snow.css";
import {
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Assignment as AssignmentIcon } from "@mui/icons-material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import io from "socket.io-client";
import Navbar from "./Navbar";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Popover,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import { Navigate, useParams } from "react-router-dom";
import ScrollableFeed from "react-scrollable-feed";

import { v4 as uuid } from "uuid";
import { TextareaAutosize } from "@mui/material";
// import TextField from '@mui/material/TextField';

import RightBubble from "./RightBubble";
import LeftBubble from "./LeftBubble";

const textareaStyle = {
  resize: "none",
  outline: "none",
  width: "100%",
  maxHeight: "40px",
  overflowY: "auto",
  boxSizing: "border-box",
  borderRadius: "8px",
  border: "1px solid #c7c7c7",
  padding: "8px",
  fontFamily: "inherit",
  fontSize: "0.9rem",
  fontWeight: "500",
};
const bottomDivStyle = {
  borderTop: "1px solid #ccc",
  borderBottom: "none",
  borderLeft: "none",
  borderRight: "none",
  width: "100%",
  minHeight: "20px",
  // marginLeft:'3px',
  marginTop: "auto",

  // marginRight:'3px'
};

const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote"],

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    // [{ 'direction': 'rtl' }],                         // text direction

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ align: [] }],

    // ['clean']                                         // remove formatting button
  ],
};

// const host = "http://localhost:3002";

// var socket = io(host);

let socket;

function Editor() {
  const [message, setmessage] = useState("");
  const [createromloading, setcreateroomloading] = useState(false);
  const [yDoc, setYdoc] = useState(null);
  const [yText, setYtext] = useState(null);
  const timerRef = useRef(null);
  const debouncedCursorUpdateRef = useRef(null);
  const [socketref, setsocket] = useState(null);
  const editorRef = useRef(null);
  const yTextRef = useRef(null);
  const [popupvariable, setpopupvariable] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const { docid } = useParams();
  const [open2, setOpen2] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [room_title, setroomtitle] = useState("");
  const [room_name, setroomname] = useState("");
  const [chats, setchats] = useState([]);
  const [join_room_name, setjoinroomname] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [flag, setflag] = useState(false);
  const [documentList, setDocumentList] = useState([]);
  let isCurrentUserSelecting = false; // Flag to track if the current user is making a selection

  const [openAlert, setOpen] = useState(false);

  const [message2, setMessage2] = useState("");

  const handletextareachange = (event) => {
    setMessage2(event.target.value);
  };

  const handleAlertClick = () => {
    setOpen(true);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  if (localStorage.getItem("auth_token") != null) {
    const authaxios = axios.create({
      baseURL: "http://localhost:3002",
      headers: {
        "auth-token": JSON.parse(localStorage.getItem("auth_token")).auth_token,
      },
    });
    const headers = {
      auth: JSON.parse(localStorage.getItem("auth_token")).auth_token,
    };
    authaxios
      .post(`http://localhost:3002/api/v1/secure/checktoken`, {
        headers: headers,
      })
      .then((response) => {
        if (response.data.status === "success") {
          //  history.push("/")
          setflag(false);
        }
      })
      .catch((response) => {
        setflag(true);
      });
  }

  const handleOpen2 = () => {
    axios({
      url: "http://localhost:3002/api/v1/routes/get_user_documents",
      method: "POST",
      headers: {
        "auth-token": JSON.parse(localStorage.getItem("auth_token")).auth_token,
      },
    })
      .then((response) => {
        setDocumentList(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCopyToClipboard = () => {
    setmessage("Room key copied!");
    handleAlertClick();
    navigator.clipboard.writeText(room_name);
  };
  const handleClick = (event) => {
    const unique_id = uuid();
    const small_id = unique_id.slice(0, 16);
    setroomname(small_id);
    setAnchorEl(event.currentTarget);
  };
  const handleClick3 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClose3 = () => {
    setAnchorEl2(null);
  };

  const handleChange = (event) => {
    setroomtitle(event.target.value);
  };

  const handleChange3 = (event) => {
    setjoinroomname(event.target.value);
  };

  const handlepopup = (event) => {
    setpopupvariable(event.currentTarget);
  };

  const handleclosepopup = () => {
    setpopupvariable(null);
    setIsCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(localStorage.getItem("roomName"));
    setIsCopied(true);
  };

  const open = Boolean(anchorEl);
  const open3 = Boolean(anchorEl2);

  // some other stuff

  useEffect(() => {
    if (docid && yDoc) {
      const doc_id = docid;
      if (doc_id == "null" || doc_id == "undefined") {
        window.location.href = "/";
      }
      if (localStorage.getItem("doc_id") !== doc_id) {
        if (!localStorage.getItem("roomName")) {
          localStorage.setItem("doc_id", doc_id);
        }
      }

      const user_id = JSON.parse(localStorage.getItem("auth_token")).userid;
      try {
        axios({
          url: "http://localhost:3002/api/v1/routes/getcontent",
          method: "POST",
          data: {
            doc_id,
            user_id,
          },
        })
          .then((res) => {
            const arr = [res.data.content];
            const values = Object.values(arr[0]);

            const uint8Array = Uint8Array.from(values);

            yDoc.transact(() => {
              Y.applyUpdate(yDoc, uint8Array);
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        // Handle any errors that occurred
        console.error(error);
      }
    }
  }, [docid, yDoc]);

  const getchats = () => {
    const room_id = localStorage.getItem("roomName");
    const doc_id = localStorage.getItem("doc_id");

    axios({
      url: "http://localhost:3002/api/v1/chat/get_chat",
      method: "post",
      data: { room_id, doc_id },
    })
      .then((response) => {
        console.log(response);
        setchats(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const connectSocket = () => {
      const storedRoomName = localStorage.getItem("roomName");
      if (storedRoomName) {
        socket = io("http://localhost:3002");
        const username = JSON.parse(localStorage.getItem("auth_token")).name;

        socket.emit("join-room", storedRoomName, username);
        if (socket) {
          socket.on("connect", () => {
            setsocket(socket);
          });

          socket.on("room-join", (username) => {
            setmessage(`${username} Joined this document`);
            handleAlertClick();
          });
          socket.on("disconnect-user", (name) => {
            setmessage(`${name} leave this document`);
            handleAlertClick();
          });
          socket.on("chat-message", (data) => {
            const chatdata = JSON.parse(data);
            setchats((chats) => [...chats, chatdata]);
          });

          socket.on("yjs-update", (update) => {
            const updatedarray = new Uint8Array(update);

            ydoc.transact(() => {
              Y.applyUpdate(ydoc, updatedarray);
            });
          });
        }
      }
    };

    connectSocket();

    if (socket) {
      getchats();
    }
    const ydoc = new Y.Doc();

    const ytext = ydoc.getText("quill");

    let editor = null;
    let typeBinding = null;
    setYdoc(ydoc);
    setYtext(ytext);
    // Insert the initial content
    editor = new Quill(editorRef.current, {
      theme: "snow",
      modules: modules,
    });
    yTextRef.current = ytext;

    if (editor.container) {
      editor.on("selection-change", (range) => {
        if (range) {
        }
      });
      // Event handler for when the current user starts making a selection

      typeBinding = new QuillBinding(ytext, editor);
      editor.on("text-change", (delta, oldDelta, source) => {
        clearTimeout(debouncedCursorUpdateRef.current);

        debouncedCursorUpdateRef.current = setTimeout(() => {
          const version = editor.getContents();
        }, 500);

        // Apply the delta to the YText document
        ydoc.transact(() => {
          const ytext2 = ydoc.getText("document");
          ytext2.applyDelta(delta);
        });

        clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
          const update = Y.encodeStateAsUpdate(ydoc);
          const doc_id = localStorage.getItem("doc_id");
          axios
            .post("http://localhost:3002/api/v1/routes/update_document", {
              doc_id,
              update,
            })
            .then((response) => {
              // console.log(response);
            })
            .catch((error) => {});
        }, 500); // A

        if (socket) {
          if (source === "user") {
            ydoc.transact(() => {
              ytext.applyDelta(delta);

              const update = Y.encodeStateAsUpdate(ydoc);

              socket.emit("yjs-update", update);
            });
          }
        }
      });

      // editor.getModule("cursors").registerBinding({yjs:typeBinding});
    }

    return () => {
      clearTimeout(timerRef.current);
      // editorRef.current = null;
      // editor.dispose(); // Dispose the editor instance
    };
  }, []);

  if (flag) {
    return <Navigate to="/login" />;
  }

  if (localStorage.getItem("auth_token") == null) {
    return <Navigate to="/login" />;
  }

  if (localStorage.getItem("doc_id") !== docid) {
    return <Navigate to={`/editor/${localStorage.getItem("doc_id")}`} />;
  }
  const handleexitroom = () => {
    if (localStorage.getItem("roomName")) {
      localStorage.removeItem("roomName");
    }

    if (localStorage.getItem("doc_id")) {
      localStorage.removeItem("doc_id");
    }
    if(localStorage.getItem("token")) {
       localStorage.removeItem("token");
    }
    socket.disconnect();

    window.location.href = `/user/${JSON.parse(localStorage.getItem("auth_token")).userid}`;
  };
  const handledocumentclick = (e) => {
    if (
      e.target.classList.contains("list-item") ||
      e.target.classList.contains("MuiTypography-root")
    ) {
      const listitem = e.target;
      console.log(listitem.getAttribute("data_id"));
    }

    // console.log(e.target);
  };
  const handlecreateroom = (event) => {
    const roomtitle = room_title;
    const roomname = room_name;
    const did = docid;

    setcreateroomloading(true);
    if (socket) socket.disconnect();

    localStorage.setItem("roomName", room_name);

    axios({
      url: "http://localhost:3002/api/v1/routes/create_room",
      method: "POST",
      data: { roomtitle, roomname, did },
      headers: {
        "auth-token": JSON.parse(localStorage.getItem("auth_token")).auth_token,
      },
    })
      .then((response) => {
        localStorage.setItem("token",response.data.auth_token);
        setmessage("Room created successfully");
        setcreateroomloading(false);
        handleAlertClick();
        handleClose();
        socket = io("http://localhost:3002");
        const username = JSON.parse(localStorage.getItem("auth_token")).name;

        socket.emit("join-room", roomname, username);
        if (socket) {
          socket.on("connect", () => {
            console.log("Socket connected");
          });

          socket.on("disconnect-user", (name) => {
            setmessage(`${name} leave this document`);
            handleAlertClick();
          });

          socket.on("chat-message", (data) => {
            const chatdata = JSON.parse(data);
            setchats((chats) => [...chats, chatdata]);
          });
          socket.on("yjs-update", (update) => {
            const updatedarray = new Uint8Array(update);

            yDoc.transact(() => {
              Y.applyUpdate(yDoc, updatedarray);
            });

            // error on this upper line unexpected end of array
          });

          socket.on("room-join", (username) => {
            setmessage(`${username} Joined this document`);
            handleAlertClick();
          });
          socket.on("disconnect-user", (name) => {
            setmessage(`${name} leave this document`);
            handleAlertClick();
          });
        }
      })
      .catch((error) => {
        setcreateroomloading(false);
      });

    // setcreateroomloading(false);
  };

  // const handleEditorChange = (content) => {
  //   setValue(content);

  //   if (socket) {
  //     socket.emit("message", content);
  //   }
  // };

  const handlejoinroom = () => {
    if (socket) socket.disconnect();

    const room_name = join_room_name;

    axios({
      url: "http://localhost:3002/api/v1/routes/room_user_binding",
      method: "POST",
      data: { room_name },
      headers: {
        "auth-token": JSON.parse(localStorage.getItem("auth_token")).auth_token,
      },
    })
      .then((response) => {
        if (response.data.status === "success") {
          localStorage.setItem("doc_id", response.data.data);
          localStorage.setItem("roomName", join_room_name);
          if (response.data.isAdmin) {
            localStorage.setItem("token", response.data.auth_token);
          }
          handleClose3();
          handleAlertClick();

          window.location.href = `/editor/${localStorage.getItem("doc_id")}`;
        }
      })
      .catch((error) => {
        //  setcreateroomloading(false);

        console.log(error);
      });
  };

  const handlechatbox = () => {
    const chat_box = document.getElementById("chat_box");
    const quill_container = document.getElementsByClassName("ql-container");
    console.log(quill_container);
    chat_box.style.display = "none";
    // quill_container.style.float = "";
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault(); // Prevents adding a newline character
      // sendMessage();
      if (message2 === "" || message2.trim() === "") {
        return;
      }
      const user_id = JSON.parse(localStorage.getItem("auth_token")).userid;
      const name = JSON.parse(localStorage.getItem("auth_token")).name;
      const room_id = localStorage.getItem("roomName");
      const doc_id = localStorage.getItem("doc_id");
      axios({
        url: "http://localhost:3002/api/v1/chat/save_chat",
        method: "POST",
        data: {
          user_id: user_id,
          room_id: room_id,
          doc_id: doc_id,
          message: message2,
          name: name,
        },
      })
        .then((response) => {
          setMessage2("");
          setchats((chats) => [
            ...chats,
            { user_id: user_id, doc_id: doc_id, message: message2, name: name },
          ]);
          socket.emit(
            "send-message",
            JSON.stringify({
              user_id: user_id,
              doc_id: doc_id,
              message: message2,
              name: name,
            })
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div>
      <Navbar
        handleform={handleClick}
        handledocument={handleOpen2}
        handlejoinroom={handleClick3}
        socket={socket}
        handlepopup={handlepopup}
        handleexitroom={handleexitroom}
        handlechatbox={handlechatbox}
      />
      <div id="container">
        <div ref={editorRef}></div>
        <div id="chat_box">
          <div className="chat_top_container">
            <div className="chat_title">Chat here</div>
          </div>
          <div className="chat_container">
            <ScrollableFeed>
              {socket ? (
                chats && chats.length > 0 ? (
                  chats.map((data) => {
                    return data.user_id ===
                      JSON.parse(localStorage.getItem("auth_token")).userid ? (
                      <LeftBubble message={data.message}></LeftBubble>
                    ) : (
                      <RightBubble
                        username={data.name}
                        message={data.message}
                      ></RightBubble>
                    );
                  })
                ) : (
                  <div className="no-message">Let's share your views with chat</div>
                )
              ) : (
                <div className="join_room_message_to_chat">
                  Please Join or create room to use chat
                </div>
              )}
            </ScrollableFeed>
          </div>
          {socket ? (
            <div style={bottomDivStyle}>
              <div className="textarea">
                <TextareaAutosize
                  style={textareaStyle}
                  value={message2}
                  onChange={handletextareachange}
                  onKeyDown={handleKeyDown}
                  placeholder="Share your message..."
                />
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      {/* popover  */}
      <Popover
        open={Boolean(popupvariable)}
        anchorEl={popupvariable}
        onClose={handleclosepopup}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div style={{ padding: "16px", display: "flex", alignItems: "center" }}>
          <Typography variant="body1" gutterBottom>
            <span
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                display: "inline-block",
                border: "1px solid #e3d1d1",
                padding: "4px 8px",
                borderRadius: "4px",
              }}
            >
              {localStorage.getItem("roomName")}
              <IconButton
                onClick={handleCopy}
                disabled={isCopied}
                sx={{
                  marginLeft: "8px",
                  flex: "0 0 auto",
                }}
              >
                <ContentCopyIcon style={{ fontSize: "0.7em" }} />
              </IconButton>
            </span>
          </Typography>
        </div>
      </Popover>

      {/* create room ------------- */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        className="custom-modal"
      >
        <DialogTitle>Create New Room</DialogTitle>
        <DialogContent>
          <TextField
            label="Room Name"
            value={room_title}
            onChange={handleChange}
            variant="outlined"
            size="small"
            className="room_name"
            fullWidth
          />
          <div>
            <TextField
              value={room_name}
              size="small"
              InputProps={{
                readOnly: true,
                style: {
                  backgroundColor: "#f2f2f2", // Customize the background color here
                },
                endAdornment: (
                  <IconButton edge="end" onClick={handleCopyToClipboard}>
                    <AssignmentIcon style={{ fontSize: 20 }} />
                  </IconButton>
                ),
              }}
              className="room_key"
              fullWidth
            />
            <Typography variant="caption" color="textSecondary">
              This is your room key which you share with your friends
            </Typography>
          </div>
          <Button
            disabled={createromloading ? true : false}
            className="create_room"
            variant="contained"
            onClick={handlecreateroom}
          >
            {createromloading ? "Loading..." : "Create Room"}
          </Button>
        </DialogContent>
      </Dialog>
      {/* join room dialog --------------*/}
      <Dialog
        open={open3}
        onClose={handleClose3}
        maxWidth="sm"
        fullWidth
        className="custom-modal"
      >
        <DialogTitle>Join Room</DialogTitle>
        <DialogContent>
          <TextField
            label="Room Key"
            value={join_room_name}
            onChange={handleChange3}
            variant="outlined"
            size="small"
            className="room_name"
            fullWidth
          />
          <div></div>
          <Button
            className="create_room"
            variant="contained"
            onClick={handlejoinroom}
          >
            Join Room
          </Button>
        </DialogContent>
      </Dialog>
      {/* documents dialog -----------*/}
      <Dialog
        open={open2}
        onClose={handleClose2}
        maxWidth="sm"
        fullWidth
        className="custom-modal2"
      >
        <DialogTitle>Search Your documentList</DialogTitle>
        <DialogContent>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            fullWidth
            margin="normal"
          />
          <List
            onClick={handledocumentclick}
            className="scrollbar-container"
            style={{ maxHeight: "300px", overflowY: "auto" }}
          >
            {documentList.map((document) => (
              <ListItem
                // className="list-item"
                // data_id={document.uid}
                key={document.uid}
                button
              >
                {/* <div className="list-text" data_id={document.uid}> */}
                <ListItemText data_id={document.uid} primary={document.title} />
                {/* </div> */}
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Editor;
