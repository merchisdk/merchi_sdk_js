import { generateUUID } from './uuid.js';
import {
    addPropertyTo,
    fromJson,
    getOne,
    getList,
    fromJsonList,
} from './model.js';
import { Company } from './company.js';
import { Domain } from './domain.js';
import { User } from './user.js';
import { AgentConversation } from './agent_conversation.js';
import { SupportConversation } from './support_conversation.js';
import { Request } from './model.js';

export function AgentTokenUsage() {
    this.resource = '/agent_token_usage';
    this.json = 'agentTokenUsage';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'createdAt');
    addPropertyTo(this, 'companyId');
    addPropertyTo(this, 'domainId');
    addPropertyTo(this, 'userId');
    addPropertyTo(this, 'company', Company);
    addPropertyTo(this, 'domain', Domain);
    addPropertyTo(this, 'user', User);
    addPropertyTo(this, 'agentConversation', AgentConversation);
    addPropertyTo(this, 'supportConversation', SupportConversation);
    addPropertyTo(this, 'agentConversationId');
    addPropertyTo(this, 'supportConversationId');
    addPropertyTo(this, 'sourceType');
    addPropertyTo(this, 'modelName');
    addPropertyTo(this, 'promptTokens');
    addPropertyTo(this, 'completionTokens');
    addPropertyTo(this, 'totalTokens');

    this.get = function (success, error, embed) {
        var self = this;
        function handleResponse(result) {
            success(
                fromJson(self, result[self.json], { makesDirty: false })
            );
        }
        getOne({
            resource: this.resource,
            id: this.id(),
            success: handleResponse,
            error: error,
            embed: embed,
        });
    };
}

export function AgentTokenUsages() {
    this.resource = '/agent_token_usage';
    this.json = 'agentTokenUsage';
    this.single = AgentTokenUsage;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result, { makesDirty: false }));
        }
        getList(this.resource, handleResponse, error, parameters || {});
    };

    this.record = function (payload, success, error) {
        var request = new Request();
        request.resource('/agent_token_usage/').method('POST');
        Object.keys(payload || {}).forEach(function(key) {
            var value = payload[key];
            if (value !== undefined && value !== null) {
                request.data().add(key, value);
            }
        });
        function handleResponse(status, data) {
            if (status >= 200 && status < 300) {
                if (success) {
                    success(data);
                }
            } else if (error) {
                error(status, data);
            }
        }
        request.responseHandler(handleResponse).errorHandler(handleResponse);
        request.send();
    };
}
