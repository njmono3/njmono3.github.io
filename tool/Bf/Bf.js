const st_reg = (reg, mode) => new RegExp(reg.toString().replace(/^\/\^?/, mode % 2 ? "^" : "").replace(/\/.?$/, mode > 1 ? "$" : ""), 'g');
const eval_str = (str, eval, mode) => {
    if (typeof eval === "string" && eval === str.substr(0, eval.length)) return [eval];
    if (eval instanceof RegExp) return str.match(st_reg(eval, mode));
    return null;
};
const multi_switch = value => {
    const gen_case = (cancel) => eval => func => {
        if (!cancel && eval_str(value, eval, 3)) {
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
const toInAte = d => parseInt((d).toString(2).slice(-8), 2);//•¶ŽšŽæ“¾Žž‚Éæ“ª‚©‚ç‚ÌƒoƒCƒg‚ÌŽæ“¾‚ª‚µ‚½‚¢
class Byte {
    constructor() {
        this.val = 0;
    }
    inc() {
        return (this.val = toInAte(this.val + 1));
    }
    dec() {
        return (this.val = toInAte(this.val + 511));
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
    reset() {
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
    }
    parser(code) {
        let larr = [];
        let lp = 0;
        let lcnt = 0;
        this.mem = new Mem();
        let script = code;
        const commands = ['>', '<', '+', /-(?!\d)/, ',', '.', '[', ']', /@\d+/, /@-\d+/, /\d+/, /-\d+/, '@', '%'];
        const lex = [];
        while (script) {
            lex.push(commands.flat().flatMap(v => eval_str(script, v, 1)).filter(_ => _).reduce((acc, v) => acc.length < v.length ? v : acc, ""));
            if (lex.slice(-1)[0]) {
                script = script.substring(lex.slice(-1)[0].length);
            } else {
                script = script.substring(1);
                lex.pop();
            }
        }
        for (let i = 0; i < lex.length; i++) {
            multi_switch(lex[i])
                .case(commands[0])(() => this.mem.inc())
                .case(commands[1])(() => this.mem.dec())
                .case(commands[2])(() => this.mem.vinc())
                .case(commands[3])(() => this.mem.vdec())
                .case(commands[4])(() => {
                    if (!this.input) this.input = window.prompt("input", "");
                    this.input = this.mem.get(this.input);
                })
                .case(commands[5])(() => this.output(this.mem.put()))
                .case(commands[6])(() => {
                    if (this.mem.val() === 0) {
                        i++;
                        lcnt++;
                        for (; lcnt !== 0; i++) {
                            if (lex[i] === '[') lcnt++;
                            if (lex[i] === ']') lcnt--;
                        }
                        i--;
                    } else {
                        larr[lp] = i;
                        lp++;
                    }
                })
                .case(commands[7])(() => {
                    if (this.mem.val() === 0) {
                        lp--;
                    } else {
                        i = larr[lp - 1];
                    }
                })
                .case(commands[8])(() => this.mem.add(parseInt(lex[i].slice(1)) || 0))
                .case(commands[9])(() => this.mem.sub(Math.abs(parseInt(lex[i].slice(1))) || 0))
                .case(commands[10])(() => this.mem.vadd(parseInt(lex[i]) || 0))
                .case(commands[11])(() => this.mem.vsub(Math.abs(parseInt(lex[i])) || 0))
                .case(commands[12])(() => this.mem.reset())
                .case(commands[13])(() => this.mem.vset());
        }
    }

}
(() => {
    const write_area = document.getElementsByClassName("writeArea")[0];
    const input_area = document.getElementsByClassName("inputArea")[0];
    const log_area = document.getElementsByClassName("logArea")[0];
    const exec_btn = document.getElementsByClassName("execBtn")[0];
    write_area.addEventListener("keydown", e => {
        if (e.keyCode === 9) {
            e.preventDefault();
        }
        return;
    }, false);
    const exec_bf = () => {
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