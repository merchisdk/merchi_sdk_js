import test from 'node:test';
import assert from 'node:assert/strict';
import { Domain } from './domain.js';
import { serialise } from './model.js';

test('serialise encodes apiAllowedOrigins JSON for form data', () => {
    const domain = new Domain();
    domain.id(7);
    domain.apiAllowedOrigins(['https://shop.example.com']);

    const [data] = serialise(domain);
    const encoded = data.get('apiAllowedOrigins');

    assert.equal(encoded, JSON.stringify(['https://shop.example.com']));
    assert.notEqual(encoded, '[object Object]');
});

test('serialise encodes jobAgentPolicy JSON for form data', () => {
    const domain = new Domain();
    domain.id(7);
    domain.jobAgentPolicy({
        playbooks: { drafting: false, invoice: true },
        outreach: { sendEmail: true },
    });

    const [data] = serialise(domain);
    const encoded = data.get('jobAgentPolicy');

    assert.equal(
        encoded,
        JSON.stringify({
            playbooks: { drafting: false, invoice: true },
            outreach: { sendEmail: true },
        })
    );
    assert.notEqual(encoded, '[object Object]');
});
