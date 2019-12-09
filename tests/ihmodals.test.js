import IHModals from "../src/ihmodals.es";

describe('IHModals', () => {

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

        it('sets open class, triggers bound callbacks', () => {
            const element = document.createElement('div');
            element.classList.add('mymodal');

            const onOpenCallbacMock = jest.fn();
            const modal = new IHModals(element, {
                closeOnBackgroundClick: false,
                className: 'mymodal--open',
                onOpenCallback: onOpenCallbacMock
            });
            modal.open();

            expect(onOpenCallbacMock).toHaveBeenCalled();
            expect(element.classList.contains('mymodal--open')).toEqual(true);
            expect(modal.isOpen()).toEqual(true);
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
                    jest.spyOn(document, 'removeEventListener').mockImplementation();
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
                    jest.spyOn(document, 'removeEventListener').mockImplementation();
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

                    expect(document.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
                    clickEventCallback({target: child});

                    expect(modal.isOpen()).toEqual(true);
                    expect(onCloseCallbackMock).not.toHaveBeenCalled();
                });

                it('when fired with element outside the modal element does nothing', () => {
                    const button = document.createElement('button');
                    document.body.appendChild(button);
                    modal.open();

                    expect(document.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
                    clickEventCallback({target: button});

                    expect(modal.isOpen()).toEqual(false);
                    expect(onCloseCallbackMock).toHaveBeenCalled();
                });
            });

        });

    });

    describe('#close', () => {
        it('removes open class, removes document event handlers and calls binded callback', () => {
            jest.spyOn(document, 'removeEventListener').mockImplementation();

            const element = document.createElement('div');
            element.classList.add('mymodal');
            element.classList.add('mymodal--open');

            const onCloseCallbackMock = jest.fn();
            const modal = new IHModals(element, {
                closeOnBackgroundClick: false,
                className: 'mymodal--open',
                onCloseCallback: onCloseCallbackMock
            });
            modal.close();

            expect(document.removeEventListener).toHaveBeenCalledWith('click', expect.any(Function));
            expect(document.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));

            expect(onCloseCallbackMock).toHaveBeenCalled();
            expect(element.classList.contains('mymodal--open')).toEqual(false);
            expect(modal.isOpen()).toEqual(false);

        });
    });

});