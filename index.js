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
    // player.play();
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
      const segmentDiv = document.createElement("div");
      const prevSegmentDiv = document.createElement("div");
      segmentDiv.className = "segment-div";
      prevSegmentDiv.className = "prev-segment-div";
      segmentDiv.style.width = vedioProgressBarWidth + "px";
      vedioProgressBar.appendChild(segmentDiv);
      vedioProgressBar.appendChild(prevSegmentDiv);
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
          vedioPlayProgress.classList.add("scaleProgress");
          vedioPlayProgress.style.zIndex = "20";

          prevSegmentDiv.innerHTML = "";
          for (let j = 1; j < i + 1; j++) {
            const prevEle = document.createElement("div");
            prevEle.className = `segment-${j} scale`;
            prevEle.style.border = "0px";
            prevEle.style.borderRight = "3px solid rgba(43,51,63,.7)";
            prevEle.style.height = "0.3em";
            prevEle.style.zIndex = "15";
            prevSegmentDiv.appendChild(prevEle);
          }
        });
        segment.addEventListener("mouseout", () => {
          segment.style.backgroundColor = "transparent";
          segment.style.scale = "1";
          segment.style.zIndex = "15";
          vedioPlayProgress.classList.remove("scaleProgress");
          vedioPlayProgress.style.zIndex = "0";
        });
        segmentDiv.appendChild(segment);
      }
    }, 5000);
  }
);
