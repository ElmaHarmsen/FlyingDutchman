//global variable that is the item subjet to drag and drop
let draggedItem = null;

//global variable that is an array in which the orderItems that are undone are stored
let undoOrderItems = [];

//global variable that is an array in which the orderItems that are redone are stored
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
  fetch("./beverages.json")
    .then((rawData) => rawData.json())
    .then((beverageData) => {
      if (beverageData.length) {
        const beverageElement = document.querySelector("#db_content");
        beverageData.forEach((beverage) => {
          const beverageContainer = document.createElement("div");
          //we assign a dynamic id (beverage 'nr' from the json file) to the HTML element called beverageContainer
          //the ` ` mean it's a dynamic string, so we say #beverageItem_nr where nr gets fetched from the json file
          beverageContainer.id = `beverageItem_${beverage.nr}`;
          beverageContainer.draggable = true; //we specify this div is draggable
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
          //using appendChild we make beverageContainer the child element of beverageElement (parent), and
          //with that we give it a place in the HTML
          beverageElement.appendChild(beverageContainer);

          //this is where the DRAG-AND-DROP begins
          //we listen for the event 'dragstart', which is when the dragging starts, on the beverageContainer element
          //we give it a parameter, which we call event
          beverageContainer.addEventListener("dragstart", (event) => {
            draggedItem = event.target; //we assign the global variable draagedItem to the targeted item
          });
        });
      }
    });

  //this is where the DRAG-AND-DROP continues
  //we get by id the element in which we want the items to be dropped (dropTarget)
  const target = document.getElementById("dropTarget");
  //we listen for the event 'dragover', which is when the element is dragged over the dropTarget
  target.addEventListener("dragover", (event) => {
    event.preventDefault(); //we prevent any default actions that may occur
  });

  //we make a function createOrderItem that takes with it a parameter that is ONLY the id of the itemHTML
  //we create a new html element that we call orderItemDropped
  //we take the global variable that is the array of undoOrderItems, and push into it our orderitem id,
  //which is information we get through the parameter that gets used when we call function createOrderItem
  //we then assign the #id that we got from the parameter to the HTML div that is orderItemDropped
  function createOrderItem(itemHTMLId) {
    const orderItemDropped = document.createElement("div");
    undoOrderItems.push(itemHTMLId);
    orderItemDropped.id = itemHTMLId;
    //we make the HTML for the orderItemDropped item
    //inside the HTML we look in the global variable that is draggedItem, which is HTML, where we look into its classes,
    //and get the textContent from those elements
    //we basically create a new HTML element where we still use the dynamic content from the original beverage item,
    //but we only ask for what we want to display in the order item
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

  //this is where the DRAG-AND-DROP ends
  //in this block we move the dragged element to the selected drop target
  //we listen for the event 'drop', which is when the element that is dragged is dropped into the dropTarget
  target.addEventListener("drop", (event) => {
    event.preventDefault();
    //we have to check if the element gets dropped in the correct place, by checking the HTML element's #id
    if (event.target.id === "dropTarget") {
      //here we create a const orderItemHTML, where we assign AND CALL the function createOrderItem (from before)
      //remember, the parameter from this function is the id of the orderitem HTML
      //the parameter becomes #orderItem_dynamicId (which is also beverage 'nr' in the json)
      const orderItemHTML = createOrderItem(
        //however, when we get the id from the global variable draggedIten, we only extract the actual number (nr),
        //which is index 1 in the array because array starts from 0
        //together it creates #orderItem_nr (just like #beverageItem_nr from the original beverage item)
        "orderItem_" + draggedItem.id.split("_")[1]
      );
      //we append the child orderItemHTML to the parent which is event.target
      //with that we give it a place again in the HTML
      event.target.appendChild(orderItemHTML);
    }
  });

  //this is the UNDO-ACTION
  //we get the button by its #id that will trigger the undo-action
  //we listen for the event 'click', which is when the button gets clicked
  const undoBtn = document.getElementById("undo_button");
  undoBtn.addEventListener("click", () => {
    //create const lastAddedItemId, and remove the last added id from array of possible undo-able things
    const lastAddedItemId = undoOrderItems.pop();
    if (!lastAddedItemId) return; //if there is no id we just return to prevent errors
    //push into global array of redoOrderItems the id that we just removed from the other array (undoOrderItems)
    redoOrderItems.push(lastAddedItemId);
    const lastAddedItemHTML = document.querySelector(`#${lastAddedItemId}`); //get reference to where the HMTL element is that is to be removed
    if (!lastAddedItemHTML) return; //if there is no HTML element we just return to prevent errors
    //child is lastAddedItemHTML, we ask its parent to remove the child lastAddedItemHTML from the HTML
    lastAddedItemHTML.parentNode.removeChild(lastAddedItemHTML); //remove the actual html
    //UP NEXT: make sure beverage cannot get dragged into orderlist twice, instead update amount
  });

  //this is the REDO-ACTION
  //we get the button by its #id that will trigger the redo-action
  //we listen for the event 'click', which is when the button gets clicked
  const redoBtn = document.getElementById("redo_button");
  redoBtn.addEventListener("click", () => {
    //create const lastRemovedItemId, and remove the last added id from array of possible redo-able things
    const lastRemovedItemId = redoOrderItems.pop();
    if (!lastRemovedItemId) return; //if there is no id we just return to prevent errors
    //push into global array of undoOrderItems the id that we just removed from the other array (redoOrderItems)
    undoOrderItems.push(lastRemovedItemId);
    //reference to the container (dropTarget) where we can add the HTML again
    const storeOrderItems = document.getElementById("dropTarget");
    //parent is storeOrderItems, we ask it to append (add) the child lastRemovedItemId again to the HTML,
    //and we call the function that generates the element with the id that we got
    storeOrderItems.appendChild(createOrderItem(lastRemovedItemId));
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
