import { useState, useEffect, useRef } from "react";
import * as React from "react";
import Navbar from "./Layout/Navbar/Navbar";
import CommandInput from "./Layout/CommandInput";
import SessionPanel from "./SessionManager/SessionPanel";
import Spinner from "./Layout/Spinner";
import myImage from "./bot.jpg";
import myImage1 from "./userAvatar.jpg";
import myImage2 from "./botAvatar.png";
import * as textFormat from "text-format";
// import Loader from '../assets/spinner.svg'
import './Chat.css'
import BackendIP from './BackendIP.json'
import ChatComponent from "./ChatComponent";

export default function Chat() {
  const [disableInput, setDisableInput] = useState(false);
  const [messages, setMessages] = useState([]);
  const [res, setRes] = useState([]);
  const [response, setResponse] = useState("");
  const [uploading, setUploading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [hasResponse, setHasResponse] = useState(false);
  const [fileName, setFileName] = useState("");
  const [showChatPanel, setShowChatPanel] = useState(false);
  const onLoadingTrue = () => setUploading(true);
  const onLoadingFalse = () => setUploading(false);

  const [errorMsg, setErrorMsg] = useState(null)
  const [supportMsg, setSupportMsg] = useState(null)

  const messagesEndRef = useRef(null)

  const [showSpinner, setShowSpinner] = useState(false);

  const onAskingTrue = () => setAsking(true);
  const onAskingFalse = () => setAsking(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  const handleCommandSubmit = async (command) => {
    setMessages([...messages, command, ""]);
    setDisableInput(true);
    const apiUrl = BackendIP.ip;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: command }),
    };
    onAskingTrue();
    
    setShowSpinner(true);
    



     const response1 = await fetch(apiUrl, requestOptions);
      const data = await response1.json();
      setMessages([...messages, command, ""]);
    
    
    
    if(command.toLowerCase().includes('support')){
      setSupportMsg('Customer service will reach out to you in a few days')
      setErrorMsg(null)
      setShowSpinner(false);
      // setMessages([...messages, command, ""]);
    }
    else if(!data.response.startsWith('Item Category')){
      setErrorMsg('Error detected')
      setShowSpinner(false);
      
      setSupportMsg(null)
    }
    else {
      setSupportMsg(null)
      setErrorMsg(null)
      setShowSpinner(false);
    }

   
      setRes((prevRes) => [...prevRes, data.response, ""]);
    
    setResponse(data.response);
    // res.split(/(Item Category:|Item Id:|Style:|Version:|Sizes:|Shape:|Metal:|Quality:|Price:)/).filter(Boolean);
    console.log(response);
    setDisableInput(false);
    setHasResponse(true);
    onAskingFalse();

    // setTimeout(() => {
      const chatWindowContainer = document.getElementById("chat-window");
      if (chatWindowContainer) {
        chatWindowContainer.scrollTop = chatWindowContainer.scrollHeight;
      }
    // }, 0);
  };

  // console.log(messages);
  // console.log(res);
  const toggleChatPanel = () => {
    setShowChatPanel(!showChatPanel);
  };

  const handleWhiteSpaceValue = (text)=>{
    if(text.startsWith('Hey')){
      return 'normal'
    }
    else{
      return 'pre'
    }
  }


  return (
    <div className="" >
      <button
        href={myImage2}
        className="h-40 w-40 rounded-full ml-[90vw] mt-[80vh]  bg-white fixed bottom-2 right-2"
        alt=""
        onClick={toggleChatPanel}
      >
        <img src={myImage2} class="rounded-full overflow-hidden w-100 h-100" alt="" />
      </button>{" "}
      {/* Button to toggle the chat panel visibility */}
      {showChatPanel && (
        <div className="
        fixed bottom-8 right-2 md:bottom-0
        md:w-100 md:h-100
        flex justify-center md:justify-start
        items-center md:items-start

        "

        // id="chat-window"
        // md:ml-[73vw] mt-[21vh] 
        // relative w-full h-full
        
        >
          {/* {uploading ? <Spinner /> : ""} */}
          <div
            style={{ minHeight: "calc(80vh - 72px)" }}
            className="border-[1px]  border-black bottom-0 right-0 md:w-100 md:h-100 max-h-[650px] md:w-[480px] bg-white grid content-between"
            >
            <div className="border-2 h-[80px] w-full flex md:w-100 md:h-100 justify-center align-center text-white bg-black align-center">
                <div style={{display:'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div className="align-center text-[40px]">Ajaffee VA</div>
                <button onClick={toggleChatPanel} style={{boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px", marginLeft: '200px'}} className="md:w-100 md:h-100">Close</button>

                </div>

              
            </div>

            <div className="overflow-x-hidden overflow-scroll max-h-[600px] h-[470px]" id="chat-window">
              {messages.map((data,key) =>
                key % 2 == 0 ? (
                  // {console.log(data)}
                  <div className="flex mt-2 justify-end mr-2 gap-2 break-words" >
                    <div className="break-words bg-black px-3 py-3 max-w-[350px] rounded-3xl text-white">
                      {console.log(data)}
                      {data}
                      <br></br>
                    </div>
                    <img
                      className=" h-12 w-12 rounded-full"
                      src={myImage1}
                      alt=""
                    /><br></br>
                  </div>
                ) :
                (
            
                  (
                    <div className="ml-2 break-words mt-2 gap-2 flex justify-start">
                      <img
                        className="h-12 w-12 rounded-full"
                        src={myImage}
                        alt=""
                      />
                      {/* <pre className="max-w-[350px] break-words bg-gray-200 px-3 py-3 rounded-3xl"></pre> */}
                      {/* <pre className="max-w-[350px] bg-gray-200 px-4 py-4 rounded-3xl"> */}
                        {
                          supportMsg && <div  className="w-[400px] bg-gray-200 px-3 py-3 rounded-3xl"
                          style={{overflowWrap: 'break-word', wordBreak: 'keep-all', whitespace: 'pre-line'}}
                          >
  
                            {showSpinner && key==messages.length-1 && <Spinner className="loader-animation"/>}
                          
  
                            {supportMsg}
  
                           
                        <div ref={messagesEndRef} />
                          </div> 
                        }
                        
                        {
                          errorMsg  && !supportMsg &&
                          // <ChatComponent flag={true} response={res[key - 1]} />
                          <div  className="w-[400px] bg-gray-200 px-3 py-3 rounded-3xl"
                        style={{overflowWrap: 'break-word', wordBreak: 'keep-all', whitespace: 'pre-line'}}
                        >

                          {showSpinner && key==messages.length-1 && <Spinner className="loader-animation"/>}
                        

                          {res[key - 1]}

                         
                      <div ref={messagesEndRef} />
                        </div> 
                        }

                       {!errorMsg &&  !supportMsg &&
                       <div className="w-[400px] bg-gray-200 px-3 py-3 rounded-3xl" style={{overflowWrap: 'break-word', wordBreak: 'keep-all', whitespace: 'pre'}}>

                          {showSpinner && key==messages.length-1 && <Spinner className="loader-animation"/>}
                          <pre style={{overflowWrap: 'break-word', wordBreak: 'keep-all', whitespace: 'pre-line'}}>

                          {res[key - 1]}

                          </pre>
                      <div ref={messagesEndRef} />
                        </div>
                        }
  
                      {/* </pre> */}
                    </div>
                  )
                  )
                  
                  
                  )}
            </div>
            <div className="relative w-full justify-between">
              <div
                className="w-full justify-between grid pb-4"
                style={{ placeContent: "center" }}
                >
                <CommandInput
                  onCommandSubmit={handleCommandSubmit}
                  messages={messages}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

