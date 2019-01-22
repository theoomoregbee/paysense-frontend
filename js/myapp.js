/**
 * Created by theophy on 25/03/2017.
 */

(function () {
    'use strict';

    angular.module("paysense", ["ngAnimate", "ngFx", "ngSanitize"])
        .constant("Constants", {
            endpoint: "https://paysense.herokuapp.com",
            local_endpoint: "http://localhost:1337"
        })
        .controller("MainController", MainController);

    MainController.$inject = ["$timeout", "$http", "$location", "$anchorScroll", "Constants"];
    function MainController($timeout, $http, $location, $anchorScroll, Constants) {
        var vm = this;
      // var endpoint = Constants.local_endpoint;
        var endpoint = Constants.endpoint;

        var audio = new Audio();
        audio.addEventListener('canplaythrough', function () {
            console.log("can play through now");
            audio.play();
        }, false);

        audio.addEventListener('ended', function () {
            console.log("Play ended owk oo. Buffered:", audio.buffered);
        }, false);

        audio.addEventListener('error', function (event) {
            console.log("Error occurred", event);
        }, false);

        audio.addEventListener('loadstart', function () {
            console.log("Just started loading of data");
        });

        vm.chats = [];
        vm.loader = true;
        vm.chat_loader = true;
        vm.loadMessage = loadMessage;
        vm.playAudio = playAudio;
        /**
         * this holds our settings of our app
         * @type {{text_to_speech: boolean}}
         */
        vm.settings = {
            text_to_speech: true
        };


        console.log("am here");

        /**
         * this is used to show loader for d entered/passed time
         * @param time
         */
        function showLoader(time) {
            vm.loader = true;
            $timeout(function () {
                vm.loader = false;
                console.log("done");
            }, time);
        }


        /**
         * this is used to load our message for our chat bot
         * @param message
         * @param human
         */
        function loadMessage(message, human) {

            if (human) {
                vm.chats.push({text: message, type: "human", suggestions: []});
            }

            vm.chat_loader = true;

            $location.hash('bottom');


            $http.get(endpoint + "/message/interact?message=" + message + "&text_to_speech=" + vm.settings.text_to_speech).then(function (success) {
                console.info("bot response", success);

                vm.chat_loader = false;
                if (vm.settings.text_to_speech === true) {
                    processChatBotResponse(success);
                    playAudio();
                }
                else
                    processChatBotResponse(success);


            }, function (failed) {
                vm.chat_loader = false;
                console.error(failed);
            });
        }


        /**
         * this is used to convert our sample chat bot output to sound
         */
        function playAudio() {
            audio.src = endpoint + '/text2speech/audio';
            audio.load();
        }

        /**
         * this is used to process chat bot response
         * @param response
         */
        function processChatBotResponse(response) {
            var i = 0;
            //transform message
            angular.forEach(response.data.output, function (value, index) {
                var input = {text: value, type: "bot", suggestions: []};
                if (i === (response.data.output.length - 1)) {
                    input.suggestions = response.data.suggestions;
                }
                vm.chats.push(input);

                // call $anchorScroll()
                $anchorScroll();

                i++;
            });
        }

        /**
         * call these functions for me
         */
        //showLoader(120);
        loadMessage("hi");


    }


})();
