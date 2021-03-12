import { animate } from './zdog';
import {setStorage, setNavValues, setSelectOptionValues, setRemovalOfNavValue, setRemovalOfOptionValues} from './storage';
import {ro, taskListUL, toggleNav, toggleHiddenControls, printProjectTasks, printTasks, deleteTaskFromDom, newNavSelection, getHeading, setHeading, goToAll, appendLI} from './helpers';
import {CreateProject, CreateTask, completeTask, getTask, getProject, removeTask, removeProject, sortTasks, projects, completed, all} from './tasks';

  /* DOM manipulation scripts */

  //global variables
    const body = document.querySelector('body'); //for our giant event listener
    const formContainer = document.getElementById('addFormContainer');
    let options = []; //for select dropdown menu for project folders

    function makeForm() {
        let form = document.createElement('form');
        form.classList.add('flex', 'input-container');
        return form;
    }

    function deleteForm() {
        formContainer.firstChild.remove();
    }

    function makeProjectForm() {
        deleteForm();
        let form = makeForm();
        form.setAttribute('id', 'newProjectForm');
        form.innerHTML = `
            <div class="input-item flex" data-task="title">
                <label class="info" for="title">Title:</label>
                <input type="text" class="info" id="title" data-new="title" name="title">
            </div>
        `;
        formContainer.prepend(form);
    }

    function makeTaskForm() {
        deleteForm();
        let form = makeForm();
        form.setAttribute('id', 'newTaskForm');
        form.innerHTML = `
            <div class="input-item flex" data-task="title">
                <label class="info" for="title">Title:</label>
                <input type="text" class="info" id="title" data-new="title" name="title">
            </div>
            <div class="input-item flex">
                <label class="info" for="priority-select">Priority:</label>
                <select class="info" name="priority" id="priority-select" data-new="priority">
                    <option value="">Please select task priority</option>
                    <option value="high">High</option>
                    <option value="med" selected>Med</option>
                    <option value="low">Low</option>
                </select>
            </div>
            <div class="input-item flex" id="projectSelection">
                <label class="info" for="projectSelect">Project:</label>
                <select class="info" name="project" id="projectSelect"></select>
            </div>
        `;
        formContainer.prepend(form);
    }

    function updateNav(proj) { //adding new nav list items to the dom (nav area) when a new project is made
        const navUl = document.querySelector('#navList'); //getting the navUL dom area
        const completed = navUl.querySelector('#completed'); //where we will insert our new title before
        let option = document.createElement('option'); //creating new option to add to project selection element
        option.value = proj.title; 
        option.text = proj.title;
        options.push(option); //options array created in global scope now has new option from newly created project folder
        let li = document.createElement('li');
        li.innerHTML = `
            <div class="navicon-container">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-circle-dashed"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#000000"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M8.56 3.69a9 9 0 0 0 -2.92 1.95" />
                <path d="M3.69 8.56a9 9 0 0 0 -.69 3.44" />
                <path d="M3.69 15.44a9 9 0 0 0 1.95 2.92" />
                <path d="M8.56 20.31a9 9 0 0 0 3.44 .69" />
                <path d="M15.44 20.31a9 9 0 0 0 2.92 -1.95" />
                <path d="M20.31 15.44a9 9 0 0 0 .69 -3.44" />
                <path d="M20.31 8.56a9 9 0 0 0 -1.95 -2.92" />
                <path d="M15.44 3.69a9 9 0 0 0 -3.44 -.69" />
                </svg>
            </div>
            <h3><a class="projectNav" data-title="${proj.title}">${proj.title}</a></h3>
        `;
        navUl.insertBefore(li, completed); //inserting that newly created li heading at the end of our project section in the nav
        setNavValues(document.querySelectorAll(`[data-title="${proj.title}"]`));
    }

    function updateSelectOptions(arr) {
        let selectOptions = document.querySelector(`select[name="project"]`); //grabbing the selection options to add to it
        arr.forEach(option => selectOptions.add(option)); //add every option in our options array to the selectOptions element in the dom
        setSelectOptionValues(arr);
    }

    function getStorage(obj) {
        if (!localStorage[obj]) {
            return;
        } else {
            if (obj === 'projects') {
                let desiredStorage = localStorage.getItem(obj);
                desiredStorage = JSON.parse(desiredStorage);
                for(let [key, value] of Object.entries(desiredStorage)) {
                    value.tasks.map(task => CreateTask(task));
                    let existingProject = CreateProject(value);
                    projects[key] = existingProject;
                }
            } else if (obj === 'all') {
                let desiredStorage = localStorage.getItem(obj);
                desiredStorage = JSON.parse(desiredStorage);
                for(let [key, value] of Object.entries(desiredStorage)) {
                    all.push(CreateTask(value));
                }
            } else if (obj === 'completed') {
                let desiredStorage = localStorage.getItem(obj);
                desiredStorage = JSON.parse(desiredStorage);
                for(let [key, value] of Object.entries(desiredStorage)) {
                    completed.push(value);
                }
            } else if (obj === 'navList') {
                let desiredStorage = localStorage.getItem(obj);
                desiredStorage = JSON.parse(desiredStorage);
                for(let [key, value] of Object.entries(desiredStorage)) {
                    if (projects[value]) {
                        let valueObj = getProject(value);
                        updateNav(valueObj);
                    }
                } 
            }
        }
    }

    function getAllStorage() {
        //retrieving any localStorage
        getStorage('projects'); 
        getStorage('all');
        getStorage('completed');
        getStorage('navList');
        goToAll();
    }

    function setAllStorage() {
        setStorage('projects', projects);
        setStorage('all', all);
        setStorage('completed', completed);
    }

    
    //event listener function
