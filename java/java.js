const tlacitko = document.querySelector("#tlacitko_pridat");
const nazev_ukolu = document.querySelector("#nazev_ukolu");

const pocitadlo_zadane = document.querySelector("#pocitadlo_zadane");
const pocitadlo_hotove = document.querySelector("#pocitadlo_hotove");
let hotove_ukoly = 0;
let zadane_ukoly = 0;

//const zaskrtavatko = document.querySelector(".zaskrtavatko");
const seznam_ukolu = document.querySelector(".seznam");
const historie_tlac = document.querySelector(".histBtn");

nacti_pocitadla();
nacti_ukoly();

tlacitko.onclick = function () {
    zadane_ukoly = parseInt(ziskejPocitadlaHodnoty("zadano"));
    zadane_ukoly = zadane_ukoly + 1;

    if (nazev_ukolu.value === "") {
        alert("Nejdříve napiš ukol");
        return;
    }

    //nazev_ukolu.value ? zaloz_novy_ukol(nazev_ukolu.value) : alert("Nejdříve napiš ukol");

    zaloz_novy_ukol(nazev_ukolu.value);
    nazev_ukolu.value = "";
    let vzor = seznam_ukolu.querySelector(".ukol-vzor");
    vzor.setAttribute("style", "");
    vzor.children[1].textContent = "";

    uloz_pocitadla(hotove_ukoly, zadane_ukoly);
    vypis_pocitadla(hotove_ukoly, zadane_ukoly);

}

function zaloz_novy_ukol(text_ukolu, hotovo) {
    let novy_ukol = seznam_ukolu.querySelector(".ukol-vzor").cloneNode(true);
    novy_ukol.classList.remove("ukol-vzor");
    novy_ukol.querySelector("p").innerText = text_ukolu;

    if (hotovo) {
        novy_ukol.classList.add("hotovo");
    }

    novy_ukol.querySelector(".zaskrtavatko").onclick = function (udalost) {
        let zaskrtavatko = udalost.target;
        let obsahuje = zaskrtavatko.parentElement.classList.contains("hotovo");
        hotove_ukoly = parseInt(ziskejPocitadlaHodnoty("hotovo"));

        if (obsahuje) {
            zaskrtavatko.parentElement.classList.remove("hotovo");
            hotove_ukoly = hotove_ukoly - 1;
        } else {
            zaskrtavatko.parentElement.classList.add("hotovo");
            hotove_ukoly = hotove_ukoly + 1;
        }

        uloz_pocitadla(hotove_ukoly, zadane_ukoly);
        vypis_pocitadla(hotove_ukoly, zadane_ukoly);
    }

    novy_ukol.querySelector(".smazat").onclick = function (udalost) {
        let popelnice = udalost.target;
        popelnice.parentElement.parentElement.remove();
        hotove_ukoly = parseInt(ziskejPocitadlaHodnoty("hotovo"));
        zadane_ukoly = parseInt(ziskejPocitadlaHodnoty("zadano"));

        if (novy_ukol.classList.contains("hotovo")) {
            hotove_ukoly--;
        }
        zadane_ukoly--;
        uloz_pocitadla(hotove_ukoly, zadane_ukoly);
        vypis_pocitadla(hotove_ukoly, zadane_ukoly);
        uloz_ukoly();
    }

    seznam_ukolu.appendChild(novy_ukol);
    uloz_ukoly();
}

function formatuj(co) {

    if (co < 10) {
        co = "0" + co;
    }

    return co;
}

function vypis_pocitadla(hotovo, zadano) {
    pocitadlo_zadane.textContent = formatuj(zadano);
    pocitadlo_hotove.textContent = formatuj(hotovo);
}

function nacti_pocitadla() {
    let hotovo = localStorage.getItem("hotovo");
    let zadano = localStorage.getItem("zadano");

    if (hotovo === null) {
        hotovo = 0;
    }

    if (zadano === null) {
        zadano = 0;
    }

    vypis_pocitadla(hotovo, zadano);
}

function ziskejPocitadlaHodnoty(typ) {
    let hodnota = localStorage.getItem(typ);
    if (hodnota === null || hodnota == 0) return 0;
    return hodnota;
}

function uloz_pocitadla(hotovo, zadano) {
    localStorage.setItem("hotovo", hotovo);
    localStorage.setItem("zadano", zadano);
}

function uloz_ukoly() {
    // ukoly = [ "Ahoj", "Nazdar", ... ]
    let ukoly = seznam_ukolu.querySelectorAll(".ukol");

    let ukoly_k_ulozeni = [];

    for (let ukol of ukoly) {
        if (ukol.classList.contains("ukol-vzor")) {
            continue;
        }

        let text = ukol.querySelector("p").textContent;
        let hotovy = ukol.classList.contains("hotovo");

        ukoly_k_ulozeni.push([text, hotovy]);
    }

    localStorage.setItem("seznam_ukolu", JSON.stringify(ukoly_k_ulozeni));
}

function nacti_ukoly() {
    let seznam_ukolu = localStorage.getItem("seznam_ukolu");

    if (seznam_ukolu == null) {
        return;
    }

    seznam_ukolu = JSON.parse(seznam_ukolu);

    // seznam_ukolu = [ ["text", hotovo??], ["jiny text", hotovo??] ]
    for (let ukol of seznam_ukolu) {
        let text = ukol[0];
        let hotovo = ukol[1];

        zaloz_novy_ukol(text, hotovo);
    }
}

historie_tlac.addEventListener("click", () => {
    localStorage.clear();
    let vzor = seznam_ukolu.querySelector(".ukol-vzor").cloneNode(true);
    seznam_ukolu.replaceChildren();
    nacti_pocitadla();
    seznam_ukolu.appendChild(vzor);
});

let allowedCharacters = Array.from(Array(26)).map((e, i) => i + 65);

//Zobrazí jak bude vypadat ukol
nazev_ukolu.addEventListener("keydown", (e) => {
    if (!allowedCharacters.includes(e.keyCode)) return;
    let vzor = seznam_ukolu.querySelector(".ukol-vzor");
    vzor.setAttribute("style", "display: grid");
    vzor.children[1].textContent += e.key;
    if (nazev_ukolu.value == "") {
        vzor.setAttribute("style", "");
    }
})