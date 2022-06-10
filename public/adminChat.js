const socket = io();


socket.on('chatSocket', incoming => {
    console.log(incoming);
    socket.emit('chatSocket', 'Admin-chat');
})


$("body").on('click', '#send', e => {

    let message = {
        text: $('#textInput').val(),
        user: "Admin"
    }

    if (message.text == '') {
        null
    } else {
        socket.emit('message', message);

    $('#textInput').val('')
    }
    
})

socket.on('message', incoming => {
    let message = incoming;
        
    $('#textZone').append(`<p class="customerMsg"><span>${message.date} by: ${message.user}</span><br>${message.text}</p>`);    
})

socket.on('myMessage', incoming => {
    let message = incoming;

    if (message.user == 'Admin') {
        $('#textZone').append(`<p class="adminMsg"><span>${message.date} by: ${message.user}</span><br>${message.text}</p>`);
    } else {
        $('#textZone').append(`<p class="customerMsg"><span>${message.date} by: ${message.user}</span><br>${message.text}</p>`);
    }
})


