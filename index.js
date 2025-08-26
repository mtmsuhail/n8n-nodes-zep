module.exports = {
    nodes: [
        require('./dist/nodes/Zep/Zep.node.js'),
        require('./dist/nodes/ZepAiTool/ZepAiTool.node.js'),
    ],
    credentials: [
        require('./dist/credentials/ZepApi.credentials.js'),
    ],
};
