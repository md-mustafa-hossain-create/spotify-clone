# Spotify Clone — Minimal Web Player

A lightweight, Spotify-inspired music player built with plain HTML, CSS and JavaScript. This project reproduces the look-and-feel of a Spotify desktop UI and includes a playlist, sidebar library, and basic playback controls — all implemented client-side without frameworks or a back-end.

> This is a UI-focused demo for learning and presentation. It does not connect to the official Spotify API or any streaming service.

Key languages (repo composition): CSS, JavaScript, HTML

## Features
- Responsive two-column layout: sidebar (library) + main area (playlist)
- Dynamically-generated playlist and sidebar song list
- Playback controls: play/pause, next, previous
- Seekbar with current time display
- Volume control
- Local audio playback from the `songs/` folder
- No build step — open in a browser or serve as static files

## Tech stack
- HTML5
- CSS3 (styles split across `style.css` and `utility.css`)
- Vanilla JavaScript (`script.js`)
- Static assets in `asset/` (icons, images)
- Local audio files in `songs/`

## Quick start

Prerequisites
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Optional: a static server for best results (recommended)

Clone the repository:
```
git clone https://github.com/md-mustafa-hossain-create/spotify-clone.git
cd spotify-clone
```

Run locally
- Quick (open directly):
  - Open `index.html` in your browser.
- Recommended (serve files):
  - Python 3:
    ```
    python -m http.server 8000
    ```
    Open http://localhost:8000 in your browser.
  - VS Code: use Live Server extension.

## Usage
1. Place your audio files (MP3, OGG, etc.) into the `songs/` folder.
2. Open the project in a browser or via a local server.
3. Use the playbar to play/pause, skip tracks, seek within a track, and adjust volume.
4. If tracks do not appear automatically, open `script.js` and update the songs array or loader to include your file names and metadata.

## Project structure
- index.html — main markup
- style.css — core styles
- utility.css — helper utility classes
- script.js — playlist generation and player logic
- asset/ — icons and images used in the UI
- songs/ — local audio files (user-supplied)

## Customization
- Playlist metadata (title, artist, cover) is defined in `script.js`. Edit the song objects to change content.
- Replace assets in `asset/` to rebrand the UI.
- Modify colors and layout in `style.css` to change theme.
- Add keyboard shortcuts or additional features by editing `script.js`.

## Notes & limitations
- This is a static, client-side demo. There is no authentication, server, or streaming service integration.
- Not integrated with Spotify services — for demo and learning only.
- Avoid adding copyrighted audio to the repository. Keep audio files local or add them to .gitignore if you do not want them committed.

## Contributing
Contributions are welcome. Suggested workflow:
1. Fork the repo.
2. Create a branch: git checkout -b feature/your-feature
3. Commit changes: git commit -m "Add feature"
4. Push and open a pull request.

Please provide clear descriptions and avoid committing large/audio files.

## License
MIT License — free to reuse and modify. (If you prefer a different license, tell me and I will update this section.)

## Contact
Repository owner: md-mustafa-hossain-create
Repo URL: https://github.com/md-mustafa-hossain-create/spotify-clone
