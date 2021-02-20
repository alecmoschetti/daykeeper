      //project factory function
      const CreateProject = function(obj) {
        let {title, priority, notes} = obj;
        let status = false;
        let tasks = [];
        return {
          title, 
          priority, 
          notes, 
          status, 
          tasks, 
          complete: function complete() {
              this.status = true;
          }
        };
      };
  
      //task factory function
      const CreateTask = function(obj) {
        let {title, priority, notes, project} = obj;
        let status = false;
        return {          
          title,
          priority,
          notes,
          project,
          status,
          complete: function complete() {
            this.status = true;
          }
        };
      }

      export {CreateProject, CreateTask};