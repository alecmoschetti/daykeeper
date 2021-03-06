import { animate } from './zdog';
import {setStorage, getStorage} from './storage';
import {
    CreateProject, 
    CreateTask, 
    getProject, 
    getTask, 
    removeTask, 
    removeProject, 
    deleteSpacesInStrings, 
    sortTasks,
    projects, 
    completed, 
    all
} from './tasks';

  /* DOM manipulation scripts */

  //global variables
    const body = document.querySelector('body'); 
    const nav = document.querySelector('nav');
    let newInputs = document.querySelector('#new-form');
    let projectSelection = document.querySelector('#projectSelection');
    let projectSelectionHTML = projectSelection.innerHTML;
    const taskListUL = document.querySelector("ul.task-list");
    const allSelection = document.querySelector('#allNav');
    let options = []; //for select dropdown menu for project folders

    function toggleSelection(query) {
        if (!newInputs.contains(query)) {
            let div = document.createElement('div');
            div.innerHTML = projectSelectionHTML;
            div.classList.add('input-item');
            div.classList.add('flex');
            div.id = 'projectSelection';
            newInputs.append(div);
        }
    }

    function updateNav(proj) {
        const navUl = document.querySelector('#navList');
        const completed = navUl.querySelector('#completed');
        let selectOptions = document.querySelector(`select[name="project"]`);
        let option = document.createElement('option');
        option.value = proj.title;
        option.text = proj.title;
        options.push(option);
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
        navUl.insertBefore(li, completed);
        options.forEach(option => selectOptions.add(option));
        setStorage('nav', navUl);
        setStorage('options', Object.from);
    }

    function appendLI(obj) {
        const {title, priority, status, project} = obj;
        let titleNoSpaces = deleteSpacesInStrings(title);
        let li = document.createElement('li');
        li.classList.add('task-item', 'flex');
        li.innerHTML = `
            <div class="taskicon-container task" data-project="${project}" data-title="${titleNoSpaces}" data-status="${status}">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon icon-tabler icon-tabler-circle"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#000000"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <circle cx="12" cy="12" r="9" />
            </svg>
        </div>
        <div class="task">
            <p id="taskName">${title}</p>
        </div>
        <div class="priority-container task">
            <p>Priority: <span data-priority="${priority}" class="priority">${priority}</span></p>
        </div>
        <div class="task edit-container flex">
            <div class="taskicon-container delete">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-x"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="#000000"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </div>
        </div>  
        `;
        taskListUL.appendChild(li);
    }

    function printProjectTasks(arr, title) {
        let project = getProject(arr, title)
        let projectTasks = project.tasks;
        printTasks(projectTasks);
    }

    function printTasks(arr) {
        taskListUL.innerHTML = '';
        arr.forEach(task => appendLI(task));
    }

    function deleteTaskFromDom(query, delay) {
        query = deleteSpacesInStrings(query);
        let selectedTask = document.querySelector(`[data-title=${query}]`);
        let li = selectedTask.parentNode;
        setTimeout(() => li.remove(), delay);
    }

    function newNavSelection(target) {
        let selection = document.querySelector('.selected');
        if (selection) {
            selection.classList.remove('selected');
        }
        target.classList.add('selected');
    }

    function getHeading() {
        let h2 = document.getElementById('folder-title').querySelector('h2');
        return h2;
    }

    function setHeading(target) {
        let newHeading = target.text;
        let h2 = getHeading();
        h2.setAttribute('data-heading', `${newHeading.toLowerCase()}`);
        h2.innerHTML = newHeading;
        const dataName = h2.getAttribute('data-heading');
        taskListUL.innerHTML = '';
        return dataName;
    }

    function goToAll() {
        newNavSelection(allSelection);
        setHeading(allSelection);
        printTasks(all);
        toggleHiddenControls();
    }

    function toggleHiddenControls() {
        let deleteProjectButton = document.querySelector('#deleteProjectButton');
        let selectedNav = document.querySelector('.selected');
        if (selectedNav === allSelection || selectedNav.id === "completedAll") {
            deleteProjectButton.classList.add('hidden');
        } else {
            deleteProjectButton.classList.remove('hidden'); 
        }
    }

    let ro = new ResizeObserver( entries => {
      for (let entry of entries) {
        const cr = entry.contentRect;
        (cr.width >= 1300) ? nav.classList.remove('hidden') : nav.classList.add('hidden');
      }
    });
    
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
            case (target.id === 'hamburger-container'): 
                nav.classList.toggle('hidden');
                break;
            case (target.id === 'addFolderButton' || target.id === 'addProject'):
                addFormContainer.classList.remove('hidden');
                projectSelection = document.querySelector('#projectSelection');
                newInputs.removeChild(projectSelection);
                prioritySelectionDiv.classList.replace('flex', 'hidden');
                break;
            case (target.id === 'addTaskButton'): 
                prioritySelectionDiv.classList.replace('hidden', 'flex');
                addFormContainer.classList.remove('hidden');
                projectSelection = document.querySelector('#projectSelection');
                toggleSelection(projectSelection);
                break;
            case (target.id === 'cancel'):
                addFormContainer.classList.add('hidden');
                newInputs.reset();
                projectSelection = document.querySelector('#projectSelection');
                toggleSelection(projectSelection);
                break;
            case (target.id === 'submit'): //making either project folder or individual task
                let inputsForm = new FormData(newInputs);
                let obj = Object.fromEntries(inputsForm);
                toggleSelection(projectSelection);
                if (obj.project) { //if there is a project variable, we know we are creating a task
                    let newTask = CreateTask(obj);
                    let { project } = newTask;
                    let index = projects.findIndex(task => task.title === project);
                    projects[index].tasks.push(newTask); //task is now in the propper project object in the projects array
                    all.push(newTask); //task gets put in our all section
                    let currentFolder = document.getElementById('folder-title').querySelector('h2').getAttribute('data-heading');
                    if (currentFolder.toLowerCase() === project.toLowerCase()) {
                        taskListUL.innerHTML = '';
                        projects[index].tasks.forEach(task => appendLI(task));
                    }
                } else if (!obj.project) { //if no project variable, we know we are creating a project folder object
                    let newProject = CreateProject(obj);
                    projects.push(newProject);
                    updateNav(newProject);
                }
                addFormContainer.classList.add('hidden');
                newInputs.reset();
                break;
            case (target.classList.contains('projectNav')): //appending project tasks to the dom
                newNavSelection(target);
                toggleHiddenControls();
                const dataName = setHeading(target);
                let optionName = document.querySelector(`option[selected="selected"]`);
                if (optionName) {
                    optionName.removeAttribute('selected');
                }
                document.querySelector(`option[value="${target.text.toLowerCase()}"]`).setAttribute('selected', 'selected');
                printProjectTasks(projects, dataName);
                break;
            case (target.classList.contains('delete')): //deleting task from dom
                let checkingFolderTitle = getHeading().innerText.toLowerCase();
                let li = target.parentNode.parentNode;
                let sibling = li.firstElementChild;
                let task = sibling.dataset.title;
                let projectTitle = sibling.dataset.project;
                removeTask(projects, projectTitle, task);
                removeTask(all, projectTitle, task);
                if (checkingFolderTitle === 'total') {
                    removeTask(completed, projectTitle, task);
                }
                deleteTaskFromDom(task, 0);
                break;
            case (target.classList.contains('task') && target.dataset.status === 'false'): //marking tasks complete
                let taskTitle = target.parentElement.querySelector('#taskName').innerText;
                let projectFolder = target.dataset.project;
                let taskObj = getTask(projects, projectFolder, taskTitle);
                taskObj.complete(projects, projectFolder, taskTitle);
                target.dataset.status = 'true';
                removeTask(all, taskObj, taskTitle);
                deleteTaskFromDom(taskTitle, 1000);
                break;
            case (target.id === 'allNav'):
                goToAll();
                break;
            case (target.id === 'completedAll'):
                newNavSelection(target);
                toggleHiddenControls();
                setHeading(target);
                let flattenedArr = completed.flat(1);
                printTasks(flattenedArr);
                break;
            case (target.id === 'deleteProjectButton'):
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
                break;
            case (target.id === 'sortByButton'):
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
                break;
        }
    });

  };
  
  export { activateListeners };
