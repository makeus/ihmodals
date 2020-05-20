## Classes

<dl>
<dt><a href="#IHModals">IHModals</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#options">options</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="IHModals"></a>

## IHModals
**Kind**: global class  

* [IHModals](#IHModals)
    * [new IHModals(element, options)](#new_IHModals_new)
    * [.open()](#IHModals+open)
    * [.close()](#IHModals+close)
    * [.isOpen()](#IHModals+isOpen) ⇒ <code>boolean</code>
    * [.onOpen(callback)](#IHModals+onOpen)
    * [.offOpen(callback)](#IHModals+offOpen)
    * [.onOpenOnce(callback)](#IHModals+onOpenOnce)
    * [.onClose(callback)](#IHModals+onClose)
    * [.offClose(callback)](#IHModals+offClose)
    * [.onCloseOnce(callback)](#IHModals+onCloseOnce)

<a name="new_IHModals_new"></a>

### new IHModals(element, options)

| Param | Type |
| --- | --- |
| element | <code>HTMLElement</code> | 
| options | [<code>options</code>](#options) | 

<a name="IHModals+open"></a>

### ihModals.open()
Opens the modal

**Kind**: instance method of [<code>IHModals</code>](#IHModals)  
<a name="IHModals+close"></a>

### ihModals.close()
Closes the modal

**Kind**: instance method of [<code>IHModals</code>](#IHModals)  
<a name="IHModals+isOpen"></a>

### ihModals.isOpen() ⇒ <code>boolean</code>
Current modal status

**Kind**: instance method of [<code>IHModals</code>](#IHModals)  
<a name="IHModals+onOpen"></a>

### ihModals.onOpen(callback)
Fired when the modal opens

**Kind**: instance method of [<code>IHModals</code>](#IHModals)  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 

<a name="IHModals+offOpen"></a>

### ihModals.offOpen(callback)
Removes previously bound open callback

**Kind**: instance method of [<code>IHModals</code>](#IHModals)  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 

<a name="IHModals+onOpenOnce"></a>

### ihModals.onOpenOnce(callback)
Fired when the modal opens, but only once.

**Kind**: instance method of [<code>IHModals</code>](#IHModals)  

| Param |
| --- |
| callback | 

<a name="IHModals+onClose"></a>

### ihModals.onClose(callback)
Fired when the modal closes

**Kind**: instance method of [<code>IHModals</code>](#IHModals)  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 

<a name="IHModals+offClose"></a>

### ihModals.offClose(callback)
Removes previously bound close callback

**Kind**: instance method of [<code>IHModals</code>](#IHModals)  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 

<a name="IHModals+onCloseOnce"></a>

### ihModals.onCloseOnce(callback)
Fired when the modal closes, but only once.

**Kind**: instance method of [<code>IHModals</code>](#IHModals)  

| Param | Type |
| --- | --- |
| callback | <code>function</code> | 

<a name="options"></a>

## options : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [className] | <code>string</code> | Classname added to the modal when opened. Defaults to `modal--open` |
| [closeOnBackgroundClick] | <code>boolean</code> | Enable closing the modal when clicking outside the modal. Defaults to true. |
| [disableBackgroundListening] | <code>boolean</code> | Disabled listening of any background clicks. Used in special cases where you dont wan't the modal service interfering with the background. |
| [onOpenCallback] | <code>function</code> |  |
| [onCloseCallback] | <code>function</code> |  |

