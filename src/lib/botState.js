let _sock      = null;
let _connected = false;

export const setSock = (sock) => {
    _sock      = sock;
    _connected = true;
};

export const clearSock = () => {
    _connected = false;
    _sock      = null;
};

export const getSock = () => _sock;

export const isReady = () => _sock !== null && _connected;

/* Code by https://github.com/DavidModzz */