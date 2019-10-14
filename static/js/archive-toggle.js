function showArchived() {
    let elements = document.getElementsByClassName('archived');
    
    let showArchive = document.getElementById('archive-checkbox').checked;

    for (let i = 0; i < elements.length; i++) {
        if (showArchive) {
            elements[i].style.display = 'table-row';
        } else {
            elements[i].style.display = 'none';
        }
    }
}