//global variable that is the item subjet to drag and drop
let draggedItem = null;

//global variable that is an array in which the orderItems that are undone are stored
let undoOrderItems = [];

//global variable that is an array in which the orderItems that are redone are stored
let redoOrderItems = [];

//variable to loop over to display correct items for nav_bar-click
let allItems;

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
          //if-statement to give the correct category to the beverage-items. All items get the class=beverage-category
          //to be able to get looped over for the nav_bar-click.
          if (beverage.category.includes("Öl")) {
            beverageContainer.classList.add(
              "beer-category",
              "beverage-category"
            );
          } else if (beverage.category.includes("Vin")) {
            beverageContainer.classList.add(
              "wine-category",
              "beverage-category"
            );
          } else if (beverage.category.includes("sprit")) {
            beverageContainer.classList.add(
              "drink-category",
              "beverage-category"
            );
          } else {
            beverageContainer.classList.add(
              "deal-category",
              "beverage-category"
            );
          }
          //Checks the items if they are special item
          if (beverage.vegan.includes("0")) {
            beverageContainer.classList.add(
              "nonvegan-category"
            );
          }
          if (beverage.lactose.includes("1")) {
            beverageContainer.classList.add(
              "lactose-category"
            );
          }
          if (beverage.gluten.includes("1")) {
            beverageContainer.classList.add(
              "gluten-category"
            );
          }
          if (beverage.deal.includes("1")) {
            beverageContainer.classList.add(
              "deal-category"
            );
          }
          
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
            <div class="manager_card_button">
              <button class="button_stock"><h2>Stock: 20</h2></button>
              <button class="button_refill"><h2>Restock</h2></button>
              <button class="button_disable"><img src="assets/visibility_off_black_24dp.svg" alt="visibility-off"></button>
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
        // Assign the beverage-items to the variable
        allItems = document.querySelectorAll(".beverage-category");
        
        //Makes the page click the deal_button on load-up
        const dealBtn = document.getElementById("offer_button");
        dealBtn.dispatchEvent(new Event('click'));
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
  let prevNavSymbol = document.getElementById(null); //keep track of the previously selected symbol element
  const navBtns = document.querySelectorAll(".nav_button");
  const HeaderID = document.querySelectorAll(".text-header");
  const Checkbox = document.querySelectorAll('.filter-check');

  navBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const BtnData = document.getElementById(btn.dataset.text);

      HeaderID.forEach((text) => {
        if (text === BtnData) {
          text.style.display = "flex";
        } else {
          text.style.display = "none";
        }
      });

      //Shows appropriate items
      const itemCard = btn.dataset.text.replace("-header", "-category");

      allItems.forEach((item) => {
        console.log(item);
        if (item.classList.contains(itemCard)) {
          item.style.display = "flex";
        } else {
          item.style.display = "none";
        }
      });

      //Highlights the appropriate button
      const symbolId = btn.dataset.text.replace("-header", "_symbol");
      const NavSymbol = document.getElementById(symbolId);

      if (prevNavSymbol) {
        //Reset the background color of the previously selected symbol div
        prevNavSymbol.style.backgroundColor = "transparent";
      }

      if (NavSymbol) {
        //Set the background color of the currently selected symbol div
        NavSymbol.style.backgroundColor = "var(--white)";
      }

      prevNavSymbol = NavSymbol; //update the previously selected symbol element
      Checkbox.forEach((box) => { //Makes sure the filter checkbox get unchecked when switching tab
        box.checked = false;
      });
    });
  });
});

// These are the functions that recieves the users input from the log in page
//In the function validateForm() the strings from the login input are put in two vaiables, one for mail and one for password.
function validateForm() {
  var mail1 = document.getElementById("mail").value;
  var password1 = document.getElementById("password").value;
  var mail2 = document.getElementById("mail-manager").value;
  var password2 = document.getElementById("password-manager").value;

  //This if statement create a pop up if the fields are empty, since the user has to fill in something in the fields.
  if ((mail1 == "" || password1 == "") && (mail2 == "" || password2 == "")) {
    alert("Please fill in all fields.");
    return false;
  }
  return true;
}

//This is the function that decides if the user can be logged in or not. This function is runned if the validateForm
//function is true.
let manager = 0; //global variable to check if you are manager or not
document.addEventListener("DOMContentLoaded", () => {
  const fetchDrink = document.getElementById("fetch_symbol");
  const loginPage = document.getElementById("login-header");
  const loginBtn = document.getElementById("login_symbol");
  const accBtn = document.getElementById("account_symbol");
  const accPage = document.getElementById("account-header");

  function login() {
    if (validateForm()) {
      var mail1 = document.getElementById("mail").value;
      var password1 = document.getElementById("password").value;
      var mail2 = document.getElementById("mail-manager").value;
      var password2 = document.getElementById("password-manager").value;
      

      //Our test log in for VIP is mail: "vip" and password: "vip"
      if (mail1 == "vip" && password1 == "vip") {
        // alert("Login successful!");

        window.location.replace = "index.html";
        fetchDrink.style.visibility = "visible";
        loginPage.style.display = "none";
        loginBtn.style.visibility = "hidden";
        accBtn.style.visibility = "visible";
        accPage.style.display = "flex";
      }
      //Our test log in for Bartender is mail: "boss" and password: "boss"
      else if(mail1 == "boss" && password1 == "boss" || mail2 == "boss" && password2 == "boss"){
        document.getElementById('manager-login').style.display = 'none';
        loginPage.style.display = "none";
        document.getElementById('nav_button_blocker').style.display = 'flex';
        checkWindowSize()
        manager = 1;
      }else {
        alert("Invalid username or password.");
      }
    }
  }
  document.getElementById("login-button").addEventListener("click", login);
  document.getElementById("login_button_manager").addEventListener("click", login);
});

