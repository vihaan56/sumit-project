import React, { useEffect,useState,useRef } from "react";
const LeftBubble = ({ timestamp,message }) => {
  //  console.log(date)
  //  console.log(moment(date).startOf('seconds').fromNow());
  return (
    <div  className="left-bubble">
      <div className="left_message">
        <span className="left_text">{message}</span>
      </div>
        {/* <span className="left_time">{moment(date).startOf('seconds').fromNow()}</span> */}
    </div>
  );
};

export default LeftBubble;
