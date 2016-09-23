//validatie
var oFouten = {
    required: {
        msg: " is een verplicht veld",
        test: function (elem) {
            return elem.value != "";
        }
    },
    aantal: {
        msg: " verwacht een getal",
        test: function (elem) {
            //aantal test enkel de inhoud als getal als er een inhoud is
            if (elem.value != "") {
                return !isNaN(elem.value) && elem.value > 0;
            } else { return true; }
        }
    }
}

var groenteOptions = [
      ["aardappelen", 0.95, "kg"],
      ["avocado", 2.69, "stuk"],
      ["bloemkool", 1.93, "stuk"],
      ["brocoli", 1.29, "stuk"],
      ["champignons", 0.89, "250g"],
      ["chinese kool", 1.59, "stuk"],
      ["groene kool", 1.69, "stuk"],
      ["knolselder", 1.29, "stuk"],
      ["komkommer", 2.49, "stuk"],
      ["kropsla", 1.69, "stuk"],
      ["paprika", 0.89, "net"],
      ["prei", 2.99, "bundel"],
      ["princessenbonen", 1, "250g"],
      ["rapen", 0.99, "bundel"],
      ["rode kool", 1.39, "stuk"],
      ["sla iceberg", 1.49, "stuk"],
      ["spinazie vers", 1.89, "300g"],
      ["sjalot", 0.99, "500g"],
      ["spruiten", 1.86, "kg"],
      ["trostomaat", 2.99, "500g"],
      ["ui", 0.89, "kg"],
      ["witloof 1ste keus", 1.49, "700g"],
      ["wortelen", 2.59, "kg"],
      ["courgetten", 1.5, "stuk"]
];

//==========window onload==================================================

window.onload = function () {
    //noscript verbergen
    var eNoScript = document.getElementById('noscript');
    eNoScript.style.display = "none";
    //DOM referenties
    eWinkel = document.getElementById('winkel');
    eGroente = document.getElementById('groente');
    eAantal = document.getElementById('aantal');
    eToevoegen = document.getElementById('toevoegen');
    eFrmBestel = document.getElementById('frmBestel');


    //Select lijsten opvullen
    var winkelOptions = [
        { naam: "de fruitmand", adres: "steenstraat 34", post: 8000, gemeente: "Brugge", tel: "050342218", manager: "Francine Lapoule" },
        { naam: "Jos & Anneke", adres: "visserijstraat 1", post: 8400, gemeente: "Oostende", tel: "059463689", manager: "Jos Leman" },
        { naam: "groene vingers", adres: "hoogstraat 108", post: 9000, gemeente: "Gent", tel: "091342218" },
        { naam: "de buurtwinkel", adres: "die laene 22", post: 2000, gemeente: "Antwerpen", tel: "0230342218", manager: "Bert Simoens" }
    ];

    for (var i = 0, l = winkelOptions.length; i < l; i++) {
        var option = winkelOptions[i];
        var eOption = new Option(option.naam, option.value, option.selected);
        eOption.setAttribute("title", option.adres);
        eWinkel.options.add(eOption);
    }

  

    for (var i = 0, l = groenteOptions.length; i < l; i++) {
        var option = groenteOptions[i];
        var eOption = new Option(option[0] + " (" + option[1] + " €/" + option[2] + ")", option[0], option.selected);
        eGroente.options.add(eOption);
    }

    //formulier submit
    eToevoegen.addEventListener('click', function (e) {
        e.preventDefault();
        var bValid = valideer(eFrmBestel);
        console.log('formulier ' + eFrmBestel.name + ' valideert ' + bValid);
        if (bValid === true) eFrmBestel.submit();
    });


    parse();
    schrijfRijen();
}

//==========form validatie==================================================

function valideer(frm) {
    var bValid = true; //optimistisch geen fouten
    var aFoutBoodschappen = [];

    //lus doorheen alle form elementen van het formulier
    for (var i = 0; i < frm.elements.length; i++) {
        //verwijder vorige foutboodschappen
        //hideErrors(frm.elements[i]);
        //valideer veld
        var bVeld = valideerVeld(frm.elements[i], aFoutBoodschappen);
        console.log("het element %s met name %s valideert %s", frm.elements[i].nodeName, frm.elements[i].name, bVeld);
        if (bVeld === false) { bValid = false; }

    }

    if (bValid === false) {
        showErrors(aFoutBoodschappen)
    }

    return bValid;
}

function valideerVeld(elem, aFoutBoodschappen) {
    //valideert één veld volgens zijn class
    //var aFoutBoodschappen = [];

    for (var fout in oFouten) {
        var re = new RegExp("(^|\\s)" + fout + "(\\s|$)"); //regex

        // fouten class aanwezig?
        if (re.test(elem.className)) {
            var bTest = oFouten[fout].test(elem);
            console.log("het element %s met name %s wordt gevalideerd voor %s: %s", elem.nodeName, elem.name, fout, bTest);
            if (bTest === false) {
                aFoutBoodschappen.push(elem.name + oFouten[fout].msg);
            }
        }
    }
    if (aFoutBoodschappen.length > 0) {
        //showErrors(elem, aFoutBoodschappen);}
        return !(aFoutBoodschappen.length > 0);
    }
}

