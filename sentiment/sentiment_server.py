"""
Sentiment Analysis Microservice for SigmaGPT
Uses HuggingFace's distilbert model - no training needed!
Run this separately: python sentiment_server.py
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

# Load pretrained sentiment model (downloads once, ~67MB)
# distilbert is a lightweight deep learning transformer model
print("Loading sentiment model...")
sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)
print("Model ready!")

EMOJI_MAP = {
    "POSITIVE": "😊",
    "NEGATIVE": "😟",
    "NEUTRAL":  "😐"
}

@app.route("/sentiment", methods=["POST"])
def analyze():
    data = request.get_json()
    message = data.get("message", "")

    if not message.strip():
        return jsonify({ "sentiment": "NEUTRAL", "emoji": "😐", "score": 0.5 })

    result = sentiment_pipeline(message[:512])[0]  # truncate to 512 tokens max
    label = result["label"]      # "POSITIVE" or "NEGATIVE"
    score = round(result["score"], 3)

    # Treat low-confidence predictions as neutral
    if score < 0.70:
        label = "NEUTRAL"

    return jsonify({
        "sentiment": label,
        "emoji": EMOJI_MAP[label],
        "score": score
    })

@app.route("/health", methods=["GET"])
def health():
    return jsonify({ "status": "ok" })

if __name__ == "__main__":
    app.run(port=5001, debug=False)