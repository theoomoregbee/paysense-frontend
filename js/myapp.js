/**
 * Created by theophy on 25/03/2017.
 */

(function () {
    'use strict';

    angular.module("paysense", ["ngAnimate", "ngFx", "ngSanitize"])
        .constant("Constants", {
            endpoint: "https://paysense.mybluemix.net",
            local_endpoint: "http://localhost:1337"
        })
        .controller("MainController", MainController);

    MainController.$inject = ["$timeout", "$http", "$location", "$anchorScroll", "Constants"];
    function MainController($timeout, $http, $location, $anchorScroll, Constants) {
        var vm = this;
        var endpoint = Constants.local_endpoint;


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
                processChatBotResponse(success);

                if (vm.settings.text_to_speech === true)
                    playAudio();

            }, function (failed) {
                vm.chat_loader = false;
                console.error(failed);
            });
        }


        /**
         * this is used to convert our sample chat bot output to sound
         */
        function playAudio() {
            var audio = new Audio(endpoint + '/text2speech/audio');
            audio.play();
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