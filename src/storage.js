import {completed} from './tasks';

let navList = [];
let optionList;
let projectsList;
let allList = [];
let completedList = [];

function setStorage(name, obj) {
    localStorage.setItem(name, JSON.stringify(obj));
} 

function setNavValues(nav) {
    const elements = [...nav];
    elements.forEach(el => navList.push(el.textContent));
    optionList = navList;
    setStorage('navList', navList);
    setStorage('optionList', optionList);
}

function setRemovalOfNavValue(name) {
    let navItemIndex = navList.findIndex(li => li === name);
    navList.splice(navItemIndex, 1);
    optionList = navList;
    setStorage('navList', navList);
    setStorage('optionList', optionList);
}

function setProjectsList(obj) {
    projectsList = obj;
    setStorage('projects', projectsList);
}

function setProjectTask(proj, task) {
    let currentProjects = localStorage.getItem('projects');
    currentProjects = JSON.parse(currentProjects);
    currentProjects[proj].tasks.push(task);
    setStorage('projects', currentProjects);
}

function setDeletionOfTask(proj, task) {
    let currentProjects = localStorage.getItem('projects');
    currentProjects = JSON.parse(currentProjects);
    let taskIndex = currentProjects[proj].tasks.findIndex(todo => todo.title === task);
    currentProjects[proj].tasks.splice(taskIndex, 1);
    setStorage('projects', currentProjects);
    setDeletionOfAllListTask(task);
}

function setDeletionOfCompletedTask(task) {
    if (localStorage.completed) {
        let currentCompletedList = localStorage.getItem('completed');
        currentCompletedList = JSON.parse(currentCompletedList);
        let flattenedArr = currentCompletedList.flat(1);
        let completedTaskIndex = flattenedArr.findIndex(todo => todo.title === task);
        if (completedTaskIndex >= 0) {
            currentCompletedList.splice(completedTaskIndex, 1);
            setStorage('completed', currentCompletedList);
        }
    }
}

function setDeletionOfAllListTask(task) {
    let currentAllList = getAllListStorage();
    let allTaskIndex = getAllListTask(task);
    currentAllList.splice(allTaskIndex, 1);
    setStorage('all', currentAllList);
}

function setDeletionOfProject(proj) {
    let currentProjects = localStorage.getItem('projects');
    currentProjects = JSON.parse(currentProjects);
    delete currentProjects[proj];
    setStorage('projects', currentProjects);
}

function setCompleted(task) {
    completedList.push(task);
    setStorage('completed', completed);
}

function setAll(task) {
    allList.push(task);
    setStorage('all', allList);
}

function getAllListStorage() {
    let currentAllList = localStorage.getItem('all');
    currentAllList = JSON.parse(currentAllList);
    return currentAllList;
}

function getAllListTask(task) {
    let currentAllList = getAllListStorage();
    let allTaskIndex = currentAllList.findIndex(todo => todo.title === task); 
    return allTaskIndex;
}

export {setNavValues, setProjectsList, setProjectTask, setAll, setDeletionOfTask, setCompleted, setDeletionOfProject, setDeletionOfCompletedTask, setRemovalOfNavValue};