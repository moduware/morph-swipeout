// import { MorphElement } from '@moduware/morph-element/morph-element.js';
// import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { LitElement, html } from '@polymer/lit-element';
import '@polymer/polymer/lib/utils/render-status.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { addListener, setTouchAction, removeListener } from '@polymer/polymer/lib/utils/gestures.js';
import { getPlatform } from './src/morph-element.js';

/**
 * `morph-swipeout`
 * Component to allow swipeout of content by use that will reveal additional actions that don't take screen space normally
 *
 * @customElement
 * @extends HTMLElement
 * @demo demo/index.html
 */
export class MorphSwipeout extends LitElement {
  render() {
    return html`
    <style>
      :host {
        --swipe-action-after-background-color-right: yellow;
        --swipe-action-after-background-color-left: yellow;

        position: relative;
        display: block;
        overflow-x: hidden;
        background-color: var(--back-container-background-color, #fff);
      }

      .root-container {
        display: flex;
        justify-content: stretch;
      }

      .root-container:not(.no-transition) {
        transition: transform 300ms;
      }

      .animation-container {
        transition: height 0.4s linear;
        overflow: hidden;
        width: 100%;
      }

      .animation-container.disappear-animation {
        height: 0 !important;
      }

      .left-buttons-container,
      .right-buttons-container {
        position: absolute;
        display: flex;
        height: 100%;
        top: 50%;
      }

      .left-buttons-container {
        left: 0;
        transform: translateY(-50%) translateX(-100%);
      }

      .right-buttons-container {
        right: 0;
        transform: translateY(-50%) translateX(100%);
      }

      :host .left-buttons-container ::slotted([slot="left-buttons"])  morph-button,
      :host .right-buttons-container ::slotted([slot="right-buttons"])  morph-button {
        position: relative;
      }

      :host .left-buttons-container::after,
      :host .right-buttons-container::after {
        content: '';
        position: absolute;
        top: 0;
        height: 100%;
        width: 600%;
        
        z-index: -1;
        transform: translate3d(0,0,0);
      }

      :host .right-buttons-container::after {
        background-color: var(--swipe-action-after-background-color-right);
        left: 100%;
        margin-left: -1px;
      }

      :host .left-buttons-container::after {
        background-color: var(--swipe-action-after-background-color-left, #fff);
        right: 100%;
        margin-right: -1px;
      }


    </style>

    <div class="animation-container" id="animationContainer">
      <div class="root-container" id="rootContainer">
        <div class="left-buttons-container" id="leftButtonsContainer">
          <slot name="left-buttons"></slot>
        </div>
    
        <!-- main content of swipeout goes here -->
        <slot></slot>
    
        <div class="right-buttons-container" id="rightButtonsContainer">
          <slot name="right-buttons"></slot>
        </div>
      </div>
    </div>
`;
  }

  static get is() { return 'morph-swipeout'; }
  static get properties() {
    return {
      /**
      *  Property used to decide if action on the left or right is executed when swipe far enough
      */
      overswiper: {
        type: Boolean,
        value: false,
      },
      /** The amount of pixel swipe to trigger overswipe */
      overswipeTreshold: {
        type: Number
      },

      _trackInitialTransform: {
        type: Number
      }
    };
  }
  
  firstUpdated() {
    super.firstUpdated();
    let self = this;
    // let morphButtonRightAsync, morphButtonRightAsync;

    addListener(self, 'track', e => self.handleTrack(e));

    this.overswipeTreshold = this.offsetWidth / 2;
  }

  updated() {
    super.updated();
    this._observer = new FlattenedNodesObserver(this, (info) => {
      this.info = info;
    });
    this._observer.flush();

    setTouchAction(this, 'pan-y');
    let self = this;

    (async () => {
      const morphButtonRight = await self._getMorphButtonElement('right');
      const morphButtonLeft = await self._getMorphButtonElement('left');
      this.noLeftButton = typeof morphButtonLeft === 'undefined';
      
      // get the background-color of morph-button and assign to its ::after swipe-action extension
      if (morphButtonRight) self.style.setProperty('--swipe-action-after-background-color-right', self._getElementBackgroundColor(morphButtonRight));
      if(morphButtonLeft) self.style.setProperty('--swipe-action-after-background-color-left', self._getElementBackgroundColor(morphButtonLeft));
      // this.$.animationContainer.style.height = this.clientHeight + 'px';
      // tap event to whole body
      self._addSwipeoutClickOutsideEventListners(self, morphButtonRight, morphButtonLeft);
      if (morphButtonRight) morphButtonRight.addEventListener('click', event => self._onRightButtonClick(event));
      if(morphButtonLeft) morphButtonLeft.addEventListener('click', event => self._onLeftButtonClick(event));
    })();

  }

