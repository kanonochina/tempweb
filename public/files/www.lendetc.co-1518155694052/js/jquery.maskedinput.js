// jQuery Mask Plugin v1.13.9
// github.com/igorescobar/jQuery-Mask-Plugin
(function (a) { "function" === typeof define && define.amd ? define(["jquery"], a) : "object" === typeof exports ? module.exports = a(require("jquery")) : a(jQuery || Zepto) })(function (a) {
    var x = function (c, e, d) {
        var b = {
            invalid: [], getCaret: function () { try { var r, a = 0, e = c.get(0), f = document.selection, d = e.selectionStart; if (f && -1 === navigator.appVersion.indexOf("MSIE 10")) r = f.createRange(), r.moveStart("character", -b.val().length), a = r.text.length; else if (d || "0" === d) a = d; return a } catch (h) { } }, setCaret: function (r) {
                try {
                    if (c.is(":focus")) {
                        var b;
                        b = c.get(0).createTextRange(); b.collapse(!0); b.moveEnd("character", r); b.moveStart("character", r); b.select()
                    }
                } catch (a) { }
            }, events: function () {
                c.on("keydown.mask", function (b) { c.data("mask-keycode", b.keyCode || b.which) }).on(a.jMaskGlobals.useInput ? "input.mask" : "keyup.mask", b.behaviour).on("paste.mask drop.mask", function () { setTimeout(function () { c.keydown().keyup() }, 100) }).on("change.mask", function () { c.data("changed", !0) }).on("blur.mask", function () {
                    n === b.val() || c.data("changed") || c.trigger("change"); c.data("changed",
                    !1)
                }).on("blur.mask", function () { n = b.val() }).on("focus.mask", function (b) { !0 === d.selectOnFocus && a(b.target).select() }).on("focusout.mask", function () { d.clearIfNotMatch && !k.test(b.val()) && b.val("") })
            }, getRegexMask: function () {
                for (var b = [], c, a, f, d, h = 0; h < e.length; h++) (c = g.translation[e.charAt(h)]) ? (a = c.pattern.toString().replace(/.{1}$|^.{1}/g, ""), f = c.optional, (c = c.recursive) ? (b.push(e.charAt(h)), d = { digit: e.charAt(h), pattern: a }) : b.push(f || c ? a + "?" : a)) : b.push(e.charAt(h).replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
                b = b.join(""); d && (b = b.replace(new RegExp("(" + d.digit + "(.*" + d.digit + ")?)"), "($1)?").replace(new RegExp(d.digit, "g"), d.pattern)); return new RegExp(b)
            }, destroyEvents: function () { c.off("input keydown keyup paste drop blur focusout ".split(" ").join(".mask ")) }, val: function (b) { var a = c.is("input") ? "val" : "text"; if (0 < arguments.length) { if (c[a]() !== b) c[a](b); a = c } else a = c[a](); return a }, getMCharsBeforeCount: function (b, c) { for (var a = 0, d = 0, l = e.length; d < l && d < b; d++) g.translation[e.charAt(d)] || (b = c ? b + 1 : b, a++); return a },
            caretPos: function (c, a, d, f) { return g.translation[e.charAt(Math.min(c - 1, e.length - 1))] ? Math.min(c + d - a - f, d) : b.caretPos(c + 1, a, d, f) }, behaviour: function (d) { d = d || window.event; b.invalid = []; var e = c.data("mask-keycode"); if (-1 === a.inArray(e, g.byPassKeys)) { var p = b.getCaret(), f = b.val().length, l = b.getMasked(), h = l.length, n = b.getMCharsBeforeCount(h - 1) - b.getMCharsBeforeCount(f - 1), m = p < f; b.val(l); m && (8 !== e && 46 !== e && (p = b.caretPos(p, f, h, n)), b.setCaret(p)); return b.callbacks(d) } }, getMasked: function (c) {
                var a = [], p = b.val(),
                f = 0, l = e.length, h = 0, n = p.length, m = 1, k = "push", t = -1, s, v; d.reverse ? (k = "unshift", m = -1, s = 0, f = l - 1, h = n - 1, v = function () { return -1 < f && -1 < h }) : (s = l - 1, v = function () { return f < l && h < n }); for (; v() ;) { var w = e.charAt(f), u = p.charAt(h), q = g.translation[w]; if (q) u.match(q.pattern) ? (a[k](u), q.recursive && (-1 === t ? t = f : f === s && (f = t - m), s === t && (f -= m)), f += m) : q.optional ? (f += m, h -= m) : q.fallback ? (a[k](q.fallback), f += m, h -= m) : b.invalid.push({ p: h, v: u, e: q.pattern }), h += m; else { if (!c) a[k](w); u === w && (h += m); f += m } } c = e.charAt(s); l !== n + 1 || g.translation[c] ||
                a.push(c); return a.join("")
            }, callbacks: function (a) { var g = b.val(), k = g !== n, f = [g, a, c, d], l = function (b, c, a) { "function" === typeof d[b] && c && d[b].apply(this, a) }; l("onChange", !0 === k, f); l("onKeyPress", !0 === k, f); l("onComplete", g.length === e.length, f); l("onInvalid", 0 < b.invalid.length, [g, a, c, b.invalid, d]) }
        }; c = a(c); var g = this, n = b.val(), k; e = "function" === typeof e ? e(b.val(), void 0, c, d) : e; g.mask = e; g.options = d; g.remove = function () {
            var a = b.getCaret(); b.destroyEvents(); b.val(g.getCleanVal()); b.setCaret(a - b.getMCharsBeforeCount(a));
            return c
        }; g.getCleanVal = function () { return b.getMasked(!0) }; g.init = function (e) {
            e = e || !1; d = d || {}; g.clearIfNotMatch = a.jMaskGlobals.clearIfNotMatch; g.byPassKeys = a.jMaskGlobals.byPassKeys; g.translation = a.extend({}, a.jMaskGlobals.translation, d.translation); g = a.extend(!0, {}, g, d); k = b.getRegexMask(); !1 === e ? (d.placeholder && c.attr("placeholder", d.placeholder), c.data("mask") && c.attr("autocomplete", "off"), b.destroyEvents(), b.events(), e = b.getCaret(), b.val(b.getMasked()), b.setCaret(e + b.getMCharsBeforeCount(e, !0))) :
            (b.events(), b.val(b.getMasked()))
        }; g.init(!c.is("input"))
    }; a.maskWatchers = {}; var z = function () { var c = a(this), e = {}, d = c.attr("data-mask"); c.attr("data-mask-reverse") && (e.reverse = !0); c.attr("data-mask-clearifnotmatch") && (e.clearIfNotMatch = !0); "true" === c.attr("data-mask-selectonfocus") && (e.selectOnFocus = !0); if (y(c, d, e)) return c.data("mask", new x(this, d, e)) }, y = function (c, e, d) {
        d = d || {}; var b = a(c).data("mask"), g = JSON.stringify; c = a(c).val() || a(c).text(); try {
            return "function" === typeof e && (e = e(c)), "object" !==
            typeof b || g(b.options) !== g(d) || b.mask !== e
        } catch (k) { }
    }; a.fn.mask = function (c, e) { e = e || {}; var d = this.selector, b = a.jMaskGlobals, g = b.watchInterval, b = e.watchInputs || b.watchInputs, k = function () { if (y(this, c, e)) return a(this).data("mask", new x(this, c, e)) }; a(this).each(k); d && "" !== d && b && (clearInterval(a.maskWatchers[d]), a.maskWatchers[d] = setInterval(function () { a(document).find(d).each(k) }, g)); return this }; a.fn.unmask = function () {
        clearInterval(a.maskWatchers[this.selector]); delete a.maskWatchers[this.selector];
        return this.each(function () { var c = a(this).data("mask"); c && c.remove().removeData("mask") })
    }; a.fn.cleanVal = function () { return this.data("mask").getCleanVal() }; a.applyDataMask = function (c) { c = c || a.jMaskGlobals.maskElements; (c instanceof a ? c : a(c)).filter(a.jMaskGlobals.dataMaskAttr).each(z) }; var k = {
        maskElements: "input,td,span,div", dataMaskAttr: "*[data-mask]", dataMask: !0, watchInterval: 300, watchInputs: !0, useInput: function (a) {
            var e = document.createElement("div"), d; a = "on" + a; d = a in e; d || (e.setAttribute(a, "return;"),
            d = "function" === typeof e[a]); return d
        }("input"), watchDataMask: !1, byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91], translation: { 0: { pattern: /\d/ }, 9: { pattern: /\d/, optional: !0 }, "#": { pattern: /\d/, recursive: !0 }, A: { pattern: /[a-zA-Z0-9]/ }, S: { pattern: /[a-zA-Z]/ } }
    }; a.jMaskGlobals = a.jMaskGlobals || {}; k = a.jMaskGlobals = a.extend(!0, {}, k, a.jMaskGlobals); k.dataMask && a.applyDataMask(); setInterval(function () { a.jMaskGlobals.watchDataMask && a.applyDataMask() }, k.watchInterval)
});
