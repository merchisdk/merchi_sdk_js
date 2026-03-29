import { generateUUID } from './uuid.js';
import { addPropertyTo, serialise, fromJson, getOne, patchOne, fromJsonList, getList } from './model.js';
import { Domain } from './domain.js';
import { MerchiFile } from './merchi_file.js';
import { User } from './user.js';

export function DomainChatSettings() {
    this.resource = '/domain_chat_settings';
    this.json = 'domainChatSettings';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'domain', Domain);
    addPropertyTo(this, 'enabled');
    addPropertyTo(this, 'displayName');
    addPropertyTo(this, 'avatar', MerchiFile);
    addPropertyTo(this, 'welcomeMessage');
    addPropertyTo(this, 'privacyPolicyUrl');
    addPropertyTo(this, 'workingHours');
    addPropertyTo(this, 'awayMessage');
    addPropertyTo(this, 'notifyEmailNewConversation');
    addPropertyTo(this, 'notifyEmailNewMessage');
    addPropertyTo(this, 'assignedUsers', User);
    addPropertyTo(this, 'requireGuestContact');
    addPropertyTo(this, 'embedTestMode');
    addPropertyTo(this, 'autoOpenDelay');
    addPropertyTo(this, 'autoOpenMessage');
    addPropertyTo(this, 'autoOpenMode');

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

    this.patch = function (success, error, embed) {
        var data = serialise(this),
            self = this;
        function handleResponse(result) {
            success(fromJson(self, result[self.json], { makesDirty: false }));
        }
        patchOne({
            resource: this.resource,
            id: this.id(),
            data: data[0],
            files: data[1],
            success: handleResponse,
            error: error,
            embed: embed
        });
    };
}

export function DomainChatSettingsList() {
    this.resource = '/domain_chat_settings';
    this.json = 'domainChatSettingsList';
    this.single = DomainChatSettings;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result, { makesDirty: false }));
        }
        getList(this.resource, handleResponse, error, parameters || {});
    };
}
