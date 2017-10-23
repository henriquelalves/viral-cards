import Carta from '../objects/carta';

const MENU_SPLASH = 0;
const MENU_INSTRUCTIONS = 1;
const MENU_GAME = 2;

class Menu extends Phaser.State {

    constructor() {
	super();
    }
    
    create() {
	this.state = MENU_SPLASH;
	this.game_state = 0;
	
	// Create splash
	this.background = this.game.add.image(this.game.width/2.0,this.game.height/2.0,'background-splash');
	let background_scale = Math.max(this.game.width/this.background.width, this.game.height/this.background.height);
	this.background.scale.set(background_scale);
	this.background.anchor.set(0.5);
	
	this.table = this.game.add.image(this.game.width/2.0, this.game.height*1.32, 'table');
	this.table.anchor.set(0.5);
	this.table.scale.setTo((this.game.width*1.1)/this.table.width, (this.game.height*1.1)/this.table.height);
	
	this.me = this.game.add.image(this.game.width*1.5, this.game.height/2.0,'me');
	this.me.scale.set(0.6);
	this.me.anchor.set(0.5);

	// Title
	this.title = this.game.add.text(this.game.width*0.5,20.0,'Viral Cards', {font:'200px GreatVibes', fill: '#ffffff'});
	this.title.scale.set(this.game.width*0.8/this.title.width);
	this.title.anchor.setTo(0.5,0.0);
	this.title.alpha = 0.0;
	this.title.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
	
	this.subtitle = this.game.add.text(this.game.width*0.5,this.title.height-50,'by Henrique Alves', {font:'200px GreatVibes', fill: '#ffffff'});
	this.subtitle.scale.set(this.game.width*0.5/this.title.width);
	this.subtitle.anchor.setTo(0.5,0.0);
	this.subtitle.alpha = 0.0;
	this.subtitle.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);

	this.swipe_label = this.game.add.text(this.game.width*0.5,this.game.height*0.7 + 20,'Swipe up to continue', {font:'200px GreatVibes', fill: '#ffffff'});
	this.swipe_label.scale.set(this.game.width*0.4/this.title.width);
	this.swipe_label.anchor.setTo(0.5,0.0);
	this.swipe_label.alpha = 0.0;
	this.swipe_label.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
	
	// Initial animation
	this.game.add.tween(this.me).to({x:this.game.width*0.5}, 1000, Phaser.Easing.Cubic.Out, true, 1000);
	this.game.add.tween(this.title).to({y:0.0, alpha: 0.8}, 500, Phaser.Easing.Linear.None, true, 3000);
	this.game.add.tween(this.subtitle).to({y:this.title.height-70, alpha: 0.8}, 500, Phaser.Easing.Linear.None, true, 5000);
	this.game.add.tween(this.swipe_label).to({y:this.game.height*0.7, alpha: 0.8}, 500, Phaser.Easing.Linear.None, true, 6500);
	
	this.audio_viral_cards = this.game.add.audio('viral-cards');
	this.audio_by = this.game.add.audio('by-henrique-alves');
	this.audio_lost = this.game.add.audio('hit-me-baby');
	this.audio_lost_by = this.game.add.audio('britney');
	this.audio_won = this.game.add.audio('tiger');
	this.audio_won_by = this.game.add.audio('survivor');
	this.audio_flap = this.game.add.audio('flap');
	this.audio_flapflapflap = this.game.add.audio('flapflapflap');
	this.audio_switch = this.game.add.audio('switch');
	
	this.timer = this.game.time.create();
	this.timer.add(3000, function(){this.audio_viral_cards.play()}, this);
	this.timer.add(5000, function(){this.audio_by.play()}, this);
	this.timer.add(7000, function(){
	    // Swipe
	    this.game.swipeManager.swipeUp.add(this.swipeUp, this);
	}, this);
	this.timer.start();

	// Cards
	this.cartas = this.game.add.group();
	this.cartas_array = [];
	
	// Hands
	this.mao_esquerda = this.game.add.image(this.game.width*0.2, -700,'mao');
	this.mao_esquerda.anchor.setTo(0.5,0.0);

	this.mao_direita = this.game.add.image(this.game.width*0.8, -700, 'mao');
	this.mao_direita.anchor.setTo(0.5,0.0);
	this.mao_direita.scale.setTo(-1.0,1.0);

