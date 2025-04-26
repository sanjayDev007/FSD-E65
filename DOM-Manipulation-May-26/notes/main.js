/**
 * DOM Manipulation Examples
 * This file demonstrates practical DOM manipulation techniques
 * using the helper functions from dom.js
 */

// Import the helper functions from dom.js
import { 
  createElement, 
  insertElement, 
  addEvent, 
  toggleClasses,
  domReady 
} from './dom.js';

// Wait for DOM to be fully loaded before running code
domReady(() => {
  console.log('DOM is ready! Starting DOM manipulation examples...');
  
  // Example 1: Basic element selection
  basicSelectionExamples();
  
  // Example 2: Creating and inserting elements
  elementCreationExample();
  
  // Example 3: Event handling
  eventHandlingExample();
  
  // Example 4: Styling and class manipulation
  stylingExample();
  
  // Example 5: Building a simple interactive component
  buildTodoApp();
});

// Example 1: Different ways to select DOM elements
function basicSelectionExamples() {
  console.log('--- Element Selection Examples ---');
  
  // Native DOM methods
  const byId = document.getElementById('main');
  const byClass = document.getElementsByClassName('item');
  const byTag = document.getElementsByTagName('div');
  const byQuery = document.querySelector('.container');
  const byQueryAll = document.querySelectorAll('ul li');
  
  console.log('Selection results:', {
    byId,
    byClass: Array.from(byClass),
    byTag: Array.from(byTag),
    byQuery,
    byQueryAll: Array.from(byQueryAll)
  });
  
  // DOM traversal
  if (byQuery) {
    console.log('Parent:', byQuery.parentNode);
    console.log('Children:', byQuery.children);
    console.log('First child:', byQuery.firstElementChild);
  }
}

// Example 2: Creating and inserting elements
function elementCreationExample() {
  console.log('--- Element Creation Examples ---');
  
  // Create elements using our helper function
  const card = createElement('div', {
    class: 'card',
    id: 'example-card'
  });
  
  const cardHeader = createElement('header', {
    class: 'card-header',
    text: 'DOM Manipulation Example'
  });
  
  const cardBody = createElement('div', {
    class: 'card-body',
    html: '<p>This card was created entirely with JavaScript!</p>'
  });
  
  const cardButton = createElement('button', {
    text: 'Click me!',
    attrs: {
      'data-action': 'toggle',
      'type': 'button'
    }
  });
  
  // Insert elements into DOM
  const container = document.querySelector('.container') || document.body;
  
  insertElement(card, container);
  insertElement(cardHeader, card);
  insertElement(cardBody, card);
  insertElement(cardButton, cardBody);
  
  console.log('Card created and inserted into DOM');
}

// Example 3: Event handling
function eventHandlingExample() {
  console.log('--- Event Handling Examples ---');
  
  // Find or create a button
  const button = document.querySelector('[data-action="toggle"]') || 
    (() => {
      const btn = createElement('button', {text: 'Test Button'});
      insertElement(btn, document.body);
      return btn;
    })();
  
  // Add event using our helper
  const clickHandler = addEvent(button, 'click', (event) => {
    console.log('Button clicked:', event);
    alert('Button clicked!');
    
    // Event properties examples
    console.log('Event target:', event.target);
    console.log('Event type:', event.type);
    console.log('Mouse position:', { x: event.clientX, y: event.clientY });
  });
  
  // Hover events
  addEvent(button, 'mouseenter', () => {
    button.style.backgroundColor = '#f0f0f0';
  });
  
  addEvent(button, 'mouseleave', () => {
    button.style.backgroundColor = '';
  });
  
  console.log('Events attached to button');
  
  // Form events example
  const demoForm = createElement('form', {
    id: 'demo-form',
    html: `
      <div>
        <label for="name">Name:</label>
        <input type="text" id="name" name="name">
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email">
      </div>
      <button type="submit">Submit</button>
    `
  });
  
  insertElement(demoForm, document.body);
  
  addEvent(demoForm, 'submit', (event) => {
    event.preventDefault(); // Prevent form submission
    
    const formData = new FormData(demoForm);
    console.log('Form submitted with data:', {
      name: formData.get('name'),
      email: formData.get('email')
    });
    
    alert(`Form submitted! Name: ${formData.get('name')}`);
  });
}

