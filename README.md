# Ansh // Cybersecurity & Automation Portfolio

A highly-customized, futuristic cyberpunk terminal and interactive dashboard portfolio designed for **Ansh**, an Electronics & Communication Engineering (Advanced Communication Technology) student at **MAIT, Delhi**.

## 🚀 Key Features

* **Interactive Retro Terminal Emulator**: Type commands like `help`, `about`, `skills`, `projects`, `contact`, `clear`, `matrix`, or `hack` to run security simulations.
* **Live Security Logic Scanner**: A frontend vulnerability diagnostics playground. Paste headers or configurations and run regular expression matching heuristics to highlight risks (secrets, weak hashes, SQL injection patterns, and missing HTTP headers).
* **System Overclock Easter Egg**: A special mode that turns the dashboard red, alters system integrity readings, speed-scrolls backgrounds, and runs a dramatic power state animation.
* **Matrix Rain Mode**: An inline canvas script rendering green digital rain falls when typing `matrix` inside the shell console.
* **Modern Aesthetic Styling**: Developed in vanilla CSS using glassmorphic cards, CRT screen flickers, neon glow themes, custom status bars, and full responsive alignment.
* **Smart Avatar Rendering**: Preloaded to search for `me.jpg`. Falls back automatically to a secret agent icon if custom assets are unavailable.

## 🛠️ Tech Stack

* **Structure**: Semantic HTML5 markup
* **Styles**: Modern Vanilla CSS3 with variables, transitions, custom keyframe animations, and linear grids
* **Logic**: Vanilla ES6 Javascript (Canvas APIs, Regular Expressions, Sound controls, and Tab Navigators)
* **Icons**: [FontAwesome v6](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css)
* **Fonts**: `Orbitron`, `Fira Code`, and `Inter` via Google Fonts

---

## 🌐 How to Host on GitHub Pages

Since this portfolio is built with pure, serverless frontend code (HTML/CSS/JS), it is fully optimized to run on GitHub Pages for free.

Follow these simple steps to deploy your site:

### 1. Stage and Commit Your Changes
Make sure you are in the portfolio directory (`C:\Users\Ansh\APK`):
```bash
# Verify files are tracked
git status

# Stage all files
git add .

# Create your first commit
git commit -m "Initialize cyber terminal portfolio site"
```

### 2. Create a Repository on GitHub
1. Go to [GitHub](https://github.com/) and log in to your account (`@anshk011`).
2. Click **New** to create a new repository.
3. Name it `portfolio` (or your preferred name). Let it be **Public**.
4. **Do not** initialize it with a README, `.gitignore`, or license (since we already have them locally).
5. Click **Create repository**.

### 3. Connect Local Repo and Push
Copy the commands from the GitHub repository setup screen, or run:
```bash
# Rename default branch to main
git branch -M main

# Link your local repo to GitHub (replace with your repository url)
git remote add origin https://github.com/anshk011/portfolio.git

# Push the code
git push -u origin main
```

### 4. Enable GitHub Pages
1. Go to your repository page on GitHub.
2. Click on the **Settings** tab.
3. On the left sidebar, click **Pages** (under the "Code and automation" section).
4. Under **Build and deployment** -> **Branch**:
   * Change the branch from *None* to `main`.
   * Keep the directory path as `/ (root)`.
5. Click **Save**.
6. Wait 1-2 minutes. GitHub will display a message at the top of the Pages settings page showing:
   > Your site is live at `https://anshk011.github.io/portfolio/`

---

## ⚡ Interactive Commands Cheat Sheet

Try entering these commands in your portfolio terminal:
* `help` - Show manual menu
* `about` - Display university profile and focus statement
* `skills` - Display graphic representation of skill levels
* `projects` - Show featured repositories
* `contact` - Log secure links (GitHub, email, node)
* `matrix` - Spawn vertical digital rainfall canvas
* `hack` - Run simulated vulnerability test scan
* `clear` - Clear console output history
