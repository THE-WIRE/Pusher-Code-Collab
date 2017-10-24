// 'use strict'

import * as vscode from 'vscode';
let randomstring = require('randomstring');
let copy = require('copy-paste');
var Pusher = require('pusher-client');
import { pusher_config } from './pusher.conf';
import {Editor} from './editor';

export class Wire{
    pusher:any;
    channel:any;
    payload:any;
    syncFlag:any = true
    token:any
    username:any
    editor:any

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
        })

        this.channel.bind('client-status', (d) =>{
            vscode.window.showInformationMessage(d.username + " connected!");
        });
    
        
        
        this.listenDoc();
        this.listenPeer();
    }

    public listenDoc(){
       
        vscode.workspace.onDidChangeTextDocument((e)=>{
            
            if (this.syncFlag == true && e.contentChanges.length > 0) 
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
                this.channel.trigger('client-event', this.payload);
                // console.log(range, "|" + text + '|');
                
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
            this.syncFlag = false;
            if(data.user != this.username){
                console.log(data);

                if(data.type == 1){

                    let _p = new vscode.Position(data.range[0].line, data.range[0].character);
                    this.editor.edit((editBuilder) =>{
                        editBuilder.insert(_p, data.text);
                    }).then(()=>{
                        this.syncFlag = true;
                    })
                    
                }
                else{

                    let _r = new vscode.Range(new vscode.Position(data.range[0].line, data.range[0].character), new vscode.Position(data.range[1].line, data.range[1].character))

                    this.editor.edit((editBuilder) =>{
                        editBuilder.delete(_r);
                    }).then(()=>{
                        this.syncFlag = true;
                    })
                    
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
}