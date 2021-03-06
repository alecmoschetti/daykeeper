      
      let general = CreateProject({ //our default folder project for our projects array
        title: 'general',
      });
      let projects = [general]; //project folders array
      let completed = []; //
      let all = [];

      //project factory function
      function CreateProject(obj) {
        let {title} = obj;
        let status = false;
        let tasks = [];
        return {
          title, 
          status, 
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
          complete: function(arr, proj, task) {
            this.status = true;
            completeTask(arr, proj, task)

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

    function getProjectIndex(arr, name) {
      let projectIndex = arr.findIndex(project => project.title === name);
      return projectIndex;
    }

    function getTaskIndex(arr, proj, task) {
      let project = getProject(arr, proj);
      let taskIndex = project.tasks.findIndex(obj => obj.title === task);
      return taskIndex;
    }

    function getProject(arr, name) {
      let projectIndex = getProjectIndex(arr, name);
      let getProject = arr[projectIndex];
      return getProject;
  }

  function getTask(arr, proj, task) {
      let project = getProject(arr, proj)
      let taskIndex = getTaskIndex(arr, proj, task);
      let todo = project.tasks[taskIndex];
      return todo;
}

      function removeTask(arr, proj, task) {
        if (arr === all || arr === completed) {
          let taskNoSpaces = deleteSpacesInStrings(task);
          let taskIndex = arr.findIndex(todo => todo.title === taskNoSpaces);
          let removed = arr.splice(taskIndex, 1);
          return removed;
        } else {
          let taskIndex = getTaskIndex(arr, proj, task);
          let projectIndex = getProjectIndex(arr, proj);
          let removed = arr[projectIndex].tasks.splice(taskIndex, 1);
          return removed;
        }
      }

      function removeProject(arr, proj) {
        let projectIndex = getProjectIndex(arr, proj);
        let removed = arr.splice(projectIndex, 1);
        return removed;
      }

      function completeTask(arr, proj, task) {
        let completedTask = removeTask(arr, proj, task);
        completed.push(completedTask);
      }

      function sortingLogic(arr, proj, method) {
        if (arr === all) {
          if (method === 'alphabetical') {
            let sortedArr = arr.sort((a, b) => a.title.localeCompare(b.title));
            return sortedArr;
          } else if (method === 'priority') {
            let sortedArr = arr.sort((a, b) => a.priority.localeCompare(b.priority));
            return sortedArr;
          } else if (method === 'recent') {
              let sortedArr = arr.sort((a, b) => a.dateCreated - b.dateCreated);
              return sortedArr;
          }
        } else if (arr === completed) {
          let flattened = arr.flat(1);
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
              let projectIndex = arr.findIndex(project => project.title === proj);
              let sortedArr = arr[projectIndex].tasks.sort((a, b) => a.title.localeCompare(b.title));
              return sortedArr;
            } else if (method === 'priority') {
              let projectIndex = arr.findIndex(project => project.title === proj);
              let sortedArr = arr[projectIndex].tasks.sort((a, b) => a.priority.localeCompare(b.priority));
              return sortedArr;
            } else if (method === 'recent') {
                let projectIndex = arr.findIndex(project => project.title === proj);
                let sortedArr = arr[projectIndex].tasks.sort((a, b) => a.dateCreated - b.dateCreated)
                return sortedArr;
            }
        }
      }

      function sortTasks(arr, proj, choice) {
        switch(true) {
          case (choice === 'alphabetical'): 
            let sortedAlpha = sortingLogic(arr, proj, choice);
            return sortedAlpha;
          case (choice === 'priority'): 
            let sortedPriority = sortingLogic(arr, proj, choice);
            return sortedPriority;
          case (choice === 'recent'): 
            let sortedRecent = sortingLogic(arr, proj, choice);
            return sortedRecent;
        }
      }

      export {
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
        all };