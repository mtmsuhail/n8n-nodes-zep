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

export class Zep implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Zep v3',
		name: 'zep',
		icon: 'file:zep.svg',
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Zep Cloud v3 API',
		defaults: {
			name: 'Zep',
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
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Edge',
						value: 'edge',
					},
					{
						name: 'Entity Type',
						value: 'entityType',
					},
					{
						name: 'Episode',
						value: 'episode',
					},
					{
						name: 'Graph',
						value: 'graph',
					},
					{
						name: 'Node',
						value: 'node',
					},
					{
						name: 'Session',
						value: 'session',
					},
					{
						name: 'Thread',
						value: 'thread',
					},
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'user',
			},

			// USER OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['user'],
					},
				},
				options: [
					{
						name: 'Add User',
						value: 'add',
						action: 'Add a user',
					},
					{
						name: 'Delete User',
						value: 'delete',
						action: 'Delete a user',
					},
					{
						name: 'Get User',
						value: 'get',
						action: 'Get a user',
					},
					{
						name: 'Get User Node',
						value: 'getNode',
						action: 'Get user node',
					},
					{
						name: 'Get User Threads',
						value: 'getThreads',
						action: 'Get user threads',
					},
					{
						name: 'Get Users',
						value: 'list',
						action: 'Get all users',
					},
					{
						name: 'Update User',
						value: 'update',
						action: 'Update a user',
					},
				],
				default: 'add',
			},

			// THREAD OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['thread'],
					},
				},
				options: [
					{
						name: 'Add Messages to a Thread',
						value: 'addMessages',
						action: 'Add messages to thread',
					},
					{
						name: 'Add Messages to a Thread in Batch',
						value: 'addMessagesBatch',
						action: 'Add messages to thread in batch',
					},
					{
						name: 'Delete Thread',
						value: 'delete',
						action: 'Delete a thread',
					},
					{
						name: 'Get Messages of a Thread',
						value: 'getMessages',
						action: 'Get thread messages',
					},
					{
						name: 'Get Threads',
						value: 'list',
						action: 'Get all threads',
					},
					{
						name: 'Get User Context',
						value: 'getUserContext',
						action: 'Get user context from thread',
					},
					{
						name: 'Start a New Thread',
						value: 'create',
						action: 'Create a thread',
					},
				],
				default: 'list',
			},

			// GRAPH OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['graph'],
					},
				},
				options: [
					{
						name: 'Add Data',
						value: 'addData',
						action: 'Add data to graph',
					},
					{
						name: 'Add Data in Batch Mode',
						value: 'addDataBatch',
						action: 'Add data to graph in batch',
					},
					{
						name: 'Add Fact Triple',
						value: 'addFactTriple',
						action: 'Add fact triple to graph',
					},
					{
						name: 'Clone Graph',
						value: 'clone',
						action: 'Clone graph',
					},
					{
						name: 'Create Graph',
						value: 'create',
						action: 'Create a graph',
					},
					{
						name: 'Delete Graph',
						value: 'delete',
						action: 'Delete a graph',
					},
					{
						name: 'Get Entity Types',
						value: 'getEntityTypes',
						action: 'Get entity types',
					},
					{
						name: 'Get Graph',
						value: 'get',
						action: 'Get a graph',
					},
					{
						name: 'List All Graphs',
						value: 'list',
						action: 'List all graphs',
					},
					{
						name: 'Search Graph',
						value: 'search',
						action: 'Search graph',
					},
					{
						name: 'Set Entity Types',
						value: 'setEntityTypes',
						action: 'Set entity types',
					},
					{
						name: 'Update Graph',
						value: 'update',
						action: 'Update a graph',
					},
				],
				default: 'create',
			},

			// NODE OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['node'],
					},
				},
				options: [
					{
						name: 'Get Entity Edges for a Node',
						value: 'getEntityEdges',
						action: 'Get entity edges for node',
					},
					{
						name: 'Get Episodes for a Node',
						value: 'getEpisodes',
						action: 'Get episodes for node',
					},
					{
						name: 'Get Graph Nodes',
						value: 'getByGraph',
						action: 'Get nodes by graph',
					},
					{
						name: 'Get Node',
						value: 'get',
						action: 'Get a node',
					},
					{
						name: 'Get User Nodes',
						value: 'getByUser',
						action: 'Get nodes by user',
					},
				],
				default: 'get',
			},

			// EDGE OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['edge'],
					},
				},
				options: [
					{
						name: 'Get Edge',
						value: 'get',
						description: 'Get an edge by UUID',
						action: 'Get an edge',
					},
					{
						name: 'Get Graph Edges',
						value: 'getByGraph',
						description: 'Get edges by graph ID',
						action: 'Get edges by graph',
					},
					{
						name: 'Get User Edges',
						value: 'getByUser',
						description: 'Get edges by user ID',
						action: 'Get edges by user',
					},
					{
						name: 'Delete Edge',
						value: 'delete',
						description: 'Delete an edge',
						action: 'Delete an edge',
					},
				],
				default: 'get',
			},

			// EPISODE OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['episode'],
					},
				},
				options: [
					{
						name: 'Delete Episode',
						value: 'delete',
						action: 'Delete an episode',
					},
					{
						name: 'Get Episode',
						value: 'get',
						action: 'Get an episode',
					},
					{
						name: 'Get Graph Episodes',
						value: 'getByGraph',
						action: 'Get episodes by graph',
					},
					{
						name: 'Get User Episodes',
						value: 'getByUser',
						action: 'Get episodes by user',
					},
					{
						name: 'Return Any Nodes and Edges Mentioned in an Episode',
						value: 'getNodesAndEdges',
						action: 'Get nodes and edges from episode',
					},
				],
				default: 'get',
			},

			// ENTITY TYPE OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['entityType'],
					},
				},
				options: [
					{
						name: 'Get Entity Types',
						value: 'get',
						action: 'Get entity types',
					},
					{
						name: 'Set Entity Types',
						value: 'set',
						action: 'Set entity types',
					},
				],
				default: 'get',
			},

			// SESSION OPERATIONS
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['session'],
					},
				},
				options: [
					{
						name: 'Add Session Messages',
						value: 'addMessages',
						action: 'Add messages to session',
					},
					{
						name: 'Create Session',
						value: 'create',
						action: 'Create a session',
					},
					{
						name: 'Get Session',
						value: 'get',
						action: 'Get a session',
					},
					{
						name: 'Get Session Messages',
						value: 'getMessages',
						action: 'Get session messages',
					},
					{
						name: 'List Sessions',
						value: 'list',
						action: 'List sessions',
					},
				],
				default: 'list',
			},



			// COMMON ID FIELDS
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['add', 'get', 'update', 'delete', 'getNode', 'getThreads'],
					},
				},
				default: '',
				description: 'The unique identifier of the user',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['thread'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The unique identifier of the user associated with the thread',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['graph', 'node', 'edge', 'episode'],
						operation: ['getByUser', 'search', 'addData', 'addDataBatch'],
					},
				},
				default: '',
				description: 'The unique identifier of the user (optional - use either user_id or graph_id for graph operations)',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['session'],
						operation: ['create'],
					},
				},
				default: '',
				description: 'The unique identifier of the user associated with the session',
			},

			{
				displayName: 'Thread ID',
				name: 'threadId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['thread'],
						operation: ['create', 'delete', 'getMessages', 'addMessages', 'addMessagesBatch', 'getUserContext'],
					},
				},
				default: '',
				description: 'The unique identifier of the thread',
			},

			{
				displayName: 'Graph ID',
				name: 'graphId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['graph', 'node', 'edge', 'episode', 'entityType'],
						operation: ['create', 'get', 'delete', 'update', 'clone', 'addFactTriple', 'search', 'addData', 'addDataBatch', 'getByGraph'],
					},
				},
				default: '',
				description: 'The unique identifier of the graph (required for most operations, optional for search/addData/entityType when using User ID)',
			},

			{
				displayName: 'UUID',
				name: 'uuid',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['node', 'edge', 'episode'],
						operation: ['get', 'delete', 'getEntityEdges', 'getEpisodes', 'getNodesAndEdges'],
					},
				},
				default: '',
				description: 'The UUID of the item',
			},

			{
				displayName: 'Session ID',
				name: 'sessionId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['session'],
						operation: ['create', 'get', 'getMessages', 'addMessages'],
					},
				},
				default: '',
				description: 'The unique identifier of the session',
			},



			// USER FIELDS
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['add', 'update'],
					},
				},
				default: '',
				placeholder: 'user@example.com',
				description: 'The email address of the user. Example: user@example.com.',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['add', 'update'],
					},
				},
				default: '',
				placeholder: 'John',
				description: 'The first name of the user. Example: John.',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['add', 'update'],
					},
				},
				default: '',
				placeholder: 'Doe',
				description: 'The last name of the user. Example: Doe.',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['add', 'update'],
					},
				},
				default: '{}',
				placeholder: '{"department": "engineering", "role": "developer"}',
				description: 'Metadata associated with the user as JSON object. Example: {"department": "engineering", "role": "developer"}.',
			},
			{
				displayName: 'Fact Rating Instruction',
				name: 'factRatingInstruction',
				type: 'fixedCollection',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['add', 'update'],
					},
				},
				default: {},
				placeholder: 'Add Fact Rating Instruction',
				description: 'Optional instruction to use for fact rating',
				options: [
					{
						name: 'instructionValues',
						displayName: 'Fact Rating Instruction',
						values: [
							{
								displayName: 'Instruction',
								name: 'instruction',
								type: 'string',
								default: '',
								placeholder: 'Rate facts based on relevance and accuracy',
								description: 'The main instruction for fact rating. Example: "Rate facts based on relevance and accuracy".',
							},
							{
								displayName: 'High Rating Example',
								name: 'exampleHigh',
								type: 'string',
								default: '',
								placeholder: 'Highly relevant and accurate information',
								description: 'Example of high-rated fact. Example: "Highly relevant and accurate information".',
							},
							{
								displayName: 'Medium Rating Example',
								name: 'exampleMedium',
								type: 'string',
								default: '',
								placeholder: 'Moderately relevant information',
								description: 'Example of medium-rated fact. Example: "Moderately relevant information".',
							},
							{
								displayName: 'Low Rating Example',
								name: 'exampleLow',
								type: 'string',
								default: '',
								placeholder: 'Less relevant or outdated information',
								description: 'Example of low-rated fact. Example: "Less relevant or outdated information".',
							},
						],
					},
				],
			},

			// GRAPH FIELDS
			{
				displayName: 'Graph Name',
				name: 'name',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: 'My Knowledge Graph',
				description: 'The name of the graph. Example: "My Knowledge Graph".',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['create', 'update'],
					},
				},
				default: '',
				placeholder: 'A graph containing customer interaction data and knowledge base',
				description: 'A description for the graph. Example: "A graph containing customer interaction data and knowledge base".',
			},
			{
				displayName: 'Fact Rating Instruction',
				name: 'factRatingInstruction',
				type: 'fixedCollection',
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['create', 'update'],
					},
				},
				default: {},
				placeholder: 'Add Fact Rating Instruction',
				description: 'Configuration for fact rating instructions',
				options: [
					{
						name: 'instructionValues',
						displayName: 'Fact Rating Instruction',
						values: [
							{
								displayName: 'Instruction',
								name: 'instruction',
								type: 'string',
								default: '',
								placeholder: 'Rate facts based on relevance, accuracy, and recency',
								description: 'The main instruction for fact rating. Example: "Rate facts based on relevance, accuracy, and recency".',
							},
							{
								displayName: 'High Rating Example',
								name: 'exampleHigh',
								type: 'string',
								default: '',
								placeholder: 'Highly relevant and verified facts',
								description: 'Example of high-rated fact. Example: "Highly relevant and verified facts".',
							},
							{
								displayName: 'Medium Rating Example',
								name: 'exampleMedium',
								type: 'string',
								default: '',
								placeholder: 'Moderately relevant facts',
								description: 'Example of medium-rated fact. Example: "Moderately relevant facts".',
							},
							{
								displayName: 'Low Rating Example',
								name: 'exampleLow',
								type: 'string',
								default: '',
								placeholder: 'Less relevant or uncertain facts',
								description: 'Example of low-rated fact. Example: "Less relevant or uncertain facts".',
							},
						],
					},
				],
			},

			// SEARCH FIELDS
			{
				displayName: 'Search Query',
				name: 'querystring',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['search'],
					},
				},
				default: '',
				placeholder: 'user preferences and shopping history',
				typeOptions: {
					maxValue: 400,
				},
				description: 'The string to search for (max 400 characters). Example: "user preferences and shopping history".',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['search'],
					},
				},
				default: 50,
				typeOptions: {
					minValue: 1,
				},
				description: 'Max number of results to return',
			},
			{
				displayName: 'Scope',
				name: 'scope',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['search'],
					},
				},
				options: [
					{
						name: 'Edges',
						value: 'edges',
						description: 'Search for relationships between entities',
					},
					{
						name: 'Nodes',
						value: 'nodes',
						description: 'Search for entities/nodes in the graph',
					},
					{
						name: 'Episodes',
						value: 'episodes',
						description: 'Search for episodes/events in the graph',
					},
				],
				default: 'edges',
				description: 'The scope of the search. Edges for relationships, nodes for entities, episodes for events.',
			},
			{
				displayName: 'Reranker',
				name: 'reranker',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['search'],
					},
				},
				options: [
					{
						name: 'Cross Encoder',
						value: 'cross_encoder',
						description: 'Advanced neural reranking method',
					},
					{
						name: 'Episode Mentions',
						value: 'episode_mentions',
						description: 'Rerank based on frequency of mentions in episodes',
					},
					{
						name: 'MMR (Maximal Marginal Relevance)',
						value: 'mmr',
						description: 'Balance relevance and diversity in results',
					},
					{
						name: 'Node Distance',
						value: 'node_distance',
						description: 'Rerank based on distance from a center node',
					},
					{
						name: 'RRF (Reciprocal Rank Fusion)',
						value: 'rrf',
						description: 'Default reranking method combining multiple ranking signals',
					},
				],
				default: 'rrf',
				description: 'Reranking method for search results. RRF is recommended for most use cases.',
			},
			{
				displayName: 'Minimum Fact Rating',
				name: 'minFactRating',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['search'],
						scope: ['edges'],
					},
				},
				default: 0.0,
				typeOptions: {
					minValue: 0.0,
					maxValue: 1.0,
					numberPrecision: 2,
				},
				description: 'Minimum rating to filter relevant facts (0.0-1.0). Only applies to edge searches.',
			},
			{
				displayName: 'MMR Lambda',
				name: 'mmrLambda',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['search'],
						reranker: ['mmr'],
					},
				},
				required: true,
				default: 0.5,
				typeOptions: {
					minValue: 0.0,
					maxValue: 1.0,
					numberPrecision: 2,
				},
				description: 'Balance between relevance (0.0) and diversity (1.0) for MMR reranking. Required when using MMR reranker.',
			},
			{
				displayName: 'Center Node UUID',
				name: 'centerNodeUuid',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['search'],
						reranker: ['node_distance'],
					},
				},
				required: true,
				default: '',
				placeholder: '123e4567-e89b-12d3-a456-426614174000',
				description: 'UUID of the center node for distance-based reranking. Required when using node_distance reranker.',
			},
			{
				displayName: 'BFS Origin Node UUIDs',
				name: 'bfsOriginNodeUuids',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['search'],
					},
				},
				default: '',
				placeholder: '123e4567-e89b-12d3-a456-426614174000,987fcdeb-51a2-43f1-b3e4-567890123456',
				description: 'Comma-separated list of node UUIDs to seed breadth-first searches from. Example: "uuid1,uuid2,uuid3".',
			},
			{
				displayName: 'Search Filters',
				name: 'searchFilters',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['search'],
					},
				},
				default: '{}',
				placeholder: '{"node_labels": ["Person", "Organization"], "edge_types": ["WORKS_FOR", "KNOWS"]}',
				description: 'Search filters as JSON object. Can filter by node_labels, edge_types, created_at, expired_at, invalid_at, valid_at. Example: {"node_labels": ["Person"], "edge_types": ["KNOWS"]}',
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
						resource: ['graph'],
						operation: ['addData'],
					},
				},
				default: '',
				description: 'The data to add to the graph',
			},
			{
				displayName: 'Data Type',
				name: 'dataType',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['addData', 'addDataBatch'],
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
			{
				displayName: 'Created At',
				name: 'createdAt',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['addData'],
					},
				},
				default: '',
				description: 'Timestamp for the data (optional, ISO 8601 format)',
			},
			{
				displayName: 'Source Description',
				name: 'sourceDescription',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['addData'],
					},
				},
				default: '',
				typeOptions: {
					maxValue: 500,
				},
				description: 'Description of the source (optional, max 500 characters)',
			},
			{
				displayName: 'Episodes',
				name: 'episodes',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['addDataBatch'],
					},
				},
				default: {},
				placeholder: 'Add Episode',
				options: [
					{
						name: 'episodeValues',
						displayName: 'Episode',
						values: [
							{
								displayName: 'Data',
								name: 'data',
								type: 'string',
								typeOptions: {
									rows: 3,
								},
								default: '',
								description: 'The episode data',
								required: true,
							},
							{
								displayName: 'Type',
								name: 'type',
								type: 'options',
								options: [
									{
										name: 'Text',
										value: 'text',
									},
									{
										name: 'JSON',
										value: 'json',
									},
								],
								default: 'text',
								description: 'The type of episode data',
							},
						],
					},
				],
			},

			// MESSAGES FIELDS
			{
				displayName: 'Messages',
				name: 'messages',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['thread', 'session'],
						operation: ['addMessages', 'addMessagesBatch'],
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
								default: '',
								description: 'The role of the message sender',
								required: true,
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
			{
				displayName: 'Ignore Roles',
				name: 'ignoreRoles',
				type: 'multiOptions',
				displayOptions: {
					show: {
						resource: ['thread'],
						operation: ['addMessages'],
					},
				},
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
				default: [],
				description: 'Optional list of role types to ignore when adding messages to graph memory',
			},
			{
				displayName: 'Return Context',
				name: 'returnContext',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['thread'],
						operation: ['addMessages'],
					},
				},
				default: false,
				description: 'Whether to optionally return context block relevant to the most recent messages',
			},

			// FACT TRIPLE FIELDS
			{
				displayName: 'Fact',
				name: 'fact',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['addFactTriple'],
					},
				},
				default: '',
				placeholder: 'John works at Acme Corporation',
				typeOptions: {
					maxValue: 50,
				},
				description: 'The fact relating the two nodes that this edge represents (max 50 characters). Example: "John works at Acme Corporation".',
			},
			{
				displayName: 'Fact Name',
				name: 'factName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['addFactTriple'],
					},
				},
				default: '',
				placeholder: 'WORKS_AT',
				typeOptions: {
					minValue: 1,
					maxValue: 50,
				},
				description: 'The name of the edge to add. Should be all caps using snake case (max 50 characters). Example: "WORKS_AT", "RELATES_TO", "KNOWS"',
			},
			{
				displayName: 'Target Node Name',
				name: 'targetNodeName',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['addFactTriple'],
					},
				},
				default: '',
				placeholder: 'Acme Corporation',
				typeOptions: {
					maxValue: 50,
				},
				description: 'The name of the target node to add (max 50 characters). Example: "Acme Corporation".',
			},
			{
				displayName: 'Source Node Name',
				name: 'sourceNodeName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['addFactTriple'],
					},
				},
				default: '',
				placeholder: 'John Doe',
				typeOptions: {
					maxValue: 50,
				},
				description: 'The name of the source node to add (max 50 characters). Example: "John Doe".',
			},
			{
				displayName: 'Source Node Summary',
				name: 'sourceNodeSummary',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['addFactTriple'],
					},
				},
				default: '',
				placeholder: 'Software engineer with 5 years of experience',
				typeOptions: {
					maxValue: 500,
				},
				description: 'The summary of the source node to add (max 500 characters). Example: "Software engineer with 5 years of experience".',
			},
			{
				displayName: 'Target Node Summary',
				name: 'targetNodeSummary',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['addFactTriple'],
					},
				},
				default: '',
				placeholder: 'Technology company specializing in cloud solutions',
				typeOptions: {
					maxValue: 500,
				},
				description: 'The summary of the target node to add (max 500 characters). Example: "Technology company specializing in cloud solutions".',
			},
			{
				displayName: 'Source Node UUID',
				name: 'sourceNodeUuid',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['addFactTriple'],
					},
				},
				default: '',
				placeholder: '123e4567-e89b-12d3-a456-426614174000',
				description: 'The source node UUID. If provided, will use existing node instead of creating new one.',
			},
			{
				displayName: 'Target Node UUID',
				name: 'targetNodeUuid',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['addFactTriple'],
					},
				},
				default: '',
				placeholder: '987fcdeb-51a2-43f1-b3e4-567890123456',
				description: 'The target node UUID. If provided, will use existing node instead of creating new one.',
			},
			{
				displayName: 'Fact UUID',
				name: 'factUuid',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['addFactTriple'],
					},
				},
				default: '',
				placeholder: 'abc123e4-5678-9def-ghi0-jklmnop12345',
				description: 'The UUID of the edge to add. If provided, will use this UUID for the edge.',
			},
			{
				displayName: 'Created At',
				name: 'createdAt',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['addFactTriple'],
					},
				},
				default: '',
				placeholder: '2024-01-15T10:30:00Z',
				description: 'The timestamp of the message in ISO 8601 format. Example: "2024-01-15T10:30:00Z".',
			},
			{
				displayName: 'Valid At',
				name: 'validAt',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['addFactTriple'],
					},
				},
				default: '',
				placeholder: '2024-01-15T10:30:00Z',
				description: 'The time at which the fact becomes true (ISO 8601 format). Example: "2024-01-15T10:30:00Z".',
			},
			{
				displayName: 'Invalid At',
				name: 'invalidAt',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['addFactTriple'],
					},
				},
				default: '',
				placeholder: '2024-12-31T23:59:59Z',
				description: 'The time at which the fact stops being true (ISO 8601 format). Example: "2024-12-31T23:59:59Z".',
			},
			{
				displayName: 'Expired At',
				name: 'expiredAt',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['graph'],
						operation: ['addFactTriple'],
					},
				},
				default: '',
				placeholder: '2024-12-31T23:59:59Z',
				description: 'The time at which the edge expires (ISO 8601 format). Example: "2024-12-31T23:59:59Z".',
			},

			// ENTITY TYPES FIELDS
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['entityType'],
						operation: ['get'],
					},
				},
				default: '',
				description: 'User ID to get user-specific entity types (optional)',
			},

			{
				displayName: 'Entity Types',
				name: 'entityTypes',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['entityType', 'graph'],
						operation: ['set', 'setEntityTypes'],
					},
				},
				default: '[]',
				description: 'Array of entity type objects',
			},
			{
				displayName: 'Edge Types',
				name: 'edgeTypes',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['entityType', 'graph'],
						operation: ['set', 'setEntityTypes'],
					},
				},
				default: '[]',
				description: 'Array of edge type objects',
			},

			// THREAD CONTEXT FIELDS
			{
				displayName: 'Min Rating',
				name: 'minRating',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['thread'],
						operation: ['getUserContext'],
					},
				},
				default: 0,
				typeOptions: {
					minValue: 0,
					maxValue: 1,
					numberPrecision: 2,
				},
				description: 'Filter relevant facts by their rating (optional)',
			},
			{
				displayName: 'Mode',
				name: 'mode',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['thread'],
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
				description: 'Context mode - basic for lower latency',
			},

			// THREAD MESSAGE FIELDS
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['thread'],
						operation: ['getMessages'],
					},
				},
				default: 50,
				typeOptions: {
					minValue: 1,
				},
				description: 'Max number of results to return',
			},
			{
				displayName: 'Cursor',
				name: 'cursor',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['thread'],
						operation: ['getMessages'],
					},
				},
				default: 0,
				typeOptions: {
					minValue: 0,
				},
				description: 'Cursor for pagination (optional)',
			},

			// SESSION MESSAGE FIELDS
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['session'],
						operation: ['getMessages'],
					},
				},
				default: 50,
				typeOptions: {
					minValue: 1,
				},
				description: 'Max number of results to return',
			},
			{
				displayName: 'Cursor',
				name: 'cursor',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['session'],
						operation: ['getMessages'],
					},
				},
				default: 0,
				typeOptions: {
					minValue: 0,
				},
				description: 'Cursor for pagination (optional)',
			},

			// PAGINATION FIELDS
			{
				displayName: 'Page Number',
				name: 'pageNumber',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['thread', 'session'],
						operation: ['list'],
					},
				},
				default: 1,
				typeOptions: {
					minValue: 1,
				},
				description: 'Page number for pagination, starting from 1',
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['thread', 'session'],
						operation: ['list'],
					},
				},
				default: 25,
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				description: 'Number of items to retrieve per page',
			},
			{
				displayName: 'Order By',
				name: 'orderBy',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['thread', 'session'],
						operation: ['list'],
					},
				},
				options: [
					{
						name: 'Created At',
						value: 'created_at',
					},
					{
						name: 'Session ID',
						value: 'session_id',
					},
					{
						name: 'Thread ID',
						value: 'thread_id',
					},
					{
						name: 'Updated At',
						value: 'updated_at',
					},
					{
						name: 'User ID',
						value: 'user_id',
					},
				],
				default: 'created_at',
				description: 'Field to order the results by',
			},
			{
				displayName: 'Ascending Order',
				name: 'asc',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['thread', 'session'],
						operation: ['list'],
					},
				},
				default: true,
				description: 'Whether to sort in ascending order',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: any;

				if (resource === 'user') {
					responseData = await executeUserOperation.call(this, i, operation);
				} else if (resource === 'thread') {
					responseData = await executeThreadOperation.call(this, i, operation);
				} else if (resource === 'graph') {
					responseData = await executeGraphOperation.call(this, i, operation);
				} else if (resource === 'node') {
					responseData = await executeNodeOperation.call(this, i, operation);
				} else if (resource === 'edge') {
					responseData = await executeEdgeOperation.call(this, i, operation);
				} else if (resource === 'episode') {
					responseData = await executeEpisodeOperation.call(this, i, operation);
				} else if (resource === 'entityType') {
					responseData = await executeEntityTypeOperation.call(this, i, operation);
				} else if (resource === 'session') {
					responseData = await executeSessionOperation.call(this, i, operation);
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject[]),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: error.message }),
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

