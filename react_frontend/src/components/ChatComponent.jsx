import React from 'react'

const ChatComponent = ({flag, response}) => {
  return (
    flag==true?<div className="w-[400px] bg-gray-200 px-3 py-3 rounded-3xl">
        {response}
    </div>:<pre className="w-[400px] bg-gray-200 px-3 py-3 rounded-3xl">
        {response}

    </pre>
  )
}

export default ChatComponent