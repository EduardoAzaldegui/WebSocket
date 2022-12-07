    
window.onload = function() {
    
    var chat = {};

    chat.socket = new WebSocket('ws://localhost:8080'+'/WebSocketVideo1/websocket/chat');
    var pantallaChat;
    pantallaChat = document.getElementById('panel-chat');

    pantallaChat.escribir = function (textoMensaje,type) {
        let ChatMessage = document.getElementById(type);
        let cloneChatMessage = ChatMessage.cloneNode(true);
        let message = cloneChatMessage.querySelector('#texto');
        message.innerHTML = textoMensaje;

        pantallaChat.appendChild(cloneChatMessage);

        while (pantallaChat.childNodes.length > 25) {
            pantallaChat.removeChild(pantallaChat.firstChild);
        }

        pantallaChat.scrollTop = pantallaChat.scrollHeight;
    };


    chat.reportar = function (texto) {
        pantallaChat.escribir(texto,'self-user');
    };


    chat.configurarCajaMensaje = function () {
        document.getElementById('messageInput').onkeydown = function (event) {
            console.log("si pasa por verificar");
            if (event.keyCode === 13) {
                enviarMensaje();
            }
        };
    };


    function enviarMensaje () {
        var textoMensaje = document.getElementById('messageInput').value;
        if (textoMensaje !== '') {
            console.log(textoMensaje);
            chat.socket.send(textoMensaje);
            document.getElementById('messageInput').value = '';
        }
    };

    chat.terminarChat = function () {
        document.getElementById('messageInput').onkeydown = null;
        chat.reportar('info: Se ha cerrado la conexion Websocket','other-user');
    };


//recibe mensaje del servidor enviado hacia el cliente
    chat.atenderMensajeServer = function (mensajeServer) {
        pantallaChat.escribir(mensajeServer.data,'other-user');
    };


//Obtengo lo que escribe en el INPUTEXT y lo envia
//Envia mensaje al servidor , y el servidor envia a los usuarios








//  API DE JAVASCRIPT IMPLEMENTS

    chat.socket.onopen = function () {
        chat.reportar('Info: Se abrio una conexion Websocket','other-user');
        chat.configurarCajaMensaje();
    };

    chat.socket.onclose = function () {
        chat.terminarChat();
    };

    chat.socket.onmessage = function (mensaje) {
        chat.atenderMensajeServer(mensaje);
    };



};