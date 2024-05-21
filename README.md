
# LLM Interactive Story

LLM-powered infinite story generator. Here, is an example: the ancient greek stories of 'The Odyssey'. The LLM is fine-tuned on the story.

You, the user, play as Odysseus - a cunning greek warrior that famously created the plan to sack the city of Troy using a giant wooden horse.

<img width="1064" alt="Screenshot 2024-05-21 164717" src="https://github.com/DorsaRoh/llm-interactive-story/assets/85207154/9dacfee2-48a2-4cc2-a889-cf4278b3c3f5">

<br></br>
<i>Text generation:</i>

<img width="1067" alt="Screenshot 2024-05-21 165014" src="https://github.com/DorsaRoh/llm-interactive-story/assets/85207154/f83182ee-31d0-4cfa-953b-9221dea13796">


Created as a sample use case of: [Easily fine-tune AI models](https://github.com/DorsaRoh/gpt-finetune-kit)

## How it Works

In the `server` folder:
    
- The data to fine-tune the model is located in `data/data.jsonl`
<i><br>(see finetune.py for the fine-tuning code)</br></i>
- The fine-tuned model will be identified with an ID, which will be stored in `model_id.txt`

<i>Note: You will find sample data/prompts in data.jsonl</i>

### API Key Requirement

- You will need an OpenAI API key to use this toolkit.
- Add your OpenAI API key to a `.env` file in the `server` directory:

  ```plaintext
  OPENAI_API_KEY=your_openai_api_key_here
    ```
    
## Usage

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/gpt-finetune-kit.git
   cd gpt-finetune-kit
    ```


2. **Navigate to the 'server' directory**
    ```bash
    cd server
    pip install -r requirements.txt
    ```

2. **Insert the desired data and prompts in data/data.jsonl**

3. **Fine-tune model**
    ```bash
    python finetune.py
    ```

4. **Start the backend server to initiate the backend**
    ```bash
    python server.py
    ```
    <i>**The backend is now at http://localhost:8080/api/home**</i>


5. **Set up the frontend:**
Open a new terminal and navigate to the client directory
    ```bash
    cd ../client
    npm install
    npm run dev
    ```

    **<i>The frontend is now accessible at http://localhost:3000</i>**


Note: Please check your OpenAI projects dashboard to confirm the status of your fine-tuning jobs. If a job fails, it is likely due to improperly formatted or insufficient data.

Happy fine-tuning!
