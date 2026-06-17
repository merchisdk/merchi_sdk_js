import { generateUUID } from './uuid.js';
import {
    addPropertyTo,
    fromJson,
    getOne,
    getList,
    fromJsonList,
    deleteOne,
} from './model.js';
import { Job } from './job.js';
import { User } from './user.js';

export function JobOperationLog() {
    this.resource = '/job_operation_logs';
    this.json = 'jobOperationLog';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'job', Job);
    addPropertyTo(this, 'user', User);
    addPropertyTo(this, 'sourceType');
    addPropertyTo(this, 'aiInvolved');
    addPropertyTo(this, 'action');
    addPropertyTo(this, 'payloadJson');
    addPropertyTo(this, 'changesJson');
    addPropertyTo(this, 'operationJson');
    addPropertyTo(this, 'createdAt');

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

    this.delete = function (options) {
        options = options || {};
        var success = options.success || function () {},
            error = options.error || function () {};
        deleteOne(this.resource + '/' + this.id(), success, error);
    };
}

export function JobOperationLogs() {
    this.resource = '/job_operation_logs';
    this.json = 'jobOperationLogs';
    this.single = JobOperationLog;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result, { makesDirty: false }));
        }
        getList(this.resource, handleResponse, error, parameters || {});
    };
}
