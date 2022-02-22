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
const toInAte = d => parseInt((v => v.substr(0, v.length % 8 || 8))(d.toString(2)), 2);//文字取得時に先頭からのバイトの取得がしたい
class Byte {
    constructor() {
        this.val = 0;
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
        this.m = [new Byte()];
        this.p = 0;
    }
    inc() {
        this.p++;
        if (this.m.length <= this.p) {
            this.m.push(new Byte());
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
        return [...Array(val).keys()].map(_ => this.inc()).length;
    }
    sub(val) {
        return [...Array(val).keys()].map(_ => this.dec()).length;
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
class Bf {
    constructor(input = "", output = str => console.log(str)) {
        this.input = input;
        this.output = output;
        this.mem = new Mem();
        this.com = ['>', '<', '+', '-', ',', '.', '[', ']'];
    }
    parser(code) {
        this.larr = [];
        this.lp = 0;
        this.lcnt = 0;
        this.mem = new Mem();
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
        for (let i = 0; i < lex.length;) {
            i = this.evalLex(lex[i], i);
        }
    }
    evalLex(lex, cursor) {
        let i = cursor;
        multi_switch(lex)
            .case(this.com[0])(() => this.mem.inc())
            .case(this.com[1])(() => this.mem.dec())
            .case(this.com[2])(() => this.mem.vinc())
            .case(this.com[3])(() => this.mem.vdec())
            .case(this.com[4])(() => {
                if (!this.input) this.input = window.prompt("input", "");
                this.input = this.mem.get(this.input);
            })
            .case(this.com[5])(() => this.output(this.mem.put()))
            .case(this.com[6])(() => {
                if (!this.mem.val()) {
                    i++;
                    this.lcnt++;
                    for (; this.lcnt !== 0; i++) {
                        if (lex === '[') this.lcnt++;
                        if (lex === ']') this.lcnt--;
                    }
                    i--;
                } else {
                    this.larr[this.lp] = i;
                    this.lp++;
                }
            })
            .case(this.com[7])(() => {
                if (!this.mem.val()) {
                    this.lp--;
                } else {
                    i = this.larr[this.lp - 1];
                }
            });
        return ++i;
    }

}
(() => {
    const write_area = document.getElementsByClassName("writeArea")[0];
    const input_area = document.getElementsByClassName("inputArea")[0];
    const log_area = document.getElementsByClassName("logArea")[0];
    const exec_btn = document.getElementsByClassName("execBtn")[0];
    if (document.cookie) {
        const cookie = document.cookie.split(/; ?/).reduce((acc, v) => ({ ...acc, [v.split('=')[0]]: v.split('=')[1] }), {});
        cookie.code && (write_area.innerHTML = decodeURIComponent(cookie.code));
    }
    write_area.addEventListener("keydown", e => {
        if (e.keyCode === 9) {
            e.preventDefault();
        }
        if (e.keyCode < 37 || 40 < e.keyCode) {
            const obs_child = new MutationObserver(() => {
                obs_child.disconnect();
                const focus_node = (e => e.tagName ? e : e.parentNode)(window.getSelection().focusNode);
                console.log(focus_node);
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
        const bf = new Bf(input_area.innerText, str => (log_area.innerText += str));
        log_area.innerText = "";
        bf.parser(write_area.innerText);
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
})();
