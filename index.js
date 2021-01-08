DOM = {
    content: document.getElementById("content"),
    loader: document.getElementById("loader"),
    modalDialog: document.getElementById("modalcontent"),
    state: document.getElementById('state'),
};

CONFIG = {
    COINS_URL: `https://api.coingecko.com/api/v3/coins/list`,
    /*    Home: 'Home_page',
       LiveReport: 'liveReport.html',
       AboutUs: 'aboutPage.html', */
    COINS_URL_BY_VALUE: `https://api.coingecko.com/api/v3/coins/`,
}

let selectedCoins = [];
let allCoinsArry = [];


function getState() {
    try {
        const result = JSON.parse(localStorage.getItem("selectedCoins")) || [];
        return result;
    } catch (ex) {
        console.error("Local Storage is currupted ");
        return [];
    }
}


function init() {
    /*  window.localStorage.clear(); */
    selectedCoins = getState();
    /*  getAllData(); */
    /*  searchCoin(); */
    getCoinsApi()

}

init();

/* async function getAllData() {
    const Coins = await getCoinsApi();
} */


/* function searchCoin() {
    const searchDiv = document.getElementById("search")
    const div = document.createElement("div");
    div.className = "form-group p-3";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "form-control me-2";
    input.id = "searchInput";
    input.placeholder = "Search";

    const searchBT = document.createElement("button");
    searchBT.className = "btn btn-outline-success";
    searchBT.innerText = "Search";
    searchBT.addEventListener("click", searchCoinFunction)
    searchDiv.append(input, searchBT);
    return searchDiv;

}
 */
