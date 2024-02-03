import React, { useState, useEffect } from 'react';
import Project from '../Project/Project';
import './App.css';
import cucSlice from '../../images/cucSlice.png';
import Tab from '../Tab/Tab';

const App = () => {
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [anyProjectIsExpanded, setAnyProjectIsExpanded] = useState(false);

  const handleProjectDoubleClick = (projectId) => {
    setAnyProjectIsExpanded(true);
    setActiveProjectId(projectId);
  };

  const addProject = (name, description) => {
    const newProject = { id: Date.now(), name, description, tabs: [] };
    setProjects([...projects, newProject]);
  };

  const deleteProject = (projectId) => {
    setProjects(projects.filter(project => project.id !== projectId));
  };

  const addTabToProject = (projectId, tabName, tabContent) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        const newTab = { id: Date.now(), name: tabName, content: tabContent };
        return { ...project, tabs: [...project.tabs, newTab] };
      }
      return project;
    }));
  };

  const handleProjectClick = (projectId) => {
    setActiveProjectId(projectId);
  };

  useEffect(() => {
    const receiveMessage = (event) => {
      if (event.source === window && event.data && event.data.type === "FROM_EXTENSION") {
        const data = event.data.data; // This is your array of arrays
        console.log(data)
  
        // Example of processing the received data
        // Assuming each entry is [title, url], and you want to create a new project for each
        data.forEach((entry, index) => {
          const [title, url] = entry;
          // For simplicity, using index as projectId, adjust as necessary
          const projectId = `project-${index}`;
          const tabName = title; // Assuming the title is what you want to name the tab
          const tabContent = url; // Using the URL as tab content, adjust as necessary
          
          // Check if the project exists
          const projectExists = projects.some(project => project.id === projectId);
          if (!projectExists) {
            addProject(`Project ${projectId}`, 'Generated from Chrome Extension');
          }
          // Add the tab to the project
          setTimeout(() => addTabToProject(projectId, tabName, tabContent), 0);
        });
      }
    };
  
    window.addEventListener("message", receiveMessage);
  
    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, [projects]);

  const updateProject = (projectId, newName, newDescription) => {
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        return { ...project, name: newName, description: newDescription };
      }
      return project;
    }));
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">
          <img src={cucSlice} alt="Cucumber Slice" className="navbar-image" />
          <span className="refresh-text">refresh</span>
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
