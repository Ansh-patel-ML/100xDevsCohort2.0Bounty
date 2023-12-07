var player = videojs(
  "my-video",
  {
    controls: true,
    fluid: true,
    html5: {
      vhs: {
        overrideNative: true,
      },
    },
  },
  function () {
    var player = this;
    player.eme();
    player.src({
      src: "https://cdn.bitmovin.com/content/assets/art-of-motion_drm/mpds/11331.mpd",
      type: "application/dash+xml",
      keySystems: {
        "com.widevine.alpha": "https://cwip-shaka-proxy.appspot.com/no_auth",
      },
    });
    const x = player.play();
    const segmentObj = {
      1: {
        start: 0,
        end: 30,
        segmentTitle: "Segment 1",
      },
      2: {
        start: 30,
        end: 60,
        segmentTitle: "Segment 2",
      },
      3: {
        start: 60,
        end: 90,
        segmentTitle: "Segment 3",
      },
      4: {
        start: 90,
        end: 120,
        segmentTitle: "Segment 4",
      },
      5: {
        start: 120,
        end: 150,
        segmentTitle: "Segment 5",
      },
    };

    setTimeout(() => {
      const vedioProgressBar = document.getElementsByClassName(
        "vjs-progress-holder"
      )[0];
      const vedioPlayProgress =
        document.getElementsByClassName("vjs-play-progress")[0];
      const vedioProgressBarWidth = vedioProgressBar.clientWidth;
      const totalDuration = player.duration();
      const pixelPerSecond = vedioProgressBarWidth / totalDuration;
      // const segmentDiv = document.createElement("div");
      // segmentDiv.className = "segment-div";
      // segmentDiv.style.width = vedioProgressBarWidth + "px";
      // vedioProgressBar.appendChild(segmentDiv);
      vedioPlayProgress.style.zIndex = "30";
      vedioProgressBar.style.display = "flex";
      vedioPlayProgress.classList.add("disable-hover");
      for (let i = 1; i <= Object.keys(segmentObj).length; i++) {
        const segment = document.createElement("div");
        segment.className = `segment-${i} scale`;
        segment.style.border = "0px";
        segment.style.borderRight = "3px solid rgba(43,51,63,.7)";
        segment.style.height = "0.3em";
        segment.style.zIndex = "15";
        segment.style.width =
          (segmentObj[i].end - segmentObj[i].start) * pixelPerSecond + "px";
        segment.addEventListener("mouseover", () => {
          segment.style.cursor = "pointer";
          segment.style.backgroundColor = "rgba(115,133,159, 1)";
          segment.style.zIndex = "0";
        });
        segment.addEventListener("mouseout", () => {
          segment.style.backgroundColor = "transparent";
          segment.style.scale = "1";
          segment.style.zIndex = "15";
        });
        // segmentDiv.appendChild(segment);
        vedioProgressBar.appendChild(segment);
      }
    }, 5000);

    function updateSegmentStyles() {
      const currentTime = player.currentTime();

      console.log(currentTime);

      for (let i = 1; i <= Object.keys(segmentObj).length; i++) {
        const segment = document.querySelector(`.segment-${i}`);

        if (currentTime >= segmentObj[i].end) {
          // Update styles when the segment's time ends
          segment.style.zIndex = "50";
          segment.style.borderRight = "3px solid rgba(43,51,63,1)";
        } else {
          // Reset styles for segments that haven't reached their end time
          segment.style.zIndex = "15";
          segment.style.borderRight = "3px solid rgba(43,51,63,.7)";
        }
      }
    }

    // Periodically check the video's current time for updates
    setInterval(updateSegmentStyles, 500); // Check every 500 milliseconds (adjust as needed)
  }
);
