var ScoreBoard = {
    Attemps: 0,
    Matches: 0,
    
    reset : function() {
        this.Attemps = 0;
        this.Matches = 0;
        
        this.updateScoreBoard();
    },
    
    updateAttempts: function() {
        this.Attemps++;
        this.updateScoreBoard();
    },
    
    updateMatches: function() {
        this.Matches++;
        this.updateScoreBoard();
    },
    
    updateScoreBoard : function() {
        $(".scoreboard .attemps span").html(this.Attemps);
        $(".scoreboard .matches span").html(this.Matches);
        
        $(".overlay .attemps span").html(this.Attemps);
        $(".overlay .matches span").html(this.Matches);
    }   
};

var Game = function() {   
    this.self = this;
    
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
    
    this.BindEvents = function() {
        $("#btnStartOver").click(jQuery.proxy(function(event) {
            // reset everything
            ScoreBoard.reset();
            
            // creates a new board
            this.CreateCards();
            this.CreateBoard();
            
            // hides the overlay
            $(".overlay").hide();
        }, this));
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
            console.log("match");
            
            $("#card_" + this.firstFlippedCard).addClass("openned");
            $("#card_" + this.secondFlippedCard).addClass("openned");
            
            ScoreBoard.updateMatches();
        } else {
            // flip back
            console.log("not match");
            
            this.FlipCard(this.firstFlippedCard, false);
            this.FlipCard(this.secondFlippedCard, false);
            
            ScoreBoard.updateAttempts();
        }
        
        // reset selection
        this.firstFlippedCard = -1;
        this.secondFlippedCard = -1;
        
        // checks if the game is over
        if(ScoreBoard.Matches == (this.cards.length/2)) {
            $(".overlay").show();
        }
    };
    
    this.CreateBoard = function() {
        var self = this;
        
        // clean the board
        $(this.boardContainer).empty();
        
        for(var i = 0; i < this.qntCards; i++) {
            $(this.boardContainer).append("<div class='col-xs-2 col-md-2 item hided' id='card_"+ i +"'></div>");            
            
            $(this.boardContainer + " #card_" + i).click(jQuery.proxy(function(event) {
                var cardId = event.target.id;
                var cardIdNum = parseInt(cardId.split("_")[1]);
                
                if(!$(event.target).hasClass("openned")) {
                    if(this.firstFlippedCard == -1) {
                        this.firstFlippedCard = cardIdNum;
                        this.FlipCard(this.firstFlippedCard, true);
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
            }, this));
        }        
    };
    
    this.Init = function(bc) {
        this.boardContainer = bc;   
        
        this.BindEvents();
        this.CreateCards();
        this.CreateBoard();
    };
}

// init the game
new Game().Init(".game-board .rows .cards");