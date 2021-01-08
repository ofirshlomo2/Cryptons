const DOM = {
    content: document.getElementById('content'),
    loader: document.getElementById('loader'),
    state: document.getElementById('state'),
};

const CONFIG = {
    COINS_URL: `https://api.coingecko.com/api/v3/coins/list`,
    Home: 'Home_page',
    LiveReport: 'Live_reaport_page',
    AboutUs: 'About_us_page',
    COINS_URL_BY_VALUE: `https://api.coingecko.com/api/v3/coins/`,
};

let userCoins = [];
let allCoinsArr = [];

function getState() {
    try {
        const result = JSON.parse(localStorage.getItem('userCoins')) || [];
        return result;
    } catch (ex) {
        console.error('Local Storage is currupted ');
        return [];
    }
}

function init() {
    userCoins = getState();
    getAllData();
    searchCoin();
}

init();
async function getAllData() {
    const Coins = await getCoinsApi();
}

async function getCoinsApi() {
    try {
        const result = await fetch(`${CONFIG.COINS_URL}`);
        const initResult = await result.json();
        DOM.loader.style.display = 'none';
        initResult.length = 50;

        allCoinsArr = [];
        for (let i = 0; i < 50; i++) allCoinsArr.push(initResult[i]);

        console.log(initResult);
        console.log('arry', allCoinsArr);
        if (DOM.state.innerHTML == 'Home') draw(initResult);
        else if (DOM.state.innerHTML == 'my favorites') draw(userCoins);
    } catch {
        alert('Failed to fetch data from API');
    }
}

function searchCoin() {
    const searchDiv = document.getElementById('search');
    const div = document.createElement('div');
    div.className = 'form-group p-3';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-control me-2';
    input.id = 'searchInput';
    input.placeholder = 'Search';

    const searchBT = document.createElement('button');
    searchBT.className = 'btn btn-outline-success';
    searchBT.innerText = 'Search';
    searchBT.addEventListener('click', filterCoins);
    searchDiv.append(input, searchBT);
    return searchDiv;
}

