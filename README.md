# 🧠 Hackathon Project – Contribution Guide (Beginner Friendly)

This guide explains **exactly how to contribute** to the project using Git & GitHub. No prior experience required.

---

## 1️⃣ Project Rules (Read First)

- ❌ Do NOT push directly to `main`
- ❌ Do NOT push directly to `dev`
- ✅ Always work on your **own branch**
- ✅ Use **Pull Requests** to submit work
- ✅ Ask before merging

--- 

## 2️⃣ Clone the Repository (One-Time Setup)

```bash
git clone <REPO_URL>
cd <PROJECT_FOLDER>
```

---

## 3️⃣ Switch to the Development Branch

Always start from `dev`.

```bash
git checkout dev
git pull origin dev
```

---

## 4️⃣ Create Your Own Branch

Create a new branch for your task:

```bash
git checkout -b feature/your-name-task
```

Examples:

```
feature/frontend-ui
feature/backend-api
feature/ux-design
feature/docs
```

---

## 5️⃣ Make Your Changes

Now you can:

- Write code
- Edit files
- Design UI
- Fix bugs
- Update documentation

Take your time.

---

## 6️⃣ Check and Commit Your Changes

### Check what you changed:

```bash
git status
```

### Add files:

```bash
git add .
```

### Commit with a message:

```bash
git commit -m "Describe what you did"
```

Example:

```bash
git commit -m "Add reports API endpoint"
```

---

## 7️⃣ Push Your Branch to GitHub

```bash
git push origin feature/your-name-task
```

---

## 8️⃣ Create a Pull Request (PR)

1. Go to the GitHub repository
2. Click **Pull Requests**
3. Click **New Pull Request**
4. Base branch → `dev`
5. Compare branch → your feature branch
6. Add a short description
7. Click **Create Pull Request**

Done 🎉

---

## 🔁 Before Starting New Work (Every Time)

Always update your local `dev` branch:

```bash
git checkout dev
git pull origin dev
```

---

## 🚨 Common Mistakes to Avoid

- ❌ Working directly on `main`
- ❌ Forgetting to create a branch
- ❌ Pushing secrets or `.env` files
- ❌ Panic if something breaks 😄

Ask for help if unsure.

---

## 🏁 Final Note

This is a **hackathon**. Learning > perfection.

Mistakes are normal. Communication is key. We build together 💪

Let’s ship something awesome 🚀


[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/dilV9AFl)
