import { useEffect, useState } from "react";
import Suggestions from "./Suggestions.json";

export default function CommandInput({ onCommandSubmit, messages }) {
  const [command, setCommand] = useState("");
  const [disableInput, setDisableInput] = useState(false); // State to disable input
  const words = Suggestions.words;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCommand("");
    setDisableInput(true); // Disable input while waiting for response
    await onCommandSubmit(command);
    setDisableInput(false); // Enable input after response is received
  };

  const handleSuggestionClick = (suggestion) => {
    setCommand(suggestion);
    // const submitButton = document.querySelector('button[type="submit"]')
    // submitButton.click()
  };

  return (
    <>
   
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
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
                padding: '5px',
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                cursor: "pointer",
              }}
              onClick={() => handleSuggestionClick(`${word}`)}
            >
              {word}
            </div>
          );
        })}
        {/* <div style={{borderRadius:'10px',marginTop: '5px', marginBottom:'-5px', boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',border:'1px solid gray', width:'100px', alignItems: 'center', justifyContent:'center', display: 'flex', cursor: 'pointer'}} onClick = {()=>handleSuggestionClick('Top 1')}>
          Top 1
        </div>
        <div style={{borderRadius:'10px',marginTop: '5px', marginBottom:'-5px', boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', border:'1px solid gray', width:'100px', alignItems: 'center', justifyContent:'center', display: 'flex', cursor: 'pointer'}} onClick = {()=>handleSuggestionClick('Top 2')}>
          Top 2
        </div>
        <div style={{borderRadius:'10px',marginTop: '5px', marginBottom:'-5px',boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px', border:'1px solid gray',width:'100px', alignItems: 'center', justifyContent:'center', display: 'flex', cursor: 'pointer'}} onClick = {()=>handleSuggestionClick('Top 3')}>
          Top 3
        </div> */}
      </div>
      <form
        onSubmit={handleSubmit}
        style={{ marginTop: "20px", marginBottom: "5px" }}
        className="flex gap-6 w-[100%]"
      >
        <input
          className="cmd-input text-base text-ellipsis px-18 w-[350px] overflow-hidden"
          type="text"
          placeholder="Please ask me"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          // Disable input based on the disableInput state
        />
        <button
          type="submit"
          disabled={command.length == 0}
          className="py-2 px-5 bg-black rounded-full text-white"
        >
          <center>Submit</center>
        </button>

        {/* {command.length === 0 ? (
          <div className="flex justify-center align-center py-2 px-5 bg-black rounded-full text-white">
            <div className="flex justify-center align-center">Submit</div>
          </div>
        ) : (
          <button type="submit" disabled={disableInput} className="py-2 px-5 bg-black rounded-full text-white" disabled={disableInput}>
            <center>Submit</center>
            
          </button>
        )} */}
      </form>
    </>
  );
}
