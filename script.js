// script.js
const popup = document.getElementById("popup");
const popupbtn = document.getElementById("popupbtn");
const popupstatus = document.getElementById("popupstatus");
const cardmain = document.getElementById("cardmain");
const header = document.getElementById("header");
const progress = document.getElementById("progress");
const menubtn = document.getElementById("menubtn");
const menu = document.getElementById("menu");
const sections = document.querySelectorAll(".section");
const skillbars = document.querySelectorAll(".skillbar");
const likebtns = document.querySelectorAll(".likebtn");
const navbtns = document.querySelectorAll(".navbtn");
const menubtns = document.querySelectorAll(".menubtn");
const canvas = document.getElementById("bgcanvas");
const ctx = canvas.getContext("2d");

const binid = "69d13eee36566621a87bf035";

function gotosection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

navbtns.forEach(function(btn) {
  btn.addEventListener("click", function() {
    gotosection(btn.getAttribute("datago"));
  });
});

menubtns.forEach(function(btn) {
  btn.addEventListener("click", function() {
    gotosection(btn.getAttribute("datago"));
    menu.classList.remove("open");
  });
});

menubtn.addEventListener("click", function() {
  menu.classList.toggle("open");
});

document.addEventListener("click", function(e) {
  if (!menu.contains(e.target) && e.target !== menubtn) {
    menu.classList.remove("open");
  }
});

cardmain.addEventListener("click", function() {
  cardmain.classList.toggle("flip");
});

likebtns.forEach(function(btn) {
  btn.addEventListener("click", function() {
    btn.classList.toggle("active");
  });
});

function updatescroll() {
  const top = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const value = height > 0 ? (top / height) * 100 : 0;
  progress.style.width = value + "%";

  if (top > 15) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

function revealsections() {
  const trigger = window.innerHeight * 0.86;

  sections.forEach(function(section) {
    const rect = section.getBoundingClientRect();
    if (rect.top < trigger) {
      section.classList.add("visible");
    }
  });

  skillbars.forEach(function(bar) {
    const rect = bar.getBoundingClientRect();
    if (rect.top < trigger) {
      bar.style.width = bar.getAttribute("datawidth");
    }
  });
}

window.addEventListener("scroll", function() {
  updatescroll();
  revealsections();
});

updatescroll();
revealsections();

popupbtn.addEventListener("click", async function() {
  popupbtn.disabled = true;
  popupstatus.textContent = "Connecting...";

  try {
    const res = await fetch("/api/connectjson", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "connect",
        binid: binid
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Connection failed");
    }

    popupstatus.textContent = data.message || "Connected successfully";

    setTimeout(function() {
      popup.classList.remove("show");
    }, 900);
  } catch (error) {
    popupstatus.textContent = error.message || "Connection failed";
    popupbtn.disabled = false;
  }
});

function resizecanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

const dots = [];
const dotcount = 42;

function createdots() {
  dots.length = 0;
  for (let i = 0; i < dotcount; i++) {
    dots.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.6,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25
    });
  }
}

function drawbg() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < dots.length; i++) {
    const d = dots[i];
    d.x += d.vx;
    d.y += d.vy;

    if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
    if (d.y < 0 || d.y > canvas.height) d.vy *= -1;

    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(0,229,204,0.28)";
    ctx.fill();

    for (let j = i + 1; j < dots.length; j++) {
      const n = dots[j];
      const dx = d.x - n.x;
      const dy = d.y - n.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 110) {
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(n.x, n.y);
        ctx.strokeStyle = "rgba(0,229,204," + (0.09 - dist / 1500) + ")";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(drawbg);
}

resizecanvas();
createdots();
drawbg();

window.addEventListener("resize", function() {
  resizecanvas();
  createdots();
});
