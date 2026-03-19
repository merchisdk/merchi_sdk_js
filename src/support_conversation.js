import { generateUUID } from './uuid.js';
import { addPropertyTo, serialise, fromJson, create, getOne, getList, fromJsonList } from './model.js';
import { Domain } from './domain.js';
import { User } from './user.js';
import { SupportMessage } from './support_message.js';

export function SupportConversation() {
    this.resource = '/support_conversations';
    this.json = 'supportConversation';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'creationDate');
    addPropertyTo(this, 'lastMessageAt');
    addPropertyTo(this, 'domainId');
    addPropertyTo(this, 'domain', Domain);
    addPropertyTo(this, 'guestId');
    addPropertyTo(this, 'clientFingerprint');
    addPropertyTo(this, 'userId');
    addPropertyTo(this, 'user', User);
    addPropertyTo(this, 'messages', SupportMessage);

    this.create = function (success, error, embed, as_domain) {
        var data = serialise(this),
            self = this;
        function handleResponse(result) {
            success(fromJson(self, result[self.json]));
        }
        create({
            resource: this.resource,
            parameters: data[0],
            files: data[1] || {},
            as_domain: as_domain,
            success: handleResponse,
            error: error,
            embed: embed
        });
    };

    this.get = function (success, error, embed) {
        var self = this;
        function handleResponse(result) {
            success(fromJson(self, result[self.json], { makesDirty: false }));
        }
        getOne({
            resource: this.resource,
            id: this.id(),
            success: handleResponse,
            error: error,
            embed: embed
        });
    };
}

export function SupportConversations() {
    this.resource = '/support_conversations';
    this.json = 'supportConversations';
    this.single = SupportConversation;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result, { makesDirty: false }));
        }
        getList(this.resource, handleResponse, error, parameters || {});
    };
}
