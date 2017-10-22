'use strict'

import * as vscode from 'vscode';
var Pusher = require('pusher-client');
// import Pusher from 'pusher-js';
// import { Pusher } from 'pusher-client';
import { pusher_config } from './pusher.conf';
import {Editor} from './editor';

export class Wire{
    pusher:any;
    channel:any;
    payload:any;
    syncFlag:boolean = true

    constructor(){
        // try{
            this.pusher = new Pusher(pusher_config.key,{
                authEndpoint: 'https://server-pusher.herokuapp.com/users/auth',
                cluster: 'ap2',
                encrypted: true
            });
        
            this.channel = this.pusher.subscribe('private-wire');

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

            if(!this.syncFlag)
                return;

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
                if(data.type == 1)
                    this.syncFlag = _e.insert(data.text, data.range);
                else
                    this.syncFlag = _e.delete(data.range);
            }
        });
        
    }
}