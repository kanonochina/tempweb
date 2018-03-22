$(function () {
	var ddlStates = $('#ddlStates');
	var ratesAndFeesContainer = $('#ratesAndFeesContainer');

	ddlStates.change(function (e) {
		var stateId = e.target.value;
		if (!stateId) {
			return;
		}

		var request = $.ajax({
			url: getRatesAndFeesAction,
			type: 'POST',
			success: onRatesAndFeesSuccess,
			traditional: true,
			data: { 'stateId': stateId },
			dataType: 'json',
			cache: false
		});

		request.fail(function (jqXHR, textStatus) {
			writeToConsole('An error occurred during getting info for state: ' + textStatus + ', ' + jqXHR.status + ' ' + jqXHR.statusText);
		});
	});

	function onRatesAndFeesSuccess(ratesData) {
		if (!ratesData) {
			writeToConsole('Cannot get info for state.');
			setVisibility(ratesAndFeesContainer, false);
			return;
		}

		bindRatesAndFees(ratesData);
		setVisibility(ratesAndFeesContainer, true);
	}

	function bindRatesAndFees(ratesData) {
		bindElementValue('maxPayDayLoanTerm', ratesData.MaxPayDayLoanTerm);
		bindElementValue('maxFinanceChargesAndFees', ratesData.MaxFinanceChargesAndFees);
		bindElementValue('maxLoanAmount', ratesData.MaxLoanAmount);
		bindElementValue('numberOfRollovers', ratesData.NumberOfRollovers);
		bindElementValue('outstandingLoansAllowedAtOnce', ratesData.OutstandingLoansAllowedAtOnce);
		bindElementValue('coolOffPeriod', ratesData.CoolOffPeriod);
		bindElementValue('paymentPlan', ratesData.PaymentPlan);
		bindElementValue('collectionFees', ratesData.CollectionFees);
		bindElementValue('presentmentLimit', ratesData.PresentmentLimit);
		bindElementValue('privateRightOfAction', ratesData.PrivateRightOfAction);
		bindElementValue('militaryProtection', ratesData.MilitaryProtection);
		bindElementValue('penalties', ratesData.Penalties);
	}

	function bindElementValue(elemtnId, value) {
		$('#' + elemtnId).html(value);
	}

	function setVisibility(element, isVisible) {
		element.css('display', isVisible ? 'block' : 'none');
	}

	function writeToConsole(message) {
		if (typeof console == "undefined") {
			return;
		}

		console.log(message);
	}
});