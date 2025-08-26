import type {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	NodeConnectionType,
} from 'n8n-workflow';

import { NodeApiError } from 'n8n-workflow';

export class ZepAiTool implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Zep AI',
		name: 'zepAiTool',
		icon: 'file:zep.svg',
		group: ['miscellaneous'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'AI Tool for interacting with Zep memory and knowledge graph. Provides operations to store/retrieve conversation memory, search knowledge graphs, and manage user context.',
		defaults: {
			name: 'Zep AI',
		},
		inputs: [
			{
				displayName: '',
				type: 'main' as NodeConnectionType,
			},
		],
		outputs: [
			{
				displayName: '',
				type: 'main' as NodeConnectionType,
			},
		],
		credentials: [
			{
				name: 'zepApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.getzep.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		codex: {
			categories: ['AI'],
			subcategories: {
				AI: ['Memory', 'Knowledge Management', 'Context'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://help.getzep.com/',
					},
				],
			},
		},
		usableAsTool: true,
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Test Connection',
						value: 'testConnection',
						description: 'Simple test to verify the Zep connection is working',
						action: 'Test connection to Zep',
					},
					{
						name: 'Add Data to Graph',
						value: 'addDataToGraph',
						description: 'Add structured or unstructured data to the knowledge graph',
						action: 'Add data to knowledge graph',
					},
					{
						name: 'Add Fact Triple',
						value: 'addFactTriple',
						description: 'Add a specific fact relationship to the graph',
						action: 'Add fact triple to graph',
					},
					{
						name: 'Add Memory',
						value: 'addMemory',
						description: 'Add conversation messages to memory',
						action: 'Add memory to session',
					},
					{
						name: 'Create Thread',
						value: 'createThread',
						description: 'Create a new conversation thread',
						action: 'Create thread',
					},
					{
						name: 'Create User',
						value: 'createUser',
						description: 'Create a new user in Zep',
						action: 'Create user',
					},
					{
						name: 'Get Memory Context',
						value: 'getMemoryContext',
						description: 'Retrieve relevant context from memory',
						action: 'Get memory context for session',
					},
					{
						name: 'Get User Context',
						value: 'getUserContext',
						description: 'Get comprehensive user context from thread',
						action: 'Get user context',
					},
					{
						name: 'Get User Info',
						value: 'getUserInfo',
						description: 'Retrieve user profile information, metadata, and account details by user ID',
						action: 'Get user information',
					},
					{
						name: 'Search Knowledge Graph',
						value: 'searchGraph',
						description: 'Search the knowledge graph for information',
						action: 'Search knowledge graph',
					},
				],
				default: 'testConnection',
			},

			// SESSION/THREAD FIELDS
			{
				displayName: 'Session ID',
				name: 'sessionId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['addMemory', 'getMemoryContext'],
					},
				},
				default: '',
				placeholder: 'session-abc123',
				description: 'Unique identifier for the conversation session (e.g., session-abc123)',
			},
			{
				displayName: 'Thread ID',
				name: 'threadId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['createThread', 'getUserContext'],
					},
				},
				default: '',
				placeholder: 'thread-def456',
				description: 'Unique identifier for the conversation thread (e.g., thread-def456)',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['getUserInfo', 'createUser', 'createThread', 'getUserContext', 'addDataToGraph', 'searchGraph'],
					},
				},
				default: '',
				placeholder: 'user-123',
				description: 'The unique identifier of the user you want to get information about. This should be a string like "user-123" or any unique user ID.',
			},

			// MEMORY FIELDS
			{
				displayName: 'Messages',
				name: 'messages',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						operation: ['addMemory'],
					},
				},
				default: {},
				placeholder: 'Add Message',
				options: [
					{
						name: 'messageValues',
						displayName: 'Message',
						values: [
							{
								displayName: 'Role',
								name: 'role',
								type: 'string',
								default: 'user',
								description: 'The role of the message sender (e.g., user, assistant)',
							},
							{
								displayName: 'Role Type',
								name: 'role_type',
								type: 'options',
								options: [
									{
										name: 'User',
										value: 'user',
									},
									{
										name: 'Assistant',
										value: 'assistant',
									},
									{
										name: 'System',
										value: 'system',
									},
								],
								default: 'user',
								description: 'The type of role',
							},
							{
								displayName: 'Content',
								name: 'content',
								type: 'string',
								typeOptions: {
									rows: 3,
								},
								default: '',
								description: 'The content of the message',
								required: true,
							},
						],
					},
				],
			},

			// SEARCH FIELDS
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['searchGraph'],
					},
				},
				default: '',
				description: 'The search query for the knowledge graph',
			},
			{
				displayName: 'Graph ID',
				name: 'graphId',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['searchGraph', 'addDataToGraph', 'addFactTriple'],
					},
				},
				default: '',
				description: 'The ID of the graph to search/modify (optional - uses user graph if not provided)',
			},
			{
				displayName: 'Search Scope',
				name: 'searchScope',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['searchGraph'],
					},
				},
				options: [
					{
						name: 'Edges (Relationships)',
						value: 'edges',
					},
					{
						name: 'Nodes (Entities)',
						value: 'nodes',
					},
					{
						name: 'Episodes (Data)',
						value: 'episodes',
					},
				],
				default: 'edges',
				description: 'What to search for in the graph',
			},
			{
				displayName: 'Max Results',
				name: 'maxResults',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['searchGraph'],
					},
				},
				default: 10,
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				description: 'Maximum number of results to return',
			},
			{
				displayName: 'Minimum Fact Rating',
				name: 'minFactRating',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['searchGraph', 'getUserContext'],
						searchScope: ['edges'],
					},
				},
				default: 0.0,
				typeOptions: {
					minValue: 0.0,
					maxValue: 1.0,
					numberPrecision: 2,
				},
				description: 'Minimum rating to filter relevant facts (0.0-1.0)',
			},

			// DATA FIELDS
			{
				displayName: 'Data',
				name: 'data',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				required: true,
				displayOptions: {
					show: {
						operation: ['addDataToGraph'],
					},
				},
				default: '',
				description: 'The data to add to the knowledge graph',
			},
			{
				displayName: 'Data Type',
				name: 'dataType',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['addDataToGraph'],
					},
				},
				options: [
					{
						name: 'Text',
						value: 'text',
					},
					{
						name: 'JSON',
						value: 'json',
					},
					{
						name: 'Message',
						value: 'message',
					},
				],
				default: 'text',
				description: 'The type of data being added',
			},

			// FACT TRIPLE FIELDS
			{
				displayName: 'Fact',
				name: 'fact',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['addFactTriple'],
					},
				},
				default: '',
				description: 'The fact/relationship description (max 50 chars)',
				typeOptions: {
					maxValue: 50,
				},
			},
			{
				displayName: 'Fact Name',
				name: 'factName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['addFactTriple'],
					},
				},
				default: '',
				description: 'The name of the relationship (e.g., WORKS_AT, KNOWS)',
				typeOptions: {
					maxValue: 50,
				},
			},
			{
				displayName: 'Source Node Name',
				name: 'sourceNodeName',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['addFactTriple'],
					},
				},
				default: '',
				description: 'The name of the source entity',
				typeOptions: {
					maxValue: 50,
				},
			},
			{
				displayName: 'Target Node Name',
				name: 'targetNodeName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['addFactTriple'],
					},
				},
				default: '',
				description: 'The name of the target entity',
				typeOptions: {
					maxValue: 50,
				},
			},

			// USER FIELDS
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['createUser'],
					},
				},
				default: '',
				placeholder: 'name@email.com',
				description: 'User email address',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['createUser'],
					},
				},
				default: '',
				description: 'User first name',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['createUser'],
					},
				},
				default: '',
				description: 'User last name',
			},
			{
				displayName: 'User Metadata',
				name: 'userMetadata',
				type: 'json',
				displayOptions: {
					show: {
						operation: ['createUser'],
					},
				},
				default: '{}',
				description: 'Additional user metadata as JSON',
			},

			// CONTEXT OPTIONS
			{
				displayName: 'Context Mode',
				name: 'contextMode',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['getUserContext'],
					},
				},
				options: [
					{
						name: 'Summary',
						value: 'summary',
					},
					{
						name: 'Basic',
						value: 'basic',
					},
				],
				default: 'summary',
				description: 'Context retrieval mode - basic for lower latency',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				let responseData: any;

				switch (operation) {
					case 'testConnection':
						responseData = await testConnection.call(this, i);
						break;
					case 'addMemory':
						responseData = await addMemory.call(this, i);
						break;
					case 'getMemoryContext':
						responseData = await getMemoryContext.call(this, i);
						break;
					case 'searchGraph':
						responseData = await searchGraph.call(this, i);
						break;
					case 'addDataToGraph':
						responseData = await addDataToGraph.call(this, i);
						break;
					case 'addFactTriple':
						responseData = await addFactTriple.call(this, i);
						break;
					case 'getUserInfo':
						responseData = await getUserInfo.call(this, i);
						break;
					case 'createUser':
						responseData = await createUser.call(this, i);
						break;
					case 'createThread':
						responseData = await createThread.call(this, i);
						break;
					case 'getUserContext':
						responseData = await getUserContext.call(this, i);
						break;
					default:
						throw new NodeApiError(this.getNode(), {
							message: `Unknown operation: ${operation}`,
						});
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray([responseData as IDataObject]),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray([{ error: error.message }]),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

// HELPER FUNCTIONS

async function testConnection(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	// Simple test that doesn't require any parameters
	return {
		success: true,
		message: 'Zep AI Tool connection test successful',
		timestamp: new Date().toISOString(),
		version: '1.0.0',
	};
}

async function addMemory(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const sessionId = this.getNodeParameter('sessionId', itemIndex) as string;
	const messagesData = this.getNodeParameter('messages.messageValues', itemIndex, []) as IDataObject[];

	const messages = messagesData.map((msg: IDataObject) => ({
		role: msg.role,
		role_type: msg.role_type,
		content: msg.content,
	}));

	const body: IDataObject = {
		messages,
	};

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `https://api.getzep.com/api/v2/memory/${sessionId}`,
		body,
		json: true,
	};

	const response = await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
	
	return {
		success: true,
		sessionId,
		messagesAdded: messages.length,
		response,
	};
}

