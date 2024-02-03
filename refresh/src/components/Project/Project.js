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

  // asign this varaible to = summary
  const summaryText = "This is a summary of the project, including information about tab groups and other relevant details.";

  

//   return (
//     <div
//       className={`project ${isActive ? 'active' : ''} ${isDetailsExpanded ? 'expanded' : ''}`}
//       onClick={() => !isEditing && onClick(project.id)}
//       onDoubleClick={handleDoubleClick}
//     >
//       {isEditing ? (
//         <div className="edit-fields">
//         <input className="edit-name" value={editedName} onChange={handleNameChange} placeholder="Project Name" />
//         <textarea className="edit-description" value={editedDescription} onChange={handleDescriptionChange} placeholder="Project Description"></textarea>
//         <button className = "saveAndCancelSAVE" onClick={saveChanges}>Save</button>
//         <button className = "saveAndCancelCANCEL" onClick={toggleEdit}>Cancel</button>
//       </div>
//       ) : (
//         <>
//           <h2 onDoubleClick={toggleEdit}>
//             {project.name}
//             <span onClick={(e) => {e.stopPropagation(); toggleEdit();}} className="edit-icon">
//                 <FontAwesomeIcon className = "pencil" icon={faPencilAlt} />
//           </span></h2>
//           {isActive && (
//             <>
//             <p onDoubleClick={toggleEdit}>{project.description}</p>
              
//               {/* Summary Section */}
//               {isDetailsExpanded && (
//                 <h1>Summary</h1>
//               )}
//               {/* Summary Text */}
//               {isDetailsExpanded && (
//                 <h3>{summaryText}</h3>
//               )}

//               <p onDoubleClick={toggleEdit}>{project.description}</p>
//               <button onClick={handleDelete} className="delete-button">
//                   <FontAwesomeIcon icon={faTrash} />
//               </button>              
//               {/* <button className ="toggle-details-button" onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}>
//                 Show/Hide
//               </button> */}
//               <div className={`project-details ${isDetailsExpanded ? 'expanded' : ''}`}>
//                 {/* Render project details here */}
//               </div>
//               {project.tabs.map((tab) => (
//                 <Tab key={tab.id} tab={tab} />
//               ))}

//               {/* Show/Hide Button moved to bottom left */}
//               <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
//                 <button className="toggle-details-button" onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}>
//                   {isDetailsExpanded ? 'Hide' : 'Show'}
//                 </button>
//               </div>
//             </>
//           )}
//         </>
//       )}
//     </div>
//   );
// };
  return (
    <div
      className={`project ${isActive ? 'active' : ''} ${isDetailsExpanded ? 'expanded' : ''}`}
      onClick={() => !isEditing && onClick(project.id)}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <div className="edit-fields">
          <input className="edit-name" value={editedName} onChange={handleNameChange} placeholder="Project Name" />
          <textarea className="edit-description" value={editedDescription} onChange={handleDescriptionChange} placeholder="Project Description"></textarea>
          <button className="saveAndCancelSAVE" onClick={saveChanges}>Save</button>
          <button className="saveAndCancelCANCEL" onClick={toggleEdit}>Cancel</button>
        </div>
      ) : (
        <>
          <h2 onDoubleClick={toggleEdit}>
            {project.name}
            <span onClick={(e) => {e.stopPropagation(); toggleEdit();}} className="edit-icon">
              <FontAwesomeIcon className="pencil" icon={faPencilAlt} />
            </span>
          </h2>
          {isActive && (
            <>
              <p onDoubleClick={toggleEdit}>{project.description}</p>
                
              {/* Summary Section */}
              {isDetailsExpanded && (
                <>
                  <h1>Summary</h1>
                  <h3>{summaryText}</h3>
                </>
              )}

              {/* Render Tabs - Assuming you still want to render the tabs */}
              {isDetailsExpanded && project.tabs.map((tab) => (
                <Tab key={tab.id} tab={tab} />
              ))}

              {/* Show/Hide Button moved to bottom left */}
              <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
                <button className="toggle-details-button" onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}>
                  {isDetailsExpanded ? 'Hide' : 'Show'}
                </button>
              </div>
                
              <button onClick={handleDelete} className="delete-button">
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Project;
