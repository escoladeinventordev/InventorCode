import objectID from 'bson-objectid';
import * as ActionTypes from '../../../constants';

const defaultSketch = `//coloque suas variaveis abaixo


function setup() {
  
}

function draw() {
  
}`;

const defaultHTML =
`<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/p5.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/addons/p5.dom.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.9.0/addons/p5.sound.min.js"></script>
    <script src="https://rawcdn.githack.com/fabiojavaroni/lib/fabbe712f5eab584006b79e76b50f8679b77e494/Preload.js"></script>
    <script src="https://rawcdn.githack.com/molleindustria/p5.play/42cd19c39f6f508e4a73c20eaaeb490b97022840/lib/p5.play.js"></script>
    <script src="https://rawcdn.githack.com/fabiojavaroni/lib/70c615e68c36dcfb660fc997e0f0340f84f19f86/easyEditor.js"></script>
    <script src="https://rawcdn.githack.com/fabiojavaroni/lib/e9aff16b88b293dfc1ac803d4d4ccbaec60a663d/fundo_VS_3_Com Sprites.js"></script>
    <script src="https://rawcdn.githack.com/fabiojavaroni/lib/6c03b39794bfc78c170b59836dd521067c41e71e/Sprites_VS_3.js"></script>
    <script src="https://rawcdn.githack.com/yining1023/p5PlayGround/cad807762776d1f29820bc9f35f36e98cc18d934/js/jquery.js" type="text/javascript"> </script>
    <script src="https://rawcdn.githack.com/leonardof131/mousePosP5js/280d22c78e510f1677fb246c62bd7ed755bbe0db/jquery.ruler.js"></script>
    <script>$(function() {$('body').ruler({vRuleSize: 0,hRuleSize: 0,showCrosshair : false,showMousePos: true});});</script>
    <link href="https://rawcdn.githack.com/leonardof131/mousePosP5js/280d22c78e510f1677fb246c62bd7ed755bbe0db/jquery.ruler.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="style.css">
    <meta charset="utf-8" />

  </head>
  <body>
    <script src="sketch.js"></script>
  </body>
</html>
`;

const defaultCSS =
`html, body {
  margin: 0;
  padding: 0;
}
canvas {
  display: block;
}
`;

const initialState = () => {
  const a = objectID().toHexString();
  const b = objectID().toHexString();
  const c = objectID().toHexString();
  const r = objectID().toHexString();
  return [
    {
      name: 'root',
      id: r,
      _id: r,
      children: [a, b, c],
      fileType: 'folder',
      content: ''
    },
    {
      name: 'sketch.js',
      content: defaultSketch,
      id: a,
      _id: a,
      isSelectedFile: true,
      fileType: 'file',
      children: []
    },
    {
      name: 'index.html',
      content: defaultHTML,
      id: b,
      _id: b,
      fileType: 'file',
      children: []
    },
    {
      name: 'style.css',
      content: defaultCSS,
      id: c,
      _id: c,
      fileType: 'file',
      children: []
    }];
};

function getAllDescendantIds(state, nodeId) {
  return state.find(file => file.id === nodeId).children
    .reduce((acc, childId) => (
      [...acc, childId, ...getAllDescendantIds(state, childId)]
    ), []);
}

function deleteChild(state, parentId, id) {
  const newState = state.map((file) => {
    if (file.id === parentId) {
      const newFile = Object.assign({}, file);
      newFile.children = newFile.children.filter(child => child !== id);
      return newFile;
    }
    return file;
  });
  return newState;
}

function deleteMany(state, ids) {
  const newState = [...state];
  ids.forEach((id) => {
    let fileIndex;
    newState.find((file, index) => {
      if (file.id === id) {
        fileIndex = index;
      }
      return file.id === id;
    });
    newState.splice(fileIndex, 1);
  });
  return newState;
}

const files = (state, action) => {
  if (state === undefined) {
    state = initialState(); // eslint-disable-line
  }
  switch (action.type) {
    case ActionTypes.UPDATE_FILE_CONTENT:
      return state.map((file) => {
        if (file.id !== action.id) {
          return file;
        }

        return Object.assign({}, file, { content: action.content });
      });
    case ActionTypes.SET_BLOB_URL:
      return state.map((file) => {
        if (file.id !== action.id) {
          return file;
        }
        return Object.assign({}, file, { blobURL: action.blobURL });
      });
    case ActionTypes.NEW_PROJECT:
      return [...action.files];
    case ActionTypes.SET_PROJECT:
      return [...action.files];
    case ActionTypes.RESET_PROJECT:
      return initialState();
    case ActionTypes.CREATE_FILE: // eslint-disable-line
    {
      const newState = state.map((file) => {
        if (file.id === action.parentId) {
          const newFile = Object.assign({}, file);
          newFile.children = [...newFile.children, action.id];
          return newFile;
        }
        return file;
      });
      return [...newState,
        {
          name: action.name,
          id: action.id,
          _id: action._id,
          content: action.content,
          url: action.url,
          children: action.children,
          fileType: action.fileType || 'file'
        }];
    }
    case ActionTypes.UPDATE_FILE_NAME:
      return state.map((file) => {
        if (file.id !== action.id) {
          return file;
        }

        return Object.assign({}, file, { name: action.name });
      });
    case ActionTypes.DELETE_FILE:
    {
      const newState = deleteMany(state, [action.id, ...getAllDescendantIds(state, action.id)]);
      return deleteChild(newState, action.parentId, action.id);
      // const newState = state.map((file) => {
      //   if (file.id === action.parentId) {
      //     const newChildren = file.children.filter(child => child !== action.id);
      //     return { ...file, children: newChildren };
      //   }
      //   return file;
      // });
      // return newState.filter(file => file.id !== action.id);
      //teste
    }
    case ActionTypes.SET_SELECTED_FILE:
      return state.map((file) => {
        if (file.id === action.selectedFile) {
          return Object.assign({}, file, { isSelectedFile: true });
        }
        return Object.assign({}, file, { isSelectedFile: false });
      });
    case ActionTypes.SHOW_FOLDER_CHILDREN:
      return state.map((file) => {
        if (file.id === action.id) {
          return Object.assign({}, file, { isFolderClosed: false });
        }
        return file;
      });
    case ActionTypes.HIDE_FOLDER_CHILDREN:
      return state.map((file) => {
        if (file.id === action.id) {
          return Object.assign({}, file, { isFolderClosed: true });
        }
        return file;
      });
    default:
      return state;
  }
};

export const getHTMLFile = state => state.filter(file => file.name.match(/.*\.html$/i))[0];
export const getJSFiles = state => state.filter(file => file.name.match(/.*\.js$/i));
export const getCSSFiles = state => state.filter(file => file.name.match(/.*\.css$/i));
export const getLinkedFiles = state => state.filter(file => file.url);

export default files;
//teste