function showErrors(errors) {
    /*
    toont alle fouten voor één element
    @elem element, te valideren veld
    @aErrors array, fouten voor dit element
    */

    var msg = 'Er zijn 1 of meerdere fouten!\n\n'
    for (var i = 0; i < errors.length; i++) {
        msg += "\t• " + errors[i] + "\n";
    }
    msg += '\n\n▬▬▬▬▬▬▬▬▬ஜ۩۞۩ஜ▬▬▬▬▬▬▬▬▬\n\n'

    window.alert(msg);
}

//==========formulier ontvangst==================================================

function getQueryString() {
    // leest de querystring
    return unescape(location.search.substring(1));
}


function getGET() {
    var paren = "";
    var aParen = [];
    // Decodeer functie
    // knip de searchstring net voorbij het vraagteken af
    var strGet = getQueryString()
    // als er een searchstring is
    if (strGet) {

        var formElement = strGet.split("&");
        // declareer een tijdelijk array die de naam-waarde paren zal bevatten
        var tmpArray = new Array();
        // loopt doorheen het formelement array
        for (i = 0; i < formElement.length; i++) {
            // naam en waarden worden gescheiden in een tmparray
            tmpArray = formElement[i].split("=");
            paren += tmpArray[0] + " = " + tmpArray[1] + "<br />";
            alert(tmpArray[0] + " = " + tmpArray[1] + "<br />");
            aParen.push(tmpArray);
        }
    }
    return aParen;
}

function schrijfRijen() {

    if (localStorage) {
        if (localStorage.mandje) {
            var aMandje = JSON.parse(localStorage.getItem("mandje"));
            document.getElementById('leeg').style.display = "none";
        }
    }

    var totaal = 0;

    eWinkelmandje = document.getElementById("winkelmandje");
    eTotaal = document.getElementById("totaal");
    eTotnum = document.getElementById("totNum");

   
    var eRijen = "";
    //<div class="item"><div class='cel cellinks'>testAppel</div><div class='cel cellinks'>5</div><div class='cel'>0.85
   
    console.log("mandje length: " + aMandje.length);

    for (var i = 0; i < aMandje.length; i++) {
        var eRijen = "";
        var rijTotaal = 0;

        var eRijDiv = document.createElement('div');
        eRijDiv.setAttribute("class", "item");

        // naam groente
        eRijen += "<div class='cel cellinks'>";
        eRijen += aMandje[i][1][1];

        // aantal
        eRijen += "</div><div class='cel '>";
        eRijen += aMandje[i][2][1];

        // prijs/eenheed
        eRijen += "</div><div class='cel prijs'>";
        eRijen += aMandje[i][3][1];

        // subtotaal
        eRijen += "</div><div class='cel subtotaal'>";
        var rijTotaal = aMandje[i][2][1] * aMandje[i][3][1];
        var nRijTotaal = parseFloat(Math.round(rijTotaal * 100) / 100).toFixed(2);
        eRijen += nRijTotaal;

        totaal += rijTotaal;
      

        eRijen += "</div>";

        eRijDiv.innerHTML = eRijen;

        eWinkelmandje.insertBefore(eRijDiv, eTotaal);

        console.log("groente: " + aMandje[i][1][1]);
        console.log("aantal: " + aMandje[i][2][1]);
        console.log("prijs: " + aMandje[i][3][1]);
    }

    var nTotaal = parseFloat(Math.round(totaal * 100) / 100).toFixed(2);
    eTotnum.innerHTML = nTotaal;

}

function parse() {
   

    var val = getQueryString();
    var result = "Not found", tmp = [];
    var aRij = [];
  
    location.search.substr(1)
        .split("&")
        .forEach(function (item) {
            console.log("item: " + item);
            var aItem = [];
            tmp = item.split("=");
            result = decodeURIComponent(tmp[1]);
            aItem.push(tmp[0].split('+').join(''));
            aItem.push(result.split('+').join(' '));
           
            console.log(result);
            console.log(tmp[0]);
            aRij.push(aItem);
        });

    var aPrijs = ["prijs", zoekPrijs(aRij[1][1])];
    aRij.push(aPrijs);
   
    if (localStorage.mandje) {
        var aMandje = JSON.parse(localStorage.getItem("mandje"));
        aMandje.push(aRij);
        localStorage.setItem('mandje', JSON.stringify(aMandje));
    }
    else {
        var aMandje = [];
        aMandje.push(aRij);
        localStorage.setItem('mandje', JSON.stringify(aMandje));
    }

    return aRij;
}

function zoekPrijs(groente) {
    for (var i = 0; i < groenteOptions.length; i++) {
        if (groenteOptions[i][0] == groente) {
            return groenteOptions[i][1];
        }
    }
}