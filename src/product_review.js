import { generateUUID } from './uuid.js';
import { addPropertyTo, fromJson } from './model.js';
import { Domain } from './domain.js';
import { Job } from './job.js';
import { Product } from './product.js';

/**
 * Map flat API fields (jobId, productId, domainId) onto job / product / domain
 * before ``fromJson``.
 */
export function normalizeProductReviewApiJson(json) {
    if (json === null || json === undefined || typeof json !== 'object') {
        return json;
    }
    var row = Object.assign({}, json);
    if (row.jobId !== undefined && row.job === undefined) {
        if (row.jobId != null) {
            row.job = {id: row.jobId};
        }
        delete row.jobId;
    }
    if (row.productId !== undefined && row.product === undefined) {
        if (row.productId != null) {
            row.product = {id: row.productId};
        }
        delete row.productId;
    }
    if (row.domainId !== undefined && row.domain === undefined) {
        if (row.domainId != null) {
            row.domain = {id: row.domainId};
        }
        delete row.domainId;
    }
    return row;
}

/**
 * Turn create payload ``{ job: { id }, rating, ... }`` into API JSON with ``jobId``.
 * Pass-through if ``jobId`` is already set.
 */
export function wireProductReviewCreateBody(data) {
    if (!data || typeof data !== 'object') {
        return data;
    }
    var body = Object.assign({}, data);
    if (body.job && body.job.id != null && body.jobId === undefined) {
        body.jobId = body.job.id;
        delete body.job;
    }
    return body;
}

export function ProductReview() {
    this.resource = '/product-reviews';
    this.json = 'productReview';
    this.temporaryId = generateUUID();

    addPropertyTo(this, 'id');
    addPropertyTo(this, 'product', Product);
    addPropertyTo(this, 'domain', Domain);
    addPropertyTo(this, 'authorUserId');
    addPropertyTo(this, 'authorName');
    addPropertyTo(this, 'job', Job);
    addPropertyTo(this, 'rating');
    addPropertyTo(this, 'title');
    addPropertyTo(this, 'content');
    addPropertyTo(this, 'status');
    addPropertyTo(this, 'purchaseInvoiceId');
    addPropertyTo(this, 'submittedAt');
    addPropertyTo(this, 'updatedAt');
    addPropertyTo(this, 'rejectionReason');
}

export function ProductReviews() {
    this.json = 'productReviews';
    this.single = ProductReview;

    /**
     * @param {object} data - API body with ``productReviews`` array
     * @param {object} [options] - passed to ``fromJson`` (e.g. ``{makesDirty: false}``)
     * @returns {ProductReview[]}
     */
    this.fromProductListResponse = function (data, options) {
        var raw = (data && data.productReviews) ? data.productReviews : [];
        var self = this;
        var defaults = {makesDirty: false};
        var opts = Object.assign({}, defaults, options);
        return raw.map(function (row) {
            return fromJson(
                new self.single(),
                normalizeProductReviewApiJson(row),
                opts
            );
        });
    };
}
