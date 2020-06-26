angular.module("filters", ['uicommons.filters'])
    .filter('findAnswer', [ function() {
        return function(concept, uuid) {
            if(concept == null || concept.answers == null){
                return "";
            }
            for (var i=0; i<concept.answers.length; ++i) {
                if (concept.answers[i].uuid == uuid) {
                    return concept.answers[i];
                }
            }
            return null;
    }}])
    .filter('property', [ function() {
        return function(object, property) {
            return object ? object[property] : null;
        }}])
    .filter('translate', [  function() {
        return function(text, conceptUuid, ageType) {
            if(text === undefined || conceptUuid === undefined || ageType ===undefined){
                return text;
            }
            var key = ageType + "." + conceptUuid;
            if(translations.hasOwnProperty(key)){
                return translations[key];
            }
            else if(translations.hasOwnProperty(conceptUuid)){
                return translations[conceptUuid];
            }
            else{
                return text;
            }
        }}])
    .filter('getProviderNameFromDisplayString', function() {
        return function(input) {
            if (input && input.display){
                //we made the assumption the display string is like "Wideline Louis Charles: Dispenser"
                // /ws/rest/v1/visit/2a767422-98b2-445d-9294-d008e17b42c5?v=custom:)
                var name = input.display.split(": ");
                if (name != null && name[0].length < input.display.length) {
                    return name[0];
                } else {
                    //we made the assumption the display string is like "MAH6P - Wideline Louis Charles"
                    // /ws/rest/v1/encounter/uuid?v=full
                    name = input.display.split(" - ");
                    if (name != null) {
                        return name[name.length -1];
                    }
                }
            }
            return "";
        }
    })
    .filter('titleCase', function() {
        return function(input) {
            input = input || '';
            return input.replace(/\w\S*/g, function(txt){ return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
        };
    });
