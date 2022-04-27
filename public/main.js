const socket = io.connect();

function renderProd(data) {
    const html = data.map((elem, index) => {
        return(
            `<tr>
                <td>${elem.title}</td>
                <td>${elem.price}</td>
                <td>${elem.thumbnail}</td>
             </tr>`
        )
    }).join(" ");

    document.getElementById('products').innerHTML = html;
    
}

function addProduct(e) {
    const obj = {
        title: document.getElementById('name').value,
        price: document.getElementById('price').value,
        thumbnail: document.getElementById('thumbnail').value 
    }
    socket.emit('new-products', obj);
    
    document.getElementById('name').value = '';
    document.getElementById('price').value = '';
    document.getElementById('thumbnail').value = '';
    return false;
}

socket.on('products', data => {
    renderProd(data);
})