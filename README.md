# Spotify Clone - Web-Based Audio Streaming Interface

![Status](https://img.shields.io/badge/Status-Educational-yellow)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## 📖 Project Overview

This is a high-fidelity **Spotify Clone** engineered with pure, vanilla web technologies. It replicates the core experience of a modern music streaming application without relying on heavy frontend frameworks or external APIs.

The application features a custom-built audio player engine, dynamic DOM manipulation for content rendering, and an asynchronous file system scanner that mimics backend data fetching. It is designed to demonstrate advanced DOM manipulation, event handling, and modern JavaScript (ES6+) concepts in a real-world scenario.

## ✨ Key Features

*   **Dynamic Content Discovery**: Automatically scans the `songs/` directory to generate albums and playlists dynamically. No manual HTML updates required for new content.
*   **Custom Audio Engine**: Built-in audio controller managing playback state, seek operations, and volume normalization.
*   **Persistent Playback Controls**: Global footer player that persists navigation state across the application.
*   **Responsive UI Architecture**: A mobile-responsive sidebar and grid layout using modern CSS Flexbox and utility classes.
*   **Real-time Visual Feedback**: Interactive seek bars, volume sliders, and dynamic time updates (current time / duration).
*   **Metadata Parsing**: Reads `info.json` manifests for rich album details (cover art, titles, descriptions).

## 🛠 Tech Stack

*   **Core**: HTML5, CSS3, JavaScript (ES6+)
*   **Styling**: Custom utility-first CSS architecture (`utility.css`) for modular design.
*   **Data Transport**: `fetch` API for asynchronous resource loading.
*   **Assets**: SVG iconography for resolution-independent visuals.

## 🚀 Installation & Setup (Critical)

**⚠️ Important:** This application uses hardcoded absolute paths for local development.

To run this application successfully, you **must** serve it on port `5500`. The application explicitly fetches data from `http://127.0.0.1:5500/`.

### Recommended Method: VS Code Live Server

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/md-mustafa-hossain-create/spotify-clone.git
    cd spotify-clone
    ```

2.  **Install "Live Server" Extension**
    *   Open Visual Studio Code.
    *   Go to Extensions (`Ctrl+Shift+X`).
    *   Search for **"Live Server"** by Ritwick Dey and install it.

3.  **Launch the Application**
    *   Open `index.html` in the editor.
    *   Click the **"Go Live"** button in the bottom right corner of VS Code.
    *   **Verify Port:** Ensure the browser opens `http://127.0.0.1:5500/index.html` or `http://localhost:5500/index.html`.
    *   *Note: If Live Server defaults to a different port, you must change it to 5500 in settings or update `script.js` to match your port.*

## 📂 Data Management & Song Structure

The application uses a specific file system convention to act as a database. To add new music, follow this structure:

1.  **Create an Album Folder**:
    Navigate to the `songs/` directory and create a new folder (e.g., `songs/my_new_album`).

2.  **Add Metadata**:
    Create a file named `info.json` inside your new folder with the following schema:
    ```json
    {
      "title": "Album Title",
      "description": "Album Description",
      "img": "cover.jpg"
    }
    ```
    *Ensure you place a `cover.jpg` (or the image filename you specified) in the folder.*

3.  **Add Audio Files**:
    Drop your `.mp3` files into the folder. The application will automatically detect and list them.

**Directory Tree Example:**
```text
songs/
├── bollywood/
│   ├── info.json
│   ├── cover.jpg
│   ├── song1.mp3
│   └── song2.mp3
├── rock_classics/
│   ├── info.json
│   ├── cover.jpg
│   └── track1.mp3
```

## 🤝 Contributing

Contributions are welcome! Please ensure you adhere to the project's folder structure conventions.

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
