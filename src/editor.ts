'use strict'

import * as vscode from 'vscode';

export class Editor{
    /**
     * insert
     */
    public insert(content, range) {
        let editor = vscode.window.activeTextEditor;

        if(!editor){
            vscode.window.showErrorMessage("No open file!!");
            return;
        }

        editor.edit((editBuilder) =>{
            editBuilder.insert(range, content);
        });

    }
}