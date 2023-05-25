import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import FolderSharedRoundedIcon from "@mui/icons-material/FolderSharedRounded";
import GroupsIcon from "@mui/icons-material/Groups";
import { Navigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { IconButton } from "@mui/material";
const Document = () => {
  const [data, setdata] = useState([]);
  const [data2, setdata2] = useState([]);
  const [room, setroom] = useState("");
  const [flag, setflag] = useState(false);

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

  useEffect(() => {
    axios({
      url: "http://localhost:3002/api/v1/routes/get_room",
      method: "POST",
      headers: {
        "auth-token": JSON.parse(localStorage.getItem("auth_token")).auth_token,
      },
    })
      .then((response) => {
        setdata2(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios({
      url: "http://localhost:3002/api/v1/routes/get_user_documents",
      method: "POST",
      headers: {
        "auth-token": JSON.parse(localStorage.getItem("auth_token")).auth_token,
      },
    })
      .then((response) => {
        setdata(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const builddocument = () => {
    var title = "Untitled Document";
    var content = "vihaan";
    const unique_id = uuid();
    const uid = unique_id.slice(0, 16);
    localStorage.removeItem("roomName");

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
        if (localStorage.getItem("token")) {
          localStorage.removeItem("token");
        }

        localStorage.setItem("doc_id", response.data.data);
        window.location.href = `/editor/${uid}`;
        // setdocid(response.data.data)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlestate2 = (data) => {
    axios({
      url: "http://localhost:3002/api/v1/routes/get_document",
      method: "POST",
      data: { room_id: data.room_id },
    })
      .then((response) => {
        if (response.data.status === "success") {
          localStorage.setItem("roomName", response.data.data.room_id);
          localStorage.setItem("doc_id", response.data.data.document_id);
          if (data.isAdmin) {
            axios({
              url: "http://localhost:3002/api/v1/routes/get_token",
              method: "POST",
              data: { room_id: data.room_id },
              headers: {
                "auth-token": JSON.parse(localStorage.getItem("auth_token"))
                  .auth_token,
              },
            })
              .then((response2) => {
                localStorage.setItem("token", response2.data.auth_token);
                window.location.href = `/editor/${response.data.data.document_id}`;
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            if (localStorage.getItem("token")) {
              localStorage.removeItem("token");
            }
            window.location.href = `/editor/${response.data.data.document_id}`;
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handlestate = (data) => {
    const uid = data.uid;
    localStorage.setItem("doc_id", uid);

    axios({
      url: "http://localhost:3002/api/v1/routes/room_details",
      method: "POST",
      data: { uid },
      headers: {
        "auth-token": JSON.parse(localStorage.getItem("auth_token")).auth_token,
      },
    })
      .then((response) => {
        if (response.data.data != null) {
          const room_id = response.data.data.room_id;
          localStorage.setItem("roomName", room_id);

          if (response.data.isAdmin) {
            axios({
              url: "http://localhost:3002/api/v1/routes/get_token",
              method: "POST",
              data: { room_id: data.room_id },
              headers: {
                "auth-token": JSON.parse(localStorage.getItem("auth_token"))
                  .auth_token,
              },
            })
              .then((response2) => {
                localStorage.setItem("token", response2.data.auth_token);
                window.location.href = `/editor/${data.uid}`;
              })
              .catch((error) => {
                console.log(error);
              });
          }
          // window.location.href = `/editor/${data.uid}`;
        } else {
          localStorage.removeItem("roomName");

          window.location.href = `/editor/${data.uid}`;
        }
      })
      .catch((err) => {
        console.log(err);
      });

    //
  };

  if (flag) {
    return <Navigate to={`/login`} />;
  }

  return (
    <>
      <div className="outer-container">
        <div className="inner-container">
          <div onClick={builddocument}>
            <Box
              width={130}
              height={171}
              border={1}
              borderColor="lightgray"
              bgcolor="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
              cursor="pointer"
              transition="background-color 0.3s"
              className="rectangular-box"
            >
              <AddIcon
                fontSize="large"
                color="disabled"
                className="rectangular-box-icon"
              />
            </Box>
            <div className="document-label">Blank Document</div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div className="docs_container">
          <div className="document-label2">Your Documents:</div>
          <div className="recent-documents-container">
            {data && data.length > 0 ? (
              data.map((data) => {
                return (
                  <div className="recent-documents" key={data.uid}>
                    <IconButton onClick={() => handlestate(data)}>
                      <FolderRoundedIcon
                        style={{ fontSize: "2.5em", color: "#54cff6" }}
                      ></FolderRoundedIcon>
                    </IconButton>
                    <div
                      style={{
                        fontWeight: "550",
                        fontSize: "12px",
                        position: "relative",
                        bottom: "10px",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                    >
                      {data.title}
                      {/* <IconButton >
                  <MoreVertIcon 
                    style={{ fontSize: "0.6em",position:"relative",right:"8px" }}
                  ></MoreVertIcon>
                </IconButton> */}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-document-found">No Recent Documents</div>
            )}
          </div>
        </div>

        <Divider orientation="vertical" variant="middle" flexItem />

        <div className="room_container">
          <div className="room-label2">Your Rooms</div>
          <div className="recent-room-container">
            {data2 && data2.length > 0 ? (
              data2.map((data) => {
                return (
                  <div className="recent-documents" key={data._id}>
                    <IconButton onClick={() => handlestate2(data)}>
                      <GroupsIcon
                        style={{ fontSize: "2.5em", color: "#54cff6" }}
                      ></GroupsIcon>
                    </IconButton>
                    <div
                      style={{
                        fontWeight: "550",
                        fontSize: "12px",
                        position: "relative",
                        bottom: "10px",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                    >
                      {data.room_title}
                      {/* <IconButton >
                  <MoreVertIcon 
                    style={{ fontSize: "0.6em",position:"relative",right:"8px" }}
                  ></MoreVertIcon>
                </IconButton> */}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-room-found">No Room Found</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Document;
