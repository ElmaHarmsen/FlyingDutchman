// const dictionaryList = {
//   page_title: {
//     en: "The Flying Dutchman",
//     sv: "Den Flygande Holländaren",
//     nl: "De Vliegende Hollander"
//   }
// }

// export default function dictionary(key, language) {
//   return dictionaryList[key][language];
// }

var language = "en";

const languageDictionary = {
  "keys": ["page_title"],

  "en": {
    "page_title": "The Flying Dutchman"
  },
  "sv": {
    "page_title": "Den Flygande Holländaren"
  },
  "nl": {
    "page_title": "De Vliegende Hollander"
  }
}

function getLanguage(key) {
  return languageDictionary[language][key];
}

function changeLanguage() {
  if (language === "en") {
    language = "sv";
  } else {language = "en"};
  update_view();
}