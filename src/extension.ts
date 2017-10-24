'use strict';

import * as vscode from 'vscode';

import { Wire } from './wire';



export function activate(context: vscode.ExtensionContext) {

    let startDisposable = vscode.commands.registerCommand('extension.startWire', () => {

        let e = vscode.window.activeTextEditor;
        if(!e){
            vscode.window.showErrorMessage("No open file!!");
            return;
        }
        
        vscode.window.showInputBox({ prompt: "Enter nickname", ignoreFocusOut:true })
        .then(name => {

            
            console.log("Still reached!");
            let _wire = new Wire(e, name, true);    
        })


        
    });

    let joinDisposable = vscode.commands.registerCommand('extension.joinWire', () => {

        let e = vscode.window.activeTextEditor;
        if(!e){
            vscode.window.showErrorMessage("No open file!!");
            return;
        }

        vscode.window.showInputBox({ prompt: "Enter Team Key", ignoreFocusOut: true })
        .then(key => {
            vscode.window.showInputBox({ prompt: "Enter Nickname", ignoreFocusOut: true })
            .then(name => {

                let _wire = new Wire(e, name, false, true, key);
            })    
        })
    });

    context.subscriptions.push(startDisposable);
    context.subscriptions.push(joinDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}