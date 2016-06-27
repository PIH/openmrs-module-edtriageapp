angular.module("filters", ['uicommons.filters'])
.filter('findAnswer', [ 'translations',  function(translations) {
    return function(concept, uuid) {
        if(concept == null){
            return "";
        }
        for (var i=0; i<concept.answers.length; ++i) {
            if (concept.answers[i].uuid == uuid) {
                return concept.answers[i];
            }
        }
        return null;
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
        }}]);