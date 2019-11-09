$(document).ready(function(){
	var vm = new Vue({
		el: '#puzzle'
	});

});

Vue.component('container',{
	template: "" +
		"<div>" +
			"<div class='vue-container-title'>" +
				"<p class='title'>Sliding Puzzle</p>" +
			"</div>" +
			"<div class='vue-container-puzzles'>" +
				"<div :class='[container, image]'>" +
					"<div v-for='(item, index) in tilePosition' :class='[tilesClass, tilePosition[index], backgroundPosition[index], movingClass[index]]' :id='idNumber[index]'></div>" +
				"</div>" +
				"<div class='vue-container-puzzles__goal'>" +
					"<p class='title-goal'>{{goal}}</p>" +
					"<div :class='[container, image, goal]'>" +
						"<div v-for='(item, index) in reorderPosition' :class='[tilesClass, reorderPosition[index], backgroundPosition[index]]' :id='idNumber[index]'></div>" +
					"</div>" +
					"<div class='vue-puzzle__button-shuffle'>" +
						"<button @click='shuffle'>Shuffle tiles</button>" +
						"<button @click='randomImage'>Random Image</button>" +
					"</div>" +
					"<div class='vue-puzzle__button-solution'>" +
						"<button @click='solve'>Solution</button>" +
					"</div>" +
				"</div>" +
			"</div>" +
			"<div class='vue-overlay'></div>" +
				"<div class='vue-alert-container display-none'>" +
					"<div class='vue-alert-content'>" +
						"<p class='vue-alert-message'>You Win!</p>" +
						"<button @click='newGame'>Start a new puzzle</button>" +
					"</div>" +
				"</div>" +
			"</div>" +
		"</div>",
	data() {
		return{
			container: 'vue-puzzle__container',
			goal: 'goal',
			image: [],
			tilesClass: 'vue-puzzle__tiles vue-puzzle__bg-image',
			classImage: ['vue-puzzle__container--image-uno', 'vue-puzzle__container--image-due', 'vue-puzzle__container--image-tre', 'vue-puzzle__container--image-quattro', 'vue-puzzle__container--image-cinque', 'vue-puzzle__container--image-sei'],
			idNumber: ['tileNumber1','tileNumber2','tileNumber3','tileNumber4','tileNumber5','tileNumber6','tileNumber7','tileNumber8','tileNumber9'],
			tilePosition: [],
			reorderPosition: ['top0 left0', 'top0 left100', 'top0 left200', 'top100 left0', 'top100 left100', 'top100 left200', 'top200 left0', 'top200 left100', 'top200 left200'],
			backgroundPosition: ['background-position1', 'background-position2', 'background-position3', 'background-position4', 'background-position5', 'background-position6', 'background-position7', 'background-position8', 'background-position9'],
			movingClass: ['vue-puzzle__tilestomove', 'vue-puzzle__tilestomove', 'vue-puzzle__tilestomove', 'vue-puzzle__tilestomove', 'vue-puzzle__tilestomove', 'vue-puzzle__tilestomove', 'vue-puzzle__tilestomove', 'vue-puzzle__tilestomove', 'empty']
		}
	},
	created(){
		this.shuffle();
		this.image = 'vue-puzzle__container--image-uno';

	},
	mounted(){
		this.$nextTick(function (){
			var $this = this;
			this.getCoordinateTiles();
			$('.vue-puzzle__tilestomove').each(function(){
				var tileToMove = $(this)[0];
				$this.moveTile(tileToMove);
			});
		});
	},
	updated(){
		this.$nextTick(function (){
			this.getCoordinateTiles();
			this.checkCorrectPosition();
		});
	},
	methods: {
		shuffle: function() {
			this.tilePosition = _.shuffle(this.reorderPosition);
		},
		randomImage: function(){
			this.shuffle();
			var newImage= this.classImage[Math.floor(Math.random()*this.classImage.length)];
			while (this.image === newImage) {
				newImage = this.classImage[Math.floor(Math.random()*this.classImage.length)];
			}
			this.image = newImage;
		},
		newGame: function(){
			this.randomImage();

			$('.vue-overlay').removeClass('x-active');
			$('.vue-alert-container').removeClass('x-active');

			setTimeout(function(){
				$('.vue-alert-container').addClass('display-none');
				$('.vue-overlay').addClass('display-none');
			}, 700);
		},
		solve: function () {
			this.tilePosition = this.reorderPosition;
		},
		getCoordinateTiles: function () {
			window.empty = $('#tileNumber9');
			var	emptyClasses = empty.attr('class').split(' ');

			var	emptyTopClass = $.grep(emptyClasses, function(item, index) {
				return item.indexOf('top') === 0;
			});
			var topNumber = emptyTopClass.toString().slice(3);
			window.topCoordinate = parseInt(topNumber, 10);
			window.classTop = 'top' + topCoordinate;

			var	emptyLeftClass = $.grep(emptyClasses, function(item, index) {
				return item.indexOf('left') === 0;
			});
			var leftNumber = emptyLeftClass.toString().slice(4);
			window.leftCoordinate = parseInt(leftNumber, 10);
			window.classLeft = 'left' + leftCoordinate;
		},
		updateTiles: function(el, movingTile, emptyTile){
			if($(el).hasClass(movingTile) && empty.hasClass(emptyTile)){
				var movingTileIndex = this.tilePosition.indexOf(movingTile);
				var emptyTileIndex = this.tilePosition.indexOf(emptyTile);

				Vue.set(this.tilePosition, movingTileIndex, emptyTile);
				Vue.set(this.tilePosition, emptyTileIndex, movingTile);

				vm.$forceUpdate();

				this.getCoordinateTiles();
				this.checkCorrectPosition();
				this.alertEndGame();
			}
		},
		swipeVerticale: function(tile, n){
			var topCoordinateMovingTile = topCoordinate + n,
				classTopMovingTile = 'top' + topCoordinateMovingTile,
				classesMovingTile = classTopMovingTile + ' ' + classLeft,
				classesEmptyTile = classTop + ' ' + classLeft;

			this.updateTiles(tile, classesMovingTile, classesEmptyTile);
		},
		swipeLaterale: function(tile, n){
			var leftCoordinateMovingTile = leftCoordinate + n,
				classLeftMovingTile = 'left' + leftCoordinateMovingTile,
				classesMovingTile = classTop + ' ' + classLeftMovingTile,
				classesEmptyTile = classTop + ' ' + classLeft;

			this.updateTiles(tile, classesMovingTile, classesEmptyTile);
		},
		moveTile: function(el){
			var tileToMove = new Hammer.Manager(el),
				swipe = new Hammer.Swipe(),
				$this = this;

			tileToMove.add(swipe);

			tileToMove.on('swiperight', function(){
				$this.swipeLaterale(el, -100);
			});
			tileToMove.on('swipeleft', function(){
				$this.swipeLaterale(el, 100);
			});
			tileToMove.on('swipedown', function(){
				$this.swipeVerticale(el, -100);
			});
			tileToMove.on('swipeup', function(){
				$this.swipeVerticale(el, 100);
			});
		},
		arraysEqual: function(arr1, arr2) {
			var is_same = arr1.every(function(element, index) {
				return element === arr2[index];
			});

			if(is_same === false){
				$('#tileNumber9').addClass('empty');
			} else{
				$('#tileNumber9').removeClass('empty');
			}
		},
		alertEndGame: function(){
			var hasClassEmpty = $('#tileNumber9').hasClass('empty');
			if(hasClassEmpty === false){
				$('.vue-alert-container').removeClass('display-none');
				$('.vue-overlay').removeClass('display-none');

				setTimeout(function(){
					$('.vue-overlay').addClass('x-active');
					$('.vue-alert-container').addClass('x-active');
				}, 700);
			}
		},
		checkCorrectPosition: function () {
			var $this = this;
			this.tilePosition.length = 0;

			for(let i=0; i < this.idNumber.length; i++){
				var element = $('#' + $this.idNumber[i]);
				var elementClasses = element.attr('class').split(' ');
				var	elementLeftClass = $.grep(elementClasses, function(item, index) {
					return item.indexOf('left') === 0;
				});
				var	elementTopClass = $.grep(elementClasses, function(item, index) {
					return item.indexOf('top') === 0;
				});
				this.tilePosition[i] = elementTopClass + ' ' + elementLeftClass;
			}


			this.arraysEqual(this.tilePosition, this.reorderPosition);
		}
	}
});