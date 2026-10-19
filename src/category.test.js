import test from 'node:test';
import assert from 'node:assert/strict';
import { Category } from './category.js';
import { DomainTag } from './domain_tag.js';
import { User } from './user.js';
import { fromJson, serialise } from './model.js';

test('category reads and serialises tags and assigned team members', () => {
    const category = new Category();
    fromJson(category, {
        id: 1,
        tags: [{id: 4, name: 'rush'}],
        assigned: [{id: 9, name: 'Ada'}],
    }, {makesDirty: false});

    assert.equal(category.tags()[0].id(), 4);
    assert.equal(category.tags()[0].name(), 'rush');
    assert.equal(category.assigned()[0].id(), 9);
    assert.equal(category.assigned()[0].name(), 'Ada');
    assert.equal(category.tags()[0].categories(), undefined);

    const tag = new DomainTag();
    tag.id(4);
    const user = new User();
    user.id(9);
    const replacement = new Category();
    replacement.tags([tag]);
    replacement.assigned([user]);
    const [data] = serialise(replacement);
    assert.equal(data.get('tags-count'), 1);
    assert.equal(data.get('tags-0-id'), 4);
    assert.equal(data.get('assigned-count'), 1);
    assert.equal(data.get('assigned-0-id'), 9);

    const linked = new DomainTag();
    const linkedCategory = new Category();
    linkedCategory.id(3);
    linked.categories([linkedCategory]);
    assert.equal(linked.categories()[0].id(), 3);

    const assignee = new User();
    assignee.assignedCategories([linkedCategory]);
    assert.equal(assignee.assignedCategories()[0].id(), 3);
});
