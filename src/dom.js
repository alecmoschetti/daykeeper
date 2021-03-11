import { animate } from './zdog';
import {setNavValues, setProjectsList, setProjectTask, setAll, setDeletionOfTask, setDeletionOfCompletedTask, setRemovalOfNavValue} from './storage';
import {ro, taskListUL, toggleNav, toggleHiddenControls, printProjectTasks, printTasks, deleteTaskFromDom, newNavSelection, getHeading, setHeading, goToAll, appendLI} from './helpers';
import {CreateProject, CreateTask, completeTask, getTask, getProject, removeTask, removeProject, sortTasks, projects, completed, all} from './tasks';

  /* DOM manipulation scripts */

  //global variables
    const body = document.querySelector('body'); //for our giant event listener
    let newInputs = document.querySelector('#new-form');
    let projectSelection = document.querySelector('#projectSelection');
    let projectSelectionHTML = projectSelection.innerHTML; //grabs the initial pages projectselection div that holds our project selection elements in our hidden add project/task form
    let options = []; //for select dropdown menu for project folders

    function toggleSelection(query) {
        if (!newInputs.contains(query)) { //if the new task form area doesn't have the query (select html element), that means it was deleted... so we'll make a new one
            let div = document.createElement('div'); //make a div to hold our select element
            div.innerHTML = projectSelectionHTML; //sets it's inner html to equal the onload content of that div when it existed.
            div.classList.add('input-item'); //adding the necessary classes
            div.classList.add('flex');
            div.id = 'projectSelection'; //adding necessary id
            newInputs.append(div); //appending it inside our newInputs div (the add project/task form)
        } //if it does have it, then we don't need to make it
    }

    function updateNav(proj) { //adding new nav list items to the dom (nav area) when a new project is made
        const navUl = document.querySelector('#navList'); //getting the navUL dom area
        const completed = navUl.querySelector('#completed'); //where we will insert our new title before
        let selectOptions = document.querySelector(`select[name="project"]`); //grabbing the selection options to add to it
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
        options.forEach(option => selectOptions.add(option)); //add every option in our options array to the selectOptions element in the dom
        setNavValues(document.querySelectorAll(`[data-title="${proj.title}"]`));
    }

    function getStorage(obj) {
        if (!localStorage[obj]) {
            return;
        } else {
            if (obj === 'projects') {
                let desiredStorage = localStorage.getItem(obj);
                desiredStorage = JSON.parse(desiredStorage);
                for(let [key, value] of Object.entries(desiredStorage)) {
                    projects[key] = value;
                }
            } else if (obj === 'all') {
                let desiredStorage = localStorage.getItem(obj);
                desiredStorage = JSON.parse(desiredStorage);
                for(let [key, value] of Object.entries(desiredStorage)) {
                    all.push(value);
                }
            } else if (obj === 'completed') {
                let desiredStorage = localStorage.getItem(obj);
                desiredStorage = JSON.parse(desiredStorage);
                for(let [key, value] of Object.entries(desiredStorage)) {
                    value.status = true;
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
    
    //event listener function
const activateListeners = function() {
    animate(); //zdog call

    // Observe one or multiple elements
    ro.observe(document.querySelector('html'));

    body.addEventListener('click', (e) => {
        const addFormContainer = document.querySelector('#addFormContainer');
        let prioritySelectionDiv = document.querySelector('#priority-select').parentElement;
        let target = e.target;
        switch (true) {
            case (target.id === 'hamburger-container'): //user clicks on hamburger icon (this only occurs on smaller screen devices)
                toggleNav();
                break;
            case (target.id === 'addFolderButton' || target.id === 'addProject'): { //user is creating a new project folder
                    addFormContainer.classList.remove('hidden'); //unhide our add form
                    projectSelection = document.querySelector('#projectSelection'); //grab our html select element in the add form
                    newInputs.removeChild(projectSelection); //remove the select element from the form because if it was just hidden then whatever the previous selected value was will be transffered to our object that we're creating
                    prioritySelectionDiv.classList.replace('flex', 'hidden'); //hide the priority selection element
                }
                break;
            case (target.id === 'addTaskButton'): { //user is creating a new task
                    prioritySelectionDiv.classList.replace('hidden', 'flex'); //make sure priority is visible
                    addFormContainer.classList.remove('hidden'); //make sure the form is visible
                    projectSelection = document.querySelector('#projectSelection');
                    toggleSelection(projectSelection); //create a new project folder selection element in the form if it doesn't exist (see toggleselection helper function)
                }
                break;
            case (target.id === 'cancel'): {
                    addFormContainer.classList.add('hidden'); //hide the form
                    newInputs.reset(); //reset the form
                    projectSelection = document.querySelector('#projectSelection');
                    toggleSelection(projectSelection); //create a new project folder selection element in the form if it doesn't exist (see toggleselection helper function)
                }
                break;
            case (target.id === 'submit'): //making either project folder or individual task 
                {
                    let inputsForm = new FormData(newInputs); //grabs the users form input
                    let obj = Object.fromEntries(inputsForm); //turn the data into an object
                    toggleSelection(projectSelection);
                    if (obj.project) { //if there is a project variable, we know we are creating a task
                        let newTask = CreateTask(obj); //variable to hold our returns task object from our factory function
                        let { project } = newTask; //get the project property from our task object
                        projects[project].tasks.push(newTask); //adding new task object to the tasks array property of our nested project object in our global projects object. if prop exists great, if not it is created
                        all.push(newTask); //task object gets put as it's own property in the global all object
                        setProjectTask(project, newTask); //local storage
                        setAll(newTask); //local storage
                        let currentFolder = document.getElementById('folder-title').querySelector('h2').getAttribute('data-heading'); //get the dataheading of our folder title
                        if (currentFolder.toLowerCase() === project.toLowerCase()) { //if the current folder user has open is equal to the newly created task objects property title
                            taskListUL.innerHTML = ''; //wipe everytime to avoid duplicating tasks
                            projects[project].tasks.forEach(task => appendLI(task)); //append all tasks in that project folder to the dom
                        }
                    } else if (!obj.project) { //if no project variable, we know we are creating a project folder object
                        let newProject = CreateProject(obj); //variable to hold our returned project object from our factory function
                        if (!projects[newProject.title]) { //checking for duplicates
                            projects[newProject.title] = newProject; //adding title of new project as a property in our global projects object and setting it equal to the project object value
                            updateNav(newProject); //adding new nav list items to the dom (nav area)
                            setProjectsList(projects); //setting local storage
                        }
                    }
                    addFormContainer.classList.add('hidden'); //after our objects are created and updated we will hide the form
                    newInputs.reset(); //reset the form 
                }
                break;
            case (target.classList.contains('projectNav')): //user clicked on nav li so we will append selected project's tasks to the dom
                {
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
                        setDeletionOfCompletedTask(task);
                        deleteTaskFromDom(task, 0);
                    } else {
                        removeTask(projects, projectTitle, task);
                        removeTask(all, projectTitle, task);
                        deleteTaskFromDom(task, 0);
                        setDeletionOfTask(projectTitle, task); //local storage
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
                    const projectName = h2.getAttribute('data-heading');
                    let selectOptions = document.querySelector(`select[name="project"]`);
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
    });

  };
  
  export { activateListeners , getAllStorage};
