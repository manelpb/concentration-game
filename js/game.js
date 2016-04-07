var ScoreBoard = {
    Attemps: 0,
    Timer: 0,
    
    reset : function() {
        this.Attemps = 0;
        this.Timer = 0;
        
        this.updateScoreBoard();
    },
    
    updateAttempts: function() {
        this.Attemps++;
        this.updateScoreBoard();
    },
    
    updateTimer: function() {
        this.Timer++;
        this.updateScoreBoard();
    },
    
    updateScoreBoard : function() {
        $(".scoreboard .timer span").html(this.Timer);
        $(".scoreboard .attemps span").html(this.Attemps);
        
        $(".final-scoreboard .timer span").html(this.Timer);
        $(".final-scoreboard .attemps span").html(this.Attemps);
    }
};

var Game = function() {   
    this.self = this;
    
    this.timer = null;
    this.timerNum = 0;
    this.qntCards = 10;
    this.boardContainer = null;
    this.cards = [];
    this.firstFlippedCard = -1;
    this.secondFlippedCard = -1;
    
    this.ShuffleCards = function(a) {
        var j, x, i;
        for (i = a.length; i; i -= 1) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
        
        return a;
    };
    
    this.StarOver = function() {        
        // reset everything
        ScoreBoard.reset();

        // creates a new board
        this.CreateCards();
        this.CreateBoard();

        // hides the overlay
        $(".final-scoreboard").hide();
        
        // reset the timer
        this.timer = null;
    };
    
    this.FlipCard = function(cardNum, on) {
        //$(this.boardContainer + " #card_" + cardNum).html(this.cards[cardNum]);
        
        if(on) {        
            $("#card_" + cardNum).removeClass("hided");
            $("#card_" + cardNum).addClass("item-" + this.cards[cardNum]);
            $("#card_" + cardNum).addClass("openned");            
        } else {
            $(this.boardContainer + " #card_" + cardNum).html("");
            $("#card_" + cardNum).addClass("hided");
            $("#card_" + cardNum).removeClass("item-" + this.cards[cardNum]);
            $("#card_" + cardNum).removeClass("openned");            
        }
    };
    
    this.Won = function() {
        return ($(this.boardContainer).find(".openned").length == this.cards.length);
    };
    
    this.CreateCards = function() {
        this.cards = [];
        
        // create cards
        for(var i = 0, j = 0; i < (this.qntCards/2); i++, j++) {
            this.cards.push(j);
            this.cards.push(j);
        }
        
        // suffle the cards
        this.ShuffleCards( this.cards);
    };
    
    this.CompareCards = function() {
        if(this.cards[this.firstFlippedCard] == this.cards[this.secondFlippedCard]) {
            // keep cards openned
            //console.log("match");
            
            $("#card_" + this.firstFlippedCard).addClass("openned");
            $("#card_" + this.secondFlippedCard).addClass("openned");
        } else {
            // flip back
            //console.log("not match");
            
            this.FlipCard(this.firstFlippedCard, false);
            this.FlipCard(this.secondFlippedCard, false);
            
            ScoreBoard.updateAttempts();
        }
        
        // reset selection
        this.firstFlippedCard = -1;
        this.secondFlippedCard = -1;
        
        // checks if the game is over
        if(this.Won()) {
            // stops the timer
            clearInterval(this.timer);
            
            // shows the final scoreboard
            $(".final-scoreboard").show();
        }
    };
    
    this.PlayTurn = function(elemn) {
        var self = this;
        
        var cardId = elemn.attr("id");        
        var cardIdNum = parseInt(cardId.split("_")[1]);

        if(!elemn.hasClass("openned")) {
            if(this.firstFlippedCard == -1) {
                this.firstFlippedCard = cardIdNum;
                this.FlipCard(this.firstFlippedCard, true);

                // start the timer on the first move
                if(!this.timer) {
                    this.timer = setInterval(function() {
                        ScoreBoard.updateTimer();
                    }, 1000);
                }
            } else if (this.secondFlippedCard == -1) {
                this.secondFlippedCard = cardIdNum;
                this.FlipCard(this.secondFlippedCard, true);
            }

            if(this.firstFlippedCard != -1 && this.secondFlippedCard != -1) {
                // compare if they match
                setTimeout(function() {
                    self.CompareCards();
                }, 500);
            }
        }
    };
    
    this.CreateBoard = function() {
        var self = this;
        
        // empty the timer
        if(this.timer) {
            clearInterval(this.timer);
        }
        
        // clean the board
        $(this.boardContainer).empty();
        
        for(var i = 0; i < this.qntCards; i++) {
            $(this.boardContainer).append("<div class='col-xs-4 col-sm-3 col-md-2 item hided' id='card_"+ i +"'></div>");            
            
            $(this.boardContainer + " #card_" + i).click(jQuery.proxy(function(event) {
                this.PlayTurn($(event.target));
            }, this));
        };
    };
    
    this.BindExtraEvents = function() {
        $("#btnStartOver").click(jQuery.proxy(function(event) {
            this.StarOver();
        }, this));
    };
    
    this.Init = function(bc) {        
        this.boardContainer = bc;   

        this.CreateCards();
        this.CreateBoard();
        this.BindExtraEvents();       
    };
}

$(document).ready(function() {
    // init the game
    new Game().Init(".game-board .rows .cards");
});