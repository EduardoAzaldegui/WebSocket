window.onload = function () {

    var chat = {};
    chat.socket = new WebSocket('wss://'+'d924-200-1-182-131.sa.ngrok.io'+'/WebSocketVideo1/websocket/chat');
    var pantallaChat;

    pantallaChat = document.getElementById('pantallaChat');
    pantallaChat.escribir = function (textoMensaje) {
        var p = document.createElement('p');
        p.style.wordWrap = 'break-word';
        p.innerHTML = textoMensaje;
        pantallaChat.appendChild(p);
        while (pantallaChat.childNodes.length > 25) {
            pantallaChat.removeChild(pantallaChat.firstChild);
        }
        pantallaChat.scrollTop = pantallaChat.scrollHeight;
    };


    chat.reportar = function (texto) {
        pantallaChat.escribir(texto);
    };

    chat.configurarCajaMensaje = function () {
        document.getElementById('cajaMensaje').onkeydown = function (event) {
            if (event.keyCode === 13) {
                chat.enviarMensaje();
            }
        };
    };

    chat.terminarChat = function () {
        document.getElementById('cajaMensaje').onkeydown = null;
        chat.reportar('info: Se ha cerrado la conexion Websocket');
    };

//recibe mensaje del servidor enviado hacia el cliente
    chat.atenderMensajeServer = function (mensajeServer) {
        pantallaChat.escribir(mensajeServer.data);
    };


//Obtengo lo que escribe en el INPUTEXT y lo envia
//Envia mensaje al servidor , y el servidor envia a los usuarios
    chat.enviarMensaje = function () {
        var textoMensaje = document.getElementById('cajaMensaje').value;
        if (textoMensaje !== '') {
            chat.socket.send(textoMensaje);
            document.getElementById('cajaMensaje').value = '';
        }
    };







//  API DE JAVASCRIPT IMPLEMENTS

    chat.socket.onopen = function () {
        chat.reportar('Info: Se abrio una conexion Websocket');
        chat.configurarCajaMensaje();
    };

    chat.socket.onclose = function () {
        chat.terminarChat();
    };

    chat.socket.onmessage = function (mensaje) {
        chat.atenderMensajeServer(mensaje);
    };



};

