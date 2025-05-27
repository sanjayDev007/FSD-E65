const dom = {
    type: "div",
    props: {
        id: "container",
        className: "main-container",
        children: [
            {
                type: "h1",
                props: {
                    children: "Hello, Virtual DOM!"
                }
            },
            {
                type: "p",
                props: {
                    children: "This is an example of a simple DOM object."
                }
            },
            {
                type:' p',
                props: {
                    children: "Hey"
                }
            }
        ]
    }
};


<ul>
    <li>Cherry</li>
  <li>Apple</li>
  <li>Banana</li>
</ul>


console.log(dom);