const activateListeners = function() {
    animate(); //zdog call

    // Observe one or multiple elements
    ro.observe(document.querySelector('html'));

    body.addEventListener('click', (e) => {
        let target = e.target;
        switch (true) {
            case (target.id === 'hamburger-container'): //user clicks on hamburger icon (this only occurs on smaller screen devices)
                toggleNav();
                break;
            case (target.id === 'addFolderButton' || target.id === 'addProject'): { //user is creating a new project folder
                    makeProjectForm();
                    formContainer.classList.remove('hidden'); //unhide our add form
                }
                break;
            case (target.id === 'addTaskButton'): { //user is creating a new task
                    makeTaskForm();
                    if (options.length >= 1) {
                        updateSelectOptions(options); 
                    }
                    formContainer.classList.remove('hidden'); //make sure the form is visible
                }
                break;
            case (target.id === 'cancel'): {
                    formContainer.classList.add('hidden'); //hide the form
                    document.querySelector('form').reset(); //reset the form
                }
                break;
            case (target.id === 'submit'): //making either project folder or individual task 
                {
                    let form = document.querySelector('form');
                    let inputsForm = new FormData(form); //grabs the users form input
                    let obj = Object.fromEntries(inputsForm); //turn the data into an object
                    if (formContainer.firstChild.id === 'newTaskForm') { 
                        let newTask = CreateTask(obj); //variable to hold our returns task object from our factory function
                        let { project } = newTask; //get the project property from our task object
                        projects[project].tasks.push(newTask); //adding new task object to the tasks array property of our nested project object in our global projects object. if prop exists great, if not it is created
                        all.push(newTask); //task object gets put as it's own property in the global all object
                        let currentFolder = document.getElementById('folder-title').querySelector('h2').getAttribute('data-heading'); //get the dataheading of our folder title
                        if (currentFolder.toLowerCase() === project.toLowerCase()) { //if the current folder user has open is equal to the newly created task objects property title
                            taskListUL.innerHTML = ''; //wipe everytime to avoid duplicating tasks
                            projects[project].tasks.forEach(task => appendLI(task)); //append all tasks in that project folder to the dom
                        }
                    } else if (formContainer.firstChild.id === 'newProjectForm') { //we are creating a project folder object
                        let newProject = CreateProject(obj); //variable to hold our returned project object from our factory function
                        if (projects[newProject.title]) { //checking for duplicates
                            alert('sorry no duplicate folder names');
                            return;
                        } else {
                            projects[newProject.title] = newProject; //adding title of new project as a property in our global projects object and setting it equal to the project object value
                            updateNav(newProject); //adding new nav list items to the dom (nav area)
                        }
                    }
                    formContainer.classList.add('hidden'); //after our objects are created and updated we will hide the form
                    form.reset(); //reset the form 
                }
                break;
            case (target.classList.contains('projectNav')): //user clicked on nav li so we will append selected project's tasks to the dom
                {
                    makeTaskForm();
                    if (options.length >= 1) {
                        updateSelectOptions(options); 
                    }
                    newNavSelection(target); //make whichever li our selected nav li (see helper function newNavSelection)
                    toggleHiddenControls(); //show the delete project button (please see toggleHiddenControls helper function)
                    const dataName = setHeading(target); //make the project folder title match the nav li and return the string of it to a variable
                    let optionName = document.querySelector(`option[selected="selected"]`); //grab the currently selected option in our project selection in the add form
                    if (optionName) { //if there is a currently selected option in the select element
                        optionName.removeAttribute('selected'); //remove the selected attribute of it
                    }
                    document.querySelector(`option[value="${target.text.toLowerCase()}"]`).setAttribute('selected', 'selected'); //set the selected project folder to the selected option 
                    printProjectTasks(dataName); //print tasks of the selected project to the page
                }
                break;
            case (target.classList.contains('delete')): //deleting task from dom
                {
                    let checkingFolderTitle = getHeading().innerText.toLowerCase();
                    let li = target.parentNode.parentNode;
                    let sibling = li.firstElementChild;
                    let task = sibling.dataset.title;
                    let projectTitle = sibling.dataset.project;
                    if (checkingFolderTitle === 'total') {
                        removeTask(completed, projectTitle, task);
                        deleteTaskFromDom(task, 0);
                    } else {
                        removeTask(projects, projectTitle, task);
                        removeTask(all, projectTitle, task);
                        deleteTaskFromDom(task, 0);
                    }
                }
                break;
            case (target.classList.contains('task') && target.dataset.status === 'false'): //marking tasks complete
                {
                    let taskTitle = target.parentElement.querySelector('#taskName').innerText;
                    let projectFolder = target.dataset.project;
                    let taskObj = getTask(projectFolder, taskTitle);
                    if (!taskObj.complete) {
                        taskObj.status = true;
                        taskObj.complete = completeTask;
                    } 
                    target.dataset.status = true;
                    taskObj.complete(projects, projectFolder, taskTitle);
                    removeTask(all, taskObj, taskTitle);
                    deleteTaskFromDom(taskTitle, 1000);
                }
                break;
            case (target.id === 'allNav'):
                goToAll();
                break;
            case (target.id === 'completedAll'):
                {
                    newNavSelection(target); //make the completed all nav li our selected nav li (see helper function newNavSelection)
                    toggleHiddenControls(); //hide the delete project button (please see toggleHiddenControls helper function)
                    setHeading(target); //make the project folder title match the completed nav li
                    let flattenedArr = completed.flat(1);
                    printTasks(flattenedArr);
                }
                break;
            case (target.id === 'deleteProjectButton'):
                {
                    let h2 = document.getElementById('folder-title').querySelector('h2');
                    const projectName = h2.getAttribute('data-heading'); //make sure to make sure the data-heading has no spaces
                    let selectOptions = document.querySelector(`select[name="project"]`);
                    let optionsIndexToRemove = options.findIndex(option => option === projectName);
                    options.splice(optionsIndexToRemove, 1);
                    for (let i = 0; i < selectOptions.length; i++) {
                        if (selectOptions.options[i].value === projectName) {
                            selectOptions.remove(i);
                        }
                    }
                    let navListItem = document.querySelector(`nav [data-title="${projectName}"]`).parentNode.parentNode;
                    navListItem.remove();
                    goToAll();
                    removeProject(projects, projectName);      
                    setRemovalOfNavValue(projectName); 
                    setRemovalOfOptionValues(projectName);
                }
                break;
            case (target.id === 'sortByButton'):
                {
                    let sortByContainer = document.querySelector('#sortBySelect');
                    let sortByChoice = sortByContainer.options[sortByContainer.selectedIndex].value;
                    if (!sortByChoice) {
                        break;
                    } else {
                        let currentHeading = getHeading().dataset.heading;
                        if (currentHeading === 'all') {
                            let sortedArray = sortTasks(all, currentHeading, sortByChoice);
                            printTasks(sortedArray);             
                        } else if (currentHeading === 'total') {
                            let sortedArray = sortTasks(completed, currentHeading, sortByChoice);
                            printTasks(sortedArray);    
                        } else {
                            let sortedArray = sortTasks(projects, currentHeading, sortByChoice);
                            printTasks(sortedArray);
                        }
                    }
                }
                break;
        }
        setAllStorage();
    });

  };
  
  export { activateListeners , getAllStorage};
