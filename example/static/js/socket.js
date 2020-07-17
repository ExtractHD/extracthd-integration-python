function Socket (url) {
    function onOpen (e) {

    }

    let socket = new WebSocket(url);

    socket.onopen = onOpen;

    socket.onmessage = function(event) {
        console.log(event.data);
    };

    socket.onclose = function(event) {
        if (!event.wasClean) {
            console.log('[close] Connection died');
        }
    };

    socket.onerror = function(error) {
        console.log(error);
    };

    return {
        socket: socket,
        onOpen: onOpen
    }
}
