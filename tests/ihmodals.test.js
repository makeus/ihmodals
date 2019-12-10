import IHModals from "../src/ihmodals.es";

describe('IHModals', () => {

    beforeEach(() => {
        jest.spyOn(document, 'addEventListener').mockImplementation();
        jest.spyOn(document, 'removeEventListener').mockImplementation();
        document.addEventListener.mockReset();
        document.removeEventListener.mockReset();

        document.body.style = new CSSStyleDeclaration();
    });

    describe('initialization', () => {

        test('sets aria-model attribute and role when not set', () => {
            const element = document.createElement('div');

            new IHModals(element);

            expect(element.hasAttribute('aria-modal')).toEqual(true);
            expect(element.getAttribute('role')).toEqual('dialog');
        });

        test('sets aria-model attribute and role when not set', () => {
            const element = document.createElement('div');
            element.setAttribute('role', 'alert');

            new IHModals(element);

            expect(element.getAttribute('role')).toEqual('alert');
        });
    });

    describe('#open', () => {

        it('sets open class, triggers all bound callbacks and styling to prevent scrolling', () => {
            const element = document.createElement('div');
            element.classList.add('mymodal');

            const onOpenCallbacMock = jest.fn();
            const onOpenCallbacMock2 = jest.fn();
            const modal = new IHModals(element, {
                closeOnBackgroundClick: false,
                className: 'mymodal--open',
                onOpenCallback: onOpenCallbacMock
            });
            modal.onOpen(onOpenCallbacMock2);
            modal.open();

            expect(onOpenCallbacMock).toHaveBeenCalled();
            expect(onOpenCallbacMock2).toHaveBeenCalled();
            expect(element.classList.contains('mymodal--open')).toEqual(true);
            expect(modal.isOpen()).toEqual(true);
            expect(document.body.style.overflow).toEqual('hidden');
            expect(document.body.style['touch-action']).toEqual('none');
        });

        const testCases = [
            {
                html: `<div><label for="input">Test</label><input id="input" type="text"></div>`,
                expectedFocusOnSelector: 'input',
            },
            {
                html: '<div><h1>TestTitle</h1><a href="#">Link</a></div>',
                expectedFocusOnSelector: 'a',
            },
            {
                html: '<div><button>TestButton</button><a href="#">Link</a></div>',
                expectedFocusOnSelector: 'button',
            },
            {
                html: '<div><button disabled>TestButton</button><select><option>Test</option></select></div>',
                expectedFocusOnSelector: 'select',
            },
            {
                html: '<div><div id="focus" tabindex="0"></div> <select><option>Test</option></select></div>',
                expectedFocusOnSelector: '#focus',
            },
            {
                html: '<div><div id="focus" tabindex="1"></div> <select><option>Test</option></select></div>',
                expectedFocusOnSelector: '#focus',
            },
        ];

        testCases.forEach(({html, expectedFocusOnSelector}, index) => {
            it(`focuses on the first focusable child element case ${index + 1}`, () => {
                const element = document.createElement('div');
                element.insertAdjacentHTML('beforeend', html);

                const modal = new IHModals(element);
                modal.open();

                expect(document.activeElement === element.querySelector(expectedFocusOnSelector)).toEqual(true);
            });
        });

        describe('binds focusout event listener', () => {
            let focusoutEventCallback;

            beforeEach(() => {
                jest.spyOn(document, 'addEventListener').mockImplementation((eventName, callback) => {
                    if (eventName === 'focusout') {
                        focusoutEventCallback = callback;
                    }
                });
            });

            it('when focusout:ng on a focusable child element other than the last, does nothing', () => {
                const element = document.createElement('div');
                element.insertAdjacentHTML('beforeend', `
                    <form>
                        <label for="name">Name</label>
                        <input id="name" name="name" type="text">
                        <button type="submit">Submit</button>
                    </form>
                `);

                const modal = new IHModals(element);
                modal.open();

                expect(document.addEventListener).toHaveBeenCalledWith('focusout', expect.any(Function), {capture: true});
                expect(document.activeElement === element.querySelector('input')).toEqual(true);

                focusoutEventCallback({target: element.querySelector('input')});
                expect(document.activeElement === element.querySelector('input')).toEqual(true); // Does not change the focus
            });

            it('when focusout:ng on the last focusable event, focus is returned to the first element', () => {
                const element = document.createElement('div');
                element.insertAdjacentHTML('beforeend', `
                    <form>
                        <label for="name">Name</label>
                        <input id="name" name="name" type="text">
                        <button type="submit">Submit</button>
                    </form>
                `);

                const modal = new IHModals(element);
                modal.open();

                expect(document.addEventListener).toHaveBeenCalledWith('focusout', expect.any(Function), {capture: true});
                element.querySelector('button').focus();
                expect(document.activeElement === element.querySelector('button')).toEqual(true); // Does not change the focus

                focusoutEventCallback({target: element.querySelector('button')});

                expect(document.activeElement === element.querySelector('input')).toEqual(true); // Does not change the focus
            });
        });

        describe('with closeOnBackgroundClick', () => {

            /** @type IHModals */
            let modal;
            /** @type HTMLElement */
            let element;

            let onOpenCallbackMock, onCloseCallbackMock;

            beforeEach(() => {
                element = document.createElement('div');

                onOpenCallbackMock = jest.fn();
                onCloseCallbackMock = jest.fn();

                modal = new IHModals(element, {
                    closeOnBackgroundClick: true,
                    onOpenCallback: onOpenCallbackMock,
                    onCloseCallback: onCloseCallbackMock,
                });
            });

            describe('binds keydown event handler', () => {
                let keyDownEventCallback;

                beforeEach(() => {
                    jest.spyOn(document, 'addEventListener').mockImplementation((eventName, callback) => {
                        if (eventName === 'keydown') {
                            keyDownEventCallback = callback;
                        }
                    });
                });

                it('when fired with escape keycode closes the modal', () => {
                    modal.open();

                    expect(document.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
                    const keyboardEvent = new KeyboardEvent('keydown', {code: 'Escape'});
                    keyDownEventCallback(keyboardEvent);

                    expect(modal.isOpen()).toEqual(false);
                    expect(onCloseCallbackMock).toHaveBeenCalled();

                });
                it('when fired with other than escape keycode does nothing', () => {
                    modal.open();

                    expect(document.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
                    const keyboardEvent = new KeyboardEvent('keydown', {code: 'Tab'});
                    keyDownEventCallback(keyboardEvent);

                    expect(modal.isOpen()).toEqual(true);
                    expect(onCloseCallbackMock).not.toHaveBeenCalled();

                });
            });

            describe('binds click event handler', () => {

                let clickEventCallback;

                beforeEach(() => {
                    jest.spyOn(document, 'addEventListener').mockImplementation((eventName, callback) => {
                        if (eventName === 'click') {
                            clickEventCallback = callback;
                        }
                    });
                });

                it('when fired with element inside the modal element does nothing', () => {
                    const child = document.createElement('button');
                    element.appendChild(child);

                    modal.open();

                    expect(document.addEventListener).toHaveBeenCalledWith('click', expect.any(Function), {capture: true});
                    clickEventCallback({target: child});

                    expect(modal.isOpen()).toEqual(true);
                    expect(onCloseCallbackMock).not.toHaveBeenCalled();
                });

                it('when fired with element outside the modal element closes', () => {
                    const button = document.createElement('button');
                    document.body.appendChild(button);
                    modal.open();

                    expect(document.addEventListener).toHaveBeenCalledWith('click', expect.any(Function), {capture: true});
                    clickEventCallback({target: button});

                    expect(modal.isOpen()).toEqual(false);
                    expect(onCloseCallbackMock).toHaveBeenCalled();
                });
            });
        });

        describe('without closeOnBackgroundClick', () => {
            /** @type IHModals */
            let modal;
            /** @type HTMLElement */
            let element;

            let onOpenCallbackMock, onCloseCallbackMock;

            beforeEach(() => {
                element = document.createElement('div');

                onOpenCallbackMock = jest.fn();
                onCloseCallbackMock = jest.fn();

                modal = new IHModals(element, {
                    closeOnBackgroundClick: false,
                    onOpenCallback: onOpenCallbackMock,
                    onCloseCallback: onCloseCallbackMock,
                });
            });

            describe('binds click event handler', () => {

                let clickEventCallback;

                beforeEach(() => {
                    jest.spyOn(document, 'addEventListener').mockImplementation((eventName, callback) => {
                        if (eventName === 'click') {
                            clickEventCallback = callback;
                        }
                    });
                });

                it('when fired with element inside the modal element does nothing', () => {
                    const child = document.createElement('button');
                    element.appendChild(child);

                    modal.open();

                    expect(document.addEventListener).toHaveBeenCalledWith('click', expect.any(Function), {capture: true});
                    clickEventCallback({target: child});

                    expect(modal.isOpen()).toEqual(true);
                    expect(onCloseCallbackMock).not.toHaveBeenCalled();
                });

                it('when fired with element outside the modal element prevents default', () => {
                    const button = document.createElement('button');
                    document.body.appendChild(button);
                    modal.open();

                    expect(document.addEventListener).toHaveBeenCalledWith('click', expect.any(Function), {capture: true});
                    const preventDefaultMock = jest.fn();
                    const stopPropagationMock = jest.fn();
                    clickEventCallback({target: button, preventDefault: preventDefaultMock, stopPropagation: stopPropagationMock});

                    expect(modal.isOpen()).toEqual(true);
                    expect(onCloseCallbackMock).not.toHaveBeenCalled();
                    expect(preventDefaultMock).toHaveBeenCalled();
                    expect(stopPropagationMock).toHaveBeenCalled();
                });
            });
        });
    });

    describe('#close', () => {
        it('removes open class, removes document event handlers and calls all bound callback', () => {
            jest.spyOn(document, 'removeEventListener').mockImplementation();

            const element = document.createElement('div');
            element.classList.add('mymodal');
            element.classList.add('mymodal--open');

            const onCloseCallbackMock = jest.fn();
            const onCloseCallbackMock2 = jest.fn();

            const modal = new IHModals(element, {
                closeOnBackgroundClick: false,
                className: 'mymodal--open',
                onCloseCallback: onCloseCallbackMock
            });
            modal.onClose(onCloseCallbackMock2);
            modal.close();

            expect(document.removeEventListener).toHaveBeenCalledWith('click', expect.any(Function), {capture: true});
            expect(document.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
            expect(document.removeEventListener).toHaveBeenCalledWith('focusout', expect.any(Function), {capture: true});

            expect(onCloseCallbackMock).toHaveBeenCalled();
            expect(onCloseCallbackMock2).toHaveBeenCalled();
            expect(element.classList.contains('mymodal--open')).toEqual(false);
            expect(modal.isOpen()).toEqual(false);

        });
    });

    describe('#offOpen', () => {
        it('does nothing for a callback not previously set', () => {
            const element = document.createElement('div');
            const modal = new IHModals(element);
            const callbackMock = jest.fn();
            modal.offOpen(callbackMock);
            modal.open();
            expect(callbackMock).not.toHaveBeenCalled();
        });

        it('removes set callback so that it does not fire on subsequent calls', () => {
            const element = document.createElement('div');
            const modal = new IHModals(element);
            const callbackMock = jest.fn();
            modal.onOpen(callbackMock);
            modal.open();
            expect(callbackMock).toHaveBeenCalled();
            callbackMock.mockReset();
            
            modal.offOpen(callbackMock);
            modal.open();
            expect(callbackMock).not.toHaveBeenCalled();
        });
    });

    describe('#onOpenOnce', () => {

        it('fires only on the first open', () => {
            const element = document.createElement('div');
            const modal = new IHModals(element);

            const callbackMock = jest.fn();
            modal.onOpenOnce(callbackMock);

            modal.open();

            expect(callbackMock).toHaveBeenCalled();

            callbackMock.mockReset();

            modal.open();

            expect(callbackMock).not.toHaveBeenCalled();

        });
    });
    describe('#offClose', () => {
        it('does nothing for a callback not previously set', () => {
            const element = document.createElement('div');
            const modal = new IHModals(element);
            const callbackMock = jest.fn();
            modal.offClose(callbackMock);
            modal.close();
            expect(callbackMock).not.toHaveBeenCalled();
        });

        it('removes set callback so that it does not fire on subsequent calls', () => {
            const element = document.createElement('div');
            const modal = new IHModals(element);
            const callbackMock = jest.fn();
            modal.onClose(callbackMock);
            modal.close();
            expect(callbackMock).toHaveBeenCalled();
            callbackMock.mockReset();

            modal.offClose(callbackMock);
            modal.close();
            expect(callbackMock).not.toHaveBeenCalled();
        });
    });

    describe('#onCloseOnce', () => {

        it('fires only on the first close', () => {
            const element = document.createElement('div');
            const modal = new IHModals(element);

            const callbackMock = jest.fn();
            modal.onCloseOnce(callbackMock);

            modal.close();

            expect(callbackMock).toHaveBeenCalled();

            callbackMock.mockReset();

            modal.close();

            expect(callbackMock).not.toHaveBeenCalled();

        });
    });
});