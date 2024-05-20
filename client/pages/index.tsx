import React, { useEffect, useState } from "react";

const Index: React.FC = () => {
  const [message, setMessage] = useState("Loading");
  const [people, setPeople] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/home")
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
        setPeople(data.people);
      })
      .catch((error) => {
        console.error("Error fetching home data:", error);
        setMessage("Error loading data");
      });
  }, []);

  const handleGenerateText = () => {
    fetch("http://localhost:8080/api/text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.generated_text) {
          setChatHistory((prevHistory) => [
            ...prevHistory,
            { role: "user", content: prompt },
            { role: "assistant", content: data.generated_text },
          ]);
          setPrompt(""); // clear prompt input field after submission
        } else {
          console.error("Error generating text:", data.error);
        }
      })
      .catch((error) => console.error("Error generating text:", error));
  };

  return (
    <div>
      <div>{message}</div>
      <div>
        <div>
          {chatHistory.map((chat, index) => (
            <div key={index} style={{ margin: "10px 0" }}>
              <strong>{chat.role === "user" ? "Odysseus" : "Narrator"}:</strong>
              <p>{chat.content}</p>
            </div>
          ))}
        </div>
        <h2>Enter prompt:</h2>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here"
        />
        <button onClick={handleGenerateText}>Generate Text</button>

      </div>
    </div>
  );
};

export default Index;
