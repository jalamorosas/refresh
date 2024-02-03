import React, { useState } from 'react';
import Tab from '../Tab/Tab';
import './Project.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

const Project = ({ project, isActive, onClick, onUpdate, onDelete, onDoubleClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [editedName, setEditedName] = useState(project.name);
  const [editedDescription, setEditedDescription] = useState(project.description);

  const handleDoubleClick = () => {
    onDoubleClick(project.id); // Call the double-click handler passed from App component
    setIsDetailsExpanded(!isDetailsExpanded); // Toggle the expanded state
  };

  const handleNameChange = (event) => {
    setEditedName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setEditedDescription(event.target.value);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const saveChanges = () => {
    onUpdate(project.id, editedName, editedDescription);
    toggleEdit();
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Stop the click from bubbling up to the parent elements
    if (window.confirm(`Are you sure you want to delete the project "${project.name}"?`)) {
      onDelete(project.id);
    }
  };
  

  return (
    <div
      className={`project ${isActive ? 'active' : ''} ${isDetailsExpanded ? 'expanded' : ''}`}
      onClick={() => !isEditing && onClick(project.id)}
      onDoubleClick={handleDoubleClick}
    >
      {/* {isActive && isDetailsExpanded && (
        <div className="project-links">
          {project.links.map((linkObj, index) => (
            <div key={index} className="link">
              <h3>{linkObj.header}</h3>
              <a href={linkObj.link} target="_blank" rel="noopener noreferrer">{linkObj.link}</a>
            </div>
          ))}
        </div>
      )} */}
      {/* Last Session's Tabs  */} 
      <div className="last-sessions-tabs">
            <h3>Last Session's Tabs</h3>
            <div className="tabs-grid">
              {project.tabs.map(tab => (
                <Tab key={tab.id} tab={tab} />
              ))}
            </div>
      </div>
      {isEditing ? (
        <div className="edit-fields">
        <input className="edit-name" value={editedName} onChange={handleNameChange} placeholder="Project Name" />
        <textarea className="edit-description" value={editedDescription} onChange={handleDescriptionChange} placeholder="Project Description"></textarea>
        <button onClick={saveChanges}>Save</button>
        <button onClick={toggleEdit}>Cancel</button>
      </div>
      ) : (
        <>
          <h2 onDoubleClick={toggleEdit}>
            {project.name}
            <span onClick={(e) => {e.stopPropagation(); toggleEdit();}} className="edit-icon">
                <FontAwesomeIcon className = "pencil" icon={faPencilAlt} />
          </span></h2>
          {isActive && (
            <>
              <p onDoubleClick={toggleEdit}>{project.description}</p>
              <button onClick={handleDelete} className="delete-button">
                  <FontAwesomeIcon icon={faTrash} />
              </button>              
              <button className ="toggle-details-button" onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}>
                Show/Hide
              </button>
              <div className={`project-details ${isDetailsExpanded ? 'expanded' : ''}`}>
                {/* Render project details here */}
              </div>
              {project.tabs.map((tab) => (
                <Tab key={tab.id} tab={tab} />
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Project;
