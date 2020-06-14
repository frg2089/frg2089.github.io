function debug() { }
debug.goto404page = function () {
  window.location.href = '/404.html';
}
function theme() { console.log("共有两套颜色主题 分别是亮色和暗色"); }
theme.light = function () {
  document.getElementById("global_stylesheet").setAttribute("href", "/css/light.css");
}
theme.dark = function () {
  document.getElementById("global_stylesheet").setAttribute("href", "/css/dark.css");
}

console.log("Shimakaze's Blog Console");

// var getThemeStatus = getCookie("theme");
// if (getThemeStatus != null) {
//   switch (getThemeStatus) {
//     case "dark":
//       theme.dark();
//       break;
//     case "light":
//       theme.light();
//       break;
//   }
// }