  /**
  * Closes the swipeout element when click outside of itself is detected
  * @param {Object} self - The original 'this' refering to elemnet itself
  * @param {Object} morphButtonRight - The right morph-button
  * @param {Object} morphButtonLeft - The left morph-button
  */
  _addSwipeoutClickOutsideEventListners(self, morphButtonRight, morphButtonLeft) {
    window.addEventListener('click', function _tapListener(e) {
      let target = e.target;
      // if the click is outside the button then close the swipeout component
      if (target != self && target != morphButtonRight && target != morphButtonLeft) {
        self._closeSwipe();
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._observer.disconnect();
    // REMOVE event window click listener
    window.removeEventListener('click', this._tapListener);
    removeListener(this, 'track', () => this.handleTrack());

  }

  /**
  * Async function callback of click event listener on right most button
  */
  async _onRightButtonClick(event) {
    const button = event.target;
    if (button.hasAttribute('item-delete')) {
      await this._animateDeleteAction(button);
    }
  }

  /**
  * Async function callback of click event listener on left most button
  */
  async _onLeftButtonClick(event) {
    const button = event.target;
    if (button.hasAttribute('item-delete')) {
      await this._animateDeleteAction(button);
    }
  }

  /**
  * Async function animate and delete button
  * @param {Object} button - Element animate and delete
  */
  async _animateDeleteAction(button) {
    const shadow = this.shadowRoot;
    let animationContainer = shadow.querySelector('#animationContainer');
    animationContainer.style.height = this.clientHeight + 'px';
    await this.waitNextFrame();
    await this._sleep(0);
    animationContainer.style.height = '0px';
    
    await this.waitForTranstionEnd(animationContainer, 'height');
    this.remove();
  }

  /**
  * Async function to force to do repaint of frame before going to the next line of js code
  */
  waitNextFrame() {
    return new Promise((resolve, reject) => {
      requestAnimationFrame((timestamp) => resolve(timestamp));
    });
  }

  /**
  * Function to wait for transition end
  * @param {Object} target - Element to listen for transition end
  * @param {String} property - Specific property to listen for transition
  */
  waitForTranstionEnd(target, property) {
    return new Promise((resolve, reject) => {
      let dynamicHandler = null;
      dynamicHandler = (event) => {
        if(property == null) {
          target.removeEventListener('transitionend', dynamicHandler);
          resolve();
        } else if(property == event.propertyName) {
          target.removeEventListener('transitionend', dynamicHandler);
          resolve();
        }
      }
      target.addEventListener('transitionend', dynamicHandler);
    });
  }

  /**
  * Async function to wait for specified time
  * @param {Number} milliseconds - time delay in milliseconds
  */
  _sleep(milliseconds) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), milliseconds);
    });
  }

  /**
  * Computes for the distance for reveal of right buttons
  * @param {Object} event - The value of the travel of event left or right scroll
  */
  async handleTrack(event) {
    console.log('handelTrack called!');
    
    const shadow = this.shadowRoot;
    let rootContainer = shadow.querySelector('#rootContainer');
    let distance = event.detail.dx;

    //if track distance is just lesst then +/- 10 it will not start the swiping action
    if (Math.abs(distance) < 10) {
      return;
    }

    // cancels tracking if there are no left buttons
    if(this.noLeftButton) {
      if(distance > 0) {
        return;
      }
    }

    /* START ACTIONS */
    if(event.detail.state == 'start') {
      
      this._trackInitialTransform = this._getTransformTranslateX(rootContainer);
      // we don't want smooth transitions during user interaction, so removing css smoother
      rootContainer.classList.add('no-transition');
      // determining our buttons container sizes
      const rightButtonsContainer = shadow.querySelector('#rightButtonsContainer');
      const leftButtonsContainer = shadow.querySelector('#leftButtonsContainer');
      this._rightButtonsContainerSize = rightButtonsContainer.offsetWidth;
      this._leftButtonsContainerSize = leftButtonsContainer.offsetWidth;
    } 
    
    /* SHARED ACTIONS */
    if(!this.overswiper) distance = this._calculateSwipeSlowDown(distance, this.offsetWidth);
    let newTransform = this._trackInitialTransform + distance;
    if(newTransform > this.offsetWidth) newTransform = this.offsetWidth -1;
    if(newTransform < this.offsetWidth * -1) newTransform = (this.offsetWidth * -1) +1 ;
    const direction = newTransform > 0 ? 'right' : 'left';
    
    /* END ACTIONS */
    if(event.detail.state == 'end') {
      // after user finished interaction, enabling css smoother back
      rootContainer.classList.remove('no-transition');
      
      // calculating positive distance (signless)
      const normalizeTransform = Math.abs(newTransform);
      
      if(this.overswiper && normalizeTransform > this.overswipeTreshold) {
        await this._completeOverswipe(direction);
        await this._handleOverswipe(direction);
        newTransform = 0;
      } else if(newTransform < (this._rightButtonsContainerSize / 2 * -1) ) {
        newTransform = this._rightButtonsContainerSize * -1;
      } else if (newTransform > (this._leftButtonsContainerSize / 2)) {
        newTransform = this._leftButtonsContainerSize;
      } else {
        newTransform = 0;
      }
    }
    
    // Shared code: this is done after every tracking event
    rootContainer.style.transform = `translateX(${newTransform}px)`;
  }

  _getTransformTranslateX(target) {
    if(target.style.transform == "") return 0;
    const parts = target.style.transform.split(/[\(\)]/g);
    return parseInt(parts[1]);
  }

  async _completeOverswipe(direction) {
    const shadow = this.shadowRoot;
    let rootContainer = shadow.querySelector('#rootContainer');
    const buttonPosition = direction == 'left' ? 'right' : 'left';
    if (buttonPosition == 'left') {
      rootContainer.style.transform = `translateX(${this.offsetWidth}px)`;
    } else if (buttonPosition == 'right') {
      rootContainer.style.transform = `translateX(-${this.offsetWidth}px)`;
    }
    await this.waitForTranstionEnd(rootContainer);
  }

  async _handleOverswipe(direction) {
    const buttonPosition = direction == 'left' ? 'right' : 'left';
    const button = await this._getMorphButtonElement(buttonPosition);
    const swipeoutPromptText = button.getAttribute('swipeout-prompt-text');
    let confirmed = false;
    if (swipeoutPromptText) {
      confirmed = await this._confirmDialog(swipeoutPromptText);
      if (!confirmed) return;
      if (button.hasAttribute('swipeout-delete')) await this._animateDeleteAction(button);
    } else if (button.hasAttribute('swipeout-delete') || button.hasAttribute('item-delete')) {
      await this._animateDeleteAction(button);
    } else {
      button.click();
    }
  }

  _confirmDialog(text) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const confirmed = confirm(text);
        resolve(confirmed);
      }, 0);
    });
  }

  _calculateSwipeSlowDown(distance, offset, factor) {
    factor = factor || 2;
    const scaler = (Math.abs(distance) / offset) / factor;
    const multiplier = 1 - Math.min(scaler, 1);
    return distance * multiplier;
  }


  /**
  * Closes the swipeout element
  */
  _closeSwipe() {
    const shadow = this.shadowRoot;
    const rootContainer = shadow.querySelector('#rootContainer');
    
    rootContainer.style.transform = `translateX(0px)`;
  }

  /**
  * Gets the background-color of morph-button
  * @param {String} buttonPosition - The position of the button being revealed
  */
  _getElementBackgroundColor(element) {
    if (typeof (ShadyCSS) != 'undefined') {
      return ShadyCSS.getComputedStyleValue(element, 'background-color');
    } 
  }


  /**
  * Gets the element nodes after a set delay
  * @param {Number} delay - The delay in milliseconds
  */
  async _getNodeElements(delay) {
    await this._sleep(delay);
    const nodes = this.info.addedNodes;
    return nodes;
  }

  /**
  * Gets the morph-button element being revealed
  * @param {String} buttonPosition - The position of the button being revealed
  */
  async _getMorphButtonElement(buttonPosition) {
    let items, lastButton;
    const nodes = await this._getNodeElements(400);

    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].nodeName != "#text" && nodes[i].nodeName != "#comment") {
        var swipeoutChild = nodes[i];
        
        // get the button container with the correct id
        if (swipeoutChild.getAttribute('slot') == (buttonPosition + '-buttons') ) {
        // check which item matches morph-button id leftLastButton or rightLastButton
          if (buttonPosition == 'left') {
            lastButton = swipeoutChild.children[0];
          } else {
            lastButton = swipeoutChild.children[swipeoutChild.children.length - 1];
          }
        }
      }
    }
    return lastButton;
  }
}

window.customElements.define(MorphSwipeout.is, MorphSwipeout);
