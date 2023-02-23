// import dictionary from "../FlyingDutchman/dictionary.js";

// //language change function
// window.addEventListener('languageChange', () => {
//   console.log('language has changed!')
// })

function update_view() {
  keys = languageDictionary["keys"];
  for (index in keys) {
    key = keys[index];
    $("#" + key).text(getLanguage(key));
  };
}

$(document).ready(function() {
  update_view();
})