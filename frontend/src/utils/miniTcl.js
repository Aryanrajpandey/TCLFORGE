// MiniTcl — client-side TCL interpreter for TCL Forge demos
// Supports: puts, set, incr, append, expr, proc/return, if/elseif/else,
//           for, foreach, while, break/continue, string, list cmds,
//           array, regexp/regsub, format, split/join, clock, catch, info

class TclReturn  { constructor(v) { this.value = v; } }
class TclBreak   { }
class TclCont    { }
class TclErr     { constructor(m) { this.msg = String(m); } }

export class MiniTclEnv {
  constructor() {
    this._g = {};   // globals
    this._p = {};   // procs
    this._o = [];   // output lines
  }

  eval(script) {
    this._o = [];
    try {
      this._block(script, {});
    } catch (e) {
      if (e instanceof TclReturn) {
        // top-level return is fine
      } else if (e instanceof TclErr) {
        this._o.push(`Error: ${e.msg}`);
      } else if (e instanceof Error) {
        this._o.push(`Error: ${e.message}`);
      }
    }
    return this._o.join('\n');
  }

  // ── block evaluator ──────────────────────────────────────────────────────────
  _block(script, locals) {
    let last = '';
    for (const words of this._parse(script)) {
      if (!words.length) continue;
      last = this._exec(words, locals);
    }
    return last;
  }

  // ── parser: script → [[token,...], ...] ─────────────────────────────────────
  _parse(script) {
    const cmds = []; let pos = 0; const n = script.length;
    while (pos < n) {
      while (pos < n && ' \t\r\n;'.includes(script[pos])) pos++;
      if (pos >= n) break;
      // comment
      if (script[pos] === '#') { while (pos < n && script[pos] !== '\n') pos++; continue; }
      // one command
      const words = [];
      while (pos < n && script[pos] !== '\n' && script[pos] !== ';') {
        while (pos < n && ' \t'.includes(script[pos])) pos++;
        if (pos >= n || script[pos] === '\n' || script[pos] === ';') break;
        if (script[pos] === '\\' && pos + 1 < n && script[pos + 1] === '\n') { pos += 2; continue; }
        const [tok, np] = this._readWord(script, pos, n);
        words.push(tok);
        pos = np;
      }
      if (words.length) cmds.push(words);
    }
    return cmds;
  }

  _readWord(s, pos, n) {
    const ch = s[pos];
    if (ch === '{') {
      let d = 1, start = ++pos;
      while (pos < n && d) {
        if (s[pos] === '{') d++;
        else if (s[pos] === '}') { d--; if (!d) break; }
        pos++;
      }
      return [{ type: 'brace', raw: s.slice(start, pos) }, pos + 1];
    }
    if (ch === '"') {
      let v = ''; pos++;
      while (pos < n && s[pos] !== '"') {
        if (s[pos] === '\\') { v += this._esc(s[++pos] ?? ''); pos++; }
        else v += s[pos++];
      }
      return [{ type: 'str', raw: v }, pos + 1];
    }
    let v = '';
    while (pos < n && !' \t\n;'.includes(s[pos])) {
      if (s[pos] === '\\' && s[pos + 1] === '\n') { pos += 2; break; }
      v += s[pos++];
    }
    return [{ type: 'word', raw: v }, pos];
  }

  _esc(c) {
    return { n: '\n', t: '\t', r: '\r', '"': '"', '\\': '\\', '{': '{', '}': '}', '$': '$', '[': '[', ']': ']' }[c] ?? c;
  }

  // ── token expansion (variable + command substitution) ────────────────────────
  _expand(tok, locals) {
    if (tok.type === 'brace') return tok.raw;
    return this._subst(tok.raw, locals);
  }

