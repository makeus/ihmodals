/**
 * @typedef {Object} options
 * @property {string} [className] Classname added to the modal when opened. Defaults to `modal--open`
 * @property {boolean} [closeOnBackgroundClick] Enable closing the modal when clicking outside the modal. Defaults to true.
 * @property {Function} [onOpenCallback]
 * @property {Function} [onCloseCallback]
 */

const FOCUSABLE_ELEMENTS = [
    'A',
    'INPUT',
    'BUTTON',
    'SELECT',
    'TEXTAREA',
];

const PREVENT_SCROLLING_STYLING = {
    'overflow': 'hidden',
    'touch-action': 'none',
    '-ms-touch-action': 'none',
};

const RESET_SCROLLING_STYLING = {
    'overflow': '',
    'touch-action': '',
    '-ms-touch-action': '',
};

const NOOP = () => {
};

/**
 * Default options
 * @type options
 * @private
 */
const DEFAULT_OPTIONS = {
    className: 'modal--open',
    closeOnBackgroundClick: true,
    onOpenCallback: NOOP,
    onCloseCallback: NOOP,
};

class IHModals {
    /**
     * @param {HTMLElement} element
     * @param {options} options
     */
    constructor(element, options = {}) {
        /**
         * @type {HTMLElement}
         * @private
         */
        this._element = element;
        /**
         * @type {options}
         * @private
         */
        this._options = {...DEFAULT_OPTIONS, ...options};
        /**
         * @type {boolean}
         * @private
         */
        this._open = false;
        /**
         * @type {Function[]}
         * @private
         */
        this._openEventHandlers = [this._options.onOpenCallback];
        /**
         * @type {Function[]}
         * @private
         */
        this._closeEventHandler = [this._options.onCloseCallback];

        this._element.setAttribute('aria-modal', 'true');
        this._element.setAttribute('aria-hidden', 'true');
        if (!this._element.getAttribute('role')) {
            this._element.setAttribute('role', 'dialog');
        }

        /**
         * @private
         */
        this._keyDownEventHandler = this._onKeydown.bind(this);
        /**
         * @private
         */
        this._clickEventHandler = this._checkOutsideClick.bind(this);
    }

    /**
     *
     * @param {HTMLInputElement|HTMLLinkElement|HTMLElement} element
     * @returns {boolean}
     * @private
     */
    _isFocusable(element) {
        if (element.tabIndex > 0 || (element.tabIndex === 0 && element.getAttribute('tabindex') !== null)) {
            return true;
        }
        if (element.disabled) {
            return false;
        }
        return FOCUSABLE_ELEMENTS.includes(element.nodeName);
    }

    /**
     * @param {KeyboardEvent} event
     * @private
     */
    _onKeydown(event) {
        if (event.code === 'Escape' && this._options.closeOnBackgroundClick) {
            this.close();
        }

        if(event.code === 'Tab') {
            const children = this._getElementFocusableChildren(this._element);
            const index = children.indexOf(document.activeElement);
            if (!event.shiftKey && (index === children.length - 1 || index === -1)) {
                children[0].focus();
                event.preventDefault();
                return;
            }
            if(event.shiftKey && index === 0) {
                children[children.length - 1].focus();
                event.preventDefault();
            }
        }
    }

    /**
     * If element targeted with the click is not inside or the actual modal, modal is closed.
     * @param {MouseEvent} event
     * @private
     */
    _checkOutsideClick(event) {
        let currentElement = event.target;
        while (currentElement !== this._element && currentElement.parentNode) {
            currentElement = currentElement.parentNode;
        }
        if (currentElement !== this._element) {
            if (this._options.closeOnBackgroundClick) {
                this.close();
            }
            event.preventDefault();
            event.stopPropagation();
        }
    }

    /**
     * @param {HTMLElement} element
     * @returns {HTMLElement[]}
     * @private
     */
    _getElementFocusableChildren(element) {
        let children = [];
        for (let child of element.children) {
            if(this._isFocusable(child)) {
                children.push(child);
            }
            if (child.children.length) {
                children = children.concat(this._getElementFocusableChildren(child));
            }
        }
        return children;
    }

    /**
     * Opens the modal
     */
    open() {
        this._open = true;
        this._element.classList.add(this._options.className);
        this._element.setAttribute('aria-hidden', 'false');
        document.addEventListener('keydown', this._keyDownEventHandler, {capture: true});
        document.addEventListener('click', this._clickEventHandler, {capture: true});
        Object.assign(document.body.style, PREVENT_SCROLLING_STYLING);
        const children = this._getElementFocusableChildren(this._element);
        if (children.length) {
            children[0].focus();
        }
        this._openEventHandlers.forEach(cb => {
            cb()
        });
    }

    /**
     * Closes the modal
     */
    close() {
        this._open = false;
        this._element.classList.remove(this._options.className);
        this._element.setAttribute('aria-hidden', 'true');
        document.removeEventListener('keydown', this._keyDownEventHandler, {capture: true});
        document.removeEventListener('click', this._clickEventHandler, {capture: true});
        Object.assign(document.body.style, RESET_SCROLLING_STYLING);
        this._closeEventHandler.forEach(cb => {
            cb()
        });
    }

    /**
     * Current modal status
     * @returns {boolean}
     */
    isOpen() {
        return this._open;
    }

    /**
     * Helper to remove previously set callbacks.
     * @param {Function[]} array
     * @param {Function} callback
     * @returns {Function[]}
     * @private
     */
    _removeFromArray(array, callback) {
        const index = array.indexOf(callback);
        if (index !== -1) {
            array.splice(index, 1);
        }
    }

    /**
     * Fired when the modal opens
     * @param {Function} callback
     */
    onOpen(callback) {
        this._openEventHandlers.push(callback);
    }

    /**
     * Removes previously bound open callback
     * @param {Function} callback
     */
    offOpen(callback) {
        this._removeFromArray(this._openEventHandlers, callback);
    }

    /**
     * Fired when the modal opens, but only once.
     * @param callback
     */
    onOpenOnce(callback) {
        const eventHandler = () => {
            this.offOpen(eventHandler);
            callback();
        };
        this.onOpen(eventHandler);
    }

    /**
     * Fired when the modal closes
     * @param {Function} callback
     */
    onClose(callback) {
        this._closeEventHandler.push(callback);
    }

    /**
     * Removes previously bound close callback
     * @param {Function} callback
     */
    offClose(callback) {
        this._removeFromArray(this._closeEventHandler, callback);
    }

    /**
     * Fired when the modal closes, but only once.
     * @param {Function} callback
     */
    onCloseOnce(callback) {
        const eventHandler = () => {
            this.offClose(eventHandler);
            callback();
        };
        this.onClose(eventHandler);
    }
}


export default IHModals;