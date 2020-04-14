class Time {
    /**
     * Returns current timestamp in seconds
     * 
     * @param {Number} shift optional shift in seconds (can be signed) to add to
     * current timestamp  
     */
    static getTimestamp(shift = 0) {
        return (Math.round(new Date().getTime() / 1000) + parseInt(shift))
    }

    /**
     * Returns the difference in seconds between to and from (being timestamps)
     * 
     * @param {Number} from from timestamp in seconds
     * @param {Number} to to timestamp in seconds
     */
    static getShift(from, to) {
        return (Math.round(to - from))
    }
}

export default Time