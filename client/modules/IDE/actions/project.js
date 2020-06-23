import { browserHistory } from 'react-router';
import axios from 'axios';
import objectID from 'bson-objectid';
import each from 'async/each';
import isEqual from 'lodash/isEqual';
import * as ActionTypes from '../../../constants';
import { showToast, setToastText } from './toast';
import {
  setUnsavedChanges,
  justOpenedProject,
  resetJustOpenedProject,
  showErrorModal,
  setPreviousPath
} from './ide';
import { clearState, saveState } from '../../../persistState';

const __process = (typeof global !== 'undefined' ? global : window).process;
const ROOT_URL = __process.env.API_URL;

export function setProject(project) {
  return {
    type: ActionTypes.SET_PROJECT,
    project,
    files: project.files,
    owner: project.user
  };
}

export function setProjectName(name) {
  return {
    type: ActionTypes.SET_PROJECT_NAME,
    name
  };
}

export function projectSaveFail(error) {
  return {
    type: ActionTypes.PROJECT_SAVE_FAIL,
    error
  };
}

export function setNewProject(project) {
  return {
    type: ActionTypes.NEW_PROJECT,
    project,
    owner: project.user,
    files: project.files
  };
}

export function getProject(id) {
  return (dispatch, getState) => {
    dispatch(justOpenedProject());
    axios.get(`${ROOT_URL}/projects/${id}`, { withCredentials: true })
      .then((response) => {
        dispatch(setProject(response.data));
        dispatch(setUnsavedChanges(false));
      })
      .catch(response => dispatch({
        type: ActionTypes.ERROR,
        error: response.data
      }));
  };
}

export function persistState() {
  return (dispatch, getState) => {
    dispatch({
      type: ActionTypes.PERSIST_STATE,
    });
    const state = getState();
    saveState(state);
  };
}

export function clearPersistedState() {
  return (dispatch) => {
    dispatch({
      type: ActionTypes.CLEAR_PERSISTED_STATE,
    });
    clearState();
  };
}

export function startSavingProject() {
  return {
    type: ActionTypes.START_SAVING_PROJECT
  };
}

export function endSavingProject() {
  return {
    type: ActionTypes.END_SAVING_PROJECT
  };
}

export function projectSaveSuccess() {
  return {
    type: ActionTypes.PROJECT_SAVE_SUCCESS
  };
}

// want a function that will check for changes on the front end
function getSynchedProject(currentState, responseProject) {
  let hasChanges = false;
  const synchedProject = Object.assign({}, responseProject);
  const currentFiles = currentState.files.map(({ name, children, content }) => ({ name, children, content }));
  const responseFiles = responseProject.files.map(({ name, children, content }) => ({ name, children, content }));
  if (!isEqual(currentFiles, responseFiles)) {
    synchedProject.files = currentState.files;
    hasChanges = true;
  }
  if (currentState.project.name !== responseProject.name) {
    synchedProject.name = currentState.project.name;
    hasChanges = true;
  }
  return {
    synchedProject,
    hasChanges
  };
}

export function saveProject(selectedFile = null, autosave = false) {
  return (dispatch, getState) => {
    const state = getState();
    if (state.project.isSaving) {
      return Promise.resolve();
    }
    dispatch(startSavingProject());
    if (state.user.id && state.project.owner && state.project.owner.id !== state.user.id) {
      return Promise.reject();
    }
    const formParams = Object.assign({}, state.project);
    formParams.files = [...state.files];
    if (selectedFile) {
      const fileToUpdate = formParams.files.find(file => file.id === selectedFile.id);
      fileToUpdate.content = selectedFile.content;
    }
    if (state.project.id) {
      return axios.put(`${ROOT_URL}/projects/${state.project.id}`, formParams, { withCredentials: true })
        .then((response) => {
          dispatch(endSavingProject());
          dispatch(setUnsavedChanges(false));
          const { hasChanges, synchedProject } = getSynchedProject(getState(), response.data);
          if (hasChanges) {
            dispatch(setUnsavedChanges(true));
          }
          dispatch(setProject(synchedProject));
          dispatch(projectSaveSuccess());
          if (!autosave) {
            if (state.ide.justOpenedProject && state.preferences.autosave) {
              dispatch(showToast(5500));
              dispatch(setToastText('Project saved.'));
              setTimeout(() => dispatch(setToastText('Autosave enabled.')), 1500);
              dispatch(resetJustOpenedProject());
            } else {
              dispatch(showToast(1500));
              dispatch(setToastText('Project saved.'));
            }
          }
        })
        .catch((response) => {
          dispatch(endSavingProject());
          if (response.status === 403) {
            dispatch(showErrorModal('staleSession'));
          } else if (response.status === 409) {
            dispatch(showErrorModal('staleProject'));
          } else {
            dispatch(projectSaveFail(response.data));
          }
        });
    }

    return axios.post(`${ROOT_URL}/projects`, formParams, { withCredentials: true })
      .then((response) => {
        dispatch(endSavingProject());
        const { hasChanges, synchedProject } = getSynchedProject(getState(), response.data);
        if (hasChanges) {
          dispatch(setNewProject(synchedProject));
          dispatch(setUnsavedChanges(false));
          browserHistory.push(`/${response.data.user.username}/sketches/${response.data.id}`);
          dispatch(setUnsavedChanges(true));
        } else {
          dispatch(setNewProject(synchedProject));
          dispatch(setUnsavedChanges(false));
          browserHistory.push(`/${response.data.user.username}/sketches/${response.data.id}`);
        }
        dispatch(projectSaveSuccess());
        if (!autosave) {
          if (state.preferences.autosave) {
            dispatch(showToast(5500));
            dispatch(setToastText('Project saved.'));
            setTimeout(() => dispatch(setToastText('Autosave enabled.')), 1500);
            dispatch(resetJustOpenedProject());
          } else {
            dispatch(showToast(1500));
            dispatch(setToastText('Project saved.'));
          }
        }
      })
      .catch((response) => {
        dispatch(endSavingProject());
        if (response.status === 403) {
          dispatch(showErrorModal('staleSession'));
        } else {
          dispatch(projectSaveFail(response.data));
        }
      });
  };
}

