let _setLoading = () => { };
let _setLoadingText = () => { };

export const loadingController = {
    setLoading: (v) => {
        try { _setLoading(!!v); } catch (e) { /* noop */ }
    },
    setLoadingText: (t) => {
        try { _setLoadingText(t); } catch (e) { /* noop */ }
    },
    register: (setLoadingFn, setLoadingTextFn) => {
        _setLoading = setLoadingFn || (() => { });
        _setLoadingText = setLoadingTextFn || (() => { });
    },
    unregister: () => {
        _setLoading = () => { };
        _setLoadingText = () => { };
    }
};
