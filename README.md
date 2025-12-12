# Link Directory Project

A modern, web-based directory for organizing and accessing your favorite URLs. Built with Node.js, Express, and Vanilla JavaScript using a JSON-based persistence layer.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green.svg)

## 🚀 Features

-   **Link Registration**: Easily add new links with a title, URL, and category.
-   **Categorization**: Organize links into predefined categories (Search Engines, Development, News, etc.).
-   **JSON Persistence**: links are stored in a local `db.json` file, mimicking a database without the setup overhead.
-   **New Tab Navigation**: All links automatically open in a new tab for seamless browsing.
-   **Confetti Celebration**: Enjoy a fun confetti pop whenever you successfully add a new link! 🎉
-   **Responsive Design**: A beautiful, dark-themed UI that works on desktop and mobile.

## 🛠️ Tech Stack

-   **Backend**: Node.js, Express.js
-   **Frontend**: HTML5, CSS3, Vanilla JavaScript
-   **Data**: JSON (File System)
-   **Libraries**: `canvas-confetti` (for animations)

## 📦 Installation

1.  **Clone the repository** (or download source):
    ```bash
    git clone <repository-url>
    cd LinkDirectory
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Start the Server**:
    ```bash
    npm start
    # OR
    node server.js
    ```

4.  **Open in Browser**:
    Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

1.  **View Links**: The main page mimics a dashboard showing all current links.
2.  **Add Link**: Use the form at the top to submit a new URL.
    -   Select a Category from the dropdown.
    -   Click "Add Link" and watch the confetti!
3.  **Navigate**: Click "Visit Site" on any card to open the link in a new tab.

## 📁 Project Structure

```
LinkDirectory/
├── public/             # Static frontend files
│   ├── app.js          # Client-side logic (fetch, DOM, confetti)
│   ├── index.html      # Main HTML structure
│   └── style.css       # Custom styles
├── db.json             # JSON "Database" file
├── package.json        # Project metadata and dependencies
├── server.js           # Express backend server
└── README.md           # Project documentation
```

## 📄 License

This project is licensed under the ISC License.
