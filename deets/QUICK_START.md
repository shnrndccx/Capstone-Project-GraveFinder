# GraveFinder Quick Reference Guide

*Print this page and keep it handy!*

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Prerequisites
- **Node.js** v14+ - Download from https://nodejs.org/
- **Git** - Download from https://git-scm.com/
- Done! ✅

### Step 2: Clone Repository
```bash
git clone https://github.com/sca-xx/Capstone-Project-GraveFinder.git
cd Capstone-Project-GraveFinder
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Start Development Server
```bash
npm run dev
```

### Step 5: Open in Browser
**http://localhost:8000**

---

## 💻 Platform-Specific Commands

### Windows (Command Prompt)
```cmd
cd Capstone-Project-GraveFinder
npm run dev
```

### Windows (PowerShell)
```powershell
cd Capstone-Project-GraveFinder
npm run dev
```

### Windows (Using Batch File)
```cmd
cd Capstone-Project-GraveFinder
dev-server.bat
```

### macOS/Linux (Terminal)
```bash
cd Capstone-Project-GraveFinder
npm run dev
```

### macOS/Linux (Using Shell Script)
```bash
cd Capstone-Project-GraveFinder
chmod +x dev-server.sh
./dev-server.sh
```

---

## 📋 Essential Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run serve` | Start without auto-reload |
| `npm run format` | Format all code |
| `npm install` | Install dependencies (one-time) |
| `npm outdated` | Check for updates |
| `npm update` | Update dependencies |

---

## 🌐 Test URLs

After starting the server, visit:

| Page | URL |
|------|-----|
| **Home** | http://localhost:8000/visitors%20panel/index.html |
| **Results** | http://localhost:8000/visitors%20panel/results.html |
| **Admin Login** | http://localhost:8000/admin%20panel/admin-login.html |
| **Admin Dashboard** | http://localhost:8000/admin%20panel/admin.html |

---

## 🐛 Quick Troubleshooting

### "npm: command not found"
- Reinstall Node.js from https://nodejs.org/
- Restart your terminal
- Run `node --version` to verify

### "Port 8000 already in use"
```bash
npx http-server -p 3000
```
Then visit: `http://localhost:3000`

### "CSS/JavaScript not loading"
- Make sure you're using `http://` not `file://`
- Do a hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (macOS)

### "Can't find module 'http-server'"
```bash
npm install
```

---

## 📚 Documentation

| File | Read When |
|------|-----------|
| **IMPLEMENTATION_SUMMARY.md** | You want an overview |
| **CROSS_PLATFORM_GUIDE.md** | You're setting up |
| **DEVELOPMENT.md** | You're starting development |
| **BROWSER_COMPATIBILITY.md** | You're testing |
| **RECOMMENDATIONS.md** | You want to improve things |

---

## ✅ Verification Checklist

- [ ] Node.js installed: `node --version` shows v14+
- [ ] npm installed: `npm --version` shows 6.0+
- [ ] Project cloned: `cd Capstone-Project-GraveFinder` works
- [ ] Dependencies installed: `npm install` completed
- [ ] Server starts: `npm run dev` shows no errors
- [ ] Browser loads: http://localhost:8000 works
- [ ] Page loads: You see "Garden of Memories" title

---

## 🎯 Daily Workflow

**Morning (First Time)**
```bash
npm install
npm run dev
```

**Each Day**
```bash
npm run dev
```

**Before Committing**
```bash
npm run format
```

**After Team Updates**
```bash
git pull
npm install
npm run dev
```

---

## 🔗 Quick Links

- **Node.js:** https://nodejs.org/
- **npm Docs:** https://docs.npmjs.com/
- **Git:** https://git-scm.com/
- **VS Code:** https://code.visualstudio.com/
- **MDN Web Docs:** https://developer.mozilla.org/

---

## 📞 Getting Help

1. **Check documentation** - Start with DEVELOPMENT.md
2. **Search GitHub Issues** - Problem might already be solved
3. **Ask the team** - Capstone Adviser or team lead
4. **Check browser console** - Press F12 for error details

---

## 💡 Pro Tips

- **VS Code Users:** Install "Live Server" extension for extra features
- **Keep Updated:** Run `npm outdated` monthly
- **Format First:** Always run `npm run format` before committing
- **Test Browsers:** Chrome, Firefox, and Safari before declaring done
- **Port Conflicts:** Change port to 3000 if 8000 is busy

---

## 🚀 You're Ready!

That's all you need to get started. Welcome to the GraveFinder development team! 🎉

**Questions?** Check the documentation or ask your team lead.

---

**Last Updated:** July 2024  
**Compatible:** Windows 7+, macOS 10.12+, Linux (all distros)  
**Node.js:** v14 LTS or higher
