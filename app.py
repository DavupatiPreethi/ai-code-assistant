from flask import Flask, request, jsonify

app = Flask(__name__)

# 🗄️ In-memory database
history = []

# 🎨 Frontend
@app.route("/")
def home():
    return """
<!DOCTYPE html>
<html>
<head>
<title>AI Code Studio</title>

<style>
body {
  margin: 0;
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #0f172a, #020617);
  color: #e2e8f0;
}

.header {
  padding: 15px;
  text-align: center;
  font-size: 22px;
  color: #38bdf8;
  border-bottom: 1px solid #1e293b;
}

.container {
  display: flex;
  height: 90vh;
}

.sidebar {
  width: 220px;
  background: #020617;
  padding: 15px;
  border-right: 1px solid #1e293b;
}

.sidebar button {
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  background: #1e293b;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.sidebar button:hover {
  background: #38bdf8;
  color: black;
}

.main {
  flex: 1;
  padding: 20px;
}

textarea {
  width: 100%;
  height: 180px;
  background: #020617;
  border: 1px solid #334155;
  color: white;
  border-radius: 10px;
  padding: 15px;
  font-family: monospace;
}

.actions button {
  margin-top: 10px;
  margin-right: 10px;
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: linear-gradient(45deg, #38bdf8, #6366f1);
  color: white;
}

.card {
  margin-top: 20px;
  background: #020617;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #1e293b;
}

pre {
  white-space: pre-wrap;
}

</style>
</head>

<body>

<div class="header">🤖 AI Code Studio</div>

<div class="container">

  <div class="sidebar">
    <button onclick="showTab('editor')">Editor</button>
    <button onclick="showTab('history')">History</button>
  </div>

  <div class="main">

    <div id="editorTab">
      <textarea id="code" placeholder="Paste your code..."></textarea>

      <div class="actions">
        <button onclick="send('explain')">Explain</button>
        <button onclick="send('bugs')">Find Bugs</button>
        <button onclick="send('optimize')">Optimize</button>
      </div>

      <div class="card">
        <h3>Result</h3>
        <pre id="output">✨ Waiting for input...</pre>
      </div>
    </div>

    <div id="historyTab" style="display:none;">
      <div class="card">
        <h3>History</h3>
        <ul id="historyList"></ul>
      </div>
    </div>

  </div>
</div>

<script>

function showTab(tab){
  document.getElementById("editorTab").style.display = "none";
  document.getElementById("historyTab").style.display = "none";

  if(tab === "editor"){
    document.getElementById("editorTab").style.display = "block";
  } else {
    document.getElementById("historyTab").style.display = "block";
    loadHistory();
  }
}

async function send(type){
  const code = document.getElementById("code").value;

  const res = await fetch("/analyze", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({code: code, type: type})
  });

  const data = await res.json();
  document.getElementById("output").innerText = data.result;
}

async function loadHistory(){
  const res = await fetch("/history");
  const data = await res.json();

  const list = document.getElementById("historyList");
  list.innerHTML = "";

  data.reverse().forEach(item => {
    const li = document.createElement("li");
    li.innerText = item.substring(0, 60) + "...";
    list.appendChild(li);
  });
}

</script>

</body>
</html>
"""

# 🧠 Backend Logic
@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    code = data.get("code", "")
    mode = data.get("type", "")

    result = ""

    if mode == "explain":
        result = "📘 Explanation:\n"
        if "for" in code or "while" in code:
            result += "- Loop used\n"
        if "if" in code:
            result += "- Conditional logic\n"
        if "def" in code or "function" in code:
            result += "- Function defined\n"

    elif mode == "bugs":
        result = "🐞 Bug Analysis:\n"
        if "range(len(" in code and "+ 1" in code:
            result += "- Possible off-by-one error\n"
        else:
            result += "- No obvious bugs found\n"

    elif mode == "optimize":
        result = "⚡ Optimization:\n"
        if "for" in code:
            result += "- Consider using built-in functions\n"
        else:
            result += "- Code is simple\n"

    history.append(code)

    return jsonify({"result": result})

# 📂 History Route
@app.route("/history")
def get_history():
    return jsonify(history)

# 🚀 Run
import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
