frappe.ui.form.on("ToDo", {
    refresh: function(frm) {
        frm.add_custom_button(__("Check IBAN"), function() {
		    // checkiban();
            console.log(getBIC('AT74123456789'));
	    });
    }
});

function checkiban() {
    getJSON('/files/CH.json',
    function(err, data) {
      if (err !== null) {
        alert('Something went wrong: ' + err);
      } else {
        alert('Your query count: ' + data.toSource());
      }
    });
}

/**
 * getBIC Return a Bic(SWIFT) code from Iban
 *
 * @param iban     The IBAN account.
 * @return         The Bic(SWIFT) Code
 */
function getBIC(iban) {
console.log("Get BIC from IBAN: " + iban);
    if (validateIBAN(iban)) {
        var country = iban.substring(0, 2);
        var bankCode = iban.substring(4, 8).replace(/^0+/, '');
console.log("Load file: " + '/files/' + country + '.json');
        getJSON('/files/' + country + '.json',
          function(err, banks) {
            if (err !== null) {
              alert('Something went wrong: ' + err);
              return item == undefined ? "" : item.swift_code.concat("XXXXXXXXXXX").substring(0,11);
            } else {
              // alert('Your query count: ' + banks.toSource());
console.log("Banks: " + banks.toSource());
console.log("BankCode: " + bankCode);
              var item = banks.list.find((d) => {
                  return d.id === bankCode
              });
            }
          });
    } else {
        return "";
    }
}

/**
 * mod97 function for large numbers
 *
 * @param str     The number as a string.
 * @return        The number mod 97.
 */
function _txtMod97(str) {
    var res = 0;
    for (var i = 0; i < str.length; i++) {
        res = (res * 10 + parseInt(str[i], 10)) % 97;
    }
    return res;
}

/**
 * Checks if an IBAN is valid (no country specific checks are done).
 *
 * @param iban        The IBAN to check.
 * @return            True, if the IBAN is valid.
 */
function validateIBAN(iban) {
    var ibrev = iban.substr(4) + iban.substr(0, 4);
    return _txtMod97(_replaceChars(ibrev)) == 1;
}

/**
 * Replace letters with numbers using the SEPA scheme A=10, B=11, ...
 * Non-alphanumerical characters are dropped.
 *
 * @param str     The alphanumerical input string
 * @return        The input string with letters replaced
 */
function _replaceChars(str) {
    var res = ""
    for (var i = 0; i < str.length; i++) {
        var cc = str.charCodeAt(i);
        if (cc >= 65 && cc <= 90) {
            res += (cc - 55).toString();
        } else if (cc >= 97 && cc <= 122) {
            res += (cc - 87).toString();
        } else if (cc >= 48 && cc <= 57) {
            res += str[i]
        }
    }
    return res;
}
function getJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};