import { generateUUID } from './uuid.js';
import { addPropertyTo, fromJsonList } from './model.js';
import { User } from './user.js';

export function AgentSkillApproval() {
    this.resource = '/agent_skill_approvals';
    this.json = 'agentSkillApproval';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'skillVersionId');
    addPropertyTo(this, 'superUser', User);
    addPropertyTo(this, 'decision');
    addPropertyTo(this, 'comment');
    addPropertyTo(this, 'createdAt');
}

export function AgentSkillApprovals() {
    this.resource = '/agent_skill_approvals';
    this.json = 'agentSkillApprovals';
    this.single = AgentSkillApproval;

    this.fromJson = function (result, options) {
        return fromJsonList(this, result, options);
    };
}
