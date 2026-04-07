const express = require("express");
const app = express();

app.use(express.json());

let codeHistory = [];

app.get("/", (req, res) => {
  res.send(`
  <html>
  <head>
    <title>AI Code Assistant</title>
    <style>
      body {
        margin: 0;
        font-family: 'Segoe UI', sans-serif;
        background: #0d1117;
        color: #c9d1d9;
        display: flex;
      }

      /* Sidebar */
      .sidebar {
        width: 220px;
        background: #161b22;
        padding: 15px;
        height: 100vh;
        border-right: 1px solid #30363d;
      }

      .sidebar h2 {
        color: #58a6ff;
      }

      .sidebar li {
        padding: 8px;
        cursor: pointer;
        border-radius: 6px;
      }

      .sidebar li:hover {
        background: #21262d;
      }

      /* Main */
      .main {
        flex: 1;
        padding: 20px;
      }

      h1 {
        color: #58a6ff;
      }

      textarea {
        width: 100%;
        height: 200px;
        background: #161b22;
        color: #c9d1d9;
        border: 1px solid #30363d;
        border-radius: 8px;
        padding: 10px;
        font-family: monospace;
      }

      button {
        margin-top: 10px;
        margin-right: 10px;
        padding: 10px 15px;
        background: #238636;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
      }

      button:hover {
        background: #2ea043;
      }

      .box {
        margin-top: 20px;
        padding: 15px;
        background: #161b22;
        border-radius: 8px;
        border: 1px solid #30363d;
      }

      .tabs button {
        background: #30363d;
      }

      .tabs button.active {
        background: #58a6ff;
        color: black;
      }

      pre {
        white-space: pre-wrap;
      }
    </style>
  </head>

  <body>

    <div class="sidebar">
      <h2>🤖 AI Tool</h2>
      <ul>
        <li onclick="showTab('main')">Analyze</li>
        <li onclick="showTab('history')">History</li>
      </ul>
    </div>

    <div class="main">

      <h1>🚀 AI Code Assistant</h1>

      <div id="mainTab">
        <textarea id="code" placeholder="Paste your code..."></textarea>
        <br>
        <button onclick="analyze()">Analyze</button>
        <button onclick="clearCode()">Clear</button>

        <div class="box">
          <h3>📊 Result</h3>

          <div class="tabs">
            <button onclick="showSection('explain')" class="active">Explain</button>
            <button onclick="showSection('bugs')">Bugs</button>
            <button onclick="showSection('optimize')">Optimize</button>
          </div>

          <pre id="explain" class="section"></pre>
          <pre id="bugs" class="section" style="display:none;"></pre>
          <pre id="optimize" class="section" style="display:none;"></pre>
        </div>
      </div>

      <div id="historyTab" style="display:none;">
        <div class="box">
          <h3>📁 History</h3>
          <ul id="history"></ul>
        </div>
      </div>

    </div>

    <script>
      function showTab(tab) {
        document.getElementById("mainTab").style.display = "none";
        document.getElementById("historyTab").style.display = "none";

        if (tab === "main") {
          document.getElementById("mainTab").style.display = "block";
        } else {
          document.getElementById("historyTab").style.display = "block";
          loadHistory();
        }
      }

      function showSection(section) {
        document.querySelectorAll(".section").forEach(el => el.style.display = "none");
        document.getElementById(section).style.display = "block";

        document.querySelectorAll(".tabs button").forEach(btn => btn.classList.remove("active"));
        event.target.classList.add("active");
      }

      async function analyze() {
        const code = document.getElementById("code").value;

        const res = await fetch("/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code })
        });

        const data = await res.json();

        document.getElementById("explain").innerText = data.explain;
        document.getElementById("bugs").innerText = data.bugs;
        document.getElementById("optimize").innerText = data.optimize;
      }

      function clearCode() {
        document.getElementById("code").value = "";
      }

      async function loadHistory() {
        const res = await fetch("/history");
        const data = await res.json();

        const list = document.getElementById("history");
        list.innerHTML = "";

        data.forEach(item => {
          const li = document.createElement("li");
          li.innerText = item.substring(0, 60) + "...";
          list.appendChild(li);
        });
      }
    </script>

  </body>
  </html>
  `);
});

// 🧠 Smart AI-like backend
app.post("/analyze", (req, res) => {
  const { code } = req.body;

  let explain = "📘 Explanation:\n";
  let bugs = "🐞 Bug Analysis:\n";
  let optimize = "🚀 Optimization:\n";

  if (code.includes("def") || code.includes("function"))
    explain += "- Function is defined\n";

  if (code.includes("for") || code.includes("while"))
    explain += "- Loop is used\n";

  if (code.includes("if"))
    explain += "- Conditional logic present\n";

  if (code.includes("return"))
    explain += "- Returns a value\n";

  if (explain === "📘 Explanation:\n")
    explain += "- Basic code structure\n";

  // Bugs
  if (code.includes("range(len("))
    bugs += "- Possible inefficient loop usage\n";
  else
    bugs += "- No major issues found\n";

  // Optimize
  if (code.includes("range(len("))
    optimize += "- Use direct iteration instead of index\n";
  else
    optimize += "- Code is already clean\n";

  codeHistory.push(code);

  res.json({ explain, bugs, optimize });
});

app.get("/history", (req, res) => {
  res.json(codeHistory);
});

app.listen(3000, () => {
  console.log("🔥 Running at http://localhost:3000");
});