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

async function main() {
  // get the list of all the songs
  let songs = await getSongs();
  console.log(songs);

  document.querySelector(".songList ul").innerHTML = songs
    .map((song) => {
      return `<li>
                <img
                  class="invert"
                  src="asset/music-logo.svg"
                  alt="music logo"
                />
                <div class="info">
                  <div>${song.replaceAll("%20", " ").split("128")[0]}</div>
                  <div>artist name</div>
                </div>
                <div class="playnow">
                  <span>Play Now</span>
                  <img src="asset/play.svg" alt="play" />
                </div>
              </li>`;
    })
    .join(" ");

  //play the first song
  let audio = new Audio("http://127.0.0.1:5500/songs/" + songs[0]);
  //   audio.play();

  //get the duration of the song
  audio.addEventListener("loadeddata", () => {
    let duration = audio.duration;
    console.log(duration);
  });
}

main();