export function autosaveProject() {
  return (dispatch, getState) => {
    saveProject(null, true)(dispatch, getState);
  };
}

export function exportProjectAsZip(projectId) {
  const win = window.open(`${ROOT_URL}/projects/${projectId}/zip`, '_blank');
  win.focus();
}

export function resetProject() {
  return {
    type: ActionTypes.RESET_PROJECT
  };
}

export function newProject() {
  setTimeout(() => {
    browserHistory.push('/');
  }, 0);
  return resetProject();
}

function generateNewIdsForChildren(file, files) {
  const newChildren = [];
  file.children.forEach((childId) => {
    const child = files.find(childFile => childFile.id === childId);
    const newId = objectID().toHexString();
    child.id = newId;
    child._id = newId;
    newChildren.push(newId);
    generateNewIdsForChildren(child, files);
  });
  file.children = newChildren; // eslint-disable-line
}

export function cloneProject(id) {
  return (dispatch, getState) => {
    dispatch(setUnsavedChanges(false));
    new Promise((resolve, reject) => {
      if (!id) {
        resolve(getState());
      } else {
        fetch(`${ROOT_URL}/projects/${id}`)
          .then(res => res.json())
          .then(data => resolve({
            files: data.files,
            project: {
              name: data.name
            }
          }));
      }
    }).then((state) => {
      const newFiles = state.files.map((file) => { // eslint-disable-line
        return { ...file };
      });

      // generate new IDS for all files
      const rootFile = newFiles.find(file => file.name === 'root');
      const newRootFileId = objectID().toHexString();
      rootFile.id = newRootFileId;
      rootFile._id = newRootFileId;
      generateNewIdsForChildren(rootFile, newFiles);

      // duplicate all files hosted on S3
      each(newFiles, (file, callback) => {
        if (file.url && file.url.includes('amazonaws')) {
          const formParams = {
            url: file.url
          };
          axios.post(`${ROOT_URL}/S3/copy`, formParams, { withCredentials: true })
            .then((response) => {
              file.url = response.data.url;
              callback(null);
            });
        } else {
          callback(null);
        }
      }, (err) => {
        // if not errors in duplicating the files on S3, then duplicate it
        const formParams = Object.assign({}, { name: `${state.project.name} copy` }, { files: newFiles });
        axios.post(`${ROOT_URL}/projects`, formParams, { withCredentials: true })
          .then((response) => {
            browserHistory.push(`/${response.data.user.username}/sketches/${response.data.id}`);
            dispatch(setNewProject(response.data));
          })
          .catch(response => dispatch({
            type: ActionTypes.PROJECT_SAVE_FAIL,
            error: response.data
          }));
      });
    });
  };
}

export function showEditProjectName() {
  return {
    type: ActionTypes.SHOW_EDIT_PROJECT_NAME
  };
}

export function hideEditProjectName() {
  return {
    type: ActionTypes.HIDE_EDIT_PROJECT_NAME
  };
}

export function setProjectSavedTime(updatedAt) {
  return {
    type: ActionTypes.SET_PROJECT_SAVED_TIME,
    value: updatedAt
  };
}

export function changeProjectName(id, newName) {
  return (dispatch, getState) => {
    const state = getState();
    axios.put(`${ROOT_URL}/projects/${id}`, { name: newName }, { withCredentials: true })
      .then((response) => {
        if (response.status === 200) {
          dispatch({
            type: ActionTypes.RENAME_PROJECT,
            payload: { id: response.data.id, name: response.data.name }
          });
          if (state.project.id === response.data.id) {
            dispatch({
              type: ActionTypes.SET_PROJECT_NAME,
              name: response.data.name
            });
          }
        }
      })
      .catch((response) => {
        console.log(response);
        dispatch({
          type: ActionTypes.PROJECT_SAVE_FAIL,
          error: response.data
        });
      });
  };
}

export function deleteProject(id) {
  return (dispatch, getState) => {
    axios.delete(`${ROOT_URL}/projects/${id}`, {
      withCredentials: true
    })
      .then(() => {
        const state = getState();
        if (id === state.project.id) {
          dispatch(resetProject());
          dispatch(setPreviousPath('/'));
        }
        dispatch({
          type: ActionTypes.DELETE_PROJECT,
          id
        });
      })
      .catch((response) => {
        if (response.status === 403) {
          dispatch(showErrorModal('staleSession'));
        } else {
          dispatch({
            type: ActionTypes.ERROR,
            error: response.data
          });
        }
      });
  };
}
