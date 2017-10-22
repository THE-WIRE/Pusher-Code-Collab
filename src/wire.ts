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

            let range = e.contentChanges[0].range;
            let text = e.contentChanges[0].text;

            //Forwarded to pusher
            this.channel.trigger('client-event', {user: 'suyog', range : e.contentChanges[0].range, text: e.contentChanges[0].text});
            console.log('triggered');
            
        })
    }

    public listenPeer(){
        console.log("Inside peer");
        // //From Pusher
        this.channel.bind('client-event', (data) => {
            if(data.user != 'suyog')
                console.log(data);
                let _e = new Editor();
                _e.insert(data.text, data.range);
        });
        
    }
}