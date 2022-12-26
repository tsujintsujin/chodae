const listItems = document.querySelectorAll('nav .nav-item');

listItems.forEach(listItem => {
    listItem.addEventListener('click', () => {
        listItems.forEach(listItem => {
            listItem.classList.remove('active');
        });
        listItem.classList.add('active');
    });
});
