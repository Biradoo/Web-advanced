let sseClients = [];

//Function to handle  new SSE connection
export const handleSSEConnection = (req, res) => {
    //Set headers to establish the SSE connection
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    //Add new client to list of SSE clients
    const clientId = Date.now();
    sseClients.push({ id: clientId, res });

    //Handle client disconnection
    req.on('close', () => {
        sseClients = sseClients.filter(client => client.id !== clientId);
    });
};

//Function to send SSE updates to all connected clients
export const sendSSEUpdate = (data) => {
    sseClients.forEach(client => {
        client.res.write(`data: ${JSON.stringify(data)}\n\n`);
    });
};