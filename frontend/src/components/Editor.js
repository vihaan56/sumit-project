import React, { useEffect, useRef, useState } from "react";
// import ReactQuill from "react-quill";
import Quill from "quill";
import * as Y from "yjs";
import { QuillBinding } from "y-quill";
import axios from "axios";
import "quill/dist/quill.snow.css";
import {
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Assignment as AssignmentIcon } from "@mui/icons-material";
import io from "socket.io-client";
import Navbar from "./Navbar";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
} from "@mui/material";
import { Navigate, useParams } from "react-router-dom";

import { v4 as uuid } from "uuid";

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

    ["link", "image"],
    // ['clean']                                         // remove formatting button
  ],
};

// const host = "http://localhost:3002";

// var socket = io(host);

let socket;

function Editor() {
  const [value, setValue] = useState();
  const [yDoc, setYdoc] = useState(null);
  const [yText, setYtext] = useState(null);
  const timerRef = useRef(null);
  const editorRef = useRef(null);
  const quillEditorRef = useRef(null);
  const yTextRef = useRef(null);
  const { docid } = useParams();
  const [open2, setOpen2] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [room_title, setroomtitle] = useState("");
  const [room_name, setroomname] = useState("");
  const [join_room_name, setjoinroomname] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [flag, setflag] = useState(false);
  const [documentList, setDocumentList] = useState([
    { id: 1, name: "Document 1" },
    { id: 2, name: "Document 2" },
    { id: 3, name: "Document 3" },
    { id: 4, name: "Document 3" },
    { id: 5, name: "Document 3" },
    { id: 6, name: "Document 3" },
    { id: 7, name: "Document 3" },
    { id: 8, name: "Document 3" },
    { id: 9, name: "Document 3" },
    { id: 10, name: "Document 3" },
    { id: 11, name: "Document 3" },
    { id: 12, name: "Document 3" },
    { id: 13, name: "Document 3" },
    // Add more documents here...
  ]);

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
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredDocuments = documentList.filter((document) =>
    document.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyToClipboard = () => {
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
  const open = Boolean(anchorEl);
  const open3 = Boolean(anchorEl2);

  // some other stuff
  const builddocument = () => {
    var title = "Untitled Document";
    var content = "vihaan";
    const unique_id = uuid();
    const uid = unique_id.slice(0, 16);

    axios({
      url: "http://localhost:3002/api/v1/routes/create_documents",
      method: "POST",
      data: { title, content, uid },
      headers: {
        "auth-token": JSON.parse(localStorage.getItem("auth_token")).auth_token,
      },
    })
      .then((response) => {
        // console.log(response);

        localStorage.setItem("doc_id", response.data.data);
        // setdocid(response.data.data)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (docid && yDoc) {
      const doc_id = docid;
      localStorage.setItem("doc_id",doc_id);
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

  useEffect(() => {
    const ydoc = new Y.Doc();
    const ytext = ydoc.getText("quill");
    setYdoc(ydoc);
    setYtext(ytext);
    // builddocument();

    // Insert the initial content

    const editor = new Quill(editorRef.current, {
      theme: "snow",
      modules: modules,
      cursors: true,
    });

    editor.on("text-change", (delta, oldDelta, source) => {
      const delta2 = editor.getContents();

      // Apply the delta to the YText document
      ydoc.transact(() => {
        const ytext2 = ydoc.getText("document");
        ytext2.applyDelta(delta);
      });

      const update2 = Y.encodeStateAsUpdate(ydoc);

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

    var typeBinding = new QuillBinding(ytext, editor);
    quillEditorRef.current = editor;
    yTextRef.current = ytext;

    const storedRoomName = localStorage.getItem("roomName");
    if (storedRoomName) {
      socket = io("http://localhost:3002");
      socket.emit("join-room", storedRoomName);
      // socket.emit("yjs-sync");

      socket.on("connect", () => {
        console.log("Socket connected");
      });

      socket.on("yjs-update", (update) => {
        const updatedarray = new Uint8Array(update);

        ydoc.transact(() => {
          Y.applyUpdate(ydoc, updatedarray);
        });

        const delta = ytext.toDelta();

        // error on this upper line unexpected end of array
      });

      // socket.on("message", (data) => {
      //   // Handle the received message here
      //   const messagePayload = data.payload;
      //   const senderChannelName = data.senderChannelName;
      //   console.log(messagePayload);
      //   console.log(senderChannelName);
      //   // Do something with the message data
      //   // ...
      // });

      return () => {
        typeBinding.destroy();
        clearTimeout(timerRef.current);
        socket.disconnect();
      };
    }
  }, []);

  if (flag) {
    return <Navigate to="/login" />;
  }

  if (localStorage.getItem("auth_token") == null) {
    return <Navigate to="/login" />;
  }

  const handlecreateroom = (event) => {
    const roomtitle = room_title;
    const roomname = room_name;

    if (socket) socket.disconnect();

    localStorage.setItem("roomName", room_name);

    socket = io("http://localhost:3002");

    socket.emit("join-room", roomname);

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("yjs-update", (update) => {
      const updatedarray = new Uint8Array(update);

      yDoc.transact(() => {
        Y.applyUpdate(yDoc, updatedarray);
      });

      const delta = yText.toDelta();

      // error on this upper line unexpected end of array
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  };

  // const handleEditorChange = (content) => {
  //   setValue(content);

  //   if (socket) {
  //     socket.emit("message", content);
  //   }
  // };

  const handlejoinroom = () => {
    if (socket) socket.disconnect();

    socket = io("http://localhost:3002");
    socket.emit("join-room", join_room_name);
    localStorage.setItem("roomName", join_room_name);

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("yjs-update", (update) => {
      const updatedarray = new Uint8Array(update);

      yDoc.transact(() => {
        Y.applyUpdate(yDoc, updatedarray);
      });


      // error on this upper line unexpected end of array
    });
  };
  // value={value}
  // onChange={handleEditorChange}
  return (
    <div>
      <Navbar
        handleform={handleClick}
        handledocument={handleOpen2}
        handlejoinroom={handleClick3}
        socket={socket}
      />

      <div id="container">
        <div ref={editorRef}></div>
        <button onClick={handleOpen2}>popup</button>
      </div>

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
            className="create_room"
            variant="contained"
            onClick={handlecreateroom}
          >
            Create Room
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
        <DialogTitle>Search Your Document</DialogTitle>
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
            className="scrollbar-container"
            style={{ maxHeight: "300px", overflowY: "auto" }}
          >
            {filteredDocuments.map((document) => (
              <ListItem key={document.id} button>
                <ListItemText primary={document.name} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Editor;
