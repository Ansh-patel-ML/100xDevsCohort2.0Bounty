class VideoSegmentManager {
  constructor(videoId) {
    // Initialize Video.js player with specified options
    this.player = videojs(
      videoId,
      {
        controls: true,
        fluid: true,
        html5: {
          vhs: {
            overrideNative: true,
          },
        },
      },
      this.initialize.bind(this) // Binding the initialize method to ensure the correct 'this' context
    );

    // Object to store video segments
    this.segmentObj = {};
  }

  initialize() {
    // Initialize Encrypted Media Extensions (EME) for DRM
    this.player.eme();

    // Set video source and DRM configuration
    this.player.src({
      src: "https://cdn.bitmovin.com/content/assets/art-of-motion_drm/mpds/11331.mpd",
      type: "application/dash+xml",
      keySystems: {
        "com.widevine.alpha": "https://cwip-shaka-proxy.appspot.com/no_auth",
      },
    });

    // Start playing the video
    const x = this.player.play();

    // Setup event listeners for adding segments
    this.setupEventListeners();

    // Start interval to update segment styles periodically
    this.startUpdateInterval();

    // Error container element
    this.errorContainer = document.getElementById("error-container");
  }

  setupEventListeners() {
    // Add event listener to the "Add Segment" button
    document.getElementById("add-segment").addEventListener("click", () => {
      // Get start and end times from input fields and add a segment
      const startTime = parseInt(document.getElementById("start-time").value);
      const endTime = parseInt(document.getElementById("end-time").value);
      const segmentTitle = document.getElementById("segment-title").value;
      this.addSegment(startTime, endTime, segmentTitle);
    });
  }

  startUpdateInterval() {
    // Set interval to update segment styles every 500 milliseconds
    setInterval(this.updateSegmentStyles.bind(this), 500);
  }

  // Method to add a new segment to the video
  addSegment(start, end, segmentTitle) {
    // Generate a new segment ID
    const newSegmentId = Object.keys(this.segmentObj).length + 1;

    if (!this.isValidTime(start) || !this.isValidTime(end)) {
      this.showError(
        "Please enter valid positive whole numbers for start and end times."
      );
      return; // Exit method if there's an error
    }

    // Validate segment timing
    if (newSegmentId === 1 && start !== 0) {
      throw new Error("The first segment must start from 0 seconds.");
    }

    const lastSegment = this.segmentObj[Object.keys(this.segmentObj).length];

    if (lastSegment && start !== lastSegment.end) {
      throw new Error("Segments must be continuous. Please adjust start time.");
    }

    if (newSegmentId !== 1 && start < lastSegment.end) {
      throw new Error("Segments must be continuous. Please adjust start time.");
    }

    // Add segment to the segment object
    this.segmentObj[newSegmentId] = {
      start: start,
      end: end,
      segmentTitle: `${segmentTitle}`,
    };

    // Update segment display on the video progress bar
    this.updateSegmentDisplay(newSegmentId, start, end, segmentTitle);
  }

  isValidTime(time) {
    return Number.isInteger(time) && time >= 0;
  }

  showError(errorMessage) {
    // Display error message in the error container
    this.errorContainer.textContent = errorMessage;
  }

  // Method to update segment styles based on current video time
  updateSegmentStyles() {
    const currentTime = this.player.currentTime();

    for (let i = 1; i <= Object.keys(this.segmentObj).length; i++) {
      const segment = document.querySelector(`.segment-${i}`);

      if (currentTime >= this.segmentObj[i].end) {
        // Style completed segments
        segment.style.zIndex = "50";
        segment.style.borderRight = "5px solid rgba(43,51,63,1)";
      } else {
        // Style ongoing segments
        segment.style.zIndex = "15";
        segment.style.borderRight = "5px solid rgba(43,51,63,.7)";
      }
    }
  }

  // Method to update the visual representation of segments on the progress bar
  updateSegmentDisplay(segmentId, start, end, segmentTitle) {
    // Calculate dimensions for the segment representation
    const vedioToolTip =
      document.getElementsByClassName("vjs-mouse-display")[0];
    const vedioPlayProgress =
      document.getElementsByClassName("vjs-play-progress")[0];
    const vedioToolTipTimeStamp =
      document.getElementsByClassName("vjs-time-tooltip")[0];
    const vedioProgressBar = document.getElementsByClassName(
      "vjs-progress-holder"
    )[0];
    const vedioProgressBarWidth = vedioProgressBar.clientWidth;
    const pixelPerSecond = vedioProgressBarWidth / this.player.duration();
    vedioPlayProgress.style.zIndex = "30";
    vedioProgressBar.style.display = "flex";

    // Create a div element to represent the segment visually
    const segment = document.createElement("div");
    segment.className = `segment-${segmentId} scale`;
    segment.style.border = "0px";
    segment.style.borderRight = "3px solid rgba(43,51,63,.7)";
    segment.style.height = "0.3em";
    segment.style.zIndex = "15";
    segment.style.width = (end - start) * pixelPerSecond + "px";

    // Add a text label to the segment representation

    const segmentLabel = document.createElement("div");
    segmentLabel.className = "vjs-time-tooltip";
    segmentLabel.textContent = `${segmentTitle}`;
    vedioToolTip.appendChild(segmentLabel);
    vedioToolTip.style.display = "flex";
    vedioToolTip.style.flexDirection = "column-reverse";
    vedioToolTip.style.gap = "5px";
    vedioToolTip.style.alignItems = "center";
    segmentLabel.style.position = "unset";
    segmentLabel.style.width = "fit-content";
    vedioToolTipTimeStamp.style.position = "unset";
    vedioToolTip.style.top = "-20px";

    // Add mouseover and mouseout event listeners for segment interaction
    segment.addEventListener("mouseover", () => {
      segment.style.cursor = "pointer";
      segment.style.backgroundColor = "rgba(115,133,159, 1)";
      segment.style.zIndex = "0";
      segmentLabel.style.display = "contents";
    });
    segment.addEventListener("mouseout", () => {
      segment.style.backgroundColor = "transparent";
      segment.style.scale = "1";
      segment.style.zIndex = "15";
      // segmentLabel.style.display = "none";
    });

    // Append the segment representation to the video progress bar
    vedioProgressBar.appendChild(segment);
  }
}

// Create an instance of VideoSegmentManager
const segmentManager = new VideoSegmentManager("my-video");
