const HOST = window.location.host;
const socket = new ReconnectingWebSocket(`ws://${HOST}/ws`);
let progress = document.getElementById("progress");

const cache = {};

socket.onopen = () =>
  console.log("Nyash Stream Overlay Connected Succesfully.");
socket.onclose = (event) => {
  console.log("Socket Closed Connection: ", event);
  socket.send("Client Closed!");
};
socket.onerror = (error) => console.log("Socket Error: ", error);

const animationOptions = {
  useEasing: true,
  useGrouping: false,
  separator: "",
  decimal: ".",
};

let animation = {
  pp: new CountUp("ppValue", 0, 0, 0, 0.5, animationOptions),
  ppIfFc: new CountUp("ppIfFc", 0, 0, 0, 0.5, animationOptions),
  hit100: new CountUp("hit100", 0, 0, 0, 0.5, animationOptions),
  hit50: new CountUp("hit50", 0, 0, 0, 0.5, animationOptions),
  hit0: new CountUp("hit0", 0, 0, 0, 0.5, animationOptions),
  hitsb: new CountUp("hitsb", 0, 0, 0, 0.5, animationOptions),
  bpm: new CountUp("bpm", 0, 0, 0, 0.5, animationOptions),
  bid: new CountUp("bid", 0, 0, 0, 0.5, animationOptions),
  sr: new CountUp("sr", 0, 0, 2, 0.5, animationOptions),
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data.menu.state == 2 || data.menu.state == 7) {
    if (cache["pp"] != data.gameplay.pp.current) {
      cache["pp"] = data.gameplay.pp.current;

      animation.pp.update(cache["pp"]);
    }

    if (cache["pp100"]) cache["pp100"] = undefined;
  } else {
    if (cache["pp100"] != data.menu.pp[100]) {
      cache["pp100"] = data.menu.pp[100];

      animation.pp.update(cache["pp100"]);
    }
  }

  if (cache["ppfc"] != data.gameplay.pp.fc) {
    cache["ppfc"] = data.gameplay.pp.fc;

    animation.ppIfFc.update(cache["ppfc"]);
  }

  if (cache["hit100"] != data.gameplay.hits[100]) {
    cache["hit100"] = data.gameplay.hits[100];

    animation.hit100.update(cache["hit100"]);
  }
  if (cache["hit50"] != data.gameplay.hits[50]) {
    cache["hit50"] = data.gameplay.hits[50];

    animation.hit50.update(cache["hit50"]);
  }
  if (cache["hit0"] != data.gameplay.hits[0]) {
    cache["hit0"] = data.gameplay.hits[0];

    animation.hit0.update(cache["hit0"]);
  }
  if (cache["hitsb"] != data.gameplay.hits.sliderBreaks) {
    cache["hitsb"] = data.gameplay.hits.sliderBreaks;

    animation.hitsb.update(cache["hitsb"]);
  }

  if (cache["bpm"] != data.menu.bm.stats.BPM.realtime) {
    cache["bpm"] = data.menu.bm.stats.BPM.realtime;

    animation.bpm.update(cache["bpm"]);
  }
  if (cache["sr"] != data.menu.bm.stats.fullSR) {
    cache["sr"] = data.menu.bm.stats.fullSR;

    animation.sr.update(cache["sr"]);
  }
  if (cache["bid"] != data.menu.bm.id) {
    cache["bid"] = data.menu.bm.id;

    animation.bid.update(cache["bid"]);
  }

  if (
    cache["missed"] !=
    `${data.gameplay.hits[0]}:${data.gameplay.hits.sliderBreaks}`
  ) {
    cache[
      "missed"
    ] = `${data.gameplay.hits[0]}:${data.gameplay.hits.sliderBreaks}`;

    if (cache["missed"] != "0:0")
      document.querySelector(".ppIfFc").style.opacity = 1;
    else document.querySelector(".ppIfFc").style.opacity = 0;
  }

  if (cache["current_time"] != data.menu.bm.time.current) {
    cache["current_time"] = data.menu.bm.time.current;

    progress.style.width =
      (178 / data.menu.bm.time.mp3) * cache["current_time"] + "px";
  }
};
