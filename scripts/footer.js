document.addEventListener("DOMContentLoaded", function () {
  const footer = document.querySelector("footer");
  const today = new Date().toLocaleDateString("en-GB");
  footer.innerHTML = `Hannah Sofie Eriksen, ${today}`;
});
