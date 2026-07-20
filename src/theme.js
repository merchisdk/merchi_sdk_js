import { generateUUID } from './uuid.js';
import { addPropertyTo, serialise, create, fromJson, enumerateFiles, getOne,
    patchOne, fromJsonList, getList } from './model.js';
import { themeStatus } from './theme_status.js';
import { Domain } from './domain.js';
import { User } from './user.js';

export function Theme() {
    this.resource = '/themes';
    this.json = 'theme';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'lastUpdated');

    addPropertyTo(this, 'mainCssErrorMessage');
    addPropertyTo(this, 'mainCssStatus');
    addPropertyTo(this, 'mainCss');
    addPropertyTo(this, 'mainCssTemplateEditing');
    addPropertyTo(this, 'mainCssTemplateUsing');

    addPropertyTo(this, 'emailCssErrorMessage');
    addPropertyTo(this, 'emailCssStatus');
    addPropertyTo(this, 'emailCss');
    addPropertyTo(this, 'emailCssTemplateEditing');
    addPropertyTo(this, 'emailCssTemplateUsing');

    addPropertyTo(this, 'author', User);
    addPropertyTo(this, 'domain', Domain);

    this.create = function (success, error, embed, as_domain) {
        var self = this,
            data = serialise(this);
        function handleResponse(result) {
            success(fromJson(self, result[self.json]));
        }
        create({resource: this.resource,
                parameters: data[0],
                as_domain: as_domain,
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

    this.canBeActivated = function () {
        var validStatus = themeStatus.get("VALID_BUT_NOT_UPDATED");
        return this.mainCssStatus() >= validStatus &&
            this.emailCssStatus() >= validStatus;
    };

    this.isActiveOnDomain = function (domainId) {
        var domain = this.domain();
        return domain && domain.id() === parseInt(domainId, 10) &&
            domain.activeThemeId() === this.id();
    };
}

export function Themes() {
    this.resource = '/themes';
    this.json = 'themes';
    this.single = Theme;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result,
                                 {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error, parameters);
    };

}