function searchCoinFunction() {
    const seacrhValue = document.getElementById('search').value.toLowerCase();
    filterArry = allCoinsArry.filter((coin) => {
        return (
            coin.symbol.includes(seacrhValue.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(seacrhValue.toLowerCase())
        );
    });

    draw(filterArry);
}

/*      const seacrhValue = document.getElementById('search').value.toLowerCase()
    DOM.loader.style.display = "block";
    const seacrhValue = searchInput.value.toLowerCase();
    const filterArry = allCoinsArry.filter(coin => {
        coin.symbol.includes(seacrhValue.toLowerCase()) || coin.symbol.toLowerCase().includes(seacrhValue.toLowerCase())
    })

    console.log("filterArry", filterArry)
    console.log("seacrhValue", seacrhValue)
    draw(filterArry)  */


/* function FavoritesPage() {
    draw(selectedCoins);
}
 */

async function getCoinsApi() {
    try {
        const result = await fetch(`${CONFIG.COINS_URL}`);
        const initResult = await result.json();
        DOM.loader.style.display = "none";
        initResult.length = 50

        allCoinsArry = [];
        for (let i = 0; i < 50; i++) allCoinsArry.push(initResult[i]);

        if (DOM.state.innerText == 'Home') draw(initResult);
        else if (DOM.state.innerText == 'Favorites Coins') draw(selectedCoins);

        console.log("selectedCoins", selectedCoins);
        console.log("allCoinsArry", allCoinsArry)

    } catch {
        alert("Failed to fetch data from API");
    }
}

function draw(coins) {
    if (!Array.isArray(coins)) return;
    content.innerHTML = " ";
    const CoinsCard = coins.map((coin) => getCoinsCard(coin));
    DOM.content.append(...CoinsCard);
}

function getCoinsCard(coinsData) {
    const divCard = document.createElement('div');
    divCard.className = "card m-2"
    divCard.style = "width: 18rem;"

    const divBody = document.createElement("div");
    divBody.className = "card-body";

    const h5 = document.createElement("h5");
    h5.className = "card-title";
    h5.innerText = coinsData.symbol;

    const p = document.createElement('p');
    p.innerText = `ID:${coinsData.id}, Name:${coinsData.name}`


    const divCollapse = document.createElement("div");
    const divCollapseBody = document.createElement("div");
    divCollapse.className = "collapse";
    divCollapseBody.className = "card card-body m-2";
    divCollapse.id = `more_info_${coinsData.id}`;
    divCollapse.append(divCollapseBody);

    const anchor = document.createElement("a");
    anchor.innerText = "More info";
    anchor.href = `#more_info_${coinsData.id}`;
    anchor.className = "btn btn-dark m-2";
    anchor.setAttribute("data-toggle", "collapse");
    anchor.addEventListener("click", async function () {
        divCollapseBody.innerHTML = " ";
        DOM.loader.style.display = "block";
        const result = await fetch(`${CONFIG.COINS_URL_BY_VALUE}${coinsData.id}`, coinsData);
        const moreResult = await result.json();
        DOM.loader.style.display = "none";
        console.log(moreResult)

        const moreInfCONFIG = {
            img: moreResult.image.thumb,
            coinByUSD: moreResult.market_data.current_price.usd,
            cooinByILS: moreResult.market_data.current_price.ils,
            cooinByEUR: moreResult.market_data.current_price.eur,
        }

        const CoinSymbal = document.createElement('img');
        CoinSymbal.className = "img-coinSymbal"
        CoinSymbal.src = moreInfCONFIG.img
        CoinSymbal.width = 60;


        const USD = showMoreInfo(moreInfCONFIG.coinByUSD, `$`);
        const ILS = showMoreInfo(moreInfCONFIG.cooinByILS, "₪");
        const EUR = showMoreInfo(moreInfCONFIG.cooinByEUR, "€");

        function showMoreInfo(text, symbol) {
            const Divlist = document.createElement('div');
            Divlist.innerText = `Value in:${text.toFixed()}${symbol}`
            divCollapseBody.append(Divlist, CoinSymbal)
            return Divlist
        }
    })


    const checkboxButton = document.createElement("div")
    checkboxButton.className = "form-check form-switch";
    checkboxButton.id = `SwitchCheck${coinsData.id}`;

    const checkbox = document.createElement("input");
    checkbox.className = "form-check-input";
    checkbox.type = "checkbox";
    checkbox.id = `#myCheck${coinsData.id}`

    checkbox.addEventListener('click', () => { addToSelectedCoins(coinsData) })
    checkboxButton.append(checkbox);

    const deleteBtn = document.createElement('btn');
    deleteBtn.className = 'btn btn-danger m-2';
    deleteBtn.innerHTML = 'Remove coin';
    deleteBtn.addEventListener('click', () => {
        deleteFromFav(coinsData);
    });

    /*    $('#SwitchCheck').click(function (e) {
           if (e.target.checked) {
               localStorage.checked = true;
           } else {
               localStorage.checked = false;
           }
       })
       $(document).ready(function () {
   
           document.querySelector('#SwitchCheck').checked = localStorage.checked
       });
    */

    if (DOM.state.innerHTML == 'Home') {
        divCard.append(divBody, checkboxButton, h5, p, anchor, divCollapse);
    } else {
        divCard.append(divBody, h5, p, anchor, divCollapse, deleteBtn);
    }
    return divCard;
}
/* divCard.append(divBody, checkboxButton, h5, p, anchor, divCollapse) */

function deleteFromFav(coinsData) {
    selectedCoins.splice(coinsData, 1);
    localStorage.setItem('selectedCoins', JSON.stringify(selectedCoins));
    if (selectedCoins == null) alert('you dont have favorite coins');
    else draw(selectedCoins);
}


function addToSelectedCoins(coinsData) {
    const index = document.getElementById(`#myCheck${coinsData.id}`);
    if (index.checked) {
        const isAlreadyExist = selectedCoins.some((c) => c.id === coinsData.id);
        if (isAlreadyExist) {
            index.checked = !index.checked;
            alert('The coin is already exist in your favorites coins');
            return;
        }
        if (selectedCoins.length < 2) {
            selectedCoins.push(coinsData)
            localStorage.setItem('selectedCoins', JSON.stringify(selectedCoins));
            console.log("selectedCoins", selectedCoins)
        } else

            return getModal(selectedCoins, coinsData.id)
    }
    else {
        const deletedIndex = selectedCoins.findIndex((C) => C.id === coinsData.id);
        if (deletedIndex === -1) return;
        selectedCoins.splice(deletedIndex, 1);
        localStorage.setItem('selectedCoins', JSON.stringify(selectedCoins));

        console.log(selectedCoins);
    }
}


function getModal(selectedCoins) {

    DOM.modalDialog.innerHTML = " ";

    const modalDiv = document.createElement("div");
    modalDiv.className = "modal-dialog";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    const modalHeader = document.createElement("div");
    modalHeader.classList.add("modal-header");
    modalHeader.id = "exampleModalLabel";

    const h5 = document.createElement("h5");
    h5.classList = "modal-title";
    h5.innerText = "ooops ,you chosed more than 5 coins";
    modalHeader.append(h5)

    const modalBody = document.createElement("div");
    modalBody.classList.add("modal-body");
    const p = document.createElement("p");
    p.innerText = "Please choose which coin do you want to delet";
    const allSelectedCoins = creatOptions(selectedCoins);
    modalBody.append(...allSelectedCoins, p);


    const modalFooter = document.createElement("div");
    modalFooter.classList.add("modal-footer");
    const cancleBT = _getActionButton("Cancel", "btn btn-secsses", () => deleteSelected(selectedCoins))
    cancleBT.setAttribute("data-dismiss", "modal");
    const saveBT = _getActionButton("Keep currnt", "btn btn-primary", () => saveSelected(selectedCoins))
    modalFooter.append(cancleBT, saveBT)

    function _getActionButton(title, className, action) {
        const button = document.createElement("button");
        button.className = `btn ml-5 btn-${className}`;
        button.innerText = title;
        button.addEventListener("click", action);
        return button;
    }

    modalContent.append(modalHeader, modalBody, modalFooter);
    modalDiv.append(modalContent);
    DOM.modalDialog.append(modalDiv)
    $("#modalcontent").modal("toggle")

}


function creatOptions() {
    const coinsOptions = selectedCoins.map(coin => { return _selectedCoins(coin.id, coin.symbol) })
    return (coinsOptions)

    function _selectedCoins(ID, CLASS) {
        const divCheckBox = document.createElement("div");
        divCheckBox.className = "custom-checkbox";
        const input = document.createElement("input");
        input.type = "checkbox";
        input.className = "form-check-input";
        input.id = `checkBox${ID}`;
        const lable = document.createElement("label");
        lable.className = "custom-control-label";
        lable.setAttribute("for", `checkBox${ID}`)
        lable.innerText = CLASS;
        divCheckBox.append(input, lable)
        return divCheckBox;
    }
}


deleteSelected = (coinToDelet) => {
    //console.log("canle")
    index = document.getElementById(`SwitchCheck${coinToDelet.id}`);
    index.checked = !index.checked;
    $("#modalcontent").modal("hide");
}

saveSelected = (keepCurrentCoins) => {
    const currenCoin = selectedCoins.filter((coin, index) => {
        const coinID = document.getElementById(`checkBox${coin.id}`)
        if (coinID.checked)
            return coin;
    })

    currenCoin.map(coin => {
        const IndexsToDel = selectedCoins.findIndex(indexCoin => { return coin.id === indexCoin.id })
        selectedCoins.splice(IndexsToDel, 1);
        index = document.getElementById(`SwitchCheck${coin.id}`);
        index.checked = !index.checked;
    })

    selectedCoins.push(keepCurrentCoins)
    /*  localStorage.setItem("selectedCoins", JSON.stringify(selectedCoins)); */
    console.log("FinalSelcted", selectedCoins);
    $("#modalcontent").modal("hide");
}
