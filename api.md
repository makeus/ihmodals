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
<a name="options"></a>

## options : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [className] | <code>string</code> | Classname added to the modal when opened. Defaults to `modal--open` |
| [closeOnBackgroundClick] | <code>boolean</code> | Enable closing the modal when clicking outside the modal. Defaults to true. |
| [onOpenCallback] | <code>function</code> |  |
| [onCloseCallback] | <code>function</code> |  |

