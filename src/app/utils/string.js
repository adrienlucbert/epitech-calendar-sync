/**
 * Add padding before a string
 * 
 * @param {String} string string to add padding to
 * @param {Number} padding max length of string
 * @param {String} padder padder character (or string)
 */
export const pad = (string, padding, padder = '0') => {
    return (padder.repeat(padding) + string)
        .slice(-Math.max(padding, String(string).length))
}