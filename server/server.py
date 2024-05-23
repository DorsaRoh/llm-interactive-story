from flask import Flask, jsonify, request
from flask_cors import CORS
from openai import OpenAI
import os
from dotenv import load_dotenv

# load environment variables from .env file
load_dotenv()

client = OpenAI(
   api_key = os.getenv("OPENAI_API_KEY"),
)

# load fine tuned model id from a file
with open('model_id.txt', 'r') as file:
    fine_tuned_model_id = file.read().strip()

# app instance
app = Flask(__name__)
CORS(app)

# /api/home
@app.route("/api/home", methods=['GET'])
def index():
    return jsonify({'message': 'Welcome to the OpenAI GPT-3.5 Turbo API!'})

# /api/text
@app.route("/api/text", methods=['POST'])
def generate_text():
    data = request.get_json()
    prompt = data.get('prompt', '')

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo", # model
            messages=[ # role of model and user
            {"role": "system", "content": "You are a highly detailed and consistent narrative guide for the user, who plays as Odysseus. Lead them through the epic journey of the fall of Troy and the Odyssey. Respond to user inputs by continuing the story, providing immersive and engaging narrative elements, and guiding the user through key decision points in the story. Include every detail (e.g. dialogue secrets whispers) without omitting anything. Ensure strict continuity and consistency in the story. Maintain the current setting and plot elements unless explicitly altered by the user's input. Keep track of past events, decisions, and interactions to provide a coherent and seamless narrative. Each response should acknowledge previous events and decisions to avoid contradictions. End each response with an engaging question that provokes the reader to continue the journey. Ensure that the user's inputs logically influence the story's progression, while keeping the overall narrative thread intact. The story starts with: As the sun rises over the ancient city of Troy, you, Odysseus, stand at the head of your army, strategizing the next move in the siege against the impenetrable walls of the city. The Trojan War has raged on for years, and your cunning mind has been instrumental in the Greek army's victories thus far. However, the path to victory is fraught with challenges and dangers. As you survey the battlefield, a messenger approaches you, bearing news of a potential traitor within the walls of Troy. It seems a Trojan princess, Cassandra, has been secretly communicating with the Greek forces, offering valuable insights into the city's defenses. Your next move could determine the fate of the war. What shall you do?"},
            {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.9
        )
        generated_text = response.choices[0].message.content
        return jsonify({'generated_text': generated_text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=8080)
