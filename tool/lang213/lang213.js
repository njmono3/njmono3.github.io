const default_command = ['>', '<', '+', '-', '#', '.', '[', ']', ',', '_', '~', /\d/, '&', 'm', '*', '/', '@', '^', 'v', 'A', 'V', ';', '!', /\n+/];
const st_reg = (reg, mode) => new RegExp(reg.toString().replace(/^\/\^?/, mode % 2 ? "^" : "").replace(/\/.?$/, mode > 1 ? "$" : ""), 'g');
const eval_str = (str, eval, mode) => {
    if (typeof eval === "string" && eval === str.substr(0, eval.length)) return [eval];
    if (eval instanceof RegExp) return str.match(st_reg(eval, mode));
    return null;
};
const multi_switch = value => {
    const gen_case = (cancel) => eval => func => {
        if (!cancel && [eval].flat().flatMap(e => eval_str(value, e, 3)).filter(_ => _).length) {
            if (typeof func === "function") func();
            return {
                case: gen_case(1),
                default: gen_case(1)(value)
            };
        }
        return {
            case: gen_case(cancel),
            default: gen_case(cancel)(value)
        };
    };
    return {
        case: gen_case(0),
        default: gen_case(0)(value)
    };
};
const toInAte = d => parseInt((v => v.substr(0, v.length % 8 || 8))(d.toString(2)), 2);//•¶ŽšŽæ“¾Žž‚Éæ“ª‚©‚ç‚ÌƒoƒCƒg‚ÌŽæ“¾‚ª‚µ‚½‚¢
class Byte {
    constructor(val = 0) {
        this.val = val;
    }
    inc() {
        return (this.val = ++this.val & 0xff);
    }
    dec() {
        return (this.val = --this.val & 0xff);
    }
    add(val) {
        return [...Array(val).keys()].map(_ => this.inc()).length;
    }
    sub(val) {
        return [...Array(val).keys()].map(_ => this.dec()).length;
    }
    reset() {
        return (this.val = 0);
    }
}
class Mem {
    constructor() {
        this.m = [new Byte(0)];
        this.p = 0;
    }
    inc() {
        this.p++;
        if (this.m.length <= this.p) {
            this.m.push(new Byte(0));
        }
    }
    dec() {
        this.p--;
        if (this.p < 0) {
            alert("pointer error");
            this.p++;
        }
    }
    vinc() {
        this.m[this.p].inc();
    }
    vdec() {
        this.m[this.p].dec();
    }
    put() {
        return String.fromCharCode(this.m[this.p].val);
    }
    get(str) {
        this.m[this.p].val = toInAte(str ? str.slice(0, 1).charCodeAt() : 0);
        return str.slice(1);
    }
    val() {
        return this.m[this.p].val;
    }
    add(val) {
        return [...Array(val).keys()].map(_ => this.vinc()).length;
    }
    sub(val) {
        return [...Array(val).keys()].map(_ => this.vdec()).length;
    }
    vadd(val) {
        return this.m[this.p].add(val);
    }
    vsub(val) {
        return this.m[this.p].sub(val);
    }
    pset() {
        return (this.p = 0);
    }
    vset() {
        return this.m[this.p].reset();
    }
}
class Stack {
    constructor() {
        this.s = [];
    }
    vpush(val) {
        this.s.push(new Byte(val));
        return val;
    }
    vpop() {
        if (!this.s.length) return console.error("Can't pop value from stack.") || 0;
        return this.s.pop().val;
    }
}
class Bf {
    constructor(input = "", output = str => console.log(str)) {
        this.input = input;
        this.output = output;
        this.mem = new Mem();
        this.stack = new Stack();
        this.com = default_command.concat();
    }
    parser(code) {
        this.mem = new Mem();
        this.stack = new Stack();
        let script = code;
        const lex = [];
        while (script) {
            lex.push(this.com.flat().flatMap(v => eval_str(script, v, 1)).filter(_ => _).reduce((acc, v) => acc.length < v.length ? v : acc, ""));
            if (lex.slice(-1)[0]) {
                script = script.substring(lex.slice(-1)[0].length);
            } else {
                script = script.substring(1);
                lex.pop();
            }
        }
        this.process = [];
        this.loops = [];
        this.lpstack = [];
        this.begiline = [];
        this.loopid = 0;
        let counter = 0;
        for (let i = 0; i < lex.length; i++) {
            multi_switch(lex[i])
                .case(this.com[0])(() => this.process.push(() => this.mem.inc()))
                .case(this.com[1])(() => this.process.push(() => this.mem.dec()))
                .case(this.com[2])(() => this.process.push(() => this.mem.vinc()))
                .case(this.com[3])(() => this.process.push(() => this.mem.vdec()))
                .case(this.com[4])(() => this.process.push(() => { !this.input && (this.input = window.prompt("input", "")); this.input = this.mem.get(this.input); }))
                .case(this.com[5])(() => this.process.push(() => this.output(this.mem.put())))
                .case(this.com[6])(() => { this.loops.push({ start: this.process.length - 1, end: 0 }); this.process.push((id => () => !this.mem.val() && (counter = this.loops[id].end))(this.loopid)); this.lpstack.push(this.loopid++); })
                .case(this.com[7])(() => (id => { this.loops[id].end = this.process.length; this.process.push(() => counter = this.loops[id].start); })(this.lpstack.pop()))
                .case(this.com[8])(() => this.process.push(() => this.output(this.stack.vpop()) ))
                .case(this.com[9])(() => this.process.push(() => this.stack.vpush(this.mem.val())))
                .case(this.com[10])(() => this.process.push(() => { this.mem.vset(); this.mem.add(this.stack.vpop()); }))
                .case(this.com[11])(() => this.process.push(() => this.stack.vpush(parseInt(lex[i], 10) || 0)))
                .case(this.com[12])(() => this.process.push(() => this.stack.vpush((v => (this.stack.vpop() + v) & 0xff)(this.stack.vpop()))))
                .case(this.com[13])(() => this.process.push(() => this.stack.vpush((v => (this.stack.vpop() - v) & 0xff)(this.stack.vpop()))))
                .case(this.com[14])(() => this.process.push(() => this.stack.vpush((v => (this.stack.vpop() * v) & 0xff)(this.stack.vpop()))))
                .case(this.com[15])(() => this.process.push(() => this.stack.vpush((v => (this.stack.vpop() / v) & 0xff)(this.stack.vpop()))))
                .case(this.com[16])(() => this.process.push(() => this.mem.pset()))
                .case(this.com[17])(() => this.process.push(() => counter = this.begiline.reduce((acc, v, i, arr) => v - counter <= 0 ? arr[i - 1] || 0 : acc, this.process.length - 1 || 0) ))
                .case(this.com[18])(() => this.process.push(() => counter = this.begiline.reduce((acc, v, i, arr) => [0, ...arr][i] - counter <= 0 && counter - v < 0 ? v : acc, 0) ))
                .case(this.com[19])(() => this.process.push(() => !this.mem.val() && (counter = this.begiline.reduce((acc, v, i, arr) => v - counter <= 0 ? arr[i - 1] || 0 : acc, this.process.length - 1 || 0))))
                .case(this.com[20])(() => this.process.push(() => !this.mem.val() && (counter = this.begiline.reduce((acc, v, i, arr) => [0, ...arr][i] - counter <= 0 && counter - v < 0 ? v : acc, 0))))
                .case(this.com[21])(() => this.process.push(() => counter = this.begiline.reduce((acc, v) => v - counter <= 0 ? v : acc, 0)))
                .case(this.com[22])(() => this.process.push(() => (this.mem.m[this.mem.p].val = !this.mem.val() * 1)))
                .case(this.com[23])(() => (this.begiline.push(i), this.process.push(() => { }), "break"));
        }
        for (counter = 0; counter < this.process.length; counter++) {
            this.process[counter]();
        }
    }
}
const getQueryObject = (key) => (o => key ? o[key] : o)(window.location.search.split('?').pop().split('&').reduce((acc, val) => ({ ...acc, ...(v => ({ [v[0]]: v[1] }))((val + "=").split('=')) }), {}));
document.title = decodeURIComponent(getQueryObject("name") || "lang213");
(() => {
    const write_area = document.getElementsByClassName("writeArea")[0];
    const input_area = document.getElementsByClassName("inputArea")[0];
    const log_area = document.getElementsByClassName("logArea")[0];
    const exec_btn = document.getElementsByClassName("execBtn")[0];
    const mem_stack_view = document.getElementsByClassName("mem-stack")[0];
    if (document.cookie) {
        const cookie = document.cookie.split(/; ?/).reduce((acc, v) => ({ ...acc, [v.split('=')[0]]: v.split('=')[1] }), {});
        cookie.code && (write_area.innerHTML = decodeURIComponent(cookie.code));
    }
    const new_command = default_command.map((com, i) => getQueryObject(i.toString()) ? decodeURIComponent(getQueryObject(i.toString())).split("``").map(c => c.slice(0, 2) === "`/" ? new RegExp(c.slice(2, -1)) : c) : com);
    write_area.addEventListener("keydown", e => {
        if (e.keyCode === 9) {
            e.preventDefault();
        }
        if (e.keyCode < 37 || 40 < e.keyCode) {
            const obs_child = new MutationObserver(() => {
                obs_child.disconnect();
                const focus_node = (e => e.tagName ? e : e.parentNode)(window.getSelection().focusNode);
                [...write_area.childNodes]
                    .map(e => {
                        if (e.tagName !== "P") {
                            write_area.appendChild((p => { p.innerText = e.tagName ? e.innerText : e.data; return p })(document.createElement("p")));
                            e.remove();
                        }
                    });
                if (focus_node) {
                    focus_node.focus();
                }
                if (!write_area.childNodes.length) write_area.appendChild((e => e.appendChild(document.createElement("br")) && e)(document.createElement("p")));
            });
            obs_child.observe(write_area, { childList: true });
            setTimeout(() => obs_child.disconnect(), 1000);
        }
        return;
    }, false);
    const exec_bf = () => {
        document.cookie = "code=" + encodeURIComponent(write_area.innerHTML);
        const bf = new Bf(input_area.innerText, str => (log_area.textContent += str));
        log_area.innerText = "";
        bf.com = new_command;
        bf.parser(write_area.innerText);
        mem_stack_view.innerHTML = bf.mem.m.map((m, i) => i == bf.mem.p ? "<span class=\"point-memory\">[" + m.val + "]</span>" : "[" + m.val + "]").join('') + "<br />" + '[' + bf.stack.s.map(s => s.val).join('][') + ']';
    };
    exec_btn.addEventListener("click", exec_bf, false);
    const ctrl_enter = [false, false];
    document.body.addEventListener("keydown", e => {
        e.keyCode == 13 ? ctrl_enter[0] = true : e.keyCode == 17 ? ctrl_enter[1] = true : -1;
        if (ctrl_enter[0] && ctrl_enter[1]) {
            exec_bf();
            ctrl_enter[0] = ctrl_enter[1] = false;
        }
    }, false);
    document.body.addEventListener("keyup", e => {
        e.keyCode == 13 ? ctrl_enter[0] = false : e.keyCode == 17 ? ctrl_enter[1] = false : -1;
    }, false);

    (config => (
        config.btn.addEventListener("click", () => config.main.style.display = config.back.style.display = "block"),
        config.back.addEventListener("click", () => config.main.style.display = config.back.style.display = "none")
    ))({
        main: document.getElementsByClassName("config")[0],
        back: document.getElementsByClassName("config-back")[0],
        btn: document.getElementsByClassName("config-btn")[0]
    });
    new_command.map((com, i) => document.getElementsByClassName("command-list")[0].insertAdjacentHTML("beforeend", "<li><input value=\"" + (com !== default_command[i] ? [com].flat().map(c => c instanceof RegExp ? (c + '').replace(/\/(.+)\/.?/, '`/$1/') : c).join("``") : '') + "\" placeholder=\"" + [default_command[i]].flat().map(c => c instanceof RegExp ? (c + '').replace(/\/(.+)\/.?/, '`/$1/') : c).join("``") + "\"/></li>"));
    (confirm =>
        confirm.onclick = () =>
            confirm.href += "?"
            + "name=" + encodeURIComponent(document.getElementById("lang-name").value)
            + ["", ...[...document.getElementsByClassName("command-list")[0].childNodes].map((li, i) => li.firstChild.value && i + "=" + encodeURIComponent(li.firstChild.value)).filter(_=>_)].join('&')
    )(document.getElementsByClassName("confirm")[0]);
})();