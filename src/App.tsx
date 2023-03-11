import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap'

function App() {

  const model = "gpt-3.5-turbo";
 
  const storageApiKey = localStorage.getItem("apiKey") || '';
  
  const [input, setInput] = useState("");
  const [apiKey, setApiKey] = useState(storageApiKey);
  const [completedSentence, setCompletedSentence] = useState("");
  const [loading, setLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const handleApiKeyChange = (event : any) => {
    setApiKey(event.target.value);
    localStorage.setItem("apiKey", event.target.value);
  };

  async function handleSubmit() {
      if (!apiKey) {
        setCompletedSentence("API KEY NOT SET!");
      }
      else {
        try {
          const completedSentence = await fetchData(input);
          setCompletedSentence(completedSentence);
        }
        catch (error : any) {
          setLoading(false);
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
          Authorization: `Bearer ${apiKey}`,
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

  const onShowApiKey = () => {
    setShowApiKey(!showApiKey);
  }
  
  return (
    <div className="ms-4">
        <h2 className="mt-2">OpenAI (ChatGPT) - Ask me a question</h2>
        <p className="mb-4"><small>v1.0.2</small></p>
        <div className="form-check form-switch mt-2">
            <input className="form-check-input" type="checkbox" onClick={onShowApiKey} />
            <label className="form-check-label">Show API Key</label>
        </div>
        {showApiKey && (
          <div className="form-group">
            <input className="form-control"
                      style={{ width: '1000px' }}
                      id="apiKeyInput"
                      type="text"
                      value={apiKey}
                      onChange={handleApiKeyChange} />
            <small className="form-text text-muted">API Key is only stored in your browser and is not visible by anyone else</small>
          </div>
        )}
        <div className="form-group mt-4">
          <label className="mb-2">My Question</label>
          <Form.Control
              style={{ width: '1000px' }}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={onKeyDown}
          /> 
        </div>
   
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
