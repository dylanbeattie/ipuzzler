export class IPuzzler extends HTMLElement {
    constructor() {
        super();
        let shadow = this.attachShadow({mode: 'open' });
        let span = document.createElement('span');
        span.innerHTML = "ipuzzler is working.";
        let link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', 'css/ipuzzler.css');
        shadow.appendChild(link);
        shadow.appendChild(span);
    }

    hello(message) {
        return `Hello ${message}`;
    }
}

customElements.define("ipuzzler-puzzle", IPuzzler);