	// Instructions
	this.instructions_title = this.game.add.text(this.game.width*0.5,20.0,'Instructions', {font:'200px GreatVibes', fill: '#ffffff'});
	this.instructions_title.scale.set(this.game.width*0.6/this.instructions_title.width);
	this.instructions_title.anchor.setTo(0.5,0.0);
	this.instructions_title.alpha = 0.0;
	this.instructions_title.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
	this.instructions = this.game.add.text(this.game.width*0.5, this.instructions_title.y+this.instructions_title.height,
					       '1- Every turn, you turn a card and swap its place with an adjacent card.\n2- The game ends when all cards are face up.\n3- You win if there is no skull card next to a dude card!\nClick anywhere to continue!', {font:'200px GreatVibes', fill: '#ffffff'});
	this.instructions.scale.set(this.game.width*0.8/this.instructions.width);
	this.instructions.anchor.setTo(0.5,0.0);
	this.instructions.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
	this.instructions.alpha = 0.0;

	this.won_quote = this.game.add.text(this.game.width*0.5,this.game.height*0.4,'"It\'s the eye of the tiger,\nIt\'s the thrill of the fight,\nRising up to the challenge of our rival."', {font:'200px GreatVibes', fill: '#ffffff'});
	this.won_quote.scale.set(this.game.width*0.6/this.won_quote.width);
	this.won_quote.anchor.setTo(0.5,0.5);
	this.won_quote.alpha = 0.0;
	this.won_quote.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
	this.won_quote_by = this.game.add.text(this.game.width*0.6,this.game.height*0.72,'- Survivor.', {font:'200px GreatVibes', fill: '#ffffff'});
	this.won_quote_by.scale.set(this.game.width*0.3/this.won_quote_by.width);
	this.won_quote_by.anchor.setTo(0.5,0.5);
	this.won_quote_by.alpha = 0.0;
	this.won_quote_by.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);

	this.lost_quote = this.game.add.text(this.game.width*0.5,this.game.height*0.4,'"Hit me baby one more time."', {font:'200px GreatVibes', fill: '#ffffff'});
	this.lost_quote.scale.set(this.game.width*0.6/this.lost_quote.width);
	this.lost_quote.anchor.setTo(0.5,0.5);
	this.lost_quote.alpha = 0.0;
	this.lost_quote.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
	this.lost_quote_by = this.game.add.text(this.game.width*0.6,this.game.height*0.62,'- Britney Spears.', {font:'200px GreatVibes', fill: '#ffffff'});
	this.lost_quote_by.scale.set(this.game.width*0.3/this.lost_quote_by.width);
	this.lost_quote_by.anchor.setTo(0.5,0.5);
	this.lost_quote_by.alpha = 0.0;
	this.lost_quote_by.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);

	
	this.ititle_tween = null;
	this.i_tween = null;
	
	// Events
	this.input.onDown.add(this.startGame, this);
	this.current_card = null;
	this.cards_up = 0;
    }
    
    update() {}

    unflipAll() {
	this.audio_flapflapflap.play();
	for(var i = 0; i < this.cartas_array.length; i++){
	    if(this.cartas_array[i].frontUp)
		this.cartas_array[i].flip(false, true);
	}
    }

    joinAndShuffle(){
	this.game.add.tween(this.mao_esquerda).to({angle:-10, x:this.game.width*0.4, y:-100}, 1000, Phaser.Easing.Cubic.Out, true, 500);
	this.game.add.tween(this.mao_direita).to({angle:10, x:this.game.width*0.6, y:-100}, 1000, Phaser.Easing.Cubic.Out, true, 500);
	this.audio_switch.play();
	for(var i = 0; i < this.cartas.children.length; i++){
	    this.game.add.tween(this.cartas.children[i]).to({angle: 0, x:this.game.width*0.5,y:this.game.height*0.5}, 1000, Phaser.Easing.Cubic.Out, true);
	}
	let array = [];
	let pos = [0,0]
	while(this.cartas_array.length > 0){
	    let rand = Math.floor(Math.random()*this.cartas_array.length);
	    array.push(this.cartas_array.splice(rand, 1)[0]);
	    array[array.length-1].grid_pos[0] = pos[0];
	    array[array.length-1].grid_pos[1] = pos[1];

	    pos[1] += 1;
	    if(pos[1] === 3){
		pos[1] = 0;
		pos[0] += 1;
	    }
	}
	this.cartas_array = array;
    }
    
    shareCards() {
	this.game.add.tween(this.mao_esquerda).to({y:-20, angle:30, x:this.game.width*0.2}, 1000, Phaser.Easing.Cubic.Out, true,1200);
	this.game.add.tween(this.mao_direita).to({y:-20, angle:-30, x:this.game.width*0.8}, 1000, Phaser.Easing.Cubic.Out, true, 1200);
	
	let offsetx = (this.game.width - (this.game.width*0.16*3))/2;
	let offsety = (this.game.height - (this.game.height*0.3*2))/2;
	for(var x = 0; x < 4; x++){
	    for(var y = 0; y < 3; y++){
		let carta = this.cartas_array[(x*3) + y];
		let rand_angle = (Math.random()*10) - 5;
		this.game.add.tween(carta).to({x:offsetx+this.game.width*0.16*(x), y:offsety+this.game.height*0.3*(y), angle: rand_angle}, 1000, Phaser.Easing.Cubic.Out, true, 1600 + 50*((x*3)+y));
	    }
	}
    }
    
    swipeUp () {
	if (this.state === MENU_SPLASH){
	    this.state = MENU_INSTRUCTIONS;
	    this.game.add.tween(this.me).to({y:-this.me.height/2.0}, 1000, Phaser.Easing.Quadratic.Out, true);
	    this.game.add.tween(this.table).to({y:this.game.height/2.0}, 800, Phaser.Easing.Quadratic.Out, true);
	    this.game.add.tween(this.background).to({y:-500}, 800, Phaser.Easing.Quadratic.Out, true);
	    this.game.add.tween(this.title).to({alpha:0.0}, 1000, Phaser.Easing.Linear.None, true);
	    this.game.add.tween(this.subtitle).to({alpha:0.0}, 1000, Phaser.Easing.Linear.None, true);
	    this.game.add.tween(this.swipe_label).to({alpha:0.0}, 1000, Phaser.Easing.Linear.None, true);
	    // this.game.add.tween(this.mao_direita).to({y:-20, angle:-30}, 1000, Phaser.Easing.Cubic.Out, true,1200);
	    // this.game.add.tween(this.mao_esquerda).to({y:-20, angle:30}, 1000, Phaser.Easing.Cubic.Out, true, 1200);

	    // Create cartas
	    for(var x = 0; x < 4; x++){
		for(var y = 0; y < 3; y++){
		    let frontside = 'card_tree';
		    if(x===0)
			frontside = 'card_dude';
		    else if(x===1)
			frontside = 'card_skull';
		    
		    var carta = new Carta(this.game, this.game.width*0.5, -200, frontside, 'card_back');
		    carta.grid_pos = [x, y];
		    carta.clicked.add(this.on_click, this);
		    carta.scale.set((this.game.height*0.3)/800);
		    carta.carta_type = frontside;
		    this.cartas.add(carta);
		    this.cartas_array.push(carta);
		}
	    }
	    // for(var i = 0; i < this.cartas.children.legth; i++){
	    // 	this.cartas.children[i].setFlippable();
	    // }
	    this.shareCards();

	    this.ititle_tween = this.game.add.tween(this.instructions_title).to({alpha:1.0}, 500, Phaser.Easing.Linear.None, true, 2000);
	    this.i_tween = this.game.add.tween(this.instructions).to({alpha:1.0}, 500, Phaser.Easing.Linear.None, true, 2000);
	}
    }

    startGame () {
	if (this.state === MENU_INSTRUCTIONS){

	    if (this.ititle_tween){
		this.ititle_tween.stop();
		this.i_tween.stop();
	    }

	    this.ititle_tween = this.game.add.tween(this.instructions_title).to({alpha:0.0},500, Phaser.Easing.Linear.None, true);
	    this.i_tween = this.game.add.tween(this.instructions).to({alpha:0.0},500, Phaser.Easing.Linear.None, true);
	    
	    this.newGame();
	}
    }

    on_click (c) {
	if (this.state = MENU_GAME){
	    if(this.game_state === 0){
		if(!c.frontUp){
		    this.cards_up += 1;
		    this.current_card = c;
		    this.current_card.flip();
		    this.audio_flap.play();
		    for(var i = 0; i < this.cartas_array.length; i++){
			this.cartas_array[i].unsetFlippable();
		    }
		    this.game_state = (this.game_state+1)%2;
		}
	    }
	    if(this.game_state === 1){
		let new_pos = c.grid_pos;
		let old_pos = this.current_card.grid_pos;
		if((new_pos[0] === old_pos[0] && new_pos[1] === old_pos[1] + 1) ||
		   (new_pos[0] === old_pos[0] && new_pos[1] === old_pos[1] - 1) ||
		   (new_pos[0] === old_pos[0] + 1 && new_pos[1] === old_pos[1]) ||
		   (new_pos[0] === old_pos[0] - 1 && new_pos[1] === old_pos[1])){
		    this.cardSwap (c, this.current_card);
		    this.game_state = (this.game_state+1)%2;
		    for(var i = 0; i < this.cartas_array.length; i++){
			this.cartas_array[i].setFlippable();
		    }

		    if(this.cards_up === 12){
			this.testWinning();
		    }
		}
	    }
	}
    }

    testWinning () {
	this.dict = {};
	this.dudes = []
	
	for(var i = 0; i < this.cartas_array.length; i++){
	    this.dict[''+this.cartas_array[i].grid_pos[0]+','+this.cartas_array[i].grid_pos[1]] = this.cartas_array[i];
	    if (this.cartas_array[i].carta_type === 'card_dude')
		this.dudes.push(this.cartas_array[i]);
	}

	let won = true;
	for(var i = 0; i < this.dudes.length; i++){
	    won = (this.notSkull(this.dudes[i].grid_pos[0]+1, this.dudes[i].grid_pos[1]) &&
		   this.notSkull(this.dudes[i].grid_pos[0]-1, this.dudes[i].grid_pos[1]) &&
		   this.notSkull(this.dudes[i].grid_pos[0], this.dudes[i].grid_pos[1]+1) &&
		   this.notSkull(this.dudes[i].grid_pos[0], this.dudes[i].grid_pos[1]-1));
	    if(won === false)
		break;
	}

	let temp_timer = this.game.time.create();
	
	if(won){
	    console.log("WON!");
	    temp_timer.add(1000, function(){
		this.game.add.tween(this.won_quote).to({alpha:1.0}, 1000, Phaser.Easing.Linear.None, true);
		this.audio_won.play();
	    }, this);
	    temp_timer.add(9000, function(){
		this.game.add.tween(this.won_quote_by).to({alpha:1.0}, 1000, Phaser.Easing.Linear.None, true);
		this.audio_won_by.play();
	    }, this);
	    temp_timer.add(12000, function(){
		this.game.add.tween(this.won_quote).to({alpha:0.0}, 1000, Phaser.Easing.Linear.None, true);
		this.game.add.tween(this.won_quote_by).to({alpha:0.0}, 1000, Phaser.Easing.Linear.None, true);
	    }, this);
	    temp_timer.add(13500, function(){
		this.newGame();
	    }, this);
	} else {
	    console.log("LOST!");
	    temp_timer.add(1000, function(){
		this.game.add.tween(this.lost_quote).to({alpha:1.0}, 1000, Phaser.Easing.Linear.None, true);
		this.audio_lost.play();
	    }, this);
	    temp_timer.add(5000, function(){
		this.game.add.tween(this.lost_quote_by).to({alpha:1.0}, 1000, Phaser.Easing.Linear.None, true);
		this.audio_lost_by.play();
	    }, this);
	    temp_timer.add(8000, function(){
		this.game.add.tween(this.lost_quote).to({alpha:0.0}, 1000, Phaser.Easing.Linear.None, true);
		this.game.add.tween(this.lost_quote_by).to({alpha:0.0}, 1000, Phaser.Easing.Linear.None, true);
	    }, this);
	    temp_timer.add(9500, function(){
		this.newGame();
	    }, this);
	}
	temp_timer.start();
    }

    strPos (c) {
	return (''+c.grid_pos[0]+','+c.grid_pos[1]);
    }
    
    notSkull (x, y) {
	if (x < 0 || x > 3 || y < 0 || y > 2){
	    return true;
	}
	
	if(this.dict[''+x+','+y].carta_type === 'card_skull'){
	    return false;
	}
	return true;
    }
    
    cardSwap (c1, c2){
	this.audio_switch.play();
	this.game.add.tween(c1).to({x: c2.x, y: c2.y}, 500, Phaser.Easing.Cubic.Out, true);
	this.game.add.tween(c2).to({x: c1.x, y: c1.y}, 500, Phaser.Easing.Cubic.Out, true);
	let temp = [c1.grid_pos[0], c1.grid_pos[1]];
	c1.grid_pos = c2.grid_pos;
	c2.grid_pos = temp;
    }
    
    newGame () {
	let temp_timer = this.game.time.create();
	temp_timer.add(1000, this.unflipAll, this);
	temp_timer.add(2000, this.joinAndShuffle, this);
	temp_timer.add(3000, this.shareCards, this);
	temp_timer.add(4000, function(){
	    for(var i = 0; i < this.cartas_array.length; i++){
		this.cartas_array[i].setFlippable();
	    }
	    this.state = MENU_GAME;
	    this.game_state = 0;
	    this.cards_up = 0;
	}, this);
	temp_timer.start();
    }
}

export default Menu;
