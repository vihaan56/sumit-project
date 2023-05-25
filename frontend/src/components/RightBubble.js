import React, { useEffect, useState, useRef } from "react";

const RightBubble = ({ username,message }) => {
  return (
    <>
      <div className="sender_info">{username}</div>
      <div className="right-bubble">
        <div className="right_message">
          <span className="right_text">{message}</span>
        </div>
        {/* <span className="right_time">{moment(timestamp).startOf('seconds').fromNow()}</span> */}
      </div>
    </>
  );
};

export default RightBubble;
