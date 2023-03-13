String.prototype.extSelector = function () {
    return ({
        tag: this.replace(/(\.|#).+/, ""),
        attr: {
            ...(~this.indexOf("#") ? { id: this.match(/(?<=#)[^.#]+/g) } : {}),
            ...(~this.indexOf(".") ? { class: (this.match(/(?<=\.)[^.#]+/g) || []).join(" ") } : {})
        }
    })
}
let El;
El = function (selector, ...others) {
    return {
        type: "ElObject",
        children: (others.length) ? [others.pop()].flat() : [],
        e: {
            tag: (sel = selector.extSelector()).tag || "div",
            attr: {
                ...sel.attr,
                ...((others.length) ? others.pop() : {})
            },
            style: (others.length) ? others.pop() : {},
            inText: (others.length) ? others.pop() : "",
            listener: []
        },
        gen: function () {
            const element = document.createElement(this.e.tag);
            if (this.e.inText) element.innerText = this.e.inText;
            Object.keys(this.e.style).map(key => element.style[key] = this.e.style[key]);
            Object.keys(this.e.attr).map(key => element.setAttribute(key, this.e.attr[key]));
            this.e.listener.map(l => element.addEventListener(l.type, l.listener, l.options));
            this.children.map(child =>
                child.type === "ElObject" ? element.appendChild(child.node) :
                    child instanceof Element ? element.appendChild(child) :
                        typeof child === "string" ? element.insertAdjacentHTML("beforeend", child) : -1);
            return element
        },
        get node() {
            return this.gen();
        },
        attr: function (attr) {
            Object.keys(attr).map(at => this.e.attr[at] = attr[at]);
            return this;
        },
        style: function (style) {
            Object.keys(style).map(st => this.e.style[st] = style[st]);
            return this;
        },
        class: function (class_name) {
            return this.attr({ class: class_name });
        },
        addEL: function (type, listener, options = false) {
            this.e.listener.push({ type: type, listener: listener, options: options });
            return this;
        }
    };
}
El.appendChildren = function (element, children) {
    [children].flat().map(child =>
        child.type === "ElObject" ? element.appendChild(child.node) :
            child instanceof Element ? element.appendChild(child) :
                typeof child === "string" ? element.insertAdjacentHTML("beforeend", child) : -1);
    return;
}
Node.prototype.get = function (query, all) {
    return all ? [...this.querySelectorAll(query)] : this.querySelectorAll(query)[0];
}