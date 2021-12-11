class ChatEngine{
    constructor(chatBoxId, userEmail) {
        // string interpolation
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        
        // io global object - socketio.js
        this.socket = io.connect('http://localhost:5000');

        if(this.userEmail) {
            this.connectionHandler();
        }
    }

    connectionHandler() {

        // rooms
        let self = this;
        // self refers to the object ChatEngine
        // console.log('self is ', this);

        // event on socket
        this.socket.on('connect', function() {
            console.log('connection established using sockets...');

            // console.log('here this is ',this);
            // here this refers to this.socket, since callback called with ref
            // to that

            self.socket.emit('join_room', {
                email: self.userEmail,
                chatRoom: 'codeial'
            });

            self.socket.on('user_joined', function (data) {
                console.log('a user joined', data);
            });
        });
    }
}