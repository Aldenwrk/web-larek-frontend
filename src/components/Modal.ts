import { IEvents } from "./base/events";
import { Component } from "./Component";

interface IModalContent {
  modalContent: HTMLElement;
}

export class Modal extends Component<IModalContent> {
  protected events: IEvents;
  protected _button: HTMLButtonElement;
  protected _modalContent: HTMLElement;

  constructor(container:HTMLElement, events:IEvents){
    super(container);

    this.events = events;
    this._button = container.querySelector('.modal__close');
    this._modalContent = container.querySelector('.modal__content');

    this._button.addEventListener('click', this.close.bind(this));
    this.container.firstElementChild.addEventListener('click', (event) => event.stopPropagation());
  }

  set modalContent(content:HTMLElement){
    this._modalContent.replaceChildren(content);
  }

  protected toggleModal(modalState:boolean){
    this.toggleClass(this.container, 'modal_active', modalState);
  }

  open(){
    this.toggleModal(true);
    this.events.emit('modal:open');
  }

  close(){
    this.toggleModal(false);
    this._modalContent = null;
    this.events.emit('modal:close');
  }

  render(data?:IModalContent): HTMLElement {
    super.render(data);
    this.open();
    return this.container;
  }
}