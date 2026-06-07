import { generateUUID } from './uuid.js';
import { addPropertyTo, enumerateFiles, fromJson, create, serialise } from './model.js';
import { Job } from './job.js';
import { User } from './user.js';
import { MerchiFile } from './merchi_file.js';

export function JobNote() {
    this.resource = '/job_notes';
    this.json = 'jobNote';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'job', Job);
    addPropertyTo(this, 'createdBy', User);
    addPropertyTo(this, 'lastEditedBy', User);
    addPropertyTo(this, 'files', MerchiFile);
    addPropertyTo(this, 'noteType');
    addPropertyTo(this, 'richText');
    addPropertyTo(this, 'creationDate');
    addPropertyTo(this, 'lastEditedTime');

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
