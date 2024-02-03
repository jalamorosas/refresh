import React, { useState } from 'react';
import Project from '../Project/Project';
import './App.css';
import cucSlice from '../../images/cucSlice.png';

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

  // if (projects.length > 0 && projects[0].tabs.length === 0) {
  //   addTabToProject(projects[0].id, 'First Tab', 'Content of the first tab');
  // }

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

