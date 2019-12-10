(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.IHModals = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @typedef {Object} options
 * @property {string} [className] Classname added to the modal when opened. Defaults to `modal--open`
 * @property {boolean} [closeOnBackgroundClick] Enable closing the modal when clicking outside the modal. Defaults to true.
 * @property {Function} [onOpenCallback]
 * @property {Function} [onCloseCallback]
 */
var FOCUSABLE_ELEMENTS = ['A', 'INPUT', 'BUTTON', 'SELECT', 'TEXTAREA'];
var PREVENT_SCROLLING_STYLING = {
  'overflow': 'hidden',
  'touch-action': 'none',
  '-ms-touch-action': 'none'
};
var RESET_SCROLLING_STYLING = {
  'overflow': '',
  'touch-action': '',
  '-ms-touch-action': ''
};

var NOOP = function NOOP() {};
/**
 * Default options
 * @type options
 * @private
 */


var DEFAULT_OPTIONS = {
  className: 'modal--open',
  closeOnBackgroundClick: true,
  onOpenCallback: NOOP,
  onCloseCallback: NOOP
};

var IHModals =
/*#__PURE__*/
function () {
  /**
   * @param {HTMLElement} element
   * @param {options} options
   */
  function IHModals(element) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, IHModals);

    /**
     * @type {HTMLElement}
     * @private
     */
    this._element = element;
    /**
     * @type {options}
     * @private
     */

    this._options = _objectSpread({}, DEFAULT_OPTIONS, {}, options);
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
    /**
     * @private
     */

    this._focusEventHandler = this._onFocus.bind(this);
  }
  /**
   *
   * @param {HTMLInputElement|HTMLLinkElement|HTMLElement} element
   * @returns {boolean}
   * @private
   */


  _createClass(IHModals, [{
    key: "_isFocusable",
    value: function _isFocusable(element) {
      if (element.tabIndex > 0 || element.tabIndex === 0 && element.getAttribute('tabindex') !== null) {
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

  }, {
    key: "_onKeydown",
    value: function _onKeydown(event) {
      if (event.code === 'Escape' && this._options.closeOnBackgroundClick) {
        this.close();
      }
    }
    /**
     * If element targeted with the click is not inside or the actual modal, modal is closed.
     * @param {MouseEvent} event
     * @private
     */

  }, {
    key: "_checkOutsideClick",
    value: function _checkOutsideClick(event) {
      var currentElement = event.target;

      while (currentElement !== this._element && currentElement.parentNode) {
        currentElement = currentElement.parentNode;
      }

      if (currentElement !== this._element) {
        if (this._options.closeOnBackgroundClick) {
          this.close();
        } else {
          event.preventDefault();
          event.stopPropagation();
        }
      }
    }
    /**
     * @param {HTMLElement} element
     * @returns {HTMLElement[]}
     * @private
     */

  }, {
    key: "_getElementFocusableChildren",
    value: function _getElementFocusableChildren(element) {
      var children = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = element.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var child = _step.value;

          if (this._isFocusable(child)) {
            children.push(child);
          }

          if (child.children.length) {
            children = children.concat(this._getElementFocusableChildren(child));
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return children;
    }
    /**
     * @param {FocusEvent} event
     * @private
     */

  }, {
    key: "_onFocus",
    value: function _onFocus(event) {
      var children = this._getElementFocusableChildren(this._element);

      var index = children.indexOf(event.target);

      if (index === children.length - 1 || index === -1) {
        children[0].focus();
      }
    }
    /**
     * Opens the modal
     */

  }, {
    key: "open",
    value: function open() {
      this._open = true;

      this._element.classList.add(this._options.className);

      document.addEventListener('keydown', this._keyDownEventHandler);
      document.addEventListener('click', this._clickEventHandler, {
        capture: true
      });

      var children = this._getElementFocusableChildren(this._element);

      if (children.length) {
        children[0].focus();
        document.addEventListener('focusout', this._focusEventHandler, {
          capture: true
        });
      }

      Object.assign(document.body.style, PREVENT_SCROLLING_STYLING);

      this._openEventHandlers.forEach(function (cb) {
        cb();
      });
    }
    /**
     * Closes the modal
     */

  }, {
    key: "close",
    value: function close() {
      this._open = false;

      this._element.classList.remove(this._options.className);

      document.removeEventListener('keydown', this._keyDownEventHandler);
      document.removeEventListener('click', this._clickEventHandler, {
        capture: true
      });
      document.removeEventListener('focusout', this._focusEventHandler, {
        capture: true
      });
      Object.assign(document.body.style, RESET_SCROLLING_STYLING);

      this._closeEventHandler.forEach(function (cb) {
        cb();
      });
    }
    /**
     * Current modal status
     * @returns {boolean}
     */

  }, {
    key: "isOpen",
    value: function isOpen() {
      return this._open;
    }
    /**
     * Helper to remove previously set callbacks.
     * @param {Function[]} array
     * @param {Function} callback
     * @returns {Function[]}
     * @private
     */

  }, {
    key: "_removeFromArray",
    value: function _removeFromArray(array, callback) {
      var index = array.indexOf(callback);

      if (index !== -1) {
        array.splice(index, 1);
      }
    }
    /**
     * Fired when the modal opens
     * @param {Function} callback
     */

  }, {
    key: "onOpen",
    value: function onOpen(callback) {
      this._openEventHandlers.push(callback);
    }
    /**
     * Removes previously bound open callback
     * @param {Function} callback
     */

  }, {
    key: "offOpen",
    value: function offOpen(callback) {
      this._removeFromArray(this._openEventHandlers, callback);
    }
    /**
     * Fired when the modal opens, but only once.
     * @param callback
     */

  }, {
    key: "onOpenOnce",
    value: function onOpenOnce(callback) {
      var _this = this;

      var eventHandler = function eventHandler() {
        _this.offOpen(eventHandler);

        callback();
      };

      this.onOpen(eventHandler);
    }
    /**
     * Fired when the modal closes
     * @param {Function} callback
     */

  }, {
    key: "onClose",
    value: function onClose(callback) {
      this._closeEventHandler.push(callback);
    }
    /**
     * Removes previously bound close callback
     * @param {Function} callback
     */

  }, {
    key: "offClose",
    value: function offClose(callback) {
      this._removeFromArray(this._closeEventHandler, callback);
    }
    /**
     * Fired when the modal closes, but only once.
     * @param {Function} callback
     */

  }, {
    key: "onCloseOnce",
    value: function onCloseOnce(callback) {
      var _this2 = this;

      var eventHandler = function eventHandler() {
        _this2.offClose(eventHandler);

        callback();
      };

      this.onClose(eventHandler);
    }
  }]);

  return IHModals;
}();

var _default = IHModals;
exports["default"] = _default;
module.exports = exports.default;

},{}]},{},[1])(1)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaWhtb2RhbHMuZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7QUFRQSxJQUFNLGtCQUFrQixHQUFHLENBQ3ZCLEdBRHVCLEVBRXZCLE9BRnVCLEVBR3ZCLFFBSHVCLEVBSXZCLFFBSnVCLEVBS3ZCLFVBTHVCLENBQTNCO0FBUUEsSUFBTSx5QkFBeUIsR0FBRztBQUM5QixjQUFZLFFBRGtCO0FBRTlCLGtCQUFnQixNQUZjO0FBRzlCLHNCQUFvQjtBQUhVLENBQWxDO0FBTUEsSUFBTSx1QkFBdUIsR0FBRztBQUM1QixjQUFZLEVBRGdCO0FBRTVCLGtCQUFnQixFQUZZO0FBRzVCLHNCQUFvQjtBQUhRLENBQWhDOztBQU1BLElBQU0sSUFBSSxHQUFHLFNBQVAsSUFBTyxHQUFNLENBQ2xCLENBREQ7QUFHQTs7Ozs7OztBQUtBLElBQU0sZUFBZSxHQUFHO0FBQ3BCLEVBQUEsU0FBUyxFQUFFLGFBRFM7QUFFcEIsRUFBQSxzQkFBc0IsRUFBRSxJQUZKO0FBR3BCLEVBQUEsY0FBYyxFQUFFLElBSEk7QUFJcEIsRUFBQSxlQUFlLEVBQUU7QUFKRyxDQUF4Qjs7SUFPTSxROzs7QUFDRjs7OztBQUlBLG9CQUFZLE9BQVosRUFBbUM7QUFBQSxRQUFkLE9BQWMsdUVBQUosRUFBSTs7QUFBQTs7QUFDL0I7Ozs7QUFJQSxTQUFLLFFBQUwsR0FBZ0IsT0FBaEI7QUFDQTs7Ozs7QUFJQSxTQUFLLFFBQUwscUJBQW9CLGVBQXBCLE1BQXdDLE9BQXhDO0FBQ0E7Ozs7O0FBSUEsU0FBSyxLQUFMLEdBQWEsS0FBYjtBQUNBOzs7OztBQUlBLFNBQUssa0JBQUwsR0FBMEIsQ0FBQyxLQUFLLFFBQUwsQ0FBYyxjQUFmLENBQTFCO0FBQ0E7Ozs7O0FBSUEsU0FBSyxrQkFBTCxHQUEwQixDQUFDLEtBQUssUUFBTCxDQUFjLGVBQWYsQ0FBMUI7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QUFLLGtCQUEzQixFQUErQyxRQUEvQztBQUNIO0FBRUQ7Ozs7Ozs7Z0NBSVksUSxFQUFVO0FBQUE7O0FBQ2xCLFVBQU0sWUFBWSxHQUFHLFNBQWYsWUFBZSxHQUFNO0FBQ3ZCLFFBQUEsTUFBSSxDQUFDLFFBQUwsQ0FBYyxZQUFkOztBQUNBLFFBQUEsUUFBUTtBQUNYLE9BSEQ7O0FBSUEsV0FBSyxPQUFMLENBQWEsWUFBYjtBQUNIOzs7Ozs7ZUFJVSxRIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2NsYXNzTmFtZV0gQ2xhc3NuYW1lIGFkZGVkIHRvIHRoZSBtb2RhbCB3aGVuIG9wZW5lZC4gRGVmYXVsdHMgdG8gYG1vZGFsLS1vcGVuYFxuICogQHByb3BlcnR5IHtib29sZWFufSBbY2xvc2VPbkJhY2tncm91bmRDbGlja10gRW5hYmxlIGNsb3NpbmcgdGhlIG1vZGFsIHdoZW4gY2xpY2tpbmcgb3V0c2lkZSB0aGUgbW9kYWwuIERlZmF1bHRzIHRvIHRydWUuXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBbb25PcGVuQ2FsbGJhY2tdXG4gKiBAcHJvcGVydHkge0Z1bmN0aW9ufSBbb25DbG9zZUNhbGxiYWNrXVxuICovXG5cbmNvbnN0IEZPQ1VTQUJMRV9FTEVNRU5UUyA9IFtcbiAgICAnQScsXG4gICAgJ0lOUFVUJyxcbiAgICAnQlVUVE9OJyxcbiAgICAnU0VMRUNUJyxcbiAgICAnVEVYVEFSRUEnLFxuXTtcblxuY29uc3QgUFJFVkVOVF9TQ1JPTExJTkdfU1RZTElORyA9IHtcbiAgICAnb3ZlcmZsb3cnOiAnaGlkZGVuJyxcbiAgICAndG91Y2gtYWN0aW9uJzogJ25vbmUnLFxuICAgICctbXMtdG91Y2gtYWN0aW9uJzogJ25vbmUnLFxufTtcblxuY29uc3QgUkVTRVRfU0NST0xMSU5HX1NUWUxJTkcgPSB7XG4gICAgJ292ZXJmbG93JzogJycsXG4gICAgJ3RvdWNoLWFjdGlvbic6ICcnLFxuICAgICctbXMtdG91Y2gtYWN0aW9uJzogJycsXG59O1xuXG5jb25zdCBOT09QID0gKCkgPT4ge1xufTtcblxuLyoqXG4gKiBEZWZhdWx0IG9wdGlvbnNcbiAqIEB0eXBlIG9wdGlvbnNcbiAqIEBwcml2YXRlXG4gKi9cbmNvbnN0IERFRkFVTFRfT1BUSU9OUyA9IHtcbiAgICBjbGFzc05hbWU6ICdtb2RhbC0tb3BlbicsXG4gICAgY2xvc2VPbkJhY2tncm91bmRDbGljazogdHJ1ZSxcbiAgICBvbk9wZW5DYWxsYmFjazogTk9PUCxcbiAgICBvbkNsb3NlQ2FsbGJhY2s6IE5PT1AsXG59O1xuXG5jbGFzcyBJSE1vZGFscyB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuICAgICAqIEBwYXJhbSB7b3B0aW9uc30gb3B0aW9uc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQHR5cGUge0hUTUxFbGVtZW50fVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAdHlwZSB7b3B0aW9uc31cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSB7Li4uREVGQVVMVF9PUFRJT05TLCAuLi5vcHRpb25zfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fb3BlbiA9IGZhbHNlO1xuICAgICAgICAvKipcbiAgICAgICAgICogQHR5cGUge0Z1bmN0aW9uW119XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9vcGVuRXZlbnRIYW5kbGVycyA9IFt0aGlzLl9vcHRpb25zLm9uT3BlbkNhbGxiYWNrXTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEB0eXBlIHtGdW5jdGlvbltdfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fY2xvc2VFdmVudEhhbmRsZXIgPSBbdGhpcy5fb3B0aW9ucy5vbkNsb3NlQ2FsbGJhY2tdO1xuXG4gICAgICAgIHRoaXMuX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLW1vZGFsJywgJ3RydWUnKTtcbiAgICAgICAgaWYgKCF0aGlzLl9lbGVtZW50LmdldEF0dHJpYnV0ZSgncm9sZScpKSB7XG4gICAgICAgICAgICB0aGlzLl9lbGVtZW50LnNldEF0dHJpYnV0ZSgncm9sZScsICdkaWFsb2cnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fa2V5RG93bkV2ZW50SGFuZGxlciA9IHRoaXMuX29uS2V5ZG93bi5iaW5kKHRoaXMpO1xuICAgICAgICAvKipcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX2NsaWNrRXZlbnRIYW5kbGVyID0gdGhpcy5fY2hlY2tPdXRzaWRlQ2xpY2suYmluZCh0aGlzKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9mb2N1c0V2ZW50SGFuZGxlciA9IHRoaXMuX29uRm9jdXMuYmluZCh0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7SFRNTElucHV0RWxlbWVudHxIVE1MTGlua0VsZW1lbnR8SFRNTEVsZW1lbnR9IGVsZW1lbnRcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9pc0ZvY3VzYWJsZShlbGVtZW50KSB7XG4gICAgICAgIGlmIChlbGVtZW50LnRhYkluZGV4ID4gMCB8fCAoZWxlbWVudC50YWJJbmRleCA9PT0gMCAmJiBlbGVtZW50LmdldEF0dHJpYnV0ZSgndGFiaW5kZXgnKSAhPT0gbnVsbCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbGVtZW50LmRpc2FibGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEZPQ1VTQUJMRV9FTEVNRU5UUy5pbmNsdWRlcyhlbGVtZW50Lm5vZGVOYW1lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0tleWJvYXJkRXZlbnR9IGV2ZW50XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfb25LZXlkb3duKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC5jb2RlID09PSAnRXNjYXBlJyAmJiB0aGlzLl9vcHRpb25zLmNsb3NlT25CYWNrZ3JvdW5kQ2xpY2spIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIElmIGVsZW1lbnQgdGFyZ2V0ZWQgd2l0aCB0aGUgY2xpY2sgaXMgbm90IGluc2lkZSBvciB0aGUgYWN0dWFsIG1vZGFsLCBtb2RhbCBpcyBjbG9zZWQuXG4gICAgICogQHBhcmFtIHtNb3VzZUV2ZW50fSBldmVudFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2NoZWNrT3V0c2lkZUNsaWNrKGV2ZW50KSB7XG4gICAgICAgIGxldCBjdXJyZW50RWxlbWVudCA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnRFbGVtZW50ICE9PSB0aGlzLl9lbGVtZW50ICYmIGN1cnJlbnRFbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgIGN1cnJlbnRFbGVtZW50ID0gY3VycmVudEVsZW1lbnQucGFyZW50Tm9kZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY3VycmVudEVsZW1lbnQgIT09IHRoaXMuX2VsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLmNsb3NlT25CYWNrZ3JvdW5kQ2xpY2spIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAgICogQHJldHVybnMge0hUTUxFbGVtZW50W119XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfZ2V0RWxlbWVudEZvY3VzYWJsZUNoaWxkcmVuKGVsZW1lbnQpIHtcbiAgICAgICAgbGV0IGNoaWxkcmVuID0gW107XG4gICAgICAgIGZvciAobGV0IGNoaWxkIG9mIGVsZW1lbnQuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGlmKHRoaXMuX2lzRm9jdXNhYmxlKGNoaWxkKSkge1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNoaWxkLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNoaWxkcmVuID0gY2hpbGRyZW4uY29uY2F0KHRoaXMuX2dldEVsZW1lbnRGb2N1c2FibGVDaGlsZHJlbihjaGlsZCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjaGlsZHJlbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0ZvY3VzRXZlbnR9IGV2ZW50XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfb25Gb2N1cyhldmVudCkge1xuICAgICAgICBjb25zdCBjaGlsZHJlbiA9IHRoaXMuX2dldEVsZW1lbnRGb2N1c2FibGVDaGlsZHJlbih0aGlzLl9lbGVtZW50KTtcbiAgICAgICAgY29uc3QgaW5kZXggPSBjaGlsZHJlbi5pbmRleE9mKGV2ZW50LnRhcmdldCk7XG4gICAgICAgIGlmIChpbmRleCA9PT0gY2hpbGRyZW4ubGVuZ3RoIC0gMSB8fCBpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgIGNoaWxkcmVuWzBdLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPcGVucyB0aGUgbW9kYWxcbiAgICAgKi9cbiAgICBvcGVuKCkge1xuICAgICAgICB0aGlzLl9vcGVuID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QuYWRkKHRoaXMuX29wdGlvbnMuY2xhc3NOYW1lKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuX2tleURvd25FdmVudEhhbmRsZXIpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX2NsaWNrRXZlbnRIYW5kbGVyLCB7Y2FwdHVyZTogdHJ1ZX0pO1xuICAgICAgICBsZXQgY2hpbGRyZW4gPSB0aGlzLl9nZXRFbGVtZW50Rm9jdXNhYmxlQ2hpbGRyZW4odGhpcy5fZWxlbWVudCk7XG4gICAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNoaWxkcmVuWzBdLmZvY3VzKCk7XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmb2N1c291dCcsIHRoaXMuX2ZvY3VzRXZlbnRIYW5kbGVyLCB7Y2FwdHVyZTogdHJ1ZX0pO1xuICAgICAgICB9XG4gICAgICAgIE9iamVjdC5hc3NpZ24oZG9jdW1lbnQuYm9keS5zdHlsZSwgUFJFVkVOVF9TQ1JPTExJTkdfU1RZTElORyk7XG4gICAgICAgIHRoaXMuX29wZW5FdmVudEhhbmRsZXJzLmZvckVhY2goY2IgPT4ge1xuICAgICAgICAgICAgY2IoKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDbG9zZXMgdGhlIG1vZGFsXG4gICAgICovXG4gICAgY2xvc2UoKSB7XG4gICAgICAgIHRoaXMuX29wZW4gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKHRoaXMuX29wdGlvbnMuY2xhc3NOYW1lKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuX2tleURvd25FdmVudEhhbmRsZXIpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX2NsaWNrRXZlbnRIYW5kbGVyLCB7Y2FwdHVyZTogdHJ1ZX0pO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1c291dCcsIHRoaXMuX2ZvY3VzRXZlbnRIYW5kbGVyLCB7Y2FwdHVyZTogdHJ1ZX0pO1xuICAgICAgICBPYmplY3QuYXNzaWduKGRvY3VtZW50LmJvZHkuc3R5bGUsIFJFU0VUX1NDUk9MTElOR19TVFlMSU5HKTtcbiAgICAgICAgdGhpcy5fY2xvc2VFdmVudEhhbmRsZXIuZm9yRWFjaChjYiA9PiB7XG4gICAgICAgICAgICBjYigpXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEN1cnJlbnQgbW9kYWwgc3RhdHVzXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgaXNPcGVuKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fb3BlbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIZWxwZXIgdG8gcmVtb3ZlIHByZXZpb3VzbHkgc2V0IGNhbGxiYWNrcy5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9uW119IGFycmF5XG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKiBAcmV0dXJucyB7RnVuY3Rpb25bXX1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9yZW1vdmVGcm9tQXJyYXkoYXJyYXksIGNhbGxiYWNrKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gYXJyYXkuaW5kZXhPZihjYWxsYmFjayk7XG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIGFycmF5LnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaXJlZCB3aGVuIHRoZSBtb2RhbCBvcGVuc1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICovXG4gICAgb25PcGVuKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuX29wZW5FdmVudEhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgcHJldmlvdXNseSBib3VuZCBvcGVuIGNhbGxiYWNrXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKi9cbiAgICBvZmZPcGVuKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuX3JlbW92ZUZyb21BcnJheSh0aGlzLl9vcGVuRXZlbnRIYW5kbGVycywgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpcmVkIHdoZW4gdGhlIG1vZGFsIG9wZW5zLCBidXQgb25seSBvbmNlLlxuICAgICAqIEBwYXJhbSBjYWxsYmFja1xuICAgICAqL1xuICAgIG9uT3Blbk9uY2UoY2FsbGJhY2spIHtcbiAgICAgICAgY29uc3QgZXZlbnRIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vZmZPcGVuKGV2ZW50SGFuZGxlcik7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLm9uT3BlbihldmVudEhhbmRsZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpcmVkIHdoZW4gdGhlIG1vZGFsIGNsb3Nlc1xuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICovXG4gICAgb25DbG9zZShjYWxsYmFjaykge1xuICAgICAgICB0aGlzLl9jbG9zZUV2ZW50SGFuZGxlci5wdXNoKGNhbGxiYWNrKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIHByZXZpb3VzbHkgYm91bmQgY2xvc2UgY2FsbGJhY2tcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAqL1xuICAgIG9mZkNsb3NlKGNhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuX3JlbW92ZUZyb21BcnJheSh0aGlzLl9jbG9zZUV2ZW50SGFuZGxlciwgY2FsbGJhY2spO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpcmVkIHdoZW4gdGhlIG1vZGFsIGNsb3NlcywgYnV0IG9ubHkgb25jZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAqL1xuICAgIG9uQ2xvc2VPbmNlKGNhbGxiYWNrKSB7XG4gICAgICAgIGNvbnN0IGV2ZW50SGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMub2ZmQ2xvc2UoZXZlbnRIYW5kbGVyKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMub25DbG9zZShldmVudEhhbmRsZXIpO1xuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBJSE1vZGFsczsiXX0=
