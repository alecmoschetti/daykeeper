import { all, getProject } from './tasks';

const nav = document.querySelector('nav');
const allSelection = document.querySelector('#allNav');
const taskListUL = document.querySelector("ul.task-list"); //section where our tasks are going to be appended to

let ro = new ResizeObserver( entries => {
    for (let entry of entries) {
      const cr = entry.contentRect;
      (cr.width >= 1300) ? nav.classList.remove('hidden') : nav.classList.add('hidden');
    }
  });

  function deleteSpacesInStrings(str) {
    if (/\s/.test(str)) {
        // It has any kind of whitespace
        str = str.replace(/ +/g, "");
    }
    return str;
}

function toggleNav() {
    nav.classList.toggle('hidden'); //hide or show our nav area
}

function toggleHiddenControls() { //to hide or show the delete project button depending on selected project folder
    let deleteProjectButton = document.querySelector('#deleteProjectButton');
    let selectedNav = document.querySelector('.selected');
    if (selectedNav === allSelection || selectedNav.id === "completedAll") { //if selected folder title is all or completed
        deleteProjectButton.classList.add('hidden'); //hide the delete button
    } else {
        deleteProjectButton.classList.remove('hidden');  //show the delete button
    }
}

function printProjectTasks(title) {
    let project = getProject(title);
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

function newNavSelection(target) { //target will be a nav li inside the nav ul
    let selection = document.querySelector('.selected'); //grab the currently selected nav list item 
    if (selection) { //if that exists
        selection.classList.remove('selected'); //we remove that class
    }
    target.classList.add('selected'); //add our new selected li (the target) the proper class
}

function getHeading() { //returns the existing folder title dom element
    let h2 = document.getElementById('folder-title').querySelector('h2');
    return h2;
}

function setHeading(target) { //makes the project folder title match the targeted nav li item
    let newHeading = target.text; //set a heading variable to be equal to the string value of the text content of our target
    let h2 = getHeading(); //gets the current project folder title heading (please see getHeading helper function)
    h2.setAttribute('data-heading', `${newHeading}`); //set that active heading to new data-heading from our target
    h2.innerHTML = newHeading; //set it's innerHTML to equal the textConent of our nav li target
    const dataName = h2.getAttribute('data-heading'); //grab the recently set data-heading attribute value
    taskListUL.innerHTML = ''; //erase all task list items from the task list ul
    return dataName; 
}

function goToAll() {
    newNavSelection(allSelection); //make the all nav li our selected nav li (see helper function newNavSelection)
    setHeading(allSelection); //make the project folder title match the all nav li
    printTasks(all); //print all the task properties inside our global all object
    toggleHiddenControls(); //hide the delete project button (please see toggleHiddenControls helper function)
}

function appendLI(obj) {
    const {title, priority, status, project} = obj; //object destructuring to make variables out of our desired task object properties
    let titleNoSpaces = deleteSpacesInStrings(title); //for the select option and searching by data-title queries, it's best if we remove the spaces from the title
    let li = document.createElement('li'); 
    li.classList.add('task-item', 'flex'); //adding the appropriate classes to our newly created list item
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
        <p class="taskTitle" id="${titleNoSpaces}">${title}</p>
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
    taskListUL.appendChild(li); //append the newly made task list item to the tasks list on the page
}

export { ro, taskListUL, toggleNav, toggleHiddenControls, printProjectTasks, printTasks, deleteTaskFromDom, newNavSelection, getHeading, setHeading, goToAll, appendLI, deleteSpacesInStrings};