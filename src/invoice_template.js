import { addPropertyTo, generateUUID } from './model.js';
import { InvoiceTemplateVersion } from './invoice_template_version.js';

export function InvoiceTemplate() {
    this.resource = '/invoice-templates';
    this.json = 'invoiceTemplate';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'slug');
    addPropertyTo(this, 'name');
    addPropertyTo(this, 'baseCss');
    addPropertyTo(this, 'activeVersion', InvoiceTemplateVersion);
    addPropertyTo(this, 'versions', InvoiceTemplateVersion);
}

export function InvoiceTemplates() {
    this.resource = '/invoice-templates';
    this.json = 'invoiceTemplates';
    this.single = InvoiceTemplate;
}
