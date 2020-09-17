function filterInvestments() {
    let nameValue = document.getElementById('name-search').value;
    let descriptionValue = document.getElementById('description-search').value;
    let amountValue = document.getElementById('amount-search').value;

    if (amountValue === '') {
        amountValue = 0;
    }

    trs = document.getElementsByTagName('tr');

    // Unhide all tr
    // first tr is header, thus gets skipped.
    for (let i = 1; i < trs.length; i++) {
        trs[i].style.display = 'table-row';
    }

    for (let i = 1; i < trs.length; i++) {
        let name = trs[i].childNodes[1].innerText;
        let description = trs[i].childNodes[3].innerText;
        let amount = parseFloat(trs[i].childNodes[5].innerText.substr(1));

        if (!(
            textMatch(nameValue, name) &&
            textMatch(descriptionValue, description) &&
            numberMatch(amountValue, amount)
        )) {
            trs[i].style.display = 'None';
        }
    }
}

function textMatch(searchValue, actualValue) {
    if (searchValue === '') {
        return true;
    }

    searchValue = searchValue.toLowerCase();
    actualValue = actualValue.toLowerCase();
    return actualValue.includes(searchValue);
}

function numberMatch(lowerBound, value) {
    return value >= lowerBound;
}
