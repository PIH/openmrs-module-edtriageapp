angular.module('constants', [])
    .value('DatetimeFormats', {
        date: "d-MMM-yy",
        time: "hh:mm a",
        datetime: "d-MMM-yy (hh:mm a)"
    })
    .value('EncounterTypes', {
        triage: {
            uuid: "3cdc871e-26fe-102b-80cb-0017a47871b2"
        }
    })
    .value('Concepts', {
        triageQueueStatus:{
            uuid: "11111111-1111-1111-1111-111111111111"
        } ,
        admissionLocation: {
            uuid: "f3e04276-2db0-4181-b937-d73275dc1b15"
        },
        chiefComplaint: {
            uuid: "160531AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
        },
        // vitals section
        mobility: {
            uuid: "11111111-1111-1111-1111-111111111111",
            answers:[
                { uuid:"immobile_uuid_goes_here"},
                { uuid:"walking_with_help_uuid_goes_here"},
                { uuid:"walking_uuid_goes_here"}
            ]
        },
        respiratoryRate: {
            uuid: "3ceb11f8-26fe-102b-80cb-0017a47871b2"
        },
        oxygenSaturation: {
            uuid: "3ce9401c-26fe-102b-80cb-0017a47871b2"
        },
        heartRate: {
            uuid: "3ce93824-26fe-102b-80cb-0017a47871b2"
        },
        systolicBloodPressure: {
            uuid: "3ce934fa-26fe-102b-80cb-0017a47871b2"
        },
        diastolicBloodPressure: {
            uuid: "3ce93694-26fe-102b-80cb-0017a47871b2"
        },
        temperature: {
            uuid: "3ce939d2-26fe-102b-80cb-0017a47871b2"
        },
        consciousness: {
            uuid: "11111111-1111-1111-1111-111111111111"
        },
        trauma: {
            uuid: "11111111-1111-1111-1111-111111111111"
        },
        weight: {
            uuid: "3ce93b62-26fe-102b-80cb-0017a47871b2"
        },
        // symptoms section
        neurological: {
            uuid: "11111111-1111-1111-1111-111111111111"
        },
        burn: {
            uuid: "11111111-1111-1111-1111-111111111111"
        },
        traumaDetails: {
            uuid: "11111111-1111-1111-1111-111111111111"
        },
        digestive: {
            uuid: "11111111-1111-1111-1111-111111111111"
        },
        pregnancy: {
            uuid: "11111111-1111-1111-1111-111111111111"
        },
        respiratory: {
            uuid: "11111111-1111-1111-1111-111111111111"
        },
        pain: {
            uuid: "11111111-1111-1111-1111-111111111111"
        },
        other: {
            uuid: "3cee7fb4-26fe-102b-80cb-0017a47871b2"
        },
        //  generic answers
        yes: {
            uuid: "3cd6f600-26fe-102b-80cb-0017a47871b2"
        },
        no: {
            uuid: "3cd6f86c-26fe-102b-80cb-0017a47871b2"
        },
        none: {
            uuid: "3cd743f8-26fe-102b-80cb-0017a47871b2"
        },
        unknown: {
            uuid: "3cd6fac4-26fe-102b-80cb-0017a47871b2"
        }
        // height: {
        //     uuid: "3ce93cf2-26fe-102b-80cb-0017a47871b2"
        // },
    });
