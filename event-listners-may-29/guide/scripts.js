/**
 * DOM Event Listeners Tutorial
 * This script provides interactive examples for the tutorial
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all example demos
    initializeMouseEvents();
    initializeKeyboardEvents();
    initializeFormEvents();
    initializeWindowEvents();
    initializeEventPropagationDemo();
    initializeEventExplorer();
    initializePracticalExamples();
    initializePerformanceDemo();
});

// Mouse Events Examples
function initializeMouseEvents() {
    // Click example
    const clickDemo = document.querySelector('#click-example .interactive-demo');
    const clickOutput = document.querySelector('#click-example .event-output');
    
    clickDemo.addEventListener('click', function(event) {
        clickOutput.textContent = `Clicked at: (${event.clientX}, ${event.clientY})`;
        animateElement(clickOutput);
    });
    
    // Double-click example
    const dblClickDemo = document.querySelector('#dblclick-example .interactive-demo');
    const dblClickOutput = document.querySelector('#dblclick-example .event-output');
    
    dblClickDemo.addEventListener('dblclick', function() {
        dblClickOutput.textContent = 'Double-clicked!';
        animateElement(dblClickOutput);
    });
    
    // MouseEnter example
    const mouseEnterDemo = document.querySelector('#mouseenter-example .interactive-demo');
    const mouseEnterOutput = document.querySelector('#mouseenter-example .event-output');
    
    mouseEnterDemo.addEventListener('mouseenter', function() {
        mouseEnterDemo.style.backgroundColor = '#3498db';
        mouseEnterDemo.style.color = 'white';
        mouseEnterOutput.textContent = 'Mouse entered!';
        animateElement(mouseEnterOutput);
    });
    
    // MouseLeave example
    const mouseLeaveDemo = document.querySelector('#mouseleave-example .interactive-demo');
    const mouseLeaveOutput = document.querySelector('#mouseleave-example .event-output');
    
    mouseLeaveDemo.addEventListener('mouseenter', function() {
        mouseLeaveDemo.style.backgroundColor = '#3498db';
        mouseLeaveDemo.style.color = 'white';
    });
    
    mouseLeaveDemo.addEventListener('mouseleave', function() {
        mouseLeaveDemo.style.backgroundColor = '';
        mouseLeaveDemo.style.color = '';
        mouseLeaveOutput.textContent = 'Mouse left!';
        animateElement(mouseLeaveOutput);
    });
}

// Keyboard Events Examples
function initializeKeyboardEvents() {
    // Keydown example
    const keydownInput = document.querySelector('#keydown-example .interactive-demo');
    const keydownOutput = document.querySelector('#keydown-example .event-output');
    
    keydownInput.addEventListener('keydown', function(event) {
        keydownOutput.textContent = `Key Down: ${event.key} (Code: ${event.code})`;
        animateElement(keydownOutput);
    });
    
    // Keyup example
    const keyupInput = document.querySelector('#keyup-example .interactive-demo');
    const keyupOutput = document.querySelector('#keyup-example .event-output');
    
    keyupInput.addEventListener('keyup', function(event) {
        keyupOutput.textContent = `Key Up: ${event.key} (Code: ${event.code})`;
        animateElement(keyupOutput);
    });
}

// Form Events Examples
function initializeFormEvents() {
    // Submit example
    const submitForm = document.querySelector('#submit-example .interactive-demo');
    const submitOutput = document.querySelector('#submit-example .event-output');
    
    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const input = submitForm.querySelector('input');
        submitOutput.textContent = `Form submitted with value: ${input.value || '(empty)'}`;
        animateElement(submitOutput);
    });
    
    // Change example
    const changeSelect = document.querySelector('#change-example .interactive-demo');
    const changeOutput = document.querySelector('#change-example .event-output');
    
    changeSelect.addEventListener('change', function(event) {
        changeOutput.textContent = `Selected option: ${event.target.value || 'No selection'}`;
        animateElement(changeOutput);
    });
}

// Window Events Examples
function initializeWindowEvents() {
    // Resize example
    const resizeDemo = document.querySelector('#resize-example .interactive-demo');
    const resizeOutput = document.querySelector('#resize-example .event-output');
    
    let resizeTimeout;
    window.addEventListener('resize', function() {
        // Debounce the resize event
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            resizeOutput.textContent = `Window size: ${window.innerWidth}px × ${window.innerHeight}px`;
            animateElement(resizeOutput);
            // Update the demo text
            resizeDemo.textContent = `Current window size: ${window.innerWidth}px × ${window.innerHeight}px`;
        }, 100);
    });
    
    // Trigger once to set initial values
    resizeOutput.textContent = `Window size: ${window.innerWidth}px × ${window.innerHeight}px`;
    resizeDemo.textContent = `Current window size: ${window.innerWidth}px × ${window.innerHeight}px`;
}

// Event Propagation Demo
function initializeEventPropagationDemo() {
    const outer = document.getElementById('outer');
    const middle = document.getElementById('middle');
    const inner = document.getElementById('inner');
    const button = document.getElementById('event-button');
    const logContainer = document.getElementById('propagation-log');
    const useCaptureCheckbox = document.getElementById('use-capture');
    const resetButton = document.getElementById('reset-demo');
    
    // Function to log events
    function logEvent(phase, elementId, eventPhase) {
        const log = document.createElement('div');
        let phaseText;
        
        switch(eventPhase) {
            case Event.CAPTURING_PHASE:
                phaseText = "Capture";
                break;
            case Event.AT_TARGET:
                phaseText = "Target";
                break;
            case Event.BUBBLING_PHASE:
                phaseText = "Bubble";
                break;
            default:
                phaseText = "Unknown";
        }
        
        log.textContent = `${phaseText} phase: ${elementId} ${phase}`;
        
        // Color coding
        if(eventPhase === Event.CAPTURING_PHASE) {
            log.style.color = '#3498db';
        } else if(eventPhase === Event.BUBBLING_PHASE) {
            log.style.color = '#e74c3c';
        } else {
            log.style.color = '#2ecc71';
        }
        
        logContainer.appendChild(log);
        logContainer.scrollTop = logContainer.scrollHeight;
    }
    
    // Reset demo
    function resetDemo() {
        // Clear log
        logContainer.innerHTML = '';
        
        // Remove all event listeners
        outer.removeEventListener('click', outerHandler, true);
        middle.removeEventListener('click', middleHandler, true);
        inner.removeEventListener('click', innerHandler, true);
        button.removeEventListener('click', buttonHandler, true);
        
        outer.removeEventListener('click', outerHandler, false);
        middle.removeEventListener('click', middleHandler, false);
        inner.removeEventListener('click', innerHandler, false);
        button.removeEventListener('click', buttonHandler, false);
        
        // Re-attach with current useCapture setting
        const useCapture = useCaptureCheckbox.checked;
        
        // Add event listeners based on current capture setting
        outer.addEventListener('click', outerHandler, useCapture);
        middle.addEventListener('click', middleHandler, useCapture);
        inner.addEventListener('click', innerHandler, useCapture);
        button.addEventListener('click', buttonHandler, useCapture);
        
        // Add complementary phase listeners to show both
        outer.addEventListener('click', outerHandler, !useCapture);
        middle.addEventListener('click', middleHandler, !useCapture);
        inner.addEventListener('click', innerHandler, !useCapture);
        button.addEventListener('click', buttonHandler, !useCapture);
        
        logContainer.innerHTML = `<div>Demo reset. Click events will ${useCapture ? 'use capture phase' : 'use bubble phase'} first.</div>`;
    }
    
    // Event handlers
    function outerHandler(event) {
        logEvent('clicked', 'OUTER', event.eventPhase);
    }
    
    function middleHandler(event) {
        logEvent('clicked', 'MIDDLE', event.eventPhase);
    }
    
    function innerHandler(event) {
        logEvent('clicked', 'INNER', event.eventPhase);
    }
    
    function buttonHandler(event) {
        logEvent('clicked', 'BUTTON', event.eventPhase);
        // event.stopPropagation(); // Uncomment to stop propagation
    }
    
    // Initialize demo
    resetButton.addEventListener('click', resetDemo);
    useCaptureCheckbox.addEventListener('change', resetDemo);
    resetDemo(); // Set up initial state
}

// Event Explorer
function initializeEventExplorer() {
    const explorerArea = document.getElementById('event-explorer-area');
    const output = document.getElementById('event-explorer-output');
    
    // Track multiple event types
    const eventTypes = [
        'click', 'dblclick', 'mousedown', 'mouseup', 'mousemove',
        'keydown', 'keyup', 'focus', 'blur'
    ];
    
    eventTypes.forEach(type => {
        explorerArea.addEventListener(type, function(event) {
            // Create output for the specific event type
            let properties = [];
            
            // Common properties
            properties.push(`Type: ${event.type}`);
            properties.push(`Time: ${new Date(event.timeStamp).toISOString().split('T')[1].slice(0, -1)}`);
            
            // Type-specific properties
            if (event.type.startsWith('mouse') || event.type === 'click' || event.type === 'dblclick') {
                properties.push(`Position: (${event.clientX}, ${event.clientY})`);
                properties.push(`Button: ${event.button}`);
            } else if (event.type.startsWith('key')) {
                properties.push(`Key: ${event.key}`);
                properties.push(`Code: ${event.code}`);
                properties.push(`Modifiers: ${event.ctrlKey ? 'Ctrl ' : ''}${event.shiftKey ? 'Shift ' : ''}${event.altKey ? 'Alt ' : ''}${event.metaKey ? 'Meta' : ''}`);
            }
            
            // Create and append output element
            const eventInfo = document.createElement('div');
            eventInfo.textContent = properties.join(' | ');
            eventInfo.style.borderBottom = '1px solid #ddd';
            eventInfo.style.padding = '5px 0';
            
            output.prepend(eventInfo);
            
            // Limit the number of events shown
            if (output.children.length > 10) {
                output.lastChild.remove();
            }
        });
    });
    
    // Focus the area on page load to make keyboard events work
    explorerArea.setAttribute('tabindex', '0');
    explorerArea.focus();
}

// Practical Examples
function initializePracticalExamples() {
    // Image Gallery with Event Delegation
    const gallery = document.getElementById('image-gallery');
    const preview = document.getElementById('gallery-preview');
    
    if (gallery && preview) {
        gallery.addEventListener('click', function(event) {
            // Check if clicked element is an image
            if (event.target.tagName === 'IMG') {
                preview.innerHTML = '';
                // Create a larger preview
                const largeImage = document.createElement('img');
                largeImage.src = event.target.src.replace('200/200', '400/400');
                preview.appendChild(largeImage);
            }
        });
    }
    
    // Drag and Drop Example
    const draggable = document.getElementById('draggable-1');
    const dropZone = document.getElementById('drop-zone-1');
    
    if (draggable && dropZone) {
        draggable.addEventListener('dragstart', function(event) {
            event.dataTransfer.setData('text/plain', event.target.id);
            event.target.classList.add('dragging');
        });
        
        draggable.addEventListener('dragend', function(event) {
            event.target.classList.remove('dragging');
        });
        
        dropZone.addEventListener('dragover', function(event) {
            event.preventDefault(); // Allow drop
            event.target.classList.add('dragover');
        });
        
        dropZone.addEventListener('dragleave', function(event) {
            event.target.classList.remove('dragover');
        });
        
        dropZone.addEventListener('drop', function(event) {
            event.preventDefault();
            event.target.classList.remove('dragover');
            const id = event.dataTransfer.getData('text/plain');
            const draggable = document.getElementById(id);
            
            // If the draggable was already moved to the drop zone, don't append again
            if (event.target.contains(draggable)) return;
            
            event.target.appendChild(draggable);
        });
    }
}

// Performance Demo (Debounce & Throttle)
function initializePerformanceDemo() {
    // Get elements
    const normalInput = document.getElementById('normal-input');
    const debouncedInput = document.getElementById('debounced-input');
    const throttledInput = document.getElementById('throttled-input');
    
    const normalCount = document.getElementById('normal-count');
    const debouncedCount = document.getElementById('debounced-count');
    const throttledCount = document.getElementById('throttled-count');
    
    // Initialize counters
    let normalEvents = 0;
    let debouncedEvents = 0;
    let throttledEvents = 0;
    
    // Normal handler
    function normalHandler() {
        normalEvents++;
        normalCount.textContent = normalEvents;
    }
    
    // Debounce function
    function debounce(func, delay) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }
    
    // Throttle function
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const context = this;
            const args = arguments;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Create handlers
    const debouncedHandler = debounce(function() {
        debouncedEvents++;
        debouncedCount.textContent = debouncedEvents;
    }, 300);
    
    const throttledHandler = throttle(function() {
        throttledEvents++;
        throttledCount.textContent = throttledEvents;
    }, 300);
    
    // Attach event listeners
    normalInput.addEventListener('input', normalHandler);
    debouncedInput.addEventListener('input', debouncedHandler);
    throttledInput.addEventListener('input', throttledHandler);
}

// Helper function to animate elements
function animateElement(element) {
    element.style.animation = 'none';
    void element.offsetWidth; // Trigger reflow
    element.style.animation = 'highlight 0.5s';
}

// Add highlight animation to the stylesheet
(function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes highlight {
            0% { background-color: rgba(231, 76, 60, 0.5); }
            100% { background-color: transparent; }
        }
    `;
    document.head.appendChild(style);
})();
