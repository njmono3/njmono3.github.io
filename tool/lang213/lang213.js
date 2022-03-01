const default_command = [
    { key: "come", pattern: /`[^`]*`/, mean: "コメント" },
    { key: "pinc", pattern: '>', mean: "ポインタをインクリメント" }, { key: "pdec", pattern: '<', mean: "ポインタをデクリメント" },
    { key: "vinc", pattern: '+', mean: "ポインタが指す値をインクリメント" }, { key: "vdec", pattern: '-', mean: "ポインタが指す値をデクリメント" },
    { key: "mout", pattern: '.', mean: "ポインタが指す値を文字コードとして文字を出力" },
    { key: "sout", pattern: ',', mean: "スタックからポップして10進法の数字として出力" },
    { key: "jze", pattern: '[', mean: "ポインタが指す値が0なら対応する命令へジャンプ" }, { key: "jump", pattern: ']', mean: "対応する命令へジャンプ" },
    { key: "ipt", pattern: '#', mean: "入力から1バイト読み込んでスタックにポップ" },
    { key: "mpush", pattern: '_', mean: "ポインタが指す値をスタックにプッシュ" }, { key: "mpop", pattern: '~', mean: "スタックからポップしてポインタが指す先に代入" },
    { key: "ipush", pattern: /\d/, mean: "スタックに0-9をプッシュ" },
    { key: "sadd", pattern: '&', mean: "スタックからy,xの順にポップしてx+yをプッシュ" }, { key: "ssub", pattern: 'm', mean: "スタックからy,xの順にポップしてx-yをプッシュ" },
    { key: "smul", pattern: '*', mean: "スタックからy,xの順にポップしてx*yをプッシュ" }, { key: "sdiv", pattern: '/', mean: "スタックからy,xの順にポップしてx/y(切り捨て)をプッシュ" },
    { key: "pset", pattern: '@', mean: "ポインタを0にセット" },
    { key: "jup", pattern: '^', mean: "上の行へ" }, { key: "jdw", pattern: 'v', mean: "下の行へ" },
    { key: "jzup", pattern: 'A', mean: "スタックからポップして0なら上の行へ" }, { key: "jzdw", pattern: 'V', mean: "スタックからポップして0なら下の行へ" },
    { key: "jbeg", pattern: ';', mean: "行頭へ" },
    { key: "wpush", pattern: ':', mean: "スタックからポップした値を2回プッシュする" },
    { key: "xpop", pattern: 'X', mean: "スタックからa,bの順にポップし、a,bの順にプッシュ" },
    { key: "not", pattern: '!', mean: "スタックからポップして0なら1, それ以外なら0をプッシュする" },
    { key: "br", pattern: /\n+/, mean: "改行" }
];
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
        if (!this.s.length) return console.error("lang213 ERROR: Can't pop value from stack.") || 0;
        return this.s.pop().val;
    }
}
class Bf {
    constructor(input = "", output = str => console.log(str)) {
        this.input = input;
        this.output = output;
        this.mem = new Mem();
        this.stack = new Stack();
        this.com = default_command.reduce((acc, dc) => ({...acc, [dc.key]: dc.pattern }), {});
    }
    parser(code) {
        this.mem = new Mem();
        this.stack = new Stack();
        this.lex = [];
        let script = code;
        while (script) {
            this.lex.push(Object.values(this.com).flat().flatMap(v => eval_str(script, v, 1)).filter(_ => _).reduce((acc, v) => acc.length < v.length ? v : acc, ""));
            if (this.lex.slice(-1)[0]) {
                script = script.substring(this.lex.slice(-1)[0].length);
            } else {
                script = script.substring(1);
                this.lex.pop();
            }
        }
        this.process = [];
        this.loops = [];
        this.lpstack = [];
        this.begiline = [];
        this.loopid = 0;
        for (let i = 0; i < this.lex.length; i++) {
            multi_switch(this.lex[i])
                .case(this.com.come )(() => 1)
                .case(this.com.pinc )(() => this.process.push(() => this.mem.inc()))
                .case(this.com.pdec )(() => this.process.push(() => this.mem.dec()))
                .case(this.com.vinc )(() => this.process.push(() => this.mem.vinc()))
                .case(this.com.vdec )(() => this.process.push(() => this.mem.vdec()))
                .case(this.com.ipt  )(() => this.process.push(() => { !this.input && (this.input = window.prompt("input", "") || String.fromCharCode(0)); this.input = (this.stack.vpush(toInAte(this.input ? this.input.slice(0, 1).charCodeAt() : 0)), this.input.slice(1)); }))
                .case(this.com.mout )(() => this.process.push(() => this.output(this.mem.put())))
                .case(this.com.jze  )(() => { this.loops.push({ start: this.process.length - 1, end: 0 }); this.process.push((id => () => !this.mem.val() && (this.proc_cnt = this.loops[id].end))(this.loopid)); this.lpstack.push(this.loopid++); })
                .case(this.com.jump )(() => (id => { this.loops[id].end = this.process.length; this.process.push(() => this.proc_cnt = this.loops[id].start); })(this.lpstack.pop()))
                .case(this.com.sout )(() => this.process.push(() => this.output(this.stack.vpop())))
                .case(this.com.mpush)(() => this.process.push(() => this.stack.vpush(this.mem.val())))
                .case(this.com.mpop )(() => this.process.push(() => { this.mem.vset(); this.mem.add(this.stack.vpop()); }))
                .case(this.com.ipush)(() => this.process.push(() => this.stack.vpush(parseInt(this.lex[i], 10) || 0)))
                .case(this.com.sadd )(() => this.process.push(() => this.stack.vpush((v => (this.stack.vpop() + v) & 0xff)(this.stack.vpop()))))
                .case(this.com.ssub )(() => this.process.push(() => this.stack.vpush((v => (this.stack.vpop() - v) & 0xff)(this.stack.vpop()))))
                .case(this.com.smul )(() => this.process.push(() => this.stack.vpush((v => (this.stack.vpop() * v) & 0xff)(this.stack.vpop()))))
                .case(this.com.sdiv )(() => this.process.push(() => this.stack.vpush((v => (this.stack.vpop() / v) & 0xff)(this.stack.vpop()))))
                .case(this.com.pset )(() => this.process.push(() => this.mem.pset()))
                .case(this.com.jup  )(() => this.process.push(() => this.proc_cnt = this.begiline.reduce((acc, v, i, arr) => v - this.proc_cnt <= 0 ? arr[i - 1] || 0 : acc, this.process.length - 1 || 0)))
                .case(this.com.jdw  )(() => this.process.push(() => this.proc_cnt = this.begiline.reduce((acc, v, i, arr) => [0, ...arr][i] - this.proc_cnt <= 0 && this.proc_cnt - v < 0 ? v : acc, 0)))
                .case(this.com.jzup )(() => this.process.push(() => !this.stack.vpop() && (this.proc_cnt = this.begiline.reduce((acc, v, i, arr) => v - this.proc_cnt <= 0 ? arr[i - 1] || 0 : acc, this.process.length - 1 || 0))))
                .case(this.com.jzdw )(() => this.process.push(() => !this.stack.vpop() && (this.proc_cnt = this.begiline.reduce((acc, v, i, arr) => [0, ...arr][i] - this.proc_cnt <= 0 && this.proc_cnt - v < 0 ? v : acc, 0))))
                .case(this.com.jbeg )(() => this.process.push(() => this.proc_cnt = this.begiline.reduce((acc, v) => v - this.proc_cnt <= 0 ? v : acc, 0) - 1))
                .case(this.com.wpush)(() => this.process.push(() => this.stack.vpush(this.stack.vpush(this.stack.vpop()))))
                .case(this.com.xpop )(() => this.process.push(() => ((y, x) => (this.stack.vpush(y), this.stack.vpush(x)))(this.stack.vpop(), this.stack.vpop())))
                .case(this.com.not  )(() => this.process.push(() => this.stack.vpush(!this.stack.vpop() * 1)))
                .case(this.com.br   )(() => (this.begiline.push(i), this.process.push(() => 1), "break"));
        }
        this.proc_cnt = 0;
    }
    processAll() {
        for (; this.proc_cnt < this.process.length; this.proc_cnt++) {
            this.process[this.proc_cnt]();
        }
    }
    processOne() {
        if (this.proc_cnt < this.process.length) {
            this.process[this.proc_cnt]();
            this.proc_cnt++;
            return (this.proc_cnt < this.process.length) * 1;
        }
    }
}
/*v動作v*/
const getQueryObject = (key) => (o => key ? o[key] : o)(window.location.search.split('?').pop().split('&').reduce((acc, val) => ({ ...acc, ...(v => ({ [v[0]]: v[1] }))((val + "=").split('=')) }), {}));
document.title = decodeURIComponent(getQueryObject("name") || "lang213");
(() => {
    const write_area = document.getElementsByClassName("writeArea")[0];
    const input_area = document.getElementsByClassName("inputArea")[0];
    const log_area = document.getElementsByClassName("logArea")[0];
    const exec_btn = document.getElementsByClassName("execBtn")[0];
    const step_btn = document.getElementsByClassName("stepBtn")[0];
    const mem_stack_view = document.getElementsByClassName("mem-stack")[0];
    if (document.cookie) {
        const cookie = document.cookie.split(/; ?/).reduce((acc, v) => ({ ...acc, [v.split('=')[0]]: v.split('=')[1] }), {});
        cookie[encodeURIComponent(document.title) + "code"] && (write_area.innerHTML = decodeURIComponent(cookie[encodeURIComponent(document.title) + "code"]));
    }
    const new_command = default_command.reduce((acc, com) => ({ ...acc, [com.key]: getQueryObject(com.key) ? decodeURIComponent(getQueryObject(com.key)).split("``").map(c => c.slice(0, 2) === "`/" ? new RegExp(c.slice(2, -1)) : c) : com.pattern }), {});
    write_area.addEventListener("keydown", e => {
        if (e.keyCode === 9) {/*Tab cancel*/
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
                        } else {
                            !e.innerText && e.remove();
                            [...e.getElementsByTagName("br")].map((el, i, arr) => i !== arr.length - 1 && (el.insertAdjacentHTML("afterend", "</p><p>"), el.remove()));
                            [...e.getElementsByTagName("span"), ...e.getElementsByTagName("b"), ...e.getElementsByTagName("p")].map(el => (el.insertAdjacentText("afterend", el.innerText), el.remove()));
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
    let in_proc = 0;
    const bf = new Bf(input_area.innerText, str => (log_area.textContent += str));
    const exec_bf = (mode = 0) => {
        if (!in_proc) {
            document.cookie = encodeURIComponent(document.title) + "code=" + encodeURIComponent(write_area.innerHTML);
            log_area.innerText = "";
            bf.com = new_command;
            bf.input = input_area.innerText;
            bf.parser(write_area.innerText);
        }
        if (mode) {
            in_proc = bf.processOne();
            step_btn.title = in_proc ? "Processing" : "The process is finished.";
            mem_stack_view.innerHTML = bf.mem.m.map((m, i) => i == bf.mem.p ? "<span class=\"point-memory\">[" + m.val + "]</span>" : "[" + m.val + "]").join('') + "<br />" + '[' + bf.stack.s.map(s => s.val).join('][') + ']';
        } else {
            bf.processAll();
            step_btn.title = "The process is finished.";
            mem_stack_view.innerHTML = bf.mem.m.map((m, i) => i == bf.mem.p ? "<span class=\"point-memory\">[" + m.val + "]</span>" : "[" + m.val + "]").join('') + "<br />" + '[' + bf.stack.s.map(s => s.val).join('][') + ']';
            in_proc = 0;
        }
    };
    exec_btn.addEventListener("click", () => exec_bf(), false);
    step_btn.addEventListener("click", () => exec_bf(1), false);
    const keys = { enter: false, ctrl: false, shift: false };
    document.body.addEventListener("keydown", e => {
        keys.enter |= e.keyCode == 13;
        keys.ctrl |= e.keyCode == 17;
        keys.shift |= e.keyCode == 16;
        if (keys.enter && keys.ctrl) {
            exec_bf();
            keys.enter = keys.ctrl = false;
        }
        if (keys.enter && keys.shift) {
            e.preventDefault();
        }
    }, false);
    document.body.addEventListener("keyup", e => {
        keys.enter &= e.keyCode != 13;
        keys.ctrl &= e.keyCode != 17;
        keys.shift &= e.keyCode != 16;
    }, false);

    (config => (
        config.btn.addEventListener("click", () => config.main.style.display = config.back.style.display = "block"),
        config.back.addEventListener("click", () => config.main.style.display = config.back.style.display = "none")
    ))({
        main: document.getElementsByClassName("config")[0],
        back: document.getElementsByClassName("config-back")[0],
        btn: document.getElementsByClassName("config-btn")[0]
    });
    Object.keys(new_command).map(key => document.getElementsByClassName("command-list")[0].insertAdjacentHTML("beforeend", `<li key="${key}"><input value="${(new_command[key] !== default_command.filter(e => e.key == key)[0].pattern ? [new_command[key]].flat().map(c => c instanceof RegExp ? (c + '').replace(/\/(.+)\/.?/, '`/$1/') : c).join("``") : '')}" placeholder="${[default_command.filter(e => e.key == key)[0].pattern].flat().map(c => c instanceof RegExp ? (c + '').replace(/\/(.+)\/.?/, '`/$1/') : c).join("``")}" title="${default_command.filter(e => e.key == key)[0].mean}"/></li>`));
    (confirm =>
        confirm.onclick = () =>
            confirm.href += "?"
            + "name=" + encodeURIComponent(document.getElementById("lang-name").value)
            + ["", ...[...document.getElementsByClassName("command-list")[0].childNodes].map(li => li.firstChild.value && li.getAttribute("key") + "=" + encodeURIComponent(li.firstChild.value)).filter(_ => _)].join('&')
    )(document.getElementsByClassName("confirm")[0]);
})();