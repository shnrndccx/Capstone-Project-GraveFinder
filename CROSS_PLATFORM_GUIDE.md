# Cross-Platform Setup and Compatibility Guide

This guide ensures GraveFinder runs smoothly on **Windows**, **macOS**, and **Linux**.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Running the Application](#running-the-application)
4. [Troubleshooting](#troubleshooting)
5. [Development Guidelines](#development-guidelines)
6. [Verified Compatibility](#verified-compatibility)

---

## Prerequisites

### Required Software

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (v6 or higher) - Included with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Modern Web Browser** (Chrome, Firefox, Safari, Edge)

### Optional Software

- **VS Code** - Recommended editor with built-in Terminal support
- **Git Desktop** - For easier Git operations on Windows

### System Requirements

| OS | Minimum | Recommended |
|----|---------|------------|
| **Windows** | Windows 7 SP1+ | Windows 10/11 |
| **macOS** | macOS 10.12+ | macOS 10.15+ |
| **Linux** | Any modern distro | Ubuntu 18.04+ |

---

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/sca-xx/Capstone-Project-GraveFinder.git
cd Capstone-Project-GraveFinder
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- `http-server` - Local development server
- `prettier` - Code formatter (optional)

### Step 3: Verify Installation

```bash
npm -v        # Should show npm version
node -v       # Should show Node.js version
```

---

## Running the Application

### Option 1: Using NPM Scripts (Recommended)

**Development Server (with auto-reload):**
```bash
npm run dev
```

Then open your browser and navigate to: `http://localhost:8000`

**Production Server:**
```bash
npm run serve
```

### Option 2: Manual HTTP Server

If you have Node.js installed, without using npm scripts:

```bash
npx http-server -p 8000
```

### Option 3: Using Built-in Browser

Most modern browsers can serve local files, but some features may be blocked. For best results, use a local server (Option 1 or 2).

### Option 4: Visual Studio Code Live Server

If using VS Code:
1. Install the "Live Server" extension
2. Right-click on `index.html` in the visitors panel
3. Select "Open with Live Server"

---

## Troubleshooting

### Issue: "Command not found: npm"

**Windows Solution:**
- Reinstall Node.js and ensure the installer adds Node.js to PATH
- Restart your terminal/PowerShell after installation

**macOS/Linux Solution:**
```bash
# Install via Homebrew (macOS)
brew install node

# Install via apt (Ubuntu/Debian)
sudo apt update
sudo apt install nodejs npm
```

---

### Issue: "Port 8000 already in use"

Use a different port:
```bash
npx http-server -p 3000
```

Then visit `http://localhost:3000`

---

### Issue: CORS Errors in Browser Console

**Cause:** Loading files directly from the file system (`file://`) has restrictions.

**Solution:** Always use a local server (npm, http-server, or Live Server).

---

### Issue: Styling or JavaScript not Loading

**Windows-Specific:** Check that file path separators are consistent:
- ✅ Correct: `../assets/logo.png`
- ❌ Incorrect: `..\\assets\\logo.png`

All HTML files use forward slashes `/` which work on all platforms.

---

### Issue: Performance Issues on Older Computers

- Close unnecessary browser tabs
- Disable browser extensions
- Use a lighter browser (Chromium-based browsers are optimized)
- Clear browser cache: `Ctrl+Shift+Delete` (Windows/Linux) or `Cmd+Shift+Delete` (macOS)

---

## Development Guidelines

### Editor Configuration

This project includes `.editorconfig` which automatically configures:
- **Indentation:** 2 spaces (HTML, CSS, JS)
- **Line Endings:** LF (Unix-style) across all platforms
- **Character Set:** UTF-8
- **Final newline:** Required

**Supported Editors:**
- VS Code (requires EditorConfig extension)
- JetBrains IDEs (built-in support)
- Sublime Text (requires EditorConfig plugin)
- Vim/Neovim (requires EditorConfig plugin)

### Code Formatting

Format all code before committing:
```bash
npm run format
```

This uses Prettier to ensure consistent code style across the team.

---

### File Path Best Practices

✅ **DO:**
- Use forward slashes: `../assets/logo.png`
- Use relative paths for internal resources
- Use kebab-case for folder names (e.g., `admin-panel`, `visitors-panel`)
- Use lowercase filenames

❌ **DON'T:**
- Use backslashes: `..\\assets\\logo.png` (Windows-specific)
- Use absolute file paths
- Use spaces in folder names
- Mix path separators

---

### Browser Compatibility

The application is tested on:
- ✅ Chrome/Chromium 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**CSS Features Used:**
- CSS Grid and Flexbox (widely supported)
- CSS Variables (supported in all modern browsers)
- CSS Animations (widely supported)

**JavaScript Features:**
- ES6+ syntax (transpile if supporting older browsers)
- Fetch API (for any backend integration)
- IntersectionObserver (for scroll effects)

---

## Verified Compatibility

| Component | Windows 10+ | macOS 10.15+ | Ubuntu 18.04+ |
|-----------|:-----------:|:------------:|:-------------:|
| Node.js Installation | ✅ | ✅ | ✅ |
| npm Scripts | ✅ | ✅ | ✅ |
| HTTP Server | ✅ | ✅ | ✅ |
| HTML Rendering | ✅ | ✅ | ✅ |
| CSS Styling | ✅ | ✅ | ✅ |
| JavaScript | ✅ | ✅ | ✅ |
| File Paths | ✅ | ✅ | ✅ |
| SVG Graphics | ✅ | ✅ | ✅ |
| Animations | ✅ | ✅ | ✅ |
| Form Input | ✅ | ✅ | ✅ |

---

## Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Can I Use Browser Features](https://caniuse.com/)
- [EditorConfig Documentation](https://editorconfig.org/)

---

## Questions or Issues?

1. Check the Troubleshooting section above
2. Review GitHub Issues in the repository
3. Contact the Capstone Project Team

---

**Last Updated:** July 2024
**Version:** 1.0.0
