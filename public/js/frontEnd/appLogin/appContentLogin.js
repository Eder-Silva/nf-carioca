const contentInteractionLogin = require('./loginFunctions')
const subMenu = require('./loginFunctions.js')

let contentInteraction = new contentInteractionLogin();

const handlerOfClickEvent = (event) => {
  event.preventDefault();
  let clickedClass = event.target.id;
  let notHasClass = !contentClickEvent[clickedClass];
  if (notHasClass) return;

  contentClickEvent[clickedClass](event);
  event.stopPropagation();
};

// Content changes
const handlerOfChangeEvent = (event) => {  
    event.preventDefault();
    let changeClass = event.target.id;
    let notHasClass = !contentChangeEvent[changeClass];
    if (notHasClass) return;
    contentChangeEvent[changeClass](event);
    event.stopPropagation();
  };

//prettier-ignore
const contentChangeEvent = {
    'companyEnvironment': () => contentInteraction.searchCompanyInBD(),
    'companyId': () => contentInteraction.searchCompanyInBD()
  };

//prettier-ignore
const contentClickEvent = {
    'signUp': (event) => contentInteraction.nfpSetHtml(event), 
    'logIn': (event) => contentInteraction.nfpSetHtml(event), 
    'btn-signUp': (event) => contentInteraction.InsertCompanyInBD(event),
    'btn-logIn': (event) => contentInteraction.InsertCompanyInLS(event),
};

let content = document.querySelector('#content');
content.addEventListener('click', handlerOfClickEvent);
content.addEventListener("change", handlerOfChangeEvent);
