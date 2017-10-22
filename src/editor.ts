'use strict'

import * as vscode from 'vscode';

export class Editor{
    /**
     * insert
     */
    public insert(content, range) {
        let e = vscode.window.activeTextEditor;
        let _r = new vscode.Range(new vscode.Position(range[0].line, range[0].character), new vscode.Position(range[1].line, range[1].character))

        if(!e){
            vscode.window.showErrorMessage("No open file!!");
            return;
        }

        e.edit((editBuilder) =>{
            editBuilder.replace(_r, content);
            e.selection = new vscode.Selection(new vscode.Position(e.selection.end.line, e.selection.end.character), new vscode.Position(e.selection.end.line, e.selection.end.character + 1))
        });

    }
}