function filterCoins() {
    const seacrhValue = searchInput.value.toLowerCase();
    const filterArry = allCoinsArr.filter((coin) => {
        return (
            coin.symbol.includes(seacrhValue.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(seacrhValue.toLowerCase())
        );
    });
    console.log('filterArry', filterArry);
    console.log('seacrhValue', seacrhValue);
    draw(filterArry);
}

function showUserCoins() {
    draw(userCoins);
}

function draw(coins) {
    if (!Array.isArray(coins)) return;
    content.innerHTML = ' ';
    const CoinsCard = coins.map((coin) => getCoinsCard(coin));
    DOM.content.append(...CoinsCard);
}

function getCoinsCard(coinsData) {
    const divCard = document.createElement('div');
    divCard.className = 'card m-2';
    divCard.style = 'width: 18rem;';

    const divBody = document.createElement('div');
    divBody.className = 'card-body';

    const h5 = document.createElement('h5');
    h5.className = 'card-title';
    h5.innerText = coinsData.symbol;

    const p = document.createElement('p');
    p.innerText = `ID:${coinsData.id}, Name:${coinsData.name}`;

    const divCollapse = document.createElement('div');
    const divCollapseBody = document.createElement('div');
    divCollapse.className = 'collapse';
    divCollapseBody.className = 'card card-body m-2';
    divCollapse.id = `more_info_${coinsData.id}`;
    divCollapse.append(divCollapseBody);

    const anchor = document.createElement('a');
    anchor.innerText = 'More info';
    anchor.href = `#more_info_${coinsData.id}`;
    anchor.className = 'btn btn-dark m-2';
    anchor.setAttribute('data-toggle', 'collapse');
    anchor.addEventListener('click', async function () {
        divCollapseBody.innerHTML = ' ';
        DOM.loader.style.display = 'block';
        const result = await fetch(
            `${CONFIG.COINS_URL_BY_VALUE}${coinsData.id}`,
            coinsData
        );
        const moreResult = await result.json();
        DOM.loader.style.display = 'none';
        console.log(moreResult);

        const moreInfo = {
            img: moreResult.image.thumb,
            coinByUSD: moreResult.market_data.current_price.usd,
            cooinByILS: moreResult.market_data.current_price.ils,
            cooinByEUR: moreResult.market_data.current_price.eur,
        };

        const coinSymbol = document.createElement('img');
        coinSymbol.className = 'img-coinSymbol';
        coinSymbol.src = moreInfo.img;
        coinSymbol.width = 60;

        const USD = showMoreInfo(moreInfo.coinByUSD, `$`);
        const ILS = showMoreInfo(moreInfo.cooinByILS, '₪');
        const EUR = showMoreInfo(moreInfo.cooinByEUR, '€');

        function showMoreInfo(text, symbol) {
            const Divlist = document.createElement('div');
            Divlist.innerText = `Value in:${text.toFixed()}${symbol}`;
            divCollapseBody.append(Divlist, coinSymbol);
            return Divlist;
        }
    });

    const checkboxButton = document.createElement('div');
    checkboxButton.className = 'form-check form-switch';
    checkboxButton.id = `SwitchCheck${coinsData.id}`;
    const checkbox = document.createElement('input');
    checkbox.className = 'form-check-input';
    checkbox.type = 'checkbox';
    checkbox.id = `#myCheck${coinsData.id}`;
    checkbox.addEventListener('click', () => {
        addTouserCoins(coinsData);
    });
    checkboxButton.append(checkbox);
    /*   const moreInfoButton = _getActionButton("primary", " more info", () => {
            //_getMoreInfo(coinsData);
            getMoreInfo(coinsData);
        });
     */

    /*  function _getActionButton(className, title, action) {
           const button = document.createElement("button");
           button.className = `btn ml-5 btn-${className}`;
           button.innerText = title;
           button.addEventListener("click", action);
           return button;
       } */

    divCard.append(divBody, checkboxButton, h5, p, anchor, divCollapse);
    return divCard;
}

function addTouserCoins(coinsData) {
    const index = document.getElementById(`#myCheck${coinsData.id}`);
    if (index.checked) {
        if (userCoins.length < 2) {
            userCoins.push(coinsData);
            /*   const localStorage = localStorage.setItem(`${coinsData.id}`, JSON.stringify(extendedCoin)) */

            localStorage.setItem('userCoins', JSON.stringify(userCoins));
            console.log('selectedCoinToStore', userCoins);
        } else return _getModal(userCoins, coinsData.id);
    } else {
        const deletedIndex = userCoins.findIndex((C) => C.id === coinsData.id);
        if (deletedIndex === -1) return;
        userCoins.splice(deletedIndex, 1);
        localStorage.setItem('userCoins', JSON.stringify(userCoins));
        console.log(userCoins);
    }

    function _getModal(userCoins) {
        const mainModal = document.getElementById('modalcontent');
        mainModal.innerHTML = ' ';

        const modalDiv = document.createElement('div');
        modalDiv.className = 'modal-dialog';

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';
        modalHeader.id = 'exampleModalLabel';

        const h5 = document.createElement('h5');
        h5.classList = 'modal-title';
        h5.innerText = 'ooops ,you chosed more than 5 coins';
        modalHeader.append(h5);

        const modalBody = document.createElement('div');
        modalBody.classList.add('modal-body');
        const p = document.createElement('p');
        p.innerText = 'Please choose which coin do you want to delet';
        const alluserCoins = creatOptions();
        modalBody.append(...alluserCoins, p);

        const modalFooter = document.createElement('div');
        modalFooter.classList.add('modal-footer');
        const cancleBT = _getActionButton('Cancel', 'btn btn-secsses', () =>
            deleteSelected(userCoins)
        );
        cancleBT.setAttribute('data-dismiss', 'modal');
        const saveBT = _getActionButton('Keep currnt', 'btn btn-primary', () =>
            saveSelected(userCoins)
        );

        function _getActionButton(title, className, action) {
            const button = document.createElement('button');
            button.className = `btn ml-5 btn-${className}`;
            button.innerText = title;
            button.addEventListener('click', action);
            return button;
        }

        modalFooter.append(cancleBT, saveBT);
        modalDiv.append(modalContent, modalHeader, modalBody, modalFooter);
        mainModal.append(modalDiv);
        $('#modalcontent').modal('toggle');
    }
}

const creatOptions = () => {
    const coinsOptions = userCoins.map((coin) => {
        return _userCoins(coin.id, coin.symbol);
    });
    return coinsOptions;

    function _userCoins(ID, name) {
        const divCheckBox = document.createElement('div');
        divCheckBox.className = 'custom-checkbox';
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'form-check-input';
        input.id = `SwitchCheck${ID}`;
        const lable = document.createElement('label');
        lable.className = 'custom-control-label';
        lable.setAttribute('for', `checkBox${ID}`);
        lable.innerText = name;
        divCheckBox.append(input, lable);
        return divCheckBox;
    }
};

const deleteSelected = (coinToDelet) => {
    console.log('canle');
    index = document.getElementById(`SwitchCheck${coinToDelet.id}`);
    index.checked = !index.checked;
    $('#modalcontent').modal('hide');
};

const saveSelected = () => {
    console.log('save');
};

{

}
