package controller;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.concurrent.atomic.AtomicInteger;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;



@ServerEndpoint(value="/websocket/chat")
public class ConexionClienteChat {
    
    private static final String PREFIJO_PARTICIPANTE = "Invitado # ";
    
    private static final AtomicInteger idConexionI = new AtomicInteger(0);
    
    private static final Set<ConexionClienteChat> conexiones = new CopyOnWriteArraySet<>();
    
    private final String nickname;
    private Session sessionWebsocket;
    
    public ConexionClienteChat(){
        nickname = PREFIJO_PARTICIPANTE + idConexionI.getAndIncrement();
    }
    
    @OnOpen
    public void iniciarConexion(Session session){
        this.sessionWebsocket = session;
        conexiones.add(this);
        String message = String.format("* El %s %s", nickname , "se ha unido al chat");
        publicarGlobalmente(message);
    }
    
    @OnClose
    public void terminarConexion(){
        conexiones.remove(this);
        String message = String.format("* %s %s", nickname, "se ha desconectado");
        publicarGlobalmente(message);
    }
    
    
    @OnMessage
    public void atenderMensaje(String message){
        String mensajeConId = String.format("* %s: %s", nickname, message);
        publicarGlobalmente(mensajeConId);
    }
    
    
    @OnError
    public void onError(Throwable t) throws Throwable{
        System.out.println("Chat Error : " + t.toString());
    }
    
    public static void publicarGlobalmente(String msg) {
        for (ConexionClienteChat conexionI : conexiones) {
            try {
                synchronized (conexionI) {
                    if (conexionI.sessionWebsocket.isOpen()) {
                        conexionI.sessionWebsocket.getBasicRemote().sendText(msg);
                    }
                }
            } catch (IOException e) {
            }
        }
    }
    
    
}
