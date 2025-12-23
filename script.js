let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutes(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);

  let response = await a.text();

  let div = document.createElement("div");

  div.innerHTML = response;

  let as = div.getElementsByTagName("a");

  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  document.querySelector(".songList ul").innerHTML = "";
  document.querySelector(".songList ul").innerHTML = songs
    .map((song) => {
      return `<li>
                <img
                  class="invert"
                  src="asset/music-logo.svg"
                  alt="music logo"
                />
                <div class="info">
                  <div>${song
                    .replaceAll("%20", " ")
                    .replace("128 Kbps", "")
                    .replace(".mp3", "")
                    .replaceAll("- Copy", "")
                    .trim()}</div>
                  <div>artist name</div>
                </div>
                <div class="playnow">
                  <span>Play Now</span>
                  <img src="asset/play.svg" alt="play" />
                </div>
              </li>`;
    })
    .join(" ");

  //Attach an event listener to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((listItem, index) => {
    listItem.addEventListener("click", (e) => {
      // Use the index to play the correct song from the original array
      playMusic(songs[index]);
    });
  });

  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "asset/music-player-pause.svg";
  }

  document.querySelector(".songInfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = `
    <span class="curr">00:00</span>
    <span class="slash">/</span>
    <span class="dur">00:00</span>
  `;
};

async function displayAlbums() {
  let a = await fetch(`http://127.0.0.1:5500/songs/`);

  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");

  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    let e = array[index];
    if (e.href.includes("/songs")) {
      let folder = e.href.split("/songs/")[1];

      // Stop if folder is undefined or empty (happens for '.../songs/')
      if (!folder) continue;

      // Remove trailing slash if present (some servers return 'bollywood/' instead of 'bollywood')
      if (folder.endsWith("/")) {
        folder = folder.slice(0, -1);
      }

      //Get the meta data of the folder
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);

      // If info.json is not found (e.g. it's not a album folder), skip it
      if (!a.ok) continue;

      let response = await a.json();
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `  <div class="card" data-folder="${folder}">
              <div class="play">
                <img src="asset/play.svg" alt="play" />
              </div>
              <img
                src="/songs/${folder}/${response.img}"
                alt=""
              />
              <h2>${response.title}</h2>
              <p>${response.description}</p>
            </div>`;
    }
  }

  //load the playlist when card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((event) => {
    event.addEventListener("click", async (items) => {
      songs = await getSongs(`songs/${items.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });
}

async function main() {
  // get the list of all the songs
  await getSongs("songs/bollywood");
  // Play the first song by default or a random one, but paused initially
  playMusic(songs[Math.floor(Math.random() * songs.length)], true);

  //display all the albums on the page
  displayAlbums();

  //Attach an event listner to play
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "asset/music-player-pause.svg";
    } else {
      currentSong.pause();
      play.src = "asset/music-player-play.svg";
    }
  });

  //listen to the timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `
    <span class="curr">${secondsToMinutes(currentSong.currentTime)}</span>
    <span class="slash">/</span>
    <span class="dur">${secondsToMinutes(currentSong.duration)}</span>
    `;
    //handle the progress bard
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // Handles seekbar clicks to update song playback time.
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });
  //Add an event lisitner hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  //Add an event lsitner close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });

  // Add event listeners to play the next and previous songs.
  document.querySelector("#previous").addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/songs/")[1]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  document.querySelector("#next").addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/songs/")[1]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (event) => {
      currentSong.volume = parseInt(event.target.value) / 100;
    });

  //Add event listener to mute the track
  document.querySelector(".volume>img").addEventListener("click", (e) => {
    if (e.target.src.includes("volume.svg")) {
      e.target.src = e.target.src.replace("volume.svg", "mute.svg");
      currentSong.volume = 0;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = e.target.src.replace("mute.svg", "volume.svg");
      currentSong.volume = 0.1;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 10;
    }
  });
}

main();
