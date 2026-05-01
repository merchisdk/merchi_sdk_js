import { addPropertyTo, generateUUID } from './model.js';
import { CompanyInvoiceSettings } from './company_invoice_settings.js';
import { InvoiceTemplate } from './invoice_template.js';

export function CompanyInvoiceSettingsVersion() {
    this.resource = '/company-invoice-settings-versions';
    this.json = 'companyInvoiceSettingsVersion';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'settings', CompanyInvoiceSettings);
    addPropertyTo(this, 'template', InvoiceTemplate);
    addPropertyTo(this, 'themeOverrides');
    addPropertyTo(this, 'blockOverrides');
    addPropertyTo(this, 'customCss');
    addPropertyTo(this, 'creationDate');
}

export function CompanyInvoiceSettingsVersions() {
    this.resource = '/company-invoice-settings-versions';
    this.json = 'companyInvoiceSettingsVersions';
    this.single = CompanyInvoiceSettingsVersion;
}