// USER OPERATION HANDLER
async function executeUserOperation(this: IExecuteFunctions, itemIndex: number, operation: string): Promise<any> {
	const userId = this.getNodeParameter('userId', itemIndex) as string;

	switch (operation) {
		case 'add':
			return await addUser.call(this, itemIndex, userId);
		case 'list':
			return await getUsers.call(this);
		case 'get':
			return await getUser.call(this, userId);
		case 'update':
			return await updateUser.call(this, itemIndex, userId);
		case 'delete':
			return await deleteUser.call(this, userId);
		case 'getNode':
			return await getUserNode.call(this, userId);
		case 'getThreads':
			return await getUserThreads.call(this, userId);
		default:
			throw new NodeApiError(this.getNode(), { message: `Unknown user operation: ${operation}` });
	}
}

// THREAD OPERATION HANDLER
async function executeThreadOperation(this: IExecuteFunctions, itemIndex: number, operation: string): Promise<any> {
	switch (operation) {
		case 'list':
			return await listThreads.call(this, itemIndex);
		case 'create':
			return await createThread.call(this, itemIndex);
		case 'delete':
			return await deleteThread.call(this, itemIndex);
		case 'getMessages':
			return await getThreadMessages.call(this, itemIndex);
		case 'addMessages':
			return await addMessagesToThread.call(this, itemIndex);
		case 'addMessagesBatch':
			return await addMessagesToThreadBatch.call(this, itemIndex);
		case 'getUserContext':
			return await getUserContext.call(this, itemIndex);
		default:
			throw new NodeApiError(this.getNode(), { message: `Unknown thread operation: ${operation}` });
	}
}

