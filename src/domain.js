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
    addPropertyTo(this, 'assignToAgent');
    addPropertyTo(this, 'merchiAgentUser', User);
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
     * @typedef {Object} StorefrontV2Config
     * @property {number} [id]
     * @property {number} [domainId]
     * @property {string} [status]
     * @property {string|null} [starterTemplate]
     * @property {string|null} [urlStructure]
     * @property {string|null} [defaultBranch]
     * @property {string|null} [activePreviewBranchName]
     * @property {string|null} [activePreviewStartedAt]
     * @property {number|null} [activePreviewLastRequestId]
     * @property {string|null} [repoProvider]
     * @property {string|null} [repoOwner]
     * @property {string|null} [repoName]
     * @property {string|null} [vercelProjectId]
     * @property {string|null} [lastSuccessfulCommitSha]
     * @property {Array<string>} [approvedStarterTemplates]
     * @property {string} [providerMode]
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
     * @property {Array<StorefrontExecutionEvent>|null} [executionEvents]
     */

    /**
     * @typedef {Object} StorefrontRequestContextImage
     * @property {string} name
     * @property {string|null} [mimeType]
     * @property {string} dataUrl
     */

    /**
     * @typedef {Object} StorefrontV2ChangeRequestPayload
     * @property {string} prompt
     * @property {Array<string>} [contextFilePaths]
     * @property {Array<StorefrontRequestContextImage>} [contextImages]
     * @property {string} [branchName]
     * @property {boolean} [startNewBranch]
     * @property {Object<string, string|Array<string>>} [clarificationAnswers]
     * @property {string} [generationBriefSummary]
     * @property {string} [generationBoilerplateFit]
     * @property {boolean} [clarificationSkipped]
     */

    /**
     * @typedef {Object} StorefrontV2GenerationBrief
     * @property {string} planSummary
     * @property {string} boilerplateFit
     * @property {Array<Object>} gapTopics
     * @property {Array<Object>} questions
     * @property {number} questionCount
     */

    /**
     * @typedef {Object} StorefrontV2GenerationBriefPayload
     * @property {StorefrontV2SiteContext} siteContext
     * @property {string} [urlStructure]
     * @property {string} [starterTemplate]
     */

    /**
     * @typedef {Object} StorefrontV2ResetResult
     * @property {string} status
     * @property {boolean} isProvisioned
     * @property {string} [providerMode]
     * @property {Array<string>} [approvedStarterTemplates]
     */

    /**
     * @typedef {Object} StorefrontV2RepositoryTree
     * @property {string} path
     * @property {string} ref
     * @property {Array<{name: string, path: string, type: string}>} entries
     */

    /**
     * @typedef {Object} StorefrontV2RepositoryBranches
     * @property {string} defaultBranch
     * @property {string|null} [activeBranchName]
     * @property {Array<string>} branches
     */

    /**
     * @typedef {Object} StorefrontV2RepositoryFile
     * @property {string} path
     * @property {string} ref
     * @property {string} [sha]
     * @property {string} content
     */

    /**
     * @typedef {Object} StorefrontV2RepositoryFileUpdatePayload
     * @property {string} path
     * @property {string} content
     * @property {string} [message]
     * @property {string} [branch]
     */

    /**
     * @typedef {Object} StorefrontV2ProductPublishPayload
     * @property {string} [productName]
     * @property {string} [productUrl]
     * @property {string} [branchName]
     */

    /**
     * @typedef {Object} StorefrontV2CategoryPublishPayload
     * @property {string} [categoryName]
     * @property {string} [categoryUrl]
     * @property {string} [branchName]
     */

    /**
     * @typedef {Object} StorefrontV2SiteContextInput
     * @property {string} [url]
     * @property {string} [sourceUrl]
     */

    /**
     * @typedef {Object} StorefrontExecutionEvent
     * @property {string} timestamp
     * @property {string} stage
     * @property {string} [level]
     * @property {string} message
     * @property {Object} [metadata]
     */

    /**
     * @typedef {Object} StorefrontV2ProvisionPayload
     * @property {string} [starterTemplate]
     * @property {string} [urlStructure]
     */

    /**
     * @typedef {Object} StorefrontV2StarterTemplateUrlStructurePayload
     * @property {string} starterTemplate
     */

    /**
     * @typedef {Object} StorefrontV2SiteContext
     * @property {string} sourceUrl
     * @property {Object} [style]
     * @property {Array<string>} [sitemap]
     * @property {Array<Object>} [navigation]
     * @property {Array<string>} [categories]
     * @property {Array<string>} [products]
     * @property {Array<Object>} [tracking]
     * @property {Array<string>} [wireframe]
     * @property {Array<Object>} [stylesheets]
     * @property {Array<Object>} [pageAnalysis]
     * @property {Object} [emulationSpec]
     * @property {string} [analysisMarkdown]
     * @property {string} [analysisFilePath]
     * @property {string} [analysisJsonFilePath]
     * @property {Array<string>} [analysisScreenshotPaths]
     * @property {Array<Object>} [analysisScreenshots]
     * @property {string} [analysisBranch]
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

    function sendStorefrontRequest(resource, method, payload, success, error, queryParams) {
        var request = new Request();
        request.resource(resource).method(method);
        request.query().add('skip_rights', 'y');
        if (queryParams) {
            Object.keys(queryParams).forEach(function(key) {
                var value = queryParams[key];
                if (value !== undefined && value !== null && value !== '') {
                    request.query().add(key, value);
                }
            });
        }
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

    /**
     * @param {StorefrontV2ProvisionPayload|Function} payload
     * @param {Function} [success]
     * @param {Function} [error]
     */
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

    /**
     * @param {StorefrontV2StarterTemplateUrlStructurePayload|Function} payload
     * @param {Function} [success]
     * @param {Function} [error]
     */
    this.resolveStarterTemplateUrlStructure = function (payload, success, error) {
        var args = parsePayloadAndCallbacks(payload, success, error);
        sendStorefrontRequest(
            '/domains/' + this.id() + '/storefront_v2/starter_template/url_structure/',
            'POST',
            args.payload,
            args.success,
            args.error
        );
    };

    /**
     * @param {StorefrontV2SiteContextInput|Function} payload
     * @param {Function} [success]
     * @param {Function} [error]
     */
    this.extractStorefrontV2SiteContext = function (payload, success, error) {
        var args = parsePayloadAndCallbacks(payload, success, error);
        sendStorefrontRequest(
            '/domains/' + this.id() + '/storefront_v2/site_context/extract/',
            'POST',
            args.payload,
            args.success,
            args.error
        );
    };

    /**
     * @param {StorefrontV2ChangeRequestPayload|Function} payload
     * @param {Function} [success]
     * @param {Function} [error]
     */
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

    /**
     * @param {StorefrontV2GenerationBriefPayload|Function} payload
     * @param {Function} [success]
     * @param {Function} [error]
     */
    this.createStorefrontV2GenerationBrief = function (payload, success, error) {
        var args = parsePayloadAndCallbacks(payload, success, error);
        sendStorefrontRequest(
            '/domains/' + this.id() + '/storefront_v2/generation_brief/',
            'POST',
            args.payload,
            args.success,
            args.error
        );
    };

    this.resetStorefrontV2 = function (success, error) {
        if (typeof success === 'function' && error === undefined) {
            sendStorefrontRequest(
                '/domains/' + this.id() + '/storefront_v2/reset/',
                'POST',
                null,
                success,
                error
            );
            return;
        }
        var args = parsePayloadAndCallbacks(success, error);
        sendStorefrontRequest(
            '/domains/' + this.id() + '/storefront_v2/reset/',
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

    this.getStorefrontChangeRequestEvents = function (requestId, success, error) {
        sendStorefrontRequest(
            '/storefront_change_requests/' + requestId + '/events/',
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

    /**
     * @param {{path?: string, ref?: string}|Function} payload
     * @param {Function} [success]
     * @param {Function} [error]
     */
    this.getStorefrontV2RepositoryTree = function (payload, success, error) {
        var args = parsePayloadAndCallbacks(payload, success, error);
        sendStorefrontRequest(
            '/domains/' + this.id() + '/storefront_v2/repository_tree/',
            'GET',
            null,
            args.success,
            args.error,
            args.payload
        );
    };

    this.getStorefrontV2RepositoryBranches = function (success, error) {
        sendStorefrontRequest(
            '/domains/' + this.id() + '/storefront_v2/repository_branches/',
            'GET',
            null,
            success,
            error
        );
    };

    /**
     * @param {string} path
     * @param {{ref?: string}|Function} refOrSuccess
     * @param {Function} [success]
     * @param {Function} [error]
     */
    this.getStorefrontV2RepositoryFile = function (path, refOrSuccess, success, error) {
        var queryParams = {path: path};
        if (typeof refOrSuccess === 'function') {
            sendStorefrontRequest(
                '/domains/' + this.id() + '/storefront_v2/repository_file/',
                'GET',
                null,
                refOrSuccess,
                success,
                queryParams
            );
            return;
        }
        if (refOrSuccess && refOrSuccess.ref) {
            queryParams.ref = refOrSuccess.ref;
        }
        sendStorefrontRequest(
            '/domains/' + this.id() + '/storefront_v2/repository_file/',
            'GET',
            null,
            success,
            error,
            queryParams
        );
    };

    /**
     * @param {StorefrontV2RepositoryFileUpdatePayload|Function} payload
     * @param {Function} [success]
     * @param {Function} [error]
     */
    this.updateStorefrontV2RepositoryFile = function (payload, success, error) {
        var args = parsePayloadAndCallbacks(payload, success, error);
        sendStorefrontRequest(
            '/domains/' + this.id() + '/storefront_v2/repository_file/',
            'POST',
            args.payload,
            args.success,
            args.error
        );
    };

    /**
     * @param {StorefrontV2ProductPublishPayload|Function} payload
     * @param {Function} [success]
     * @param {Function} [error]
     */
    this.publishStorefrontV2Product = function (payload, success, error) {
        var args = parsePayloadAndCallbacks(payload, success, error);
        sendStorefrontRequest(
            '/domains/' + this.id() + '/storefront_v2/products/publish/',
            'POST',
            args.payload,
            args.success,
            args.error
        );
    };

    /**
     * @param {StorefrontV2CategoryPublishPayload|Function} payload
     * @param {Function} [success]
     * @param {Function} [error]
     */
    this.publishStorefrontV2Category = function (payload, success, error) {
        var args = parsePayloadAndCallbacks(payload, success, error);
        sendStorefrontRequest(
            '/domains/' + this.id() + '/storefront_v2/categories/publish/',
            'POST',
            args.payload,
            args.success,
            args.error
        );
    };

    this.getAnalytics = function (success, error) {
        sendStorefrontRequest(
            '/domains/' + this.id() + '/analytics/',
            'GET',
            null,
            success,
            error
        );
    };

    this.getAgentTokenAnalytics = function (queryParams, success, error) {
        if (typeof queryParams === 'function') {
            error = success;
            success = queryParams;
            queryParams = null;
        }
        sendStorefrontRequest(
            '/domains/' + this.id() + '/agent_token_analytics/',
            'GET',
            null,
            success,
            error,
            queryParams
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
