function openDeletePopup(id, description) {
    document.getElementById('deleteTitle').innerHTML = 'Delete ' + description; 
    let deleteButton = document.getElementById('deleteButton');

    let attribute = document.createAttribute('onclick');
    attribute.value = `sendDeleteAPIRequest('${id}')`;
    
    deleteButton.setAttributeNode(attribute);

    $('#deletionModal').modal();
}

function sendDeleteAPIRequest(id) {
    axios.delete(`/investment/${id}`)
        .then(response => {
            console.log(response);
        })
        .finally(() => {
            location.reload();
        })
}

function openEditPopup(id, description, amount) {
    document.getElementById('updateTitle').innerHTML = 'Delete ' + description; 
    document.getElementById('update-amount').value = amount;
    document.getElementById('update-description').value = description;
    let deleteButton = document.getElementById('updateButton');

    let attribute = document.createAttribute('onclick');
    attribute.value = `sendUpdateAPIRequest('${id}', '${description}', '${amount}')`;
    
    deleteButton.setAttributeNode(attribute);

    $('#updateModal').modal();
}

function sendUpdateAPIRequest(id) {
    console.log(`investment/${id}`)
    axios.put(`/investment/${id}`, {
        'description': document.getElementById('update-description').value,
        'amount': document.getElementById('update-amount').value
    }).then(response => {
        
    })
    .finally(() => {
        location.reload()
    });
} 