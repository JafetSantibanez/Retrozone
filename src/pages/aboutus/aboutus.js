fetch("../../components/NavBar.html")
  .then(response => response.text())
  .then(data => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "text/html");
    const nav = doc.querySelector("nav");
    if (nav) {
      document.getElementById("navbar").innerHTML = nav.outerHTML;
    } else {
      document.getElementById("navbar").innerHTML = data;
    }
  });
