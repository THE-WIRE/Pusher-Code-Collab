'use strict';

import * as vscode from 'vscode';

import { Wire } from './wire';



export function activate(context: vscode.ExtensionContext) {

    let startDisposable = vscode.commands.registerCommand('extension.startWire', () => {

        // let start = new vscode.Position(1, 1);
        // let end = new vscode.Position(1, 5);
        // let range = new vscode.Range(start, end);
        // let content = "hello"

        // let _e = new Editor();
        // _e.insert(content, range);
        

        
        // let _p = new vscode.Position(0, 1);
        // let _r =  new vscode.Range(new vscode.Position(0, 0),new vscode.Position(0, 2));
        // // console.log("this is a position",_p);
        // console.log("this is a range",_r);
        // console.log(vscode.window.activeTextEditor.document.getText(_r));
        // //console.log("this is a given character" + str);        
        
        vscode.window.showInputBox({ prompt: "Enter nickname" })
        .then(value => {
            let _wire = new Wire(value, true);    
        })


        
    });

    let joinDisposable = vscode.commands.registerCommand('extension.joinWire', () => {
        vscode.window.showInputBox({ prompt: "Enter Team Key" })
        .then(key => {
            vscode.window.showInputBox({ prompt: "Enter Nickname" })
            .then(name => {
                let _wire = new Wire(name, false, true, key);
            })    
        })
    });

    context.subscriptions.push(startDisposable);
    context.subscriptions.push(joinDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}