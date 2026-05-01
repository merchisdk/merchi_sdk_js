import { addPropertyTo, generateUUID } from './model.js';
import { Company } from './company.js';
import { InvoiceTemplate } from './invoice_template.js';
import { CompanyInvoiceSettingsVersion } from './company_invoice_settings_version.js';

export function CompanyInvoiceSettings() {
    this.resource = '/company-invoice-settings';
    this.json = 'companyInvoiceSettings';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'company', Company);
    addPropertyTo(this, 'selectedTemplate', InvoiceTemplate);
    addPropertyTo(this, 'themeOverrides');
    addPropertyTo(this, 'blockOverrides');
    addPropertyTo(this, 'customCss');
    addPropertyTo(this, 'draftThemeOverrides');
    addPropertyTo(this, 'draftBlockOverrides');
    addPropertyTo(this, 'draftCustomCss');
    addPropertyTo(this, 'publishedVersion', CompanyInvoiceSettingsVersion);
    addPropertyTo(this, 'versions', CompanyInvoiceSettingsVersion);
}

export function CompanyInvoiceSettingsList() {
    this.resource = '/company-invoice-settings';
    this.json = 'companyInvoiceSettingsList';
    this.single = CompanyInvoiceSettings;
}
