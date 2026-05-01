import { generateUUID } from './uuid.js';
import { addPropertyTo, serialise, fromJson, create, enumerateFiles, getOne, getList, fromJsonList } from './model.js';
import { User } from './user.js';
import { Domain } from './domain.js';

export function AgentConversation() {
    this.resource = '/agent_conversations';
    this.json = 'agentConversation';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'archived');
    addPropertyTo(this, 'id');
    addPropertyTo(this, 'conversationId');
    addPropertyTo(this, 'initialPrompt');
    addPropertyTo(this, 'creationDate');
    addPropertyTo(this, 'serviceProvider');
    addPropertyTo(this, 'user', User);
    addPropertyTo(this, 'domain', Domain);

    this.create = function (success, error, embed, as_domain) {
        var data = serialise(this),
            self = this;
        function handleResponse(result) {
            success(fromJson(self, result[self.json]));
        }
        create({resource: this.resource,
                parameters: data[0],
                files: enumerateFiles(data[1]),
                as_domain: as_domain,
                success: handleResponse,
                error: error,
                embed: embed});
    };

    this.get = function (success, error, embed) {
        var self = this;
        function handleResponse(result) {
            success(fromJson(self, result[self.json],
                             {makesDirty: false}));
        }
        getOne({resource: this.resource,
                id: this.id(),
                success: handleResponse,
                error: error,
                embed: embed});
    };
}

export function AgentConversations() {
    this.resource = '/agent_conversations';
    this.json = 'agentConversations';
    this.single = AgentConversation;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result, {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error, parameters || {});
    };
}


