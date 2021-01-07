const mainModal = document.getElementById("modalcontent");
mainModal.innerHTML = " ";

const modalDiv = document.createElement('div');
modalDiv.className = "modal-dialog";

const modalContent = document.createElement("div");
modalContent.className = "modal-content";

const modalHeader = document.createElement("div");
modalHeader.className = "modal-header";
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

function _getActionButton(title, className, action) {
    const button = document.createElement("button");
    button.className = `btn ml-5 btn-${className}`;
    button.innerText = title;
    button.addEventListener("click", action);
    return button;
}

modalFooter.append(cancleBT, saveBT)
modalDiv.append(modalContent, modalHeader, modalBody, modalFooter)
mainModal.append(modalDiv)
$("#modalcontent").modal("show")
