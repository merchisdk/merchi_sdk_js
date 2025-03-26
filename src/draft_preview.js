import { addPropertyTo, serialise, create, enumerateFiles,
    fromJson } from './model.js';
import { MerchiFile } from './merchi_file.js';
import { Product } from './product.js';
import { DraftTemplate } from './draft_template.js';

export function DraftPreview() {
    this.resource = '/draft_previews';
    this.json = 'draftPreview';

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'file', MerchiFile);
    addPropertyTo(this, 'product', Product);
    addPropertyTo(this, 'description');
    addPropertyTo(this, 'name');
    addPropertyTo(this, 'date');
    addPropertyTo(this, 'height');
    addPropertyTo(this, 'width');
    addPropertyTo(this, 'draftTemplates', DraftTemplate);

    this.create = function (options) {
        var data = serialise(this),
            self = this;
        function handleResponse(result) {
            options.success(fromJson(self, result[self.json]));
        }
        create({resource: this.resource,
                parameters: data[0],
                files: enumerateFiles(data[1]),
                success: handleResponse,
                as_domain: options.as_domain,
                error: options.error,
                embed: options.embed});
    };
}
