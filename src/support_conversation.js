import { generateUUID } from './uuid.js';
import { addPropertyTo, serialise, fromJson, create, getOne, getList, fromJsonList,
    patchOne } from './model.js';
import { Domain } from './domain.js';
import { DomainTag } from './domain_tag.js';
import { User } from './user.js';
import { SupportMessage } from './support_message.js';

export function SupportConversation() {
    this.resource = '/support_conversations';
    this.json = 'supportConversation';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'creationDate');
    addPropertyTo(this, 'lastMessageAt');
    addPropertyTo(this, 'archivedAt');
    addPropertyTo(this, 'domainId');
    addPropertyTo(this, 'domain', Domain);
    addPropertyTo(this, 'guestId');
    addPropertyTo(this, 'guestContactEmail');
    addPropertyTo(this, 'guestContactName');
    addPropertyTo(this, 'clientFingerprint');
    addPropertyTo(this, 'name');
    addPropertyTo(this, 'notes');
    addPropertyTo(this, 'userId');
    addPropertyTo(this, 'user', User);
    addPropertyTo(this, 'tags', DomainTag);
    addPropertyTo(this, 'messages', SupportMessage);
    addPropertyTo(this, 'messagesCount');

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

    this.patch = function (success, error, embed, asDomain) {
        var self = this,
            data = serialise(self, undefined, undefined, undefined,
                {excludeOld: true})[0];
        function handleResponse(result) {
            success(fromJson(self, result[self.json], { makesDirty: false }));
        }
        patchOne({
            resource: this.resource,
            id: this.id(),
            as_domain: asDomain,
            success: handleResponse,
            error: error,
            data: data,
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
