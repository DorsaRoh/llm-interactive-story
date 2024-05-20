import React, { useEffect, useState, useRef } from "react";

const Index: React.FC = () => {
  const [message, setMessage] = useState("Loading");
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastUserMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/home")
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
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
          setPrompt(""); // clear the prompt input field after submission

          // ensure the chat container scrolls to the user's inputted message
          if (lastUserMessageRef.current) {
            setTimeout(() => {
              if (lastUserMessageRef.current) {
                lastUserMessageRef.current.scrollIntoView({ behavior: "smooth" });
              }
            }, 100); // add a slight delay to ensure the DOM updates correctly
          }
        } else {
          console.error("Error generating text:", data.error);
        }
      })
      .catch((error) => console.error("Error generating text:", error));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Interactive Odyssey</h1>
        <p>{message}</p>
      </header>
      <main className="app-main">
        <div className="input-container">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here"
            rows={4}
          />
          <button onClick={handleGenerateText}>Submit</button>
        </div>
        <div className="narrative-intro">
          As the sun rises over the ancient city of Troy, you, Odysseus, stand at the head of your army, strategizing the next move in the siege against the impenetrable walls of the city. The Trojan War has raged on for years, and your cunning mind has been instrumental in the Greek army's victories thus far. Your keen intellect and resourcefulness have earned you the respect of your comrades and the favor of the gods. However, the path to victory is fraught with challenges and dangers. As you survey the battlefield, a messenger approaches you, bearing news of a potential traitor within the walls of Troy. It seems a Trojan princess, Cassandra, has been secretly communicating with the Greek forces, offering valuable insights into the city's defenses. Your next move could determine the fate of the war.
        </div>
        <div className="chat-container" ref={chatContainerRef}>
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              className={`chat-message ${chat.role}`}
              ref={chat.role === "user" ? lastUserMessageRef : null}
            >
              <strong>{chat.role === "user" ? "Odysseus" : "Narrator"}:</strong>
              <p>{chat.content}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
