/**
 * Returns current timestamp in seconds (shifted by shift parameter)
 * 
 * @param {Number} shift optional shift in seconds (can be signed) to add to
 * current timestamp  
 */
export const getTimestamp = (shift = 0) => {
    return (Math.round(new Date().getTime() / 1000) + parseInt(shift))
}

/**
 * Returns the difference in seconds between to and from (being timestamps)
 * 
 * @param {Number} from from timestamp in seconds
 * @param {Number} to to timestamp in seconds
 */
export const getTimeShift = (from, to) => {
    return (Math.round(to - from))
}