'use strict'

import * as vscode from 'vscode';

export class Editor{

    e:vscode.TextEditor

    constructor(e:vscode.TextEditor){
        this.e = e;
    }
    /**
     * insert
     */
    public insert(content, range):any {
        
        // let _r = new vscode.Range(new vscode.Position(range[0].line, range[0].character), new vscode.Position(range[1].line, range[1].character))
        let _p = new vscode.Position(range[0].line, range[0].character);

        if(this.isAnyFileOpen())    
            return;

        return this.e.edit((editBuilder) =>{
            editBuilder.insert(_p, content);
            return true;
            // e.selection = new vscode.Selection(new vscode.Position(e.selection.end.line, e.selection.end.character), new vscode.Position(e.selection.end.line, e.selection.end.character + 1))
        }).then(x=>{
            //Task completed
            return true;
        });

    }

    public delete(range):any {
        let _r = new vscode.Range(new vscode.Position(range[0].line, range[0].character), new vscode.Position(range[1].line, range[1].character))

        if(this.isAnyFileOpen())    
            return;

        return this.e.edit((editBuilder) =>{
            editBuilder.delete(_r);
            return true;
        }).then(x=>{
            //Task Completed
            return true;
        });

    }

    public save(fileName) {
        //Save file with provded fileName
        this.e.document.save().then(x=>{
            console.log("File saved!");
        })

    }

    public isAnyFileOpen():boolean{
        if(!this.e){
            vscode.window.showErrorMessage("No open file!!");
            return false;
        }
        else{
            return true;
        }
    }
}