// GRAPH OPERATION HANDLER
async function executeGraphOperation(this: IExecuteFunctions, itemIndex: number, operation: string): Promise<any> {
	const graphId = this.getNodeParameter('graphId', itemIndex, '') as string;

	switch (operation) {
		case 'create':
			return await createGraph.call(this, itemIndex, graphId);
		case 'list':
			return await listGraphs.call(this);
		case 'get':
			return await getGraph.call(this, graphId);
		case 'delete':
			return await deleteGraph.call(this, graphId);
		case 'update':
			return await updateGraph.call(this, itemIndex, graphId);
		case 'search':
			return await searchGraph.call(this, itemIndex);
		case 'addData':
			return await addDataToGraph.call(this, itemIndex);
		case 'addDataBatch':
			return await addDataToGraphBatch.call(this, itemIndex);
		case 'addFactTriple':
			return await addFactTriple.call(this, itemIndex, graphId);
		case 'clone':
			return await cloneGraph.call(this, itemIndex, graphId);
		case 'getEntityTypes':
			return await getEntityTypes.call(this, itemIndex);
		case 'setEntityTypes':
			return await setEntityTypes.call(this, itemIndex);
		default:
			throw new NodeApiError(this.getNode(), { message: `Unknown graph operation: ${operation}` });
	}
}

