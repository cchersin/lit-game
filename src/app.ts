import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import { routes } from './index';
import { sharedStyles } from './shared-styles';

@customElement('game-app')
export class App extends LitElement {
  @property({ type: String }) header = 'My game';
 
  static styles = [
  sharedStyles, css`
    .main {
    height: 100%;
  }
    
  #outlet {
      height: 100%;
  }
 `];

  constructor() {
    super();
  }

  firstUpdated() {
    const outlet = this.shadowRoot?.getElementById('outlet');
    if (outlet) {
        const router = new Router(outlet);
        router.setRoutes(routes);
        Router.go('/login')
    }
  }

  handleLogout() {
    localStorage.removeItem('userName');
    localStorage.removeItem('currentGame');
    Router.go('/login'); 
  }

  /*setupAudio() {
    const room = "mia-stanza-di-test278572389784789427"; // usa un nome univoco!
    const socket = new WebSocket("wss://connect.inboxgo.org/inbox");

    const config = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    };
    const pc = new RTCPeerConnection(config);

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "join", room }));
    };

    socket.onmessage = async (msg) => {
      const data = JSON.parse(msg.data);

      if (data.type === "offer") {
        await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.send(JSON.stringify({ type: "answer", room, answer }));
      }

      if (data.type === "answer") {
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
      }

      if (data.type === "candidate") {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (e) {
          console.error('Errore ICE:', e);
        }
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.send(JSON.stringify({ type: "candidate", room, candidate: event.candidate }));
      }
    };

    pc.ontrack = (event) => {
      const audio = new Audio();
      audio.srcObject = event.streams[0];
      audio.autoplay = true;
      document.body.appendChild(audio);
    };

   this.startStream(socket, pc, room);
  }

  async startStream(socket: WebSocket, pc: RTCPeerConnection, room: string) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.send(JSON.stringify({ type: "offer", room, offer }));
  }*/

   
 
  render() {
    return html`
      <main class="main">
         <div class="topnav">
          <a @click="${this.handleLogout}">Logout</a>
         </div>
         <div id="outlet" style="height: 100%"></div>
      </main>
    `;
  }
}
