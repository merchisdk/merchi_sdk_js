import { addPropertyTo, generateUUID } from './model.js';
import { InvoiceTemplate } from './invoice_template.js';

export function InvoiceTemplateVersion() {
    this.resource = '/invoice-template-versions';
    this.json = 'invoiceTemplateVersion';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'template', InvoiceTemplate);
    addPropertyTo(this, 'blocksJson');
    addPropertyTo(this, 'creationDate');
}

export function InvoiceTemplateVersions() {
    this.resource = '/invoice-template-versions';
    this.json = 'invoiceTemplateVersions';
    this.single = InvoiceTemplateVersion;
}
