let currentSong = new Audio();

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

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");

  let response = await a.text();

  let div = document.createElement("div");

  div.innerHTML = response;

  let as = div.getElementsByTagName("a");

  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = "/songs/" + track;
  if (!pause) {
    currentSong.play();
    play.src = "asset/music-player-pause.svg";
  }

  document.querySelector(".songInfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
};
async function main() {
  // get the list of all the songs
  let songs = await getSongs();
  playMusic(songs[0], true);

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
  //Attach an event listner to play next and previous
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
}

main();
