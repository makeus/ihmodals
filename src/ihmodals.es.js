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

const NOOP = () => {};

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

        this._element.setAttribute('aria-modal', 'true');
        if (!this._element.getAttribute('role')) {
            this._element.setAttribute('role', 'dialog');
        }
    }

    /**
     *
     * @param {HTMLInputElement|HTMLLinkElement|HTMLElement} element
     * @returns {boolean}
     * @private
     */
 /*   _isFocusable(element) {
        if (element.tabIndex > 0 || (element.tabIndex === 0 && element.getAttribute('tabIndex') !== null)) {
            return true;
        }
        if (element.disabled) {
            return false;
        }
        return FOCUSABLE_ELEMENTS.includes(element.nodeName);
    }*/

    /**
     * @param {KeyboardEvent} event
     * @private
     */
    _onKeydown(event) {
        if (event.code === 'Escape') {
            this.close();
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
            this.close();
        }
    }

    /**
     * Opens the modal
     */
    open() {
        this._open = true;
        this._element.classList.add(this._options.className);
        if (this._options.closeOnBackgroundClick) {
            document.addEventListener('keydown', this._onKeydown.bind(this));
            document.addEventListener('click', this._checkOutsideClick.bind(this));
        }
        this._options.onOpenCallback();
    }

    /**
     * Closes the modal
     */
    close() {
        this._open = false;
        this._element.classList.remove(this._options.className);
        document.removeEventListener('keydown', this._onKeydown.bind(this));
        document.removeEventListener('click', this._checkOutsideClick.bind(this));
        this._options.onCloseCallback();
    }

    /**
     * Current modal status
     * @returns {boolean}
     */
    isOpen() {
        return this._open;
    }

}

export default IHModals;