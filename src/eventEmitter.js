/**
 * class evevnt emitter
 */
class EventEmitter {

    constructor() {
        this.events = {}
    }

    /**
     * add new event
     * 
     * @param {string} type - event name 
     * @param {function} callback 
     */
    on(type, callback) {
        this.events[type] = this.events[type] || [];
        this.events[type].push(callback);
    }

    /**
     * calls event
     * 
     * @param {string} type - event name
     * @param {*} arg - argument for methods 
     */
    emit(type, arg) {
        if (this.events[type]) {
            this.events[type].forEach(callback => {
                callback(arg);
            });
        }
    }
}

export default EventEmitter;