var assert = require('assert');
var _ = require('underscore');
var match = require('../../src/match');
var mockDataLoader = require('../../src/mockDataLoader');

describe('match', function() {

    describe('matching json body when post', function() {

        var configQuery1 = {
            "request" : {
                "path": "test",
                "method" : "post",
                "body" : {
                    "param1" : "value1"
                }
            },
            "response" : {}
        };

        var configQuery2 = {
            "request" : {
                "path": "test",
                "method" : "post",
                "body" : {
                    "param1" : "value1",
                    "param2" : {
                        "subParam3" : {
                            "subSubParam1" : "subSubParam1"
                        }
                    }
                }
            },
            "response" : {}
        };

        var configQuery3 = {
            "request" : {
                "path": "testQuery",
                "method" : "post",
                "body" : {
                    "param2" : {
                        "subParam3" : {
                            "subSubParam2" : "subSubParam2"
                        }
                    }
                }
            },
            "response" : {}
        };

        var requestMappings;

        beforeEach(function(){
            mockDataLoader.reset();
            _.each([configQuery1, configQuery2, configQuery3], function(config){
                mockDataLoader.buildMappings(config);
            })
            requestMappings = mockDataLoader.getRequestMappings();
        });

        it('matchRequests should match body', function() {
            var request = {
               "path": "testQuery",
                "method" : "POST",
                "body" : {
                    "param1" : "value1",
                    "param2" : "value2"
                } 
            };
            var request1 = {
                "path": "testQuery",
                "method" : "POST",
                "body" : {
                    "param1" : "value1",
                    "param2" : {
                        "subParam1" : "subValue1",
                        "subParam2" : "subValue2",
                        "subParam3" : {
                            "subSubParam1" : "subSubParam1"
                        }
                    }
                }
            };

            var request2 = {
                "path": "testQuery",
                "method" : "POST",
                "body" : {
                    "param2" : {
                        "subParam3" : {
                            "subSubParam1" : "subSubParam1",
                            "subSubParam2" : "subSubParam2"
                        }
                    }
                }
            };

            assert.deepEqual(match.matchRequests(request, requestMappings), configQuery1);
            assert.deepEqual(match.matchRequests(request1, requestMappings), configQuery2);
            assert.deepEqual(match.matchRequests(request2, requestMappings), configQuery3);
        });

        it('matchRequests should not match body', function() {
            var request = {
               "path": "testQuery",
                "method" : "post",
                "body" : {
                    "param2" : "value1"
                } 
            };
            assert(match.matchRequests(request, requestMappings) === null);
        });

    });
});