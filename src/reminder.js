import { generateUUID } from './uuid.js';
import { addPropertyTo, create, serialise, enumerateFiles, getOne, getList,
    fromJson, deleteOne, fromJsonList, patchOne } from './model.js';
import { isUndefinedOrNull } from './helpers.js';
import { User } from './user.js';
import { DomainTag } from './domain_tag.js';
import { Job } from './job.js';
import { Product } from './product.js';
import { Invoice } from './invoice.js';
import { Domain } from './domain.js';
import { Company } from './company.js';
import { Shipment } from './shipment.js';
import { Assignment } from './assignment.js';
import { Notification } from './notification.js';

export function Reminder() {
    this.resource = '/reminders';
    this.json = 'reminder';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'user', User);
    addPropertyTo(this, 'userProfile', User);
    addPropertyTo(this, 'created');
    addPropertyTo(this, 'updated');
    addPropertyTo(this, 'remindDate');
    addPropertyTo(this, 'message');
    addPropertyTo(this, 'sendEmail');
    addPropertyTo(this, 'sendSms');
    addPropertyTo(this, 'domainTags', DomainTag);
    addPropertyTo(this, 'remindUsers', User);
    addPropertyTo(this, 'job', Job);
    addPropertyTo(this, 'product', Product);
    addPropertyTo(this, 'invoice', Invoice);
    addPropertyTo(this, 'domain', Domain);
    addPropertyTo(this, 'company', Company);
    addPropertyTo(this, 'shipment', Shipment);
    addPropertyTo(this, 'assignment', Assignment);
    addPropertyTo(this, 'notifications', Notification);

    this.create = function (success, error, embed, asDomain) {
        var data = serialise(this),
            self = this,
            domain = self.domain() ? self.domain().id() : null,
            domainId = isUndefinedOrNull(asDomain) ? domain : asDomain;
        function handleResponse(result) {
            success(fromJson(self, result[self.json]));
        }
        create({resource: this.resource,
                parameters: data[0],
                as_domain: domainId,
                files: enumerateFiles(data[1]),
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

    this.patch = function (success, error, embed, asDomain) {
        var self = this,
            data = serialise(this, undefined, undefined, undefined,
                             {excludeOld: true})[0],
            domain = self.domain() ? self.domain().id() : null,
            domainId = isUndefinedOrNull(asDomain) ? domain : asDomain;
        function handleResponse(result) {
            success(fromJson(self, result[self.json],
                             {makesDirty: false}));
        }
        patchOne({resource: this.resource,
                  id: this.id(),
                  success: handleResponse,
                  error: error,
                  as_domain: domainId,
                  data: data,
                  embed: embed});
    };

    this.destroy = function (success, error) {
        deleteOne(this.resource + '/' + this.id(), success, error);
    };
}

export function Reminders() {
    this.resource = '/reminders';
    this.json = 'reminders';
    this.single = Reminder;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result, {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error, parameters);
    };
}
