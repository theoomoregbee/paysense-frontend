/**
 * Created by theophy on 25/03/2017.
 */

(function () {
    'use strict';

    angular.module("paysense", ["ngAnimate", "ngFx"])
        .controller("MainController", MainController);

    MainController.$inject = ["$timeout", "$http", "$location", "$anchorScroll"];
    function MainController($timeout, $http, $location, $anchorScroll) {
        var vm = this;
        vm.chats = [];
        vm.loader = true;
        vm.chat_loader = true;
        vm.loadMessage = loadMessage;


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


            $http.get("http://localhost:1337/message/interact?message=" + message).then(function (success) {
                console.info("bot response", success);
                vm.chat_loader = false;

                var i = 0;
                //transform message
                angular.forEach(success.data.output, function (value, index) {
                    var input = {text: value, type: "bot", suggestions: []};
                    if (i == (success.data.output.length - 1)) {
                        input.suggestions = success.data.suggestions;
                    }
                    vm.chats.push(input);

                    // call $anchorScroll()
                    $anchorScroll();

                    i++;
                });

                //vm.chats[success.data.output.length - 1].suggestions = success.data.suggestions;


            }, function (failed) {
                vm.chat_loader = false;
                console.error(failed);
            });
        }


        /**
         * call these functions for me
         */
        //showLoader(120);
        loadMessage("hi");


    }


})();