import { useEffect, useRef, useState } from "react";
import "./App.css";
import { msgs, specailPrompt } from "./config";
import { createChatCompletion, createCompletion } from "./api/my-openai";
import UserImg from "./img/user.png";
import BotImg from "./img/bot.jpg";
import {  BsFillFileArrowDownFill } from "react-icons/bs";
import {  AiOutlineAppstoreAdd } from "react-icons/ai";
function App() {
  const [messages, setMessages] = useState([]);
  const [trainedMsg, setTrainedMsg] = useState(msgs);
  const [inp, setInp] = useState("");
  const [saved, setSaved] = useState({});
  const [name, setName] = useState('Alex');
  const [age, setAge] = useState(18);
  const [gender, setGender] = useState('male');
  const handleMessage = () => {
    const qs = inp.includes("Q:") && inp.includes("A:");
    if (!qs) {
      const currentMsg = { role: "user", content: specailPrompt +inp };
      setMessages([...messages, currentMsg]);
      setInp("");
      createChatCompletion([...trainedMsg, currentMsg])
        .then((res) => {
          setMessages([...messages, currentMsg, res.data.choices[0].message]);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }

    if (qs) {
      const questions = inp.split(";")
      const myMsgs=[]
      for(let i=0; i<questions.length; i++){
        const inputs = questions[i].match(/^( *?Q: .+)(?= A: ) (A: .+)/);
        const userContent = inputs[1].replace("Q: ", "");
        const assistantContent = inputs[2].replace("A: ", "");
        myMsgs.push({ role: "user", content: userContent })
        myMsgs.push({ role: "assistant", content: assistantContent })
      }
    }
  };
  const contentRef = useRef(null);

  const scrollToBottom = () => {
    contentRef.current.scrollTo(0, contentRef.current.scrollHeight);
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleForm = () => {
    
    let content = '';
    if(gender=='male'){
      content += 'Hello Mr.'+name+', '
    }else if(gender=='female'){
      content += 'Hello Mrs.'+name+', '
    }else{
      content += 'Hello '+name+', '
    }
    content+= 'How are you? '
    if(age>=18){
      createCompletion('Ask a random question for a Person who is greater than 18 years old?')
      .then(res=>{
        content += res.data.choices[0].text
        setMessages([ { role: "assistant", content:content  }])
      })
    }else{
      createCompletion('Ask a random question for a Child who is less than 18 years old?')
      .then(res=>{
        content += res.data.choices[0].text
        setMessages([{ role: "assistant", content:content  }])
      })
    }
    
  }
  console.log(messages);
  return (
    <div className="app">
      <div className="scroll-bottom" onClick={scrollToBottom}>
        <BsFillFileArrowDownFill />
      </div>
      <div className="content" ref={contentRef}>
        <div className="header">
          <p>AI Chatbot</p>
        </div>
        <div className="myform">
          <input onChange={(e)=>setName(e.target.value)} type="text" placeholder="type your name" />
          <input onChange={(e)=>setAge(e.target.value)} type="number" placeholder="Age" />
          <select onChange={(e)=>setGender(e.target.value)} name="gender" id="">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <button onClick={handleForm}>submit</button>
        </div>
        <div className="messages">
          {messages.map((msg, id) => {
            return (
              <div className="msg" key={id} >
                <p>{
                  msg.role == "assistant" ? 'assistant' : 'user'
                }</p>
                <p>{" : "}</p>
                <p className="text">
                  {
                    msg.content.replace(specailPrompt, '')
                  }
                </p>
              </div>
              
            );
          })}
        </div>
        <div className="inputField">
          <input
            onChange={(e) => setInp(e.target.value)}
            onKeyDown={(e)=>{
              if(e.code=="Enter"){
                handleMessage()
              }
            }}
            value={inp}
            type="text"
            placeholder="type your message"
          />
          <button onClick={handleMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
