import { generateUUID } from './uuid.js';
import {
    addPropertyTo,
    fromJson,
    fromJsonList,
    getOne,
} from './model.js';
import { AgentSkillApproval } from './agent_skill_approval.js';

export function AgentSkillVersion() {
    this.resource = '/agent_skill_versions';
    this.json = 'agentSkillVersion';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'skillId');
    addPropertyTo(this, 'versionNumber');
    addPropertyTo(this, 'contentMd');
    addPropertyTo(this, 'contentHash');
    addPropertyTo(this, 'status');
    addPropertyTo(this, 'requestedAt');
    addPropertyTo(this, 'publishedAt');
    addPropertyTo(this, 'disabledAt');
    addPropertyTo(this, 'approvals', AgentSkillApproval);

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

export function AgentSkillVersions() {
    this.resource = '/agent_skill_versions';
    this.json = 'agentSkillVersions';
    this.single = AgentSkillVersion;

    this.fromJson = function (result, options) {
        return fromJsonList(this, result, options);
    };
}
