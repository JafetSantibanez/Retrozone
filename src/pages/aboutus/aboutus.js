<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 776aa07 (se guardaron cambios)
// fetch("../../components/NavBar.html")
//   .then(response => response.text())
//   .then(data => {
//     document.getElementById("navbar").innerHTML = data;
//   });
<<<<<<< HEAD

// fetch("../../components/Footer.html")
//   .then(response => response.text())
//   .then(data => {
//     document.getElementById("footer").innerHTML = data;
//   });
=======
fetch("../../components/NavBar.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;
  });

fetch("../../components/Footer.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("footer").innerHTML = data;
  });
>>>>>>> 01af8d5 (se guardaron cambios)
=======

// fetch("../../components/Footer.html")
//   .then(response => response.text())
//   .then(data => {
//     document.getElementById("footer").innerHTML = data;
//   });
>>>>>>> 776aa07 (se guardaron cambios)
=======
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
>>>>>>> origin/Andriy
