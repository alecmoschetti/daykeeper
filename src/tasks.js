
      import {setCompleted, setDeletionOfTask, setDeletionOfProject} from './storage'

      let projects = {}; 
      let completed = []; 
      let all = [];

      //project factory function
      function CreateProject(obj) {
        let {title} = obj;
        let tasks = [];
        return {
          title, 
          tasks
        };
      };
  
      //task factory function
      function CreateTask(obj) {
        let {title, priority, project} = obj;
        let status = false;
        let dateCreated = new Date();
        return {          
          title,
          priority,
          project,
          status,
          dateCreated,
          complete: function(obj, proj, task) {
            this.status = true;
            completeTask(obj, proj, task);
          }
        };
      }

      //helper functions
    function deleteSpacesInStrings(str) {
        if (/\s/.test(str)) {
            // It has any kind of whitespace
            str = str.replace(/ +/g, "");
        }
        return str;
    }

    function getTaskIndex(proj, task) {
        let project = getProject(proj);
        let taskIndex = project.tasks.findIndex(obj => obj.title === task);
        return taskIndex;
    }

    function getProject(name) {
      let project = projects[name];
      return project;
  }

  function getTask(proj, task) {
      let project = getProject(proj)
      if (!project) {
        //maybe?
      } else {
        let taskIndex = getTaskIndex(proj, task);
        let todo = project.tasks[taskIndex];
        return todo;
      }
}

      function removeTask(obj, proj, task) {
        if (obj === all || obj === completed) { //objects are our global arrays of task objects
          let taskNoSpaces = deleteSpacesInStrings(task);
          let taskIndex = obj.findIndex(todo => todo.title === taskNoSpaces); //objects are actually arrays which is why array methods are working here
          let removed = obj.splice(taskIndex, 1);
          return removed;
        } else { //obj is equal to our global projects object
          let taskIndex = getTaskIndex(proj, task);
          let removed = obj[proj].tasks.splice(taskIndex, 1);
          return removed;
        }
      }

      function removeProject(proj, name) {
        delete projects[proj];
        setDeletionOfProject(name);
      }

      function completeTask(obj, proj, task) {
        let completedTask = removeTask(obj, proj, task); //return the removed task object into a variable
        completedTask.status = true;
        completed.push(completedTask); //push that object into our global completed array
        setCompleted(completedTask);
        setDeletionOfTask(proj, completedTask);
      }

      function sortingLogic(obj, proj, method) {
        if (obj === all) {
          if (method === 'alphabetical') {
            let sortedArr = obj.sort((a, b) => a.title.localeCompare(b.title));
            return sortedArr;
          } else if (method === 'priority') {
            let sortedArr = obj.sort((a, b) => a.priority.localeCompare(b.priority));
            return sortedArr;
          } else if (method === 'recent') {
              let sortedArr = obj.sort((a, b) => a.dateCreated - b.dateCreated);
              return sortedArr;
          }
        } else if (obj === completed) {
          let flattened = obj.flat(1);
          if (method === 'alphabetical') {
            let sortedArr = flattened.sort((a, b) => a.title.localeCompare(b.title));
            return sortedArr;
          } else if (method === 'priority') {
            let sortedArr = flattened.sort((a, b) => a.priority.localeCompare(b.priority));
            return sortedArr;
          } else if (method === 'recent') {
              let sortedArr = flattened.sort((a, b) => a.dateCreated - b.dateCreated)
              return sortedArr;
          }
        } else {
            if (method === 'alphabetical') {
              let sortedArr = obj[proj].tasks.sort((a, b) => a.title.localeCompare(b.title));
              return sortedArr;
            } else if (method === 'priority') {
              let sortedArr = obj[proj].tasks.sort((a, b) => a.priority.localeCompare(b.priority));
              return sortedArr;
            } else if (method === 'recent') {
                let sortedArr = obj[proj].tasks.sort((a, b) => a.dateCreated - b.dateCreated)
                return sortedArr;
            }
        }
      }

      function sortTasks(obj, proj, choice) {
        switch(true) {
          case (choice === 'alphabetical'): 
            let sortedAlpha = sortingLogic(obj, proj, choice);
            return sortedAlpha;
          case (choice === 'priority'): 
            let sortedPriority = sortingLogic(obj, proj, choice);
            return sortedPriority;
          case (choice === 'recent'): 
            let sortedRecent = sortingLogic(obj, proj, choice);
            return sortedRecent;
        }
      }

      export { CreateProject, CreateTask, getProject, getTask, removeTask, removeProject, deleteSpacesInStrings, sortTasks, completeTask, projects, completed, all };