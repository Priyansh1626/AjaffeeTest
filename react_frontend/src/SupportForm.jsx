import React, { useState } from "react";

export default function SupportForm({ setShowSupportForm, setMessages }) {
  const [info, setInfo] = useState({
    name: "",
    email: "",
    ps: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setInfo({
      ...info,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // const apiUrl = "http://127.0.0.1:5000/support";
    // // const apiUrl = "http://192.168.1.171:5000";
    // const requestOptions = {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(info),
    // };
    // await fetch(apiUrl, requestOptions);
    setShowSupportForm(false);
    const replyForEmail = {
      message: "Submitted successfully",
      sender: "ChatGPT",
    };
    // setMessages([...messages, replyForEmail]);
  };

  const inputStyle = {
    border: "2px solid black",
    width: "300px",
    padding: "4px 5px 6px 8px",
    margin: "5px",
    borderRadius: "5px",
    minHeight: "15px",
  };
  return (
    <div
      style={{
        backgroundColor: " white",
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        top: "27%",
        left: "6.5%",
        zIndex: "100",
      }}
    >
      <input
        id="name"
        style={inputStyle}
        type="text"
        placeholder="Name"
        name="name"
        value={info.name}
        onChange={handleChange}
      />
      <input
        id="email"
        style={inputStyle}
        type="text"
        name="email"
        value={info.email}
        placeholder="Email"
        onChange={handleChange}
      />
      <textarea
        id="problemStatement"
        style={inputStyle}
        type="text"
        value={info.ps}
        name="ps"
        placeholder="Problem Statement"
        onChange={handleChange}
      />
      <div style={{ textAlign: "center" }}>
        <button
          style={{
            border: "1px solid black",
            borderRadius: "5px",
            padding: "5px 10px",
            marginTop: "3px",
            width: "98%",
            backgroundColor: "black",
            color: "white",
          }}
          onClick={(e) => handleFormSubmit(e)}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
