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

    constructor(name:any, start:boolean = false, join:boolean = false, token:any = ""){
        console.log("inside");
        if(start){
            console.log("inside start");
            this.token = randomstring.generate(6) + name + randomstring.generate(6);
            this.token = this.token.toLowerCase();
            console.log(this.token);
            copy.copy(this.token);
        }

        if(join){
            this.token = token;
        }

            
        // try{
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
                    this.channel.trigger('private-user-status-'+this.token,  {username : name});
                }
            })

            this.channel.bind('private-user-status-'+this.token, (d) =>{
                vscode.window.showInformationMessage(d.username + " connected!");
            });

        // }
        // catch(e){
        //     console.log(e);
        // }
        
        
        
        
        this.listenDoc();
        this.listenPeer();
    }

    public listenDoc(){
        console.log("Inside listener");
        vscode.workspace.onDidChangeTextDocument((e)=>{

            if (this.syncFlag == true && e.contentChanges.length > 0) 
            {
                let range = e.contentChanges[0].range;
                let text = e.contentChanges[0].text;

                if(text == ''){
                    //deletion
                    this.payload = {user: 'suyog', type: -1, range : range, text: text};
                    console.log('deletion');
                }
                else{
                    //insertion
                    this.payload = {user: 'suyog', type: 1, range : range, text: text};
                    console.log('insertion');
                }

                //Forwarded to pusher
                this.channel.trigger('client-event', this.payload);
                // console.log(range, "|" + text + '|');
                
            }
        })
    }

    public listenPeer(){
        console.log("Inside peer");
        // //From Pusher
        this.channel.bind('client-event', (data) => {
            this.syncFlag = false;
            if(data.user != 'suyog'){
                console.log(data);
                let _e = new Editor();
                if(data.type == 1){
                    _e.insert(data.text, data.range).then(x=>{
                        console.log(x);
                        this.syncFlag = x;
                    })
                    
                }
                else{
                    _e.delete(data.range).then(x=>{
                        console.log(x);
                        this.syncFlag = x;
                    })
                }
                    
            }
        });
        
    }
}