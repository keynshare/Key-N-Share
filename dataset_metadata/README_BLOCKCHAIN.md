# ⛓️ The Blockchain: The Magic Permanent Notebook

Welcome to the **Blockchain** part of KeyNShare! This is where we keep the most important records.

Imagine there is a **Giant Notebook** that sits floating in the middle of a big park. 
- Anyone in the world can read what’s in it.
- Anyone can ask to write a new page.
- But **NO ONE** can ever rip out a page or use an eraser!

---

## 📂 What’s Inside?

### 📜 `programs/dataset_metadata/src/lib.rs` (The Rules of the Notebook)
In the blockchain world, we don't just write whatever we want. We follow a **Smart Contract**. It’s like a magic spell that tells the Notebook exactly what to write.
- **What it does:** It makes sure that every time a dataset record is added, it has a name, a price, and an owner’s signature. 
- **Language:** It’s written in **Rust**. It’s a very strict language, like a teacher who checks every single comma!

---

## 🛠️ How it Works (The Solana Way)

1. **The Program:** Our code lives on the **Solana Blockchain**. Think of Solana as a super-fast team of messengers who pass the Magic Notebook around and make sure everyone agrees on what's written.
2. **Metadata:** We don't put the big dataset files in the Notebook (that would be too heavy!). Instead, we write down the **Metadata** (the title, the price, and a "Map Link" to where the file is hidden).
3. **Receipts:** When someone buys a dataset, the Notebook records the change. Now *everyone* can see that the new person is the rightful owner.

---

## 🧑‍💻 How Can You Help?

- **Want to add more details to the record?** You can update the `Dataset` struct in `lib.rs`.
- **Want to see the Notebook?** You can use a "Blockchain Explorer" website to look at our Program ID: `DPLTAXALPu5PRrWbwB3fYmPjq4o3vBYHm1vRRVJZY7rw`.

**The Magic Notebook is forever!** ✍️✨
