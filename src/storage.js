

function setStorage(name, arr) {
    localStorage.setItem(name, JSON.stringify(arr));
} 

function getStorage(arr) {
    if (!localStorage.arr) {
        return;
    } else {
        let objects = localStorage.getItem(arr);
        objects = JSON.parse(objects);
        console.log(objects);
    }
}

export {setStorage, getStorage};