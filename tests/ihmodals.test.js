import IHModals from "../src/ihmodals";

jest.useFakeTimers();

describe('IHModals', () => {

    beforeEach(() => {
        jest.spyOn(document, 'addEventListener').mockImplementation();
        jest.spyOn(document, 'removeEventListener').mockImplementation();
        document.addEventListener.mockReset();
        document.removeEventListener.mockReset();

        document.body.style = new CSSStyleDeclaration();
    });

    afterEach(() => {
        jest.runAllTimers();
    });

    describe('initialization', () => {

        test('sets aria-model attribute and role when not set', () => {
            const element = document.createElement('div');

            new IHModals(element);

            expect(element.hasAttribute('aria-modal')).toEqual(true);
            expect(element.getAttribute('aria-hidden')).toEqual('true');
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

            expect(element.style.display).toEqual('block');
            expect(element.classList.contains('mymodal--open')).toEqual(false);

            jest.runAllTimers();

            expect(onOpenCallbacMock).toHaveBeenCalled();
            expect(onOpenCallbacMock2).toHaveBeenCalled();
            expect(element.classList.contains('mymodal--open')).toEqual(true);
            expect(element.getAttribute('aria-hidden')).toEqual('false');
            expect(modal.isOpen()).toEqual(true);
            expect(document.body.style.overflow).toEqual('hidden');
            expect(document.body.style['touch-action']).toEqual('none');
        });

        it('when already open, does not trigger again', () => {
            const onOpenCallbacMock = jest.fn();
            const modal = new IHModals(document.createElement('div'), {onOpenCallback: onOpenCallbacMock});
            modal.open();
            jest.runAllTimers();

            expect(onOpenCallbacMock).toHaveBeenCalled();

            onOpenCallbacMock.mockReset();

            modal.open();

            expect(onOpenCallbacMock).not.toHaveBeenCalled();
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
                jest.runAllTimers();

                expect(document.activeElement === element.querySelector(expectedFocusOnSelector)).toEqual(true);
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

            describe('when fired with escape keycode', () => {

                it('and initialized with closeOnBackgroundClick true closes the modal', () => {
                    const modal = new IHModals(document.createElement('div'), {closeOnBackgroundClick: true});

                    modal.open();

                    expect(document.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function), {capture: true});
                    keyDownEventCallback(new KeyboardEvent('keydown', {code: 'Escape'}));

                    expect(modal.isOpen()).toEqual(false);
                });

                it('and initialized with closeOnBackgroundClick false does nothing', () => {
                    const modal = new IHModals(document.createElement('div'), {closeOnBackgroundClick: false});

                    modal.open();

                    expect(document.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function), {capture: true});

                    keyDownEventCallback(new KeyboardEvent('keydown', {code: 'Escape'}));

                    expect(modal.isOpen()).toEqual(true);
                });

            });


            describe('when fired with tab keycode', () => {
                it('current focus is on a element other than the last or the first focusable element, does nothing (default operation)', () => {
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
                    jest.runAllTimers();

                    expect(document.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function), {capture: true});
                    expect(document.activeElement === element.querySelector('input')).toEqual(true);

                    keyDownEventCallback(new KeyboardEvent('keydown', {code: 'Tab'}));
                    expect(document.activeElement === element.querySelector('input')).toEqual(true); // Does not change the focus
                });
                it('current focus is on the first element and shift is pressed, focus is shifted to the last child and default tab shifting is prevented', () => {
                    const element = document.createElement('div');
                    element.insertAdjacentHTML('beforeend', `
                    <form>
                        <label for="name">Name</label>
                        <input id="name" name="name" type="text">
                        <label for="email">Email</label>
                        <input id="email" name="email" type="email">
                        <button type="submit">Submit</button>
                    </form>
                `);

                    const modal = new IHModals(element);
                    modal.open();
                    jest.runAllTimers();

                    expect(document.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function), {capture: true});
                    expect(document.activeElement === element.querySelector('input[name="name"]')).toEqual(true);

                    const keyboardEvent = new KeyboardEvent('keydown', {code: 'Tab', shiftKey: true});
                    jest.spyOn(keyboardEvent, 'preventDefault').mockImplementation();
                    keyDownEventCallback(keyboardEvent);

                    expect(document.activeElement === element.querySelector('button')).toEqual(true);
                    expect(keyboardEvent.preventDefault).toHaveBeenCalled();
                });

                it('current focus is on the first element and shift is not pressed, does nothing (default operation)', () => {
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
                    jest.runAllTimers();

                    expect(document.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function), {capture: true});
                    expect(document.activeElement === element.querySelector('input')).toEqual(true);

                    const keyboardEvent = new KeyboardEvent('keydown', {code: 'Tab', shiftKey: false});
                    jest.spyOn(keyboardEvent, 'preventDefault').mockImplementation();
                    keyDownEventCallback(keyboardEvent);

                    expect(document.activeElement === element.querySelector('input')).toEqual(true);
                    expect(keyboardEvent.preventDefault).not.toHaveBeenCalled();
                });

                it('current focus is on the last element, focus is shifted to the first child and default tab shifting is prevented', () => {
                    const element = document.createElement('div');
                    element.insertAdjacentHTML('beforeend', `
                    <form>
                        <label for="name">Name</label>
                        <input id="name" name="name" type="text">
                        <label for="email">Email</label>
                        <input id="email" name="email" type="email">
                        <button type="submit">Submit</button>
                    </form>
                `);

                    const modal = new IHModals(element);
                    modal.open();
                    jest.runAllTimers();

                    expect(document.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function), {capture: true});

                    element.querySelector('button').focus();

                    expect(document.activeElement === element.querySelector('button')).toEqual(true);

                    const keyboardEvent = new KeyboardEvent('keydown', {code: 'Tab', shiftKey: false});
                    jest.spyOn(keyboardEvent, 'preventDefault').mockImplementation();
                    keyDownEventCallback(keyboardEvent);

                    expect(document.activeElement === element.querySelector('input[name="name"]')).toEqual(true);
                    expect(keyboardEvent.preventDefault).toHaveBeenCalled();
                });

                it('current focus is on the last element and shift is pressed, does nothing (default action)', () => {
                    const element = document.createElement('div');
                    element.insertAdjacentHTML('beforeend', `
                    <form>
                        <label for="name">Name</label>
                        <input id="name" name="name" type="text">
                        <label for="email">Email</label>
                        <input id="email" name="email" type="email">
                        <button type="submit">Submit</button>
                    </form>
                `);

                    const modal = new IHModals(element);
                    modal.open();
                    jest.runAllTimers();

                    expect(document.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function), {capture: true});

                    element.querySelector('button').focus();

                    expect(document.activeElement === element.querySelector('button')).toEqual(true);

                    const keyboardEvent = new KeyboardEvent('keydown', {code: 'Tab', shiftKey: true});
                    jest.spyOn(keyboardEvent, 'preventDefault').mockImplementation();
                    keyDownEventCallback(keyboardEvent);

                    expect(document.activeElement === element.querySelector('button')).toEqual(true);
                    expect(keyboardEvent.preventDefault).not.toHaveBeenCalled();
                });
            });

            it('when fired with other than escape keycode does nothing regardless if closeOnBackgroundClick is true', () => {
                const modal = new IHModals(document.createElement('div'), {closeOnBackgroundClick: true});

                modal.open();

                expect(document.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function), {capture: true});

                keyDownEventCallback(new KeyboardEvent('keydown', {code: 'KeyS'}));

                expect(modal.isOpen()).toEqual(true);
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

                it('when fired with element outside the modal element closes and stops propagation', () => {
                    const button = document.createElement('button');
                    document.body.appendChild(button);
                    modal.open();

                    expect(document.addEventListener).toHaveBeenCalledWith('click', expect.any(Function), {capture: true});
                    const preventDefaultMock = jest.fn();
                    const stopPropagationMock = jest.fn();
                    clickEventCallback({
                        target: button,
                        preventDefault: preventDefaultMock,
                        stopPropagation: stopPropagationMock
                    });
                    expect(modal.isOpen()).toEqual(false);
                    expect(onCloseCallbackMock).toHaveBeenCalled();
                    expect(preventDefaultMock).toHaveBeenCalled();
                    expect(stopPropagationMock).toHaveBeenCalled();
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
                    clickEventCallback({
                        target: button,
                        preventDefault: preventDefaultMock,
                        stopPropagation: stopPropagationMock
                    });

                    expect(modal.isOpen()).toEqual(true);
                    expect(onCloseCallbackMock).not.toHaveBeenCalled();
                    expect(preventDefaultMock).toHaveBeenCalled();
                    expect(stopPropagationMock).toHaveBeenCalled();
                });
            });
        });

        describe('with disableBackgroundListening', () => {

            it('does not bind click handler', () => {
                jest.spyOn(document, 'addEventListener');

                const element = document.createElement('div');
                const modal = new IHModals(element, {
                    disableBackgroundListening: true
                });

                const child = document.createElement('button');
                element.appendChild(child);

                modal.open();

                expect(document.addEventListener).not.toHaveBeenCalledWith('click', expect.any(Function), {capture: true});
            });
        })
    });

    describe('#close', () => {
        it('removes open class, removes document event handlers and calls all bound callback', () => {
            const element = document.createElement('div');
            element.classList.add('mymodal');

            let transitionEndCallback;
            jest.spyOn(element, 'addEventListener').mockImplementation((eventName, callback) => {
                if(eventName === 'transitionend') {
                    transitionEndCallback = callback;
                }
            });

            const onCloseCallbackMock = jest.fn();
            const onCloseCallbackMock2 = jest.fn();

            const modal = new IHModals(element, {closeOnBackgroundClick: false, className: 'mymodal--open', onCloseCallback: onCloseCallbackMock});
            modal.onClose(onCloseCallbackMock2);
            modal.open();
            modal.close();

            expect(document.removeEventListener).toHaveBeenCalledWith('click', expect.any(Function), {capture: true});
            expect(document.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function), {capture: true});

            expect(onCloseCallbackMock).toHaveBeenCalled();
            expect(onCloseCallbackMock2).toHaveBeenCalled();
            expect(element.getAttribute('aria-hidden')).toEqual('true');
            expect(modal.isOpen()).toEqual(false);

            /**
             * Handles open classname removal
             */
            expect(element.classList.contains('mymodal--open')).toEqual(false);
            expect(element.style.display).toEqual('block');
            expect(element.addEventListener).toHaveBeenCalledWith('transitionend', expect.any(Function), {once: true});
            transitionEndCallback();
            expect(element.style.display).toEqual('');
        });

        it('when already closed, does not trigger again', () => {
            const onCloseCallbackMock = jest.fn();
            const modal = new IHModals(document.createElement('div'), {onOpenCallback: onCloseCallbackMock});
            modal.open();
            modal.close();

            expect(onCloseCallbackMock).toHaveBeenCalled();

            onCloseCallbackMock.mockReset();

            modal.close();

            expect(onCloseCallbackMock).not.toHaveBeenCalled();
        });
    });

    describe('#offOpen', () => {
        it('does nothing for a callback not previously set', () => {
            const modal = new IHModals(document.createElement('div'));
            const callbackMock = jest.fn();
            modal.offOpen(callbackMock);
            modal.open();
            expect(callbackMock).not.toHaveBeenCalled();
        });

        it('removes set callback so that it does not fire on subsequent calls', () => {
            const modal = new IHModals(document.createElement('div'));
            const callbackMock = jest.fn();
            modal.onOpen(callbackMock);
            modal.open();
            expect(callbackMock).toHaveBeenCalled();
            callbackMock.mockReset();

            modal.offOpen(callbackMock);
            modal.close();
            modal.open();
            expect(callbackMock).not.toHaveBeenCalled();
        });
    });

    describe('#onOpenOnce', () => {

        it('fires only on the first open', () => {
            const modal = new IHModals(document.createElement('div'));

            const callbackMock = jest.fn();
            modal.onOpenOnce(callbackMock);

            modal.open();

            expect(callbackMock).toHaveBeenCalled();

            callbackMock.mockReset();

            modal.close();
            modal.open();

            expect(callbackMock).not.toHaveBeenCalled();

        });
    });
    describe('#offClose', () => {
        it('does nothing for a callback not previously set', () => {
            const modal = new IHModals(document.createElement('div'));
            const callbackMock = jest.fn();
            modal.offClose(callbackMock);
            modal.open();
            modal.close();
            expect(callbackMock).not.toHaveBeenCalled();
        });

        it('removes set callback so that it does not fire on subsequent calls', () => {
            const modal = new IHModals(document.createElement('div'));
            const callbackMock = jest.fn();
            modal.onClose(callbackMock);
            modal.open();
            modal.close();
            expect(callbackMock).toHaveBeenCalled();
            callbackMock.mockReset();

            modal.offClose(callbackMock);
            modal.open();
            modal.close();
            expect(callbackMock).not.toHaveBeenCalled();
        });
    });

    describe('#onCloseOnce', () => {

        it('fires only on the first close', () => {
            const modal = new IHModals(document.createElement('div'));

            const callbackMock = jest.fn();
            modal.onCloseOnce(callbackMock);
            modal.open();
            modal.close();

            expect(callbackMock).toHaveBeenCalled();

            callbackMock.mockReset();
            modal.open();
            modal.close();

            expect(callbackMock).not.toHaveBeenCalled();

        });
    });
});