/**
 * DOM (Document Object Model) Tutorial
 * 
 * The DOM is a programming interface for web documents. It represents the page
 * so that programs can change the document structure, style, and content.
 * The DOM represents the document as nodes and objects; this way, programming
 * languages like JavaScript can interact with the page.
 */

// DOM Methods Reference
const DOMReference = {
  // Element Selection
  selectionMethods: {
    getElementById: "document.getElementById('elementId')", 
    querySelector: "document.querySelector('.class, #id, tag')",
    querySelectorAll: "document.querySelectorAll('.class, #id, tag')",
    getElementsByClassName: "document.getElementsByClassName('className')",
    getElementsByTagName: "document.getElementsByTagName('tagName')"
  },
  
  // Element Manipulation
  manipulationMethods: {
    createNode: "document.createElement('element')",
    appendNode: "parent.appendChild(element)",
    removeNode: "parent.removeChild(element)",
    replaceNode: "parent.replaceChild(newElement, oldElement)",
    insertBefore: "parent.insertBefore(newElement, referenceElement)",
    cloneNode: "element.cloneNode(true/false)",
    textContent: "element.textContent = 'new text'",
    innerHTML: "element.innerHTML = '<p>New HTML</p>'"
  },
  
  // Element Attributes
  attributeMethods: {
    getAttribute: "element.getAttribute('attr')",
    setAttribute: "element.setAttribute('attr', 'value')",
    removeAttribute: "element.removeAttribute('attr')",
    hasAttribute: "element.hasAttribute('attr')",
    dataset: "element.dataset.customName = 'value'"
  },
  
  // CSS & Styling
  stylingMethods: {
    style: "element.style.property = 'value'",
    className: "element.className = 'class1 class2'",
    classList: {
      add: "element.classList.add('className')",
      remove: "element.classList.remove('className')",
      toggle: "element.classList.toggle('className')",
      contains: "element.classList.contains('className')"
    },
    getComputedStyle: "window.getComputedStyle(element)"
  },
  
  // Events
  eventMethods: {
    addEventListener: "element.addEventListener('event', handlerFunction)",
    removeEventListener: "element.removeEventListener('event', handlerFunction)",
    preventDefault: "event.preventDefault()",
    stopPropagation: "event.stopPropagation()"
  },
  
  // Navigation
  navigationProperties: {
    parentNode: "element.parentNode",
    childNodes: "element.childNodes",
    firstChild: "element.firstChild",
    lastChild: "element.lastChild",
    nextSibling: "element.nextSibling",
    previousSibling: "element.previousSibling",
    children: "element.children",
    firstElementChild: "element.firstElementChild",
    lastElementChild: "element.lastElementChild"
  }
};

/**
 * DOM Manipulation Helper Functions
 * These functions simplify common DOM operations
 */
 
// Create and return a new element with optional class, id, and content
function createElement(tag, options = {}) {
  const element = document.createElement(tag);
  
  if (options.class) element.className = options.class;
  if (options.id) element.id = options.id;
  if (options.text) element.textContent = options.text;
  if (options.html) element.innerHTML = options.html;
  if (options.attrs) {
    Object.entries(options.attrs).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  
  return element;
}

// Insert element at specific positions
function insertElement(element, target, position = 'append') {
  switch(position) {
    case 'append': 
      target.appendChild(element);
      break;
    case 'prepend':
      target.insertBefore(element, target.firstChild);
      break;
    case 'before':
      target.parentNode.insertBefore(element, target);
      break;
    case 'after':
      target.parentNode.insertBefore(element, target.nextSibling);
      break;
    case 'replace':
      target.parentNode.replaceChild(element, target);
      break;
    default:
      target.appendChild(element);
  }
  return element;
}

// Add event listeners with optional options
function addEvent(element, event, callback, options = false) {
  element.addEventListener(event, callback, options);
  return { 
    remove: () => element.removeEventListener(event, callback, options) 
  };
}

// Toggle classes on element
function toggleClasses(element, ...classNames) {
  classNames.forEach(className => element.classList.toggle(className));
  return element;
}

// DOM Ready function (modern alternative to $(document).ready())
function domReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

// Example usage - export useful functions for use in code.js
export {
  createElement,
  insertElement,
  addEvent,
  toggleClasses,
  domReady
};