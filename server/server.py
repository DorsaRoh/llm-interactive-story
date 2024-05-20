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

# /api/text
@app.route("/api/text", methods=['POST'])
def generate_text():
    data = request.get_json()
    prompt = data.get('prompt', '')

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo", # model
            messages=[ # role of model and user
            {"role": "system", "content": "You are a very detailed narrative guide for the user who plays as Odysseus, leading them through the epic journey of the fall of Troy and the Odyssey. Respond to user inputs by continuing the story, providing immersive and engaging narrative elements, and guiding the user through key decision points in the story. You do NOT leave out ANY information (ex. dialogue, secrets, whispers, everything). EVERY little detail is included. Each response should end with an engaging question that provokes the reader to continue."},
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
