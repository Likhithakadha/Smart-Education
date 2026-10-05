from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# 1. Serves your exact visualizer UI at the main URL
@app.route('/')
def home():
    return render_template('index.html')

# 2. A backend API route to receive data from your frontend
@app.route('/api/save-progress', methods=['POST'])
def save_progress():
    data = request.json
    print(f"Backend received user progress: {data}")
    # You can save this data to a database (like SQLite) here later
    return jsonify({"status": "success", "message": "Saved successfully!"})

if __name__ == '__main__':
    app.run(debug=True)