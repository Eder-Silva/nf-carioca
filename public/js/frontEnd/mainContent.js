const resetHtml = () => {
    document.querySelector('#content').innerHTML = ''
}


const contentClickEvents = (event) => {
  event.preventDefault();
  if (event.target.id === 'resetContent') {
    resetHtml();
    return;
  }
};

let content = document.querySelector('#content');
content.addEventListener('click', (event) => contentClickEvents(event));

module.exports = {resetHtml}