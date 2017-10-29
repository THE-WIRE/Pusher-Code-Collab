// 'use strict'

import * as vscode from 'vscode';
let randomstring = require('randomstring');
let copy = require('copy-paste');
var Pusher = require('pusher-client');
import { pusher_config } from './pusher.conf';
import { Buffer } from './buffer';

export class Wire{
    pusher:any;
    channel:any;
    payload:any;
    syncFlag:any = true
    token:any
    username:any
    editor:any
    buffer = new Buffer();

    constructor(e:any, name:any, start:boolean = false, join:boolean = false, token:any = ""){
        this.username = name;
        this.editor = e;
        console.log("inside");
        if(start){
            
            this.token = randomstring.generate(6) + name + randomstring.generate(6);
            this.token = this.token.toLowerCase();
           
            copy.copy(this.token);
        }

        if(join){
            this.token = token;
        }
         
        this.pusher = new Pusher(pusher_config.key,{
            authEndpoint: 'https://server-pusher.herokuapp.com/users/auth',
            cluster: 'ap2',
            encrypted: true
        });
    
        this.channel = this.pusher.subscribe('private-wire-' + this.token);

        this.channel.bind("pusher:subscription_succeeded", (data) =>{
            if(start)
                vscode.window.showInformationMessage("Connected! Team Token is copied to your Clipboard : " + this.token)
            else{
                vscode.window.showInformationMessage("Connected! Start Collaborating...");
                this.channel.trigger('client-status',  {username : name});
            }
            this.buffer.assign(this.channel);
        })

        this.channel.bind('client-status', (d) =>{
            vscode.window.showInformationMessage(d.username + " connected!");
        });
    
        
        
        this.listenDoc();
        this.listenPeer();
    }

    public listenDoc(){
       
        vscode.workspace.onDidChangeTextDocument((e)=>{
            
            if (e.contentChanges.length > 0) 
            {
                let range = e.contentChanges[0].range;
                let text = e.contentChanges[0].text;

                if(text == ''){
                    //deletion
                    this.payload = {user: this.username, type: -1, range : range, text: text};
                   
                }
                else{
                    //insertion
                    this.payload = {user: this.username, type: 1, range : range, text: text};
                   
                }

                //Forwarded to pusher
                let event = {
                    name: 'client-event',
                    data : this.payload
                }

                this.buffer.add(event);
                // this.channel.trigger('client-event', this.payload);
                // console.log(range, "|" + text + '|');
                
            }
            else if(e.contentChanges.length > 0){
                console.log("skipped : ", e.contentChanges[0].text);
            }
            else{
                console.log("skipped empty");
            }
        })

        vscode.workspace.onDidSaveTextDocument((e)=>{

            console.log(e.fileName);
            let x = e.fileName.split('/');
            let fileName = x[x.length - 1];
            this.channel.trigger('client-save', {fileName: fileName, user: this.username});

        })
    }

    public listenPeer(){
       
        // //From Pusher
        this.channel.bind('client-event', (data) => {
            let _dr = new vscode.Range(new vscode.Position(data.range[0].line, data.range[0].character), new vscode.Position(data.range[1].line, data.range[1].character))
            console.log("Initially : ", data.range);
            data.range[1] = this.findRange(data.text, data.range[0].line, data.range[0].character);
            console.log("Finally : ", data.range);

            // this.syncFlag = false;
            if(data.user != this.username){
                // console.log(data);
                // let count = 0;
                // let character = data.range[1].character + 1
                // let character = data.range[1].character

                // if (data.text == "\n")
                // {
                //     count = 1 ;
                //     character = 0
                // }
                     
                let _r = new vscode.Range(new vscode.Position(data.range[0].line, data.range[0].character), new vscode.Position(data.range[1].line, data.range[1].character))
                

                if(this.editor.document.getText(_r) != data.text)    
                {   
                    if(data.type == 1){
                        
                        let _r = new vscode.Range(new vscode.Position(data.range[0].line, data.range[0].character), new vscode.Position(data.range[1].line, data.range[1].character))
                        //let _p = new vscode.Position(data.range[0].line, data.range[0].character);
                        this.editor.edit((editBuilder) =>{
                            editBuilder.replace(_r, data.text);
                            this.editor.selection = new vscode.Selection(new vscode.Position(this.editor.selection.end.line, this.editor.selection.end.character), new vscode.Position(this.editor.selection.end.line, this.editor.selection.end.character + 1))
                        }).then(()=>{
                            // this.syncFlag = true;
                        })
                        
                    }
                    else{
    
                        let _r = new vscode.Range(new vscode.Position(data.range[0].line, data.range[0].character), new vscode.Position(data.range[1].line, data.range[1].character))
    
                        this.editor.edit((editBuilder) =>{
                            editBuilder.delete(_dr);
                        }).then(()=>{
                            // this.syncFlag = true;
                        })
                        
                    }
                }
                    
            }
        });

        this.channel.bind('client-save', (data) =>{
            if(data.user != this.username){
                console.log(data);

                this.editor.document.save().then(x=>{
                    console.log("File saved!");
                })
            }
        })
        
    }

    public findRange(text, l, c){
        if(text.length == 1){
            return {
                line : l,
                character: c
            }
        }
        console.log("Reached!");
        let line = 0;
        let col = 0;
        for(let i = 0; i < text.length; i++){
            if(text[i] == "\n"){
                line+=1;
            }
        }
    
        for(let i = text.length - 1; i >= 0; i--){
            col+=1;
            if(text[i] == "\n"){
                break;
            }
        }
    
        if(line == l){
            col += c
        }
        else{
            line += l
        }
        console.log(line, col);
    
        return {
            line : line,
            character: col
        }
    }
}