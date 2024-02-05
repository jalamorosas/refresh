import React, { useState, useEffect } from 'react';
import Project from '../Project/Project';
import './App.css';
import cucSlice from '../../images/cucSlice.png';
import testData from './testData'; // Same level as App.js

const App = () => {
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);

  const handleProjectDoubleClick = (projectId) => {
    setActiveProjectId(projectId);
  };

  const addProject = (name, description) => {
    const newProject = {
      id: Date.now(),
      name,
      description,
      tabs: [{ id: Date.now(), name: 'Default Tab', content: 'Default content' }], // Start with a default tab
    };
    setProjects([...projects, newProject]);
  };

  const deleteProject = (projectId) => {
    setProjects(projects.filter(project => project.id !== projectId));
  };

  const addTabToProject = (projectId, newTab) => {
    setProjects((prevProjects) => prevProjects.map((project) => {
      return project.id === projectId
        ? { ...project, tabs: [...project.tabs, newTab] }
        : project;
    }));
  };

  const handleProjectClick = (projectId) => {
    // Toggle active state
    setActiveProjectId(projectId);
  };

  useEffect(() => {
    // Define a single project ID for all testData tabs
    const testDataProjectId = `project-${Date.now()}`;
    const testDataProjectName = 'Test Data Project';
    const testDataProjectDescription = 'Generated from testData';
  
    // Check if the test data project already exists, if not, create it
    if (!projects.some(project => project.id === testDataProjectId)) {
      addProject(testDataProjectName, testDataProjectDescription);
    }
  
    // Process the test data and add each entry as a tab to the test data project
    testData.forEach((entry) => {
      const [title, url] = entry;
      const newTab = { id: Date.now().toString(), name: title, content: url };
      addTabToProject(testDataProjectId, newTab);
    });
  }, []); // Empty array ensures this effect runs only once
  // useEffect(() => {
  //   const receiveMessage = (event) => {
  //     if (event.source === window && event.data && event.data.type === "FROM_EXTENSION") {
  //       const data = event.data.data;

  //       // Process the received data
  //       testDataata.forEach((entry) => {
  //         const [title, url] = entry;
  //         const newProjectId = Date.now().toString(); // Use timestamp as a unique ID
  //         const newProject = {
  //           id: newProjectId,
  //           name: title, // Use the title as the project name
  //           description: 'Generated from Chrome Extension',
  //           tabs: [{ id: Date.now(), name: title, content: url }], // Use the title and URL for the default tab
  //         };
          
  //         setProjects((prevProjects) => [...prevProjects, newProject]);
  //       });
  //     }
  //   };

  //   window.addEventListener("message", receiveMessage);

  //   return () => {
  //     window.removeEventListener("message", receiveMessage);
  //   };
  // }, []); // Removed projects from the dependencies array

  const updateProject = (projectId, newName, newDescription) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        return { ...project, name: newName, description: newDescription };
      }
      return project;
    }));
  };

  const refreshProjects = () => {
    // This function should handle the logic for refreshing projects,
    // e.g., fetching them from a server or resetting to initial state
  };


  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">
          <img src={cucSlice} alt="Cucumber Slice" className="navbar-image" />
          <span className="refresh-text" onClick={refreshProjects}>refresh</span>
          <button className="menu-button">☰</button>
        </div>
      </nav>
      <div className="project-grid">
        {projects.map(project => (
          <Project
            key={project.id}
            project={project}
            isActive={project.id === activeProjectId}
            onClick={handleProjectClick}
            onUpdate={updateProject}
            onDelete={deleteProject}
            onDoubleClick={handleProjectDoubleClick}
          />
        ))}
        <button onClick={() => addProject('New Project', 'Goal of the new project')} className="create-new-button">
          Create New Project
        </button>
      </div>
    </div>
  );
};

export default App;
