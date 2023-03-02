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
  }
}

//the first eventListener listens when the DOM content gets loaded.
//the second eventListener listens for a language change, and passes through a parameter that becomes the new language.
//update_view looks for details about this language.
//localStorage sets the item that we called setLanguage to the new language that has been selected.
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("languageChange", (newLanguage) => {
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
  document.querySelectorAll(".languageButton").forEach((languageButton) => {
    languageButton.addEventListener("click", (clickEvent) => {
      document.dispatchEvent(
        new CustomEvent("languageChange", {
          detail: {
            language: clickEvent.target.id,
          },
        })
      );
    });
  });

  //(ternary operator) if getItem from the localStorage is existing, we read the item setLanguage from the localStorage,
  //and if it does not exist we use the default value which is sv.
  update_view(
    localStorage.getItem("setLanguage")
      ? localStorage.getItem("setLanguage")
      : "sv"
  );

  //fetch() fetches the beverages.json file, then formatts the data to a json, then parses it further.
  //we call the data beverageData, and make sure there is something in it by checking the length.
  //the next block is about creating an HTML element that displays the data coming from the json.
  //from the HTML we select an element by its id db_content, in which we will display the carditem for each beverage.
  //forEach item in the json, which we call beverage, we display an HTML element.
  //the HTML element uses the name beverage to get information.
  //using appendChild we make beverageContainer the child element of beverageElement (parent), and
  //with that we give it a place in the HTML.
  fetch("./beverages.json")
    .then((rawData) => rawData.json())
    .then((beverageData) => {
      if (beverageData.length) {
        const beverageElement = document.querySelector("#db_content");
        beverageData.forEach((beverage) => {
          const beverageContainer = document.createElement("div");
          beverageContainer.innerHTML = `
        <div class="ButtonItem">
          <div class="ButtonHeadline">
            <h2>${beverage.name}</h2>
          </div>
          <div class="ButtonBodyText">
            <p>${beverage.countryoforiginlandname}</p>
            <p>${beverage.category}</p>
            <p>${beverage.packaging}</p>
            <p>Alc ${beverage.alcoholstrength}</p>
          </div>
          <div class="ButtonHeadline">
            <h2>${beverage.priceinclvat} SEK</h2>
          </div>
          <div class="card_button ${beverage.nr === "1001" ? "checked" : ""}">
            <button class="add_icon"><img src="assets/add_white_24dp.svg" class="card_button-Icon" alt="Add"></button>
            <button class="check_icon"><img src="assets/check_white_24dp.svg" class="card_button-icon" alt="Check"></button>
          </div>
        </div>
        `;
          beverageElement.appendChild(beverageContainer);
        });
      }
    });
});
