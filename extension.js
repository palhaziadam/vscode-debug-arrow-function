const vscode = require('vscode');

const insertText = (val) => {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
        vscode.window.showErrorMessage('Can\'t work because no document is open');
        return;
    }

    const selection = editor.selection;

    const range = new vscode.Range(selection.start, selection.end);

    editor.edit((editBuilder) => {
        editBuilder.replace(range, val);
    });
}

function activate(context) {
    const insertLogStatement = vscode.commands.registerCommand('extension.removeArrow', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        const selection = editor.selection;
        const text = editor.document.getText(selection);

        if (text) {
            const lastChar = text.charAt(text.length - 1);
            let newText;
            if (lastChar === ';') {
                newText = text.substring(0, text.length - 1);
                const logToInsert = `{
                    console.log('debug: ', ${newText});
                    return ${newText};
                };`;
                insertText(logToInsert);
            } else {
                newText = text;
                const logToInsert = `{
                    console.log('debug: ', ${newText});
                    return ${newText};
                }`;
                insertText(logToInsert);
            }
        }
    });
    context.subscriptions.push(insertLogStatement);

    const removeLogStatement = vscode.commands.registerCommand('extension.createArrow', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return; }

        const selection = editor.selection;
        const text = editor.document.getText(selection);

        if (text) {
            let newText = text.substring(text.lastIndexOf('return ') + 7).trim();
            newText = newText.trim();
            const lastChar = newText.charAt(newText.length - 1);
            if (lastChar === '}') {
                newText = newText.substring(0, newText.length - 1);
                newText = newText.trim();
                newText = newText.substring(0, newText.length - 1);
            } else {
                newText = newText.substring(0, newText.length - 2).trim();
            }
            const logToInsert = newText;
            insertText(logToInsert);
        }
    });
    context.subscriptions.push(removeLogStatement);
}
exports.activate = activate;

function deactivate() {
}

exports.deactivate = deactivate;