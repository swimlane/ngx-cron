import CodeMirrorDefault from 'codemirror/lib/codemirror.js';

// ngx-ui uses `import * as CodeMirror from 'codemirror'` and expects static methods on the namespace.
export default CodeMirrorDefault;
export const defineMode = CodeMirrorDefault.defineMode;
export const getMode = CodeMirrorDefault.getMode;
export const overlayMode = CodeMirrorDefault.overlayMode;
export const fromTextArea = CodeMirrorDefault.fromTextArea;
export const commands = CodeMirrorDefault.commands;
export const Pos = CodeMirrorDefault.Pos;
