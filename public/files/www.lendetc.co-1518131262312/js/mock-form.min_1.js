$(function (n, e) { function t(e) { n(a.mockForm).toggleClass(f.loading, e) } function o(e) { n(a.mockForm).toggle(e) } function m(e) { n(a.form).find(a.leadType).val(e) } function c() { if ("" !== s.requestedAmount && n(a.step1).length) { var e = Number(s.requestedAmount) > 1e3 ? 19 : 9, t = n(a.step1).find("input[value=" + s.requestedAmount + "]").siblings("span").html().match(d.minValue); n('input[name="MinLoanAmount"]').val(t[0]), m(e) } } function i() { var e = n(a.mockFormSelect).val(), t = Number(e) > 1e3 ? 19 : 9; n(a.mainFormSelect).val(e), m(t) } function u() { "" !== s.requestedAmount && (n(a.step1).find("input[value=" + s.requestedAmount + "]").attr("checked", !0), c()) } function r() { var e = setInterval(function () { n(a.initButtons).length && (clearInterval(e), t(!1), o(!1), n(a.mockFormSelect).length ? i() : u(), n(a.mainForm).show()) }, 100) } function l() { n(a.mockFormBtn).length && n(a.mockFormBtn).on("click", function () { t(!0), s.requestedAmount = n(this).find("[name=RequestedAmount]").val(), r() }), n(a.mockFormSelect).length && (n(a.mockFormSelect).on("change", function () { t(!0), r() }), n(a.mockFormContinueBtn).on("click", function () { t(!0), r() })) } var a = { mockForm: ".mock-form", mainForm: ".main-form", form: ".b2cform", step1: ".b2cform .b2c-step1", leadType: "#leadtypeid", mockFormBtn: ".mock-form label", mockFormContinueBtn: ".mock-form .mock-b2c-btn", mockFormSelect: '.mock-form select[name="RequestedAmount"]', mainFormSelect: '.main-form select[name="RequestedAmount"]', initButtons: ".b2c-btn,.b2c-btn-verify,.b2c-btn-submit" }, f = { loading: "loading" }, s = { requestedAmount: "" }, d = { minValue: /\d+/i }; l(), r() }(this.jQuery));