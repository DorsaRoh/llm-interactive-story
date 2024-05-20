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
      <div>As the sun rises over the ancient city of Troy, you, Odysseus, stand at the head of your army, strategizing the next move in the siege against the impenetrable walls of the city. The Trojan War has raged on for years, and your cunning mind has been instrumental in the Greek army's victories thus far. Your keen intellect and resourcefulness have earned you the respect of your comrades and the favor of the gods. However, the path to victory is fraught with challenges and dangers. As you survey the battlefield, a messenger approaches you, bearing news of a potential traitor within the walls of Troy. It seems a Trojan princess, Cassandra, has been secretly communicating with the Greek forces, offering valuable insights into the city's defenses. Your next move could determine the fate of the war. Do you: Intercept the messenger and extract as much information as possible to exploit the traitor's knowledge? Send a covert team to rescue Cassandra and bring her to your camp for questioning? Ignore the information and focus on the current battle strategy, hesitant to trust the words of a potential spy?</div>
      <div>
        <div>
          {chatHistory.map((chat, index) => (
            <div key={index} style={{ margin: "10px 0" }}>
              <strong>{chat.role === "user" ? "Odysseus" : "___"}</strong>
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
