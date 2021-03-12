
let navList = [];
let optionList = [];

function setStorage(name, obj) {
    localStorage.setItem(name, JSON.stringify(obj));
} 

function setNavValues(nav) {
    const elements = [...nav];
    elements.forEach(el => navList.push(el.textContent));
    setStorage('navList', navList);
}

function setSelectOptionValues(arr) {
    arr.forEach(option => optionList.push(option.textContent));
    setStorage('optionList', optionList);
}

function setRemovalOfNavValue(name) {
    let navItemIndex = navList.findIndex(li => li === name);
    navList.splice(navItemIndex, 1);
    setStorage('navList', navList);
}

function setRemovalOfOptionValues(name) {
    let optionItemIndex = optionList.findIndex(option => option === name);
    optionList.splice(optionItemIndex, 1);
    setStorage('optionList', optionList);
}



export {setStorage, setNavValues, setSelectOptionValues, setRemovalOfNavValue, setRemovalOfOptionValues};