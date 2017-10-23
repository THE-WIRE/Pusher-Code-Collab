'use strict'

import * as vscode from 'vscode';

export class Editor{
    /**
     * insert
     */
    public insert(content, range):any {
        let e = vscode.window.activeTextEditor;
        // let _r = new vscode.Range(new vscode.Position(range[0].line, range[0].character), new vscode.Position(range[1].line, range[1].character))
        let _p = new vscode.Position(range[0].line, range[0].character);

        if(!e){
            vscode.window.showErrorMessage("No open file!!");
            return;
        }

        return e.edit((editBuilder) =>{
            editBuilder.insert(_p, content);
            return true;
            // e.selection = new vscode.Selection(new vscode.Position(e.selection.end.line, e.selection.end.character), new vscode.Position(e.selection.end.line, e.selection.end.character + 1))
        }).then(x=>{
            //Task completed
            return true;
        });
        
    }

    public delete(range):any {
        
        let e = vscode.window.activeTextEditor;
        let _r = new vscode.Range(new vscode.Position(range[0].line, range[0].character), new vscode.Position(range[1].line, range[1].character))

        

        if(!e){
            vscode.window.showErrorMessage("No open file!!");
            return;
        }

        return e.edit((editBuilder) =>{
            editBuilder.delete(_r);
            return true;
        }).then(x=>{
            //Task Completed
            return true;
        });

    }
}