describe('EdTriagePatientFactory tests', function() {

    var edTriagePatientFactory;
    var q;
    var deferred;
    var mock_data = {
        "uuid": "df204d1a-8dd0-447b-b21b-b081b5ddf761",
        "display": "Emergency Triage 06/03/2016",
        "encounterDatetime": "2016-06-03T17:28:22.000-0400",
        "patient": {
            "uuid": "ab73a342-61e1-45d4-bd98-e55e0cc3d603",
            "display": "X5HXW2 - Billy TestPatient10",
            "links": [
                {
                    "uri": "http://localhost:8080/openmrs/ws/rest/v1/patient/ab73a342-61e1-45d4-bd98-e55e0cc3d603",
                    "rel": "self"
                }
            ]
        },
        "location": null,
        "form": null,
        "encounterType": {
            "uuid": "74cef0a6-2801-11e6-b67b-9e71128cae77",
            "display": "Emergency Triage",
            "name": "Emergency Triage",
            "description": "Emergency Department patient triage",
            "retired": false,
            "links": [
                {
                    "uri": "http://localhost:8080/openmrs/ws/rest/v1/encountertype/74cef0a6-2801-11e6-b67b-9e71128cae77",
                    "rel": "self"
                },
                {
                    "uri": "http://localhost:8080/openmrs/ws/rest/v1/encountertype/74cef0a6-2801-11e6-b67b-9e71128cae77?v=full",
                    "rel": "full"
                }
            ],
            "resourceVersion": "1.8"
        },
        "obs": [
            {
                "uuid": "1a316109-fc2f-49f1-b7e8-c3d27c561c34",
                "display": "Temperature (C): 98.6",
                "concept": {
                    "uuid": "3ce939d2-26fe-102b-80cb-0017a47871b2",
                    "display": "Temperature (C)",
                    "links": [
                        {
                            "uri": "http://localhost:8080/openmrs/ws/rest/v1/concept/3ce939d2-26fe-102b-80cb-0017a47871b2",
                            "rel": "self"
                        }
                    ]
                },
                "person": {
                    "uuid": "ab73a342-61e1-45d4-bd98-e55e0cc3d603",
                    "display": "X5HXW2 - Billy TestPatient10",
                    "links": [
                        {
                            "uri": "http://localhost:8080/openmrs/ws/rest/v1/patient/ab73a342-61e1-45d4-bd98-e55e0cc3d603",
                            "rel": "self"
                        }
                    ]
                },
                "obsDatetime": "2016-06-03T17:28:22.000-0400",
                "accessionNumber": null,
                "obsGroup": null,
                "valueCodedName": null,
                "groupMembers": null,
                "comment": null,
                "location": null,
                "order": null,
                "encounter": {
                    "uuid": "df204d1a-8dd0-447b-b21b-b081b5ddf761",
                    "display": "Emergency Triage 06/03/2016",
                    "links": [
                        {
                            "uri": "http://localhost:8080/openmrs/ws/rest/v1/encounter/df204d1a-8dd0-447b-b21b-b081b5ddf761",
                            "rel": "self"
                        }
                    ]
                },
                "voided": false,
                "value": 98.6,
                "valueModifier": null,
                "links": [
                    {
                        "uri": "http://localhost:8080/openmrs/ws/rest/v1/obs/1a316109-fc2f-49f1-b7e8-c3d27c561c34",
                        "rel": "self"
                    },
                    {
                        "uri": "http://localhost:8080/openmrs/ws/rest/v1/obs/1a316109-fc2f-49f1-b7e8-c3d27c561c34?v=full",
                        "rel": "full"
                    }
                ],
                "resourceVersion": "1.8"
            },
            {
                "uuid": "4992c0ad-a43c-48c5-ab90-2373148c660d",
                "display": "Diastolic blood pressure: 83.0",
                "concept": {
                    "uuid": "3ce93694-26fe-102b-80cb-0017a47871b2",
                    "display": "Diastolic blood pressure",
                    "links": [
                        {
                            "uri": "http://localhost:8080/openmrs/ws/rest/v1/concept/3ce93694-26fe-102b-80cb-0017a47871b2",
                            "rel": "self"
                        }
                    ]
                },
                "person": {
                    "uuid": "ab73a342-61e1-45d4-bd98-e55e0cc3d603",
                    "display": "X5HXW2 - Billy TestPatient10",
                    "links": [
                        {
                            "uri": "http://localhost:8080/openmrs/ws/rest/v1/patient/ab73a342-61e1-45d4-bd98-e55e0cc3d603",
                            "rel": "self"
                        }
                    ]
                },
                "obsDatetime": "2016-06-03T17:28:22.000-0400",
                "accessionNumber": null,
                "obsGroup": null,
                "valueCodedName": null,
                "groupMembers": null,
                "comment": null,
                "location": null,
                "order": null,
                "encounter": {
                    "uuid": "df204d1a-8dd0-447b-b21b-b081b5ddf761",
                    "display": "Emergency Triage 06/03/2016",
                    "links": [
                        {
                            "uri": "http://localhost:8080/openmrs/ws/rest/v1/encounter/df204d1a-8dd0-447b-b21b-b081b5ddf761",
                            "rel": "self"
                        }
                    ]
                },
                "voided": false,
                "value": 83,
                "valueModifier": null,
                "links": [
                    {
                        "uri": "http://localhost:8080/openmrs/ws/rest/v1/obs/4992c0ad-a43c-48c5-ab90-2373148c660d",
                        "rel": "self"
                    },
                    {
                        "uri": "http://localhost:8080/openmrs/ws/rest/v1/obs/4992c0ad-a43c-48c5-ab90-2373148c660d?v=full",
                        "rel": "full"
                    }
                ],
                "resourceVersion": "1.8"
            },
            {
                "uuid": "34a74fbd-aed5-40e6-9cdb-9dc78463eb2f",
                "display": "Chief complaint: stomach hurts",
                "concept": {
                    "uuid": "160531AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                    "display": "Chief complaint",
                    "links": [
                        {
                            "uri": "http://localhost:8080/openmrs/ws/rest/v1/concept/160531AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                            "rel": "self"
                        }
                    ]
                },
                "person": {
                    "uuid": "ab73a342-61e1-45d4-bd98-e55e0cc3d603",
                    "display": "X5HXW2 - Billy TestPatient10",
                    "links": [
                        {
                            "uri": "http://localhost:8080/openmrs/ws/rest/v1/patient/ab73a342-61e1-45d4-bd98-e55e0cc3d603",
                            "rel": "self"
                        }
                    ]
                },
                "obsDatetime": "2016-06-03T17:28:22.000-0400",
                "accessionNumber": null,
                "obsGroup": null,
                "valueCodedName": null,
                "groupMembers": null,
                "comment": null,
                "location": null,
                "order": null,
                "encounter": {
                    "uuid": "df204d1a-8dd0-447b-b21b-b081b5ddf761",
                    "display": "Emergency Triage 06/03/2016",
                    "links": [
                        {
                            "uri": "http://localhost:8080/openmrs/ws/rest/v1/encounter/df204d1a-8dd0-447b-b21b-b081b5ddf761",
                            "rel": "self"
                        }
                    ]
                },
                "voided": false,
                "value": "stomach hurts",
                "valueModifier": null,
                "links": [
                    {
                        "uri": "http://localhost:8080/openmrs/ws/rest/v1/obs/34a74fbd-aed5-40e6-9cdb-9dc78463eb2f",
                        "rel": "self"
                    },
                    {
                        "uri": "http://localhost:8080/openmrs/ws/rest/v1/obs/34a74fbd-aed5-40e6-9cdb-9dc78463eb2f?v=full",
                        "rel": "full"
                    }
                ],
                "resourceVersion": "1.8"
            },
            {
                "uuid": "5f86906b-1148-4f1f-850e-b0c9e4f4ce17",
                "display": "Weight (kg): 155.0",
                "concept": {
                    "uuid": "3ce93b62-26fe-102b-80cb-0017a47871b2",
                    "display": "Weight (kg)",
                    "links": [
                        {
                            "uri": "http://localhost:8080/openmrs/ws/rest/v1/concept/3ce93b62-26fe-102b-80cb-0017a47871b2",
                            "rel": "self"
                        }
                    ]
                },
                "person": {
                    "uuid": "ab73a342-61e1-45d4-bd98-e55e0cc3d603",
                    "display": "X5HXW2 - Billy TestPatient10",
                    "links": [
                        {
                            "uri": "http://localhost:8080/openmrs/ws/rest/v1/patient/ab73a342-61e1-45d4-bd98-e55e0cc3d603",
                            "rel": "self"
                        }
                    ]
                },
                "obsDatetime": "2016-06-03T17:28:22.000-0400",
                "accessionNumber": null,
                "obsGroup": null,
                "valueCodedName": null,
                "groupMembers": null,
                "comment": null,
                "location": null,
                "order": null,
                "encounter": {
                    "uuid": "df204d1a-8dd0-447b-b21b-b081b5ddf761",
                    "display": "Emergency Triage 06/03/2016",
                    "links": [
                        {
                            "uri": "http://localhost:8080/openmrs/ws/rest/v1/encounter/df204d1a-8dd0-447b-b21b-b081b5ddf761",
                            "rel": "self"
                        }
                    ]
                },
                "voided": false,
                "value": 155,
                "valueModifier": null,
                "links": [
                    {
                        "uri": "http://localhost:8080/openmrs/ws/rest/v1/obs/5f86906b-1148-4f1f-850e-b0c9e4f4ce17",
                        "rel": "self"
                    },
                    {
                        "uri": "http://localhost:8080/openmrs/ws/rest/v1/obs/5f86906b-1148-4f1f-850e-b0c9e4f4ce17?v=full",
                        "rel": "full"
                    }
                ],
                "resourceVersion": "1.8"
            },
            {
                "uuid": "ff8b31bb-cc27-4c0f-90e8-20d3ae38ab8d",
                "display": "Systolic blood pressure: 122.0",
                "concept": {
                    "uuid": "3ce934fa-26fe-102b-80cb-0017a47871b2",
                    "display": "Systolic blood pressure",
                    "links": [
                        {
                            "uri": "http://localhost:8080/openmrs/ws/rest/v1/concept/3ce934fa-26fe-102b-80cb-0017a47871b2",
                            "rel": "self"
                        }
                    ]
                },
                "person": {
                    "uuid": "ab73a342-61e1-45d4-bd98-e55e0cc3d603",
                    "display": "X5HXW2 - Billy TestPatient10",
                    "links": [
                        {
                            "uri": "http://localhost:8080/openmrs/ws/rest/v1/patient/ab73a342-61e1-45d4-bd98-e55e0cc3d603",
                            "rel": "self"
                        }
                    ]
                },
                "obsDatetime": "2016-06-03T17:28:22.000-0400",
                "accessionNumber": null,
                "obsGroup": null,
                "valueCodedName": null,
                "groupMembers": null,
                "comment": null,
                "location": null,
                "order": null,
                "encounter": {
                    "uuid": "df204d1a-8dd0-447b-b21b-b081b5ddf761",
                    "display": "Emergency Triage 06/03/2016",
                    "links": [
                        {
                            "uri": "http://localhost:8080/openmrs/ws/rest/v1/encounter/df204d1a-8dd0-447b-b21b-b081b5ddf761",
                            "rel": "self"
                        }
                    ]
                },
                "voided": false,
                "value": 122,
                "valueModifier": null,
                "links": [
                    {
                        "uri": "http://localhost:8080/openmrs/ws/rest/v1/obs/ff8b31bb-cc27-4c0f-90e8-20d3ae38ab8d",
                        "rel": "self"
                    },
                    {
                        "uri": "http://localhost:8080/openmrs/ws/rest/v1/obs/ff8b31bb-cc27-4c0f-90e8-20d3ae38ab8d?v=full",
                        "rel": "full"
                    }
                ],
                "resourceVersion": "1.8"
            },
            {
                "uuid": "39bf040e-d549-44ec-aafc-9e029c0bc6cb",
                "display": "Blood oxygen saturation: 9.0",
                "concept": {
                    "uuid": "3ce9401c-26fe-102b-80cb-0017a47871b2",
                    "display": "Blood oxygen saturation",
                    "links": [
                        {
                            "uri": "http://localhost:8080/openmrs/ws/rest/v1/concept/3ce9401c-26fe-102b-80cb-0017a47871b2",
                            "rel": "self"
                        }
                    ]
                },
                "person": {
                    "uuid": "ab73a342-61e1-45d4-bd98-e55e0cc3d603",
                    "display": "X5HXW2 - Billy TestPatient10",
                    "links": [
                        {
                            "uri": "http://localhost:8080/openmrs/ws/rest/v1/patient/ab73a342-61e1-45d4-bd98-e55e0cc3d603",
                            "rel": "self"
                        }
                    ]
                },
                "obsDatetime": "2016-06-03T17:28:22.000-0400",
                "accessionNumber": null,
                "obsGroup": null,
                "valueCodedName": null,
                "groupMembers": null,
                "comment": null,
                "location": null,
                "order": null,
                "encounter": {
                    "uuid": "df204d1a-8dd0-447b-b21b-b081b5ddf761",
                    "display": "Emergency Triage 06/03/2016",
                    "links": [
                        {
                            "uri": "http://localhost:8080/openmrs/ws/rest/v1/encounter/df204d1a-8dd0-447b-b21b-b081b5ddf761",
                            "rel": "self"
                        }
                    ]
                },
                "voided": false,
                "value": 9,
                "valueModifier": null,
                "links": [
                    {
                        "uri": "http://localhost:8080/openmrs/ws/rest/v1/obs/39bf040e-d549-44ec-aafc-9e029c0bc6cb",
                        "rel": "self"
                    },
                    {
                        "uri": "http://localhost:8080/openmrs/ws/rest/v1/obs/39bf040e-d549-44ec-aafc-9e029c0bc6cb?v=full",
                        "rel": "full"
                    }
                ],
                "resourceVersion": "1.8"
            },
            {
                "uuid": "343e2afe-aec2-46fb-bdef-71f9ed183966",
                "display": "Respiratory rate: 8.0",
                "concept": {
                    "uuid": "3ceb11f8-26fe-102b-80cb-0017a47871b2",
                    "display": "Respiratory rate",
                    "links": [
                        {
                            "uri": "http://localhost:8080/openmrs/ws/rest/v1/concept/3ceb11f8-26fe-102b-80cb-0017a47871b2",
                            "rel": "self"
                        }
                    ]
                },
                "person": {
                    "uuid": "ab73a342-61e1-45d4-bd98-e55e0cc3d603",
                    "display": "X5HXW2 - Billy TestPatient10",
                    "links": [
                        {
                            "uri": "http://localhost:8080/openmrs/ws/rest/v1/patient/ab73a342-61e1-45d4-bd98-e55e0cc3d603",
                            "rel": "self"
                        }
                    ]
                },
                "obsDatetime": "2016-06-03T17:28:22.000-0400",
                "accessionNumber": null,
                "obsGroup": null,
                "valueCodedName": null,
                "groupMembers": null,
                "comment": null,
                "location": null,
                "order": null,
                "encounter": {
                    "uuid": "df204d1a-8dd0-447b-b21b-b081b5ddf761",
                    "display": "Emergency Triage 06/03/2016",
                    "links": [
                        {
                            "uri": "http://localhost:8080/openmrs/ws/rest/v1/encounter/df204d1a-8dd0-447b-b21b-b081b5ddf761",
                            "rel": "self"
                        }
                    ]
                },
                "voided": false,
                "value": 8,
                "valueModifier": null,
                "links": [
                    {
                        "uri": "http://localhost:8080/openmrs/ws/rest/v1/obs/343e2afe-aec2-46fb-bdef-71f9ed183966",
                        "rel": "self"
                    },
                    {
                        "uri": "http://localhost:8080/openmrs/ws/rest/v1/obs/343e2afe-aec2-46fb-bdef-71f9ed183966?v=full",
                        "rel": "full"
                    }
                ],
                "resourceVersion": "1.8"
            }
        ],
        "orders": [],
        "voided": false,
        "auditInfo": {
            "creator": {
                "uuid": "ac6d78f2-48f3-11e3-a9c9-aa008d121340",
                "display": "admin",
                "links": [
                    {
                        "uri": "http://localhost:8080/openmrs/ws/rest/v1/user/ac6d78f2-48f3-11e3-a9c9-aa008d121340",
                        "rel": "self"
                    }
                ]
            },
            "dateCreated": "2016-06-03T17:28:22.000-0400",
            "changedBy": null,
            "dateChanged": null
        },
        "visit": null,
        "encounterProviders": [],
        "links": [
            {
                "uri": "http://localhost:8080/openmrs/ws/rest/v1/encounter/df204d1a-8dd0-447b-b21b-b081b5ddf761",
                "rel": "self"
            }
        ],
        "resourceVersion": "1.9"
    }

    beforeEach(module('components/EdTriagePatientFactory'));

    // create mock User resource
    var mockEdTriagePatient = jasmine.createSpyObj('EdTriagePatient', ['build']);
    mockEdTriagePatient.build.andCallFake(function() {

        deferred = q.defer();

        var promise_mock = {
            $promise: deferred.promise
        };

        return promise_mock;
    });

    beforeEach(module(function($provide) {
        $provide.value('UsEdTriagePatient', mockEdTriagePatient);
    }));

    // inject necessary dependencies
    beforeEach(inject(function (_EdTriagePatientFactory_,$q) {
        edTriagePatientFactory = _EdTriagePatientFactory_;
        q = $q;
    }));

    it('should load an EDTriagePatient from a data source', function() {
        var ret = edTriagePatientFactory.build(mock_data);
        expect(ret.patientId.uuid).to.be('ab73a342-61e1-45d4-bd98-e55e0cc3d603');
    });

});