// NODE OPERATION HANDLER
async function executeNodeOperation(this: IExecuteFunctions, itemIndex: number, operation: string): Promise<any> {
	switch (operation) {
		case 'get':
			return await getNode.call(this, itemIndex);
		case 'getByGraph':
			return await getNodesByGraph.call(this, itemIndex);
		case 'getByUser':
			return await getNodesByUser.call(this, itemIndex);
		case 'getEntityEdges':
			return await getEntityEdgesForNode.call(this, itemIndex);
		case 'getEpisodes':
			return await getEpisodesForNode.call(this, itemIndex);
		default:
			throw new NodeApiError(this.getNode(), { message: `Unknown node operation: ${operation}` });
	}
}

// EDGE OPERATION HANDLER
async function executeEdgeOperation(this: IExecuteFunctions, itemIndex: number, operation: string): Promise<any> {
	switch (operation) {
		case 'get':
			return await getEdge.call(this, itemIndex);
		case 'getByGraph':
			return await getEdgesByGraph.call(this, itemIndex);
		case 'getByUser':
			return await getEdgesByUser.call(this, itemIndex);
		case 'delete':
			return await deleteEdge.call(this, itemIndex);
		default:
			throw new NodeApiError(this.getNode(), { message: `Unknown edge operation: ${operation}` });
	}
}