  _subst(s, locals) {
    let r = '', i = 0;
    while (i < s.length) {
      const c = s[i];
      if (c === '$') {
        i++;
        if (s[i] === '{') {
          i++; let name = '';
          while (i < s.length && s[i] !== '}') name += s[i++];
          i++;
          r += this._getv(name, locals);
        } else if (/\w/.test(s[i])) {
          let name = '';
          while (i < s.length && /\w/.test(s[i])) name += s[i++];
          if (s[i] === '(') {
            i++; let key = '';
            while (i < s.length && s[i] !== ')') key += s[i++];
            i++;
            const k = this._subst(key, locals);
            r += locals[`${name}(${k})`] ?? this._g[`${name}(${k})`] ?? '';
          } else {
            r += this._getv(name, locals);
          }
        } else { r += '$'; }
      } else if (c === '[') {
        i++; let cmd = '', d = 1;
        while (i < s.length && d) {
          if (s[i] === '[') d++;
          else if (s[i] === ']') { if (--d === 0) { i++; break; } }
          if (d) cmd += s[i++];
        }
        r += this._block(cmd, locals);
      } else if (c === '\\') {
        r += this._esc(s[++i] ?? ''); i++;
      } else {
        r += c; i++;
      }
    }
    return r;
  }

  _getv(name, locals) {
    return name in locals ? String(locals[name]) : (name in this._g ? String(this._g[name]) : '');
  }

  _setv(name, value, locals) { locals[name] = value; }

  // ── command dispatcher ────────────────────────────────────────────────────────
  _exec(words, locals) {
    const [cmdW, ...argW] = words;
    const cmd = this._expand(cmdW, locals).trim();
    if (!cmd) return '';
    const args = argW.map(w => this._expand(w, locals));

    switch (cmd) {
      // ── I/O
      case 'puts': {
        const text = args.length >= 2 && (args[0] === 'stdout' || args[0] === 'stderr')
          ? args[1]
          : args[args.length - 1] ?? '';
        this._o.push(String(text));
        return '';
      }
      // ── Variables
      case 'set': {
        if (!args.length) return '';
        if (args.length === 1) return this._getv(args[0], locals);
        this._setv(args[0], args[1], locals);
        return args[1];
      }
      case 'unset': args.forEach(n => { delete locals[n]; delete this._g[n]; }); return '';
      case 'global': args.forEach(n => { locals[n] = this._g[n] ?? ''; }); return '';
      case 'incr': {
        const nv = String(parseInt(this._getv(args[0], locals) || '0') + parseInt(args[1] ?? '1'));
        this._setv(args[0], nv, locals);
        return nv;
      }
      case 'append': {
        const nv = this._getv(args[0], locals) + args.slice(1).join('');
        this._setv(args[0], nv, locals);
        return nv;
      }
      // ── Arithmetic
      case 'expr': {
        const raw = argW.length === 1 && argW[0].type === 'brace'
          ? this._subst(argW[0].raw, locals)
          : args.join(' ');
        return String(this._xpr(raw));
      }
      // ── Control flow
      case 'if':       return this._if(argW, locals);
      case 'while':    return this._while(argW, locals);
      case 'for':      return this._for(argW, locals);
      case 'foreach':  return this._foreach(args, locals);
      case 'break':    throw new TclBreak();
      case 'continue': throw new TclCont();
      case 'return':   throw new TclReturn(args[0] ?? '');
      case 'error':    throw new TclErr(args[0] ?? '');
      case 'catch': {
        const [body, vn] = args;
        try { const r = this._block(body, locals); if (vn) this._setv(vn, r, locals); return '0'; }
        catch (e) {
          const msg = e instanceof TclErr ? e.msg : e instanceof TclReturn ? e.value : (e?.message ?? '');
          if (vn) this._setv(vn, msg, locals);
          return '1';
        }
      }
      // ── Procs
      case 'proc': {
        const [name, paramStr, body] = args;
        this._p[name] = { params: this._lst(paramStr), body };
        return '';
      }
      // ── String
      case 'string': return this._str(args);
      // ── List
      case 'list':    return args.map(a => this._le(a)).join(' ');
      case 'llength': return String(this._lst(args[0] ?? '').length);
      case 'lindex':  return this._lst(args[0] ?? '')[args[1] === 'end' ? this._lst(args[0]).length - 1 : parseInt(args[1] ?? '0')] ?? '';
      case 'lappend': {
        const cur = this._getv(args[0], locals);
        const add = args.slice(1).map(a => this._le(a)).join(' ');
        const nv = cur ? cur + ' ' + add : add;
        this._setv(args[0], nv, locals);
        return nv;
      }
      case 'lrange': {
        const list = this._lst(args[0] ?? '');
        const fi = parseInt(args[1] ?? '0');
        const li = args[2] === 'end' ? list.length - 1 : parseInt(args[2] ?? String(list.length - 1));
        return list.slice(fi, li + 1).map(i => this._le(i)).join(' ');
      }
      case 'lsort':   return this._lsort(args);
      case 'lsearch': return String(this._lst(args[0] ?? '').indexOf(args[1] ?? ''));
      case 'lreplace': {
        const list = this._lst(args[0] ?? '');
        const fi = parseInt(args[1] ?? '0');
        const li = args[2] === 'end' ? list.length - 1 : parseInt(args[2] ?? '0');
        return [...list.slice(0, fi), ...args.slice(3), ...list.slice(li + 1)].map(i => this._le(i)).join(' ');
      }
      case 'join':    return this._lst(args[0] ?? '').join(args[1] ?? ' ');
      case 'split':   return this._split(args);
      case 'concat':  return args.join(' ');
      // ── Array
      case 'array': return this._arr(args, locals);
      // ── Regexp
      case 'regexp':  return this._regexp(argW, args, locals);
      case 'regsub':  return this._regsub(args, locals);
      // ── Misc
      case 'format':  return this._fmt(args);
      case 'info':    return this._info(args, locals);
      case 'clock':   return this._clk(args);
      case 'namespace': case 'package': case 'exit': return '';
      default:
        if (cmd in this._p) return this._call(cmd, args);
        throw new TclErr(`unknown command: "${cmd}"`);
    }
  }

