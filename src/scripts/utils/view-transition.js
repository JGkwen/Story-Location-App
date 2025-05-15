const ViewTransition = {
    start(callback) {
        if (document.startViewTransition) {
            document.startViewTransition(callback);
        } else {
            callback();
        }
    },
};

export default ViewTransition;
