# GraveFinder Development Guide

Welcome to the GraveFinder development team! This guide helps you set up your development environment on **Windows, macOS, or Linux**.

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
- **Node.js** v14+ - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** - VS Code recommended - [Download](https://code.visualstudio.com/)

### Setup Steps

```bash
# 1. Clone the repository
git clone https://github.com/sca-xx/Capstone-Project-GraveFinder.git
cd Capstone-Project-GraveFinder

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# → http://localhost:8000
```

That's it! Your development server is running.

---

## 💻 Platform-Specific Setup

### Windows

#### Option A: Using Command Prompt (Recommended)
```cmd
cd Capstone-Project-GraveFinder
npm install
npm run dev
```

#### Option B: Using dev-server.bat
```cmd
cd Capstone-Project-GraveFinder
dev-server.bat
```

#### Option C: Using PowerShell
```powershell
cd Capstone-Project-GraveFinder
npm install
npm run dev
```

**Windows Tip:** Add project folder to PATH for easier terminal access:
- Right-click project folder → Properties → Share
- Then you can `cd` from any terminal

---

### macOS & Linux

#### Using Terminal
```bash
cd Capstone-Project-GraveFinder
npm install
npm run dev
```

#### Using dev-server.sh (Optional)
```bash
cd Capstone-Project-GraveFinder
chmod +x dev-server.sh
./dev-server.sh
```

**macOS Tip:** If Node.js isn't installed, use Homebrew:
```bash
brew install node
```

**Linux Tip (Ubuntu/Debian):** If Node.js isn't installed:
```bash
sudo apt update
sudo apt install nodejs npm
```

---

## 📁 Project Structure

```
Capstone-Project-GraveFinder/
├── README.md                          # Project overview
├── CROSS_PLATFORM_GUIDE.md           # Cross-platform setup (START HERE!)
├── BROWSER_COMPATIBILITY.md          # Browser support matrix
├── DEVELOPMENT.md                    # This file
├── package.json                      # Node.js dependencies
├── .editorconfig                     # Editor configuration
├── .gitattributes                    # Git line ending config
├── .prettierrc                       # Code formatting rules
│
├── admin panel/                      # Admin dashboard
│   ├── admin.html                    # Dashboard home
│   ├── admin-login.html              # Admin login
│   ├── admin-records.html            # Grave records management
│   ├── admin-appointments.html       # Appointment management
│   ├── admin-inquiries.html          # Inquiry management
│   ├── admin-settings.html           # System settings
│   └── css/
│       ├── admin.css                 # Admin styles
│       └── login.css                 # Login styles
│
├── visitors panel/                   # Visitor-facing pages
│   ├── index.html                    # Home page (START HERE)
│   ├── results.html                  # Search results
│   ├── visitors css/
│   │   ├── style.css                 # Main styles
│   │   └── results.css               # Results page styles
│   └── visitors javascripts/
│       ├── script.js                 # Main functions
│       └── results.js                # Results page logic
│
└── assets/                           # Static files
    ├── logo.png                      # Site logo
    ├── main office.jpg               # Office photo
    ├── office.jpg                    # Office photo 2
    └── gommp.mp4                     # Promotional video
```

---

## 🛠️ Available Commands

All commands work on **Windows, macOS, and Linux**.

```bash
npm run dev        # Start development server (http://localhost:8000)
npm run serve      # Serve without auto-reload
npm start          # Alias for 'npm run dev'
npm run format     # Format all code using Prettier
npm run lint       # Check code style (via .editorconfig)
npm test           # Run tests (not configured yet)
```

---

## 📝 Code Style Guidelines

This project uses **EditorConfig** and **Prettier** for consistent code style.

### EditorConfig (Automatic)
Your editor automatically applies these rules:
- **Indentation:** 2 spaces
- **Line endings:** LF (Unix-style) on all platforms
- **Character set:** UTF-8
- **Trailing whitespace:** Removed

### Installing EditorConfig Support

**VS Code:**
1. Install "EditorConfig for VS Code" extension
2. Reload VS Code
3. Done! (automatically applied)

**Other Editors:**
- JetBrains IDEs: Built-in support
- Sublime Text: Install "EditorConfig" plugin
- Vim/Neovim: Install "editorconfig-vim" plugin

### Prettier Formatting
Before committing code:
```bash
npm run format
```

This auto-formats:
- HTML files
- CSS files
- JavaScript files
- JSON files
- Markdown files

---

## 📂 File Path Rules

**Important for cross-platform compatibility:**

✅ **DO:**
- Use **forward slashes** in paths: `../assets/logo.png`
- Use **relative paths** for internal resources
- Use **lowercase** for folder and file names
- Use **hyphens** for multi-word names: `admin-panel`, `visitors-css`

❌ **DON'T:**
- Use backslashes: `..\\assets\\logo.png` (Windows-only)
- Use absolute file paths
- Use spaces in folder names
- Mix path separators

### Examples
```html
<!-- ✅ Correct -->
<link rel="stylesheet" href="visitors css/style.css">
<img src="../assets/logo.png" alt="Logo">
<script src="visitors javascripts/script.js"></script>

<!-- ❌ Incorrect (Windows-only) -->
<link rel="stylesheet" href="visitors css\style.css">
<img src="..\assets\logo.png" alt="Logo">
```

---

## 🔍 Testing Your Setup

### 1. Verify Installation
```bash
node --version      # Should show v14+ or higher
npm --version       # Should show 6.0.0+
git --version       # Should show 2.25.0+
```

### 2. Test Development Server
```bash
npm run dev
# Output should show:
# ⏳ Starting local development server on http://localhost:8000
# 📂 Serving files from: /path/to/project
```

### 3. Open in Browser
- **Chrome/Edge/Firefox:** http://localhost:8000
- You should see the "Garden of Memories" home page
- Try searching for a name (any value works)

### 4. Test All Pages
- ✅ Home page: `http://localhost:8000/visitors panel/index.html`
- ✅ Results: `http://localhost:8000/visitors panel/results.html`
- ✅ Admin login: `http://localhost:8000/admin panel/admin-login.html`
- ✅ Admin dashboard: `http://localhost:8000/admin panel/admin.html`

---

## 🐛 Troubleshooting

### Issue: "npm: command not found"
**Cause:** Node.js/npm not installed or not in PATH

**Solution:**
- Reinstall Node.js from https://nodejs.org/
- **Windows:** Restart after installation
- **macOS:** Run `which node` to verify
- **Linux:** Run `which npm` to verify

---

### Issue: "Port 8000 already in use"
**Cause:** Another application is using port 8000

**Solutions:**

Option 1: Use a different port
```bash
npx http-server -p 3000
# Then visit http://localhost:3000
```

Option 2: Stop the conflicting application
```bash
# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

---

### Issue: "CORS errors" in browser console
**Cause:** Loading directly with `file://` protocol

**Solution:** Always use a local server
```bash
npm run dev
# NOT: file:///C:/Users/...
# YES: http://localhost:8000
```

---

### Issue: CSS/JavaScript not loading
**Cause:** File path separator issue

**Solution:** Verify all paths use forward slashes
```html
<!-- ✅ Correct -->
<link rel="stylesheet" href="visitors css/style.css">

<!-- ❌ Wrong -->
<link rel="stylesheet" href="visitors css\style.css">
```

---

### Issue: Font not loading
**Cause:** Google Fonts CDN connection issue

**Solution:**
- Check internet connection
- Try a different DNS (8.8.8.8)
- Fallback fonts already included in code

---

### Issue: Browser cache issues
**Solution:** Hard refresh (clears cache):
- **Windows/Linux:** Ctrl + Shift + R
- **macOS:** Cmd + Shift + R
- Or disable cache in DevTools

---

## 📚 Learning Resources

### HTML/CSS/JavaScript
- [MDN Web Docs](https://developer.mozilla.org/) - Official reference
- [CSS-Tricks](https://css-tricks.com/) - CSS tutorials
- [freeCodeCamp](https://www.freecodecamp.org/) - Free courses

### Tools & Setup
- [Git Documentation](https://git-scm.com/doc)
- [VS Code Docs](https://code.visualstudio.com/docs)
- [npm Documentation](https://docs.npmjs.com/)
- [Node.js Documentation](https://nodejs.org/docs/)

### Browser Compatibility
- [Can I Use](https://caniuse.com/) - Check browser support
- [MDN Browser Compatibility](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Writing_style_guide/Code_style_guide/JavaScript#browser_compatibility)

---

## 🤝 Contributing

When contributing code:

1. **Create a new branch** from `develop`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following code style guidelines

3. **Format your code** before committing
   ```bash
   npm run format
   ```

4. **Test on multiple browsers** (see [BROWSER_COMPATIBILITY.md](BROWSER_COMPATIBILITY.md))

5. **Commit with clear messages**
   ```bash
   git commit -m "feat: add new search filters"
   ```

6. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

---

## 📋 Pre-commit Checklist

Before committing, verify:

- [ ] Code is formatted (`npm run format`)
- [ ] No hardcoded file paths or OS-specific paths
- [ ] All paths use forward slashes `/`
- [ ] Tested on Windows, macOS, or Linux
- [ ] Tested in Chrome, Firefox, and Safari
- [ ] No console errors or warnings
- [ ] Commit message is descriptive
- [ ] No credentials or sensitive info in code

---

## 🆘 Getting Help

If you're stuck:

1. **Check this guide** - you might find the answer here
2. **Search GitHub Issues** - problem might already be solved
3. **Check documentation** - [CROSS_PLATFORM_GUIDE.md](CROSS_PLATFORM_GUIDE.md)
4. **Browser DevTools** - open with F12 to check for errors
5. **Ask the team** - reach out to your Capstone Adviser or team members

---

## 📞 Support

- **Capstone Adviser:** [Contact info]
- **Team Lead:** [Contact info]
- **GitHub Issues:** Report bugs here
- **Slack/Discord:** Ask questions in the dev channel

---

**Happy coding! 🎉**

---

**Last Updated:** July 2024  
**Compatible:** Windows 7+, macOS 10.12+, Ubuntu 18.04+  
**Node.js:** v14 LTS or higher  
**npm:** v6.0.0 or higher