  // ── expr evaluator ────────────────────────────────────────────────────────────
  _xpr(expr) {
    const e = expr.trim()
      .replace(/\beq\b/g,   '===')
      .replace(/\bne\b/g,   '!==')
      .replace(/\blt\b/g,   '<')
      .replace(/\bgt\b/g,   '>')
      .replace(/\ble\b/g,   '<=')
      .replace(/\bge\b/g,   '>=')
      .replace(/\bdouble\(/g, 'Number(')
      .replace(/\bint\(/g,    'Math.trunc(')
      .replace(/\babs\(/g,    'Math.abs(')
      .replace(/\bsqrt\(/g,   'Math.sqrt(')
      .replace(/\bround\(/g,  'Math.round(')
      .replace(/\bfloor\(/g,  'Math.floor(')
      .replace(/\bceil\(/g,   'Math.ceil(')
      .replace(/\bpow\(/g,    'Math.pow(')
      .replace(/\bexp\(/g,    'Math.exp(')
      .replace(/\bfmod\(([^,]+),([^)]+)\)/g, '($1%$2)');
    try {
      // eslint-disable-next-line no-new-func
      return Function('"use strict";return(' + e + ')')();
    } catch (err) {
      throw new TclErr(`expr error in "${expr}": ${err.message}`);
    }
  }

  // ── if/elseif/else ────────────────────────────────────────────────────────────
  _if(rawWords, locals) {
    let i = 0;
    while (i < rawWords.length) {
      const condW = rawWords[i++];
      if (i < rawWords.length && this._expand(rawWords[i], locals) === 'then') i++;
      const bodyW = rawWords[i++];
      const condStr = condW.type === 'brace'
        ? this._subst(condW.raw, locals)
        : this._expand(condW, locals);
      if (this._xpr(condStr)) return this._block(bodyW.type === 'brace' ? bodyW.raw : this._expand(bodyW, locals), locals);
      if (i < rawWords.length) {
        const kw = this._expand(rawWords[i], locals);
        if (kw === 'elseif') { i++; continue; }
        if (kw === 'else') {
          i++;
          if (i < rawWords.length) return this._block(rawWords[i].type === 'brace' ? rawWords[i].raw : this._expand(rawWords[i], locals), locals);
        }
      }
      break;
    }
    return '';
  }

  // ── while ─────────────────────────────────────────────────────────────────────
  _while(rawWords, locals) {
    const [cW, bW] = rawWords;
    for (let it = 0; it < 100_000; it++) {
      const cv = this._xpr(cW.type === 'brace' ? this._subst(cW.raw, locals) : this._expand(cW, locals));
      if (!cv) break;
      try { this._block(bW.type === 'brace' ? bW.raw : this._expand(bW, locals), locals); }
      catch (e) { if (e instanceof TclBreak) break; if (e instanceof TclCont) continue; throw e; }
    }
    return '';
  }

  // ── for ───────────────────────────────────────────────────────────────────────
  _for(rawWords, locals) {
    const [iW, cW, sW, bW] = rawWords;
    const raw = w => w.type === 'brace' ? w.raw : this._expand(w, locals);
    this._block(raw(iW), locals);
    for (let it = 0; it < 100_000; it++) {
      if (!this._xpr(this._subst(cW.type === 'brace' ? cW.raw : cW.raw, locals))) break;
      try { this._block(raw(bW), locals); }
      catch (e) {
        if (e instanceof TclBreak) break;
        if (e instanceof TclCont) { this._block(raw(sW), locals); continue; }
        throw e;
      }
      this._block(raw(sW), locals);
    }
    return '';
  }

  // ── foreach ───────────────────────────────────────────────────────────────────
  _foreach(args, locals) {
    if (args.length !== 3) return '';
    const names = this._lst(args[0]);
    const items = this._lst(args[1]);
    const body  = args[2];
    const step  = names.length || 1;
    for (let i = 0; i < items.length; i += step) {
      for (let j = 0; j < step; j++) this._setv(names[j] ?? names[0], items[i + j] ?? '', locals);
      try { this._block(body, locals); }
      catch (e) { if (e instanceof TclBreak) return ''; if (e instanceof TclCont) continue; throw e; }
    }
    return '';
  }

  // ── proc call ─────────────────────────────────────────────────────────────────
  _call(name, args) {
    const { params, body } = this._p[name];
    const frame = {};
    for (let i = 0; i < params.length; i++) {
      if (params[i] === 'args') { frame.args = args.slice(i).join(' '); break; }
      frame[params[i]] = args[i] ?? '';
    }
    try { return this._block(body, frame); }
    catch (e) { if (e instanceof TclReturn) return e.value; throw e; }
  }

  // ── string subcommands ────────────────────────────────────────────────────────
  _str(args) {
    const [sub, ...a] = args;
    switch (sub) {
      case 'length':    return String((a[0] ?? '').length);
      case 'toupper':   return (a[0] ?? '').toUpperCase();
      case 'tolower':   return (a[0] ?? '').toLowerCase();
      case 'trim':      return (a[0] ?? '').trim();
      case 'trimleft':  return (a[0] ?? '').trimStart();
      case 'trimright': return (a[0] ?? '').trimEnd();
      case 'index':     return (a[0] ?? '')[parseInt(a[1] ?? '0')] ?? '';
      case 'range': {
        const s = a[0] ?? '', fi = parseInt(a[1] ?? '0');
        const li = a[2] === 'end' ? s.length - 1 : parseInt(a[2] ?? String(s.length - 1));
        return s.slice(fi, li + 1);
      }
      case 'map': {
        const pairs = this._lst(a[0] ?? ''); let s = a[1] ?? '';
        for (let i = 0; i < pairs.length - 1; i += 2) s = s.split(pairs[i]).join(pairs[i + 1]);
        return s;
      }
      case 'match': {
        const re = (a[0] ?? '').replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.');
        return new RegExp('^' + re + '$').test(a[1] ?? '') ? '1' : '0';
      }
      case 'compare': return (a[0] ?? '') < (a[1] ?? '') ? '-1' : (a[0] ?? '') > (a[1] ?? '') ? '1' : '0';
      case 'equal':   return (a[0] ?? '') === (a[1] ?? '') ? '1' : '0';
      case 'first':   return String((a[1] ?? '').indexOf(a[0] ?? ''));
      case 'last':    return String((a[1] ?? '').lastIndexOf(a[0] ?? ''));
      case 'replace': {
        const s = a[0] ?? '', fi = parseInt(a[1] ?? '0');
        const li = a[2] === 'end' ? s.length - 1 : parseInt(a[2] ?? String(s.length - 1));
        return s.slice(0, fi) + (a[3] ?? '') + s.slice(li + 1);
      }
      case 'repeat':  return (a[0] ?? '').repeat(parseInt(a[1] ?? '1'));
      case 'reverse': return (a[0] ?? '').split('').reverse().join('');
      case 'is': {
        const checks = { integer: /^-?\d+$/, double: /^-?[\d.]+$/, alpha: /^[a-zA-Z]+$/, alnum: /^[a-zA-Z0-9]+$/, digit: /^\d+$/, space: /^\s*$/, upper: /^[A-Z]+$/, lower: /^[a-z]+$/ };
        return (checks[a[0]]?.test(a[a.length - 1]) ? '1' : '0');
      }
      default: throw new TclErr(`unknown string subcommand: ${sub}`);
    }
  }

  // ── list helpers ──────────────────────────────────────────────────────────────
  _lst(s) {
    if (!s && s !== 0) return [];
    s = String(s).trim();
    if (!s) return [];
    const items = []; let pos = 0;
    while (pos < s.length) {
      while (pos < s.length && ' \t\n\r'.includes(s[pos])) pos++;
      if (pos >= s.length) break;
      if (s[pos] === '{') {
        let d = 1, start = ++pos;
        while (pos < s.length && d) { if (s[pos] === '{') d++; else if (s[pos] === '}') { if (!--d) break; } pos++; }
        items.push(s.slice(start, pos)); pos++;
      } else if (s[pos] === '"') {
        let v = ''; pos++;
        while (pos < s.length && s[pos] !== '"') { if (s[pos] === '\\') { pos++; v += s[pos] ?? ''; } else v += s[pos]; pos++; }
        items.push(v); pos++;
      } else {
        let start = pos;
        while (pos < s.length && !' \t\n\r'.includes(s[pos])) pos++;
        items.push(s.slice(start, pos));
      }
    }
    return items;
  }

  _le(s) {
    s = String(s ?? '');
    if (!s) return '{}';
    if (/[ \t\n{}"]/.test(s)) return '{' + s + '}';
    return s;
  }

  _lsort(args) {
    let dec = false, nc = false, int = false;
    for (const a of args.slice(0, -1)) {
      if (a === '-decreasing') dec = true;
      if (a === '-nocase') nc = true;
      if (a === '-integer') int = true;
    }
    const list = this._lst(args[args.length - 1]);
    list.sort((a, b) => {
      const av = int ? parseInt(a) : nc ? a.toLowerCase() : a;
      const bv = int ? parseInt(b) : nc ? b.toLowerCase() : b;
      return av < bv ? -1 : av > bv ? 1 : 0;
    });
    if (dec) list.reverse();
    return list.map(i => this._le(i)).join(' ');
  }

  _split(args) {
    const str = args[0] ?? '', delim = args[1] ?? ' ';
    return (delim === '' ? str.split('') : str.split(delim)).map(p => this._le(p)).join(' ');
  }

  // ── array commands ────────────────────────────────────────────────────────────
  _arr(args, locals) {
    const [sub, name, ...rest] = args;
    const pfx = `${name}(`;
    const keys = () => Object.keys(locals).filter(k => k.startsWith(pfx));
    switch (sub) {
      case 'set': {
        const pairs = this._lst(rest[0] ?? '');
        for (let i = 0; i < pairs.length - 1; i += 2) this._setv(`${name}(${pairs[i]})`, pairs[i + 1], locals);
        return '';
      }
      case 'get':   return keys().map(k => this._le(k.slice(pfx.length, -1)) + ' ' + this._le(locals[k])).join(' ');
      case 'names': return keys().map(k => this._le(k.slice(pfx.length, -1))).join(' ');
      case 'unset': keys().forEach(k => delete locals[k]); return '';
      case 'size':  return String(keys().length);
      case 'exists':return keys().length ? '1' : '0';
      default: throw new TclErr(`unknown array subcommand: ${sub}`);
    }
  }

  // ── regexp ────────────────────────────────────────────────────────────────────
  _regexp(rawWords, args, locals) {
    let nc = false, i = 0;
    while (args[i]?.startsWith('-')) { if (args[i] === '-nocase') nc = true; i++; }
    const pat = args[i], str = args[i + 1] ?? '', matchVars = args.slice(i + 2);
    let re;
    try { re = new RegExp(pat, nc ? 'i' : ''); }
    catch { matchVars.forEach(v => { if (v !== '_') this._setv(v, '', locals); }); return '0'; }
    const m = str.match(re);
    if (!m) { matchVars.forEach(v => { if (v !== '_') this._setv(v, '', locals); }); return '0'; }
    matchVars.forEach((v, j) => { if (v !== '_') this._setv(v, m[j] ?? '', locals); });
    return '1';
  }

  _regsub(args, locals) {
    let nc = false, all = false, i = 0;
    while (args[i]?.startsWith('-')) { if (args[i] === '-nocase') nc = true; if (args[i] === '-all') all = true; i++; }
    const pat = args[i], str = args[i + 1] ?? '', repl = args[i + 2] ?? '', dest = args[i + 3];
    let re;
    try { re = new RegExp(pat, (nc ? 'i' : '') + (all ? 'g' : '')); }
    catch { if (dest) this._setv(dest, str, locals); return '0'; }
    const result = str.replace(re, repl);
    if (dest) this._setv(dest, result, locals);
    return result;
  }

  // ── format ────────────────────────────────────────────────────────────────────
  _fmt(args) {
    let fmt = args[0] ?? '', ai = 1;
    return fmt.replace(/%([+\-# 0]*)(\d*\.?\d*)([diouxXeEfgGs%])/g, (_, fl, w, spec) => {
      const v = args[ai++] ?? '';
      if (spec === '%') { ai--; return '%'; }
      if (spec === 'd' || spec === 'i') return String(parseInt(v) || 0);
      if (spec === 'f') { const p = parseInt(w.split('.')[1] ?? '6'); return parseFloat(v).toFixed(p); }
      if (spec === 'e') return parseFloat(v).toExponential();
      if (spec === 'g') return parseFloat(v).toPrecision(Math.max(1, parseInt(w.split('.')[1] ?? '6')));
      return String(v);
    });
  }

  // ── info ──────────────────────────────────────────────────────────────────────
  _info(args, locals) {
    const [sub, ...rest] = args;
    if (sub === 'vars')     return Object.keys(locals).filter(k => !k.includes('(')).map(k => this._le(k)).join(' ');
    if (sub === 'globals')  return Object.keys(this._g).map(k => this._le(k)).join(' ');
    if (sub === 'procs')    return Object.keys(this._p).map(k => this._le(k)).join(' ');
    if (sub === 'exists')   return (rest[0] in locals || rest[0] in this._g) ? '1' : '0';
    if (sub === 'commands') return Object.keys(this._p).join(' ');
    return '';
  }

  // ── clock ─────────────────────────────────────────────────────────────────────
  _clk(args) {
    if (args[0] === 'seconds')      return String(Math.floor(Date.now() / 1000));
    if (args[0] === 'milliseconds') return String(Date.now());
    if (args[0] === 'format')       return new Date(parseInt(args[1] ?? '0') * 1000).toLocaleString();
    return '';
  }
}
