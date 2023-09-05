import { useState, useRef, useEffect } from "react";
import "./App.css";
// import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import "./themes/default/main.scss";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  ArrowButton,
} from "@chatscope/chat-ui-kit-react";
import ChatButtonLogo from "./assets/chatbot-button.png";
import Suggestions from "./components/Layout/Suggestions.json";
import "./ChatModule.css";
// import SupportForm from "./SupportForm";
// import {readFile, writeFile} from 'fs/promises'
// import UserSupport from './UserSupport.json'

const API_KEY = "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";
// "Explain things like you would to a 10 year old learning how to code."
const systemMessage = {
  //  Explain things like you're talking to a software professional with 5 years of experience.
  role: "system",
  content:
    "Explain things like you're talking to a software professional with 2 years of experience.",
};

const words = Suggestions.words;
console.log(words);
function ChatComponent() {
  const [showChatButton, setShowChatButton] = useState(true);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [showSupportFrom, setShowSupportForm] = useState(false);

  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);

  const [disableInput, setDisableInput] = useState(false);
  const [messages, setMessages] = useState([]);
  const [res, setRes] = useState([]);
  const [response, setResponse] = useState("");
  const [uploading, setUploading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [hasResponse, setHasResponse] = useState(false);
  const [fileName, setFileName] = useState("");
  //   const [showChatPanel, setShowChatPanel] = useState(false);
  const onLoadingTrue = () => setUploading(true);
  const onLoadingFalse = () => setUploading(false);

  const [errorMsg, setErrorMsg] = useState(null);
  const [supportMsg, setSupportMsg] = useState(null);

  const [isSupportMessage, setIsSupportMessage] = useState(false);
  const [supportCounter, setSupportCounter] = useState(0);

  const [chatInputValue, setChatInputValue] = useState(null);

  const messagesEndRef = useRef(null);

  const [info, setInfo] = useState({
    name: "",
    email: "",
    ps: "",
  });

  const [showSpinner, setShowSpinner] = useState(false);

  const onAskingTrue = () => setAsking(true);
  const onAskingFalse = () => setAsking(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollToBottom({ behavior: "smooth" });
  };

  //   useEffect(() => {
  //     // scrollToBottom()
  //     if(msgListRef.current)
  //     msgListRef.current.scrollTop = msgListRef.current.scrollHeight;
  //   }, [messages]);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    // await processMessageToChatGPT(newMessages);
  };

  async function sendPayloadToBackend(chatMessages, command) {
    const apiUrl = "http://127.0.0.1:5000/first";
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: command }),
    };

    setIsTyping(true);
    setTyping(true);
    const response1 = await fetch(apiUrl, requestOptions);
    const data = await response1.json();
    //  console.log(data)
    //   setMessages([...messages, command, ""]);

    setTyping(false);
    setIsTyping(false);

    const receivedResponse = {
      message: data?.response,
      // direction: 'incoming',
      sender: "ChatGPT",
    };

    if (
      receivedResponse.message ===
      "Results not found, you can reach out with query on csd@ajaffe.com or do you want to reach out to customer support with your inquiry?"
    ) {
      setShowSupportForm(true);
      setMessages([...messages.slice(-1)]);
    } else {
      setMessages([...chatMessages, receivedResponse]);

      setDisableInput(false);
      setHasResponse(true);
      onAskingFalse();
    }
  }
  const handleCommandSubmit = async (command) => {
    setChatInputValue(null);

    const newMessage = {
      message: command,
      direction: "outgoing",
      sender: "user",
    };
    // setMessages([...messages, newMessage]);

    if (isSupportMessage) {
      if (supportCounter === 1) {
        // supportUserData.push(command)
        const replyForEmail = {
          message: "Enter your email",
          sender: "ChatGPT",
        };
        setMessages([...messages, replyForEmail]);
      } else if (supportCounter === 2) {
        // supportUserData.push(command)
        setSupportCounter(0);
        setIsSupportMessage(false);
      }
    }
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setShowSupportForm(false);
    // setDisableInput(true);

    // onAskingTrue();

    // setShowSpinner(true);

    if (command.includes("@")) {
      const breakString = command.split(" ");
      console.log(breakString);
      setShowSupportForm(false);

      const apiUrl = "http://127.0.0.1:5000/support";
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: breakString[0], email: breakString[1] }),
      };
      setIsTyping(true);
      await fetch(apiUrl, requestOptions);

      const nextReply = {
        message: "Customer service will reach out to you in a few days",
        sender: "ChatGPT",
      };

      setMessages([...newMessages, nextReply]);
    } else if (command.toLowerCase().includes("support")) {
      setIsTyping(true);
      const nextReply = {
        message: "Enter your name and email, eg: Robert robert@example.com",
        sender: "ChatGPT",
      };
      setTimeout(() => {
        setShowSupportForm(true);
        setIsTyping(false);
        setMessages([...newMessages.slice(-1)]);
        // setIsSupportMessage(true)
        // setSupportCounter(supportCounter + 1)
      }, 1000);
    } else {
      await sendPayloadToBackend(newMessages, command);
      setShowSupportForm(false);

      const manualScrollButton = document.getElementById(
        "manual-scroll-button"
      );
      // console.log(manualScrollButton)
      // manualScrollButton.click()
      handleManualScrollClick("auto");
      // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      // msgListRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    // setTimeout(() => {
    const chatWindowContainer = document.getElementById("chat-window");
    if (chatWindowContainer) {
      chatWindowContainer.scrollTop = chatWindowContainer.scrollHeight;
    }
    // }, 0);
  };

  const handleSuggestionClick = (suggestion) => {
    // setCommand(suggestion);
    // const submitButton = document.querySelector('button[type="submit"]')
    // submitButton.click()
    setChatInputValue(suggestion);
    const inputArea = document.getElementById("chat-input");
    inputArea.setAttribute("value", suggestion);
    // inputArea.textContent = suggestion
  };

  const handleChatButtonClose = () => {
    handleChatButtonClick();
  };

  //   const scrollToBottom = () => {
  //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  //   }

  //   useEffect(() => {
  //     scrollToBottom()
  //   }, [messages]);

  const handleChatButtonClick = () => {
    setShowChatPanel(!showChatPanel);
    setShowChatButton(!showChatButton);
  };

  const label = "Scroll Behavior";
  const options = {
    Auto: "auto",
    Smooth: "smooth",
    None: undefined,
  };
  //   const scrollBehavior = select(label, options, undefined);

  const msgListRef = useRef();

  const handleClick = (scrollBehavior) =>
    msgListRef.current.scrollToBottom(scrollBehavior);

  //   useEffect(()=>{

  //   },)

  const handleManualScrollClick = (scrollBehaviour) => {
    msgListRef.current.scrollToBottom(scrollBehaviour);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo({
      ...info,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = "http://127.0.0.1:5000/support";
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(info),
    };
    await fetch(apiUrl, requestOptions);
    setShowSupportForm(false);
    const replyForEmail = {
      message: "Submitted successfully",
      sender: "ChatGPT",
    };
    setMessages([...messages, replyForEmail]);
    setInfo({
      name: "",
      email: "",
      ps: "",
    });
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
    <div className="App">
      {showChatButton && (
        <div
          onClick={handleChatButtonClick}
          style={{
            position: "absolute",
            bottom: "40px",
            right: "20px",
            zIndex: "1000",
          }}
        >
          <img
            src={ChatButtonLogo}
            width="100px"
            height="100px"
            style={{ cursor: "pointer" }}
          />
        </div>
      )}
      {showChatPanel && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              position: "absolute",
              height: "500px",
              width: "500px",
              bottom: "100px",
              right: "20px",
              padding: "20px",
            }}
          >
            {/* <ArrowButton id="manual-scroll-button" direction="down" labelPosition="left" border onClick={() => handleManualScrollClick("auto")}>Scroll to bottom (force auto)</ArrowButton> */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "black",
                color: "white",
                padding: "10px",
              }}
            >
              <div style={{ fontSize: "20px" }}>AJAFFE VA</div>
              <div
                onClick={handleChatButtonClose}
                style={{
                  marginLeft: "60%",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Close
              </div>
            </div>
            {showSupportFrom && (
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
            )}
            <MainContainer>
              <ChatContainer>
                <MessageList
                  scrollBehavior="smooth"
                  typingIndicator={
                    isTyping ? (
                      <TypingIndicator
                        style={{
                          marginTop: "20px",
                          backgroundColor: "transparent",
                        }}
                        content="Processing..."
                      />
                    ) : null
                  }
                  style={{ fontSize: "20px" }}
                  autoScrollToBottom
                  autoScrollToBottomOnMount
                  messages={messages}
                  ref={msgListRef}
                  //   autoScrollToBottomOnMount={false}
                  //   ref={messagesEndRef}
                >
                  {messages.map((message, i) => {
                    // console.log(message)
                    return <Message key={i} model={message} />;
                  })}
                  {/* <div ref={messagesEndRef} /> */}
                  {/* <MessageInput style={{}} placeholder='dsds' /> */}
                </MessageList>
                <div>
                  <h1>This is a sample</h1>
                </div>
                {/* { <div>
                <TypingIndicator content="Processing..." typing={isTyping} />
            </div>} */}

                {/* <MessageList.Content>Hii</MessageList.Content> */}
                {/* <MessageListContent>hii</MessageListContent> */}

                {/* <MessageInput attachButton={false} sendButton={false} placeholder="enter"/> */}
                <MessageInput
                  id="chat-input"
                  placeholder="Type message here"
                  value={chatInputValue}
                  onChange={(e) => {
                    setChatInputValue(e);
                  }}
                  onSend={handleCommandSubmit}
                  // value={chatInputValue}
                  sendDisabled={false}
                  // onChange={(e)=>{setChatInputValue(e.target.value)}}
                  attachButton={false}
                />
                {/* <MessageInput placeholder="Type message here" onSend={handleCommandSubmit} attachButton={false} />         */}
                {/* <MessageInput placeholder='random' /> */}
              </ChatContainer>
            </MainContainer>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                backgroundColor: "white",
                padding: "10px",
                marginBottom: "4px",
                outline: "none",
                borderTop: "1px solid white",
              }}
            >
              {words.map((word, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      borderRadius: "10px",
                      marginTop: "5px",
                      marginBottom: "-5px",
                      boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                      border: "1px solid gray",
                      width: "fit-content",
                      padding: "5px",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "white",
                      // position: 'absolute',
                      // bottom: '30px',
                      display: "flex",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSuggestionClick(`${word}`)}
                  >
                    {word}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatComponent;
