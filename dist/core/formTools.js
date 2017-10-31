
define(function (require) {

    return {
        mergeRadioDataset: function mergeRadioDataset(dataset) {
            var obj = {};
            for (var key in dataset) {
                if (key.indexOf('___radio___') < 0) {
                    obj[key] = dataset[key];
                    continue;
                }
                if (!dataset[key]) continue;
                var arr = key.split('___radio___');
                obj[arr[0]] = arr[1];
            }
            return obj;
        },
        mergeRadioValidationResults: function mergeRadioValidationResults(results) {
            var obj = {};
            for (var key in results) {
                if (key.indexOf('___radio___') < 0) {
                    obj[key] = results[key];
                    continue;
                }
                var arr = key.split('___radio___');
                obj[arr[0]] = obj[arr[0]] || [];
                obj[arr[0]] = obj[arr[0]].concat(results[key]);
            }
            return obj;
        }
    };
});