// Generate a combination of four randomized numbers.

function generateCombination() {
  let num1 = Math.floor(Math.random() * 10); // generate a random integer between 0 and 9.
  let num2 = Math.floor(Math.random() * 10);
  let num3 = Math.floor(Math.random() * 10);
  let num4 = Math.floor(Math.random() * 10);

  // Combine the numbers into a string.
  let combination = `${num1}${num2}${num3}${num4}`;

  document.getElementById("output").innerHTML = combination;
}

//Filter button code
document.addEventListener("DOMContentLoaded", () => {
  const filterBtn = document.getElementById("filter-button");
  const listItems = document.getElementById("list-container");

  filterBtn.addEventListener("click", () => {
    if (listItems.style.visibility === "hidden") {
      listItems.style.visibility = "visible";
      filterBtn.style.backgroundColor = "var(--offwhite)";

      // add event listener to the document to listen for clicks outside the list container.
      document.addEventListener("click", handleOutsideClick);
    } else {
      listItems.style.visibility = "hidden";
      filterBtn.style.backgroundColor = "";

      // remove event listener from the document when the list container is hidden.
      document.removeEventListener("click", handleOutsideClick);
    }
  });

  function handleOutsideClick(event) {
    // check if the clicked element is outside the list container and the filter button.
    if (
      !listItems.contains(event.target) &&
      !filterBtn.contains(event.target)
    ) {
      listItems.style.visibility = "hidden";
      filterBtn.style.backgroundColor = "";

      // remove event listener from the document when the list container is hidden.
      document.removeEventListener("click", handleOutsideClick);
    }
  }
});

// Add balance
function submitBalance(){
  var inputNr = parseInt(document.getElementById("input_number").value);

  //Works only when the input is a number.
  if (isNaN(inputNr)) {
    return;
  }

  //Saves the total balance in the variable "balance"
  var balance = parseInt(localStorage.getItem("balance") || 0) + inputNr;

  //Writing out the sum in the HTML
  document.getElementById("totalSum").innerHTML = balance + " SEK";

  //The balance is saved in the local storage
  localStorage.setItem("balance", balance);
}

// The function that makes the stored sum stay when the page loads.
window.onload = function balance() {
  var sum = localStorage.getItem("balance");

  //
    document.getElementById("totalSum").innerHTML = parseInt(sum) + " SEK";

}

//Hides all VIP elements, as well as gets the user to the Deal's menu.
function logout(){
  const fetchDrink = document.getElementById("fetch_symbol");
  const loginBtn = document.getElementById("login_symbol");
  const accBtn = document.getElementById("account_symbol");
  const accPage = document.getElementById("account-header");
  const dealBtn = document.getElementById("offer_button");

      window.location.replace = "index.html";
      fetchDrink.style.visibility = "hidden";
      loginBtn.style.visibility = "visible";
      accBtn.style.visibility = "hidden";
      accPage.style.display = "none";

      dealBtn.dispatchEvent(new Event('click'));
  }

  function dispVegan(){
    var checkbox = document.querySelector('input[name="vegan"]');
    const nonVegan = document.querySelectorAll(".nonvegan-category")
    
    if (checkbox.checked) {
      nonVegan.forEach((item) => {
        item.style.display = "none";
      });
    } else {
      nonVegan.forEach((item) => {
        item.style.display = "flex";
      });
  }
  }
  function dispGlutenFree(){
    var checkbox = document.querySelector('input[name="gluten"]');
    const gluten = document.querySelectorAll(".gluten-category")
    
    if (checkbox.checked) {
      gluten.forEach((item) => {
        item.style.display = "none";
      });
    } else {
      gluten.forEach((item) => {
        item.style.display = "flex";
      });
    }
  }
  function dispLactoseFree(){
    var checkbox = document.querySelector('input[name="lactose"]');
    const lactose = document.querySelectorAll(".lactose-category")
    
    if (checkbox.checked) {
      lactose.forEach((item) => {
        item.style.display = "none";
      });
    } else {
      lactose.forEach((item) => {
        item.style.display = "flex";
      });
    }
  }

  // function to check window size.
function checkWindowSize() {
  //get the current width and height of the window
  const windowWidth = window.innerWidth;
  
  //check if the window size should trigger manager mode. If it does a login screen aprears so not everyone has access to the manager mode just by changing screen size.
  if (windowWidth >= 1200 && manager === 0) {
    //show the login screen and hides buttons that shouldn't be viewable in this screen size.
    document.getElementById('manager-login').style.display = 'flex';
    document.getElementById('nav_button_blocker').style.display = 'flex';
    document.getElementById('nav_button_blocker').style.width = '100px';
    document.getElementById('logout_symbol').style.display = 'none';

  } else if(windowWidth >= 1200 && manager === 1){
    //Shows the logout button if you are logged in as manager
    document.getElementById('nav_button_blocker').style.width = '100px';
    document.getElementById('logout_symbol').style.display = 'flex';
  }else{
    //hide the login screen and shows the logout button for manager, otherwise shows standard buttons.
    document.getElementById('manager-login').style.display = 'none';
    document.getElementById('nav_button_blocker').style.width = '80px';
    document.getElementById('logout_symbol').style.display = 'flex';
    if(manager === 0){
      document.getElementById('nav_button_blocker').style.display = 'none';
    }
  }
}

// add a resize event listener to the window
window.addEventListener('resize', checkWindowSize);

// call the function on page load to check the initial window size
document.addEventListener("DOMContentLoaded", function() {
  checkWindowSize();
});

//Logout function for manager screen.
function manager_logout(){
  if (window.confirm("Are you sure you want to logout as Manager/Bartender?")) {
    manager = 0;
    checkWindowSize();
  }
}