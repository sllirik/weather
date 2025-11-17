// Поиск
const toggleSearch = (search, button) => {
    const search_container = document.getElementById(search);
    const search_button = document.getElementById(button);
    search_button.addEventListener('click', ()=> {
        search_container.classList.toggle('show-search');
    })
}


toggleSearch('search-container', 'search-button');