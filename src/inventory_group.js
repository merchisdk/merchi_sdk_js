import { generateUUID } from './uuid.js';
import { addPropertyTo } from './model.js';
import { Company } from './company.js';
import { Inventory } from './inventories.js';
import { Product } from './products.js';
import { Job } from './jobs.js';
import { VariationField } from './variation_field.js';

export function InventoryGroup() {
    this.resource = '/inventory_groups';
    this.json = 'inventoryGroup';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'archived');
    addPropertyTo(this, 'id');
    addPropertyTo(this, 'company', Company);
    addPropertyTo(this, 'inventories', Inventory);
    addPropertyTo(this, 'name');
    addPropertyTo(this, 'products', Product);
    addPropertyTo(this, 'jobs', Job);
    addPropertyTo(this, 'variationFields', VariationField);
}
