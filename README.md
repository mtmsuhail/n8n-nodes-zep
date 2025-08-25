# n8n-nodes-zep

This is an n8n community node for integrating with [Zep Cloud v3 API](https://help.getzep.com/). It allows you to interact with Zep's memory layer and temporal knowledge graph platform for AI assistants and agents in your n8n workflows.

Zep is a memory layer for AI assistants and agents that continuously learns from user interactions and changing business data to enable personalized, context-aware user experiences.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

This node supports the following Zep Cloud v3 API operations:

### User Operations
- **Create**: Create a new user in Zep
- **Get**: Retrieve a user by ID
- **Update**: Update user information
- **Delete**: Delete a user

### Thread Operations  
- **Create**: Create a new conversation thread
- **List All**: List all threads
- **Get Messages**: Retrieve messages for a thread
- **Add Messages**: Add messages to a thread

### Graph Operations
- **Create**: Create a new knowledge graph
- **Search**: Search within a knowledge graph
- **Add Data**: Add data/episodes to a knowledge graph

### Session Operations
- **List**: List all sessions
- **Create**: Create a new session

## Credentials

To use this node, you need to authenticate with Zep Cloud:

1. Sign up for a [Zep Cloud](https://cloud.getzep.com/) account
2. Generate an API key from your Zep Cloud dashboard
3. In n8n, create new credentials of type "Zep API"
4. Enter your Zep API key

### Setting up Zep API Credentials in n8n

1. Go to **Settings** > **Credentials** in your n8n instance
2. Click **Create New Credential**
3. Select **Zep API** from the list
4. Enter your API key from Zep Cloud
5. Test the connection and save

## Compatibility

- Minimum n8n version: 1.0.0
- Compatible with Zep Cloud v3 API
- Tested against n8n 1.x versions

## Usage

### Basic User Management

1. **Create a User**:
   - Select Resource: User
   - Operation: Create
   - Enter User ID, email, first name, and last name

2. **Add Messages to Thread**:
   - Select Resource: Thread  
   - Operation: Add Messages
   - Enter Thread ID
   - Add messages with role (user/assistant/system) and content

3. **Search Knowledge Graph**:
   - Select Resource: Graph
   - Operation: Search
   - Enter Graph ID and search query

### Example Workflow

Here's a simple workflow to create a user, create a thread, and add a message:

1. **Zep Node 1**: Create User
   - Resource: User
   - Operation: Create
   - User ID: `user123`
   - Email: `user@example.com`

2. **Zep Node 2**: Create Thread  
   - Resource: Thread
   - Operation: Create
   - Thread ID: `thread456`
   - User ID: `user123`

3. **Zep Node 3**: Add Messages
   - Resource: Thread
   - Operation: Add Messages
   - Thread ID: `thread456`
   - Messages: Add user message with content

## API Endpoints Covered

This node integrates with the following Zep Cloud v3 API endpoints:

- `/api/v2/users` - User management
- `/api/v2/threads` - Thread management  
- `/api/v2/threads/{threadId}/messages` - Message management
- `/api/v2/graph` - Knowledge graph operations
- `/api/v2/sessions` - Session management

## Resources

* [Zep Documentation](https://help.getzep.com/)
* [Zep Cloud v3 API Reference](https://help.getzep.com/v3/sdk-reference)
* [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

## Version History

### 0.1.0
- Initial release with core Zep Cloud v3 API operations
- Support for User, Thread, Graph, and Session management
- Built-in authentication with Zep API key
- Comprehensive integration with major Zep Cloud endpoints

## Contributing

Issues and feature requests are welcome! Please check the existing issues before creating new ones.

## License

[MIT](LICENSE.md)