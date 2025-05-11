document.addEventListener("DOMContentLoaded", async () => {
    const trackList = document.getElementById("track-list");
  
    try {
      const response = await fetch("data/tracks.json");
      const tracks = await response.json();
  
      tracks.forEach(track => {
        const card = document.createElement("div");
        card.className = "track-card fade-in";
  
        const media = track.videoPreview
          ? `<video class="media-preview" controls>
               <source src="${track.videoPreview}" type="video/mp4">
               Your browser does not support the video element.
             </video>`
          : `<audio class="media-preview" controls>
               <source src="${track.audioPreview}" type="audio/mpeg">
               Your browser does not support the audio element.
             </audio>`;
  
        card.innerHTML = `
          <img src="${track.cover}" alt="${track.title} Cover">
          <h3>${track.title}</h3>
          ${media}
          <div class="platform-links">
            ${Object.entries(track.links).map(([name, url]) =>
              `<a href="${url}" target="_blank">${name}</a>`
            ).join('')}
          </div>
        `;
  
        // Add media play/pause listeners after media is inserted
        const mediaElement = card.querySelector(".media-preview");
        if (mediaElement) {
          mediaElement.addEventListener("play", () => {
            isAnimating = false;
          });
          mediaElement.addEventListener("pause", () => {
            isAnimating = true;
          });
          mediaElement.addEventListener("ended", () => {
            isAnimating = true;
          });
        }
  
        trackList.appendChild(card);
      });
  
    } catch (error) {
      console.error("Failed to load tracks:", error);
      trackList.innerHTML = "<p>Sorry, we couldn't load the music tracks.</p>";
    }
  });
  
  // Theme toggle
  const themeToggle = document.getElementById("themeToggle");
  
  // Set default state if stored in localStorage
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
    themeToggle.checked = true;
  }
  
  themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("light");
    localStorage.setItem("theme", document.body.classList.contains("light") ? "light" : "dark");
  });
  
  // Canvas wave animation
  const canvas = document.getElementById("waveCanvas");
  const ctx = canvas.getContext("2d");
  
  let width, height, animationId;
  let isAnimating = true;
  
  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  
  function drawWave(time) {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(30, 215, 96, 0.6)";
    ctx.beginPath();
  
    const amplitude = 20;
    const frequency = 0.01;
  
    for (let x = 0; x < width; x++) {
      const y =
        height / 2 +
        Math.sin(x * frequency + time * 0.002) * amplitude *
        Math.sin(time * 0.001 + x * 0.002);
      ctx.lineTo(x, y);
    }
  
    ctx.stroke();
  }
  
  function animate(time) {
    if (isAnimating) {
      drawWave(time);
    }
    animationId = requestAnimationFrame(animate);
  }
  
  animate();
  
  // Parallax canvas scroll effect
  window.addEventListener("scroll", () => {
    const offset = window.scrollY * 0.08;
    canvas.style.transform = `translateY(${offset}px)`;
  });
  
  // Parallax effect for other elements
  const parallaxLayers = document.querySelectorAll(".parallax-layer");
  
  window.addEventListener("scroll", () => {
    parallaxLayers.forEach(layer => {
      const speed = parseFloat(layer.getAttribute("data-speed"));
      const y = window.scrollY * speed;
      layer.style.transform = `translateY(${y}px)`;
    });
  });
  
  // Floating header effect
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".header");
    if (window.scrollY > 10) {
      header.style.height = "50px";
    } else {
      header.style.height = "60px";
    }
  });
  