class Modal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isOpen = false;
    this.shadowRoot.innerHTML = `
        <style>
            #backdrop{
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                background-color: rgba(0,0,0,0.75);
                z-index: 10;
                opacity: 0;
                pointer-events: none;
            }
            
            :host([opened]) #backdrop ,
            :host([opened]) #modal {
                opacity: 1;
                pointer-events: all;
            }
           
            :host([opened]) #modal {
                top: 15vh;
                pointer-events: all;
            }

            #modal{
                position: fixed;
                top: 10vh;
                left: 25%;
                width: 50%; 
                z-index: 100;
                background: white;
                border-radius: 3px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.26);
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                opacity: 0;
                pointer-events: none;
                transition: all 0.3s ease-out;
            }
            
            header{
                padding: 1rem;
                border-bottom: 1px solid #ccc;
                
            }

            ::slotted(h1){
                font-size: 1.25rem;
                margin: 0;
            }
            
            #main{
                padding: 1rem;
            }

            #actions{
                border-top: 1px solid #ccc
                border-bottom: 1px solid #ccc
                padding: 1rem;
                display: flex;
                justify-content: flex-end;
            }

            #actions button{
                margin: 0.55rem 0.4rem;
            }

        </style>

        <div id="backdrop"></div>
        <div id="modal">
        <header>
            <slot name="title">Please Confirm Payment</slot>
            <!--we need to add names to our slots,-->
            <!--becasue if we dont, JS wont know which lines-->
            <!--should go to witch section,-->
            <!--and it will pass all the values to the #1 section-->
        </header>
        <section id="main">
            <slot ></slot>
        </section>
        <section id="actions">
            <button id="cancel-btn">Cancel</button>
            <button id="confirm-btn">Confirm</button>
        </section>
        </div>
        `;

    //to get info about the slots you are using in your code:
    const slots = this.shadowRoot.querySelectorAll('slot');
    slots[1].addEventListener('slotchange', (event) => {
      console.dir(slots[1].assignedNodes());
    });

    const backdrop = this.shadowRoot.querySelector('#backdrop');

    const cancelButton = this.shadowRoot.querySelector('#cancel-btn');
    const confirmButton = this.shadowRoot.querySelector('#confirm-btn');

    backdrop.addEventListener('click', this._cancel.bind(this));
    cancelButton.addEventListener('click', this._cancel.bind(this));
    confirmButton.addEventListener('click', this._confirm.bind(this));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    //   we did the change in the styles with :host condition :)
    if (this.hasAttribute('opened')) {
      this.isOpen = true;
      //     this.shadowRoot.querySelector('#backdrop').style.opacity = 1;
      //     this.shadowRoot.querySelector('#backdrop').style.pointerEvents = 'all';
      //     this.shadowRoot.querySelector('#modal').style.opacity = 1;
      //     this.shadowRoot.querySelector('#modal').style.pointerEvents = 'all';
    } else {
      this.isOpen = false;
    }
  }

  static get observedAttributes() {
    return ['opened'];
  }

  open() {
    this.setAttribute('opened', '');
    this.isOpen = true;
  }

  hide() {
    if (this.hasAttribute('opened')) {
      this.removeAttribute('opened');
    }
    this.isOpen = false;
  }

  _cancel(event) {
    this.hide();
    const cancelEvent = new Event('cancel', { bubbles: true, composed: true });
    //bubbles: if there is no eevent go to its parent until you find event
    //composed: the function can go outside the shadow DOM tree
    event.target.dispatchEvent(cancelEvent);
  }

  _confirm(event) {
    this.hide();
    const cancelEvent = new Event('confirm'); //similar to _cancel but shorter
    this.dispatchEvent(cancelEvent);
  }
}

customElements.define('uc-modal', Modal);
