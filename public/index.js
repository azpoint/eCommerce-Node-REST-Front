// const post = $("#postButton");
const socket = io();

// --------- JS ---------

$('body').on('click', '.cartRemoveButton', (e) => {
    let idToAdd = e.currentTarget.childNodes[1].innerHTML;

    fetch(`/cart/products/${idToAdd}`, {
        method: 'post',
        headers: { 'Content-Type' : 'application/json' },
        cache: 'no-cache'
    })

    Toastify({
        text: 'Product Added',
        duration: 3000,
        newWindow: false,
        close: false,
        gravity: "top",
        position: "center",
        stopOnFocus: true,
        style: {
        background: "rgb(141, 111, 167)",
        
        },
        onClick: function(){}
    }).showToast();
  }
)


$('#startChatButton').on('click', (e) => {
    e.preventDefault()

    const user = $('#emailInput').val();

    if (user == ''){
        $('#emailInput').after("<p style='color: red;'>This field can't be blank.");
        setTimeout(() => $("#emailInput ~ p").remove(), 3000);
    } else {
        $("#emailForm, #chatTitle").remove();
        $('#chatBox').append(`<p class="actualForm" id="chatTitle">Tell us more about your problem <span id="user">${user}</span></p>`)
        $('#chatBox').append('<div class="chatText actualForm" id="textZone"></div><div class="inputField"><input type="text" name="mensage" id="textInput"><button id="send"><svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16"><path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/></svg></button></div>');
    }

    socket.emit('recover-msg', true);
})

$("body").on('click', '#send', e => {

    let message = {
        text: $('#textInput').val(),
        user: $('#user').html()
    }

    if (message.text == '') {
        null
    } else {
        socket.emit('message', message);

    $('#textInput').val('')
    }
    
})

// -------- Websocket ---------

socket.on('indexSocket', data => {
    socket.emit('indexSocket', data);
})

socket.on('myMessage', incoming => {
    let message = incoming;
    
    $('#textZone').append(`<p class="adminMsg"><span>${message.date} by: ${message.user}</span><br>${message.text}</p>`);

})

socket.on('message', incoming => {
    let message = incoming;    

    if (message.user) {
        $('#textZone').append(`<p class="customerMsg"><span>${message.date} by: ${message.user}</span><br>${message.text}</p>`);
    } else {
        $('#textZone').append(`<p class="adminMsg"><span>${message.date} by: ${message.user}</span><br>${message.text}</p>`);
    }
})

socket.on('recover-msg', incoming => {
    let message = incoming;    

    if (message.user == 'Admin') {
        $('#textZone').append(`<p class="customerMsg"><span>${message.date} by: ${message.user}</span><br>${message.text}</p>`);
    } else {
        $('#textZone').append(`<p class="adminMsg"><span>${message.date} by: ${message.user}</span><br>${message.text}</p>`);
    }
})