import { generateUUID } from './uuid.js';
import {
    addPropertyTo,
    serialise,
    create,
    enumerateFiles,
    fromJson,
    getOne,
    getList,
    fromJsonList,
} from './model.js';
import { Shipment } from './shipment.js';
import { User } from './user.js';

export function ShipmentLog() {
    this.resource = '/shipment_logs';
    this.json = 'shipmentLog';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'shipment', Shipment);
    addPropertyTo(this, 'user', User);
    addPropertyTo(this, 'sourceType');
    addPropertyTo(this, 'message');
    addPropertyTo(this, 'detailJson');
    addPropertyTo(this, 'createdAt');

    this.create = function (options) {
        var data = serialise(this),
            self = this;
        function handleResponse(result) {
            options.success(fromJson(self, result[self.json]));
        }
        create({
            resource: this.resource,
            parameters: data[0],
            files: enumerateFiles(data[1]),
            success: handleResponse,
            as_domain: options.as_domain,
            error: options.error,
            embed: options.embed,
        });
    };

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

export function ShipmentLogs() {
    this.resource = '/shipment_logs';
    this.json = 'shipmentLogs';
    this.single = ShipmentLog;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result, { makesDirty: false }));
        }
        getList(this.resource, handleResponse, error, parameters || {});
    };
}