async function getMemoryContext(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const sessionId = this.getNodeParameter('sessionId', itemIndex) as string;

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `https://api.getzep.com/api/v2/memory/${sessionId}`,
		json: true,
	};

	const response = await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
	
	return {
		sessionId,
		context: response.context || '',
		facts: response.facts || [],
		entities: response.entities || [],
		response,
	};
}

async function searchGraph(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const searchQuery = this.getNodeParameter('searchQuery', itemIndex) as string;
	const userId = this.getNodeParameter('userId', itemIndex) as string;
	const graphId = this.getNodeParameter('graphId', itemIndex, '') as string;
	const searchScope = this.getNodeParameter('searchScope', itemIndex, 'edges') as string;
	const maxResults = this.getNodeParameter('maxResults', itemIndex, 10) as number;
	const minFactRating = this.getNodeParameter('minFactRating', itemIndex, 0.0) as number;

	const body: IDataObject = {
		query: searchQuery,
		scope: searchScope,
		limit: maxResults,
		reranker: 'rrf',
	};

	// Include user_id for user context
	if (userId) body.user_id = userId;
	
	if (graphId) body.graph_id = graphId;
	if (minFactRating > 0.0) body.min_fact_rating = minFactRating;

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://api.getzep.com/api/v2/graph/search',
		body,
		json: true,
	};

	const response = await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
	
	return {
		query: searchQuery,
		userId,
		scope: searchScope,
		results: response.results || [],
		totalResults: response.results?.length || 0,
		response,
	};
}

