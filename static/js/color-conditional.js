jQuery(document).ready(function($) {
    let elems = document.getElementsByClassName('color-conditional');
    for(let i = 0; i < elems.length; i++) {
        let elem = elems[i];
        console.log(elem.innerHTML)
        let value = parseFloat(elem.innerHTML.substring(1));
        console.log(value);
        
        if (value > 0) {
            elem.classList.add('color-green');
        } else if (value < 0) {
            elem.classList.add('color-red');
        }
    }
});