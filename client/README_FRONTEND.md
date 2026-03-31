# 🎨 The Frontend: The Magic Shop Window

Welcome to the **Frontend**! This folder is where we build everything you see and click on the website. 

Imagine you are building a giant **LEGO Kingdom**. Every button, every box, and every page is a different LEGO brick that we snap together.

---

## 📂 What’s Inside?

### 🧱 `components/` (The LEGO Bricks)
These are small parts we can use over and over again.
- **Example:** A "Buy Button" or a "Cool Header". Instead of building a button for every page, we build it once here and use it everywhere!

### 🗺️ `app/` (The Rooms in our Castle)
Each folder here is like a different **room** in our shop.
- `catalogue/`: The big room with all the toys (datasets) on display.
- `upload-dataset/`: The room where you can bring your own toys to sell.
- `cart/`: Where you keep the toys you want to buy later.
- `authentication/`: The front door where you show your ID card (Log in).

### 📚 `lib/` (The Rulebooks & Magic Spells)
This is where we keep the special instructions.
- `lib/api/`: How we send messages to the **Back Office** (Server).
- `lib/solana/`: The "Magic Spells" we use to talk to the **Magic Notebook** (Blockchain).

---

## 🛠️ How it Works (The LEGO System)

1. **Pages:** We use something called **Next.js**. It’s like a map that tells the computer which room to show when you click a link.
2. **Styles:** We use **Tailwind CSS**. It’s like a bucket of paint that lets us make buttons blue, red, or bouncy with just a few words.
3. **Data:** When you click "Buy", the Frontend sends a "Help!" message to the Server and a "Write this down!" message to the Blockchain.

---

## 🧑‍💻 How Can You Help?

- **Want to change a color?** Look in `globals.css` or the components.
- **Want to add a new page?** Add a new folder in `app/`.
- **Found a bug?** Check the "Spells" in `lib/` to see if we said the magic words wrong!

**Have fun building!** 🧱✨