// Example 4: Styling and class manipulation
function stylingExample() {
  console.log('--- Styling Examples ---');
  
  // Find or create an element to style
  const styleTarget = document.querySelector('.card') || 
    (() => {
      const div = createElement('div', {class: 'style-demo', text: 'Style Me!'});
      insertElement(div, document.body);
      return div;
    })();
  
  // Direct style manipulation
  styleTarget.style.padding = '20px';
  styleTarget.style.margin = '10px';
  styleTarget.style.borderRadius = '5px';
  styleTarget.style.transition = 'all 0.3s ease';
  
  // Class manipulation with helper
  toggleClasses(styleTarget, 'highlighted');
  
  // Create style toggle button
  const toggleButton = createElement('button', {text: 'Toggle Styles'});
  insertElement(toggleButton, styleTarget, 'after');
  
  addEvent(toggleButton, 'click', () => {
    toggleClasses(styleTarget, 'highlighted', 'expanded');
    
    // Conditional styling
    if (styleTarget.classList.contains('highlighted')) {
      styleTarget.style.backgroundColor = '#ffeb3b';
      styleTarget.style.transform = 'scale(1.05)';
    } else {
      styleTarget.style.backgroundColor = '';
      styleTarget.style.transform = '';
    }
  });
  
  // Add CSS rule for our classes
  const styleEl = createElement('style', {
    html: `
      .highlighted {
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        border-left: 4px solid #2196F3;
      }
      .expanded {
        width: 100%;
        margin-bottom: 20px;
      }
      .completed {
        text-decoration: line-through;
        opacity: 0.6;
      }
    `
  });
  
  insertElement(styleEl, document.head);
}

// Example 5: Building a simple interactive component (Todo App)
function buildTodoApp() {
  console.log('--- Todo App Example ---');
  
  // Create todo container
  const todoApp = createElement('div', {
    id: 'todo-app',
    class: 'todo-container',
    html: '<h2>DOM Manipulation Todo App</h2>'
  });
  
  // Create input form
  const todoForm = createElement('form', {
    class: 'todo-form',
    html: `
      <input type="text" id="todo-input" placeholder="Add a new task...">
      <button type="submit">Add</button>
    `
  });
  
  // Create todo list
  const todoList = createElement('ul', {class: 'todo-list'});
  
  // Insert all elements
  insertElement(todoApp, document.body);
  insertElement(todoForm, todoApp);
  insertElement(todoList, todoApp);
  
  // Handle form submission
  addEvent(todoForm, 'submit', (event) => {
    event.preventDefault();
    
    const input = todoForm.querySelector('#todo-input');
    const text = input.value.trim();
    
    if (text) {
      addTodoItem(text, todoList);
      input.value = '';
      input.focus();
    }
  });
  
  // Add initial todo items
  ['Learn DOM basics', 'Practice creating elements', 'Master event handling'].forEach(text => {
    addTodoItem(text, todoList);
  });
}

// Helper function to add todo items
function addTodoItem(text, todoList) {
  // Create list item with delete button
  const todoItem = createElement('li', {class: 'todo-item'});
  
  const todoText = createElement('span', {text});
  const deleteBtn = createElement('button', {
    class: 'delete-btn',
    text: '×',
    attrs: {'aria-label': 'Delete task'}
  });
  
  insertElement(todoText, todoItem);
  insertElement(deleteBtn, todoItem);
  insertElement(todoItem, todoList);
  
  // Add event listeners
  addEvent(todoItem, 'click', (event) => {
    // Ignore clicks on the delete button
    if (event.target !== deleteBtn) {
      toggleClasses(todoItem, 'completed');
    }
  });
  
  addEvent(deleteBtn, 'click', () => {
    todoItem.remove(); // Modern API to remove element
  });
  
  return todoItem;
}

// Export functions for potential reuse
export {
  basicSelectionExamples,
  elementCreationExample,
  eventHandlingExample,
  stylingExample,
  buildTodoApp
};