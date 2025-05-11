const doc = {
    addEventListener: function (evt, callback) {// evt type: string, callback type: function
        if (evt == 'click') {
            callback({
                target: {
                    tagName: 'BUTTON',
                    classList: {
                        contains: function (cls) {
                            return cls == 'btn-primary';
                        }
                    },
                    innerText: 'Click me'
                }
            });
        }
        if (evt == 'input') {
            callback({
                target: {
                    tagName: 'INPUT',
                    value: 'Hello World'
                }
            });
        }
        if (evt == 'change') {
            callback({
                target: {
                    tagName: 'SELECT',
                    value: 'Option 1'
                }
            });
        }
    } 
}

doc.addEventListener('click', function (event) {
    if (event.target.tagName === 'BUTTON') {
        console.log('Button clicked:', event.target.innerText);
    }
});