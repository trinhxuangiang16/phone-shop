window.onscroll = function () {
  let header = document.getElementById("header");
  if (window.scrollY > 90) {
    header.style.backgroundColor = "rgba(0, 0, 0, 0.308)";
  } else {
    header.style.backgroundColor = "transparent";
  }
};
