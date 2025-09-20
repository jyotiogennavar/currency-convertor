Perfect 🙌 let’s update your **README** with the correct tech stack: **Next.js, Axios, Tailwind CSS, Framer Motion, and Postman**.

---

# 💱 Currency Converter

A simple **currency converter web app** built with **Next.js** that uses the free [FXRates API](https://api.fxratesapi.com/latest) to fetch the latest exchange rates and convert between currencies.

## 🚀 Features

* Fetches **real-time exchange rates** from the FXRates API
* Convert between **any two currencies**
* Clean and responsive UI with **Tailwind CSS**
* Smooth animations using **Framer Motion**
* API tested and validated with **Postman**

## 🛠️ Tech Stack

* **Framework**: [Next.js](https://nextjs.org/)
* **HTTP Client**: [Axios](https://axios-http.com/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Animations**: [Framer Motion](https://www.framer.com/motion/)
* **API Testing**: [Postman](https://www.postman.com/)

## ⚙️ Installation & Setup

1. Clone the repo:

   ```bash
   git clone https://github.com/your-username/currency-converter.git
   cd currency-converter
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the project:

   ```bash
   npm run dev
   ```

4. Open in your browser:

   ```
   http://localhost:3000
   ```

## 📖 Usage

1. Enter the amount to convert.
2. Select **From Currency** and **To Currency** from dropdowns.
3. Click **Convert** to get the result instantly.

### Conversion Logic

Since the API uses **USD as the base**, the formula is:

* **USD → Other**:

  ```
  result = amount * rates[to]
  ```
* **Other → USD**:

  ```
  result = amount / rates[from]
  ```
* **Other → Other**:

  ```
  result = amount * (rates[to] / rates[from])
  ```

## 🧪 API Testing with Postman

* Used **Postman** to verify responses from `/latest` endpoint.
* Ensured correct handling of:

  * Success responses
  * Invalid currency codes
  * Network errors

## 📌 Notes

* Free tier allows only **latest rates** with **USD base**.
* For advanced features (historical data, direct conversion API), upgrade to a paid plan.

## 🖼️ Example

```bash
100 EUR → INR
= 100 * (rates["INR"] / rates["EUR"])
= 8940.40
```

## 📜 License

This project is open source under the **MIT License**.

---
