//function update_view intends to update all text in the current language to the newly selected one.
//for every key in the array of keys in dictionaryList, which we fetch from the dictionary.js file,
//and we declare a languageString and set it to the current language.
//then we find a textElement based on a dynamic querySelector, 
//and we set the text content to the text found in the dictionary.
function update_view(currentLanguage) {
  for (const key in dictionaryList) {
    const languageString = dictionaryList[key][currentLanguage];
    const textElement = document.querySelector("#" + key);
    if (textElement) {
      textElement.textContent = languageString;
    }
  };
}

//the first eventListener listens when the DOM content gets loaded.
//the second eventListener listens for a language change, and passes through a parameter that becomes the new language.
//update_view looks for details about this language. 
//
document.addEventListener("DOMContentLoaded", () => {

  document.addEventListener('languageChange', (newLanguage) => {
    update_view(newLanguage.detail.language);
    localStorage.setItem("setLanguage", newLanguage.detail.language);
  });
  
//this querySelectorAll finds all matches with the classname languageButton, which returns an array.
//the forEach loops over the array returned by querySelectorAll, the languageButton is one of each elements in the loop.
//the code inside the {} of this querySelectorAll runs for each of the (three) language buttons.
//the languageButton element has an eventListener for clicks on this element, which triggers an event called clickEvent.
//when a languageButton gets clicked, then it passes the information about this click event,
//and dispatches a custom event called languageChange.
//languageChange has a detail that contains information about the id of the button that was clicked.
//that identifies which language was chosen. 
  document.querySelectorAll('.languageButton').forEach((languageButton) => {
    languageButton.addEventListener('click', (clickEvent) => {
      document.dispatchEvent(new CustomEvent("languageChange", {
        detail: {
          language: clickEvent.target.id
        }
      }))
    })
  })

//(ternary operator) if getItem from the localStorage is existing, we read the item setLanguage from the localStorage, 
//and if it does not exist we use the default value which is sv. 
  update_view(localStorage.getItem("setLanguage") ? localStorage.getItem("setLanguage") : "sv");

  fetch("./beverages.json")
  .then(rawData => rawData.json())
  .then(beverageData => {
    if (beverageData.length) {
      const beverageElement = document.querySelector('#db_content');
      beverageData.forEach(beverage => {
        const beverageContainer = document.createElement("div");
        beverageContainer.innerHTML = 
        `
        <div class="ButtonItem">
          <div class="flag">
            <p>🇳🇱</p>
          </div>
          <div class="ButtonHeadline">
            <p>${beverage.name}</p>
          </div>
          <div class="ButtonBodyText">
            <p>TYPE OF BEVERAGE</p>
            <p>TYPE OF B/W/D</p> <!-- B = Beer, W = Whine, D = Drink --> 
            <p>ALK %</p>
          </div>
          <div class="ButtonHeadline">
            <p>__ SEK</p>
          </div>
        </div>
        `
        beverageElement.appendChild(beverageContainer);
      })
    }    
  })

})
