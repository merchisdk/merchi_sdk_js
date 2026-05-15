import { generateUUID } from './uuid.js';
import { Dictionary } from './dictionary.js';
import { addPropertyTo, serialise, fromJson, getList, fromJsonList, patchOne,
    getOne, create, enumerateFiles, Request } from './model.js';
import { SELLER, SELLER_PLUS, SUPPLIER, RESTRICTED_SUPPLIER } from './roles.js';
import { domainTypesInts } from './domain_types.js';
import { Company } from './company.js';
import { DomainTag } from './domain_tag.js';
import { DomainInvitation } from './domain_invitation.js';
import { Theme } from './theme.js';
import { MerchiFile } from './merchi_file.js';
import { Menu } from './menu.js';
import { SupplyDomain } from './supply_domain.js';
import { SeoDomainPage } from './seo_domain_page.js';
import { DomainChatSettings } from './domain_chat_settings.js';
import { User, Users } from './user.js';
import { InternalTag } from './internal_tag.js';
import { Reminder } from './reminder.js';
import { ShipmentMethod } from './shipment_method.js';

export function Domain() {
    this.resource = '/domains';
    this.json = 'domain';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'aiContext');
    addPropertyTo(this, 'apiSecret');
    addPropertyTo(this, 'webflowApiKey');
    addPropertyTo(this, 'shopifyShopUrl');
    addPropertyTo(this, 'shopifyIsActive');
    addPropertyTo(this, 'country');
    addPropertyTo(this, 'currency');
    addPropertyTo(this, 'domain');
    addPropertyTo(this, 'domainType');
    addPropertyTo(this, 'activeThemeId');
    addPropertyTo(this, 'activeTheme', Theme);
    addPropertyTo(this, 'subDomain');
    addPropertyTo(this, 'theme');
    addPropertyTo(this, 'logoUrl');
    addPropertyTo(this, 'smsName');
    addPropertyTo(this, 'emailDomain');
    addPropertyTo(this, 'telegramChatId');
    addPropertyTo(this, 'trackingCodeGoogleConversion');
    addPropertyTo(this, 'trackingCodeGoogleGlobal');
    addPropertyTo(this, 'qrShopQrCode');
    addPropertyTo(this, 'logo', MerchiFile);
    addPropertyTo(this, 'favicon', MerchiFile);
    addPropertyTo(this, 'company', Company);
    addPropertyTo(this, 'ownedBy', Company);
    addPropertyTo(this, 'shipmentMethods', ShipmentMethod);
    addPropertyTo(this, 'accessibleClients', User);
    addPropertyTo(this, 'accessibleClientCompanies', Company);
    addPropertyTo(this, 'unltdAiApiOrganizationId');
    addPropertyTo(this, 'unltdAiApiSecretKey');
    addPropertyTo(this, 'menus', Menu);

    addPropertyTo(this, 'socialBitchute');
    addPropertyTo(this, 'socialDiscord');
    addPropertyTo(this, 'socialFacebook');
    addPropertyTo(this, 'socialGoogle');
    addPropertyTo(this, 'socialInstagram');
    addPropertyTo(this, 'socialLinkedin');
    addPropertyTo(this, 'socialRumble');
    addPropertyTo(this, 'socialTelegram');
    addPropertyTo(this, 'socialTiktok');
    addPropertyTo(this, 'socialX');
    addPropertyTo(this, 'socialYoutube');

    addPropertyTo(this, 'internalUseNotes');
    addPropertyTo(this, 'internalUseAiContext');

    addPropertyTo(this, 'showDomainPublicly');
    addPropertyTo(this, 'publicAccessRestricted');
    addPropertyTo(this, 'showDomainToAccessibleEntitiesOnly')
    addPropertyTo(this, 'enableNotifications');
    addPropertyTo(this, 'enableEmailNotifications');
    addPropertyTo(this, 'enableSmsNotifications');
    addPropertyTo(this, 'seoDomainPages', SeoDomainPage);
    addPropertyTo(this, 'domainChatSettings', DomainChatSettings);
    addPropertyTo(this, 'themes', Theme);
    addPropertyTo(this, 'supplyProducts', SupplyDomain);
    addPropertyTo(this, 'domainInvitations', DomainInvitation);
    addPropertyTo(this, 'jobsAssignees', User);
    addPropertyTo(this, 'tags', DomainTag);
    addPropertyTo(this, 'internalTags', InternalTag);
    addPropertyTo(this, 'reminders', Reminder);

    addPropertyTo(this, 'deploymentOnline');
    addPropertyTo(this, 'deploymentInProgress');
    addPropertyTo(this, 'deploymentSucceeded');
    addPropertyTo(this, 'deploymentMessage');
    addPropertyTo(this, 'deploymentKey');

    addPropertyTo(this, 'scalablePressApiKey');
    addPropertyTo(this, 'googleMerchantApiKey');
    addPropertyTo(this, 'googleMerchantId');

    this.create = function (success, error, embed, as_domain) {
        var data = serialise(this),
            self = this;
        function handleResponse(result) {
            success(fromJson(self, result[self.json]));
        }
        create({resource: this.resource,
                parameters: data[0],
                files: enumerateFiles(data[1]),
                as_domain: as_domain,
                success: handleResponse,
                error: error,
                embed: embed});
    };

    this.get = function (success, error, embed, withRights) {
        var self = this;
        function handleResponse(result) {
            success(fromJson(self, result[self.json],
                             {makesDirty: false}));
        }
        getOne({resource: this.resource,
                id: this.id(),
                success: handleResponse,
                error: error,
                embed: embed,
                withRights: withRights});
    };

    this.invite = function (invitationData, success, error, embed) {
        var request = new Request(),
            data = new Dictionary(),
            self = this,
            _id = self.id();

        function handleResponse(status, data) {
            var newInvitation = new DomainInvitation(),
                invitation = data,
                invitations = self.domainInvitations() ?
                  self.domainInvitations() : [];
            newInvitation.id(invitation.id);
            newInvitation.userEmail(invitation.userEmail);
            newInvitation.userName(invitation.userName);
            newInvitation.role(invitation.role);
            invitations.push(newInvitation);
            self.domainInvitations(invitations);
            success(self);
        }

        data.add("inviteUserEmail", invitationData.emailAddress);
        data.add("inviteUserName", invitationData.userName);
        data.add("domainId", _id);
        data.add("domainRole", invitationData.role);
        request.resource('/domain_invite/').method('POST');
        request.data().merge(data);
        request.responseHandler(handleResponse);
        request.errorHandler(error);
        request.send();
    }
    this.getUsers = function (success, error, offset, limit,
                              q, embed, tab) {
        var self = this,
            users = new Users();

        function handleResponse(result) {
            success(fromJsonList(users, result));
        }
        getList(users.resource, handleResponse, error,
                {inDomain: self.id(), tab: tab, offset: offset,
                 limit: limit, q: q, embed: embed});
    };

    this.getManagers = function (success, error, offset, limit, embed) {
        var self = this;
        self.getUsers(success, error, offset, limit,
                      null, embed, "manager");
    };

    this.getUsersWithRoles = function (success, error, roles, offset,
                                       limit, embed) {
        var self = this,
            users = new Users();

        function handleResponse(result) {
            success(fromJsonList(users, result));
        }

        getList(users.resource, handleResponse, error,
                {inDomain: self.id(), inDomainRoles: roles,
                 offset: offset, limit: limit, embed: embed});
    };

   this.patch = function (success, error, embed, as_domain) {
        var data = data = serialise(this)[0],
            self = this;
        function handleResponse(result) {
            success(fromJson(self, result[self.json]));
        }
        patchOne({resource: this.resource,
                  id: this.id(),
                  success: handleResponse,
                  as_domain: as_domain,
                  error: error,
                  data: data,
                  embed: embed});
    };

    this.update = function (success, error, embed) {
        this.patch(success, error,
                   serialise(this, undefined, undefined,
                             undefined, {excludeOld: true})[0], embed);
    };

    this.mainMenu = function () {
       var menus = this.menus(),
           i = 0;
       if (menus === undefined) {
           return null;
       }
       for (i = 0; i < menus.length; ++i) {
           if (menus[i].menuType() === 0) {
               return menus[i];
           }
       }
       return null;
    };

    this.domainLogoUrl = function () {
        var logo = this.logo();
        return logo && logo.viewUrl() ? logo.viewUrl() : null;
    }

    this.faviconLogoUrl = function () {
        var favicon = this.favicon();
        return favicon && favicon.viewUrl() ? favicon.viewUrl() : null;
    }

    this.isDomainType = function (typeName) {
        return this.domainType() === domainTypesInts.get(typeName);
    }

    this.isSellerDomain = function () {
        return this.isDomainType(SELLER);
    }

    this.isSellerOrSellerPlusDomain = function () {
        return this.isSellerDomain() || this.isDomainType(SELLER_PLUS);
    }

    this.isSupplierOrRestrictedSupplierDomain = function () {
        return this.isDomainType(SUPPLIER) ||
            this.isDomainType(RESTRICTED_SUPPLIER);
    }

    this.isUnrestricted = function () {
        return this.domainType() === domainTypesInts.get('Unrestricted');
    }

    function parsePayloadAndCallbacks(payload, success, error) {
        if (typeof payload === 'function') {
            return {payload: {}, success: payload, error: success};
        }
        return {payload: payload || {}, success: success, error: error};
    }

    /**
     * @typedef {Object} StorefrontChecksSummary
     * @property {'passing'|'failing'|'pending'|'unknown'} [overall]
     * @property {string} [statusState]
     * @property {{total?: number, passed?: number, failed?: number, pending?: number, neutral?: number}} [counts]
     * @property {string} [updatedAt]
     */

    /**
     * @typedef {Object} StorefrontV2ChangeRequest
     * @property {number} id
     * @property {number} domainId
     * @property {number} storefrontV2Id
     * @property {string} status
     * @property {string} prompt
     * @property {string|null} [branchName]
     * @property {string|null} [commitSha]
     * @property {number|null} [pullRequestNumber]
     * @property {string|null} [previewUrl]
     * @property {string|null} [summary]
     * @property {StorefrontChecksSummary|null} [checksSummary]
     * @property {string|null} [checksUpdatedAt]
     * @property {string|null} [errorDetails]
     */

    function appendPayload(request, payload) {
        Object.keys(payload).forEach(function(key) {
            var value = payload[key];
            if (value === undefined) {
                return;
            }
            if (value !== null && typeof value === 'object') {
                request.data().add(key, JSON.stringify(value));
            } else {
                request.data().add(key, value);
            }
        });
    }

    function sendStorefrontRequest(resource, method, payload, success, error) {
        var request = new Request();
        request.resource(resource).method(method);
        request.query().add('skip_rights', 'y');
        if (payload) {
            appendPayload(request, payload);
        }
        function handleResponse(status, data) {
            if (status >= 200 && status < 300) {
                if (success) {
                    success(data);
                }
            } else if (error) {
                error(status, data);
            }
        }
        function handleError(status, data) {
            if (error) {
                error(status, data);
            }
        }
        request.responseHandler(handleResponse).errorHandler(handleError);
        request.send();
    }

    this.getStorefrontV2 = function (success, error) {
        sendStorefrontRequest(
            '/domains/' + this.id() + '/storefront_v2/',
            'GET',
            null,
            success,
            error
        );
    };

    this.provisionStorefrontV2 = function (payload, success, error) {
        var args = parsePayloadAndCallbacks(payload, success, error);
        sendStorefrontRequest(
            '/domains/' + this.id() + '/storefront_v2/provision/',
            'POST',
            args.payload,
            args.success,
            args.error
        );
    };

    this.createStorefrontChangeRequest = function (payload, success, error) {
        var args = parsePayloadAndCallbacks(payload, success, error);
        sendStorefrontRequest(
            '/domains/' + this.id() + '/storefront_v2/requests/',
            'POST',
            args.payload,
            args.success,
            args.error
        );
    };

    this.getStorefrontChangeRequest = function (requestId, success, error) {
        sendStorefrontRequest(
            '/storefront_change_requests/' + requestId + '/',
            'GET',
            null,
            success,
            error
        );
    };

    this.runStorefrontChangeRequest = function (requestId, payload, success, error) {
        var args = parsePayloadAndCallbacks(payload, success, error);
        sendStorefrontRequest(
            '/storefront_change_requests/' + requestId + '/run/',
            'POST',
            args.payload,
            args.success,
            args.error
        );
    };

    this.approveStorefrontChangeRequest = function (requestId, payload, success, error) {
        var args = parsePayloadAndCallbacks(payload, success, error);
        sendStorefrontRequest(
            '/storefront_change_requests/' + requestId + '/approve/',
            'POST',
            args.payload,
            args.success,
            args.error
        );
    };

    this.rejectStorefrontChangeRequest = function (requestId, payload, success, error) {
        var args = parsePayloadAndCallbacks(payload, success, error);
        sendStorefrontRequest(
            '/storefront_change_requests/' + requestId + '/reject/',
            'POST',
            args.payload,
            args.success,
            args.error
        );
    };

    this.getStorefrontV2Deployments = function (success, error) {
        sendStorefrontRequest(
            '/domains/' + this.id() + '/storefront_v2/deployments/',
            'GET',
            null,
            success,
            error
        );
    };

    this.getStorefrontV2DeploymentLogs = function (deploymentId, success, error) {
        sendStorefrontRequest(
            '/domains/' + this.id() + '/storefront_v2/deployments/' +
                deploymentId + '/logs/',
            'GET',
            null,
            success,
            error
        );
    };

    this.rollbackStorefrontV2 = function (payload, success, error) {
        var args = parsePayloadAndCallbacks(payload, success, error);
        sendStorefrontRequest(
            '/domains/' + this.id() + '/storefront_v2/rollback/',
            'POST',
            args.payload,
            args.success,
            args.error
        );
    };
}

export function Domains() {
    this.resource = '/domains';
    this.json = 'domains';
    this.single = Domain;

    this.get = function (success, error, parameters) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result,
                                 {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error, parameters);
    };
}
