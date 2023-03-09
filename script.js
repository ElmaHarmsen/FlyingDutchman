let draggedItem = null;
let undoOrderItems = [];
let redoOrderItems = [];

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
          beverageContainer.id = `beverageItem_${beverage.nr}`;
          beverageContainer.draggable = true;
          beverageContainer.innerHTML = `
          <div class="ButtonItem">
            <div class="ButtonHeadline">
              <h2 class="ItemName">${beverage.name}</h2>
            </div>
            <div class="ButtonBodyText">
              <p>${beverage.countryoforiginlandname}</p>
              <p class="ItemCategory">${beverage.category}</p>
              <p>${beverage.packaging}</p>
              <p>Alc ${beverage.alcoholstrength}</p>
            </div>
            <div class="ButtonHeadline">
              <h2 class="ItemPrice">${beverage.priceinclvat} SEK</h2>
            </div>
            <div class="card_button">
              <button class="add_icon"><img src="assets/add_white_24dp.svg" class="card_button-Icon" alt="Add"></button>
              <button class="check_icon"><img src="assets/check_white_24dp.svg" class="card_button-icon" alt="Check"></button>
            </div>
          </div>
          `;
          beverageElement.appendChild(beverageContainer);

          beverageContainer.addEventListener("dragstart", (event) => {
            draggedItem = event.target;
          });
        });
      }
    });
  const target = document.getElementById("dropTarget");
  target.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  function createOrderItem(itemHTMLId) {
    const orderItemDropped = document.createElement("div");
    undoOrderItems.push(itemHTMLId);
    orderItemDropped.id = itemHTMLId;
    orderItemDropped.innerHTML = `
    <div class="order_item">
      <div class="order_item_texts">
        <div class="order_item_headline">
          <h2>${draggedItem.querySelector(".ItemName").textContent}</h2>
        </div>
        <div class="order_item_bodytext">
          <p>${draggedItem.querySelector(".ItemCategory").textContent}</p>
        </div>
        <div class="order_item_headline">
          <h2>${draggedItem.querySelector(".ItemPrice").textContent}</h2>
        </div>
      </div>
      <div class="order_item_controls">
        <button class="controls_remove">
          <img src="assets/cancel_black_24dp.svg" alt="Remove" />
        </button>
        <div class="order_item_headline">
          <h2>${draggedItem.querySelector(".ItemPrice").textContent}</h2>
        </div>
        <div class="controls_adjust-amount">
          <button id="decrease_item_qty">
            <img
              src="assets/minus_FILL0_wght400_GRAD0_opsz48.svg"
              alt="Subtract"
            />
          </button>
          <span id="item_qty">1</span>
          <button id="increase_item_qty">
            <img
              src="assets/plus_FILL0_wght400_GRAD0_opsz48.svg"
              alt="Add"
            />
          </button>
        </div>
      </div>
    </div>
    `;
    return orderItemDropped;
  }

  target.addEventListener("drop", (event) => {
    event.preventDefault();
    // move dragged element to the selected drop target
    if (event.target.id === "dropTarget") {
      const orderItemHTML = createOrderItem(
        "orderItem_" + draggedItem.id.split("_")[1]
      );
      //item deletes itself from html
      // draggedItem.parentNode.removeChild(draggedItem);
      //item adds iteself to dropTarget as a child
      //instead of draggedItem, create another green html item
      event.target.appendChild(orderItemHTML);
    }
  });

  const undoBtn = document.getElementById("undo_button");
  undoBtn.addEventListener("click", () => {
    const lastAddedItemId = undoOrderItems.pop(); //remove id from array of possible undo-able things
    if (!lastAddedItemId) return;
    redoOrderItems.push(lastAddedItemId);
    const lastAddedItemHTML = document.querySelector(`#${lastAddedItemId}`); //get reference to where the HMTL element is that is to be removed
    if (!lastAddedItemHTML) return;
    lastAddedItemHTML.parentNode.removeChild(lastAddedItemHTML); //remove the actual html
    //up next: make sure beverage cannot get dragged into orderlist twice, instead update amount
  });
  const redoBtn = document.getElementById("redo_button");
  redoBtn.addEventListener("click", () => {
    const lastRemovedItemId = redoOrderItems.pop(); //remove id from array of possible redo-able things
    if (!lastRemovedItemId) return;
    undoOrderItems.push(lastRemovedItemId); //add item to possible undo-able things
    const storeOrderItems = document.getElementById("dropTarget"); //reference to the container (dropzone) where we can add the HTML again
    storeOrderItems.appendChild(createOrderItem(lastRemovedItemId)); //where we call the function that generates the element with the id that we got
  });
});

//Button to change header, might get expanded
//DOMContentLoaded had to be implemented
//This block of code takes in all nav_buttons classes and all text-header classes
//Then it loops through all the navigation bar buttons when a button is pressed
//where it takes the data-text from the button and loops it over the
//different text-header elements (which are the divs representing the header).
//If the text-header ID is the same as the button data-text the div is shown,
//otherwise it is hidden. Also it changes the background colour by replacing the
//"-header" tag with the "_symbol" tag to check for all the ID's of the nav_Symbols.
document.addEventListener("DOMContentLoaded", () => {
  const navBtns = document.querySelectorAll(".nav_button");
  const HeaderID = document.querySelectorAll(".text-header");

  let prevNavSymbol = null; //keep track of the previously selected symbol element

  navBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const BtnData = document.getElementById(btn.dataset.text);

      HeaderID.forEach((text) => {
        if (text === BtnData) {
          text.style.display = "block";
        } else {
          text.style.display = "none";
        }
      });

      //Select the symbol div based on the button clicked
      const symbolId = btn.dataset.text.replace("-header", "_symbol");
      const NavSymbol = document.getElementById(symbolId);

      if (prevNavSymbol) {
        //Reset the background color of the previously selected symbol div
        prevNavSymbol.style.backgroundColor = "";
      }

      if (NavSymbol) {
        //Set the background color of the currently selected symbol div
        NavSymbol.style.backgroundColor = "white";
      }

      prevNavSymbol = NavSymbol; //update the previously selected symbol element
    });
  });
});

// These are the functions that recieves the users input from the log in page
//In the function validateForm() the strings from the login input are put in two vaiables, one for mail and one for password.
function validateForm() {
  var mail = document.getElementById("mail").value;
  var password = document.getElementById("password").value;

  //This if statement create a pop up if the fields are empty, since the user has to fill in something in the fields.
  if (mail == "" || password == "") {
    alert("Please fill in all fields.");
    return false;
  }
  return true;
}

//This is the function that decides if the user can be logged in or not. This function is runned if the validateForm
//function is true.
function login() {
  if (validateForm()) {
    var mail1 = document.getElementById("mail").value;
    var password1 = document.getElementById("password").value;

    //Our test log in is mail: "hej" and password: "hej"
    if (mail1 == "hej" && password1 == "hej") {
      alert("Login successful!");
      window.location.href = "index.html";
    } else if (mail1 == "hej" && password1 == "hej") {
      alert("Login successful!");
      window.location.href = "index.html";
    } else {
      alert("Invalid username or password.");
    }
  }
}
