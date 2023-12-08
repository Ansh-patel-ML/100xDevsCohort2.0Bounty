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

    function handleWidthChange(entries) {
      for (let entry of entries) {
        // Do something when the width changes
        // Call your custom function here
        yourCustomFunction(entry.contentRect.width);
      }
    }
    const customProgressDot = document.createElement("div");
    customProgressDot.className = "custom-progress-dot";

    const targetElement =
      document.getElementsByClassName("vjs-play-progress ")[0];

    const y = document.getElementsByClassName("vjs-progress-holder")[0];

    y.appendChild(customProgressDot);

    const resizeObserver = new ResizeObserver(handleWidthChange);

    resizeObserver.observe(targetElement);

    function yourCustomFunction(newWidth) {
      customProgressDot.style.width = newWidth + "px";
    }

    setTimeout(() => {
      const vedioProgressBar = document.getElementsByClassName(
        "vjs-progress-holder"
      )[0];
      const vedioPlayProgress =
        document.getElementsByClassName("vjs-play-progress")[0];

      const vedioToolTipContainer =
        document.getElementsByClassName("vjs-mouse-display")[0];

      const vedioToolTipTimeStamp =
        document.getElementsByClassName("vjs-time-tooltip")[0];

      const vedioProgressBarWidth = vedioProgressBar.clientWidth;
      const totalDuration = player.duration();
      const pixelPerSecond = vedioProgressBarWidth / totalDuration;

      vedioPlayProgress.style.zIndex = "30";
      vedioProgressBar.style.display = "flex";
      vedioPlayProgress.classList.add("disable-hover");
      for (let i = 1; i <= Object.keys(segmentObj).length; i++) {
        const segment = document.createElement("div");

        segment.className = `segment-${i} scale`;
        segment.style.border = "0px";
        segment.style.borderRight = "3px solid rgba(43,51,63,.7)";
        segment.style.height = "0.3em";
        segment.style.zIndex = "50";
        segment.style.width =
          (segmentObj[i].end - segmentObj[i].start) * pixelPerSecond + "px";

        vedioToolTipContainer.style.display = "flex";
        vedioToolTipContainer.style.flexDirection = "column-reverse";
        vedioToolTipContainer.style.gap = "5px";
        vedioToolTipContainer.style.alignItems = "center";
        vedioToolTipTimeStamp.style.position = "unset";
        vedioToolTipContainer.style.top = "-20px";

        segment.addEventListener("mouseover", () => {
          if (segmentObj[i].end >= player.currentTime()) {
            segment.style.cursor = "pointer";
            segment.style.backgroundColor = "rgba(115,133,159, 1)";
            segment.style.zIndex = "15";
            segment.style.height = "0.35em";
            customProgressDot.style.height = "0.35em";
          } else {
            segment.style.borderRight = "3px solid rgba(43,51,63,1)";
            segment.style.backgroundColor = "white";
            segment.style.height = "0.35em";
          }
          handleSegmentTitle(
            segmentObj[i].segmentTitle,
            vedioToolTipContainer,
            i
          );
        });
        segment.addEventListener("mouseout", () => {
          if (segmentObj[i].end >= player.currentTime()) {
            segment.style.backgroundColor = "transparent";
            segment.style.scale = "1";
            segment.style.zIndex = "50";
            segment.style.height = "0.3em";
            customProgressDot.style.height = "0.3em";
          } else {
            segment.style.height = "0.3em";
            segment.style.backgroundColor = "transparent";
          }

          handleSegmentTitle(
            segmentObj[i].segmentTitle,
            vedioToolTipContainer,
            i,
            "REMOVE"
          );
        });
        vedioProgressBar.appendChild(segment);
      }
    }, 5000);

    function handleSegmentTitle(
      segmentTitle,
      toolTipContainer,
      segmentNumber,
      flag = "ADD"
    ) {
      if (flag === "ADD") {
        const segmentTitleContainer = document.createElement("div");
        segmentTitleContainer.className = `vjs-time-tooltip segment-title-${segmentNumber}`;
        segmentTitleContainer.style.position = "unset";
        segmentTitleContainer.style.width = "100px";
        segmentTitleContainer.style.backgroundColor = "rgba(43,51,63,1)";
        segmentTitleContainer.textContent = segmentTitle;
        toolTipContainer.appendChild(segmentTitleContainer);
      } else {
        const segmentTitle = document.getElementsByClassName(
          `segment-title-${segmentNumber}`
        )[0];
        toolTipContainer.removeChild(segmentTitle);
      }
    }
  }
);
