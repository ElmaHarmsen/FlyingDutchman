//const dictionaryList is one object of multiple individual objects,
//each object is a key that represents the text to be displayed in the HTML, and each object contains three languages.
//HTML text elements need to always have the exact same id as the key is called (nav_title, etc.)
//HTML buttons need to always have the exact same id as listed here (en, sv and nl).
const dictionaryList = {
  page_title: {
    en: "The Flying Dutchman",
    sv: "Den Flygande Holländaren",
    nl: "De Vliegende Hollander",
  },
  page_header: {
    en: "Today's deals",
    sv: "Dagens erbjudanden",
    nl: "Aanbiedingen van vandaag",
  },
  order_header: {
    en: "Orders",
    sv: "Beställning",
    nl: "Bestelling",
  },
  nav_header_search: {
    en: "Search",
    sv: "Sök",
    nl: "Zoeken",
  },
  nav_header_deals: {
    en: "Deals",
    sv: "Deals",
    nl: "Deals",
  },
  nav_header_beers: {
    en: "Beers",
    sv: "Öler",
    nl: "Bieren",
  },
  nav_header_wines: {
    en: "Wines",
    sv: "Viner",
    nl: "Wijnen",
  },
  nav_header_drinks: {
    en: "Drinks",
    sv: "Drinkar",
    nl: "Drankjes",
  },
  nav_header_login: {
    en: "Log in",
    sv: "Logga in",
    nl: "Inloggen",
  },
  order_pay: {
    en: "Pay",
    sv: "Betala",
    nl: "Betalen",
  },
  page_header_search: {
    en: "Search",
    sv: "Sök",
    nl: "Zoeken",
  },
  page_header_deals: {
    en: "Deals",
    sv: "Deals",
    nl: "Deals",
  },
  page_header_beers: {
    en: "Beers",
    sv: "Öler",
    nl: "Bieren",
  },
  page_header_wines: {
    en: "Wines",
    sv: "Viner",
    nl: "Wijnen",
  },
  page_header_drinks: {
    en: "Drinks",
    sv: "Drinkar",
    nl: "Drankjes",
  },
  page_header_login: {
    en: "Log in",
    sv: "Logga in",
    nl: "Inloggen",
  },
  loginpage_header: {
    en: "Log in",
    sv: "Logga in",
    nl: "Inloggen",
  },
  login_password: {
    en: "Password",
    sv: "Lösenord",
    nl: "Wachtwoord",
  },
  nav_header_fetch: {
    en: "Fetch drink",
    sv: "Hämta dryck",
    nl: "Drank halen",
  },
  fetch_header: {
    en: "Your code to the fridge is",
    sv: "Din kod till kylen är",
    nl: "Jouw toegangscode tot de koelkast is",
  },
  fetch_prompt: {
    en: "This code can only be used once.",
    sv: "Detta är en engångskod.",
    nl: "De code kan één keer gebruikt worden.",
  },
  nav_header_account: {
    en: "Account",
    sv: "Konto",
    nl: "Account",
  },
  text_gluten: {
    en: "Gluten free",
    sv: "Glutenfritt",
    nl: "Glutenvrij",
  },
  text_vegan: {
    en: "Vegan",
    sv: "Veganskt",
    nl: "Veganistisch",
  },
  text_alcfree: {
    en: "Non-alcoholic",
    sv: "Alkoholfri",
    nl: "Alcoholvrij",
  },
  //manager screen content
  manager_page_header: {
    en: "Manage stock",
    sv: "Förvalta lager",
    nl: "Beheer voorraad",
  },
  manager_order_header: {
    en: "Orders per table",
    sv: "Beställningar per bord",
    nl: "Bestelling per tafel",
  },
  manager_nav_header_stock: {
    en: "Stock",
    sv: "Lager",
    nl: "Voorraad",
  },
  manager_page_header_stock: {
    en: "Stock",
    sv: "Stock",
    nl: "Stock",
  },
  manager_page_header_beers: {
    en: "Stock: Beers",
    sv: "Stock: Öler",
    nl: "Stock: Bieren",
  },
  manager_page_header_wines: {
    en: "Stock: Wines",
    sv: "Stock: Viner",
    nl: "Stock: Wijnen",
  },
  manager_page_header_drinks: {
    en: "Stock: Drinks",
    sv: "Stock: Drinkar",
    nl: "Stock: Drankjes",
  },
  manager_button_refill: {
    en: "Refill",
    sv: "Påfyllning",
    nl: "Bijvullen",
  },
  manager_button_stock: {
    en: "Stock:",
    sv: "Stock:",
    nl: "Voorraad:",
  },
  manager_orders_table_1: {
    en: "Table 1",
    sv: "Bord 1",
    nl: "Tafel 1",
  },
  manager_orders_order: {
    en: "Order:",
    sv: "Beställning:",
    nl: "Bestelling:",
  },
  manager_orders_received: {
    en: "Received:",
    sv: "Mottagen:",
    nl: "Ontvangen:",
  },
  manager_orders_payment: {
    en: "Payment:",
    sv: "Betalning:",
    nl: "Betaling:",
  },
  manager_orders_payment_type: {
    en: "Paid separately",
    sv: "Betalade separat",
    nl: "Apart betaald",
  },
  account_header:{
      en: "Your account",
      sv: "Ditt konto",
      nl: "Jouw rekening",
  },
  balance:{
    en: "Balance:",
    sv: "Saldo:",
    nl: "Saldo",
  },
  balance_instructions:{
    en: "To add balance to your account, type the amount below, press submit and scan the barcode to recieve the payment oprions.",
    sv: "För att fylla på pengar på ditt konto, skriv in beloppet nedan, tryck på ladda upp och scanna QR-koden för att få betalningsalternativen.",
    nl: "Voeg saldo toe aan uw account, schrijf het bedrag hieronder, druk op verzenden en vervolgens scan de streepjescode om de betalingsopties te ontvangen.",
  },
  add_balance:{
    en: "Add balance",
    sv: "Fyll på saldo",
    nl: "Saldo toevoegen",
  },
  submitbutton:{
    en: "Submit",
    sv: "Ladda upp",
    nl: "Bevestigen",
  },
  logout:{
    en: "Log out",
    sv: "Logga ut",
    nl: "Uitloggen",
  }
};
