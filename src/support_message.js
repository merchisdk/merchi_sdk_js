import { generateUUID } from './uuid.js';
import { addPropertyTo, serialise, fromJson, create, getList, fromJsonList } from './model.js';
import { User } from './user.js';

export function SupportMessage() {
    this.resource = '/support_messages';
    this.json = 'supportMessage';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'conversation');  // SupportConversation - avoid circular import
    addPropertyTo(this, 'senderType');
    addPropertyTo(this, 'user', User);
    addPropertyTo(this, 'content');
    addPropertyTo(this, 'creationDate');
    addPropertyTo(this, 'isAiReply');

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
}

export function SupportMessages() {
    this.resource = '/support_messages';
    this.json = 'supportMessages';
    this.single = SupportMessage;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result, { makesDirty: false }));
        }
        getList(this.resource, handleResponse, error, parameters || {});
    };
}
