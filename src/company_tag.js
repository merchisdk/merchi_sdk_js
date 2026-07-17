import { generateUUID } from './uuid.js';
import { addPropertyTo, serialise, create, fromJson, patchOne, deleteOne,
    fromJsonList, getList, enumerateFiles, getOne } from './model.js';
import { Company } from './company.js';
import { Product } from './product.js';

export function CompanyTag() {
    this.resource = '/company_tags';
    this.json = 'companyTag';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'name');
    addPropertyTo(this, 'description');
    addPropertyTo(this, 'colour');
    addPropertyTo(this, 'showPublic');
    addPropertyTo(this, 'company', Company);
    addPropertyTo(this, 'products', Product);

    this.create = function (success, error, embed, domainId) {
        var data = serialise(this),
            self = this;
        function handleResponse(result) {
            success(fromJson(self, result[self.json]));
        }
        create({resource: this.resource,
                parameters: data[0],
                files: enumerateFiles(data[1]),
                success: handleResponse,
                error: error,
                embed: embed,
                as_domain: domainId});
    };

    this.get = function (success, error) {
        var self = this;
        function handleResponse(result) {
            success(fromJson(self, result[self.json],
                             {makesDirty: false}));
        }
        getOne({resource: this.resource,
                id: this.id(),
                success: handleResponse,
                error: error});
    };

    this.patch = function (success, error, embed) {
        var self = this,
            data = serialise(this)[0];
        function handleResponse(result) {
            success(fromJson(self, result[self.json],
                             {makesDirty: false}));
        }
        patchOne({resource: this.resource,
                  id: this.id(),
                  success: handleResponse,
                  error: error,
                  data: data,
                  embed: embed});
    };

    this.destroy = function (success, error) {
        deleteOne(this.resource + "/" + this.id(), success, error);
    };
}

export function CompanyTags() {
    this.resource = '/company_tags';
    this.json = 'companyTags';
    this.single = CompanyTag;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result, {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error, parameters);
    };
}
