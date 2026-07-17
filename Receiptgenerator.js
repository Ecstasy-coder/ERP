const store = require('../data/store');

/**
 * Auto-generates the next receipt number (e.g. last used was 2618 -> returns 2619)
 * and persists it as the new "last receipt number".
 */
function generateReceiptNumber() {
    const last = store.getLastReceiptNumber();
    const next = last + 1;
    store.setLastReceiptNumber(next);
    return next;
}

module.exports = { generateReceiptNumber };