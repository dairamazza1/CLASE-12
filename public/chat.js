// const socket = io.connect();

function renderChat(data) {
    let fecha=  new Date();

    let dia = fecha.getDate();
    let anio = fecha.getFullYear();
    let mes = (fecha.getMonth() + 1);

    let hora = fecha.getHours() + ":";
    let minutos = fecha.getMinutes() + ":";
    let segundos = fecha.getSeconds() ;
console.log(data);
    const msg = data.map((elem, index) => {
      return `<div>
                    <strong class="blue_chat">${elem.user}</strong> [<strong class="brown_chat">${dia}/${mes}/${anio } ${hora}${minutos}${segundos}</strong>]:
                    <em class="green_chat">${elem.message}</em>
              </div>`;
    }).join(" ");
    document.getElementById("text_set").innerHTML = msg;
    console.log(msg);
}

function addChat(e) {
    const obj = {
        user: document.getElementById('email').value ,
        message: document.getElementById('text').value,
    }
    console.log("_________");
    console.log(obj);
    socket.emit('new-text', obj);
    
    document.getElementById('email').value = '';
    document.getElementById('text').value = '';
    return false;
}

socket.on('text', data => {
    renderChat(data);
})