// EPISODE OPERATION HANDLER
async function executeEpisodeOperation(this: IExecuteFunctions, itemIndex: number, operation: string): Promise<any> {
	switch (operation) {
		case 'get':
			return await getEpisode.call(this, itemIndex);
		case 'getByGraph':
			return await getEpisodesByGraph.call(this, itemIndex);
		case 'getByUser':
			return await getEpisodesByUser.call(this, itemIndex);
		case 'delete':
			return await deleteEpisode.call(this, itemIndex);
		case 'getNodesAndEdges':
			return await getEpisodeNodesAndEdges.call(this, itemIndex);
		default:
			throw new NodeApiError(this.getNode(), { message: `Unknown episode operation: ${operation}` });
	}
}

// ENTITY TYPE OPERATION HANDLER
async function executeEntityTypeOperation(this: IExecuteFunctions, itemIndex: number, operation: string): Promise<any> {
	switch (operation) {
		case 'get':
			return await getEntityTypes.call(this, itemIndex);
		case 'set':
			return await setEntityTypes.call(this, itemIndex);
		default:
			throw new NodeApiError(this.getNode(), { message: `Unknown entity type operation: ${operation}` });
	}
}

// SESSION OPERATION HANDLER
async function executeSessionOperation(this: IExecuteFunctions, itemIndex: number, operation: string): Promise<any> {
	switch (operation) {
		case 'list':
			return await listSessions.call(this, itemIndex);
		case 'create':
			return await createSession.call(this, itemIndex);
		case 'get':
			return await getSession.call(this, itemIndex);
		case 'getMessages':
			return await getSessionMessages.call(this, itemIndex);
		case 'addMessages':
			return await addSessionMessages.call(this, itemIndex);
		default:
			throw new NodeApiError(this.getNode(), { message: `Unknown session operation: ${operation}` });
	}
}



// ============================================================================
// USER METHODS
// ============================================================================

