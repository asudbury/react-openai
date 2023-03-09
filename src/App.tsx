import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap'

function App() {

  const model = "gpt-3.5-turbo";
  const API_KEY = process.env.REACT_APP_API_KEY;

  const [input, setInput] = useState("");
  const [completedSentence, setCompletedSentence] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
      if (!API_KEY) {
        setCompletedSentence("API KEY NOT SET!");
      }
      else {
        try {
          const completedSentence = await fetchData(input);
          setCompletedSentence(completedSentence);
        }
        catch (error : any) {
        setCompletedSentence(error.message);
      }
    }
  }
  
  const fetchData = async (input: string) => {
    
    setLoading(true);
    setCompletedSentence("");

    const messages = [{"role": "user", "content": input.split(" ").join(",")}] 

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: model,
        messages: messages
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );
    
    setLoading(false);
    return response.data.choices[0].message.content;

  };

  const onKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }

  return (
    <div className="ms-4">
      <h2 className="mt-4 mb-4">OpenAI (ChatGPT) - Ask me a question</h2>
      <Form.Control
          style={{ width: '1000px' }}
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={onKeyDown}
       />     
      <Button className="mt-4 mb-2" onClick={handleSubmit}>Answer my question</Button>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{completedSentence}</pre>

      {loading && (
        <div className="d-flex align-items-center">
              <strong>Please wait......</strong>
              <div className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></div>
          </div>
        )}

      </div>
  );
}

export default App;
