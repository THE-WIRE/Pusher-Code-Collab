export class Buffer{

    _buffer:Array<any> = [];
    _pusher:any;

    constructor(pusher:any = null){
        if(!pusher){
            this._pusher = pusher;
            this.process();
        }
    }

    assign(pusher){
        this._pusher = pusher;
        this.process();
    }

    process(){
        //async cycle
        setInterval(()=>{
            if(this._buffer.length > 0){
                let event = this._buffer.shift();
                this._pusher.trigger(event.name, event.data);
            }
        }, 110)
    }

    add(event){
        this._buffer.push(event);
    }
}