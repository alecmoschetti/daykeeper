import { animate } from './zdog';
import {CreateProject, CreateTask} from './tasks';

  /* DOM manipulation scripts */

  const activateListeners = function() {
    const nav = document.querySelector('nav');
    let navUl = document.querySelector('#navList');
    const completed = navUl.querySelector('#completed');
    const hamburger = document.getElementById('hamburger-container');
    const controls = document.getElementById('controls');
    const addFormContainer = document.querySelector('#addFormContainer');
    let newInputs = document.querySelector('#new-form');
    let projectSelection = document.querySelector('#projectSelection');
    let projectSelectionHTML = projectSelection.innerHTML;
    const taskListUL = document.querySelector("ul.task-list");
    let general = CreateProject({
        title: 'general',
        priority: 'med',
        notes: 'default project folder',
    });
    let projects = [general];
    let options = [];

    animate(); //zdog call

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
            <h3><a class="live" data-title="${proj.title}" data-priority="${proj.priority}">${proj.title}</a></h3>
        `;
        navUl.insertBefore(li, completed);
        options.forEach(option => selectOptions.add(option));
    }

    function appendLI(obj) {
        console.log(`${obj} is our object parameter`);
        const {title, priority, status} = obj;
        let li = document.createElement('li');
        li.classList.add('task-item', 'flex');
        li.innerHTML = `
            <div class="taskicon-container task" data-status="${status}">
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
            <p>${title}</p>
        </div>
        <div class="priority-container task">
            <p>Priority: <span data-priority="${priority}" class="priority">${priority}</span></p>
        </div>
        <div class="task edit-container flex">
            <div class="taskicon-container">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-tabler icon-tabler-edit"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="#000000"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3"
                />
                <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                <line x1="16" y1="5" x2="19" y2="8" />
            </svg>
            </div>
            <div class="taskicon-container">
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
            <div class="taskicon-container">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-selector"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="#000000"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <polyline points="8 9 12 5 16 9" />
                    <polyline points="16 15 12 19 8 15" />
                </svg>
            </div>
            </div>  
        `;
        taskListUL.appendChild(li);
    }

    function getProject(arr, title) {
        let getProjectIndex = arr.findIndex(project => project.title === title);
        let getProject = arr[getProjectIndex];
        return getProject;
    }

    function printTasks(arr, dataTitle) {
        let project = getProject(arr, dataTitle)
        let projectTasks = project.tasks;
        projectTasks.forEach(task => appendLI(task));
    }

    let ro = new ResizeObserver( entries => {
      for (let entry of entries) {
        const cr = entry.contentRect;
        (cr.width >= 1300) ? nav.classList.remove('hidden') : nav.classList.add('hidden');
      }
    });
    
    // Observe one or multiple elements
    ro.observe(document.querySelector('html'));
  
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('hidden');
    });

    controls.addEventListener('click', (e) => {
        let target = e.target;
        if (target.id === 'addFolderButton') {
            addFormContainer.classList.remove('hidden');
            projectSelection = document.querySelector('#projectSelection');
            newInputs.removeChild(projectSelection);
        } else if (target.id === 'addTaskButton') {
            addFormContainer.classList.remove('hidden');
            projectSelection = document.querySelector('#projectSelection');
            toggleSelection(projectSelection);
        }
    });

    addFormContainer.addEventListener('click', (e) => {
        let target = e.target;
        if (target.id === 'cancel') {
            addFormContainer.classList.add('hidden');
            newInputs.reset();
            projectSelection = document.querySelector('#projectSelection');
            toggleSelection(projectSelection);
        } else if (target.id === 'submit') {
            let inputsForm = new FormData(newInputs);
            let obj = Object.fromEntries(inputsForm);
            toggleSelection(projectSelection);
            if (obj.project) {
                let newTask = CreateTask(obj);
                let { project } = newTask;
                let index = projects.findIndex(task => task.title === project);
                projects[index].tasks.push(newTask); //task is now in the propper project object in the projects array
                let currentFolder = document.getElementById('folder-title').querySelector('h2').getAttribute('data-heading');
                if (currentFolder.toLowerCase() === project.toLowerCase()) {
                    taskListUL.innerHTML = '';
                    projects[index].tasks.forEach(task => appendLI(task));
                }
            } else if (!obj.project) {
                let newProject = CreateProject(obj);
                projects.push(newProject);
                updateNav(newProject);
            }
            addFormContainer.classList.add('hidden');
            newInputs.reset();
        }
    });

    navUl.addEventListener('click', (e) => {
        let target = e.target;
        if (target.classList.contains('live')) {
            document.querySelector('.selected').classList.remove('selected');
            e.target.classList.add('selected');
            let newHeading = target.text;
            let h2 = document.getElementById('folder-title').querySelector('h2');
            h2.setAttribute('data-heading', `${newHeading.toLowerCase()}`);
            h2.innerHTML = newHeading;
            const dataName = h2.getAttribute('data-heading');
            taskListUL.innerHTML = '';
            printTasks(projects, dataName);
        } else if (target.text === 'Add Project') {
            console.log(target);
        }


    })
        
  };

  export { activateListeners };



  