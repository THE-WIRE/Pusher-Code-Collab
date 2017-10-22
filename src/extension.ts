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
        let _wire = new Wire();
        vscode.window.showInformationMessage("some");


        
    });

    let joinDisposable = vscode.commands.registerCommand('extension.joinWire', () => {
        vscode.window.showInputBox({ prompt: "Enter Team Key" })
        .then(value => {
            vscode.window.showInformationMessage(value);
        })
    });

    context.subscriptions.push(startDisposable);
    context.subscriptions.push(joinDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}