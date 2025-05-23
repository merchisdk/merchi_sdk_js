import { Dictionary } from './dictionary.js';

export const productTypes = new Dictionary();
productTypes.add(0, 'supplier MOD (made on demand)');
productTypes.add(1, 'supplier');
productTypes.add(2, 'seller');
productTypes.add(3, 'seller MOD (made on demand)');
productTypes.add(4, 'cloned MOD (made on demand)');
productTypes.add(5, 'seller cloned MOD (made on demand)');
productTypes.add(6, 'production MOD (made on demand)');
productTypes.add(7, 'cloned supplier');
productTypes.add(8, 'seller inventory');
productTypes.add(9, 'supplir inventory');
productTypes.add(10, 'seller group buy');
productTypes.add(11, 'supplier resell MOD (made on demand)');
productTypes.add(12, 'supplier resell');
productTypes.add(14, 'supplier group buy inventory');
productTypes.add(14, 'seller inventory cloned');
productTypes.add(15, 'seller group buy inventory cloned');
productTypes.add(16, 'supply seller MOD(made on demand) cloned');
productTypes.add(17, 'supplier to supplier resell MOD(made on demand)');
productTypes.add(18, 'supplier resell cloned');
productTypes.add(19, 'supply domain reference');
productTypes.add(20, 'seller file download');
productTypes.add(21, 'supplier mod supply chain request');
productTypes.add(22, 'supplier supply chain request');
productTypes.add(23, 'lead form');

export const productTypesInts = new Dictionary();
productTypes.each(function (key, value) {
    productTypesInts.add(value, parseInt(key, 10));
});