async function addUser(this: IExecuteFunctions, itemIndex: number, userId: string): Promise<any> {
	const email = this.getNodeParameter('email', itemIndex, '') as string;
	const firstName = this.getNodeParameter('firstName', itemIndex, '') as string;
	const lastName = this.getNodeParameter('lastName', itemIndex, '') as string;
	const metadata = this.getNodeParameter('metadata', itemIndex, '{}') as string;
	const factRatingInstructionData = this.getNodeParameter('factRatingInstruction.instructionValues', itemIndex, []) as IDataObject[];

	const body: IDataObject = {
		user_id: userId,
	};

	if (email) body.email = email;
	if (firstName) body.first_name = firstName;
	if (lastName) body.last_name = lastName;
	if (metadata !== '{}') body.metadata = JSON.parse(metadata);

	// Handle fact rating instruction
	if (factRatingInstructionData.length > 0) {
		const instruction = factRatingInstructionData[0];
		if (instruction.instruction || instruction.exampleHigh || instruction.exampleMedium || instruction.exampleLow) {
			body.fact_rating_instruction = {
				instruction: instruction.instruction as string,
				examples: {
					high: instruction.exampleHigh as string,
					medium: instruction.exampleMedium as string,
					low: instruction.exampleLow as string,
				},
			};
		}
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://api.getzep.com/api/v2/users',
		body,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function getUsers(this: IExecuteFunctions): Promise<any> {
	const options: IHttpRequestOptions = {
		method: 'GET',
		url: 'https://api.getzep.com/api/v2/users',
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function getUser(this: IExecuteFunctions, userId: string): Promise<any> {
	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `https://api.getzep.com/api/v2/users/${userId}`,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function updateUser(this: IExecuteFunctions, itemIndex: number, userId: string): Promise<any> {
	const email = this.getNodeParameter('email', itemIndex, '') as string;
	const firstName = this.getNodeParameter('firstName', itemIndex, '') as string;
	const lastName = this.getNodeParameter('lastName', itemIndex, '') as string;
	const metadata = this.getNodeParameter('metadata', itemIndex, '{}') as string;
	const factRatingInstructionData = this.getNodeParameter('factRatingInstruction.instructionValues', itemIndex, []) as IDataObject[];

	const body: IDataObject = {};

	if (email) body.email = email;
	if (firstName) body.first_name = firstName;
	if (lastName) body.last_name = lastName;
	if (metadata !== '{}') body.metadata = JSON.parse(metadata);

	// Handle fact rating instruction
	if (factRatingInstructionData.length > 0) {
		const instruction = factRatingInstructionData[0];
		if (instruction.instruction || instruction.exampleHigh || instruction.exampleMedium || instruction.exampleLow) {
			body.fact_rating_instruction = {
				instruction: instruction.instruction as string,
				examples: {
					high: instruction.exampleHigh as string,
					medium: instruction.exampleMedium as string,
					low: instruction.exampleLow as string,
				},
			};
		}
	}

	const options: IHttpRequestOptions = {
		method: 'PATCH',
		url: `https://api.getzep.com/api/v2/users/${userId}`,
		body,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function deleteUser(this: IExecuteFunctions, userId: string): Promise<any> {
	const options: IHttpRequestOptions = {
		method: 'DELETE',
		url: `https://api.getzep.com/api/v2/users/${userId}`,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function getUserNode(this: IExecuteFunctions, userId: string): Promise<any> {
	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `https://api.getzep.com/api/v2/users/${userId}/node`,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function getUserThreads(this: IExecuteFunctions, userId: string): Promise<any> {
	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `https://api.getzep.com/api/v2/users/${userId}/threads`,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

// ============================================================================
// THREAD METHODS
// ============================================================================

async function listThreads(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const pageNumber = this.getNodeParameter('pageNumber', itemIndex, 1) as number;
	const pageSize = this.getNodeParameter('pageSize', itemIndex, 25) as number;
	const orderBy = this.getNodeParameter('orderBy', itemIndex, 'created_at') as string;
	const asc = this.getNodeParameter('asc', itemIndex, true) as boolean;

	const qs: IDataObject = {};
	if (pageNumber) qs.page_number = pageNumber;
	if (pageSize) qs.page_size = pageSize;
	if (orderBy) qs.order_by = orderBy;
	qs.asc = asc;

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: 'https://api.getzep.com/api/v2/threads',
		qs,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
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

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function deleteThread(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const threadId = this.getNodeParameter('threadId', itemIndex) as string;

	const options: IHttpRequestOptions = {
		method: 'DELETE',
		url: `https://api.getzep.com/api/v2/threads/${threadId}`,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function getThreadMessages(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const threadId = this.getNodeParameter('threadId', itemIndex) as string;
	const limit = this.getNodeParameter('limit', itemIndex, 0) as number;
	const cursor = this.getNodeParameter('cursor', itemIndex, 0) as number;

	const qs: IDataObject = {};
	if (limit > 0) qs.limit = limit;
	if (cursor > 0) qs.cursor = cursor;

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `https://api.getzep.com/api/v2/threads/${threadId}/messages`,
		qs,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function addMessagesToThread(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const threadId = this.getNodeParameter('threadId', itemIndex) as string;
	const messagesData = this.getNodeParameter('messages.messageValues', itemIndex, []) as IDataObject[];
	const ignoreRoles = this.getNodeParameter('ignoreRoles', itemIndex, []) as string[];
	const returnContext = this.getNodeParameter('returnContext', itemIndex, false) as boolean;

	const messages = messagesData.map((msg: IDataObject) => ({
		role: msg.role,
		role_type: msg.role_type,
		content: msg.content,
	}));

	const body: IDataObject = {
		messages,
	};

	if (ignoreRoles.length > 0) body.ignore_roles = ignoreRoles;
	if (returnContext) body.return_context = returnContext;

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `https://api.getzep.com/api/v2/threads/${threadId}/messages`,
		body,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function addMessagesToThreadBatch(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const threadId = this.getNodeParameter('threadId', itemIndex) as string;
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
		url: `https://api.getzep.com/api/v2/threads/${threadId}/messages/batch`,
		body,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function getUserContext(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const threadId = this.getNodeParameter('threadId', itemIndex) as string;
	const minRating = this.getNodeParameter('minRating', itemIndex, 0) as number;
	const mode = this.getNodeParameter('mode', itemIndex, 'summary') as string;

	const qs: IDataObject = {};
	if (minRating > 0) qs.minRating = minRating;
	if (mode !== 'summary') qs.mode = mode;

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `https://api.getzep.com/api/v2/threads/${threadId}/context`,
		qs,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

// ============================================================================
// GRAPH METHODS
// ============================================================================

async function createGraph(this: IExecuteFunctions, itemIndex: number, graphId: string): Promise<any> {
	const name = this.getNodeParameter('name', itemIndex, '') as string;
	const description = this.getNodeParameter('description', itemIndex, '') as string;
	const factRatingInstructionData = this.getNodeParameter('factRatingInstruction.instructionValues', itemIndex, []) as IDataObject[];

	const body: IDataObject = {
		graph_id: graphId,
	};

	if (name) body.name = name;
	if (description) body.description = description;

	// Handle fact rating instruction
	if (factRatingInstructionData.length > 0) {
		const instruction = factRatingInstructionData[0];
		if (instruction.instruction || instruction.exampleHigh || instruction.exampleMedium || instruction.exampleLow) {
			body.fact_rating_instruction = {
				instruction: instruction.instruction as string,
				examples: {
					high: instruction.exampleHigh as string,
					medium: instruction.exampleMedium as string,
					low: instruction.exampleLow as string,
				},
			};
		}
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://api.getzep.com/api/v2/graph/create',
		body,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function listGraphs(this: IExecuteFunctions): Promise<any> {
	const options: IHttpRequestOptions = {
		method: 'GET',
		url: 'https://api.getzep.com/api/v2/graph/list-all',
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function getGraph(this: IExecuteFunctions, graphId: string): Promise<any> {
	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `https://api.getzep.com/api/v2/graph/${graphId}`,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function deleteGraph(this: IExecuteFunctions, graphId: string): Promise<any> {
	const options: IHttpRequestOptions = {
		method: 'DELETE',
		url: `https://api.getzep.com/api/v2/graph/${graphId}`,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function updateGraph(this: IExecuteFunctions, itemIndex: number, graphId: string): Promise<any> {
	const name = this.getNodeParameter('name', itemIndex, '') as string;
	const description = this.getNodeParameter('description', itemIndex, '') as string;
	const factRatingInstructionData = this.getNodeParameter('factRatingInstruction.instructionValues', itemIndex, []) as IDataObject[];

	const body: IDataObject = {};

	if (name) body.name = name;
	if (description) body.description = description;

	// Handle fact rating instruction
	if (factRatingInstructionData.length > 0) {
		const instruction = factRatingInstructionData[0];
		if (instruction.instruction || instruction.exampleHigh || instruction.exampleMedium || instruction.exampleLow) {
			body.fact_rating_instruction = {
				instruction: instruction.instruction as string,
				examples: {
					high: instruction.exampleHigh as string,
					medium: instruction.exampleMedium as string,
					low: instruction.exampleLow as string,
				},
			};
		}
	}

	const options: IHttpRequestOptions = {
		method: 'PATCH',
		url: `https://api.getzep.com/api/v2/graph/${graphId}`,
		body,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function searchGraph(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const querystring = this.getNodeParameter('querystring', itemIndex) as string;
	const graphId = this.getNodeParameter('graphId', itemIndex, '') as string;
	const userId = this.getNodeParameter('userId', itemIndex, '') as string;
	const limit = this.getNodeParameter('limit', itemIndex, 10) as number;
	const scope = this.getNodeParameter('scope', itemIndex, 'edges') as string;
	const reranker = this.getNodeParameter('reranker', itemIndex, 'rrf') as string;
	const minFactRating = this.getNodeParameter('minFactRating', itemIndex, 0.0) as number;
	const mmrLambda = this.getNodeParameter('mmrLambda', itemIndex, 0.5) as number;
	const centerNodeUuid = this.getNodeParameter('centerNodeUuid', itemIndex, '') as string;
	const bfsOriginNodeUuids = this.getNodeParameter('bfsOriginNodeUuids', itemIndex, '') as string;
	const searchFilters = this.getNodeParameter('searchFilters', itemIndex, '{}') as string;

	const body: IDataObject = {
		query: querystring,
		limit,
		scope,
		reranker,
	};

	if (graphId) body.graph_id = graphId;
	if (userId) body.user_id = userId;

	// Add optional parameters if provided
	if (minFactRating > 0.0) body.min_fact_rating = minFactRating;

	// Required parameters for specific rerankers
	if (reranker === 'mmr') body.mmr_lambda = mmrLambda;
	if (reranker === 'node_distance' && centerNodeUuid) body.center_node_uuid = centerNodeUuid;

	// Handle BFS origin nodes
	if (bfsOriginNodeUuids) {
		const uuids = bfsOriginNodeUuids.split(',').map(uuid => uuid.trim()).filter(uuid => uuid);
		if (uuids.length > 0) body.bfs_origin_node_uuids = uuids;
	}

	// Handle search filters
	if (searchFilters !== '{}') {
		try {
			body.search_filters = JSON.parse(searchFilters);
		} catch (error) {
			// Ignore invalid JSON, will use default empty filters
		}
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://api.getzep.com/api/v2/graph/search',
		body,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function addDataToGraph(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const data = this.getNodeParameter('data', itemIndex) as string;
	const dataType = this.getNodeParameter('dataType', itemIndex, 'text') as string;
	const graphId = this.getNodeParameter('graphId', itemIndex, '') as string;
	const userId = this.getNodeParameter('userId', itemIndex, '') as string;
	const createdAt = this.getNodeParameter('createdAt', itemIndex, '') as string;
	const sourceDescription = this.getNodeParameter('sourceDescription', itemIndex, '') as string;

	// Validate that at least one ID is provided
	if (!graphId && !userId) {
		throw new NodeApiError(this.getNode(), {
			message: 'Either Graph ID or User ID must be provided for addData operation'
		});
	}

	const body: IDataObject = {
		data,
		type: dataType,
	};

	// Add optional parameters
	if (createdAt) body.created_at = createdAt;
	if (sourceDescription) body.source_description = sourceDescription;

	// Only include one ID parameter to avoid conflict
	if (graphId) {
		body.graph_id = graphId;
	} else if (userId) {
		body.user_id = userId;
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://api.getzep.com/api/v2/graph',
		body,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function addDataToGraphBatch(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const episodesData = this.getNodeParameter('episodes.episodeValues', itemIndex, []) as IDataObject[];
	const graphId = this.getNodeParameter('graphId', itemIndex, '') as string;
	const userId = this.getNodeParameter('userId', itemIndex, '') as string;

	// Validate that at least one ID is provided
	if (!graphId && !userId) {
		throw new NodeApiError(this.getNode(), {
			message: 'Either Graph ID or User ID must be provided for addDataBatch operation'
		});
	}

	const episodes = episodesData.map((ep: IDataObject) => ({
		data: ep.data,
		type: ep.type,
	}));

	const body: IDataObject = {
		episodes,
	};

	// Only include one ID parameter to avoid conflict
	if (graphId) {
		body.graph_id = graphId;
	} else if (userId) {
		body.user_id = userId;
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://api.getzep.com/api/v2/graph-batch',
		body,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function addFactTriple(this: IExecuteFunctions, itemIndex: number, graphId: string): Promise<any> {
	const fact = this.getNodeParameter('fact', itemIndex) as string;
	const factName = this.getNodeParameter('factName', itemIndex) as string;
	const targetNodeName = this.getNodeParameter('targetNodeName', itemIndex) as string;
	const sourceNodeName = this.getNodeParameter('sourceNodeName', itemIndex, '') as string;
	const sourceNodeSummary = this.getNodeParameter('sourceNodeSummary', itemIndex, '') as string;
	const targetNodeSummary = this.getNodeParameter('targetNodeSummary', itemIndex, '') as string;
	const sourceNodeUuid = this.getNodeParameter('sourceNodeUuid', itemIndex, '') as string;
	const targetNodeUuid = this.getNodeParameter('targetNodeUuid', itemIndex, '') as string;
	const factUuid = this.getNodeParameter('factUuid', itemIndex, '') as string;
	const createdAt = this.getNodeParameter('createdAt', itemIndex, '') as string;
	const validAt = this.getNodeParameter('validAt', itemIndex, '') as string;
	const invalidAt = this.getNodeParameter('invalidAt', itemIndex, '') as string;
	const expiredAt = this.getNodeParameter('expiredAt', itemIndex, '') as string;

	const body: IDataObject = {
		fact,
		fact_name: factName,
		target_node_name: targetNodeName,
	};

	// Add graph_id if provided
	if (graphId) body.graph_id = graphId;

	// Add optional parameters
	if (sourceNodeName) body.source_node_name = sourceNodeName;
	if (sourceNodeSummary) body.source_node_summary = sourceNodeSummary;
	if (targetNodeSummary) body.target_node_summary = targetNodeSummary;
	if (sourceNodeUuid) body.source_node_uuid = sourceNodeUuid;
	if (targetNodeUuid) body.target_node_uuid = targetNodeUuid;
	if (factUuid) body.fact_uuid = factUuid;
	if (createdAt) body.created_at = createdAt;
	if (validAt) body.valid_at = validAt;
	if (invalidAt) body.invalid_at = invalidAt;
	if (expiredAt) body.expired_at = expiredAt;

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://api.getzep.com/api/v2/graph/add-fact-triple',
		body,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function cloneGraph(this: IExecuteFunctions, itemIndex: number, graphId: string): Promise<any> {
	const body: IDataObject = {
		graph_id: graphId,
	};

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://api.getzep.com/api/v2/graph/clone',
		body,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

// ============================================================================
// NODE METHODS
// ============================================================================

async function getNode(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const uuid = this.getNodeParameter('uuid', itemIndex) as string;

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `https://api.getzep.com/api/v2/graph/node/${uuid}`,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function getNodesByGraph(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const graphId = this.getNodeParameter('graphId', itemIndex) as string;

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `https://api.getzep.com/api/v2/graph/node/graph/${graphId}`,
		body: {},
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function getNodesByUser(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const userId = this.getNodeParameter('userId', itemIndex) as string;

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `https://api.getzep.com/api/v2/graph/node/user/${userId}`,
		body: {},
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function getEntityEdgesForNode(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const uuid = this.getNodeParameter('uuid', itemIndex) as string;

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `https://api.getzep.com/api/v2/graph/node/${uuid}/entity-edges`,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function getEpisodesForNode(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const uuid = this.getNodeParameter('uuid', itemIndex) as string;

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `https://api.getzep.com/api/v2/graph/node/${uuid}/episodes`,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

// ============================================================================
// EDGE METHODS
// ============================================================================

async function getEdge(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const uuid = this.getNodeParameter('uuid', itemIndex) as string;

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `https://api.getzep.com/api/v2/graph/edge/${uuid}`,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function getEdgesByGraph(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const graphId = this.getNodeParameter('graphId', itemIndex) as string;

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `https://api.getzep.com/api/v2/graph/edge/graph/${graphId}`,
		body: {},
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function getEdgesByUser(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const userId = this.getNodeParameter('userId', itemIndex) as string;

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `https://api.getzep.com/api/v2/graph/edge/user/${userId}`,
		body: {},
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function deleteEdge(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const uuid = this.getNodeParameter('uuid', itemIndex) as string;

	const options: IHttpRequestOptions = {
		method: 'DELETE',
		url: `https://api.getzep.com/api/v2/graph/edge/${uuid}`,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

// ============================================================================
// EPISODE METHODS
// ============================================================================

async function getEpisode(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const uuid = this.getNodeParameter('uuid', itemIndex) as string;

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `https://api.getzep.com/api/v2/graph/episodes/${uuid}`,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function getEpisodesByGraph(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const graphId = this.getNodeParameter('graphId', itemIndex) as string;

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `https://api.getzep.com/api/v2/graph/episodes/graph/${graphId}`,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function getEpisodesByUser(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const userId = this.getNodeParameter('userId', itemIndex) as string;

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `https://api.getzep.com/api/v2/graph/episodes/user/${userId}`,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function deleteEpisode(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const uuid = this.getNodeParameter('uuid', itemIndex) as string;

	const options: IHttpRequestOptions = {
		method: 'DELETE',
		url: `https://api.getzep.com/api/v2/graph/episodes/${uuid}`,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function getEpisodeNodesAndEdges(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const uuid = this.getNodeParameter('uuid', itemIndex) as string;

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `https://api.getzep.com/api/v2/graph/episodes/${uuid}/nodes-and-edges`,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

// ============================================================================
// ENTITY TYPE METHODS
// ============================================================================

async function getEntityTypes(this: IExecuteFunctions, itemIndex?: number): Promise<any> {
	const qs: IDataObject = {};

	if (itemIndex !== undefined) {
		const userId = this.getNodeParameter('userId', itemIndex, '') as string;
		const graphId = this.getNodeParameter('graphId', itemIndex, '') as string;

		if (userId) qs.user_id = userId;
		if (graphId) qs.graph_id = graphId;
	}

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: 'https://api.getzep.com/api/v2/entity-types',
		qs,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function setEntityTypes(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const entityTypes = this.getNodeParameter('entityTypes', itemIndex, '[]') as string;
	const edgeTypes = this.getNodeParameter('edgeTypes', itemIndex, '[]') as string;

	const body: IDataObject = {};

	if (entityTypes !== '[]') body.entity_types = JSON.parse(entityTypes);
	if (edgeTypes !== '[]') body.edge_types = JSON.parse(edgeTypes);

	const options: IHttpRequestOptions = {
		method: 'PUT',
		url: 'https://api.getzep.com/api/v2/entity-types',
		body,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

// ============================================================================
// SESSION METHODS
// ============================================================================

async function listSessions(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const pageNumber = this.getNodeParameter('pageNumber', itemIndex, 1) as number;
	const pageSize = this.getNodeParameter('pageSize', itemIndex, 25) as number;
	const orderBy = this.getNodeParameter('orderBy', itemIndex, 'created_at') as string;
	const asc = this.getNodeParameter('asc', itemIndex, true) as boolean;

	const qs: IDataObject = {};
	if (pageNumber) qs.page_number = pageNumber;
	if (pageSize) qs.page_size = pageSize;
	if (orderBy) qs.order_by = orderBy;
	qs.asc = asc;

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: 'https://api.getzep.com/api/v2/sessions-ordered',
		qs,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function createSession(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const sessionId = this.getNodeParameter('sessionId', itemIndex) as string;
	const userId = this.getNodeParameter('userId', itemIndex) as string;

	const body: IDataObject = {
		session_id: sessionId,
		user_id: userId,
	};

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://api.getzep.com/api/v2/sessions',
		body,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function getSession(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const sessionId = this.getNodeParameter('sessionId', itemIndex) as string;

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `https://api.getzep.com/api/v2/sessions/${sessionId}`,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function getSessionMessages(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const sessionId = this.getNodeParameter('sessionId', itemIndex) as string;
	const limit = this.getNodeParameter('limit', itemIndex, 0) as number;
	const cursor = this.getNodeParameter('cursor', itemIndex, 0) as number;

	const qs: IDataObject = {};
	if (limit > 0) qs.limit = limit;
	if (cursor > 0) qs.cursor = cursor;

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: `https://api.getzep.com/api/v2/sessions/${sessionId}/messages`,
		qs,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

async function addSessionMessages(this: IExecuteFunctions, itemIndex: number): Promise<any> {
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
		url: `https://api.getzep.com/api/v2/sessions/${sessionId}/messages`,
		body,
		json: true,
	};

	return await this.helpers.httpRequestWithAuthentication.call(this, 'zepApi', options);
}