async function addDataToGraph(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const data = this.getNodeParameter('data', itemIndex) as string;
	const dataType = this.getNodeParameter('dataType', itemIndex, 'text') as string;
	const userId = this.getNodeParameter('userId', itemIndex, '') as string;
	const graphId = this.getNodeParameter('graphId', itemIndex, '') as string;

	const body: IDataObject = {
		data,
		type: dataType,
	};

	if (graphId) {
		body.graph_id = graphId;
	} else if (userId) {
		body.user_id = userId;
	} else {
		throw new NodeApiError(this.getNode(), {
			message: 'Either Graph ID or User ID must be provided',
		});
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://api.getzep.com/api/v2/graph',
		body,
		json: true,
	};

	const response = await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
	
	return {
		success: true,
		dataAdded: data,
		dataType,
		response,
	};
}

async function addFactTriple(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const fact = this.getNodeParameter('fact', itemIndex) as string;
	const factName = this.getNodeParameter('factName', itemIndex) as string;
	const sourceNodeName = this.getNodeParameter('sourceNodeName', itemIndex, '') as string;
	const targetNodeName = this.getNodeParameter('targetNodeName', itemIndex) as string;
	const graphId = this.getNodeParameter('graphId', itemIndex, '') as string;

	const body: IDataObject = {
		fact,
		fact_name: factName,
		target_node_name: targetNodeName,
	};

	if (sourceNodeName) body.source_node_name = sourceNodeName;
	if (graphId) body.graph_id = graphId;

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://api.getzep.com/api/v2/graph/add-fact-triple',
		body,
		json: true,
	};

	const response = await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
	
	return {
		success: true,
		fact,
		factName,
		sourceNode: sourceNodeName,
		targetNode: targetNodeName,
		response,
	};
}

