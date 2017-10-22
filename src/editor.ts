'use strict'

import * as vscode from 'vscode';

export class Editor{
    /**
     * insert
     */
    public insert(content, pos) {
        let editor = vscode.window.activeTextEditor;
        // let _r = new vscode.Range(new vscode.Position(range[0].line, range[0].character), new vscode.Position(range[1].line, range[1].character))
        let _p = new vscode.Position(pos.line, pos.character);

        if(!editor){
            vscode.window.showErrorMessage("No open file!!");
            return;
        }

        editor.edit((editBuilder) =>{
            editBuilder.insert(_p, content);
        });

    }
}