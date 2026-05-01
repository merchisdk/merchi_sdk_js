import { generateUUID } from './uuid.js';
import {
    addPropertyTo,
    serialise,
    fromJson,
    create,
    enumerateFiles,
    getOne,
    getList,
    fromJsonList,
} from './model.js';
import { AgentSkillVersion } from './agent_skill_version.js';

export function AgentSkill() {
    this.resource = '/agent_skills';
    this.json = 'agentSkill';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'slug');
    addPropertyTo(this, 'title');
    addPropertyTo(this, 'description');
    addPropertyTo(this, 'priority');
    addPropertyTo(this, 'createdAt');
    addPropertyTo(this, 'disabledAt');
    addPropertyTo(this, 'currentDraftVersionId');
    addPropertyTo(this, 'currentPublishedVersionId');
    addPropertyTo(this, 'versions', AgentSkillVersion);

    this.create = function (success, error, embed, as_domain) {
        var data = serialise(this),
            self = this;
        function handleResponse(result) {
            success(fromJson(self, result[self.json]));
        }
        create({
            resource: this.resource,
            parameters: data[0],
            files: enumerateFiles(data[1]),
            as_domain: as_domain,
            success: handleResponse,
            error: error,
            embed: embed,
        });
    };

    this.get = function (success, error, embed) {
        var self = this;
        function handleResponse(result) {
            success(fromJson(self, result[self.json], {makesDirty: false}));
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

export function AgentSkills() {
    this.resource = '/agent_skills';
    this.json = 'agentSkills';
    this.single = AgentSkill;

    this.get = function (success, error, parameters, withUpdates) {
        var self = this;
        function handleResponse(result) {
            success(fromJsonList(self, result, {makesDirty: false}));
        }
        getList(this.resource, handleResponse, error, parameters || {}, withUpdates);
    };
}