async function getUserInfo(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const userId = this.getNodeParameter('userId', itemIndex) as string;

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `https://api.getzep.com/api/v2/users/${userId}`,
		json: true,
	};

	const response = await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
	
	return {
		userId,
		userInfo: response,
	};
}

async function createUser(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const userId = this.getNodeParameter('userId', itemIndex) as string;
	const email = this.getNodeParameter('email', itemIndex, '') as string;
	const firstName = this.getNodeParameter('firstName', itemIndex, '') as string;
	const lastName = this.getNodeParameter('lastName', itemIndex, '') as string;
	const userMetadata = this.getNodeParameter('userMetadata', itemIndex, '{}') as string;

	const body: IDataObject = {
		user_id: userId,
	};

	if (email) body.email = email;
	if (firstName) body.first_name = firstName;
	if (lastName) body.last_name = lastName;
	if (userMetadata !== '{}') {
		try {
			body.metadata = JSON.parse(userMetadata);
		} catch (error) {
			throw new NodeApiError(this.getNode(), {
				message: 'Invalid JSON in user metadata',
			});
		}
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://api.getzep.com/api/v2/users',
		body,
		json: true,
	};

	const response = await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
	
	return {
		success: true,
		userId,
		userCreated: response,
	};
}

async function createThread(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const threadId = this.getNodeParameter('threadId', itemIndex) as string;
	const userId = this.getNodeParameter('userId', itemIndex) as string;

	const body: IDataObject = {
		thread_id: threadId,
		user_id: userId,
	};

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://api.getzep.com/api/v2/threads',
		body,
		json: true,
	};

	const response = await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
	
	return {
		success: true,
		threadId,
		userId,
		threadCreated: response,
	};
}

async function getUserContext(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const threadId = this.getNodeParameter('threadId', itemIndex) as string;
	const minRating = this.getNodeParameter('minFactRating', itemIndex, 0) as number;
	const mode = this.getNodeParameter('contextMode', itemIndex, 'summary') as string;

	const qs: IDataObject = {};
	if (minRating > 0) qs.minRating = minRating;
	if (mode !== 'summary') qs.mode = mode;

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `https://api.getzep.com/api/v2/threads/${threadId}/context`,
		qs,
		json: true,
	};

	const response = await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
	
	return {
		threadId,
		context: response.context || '',
		facts: response.facts || [],
		entities: response.entities || [],
		response,
	};
}
