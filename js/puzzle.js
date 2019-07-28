$(document).ready(function(){
	var puzzle = new Vue({
		el: '#puzzle'
	});

});

Vue.component('container',{
	template: "" +
		"<div>" +
			"<div class='vue-container-title'>" +
				"<p class='title'>Sliding Puzzle</p>" +
			"</div>" +
			"<div :class='[container, image]'>" +
				"<div v-for='(item, index) in tilePosition' :class='[tilesClass, tilePosition[index], backgroundPosition[index], movingClass[index]]' :id='idNumber[index]'></div>" +
			"</div>" +
			"<div class='vue-puzzle__button-shuffle'>" +
				"<button @click='shuffle'>Shuffle tiles</button>" +
				"<button @click='randomImage'>Random Image</button>" +
			"</div>" +
			"<div class='vue-puzzle__button-solution'>" +
				"<button @click='solve'>Solution</button>" +
			"</div>" +
			"<div class='vue-overlay'></div>" +
				"<div class='vue-alert-container'>" +
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
			image: [],
			tilesClass: 'vue-puzzle__tiles vue-puzzle__bg-image',
			classImage: ['vue-puzzle__container--image-uno', 'vue-puzzle__container--image-due', 'vue-puzzle__container--image-tre', 'vue-puzzle__container--image-quattro', 'vue-puzzle__container--image-cinque', 'vue-puzzle__container--image-cinque'],
			idNumber: ['tileNumber1','tileNumber2','tileNumber3','tileNumber4','tileNumber5','tileNumber6','tileNumber7','tileNumber8','tileNumber9'],
			tilePosition: ['top0 left0', 'top0 left100', 'top0 left200', 'top100 left0', 'top100 left100', 'top100 left200', 'top200 left0', 'top200 left100', 'top200 left200'],
			reorderPosition: ['top0 left0', 'top0 left100', 'top0 left200', 'top100 left0', 'top100 left100', 'top100 left200', 'top200 left0', 'top200 left100', 'top200 left200'],
			backgroundPosition: ['background-position1', 'background-position2', 'background-position3', 'background-position4', 'background-position5', 'background-position6', 'background-position7', 'background-position8', 'background-position9'],
			movingClass: ['vue-puzzle__tilestomove', 'vue-puzzle__tilestomove', 'vue-puzzle__tilestomove', 'vue-puzzle__tilestomove', 'vue-puzzle__tilestomove', 'vue-puzzle__tilestomove', 'vue-puzzle__tilestomove', 'vue-puzzle__tilestomove', 'empty']
		}
	},
	created(){
		this.tilePosition = _.shuffle(this.tilePosition);
		this.image = 'vue-puzzle__container--image-uno';

	},
	mounted(){
		this.$nextTick(function (){
			var $this = this;
			$('.vue-puzzle__tilestomove').each(function(){
				var tileToMove = $(this)[0];
				$this.moveTile(tileToMove);
			});
			this.getLeftCoordinate();
			this.getTopCoordinate();
		});
	},
	updated: function(){
		this.$nextTick(function (){
			this.getLeftCoordinate();
			this.getTopCoordinate();
			this.checkCorrectPosition();
		});
	},
	methods: {
		shuffle: function() {
			this.tilePosition = _.shuffle(this.reorderPosition);
		},
		randomImage: function(){
			this.tilePosition = _.shuffle(this.tilePosition);
			var newImage= this.classImage[Math.floor(Math.random()*this.classImage.length)];
			while (this.image === newImage) {
				newImage = this.classImage[Math.floor(Math.random()*this.classImage.length)];
			}
			this.image = newImage;
		},
		newGame: function(){
			this.shuffle();
			this.randomImage();
			$('.vue-overlay').removeClass('x-active');
			$('.vue-alert-container').removeClass('x-active');
		},
		solve: function () {
			this.tilePosition = this.reorderPosition;
		},
		moveTile: function(el){
			var tileToMove = new Hammer.Manager(el),
				swipe = new Hammer.Swipe(),
				$this = this;

			tileToMove.add(swipe);

			tileToMove.on('swiperight', function(){
				var leftCoordinateMovingTile = leftCoordinate - 100,
					classLeftMovingTile = 'left' + leftCoordinateMovingTile,
					classLeftEmptyTile = 'left' + leftCoordinate,
					classTop = 'top' + topCoordinate,
					classesMovingTile = classTop + ' ' + classLeftMovingTile,
					classesEmptyTile = classTop + ' ' + classLeftEmptyTile;

				if($(el).hasClass(classesMovingTile) && empty.hasClass(classesEmptyTile)){
					$(el).removeClass(classesMovingTile).addClass(classesEmptyTile);
					empty.removeClass(classesEmptyTile).addClass(classesMovingTile);

					$this.checkCorrectPosition();
					$this.alertEndGame();
					$this.getLeftCoordinate();
					$this.getTopCoordinate();
				}
			});
			tileToMove.on('swipeleft', function(){
				var leftCoordinateMovingTile = leftCoordinate + 100,
					classLeftMovingTile = 'left' + leftCoordinateMovingTile,
					classLeftEmptyTile = 'left' + leftCoordinate,
					classTop = 'top' + topCoordinate,
					classesMovingTile = classTop + ' ' + classLeftMovingTile,
					classesEmptyTile = classTop + ' ' + classLeftEmptyTile;

				if($(el).hasClass(classesMovingTile) && empty.hasClass(classesEmptyTile)){
					$(el).removeClass(classesMovingTile).addClass(classesEmptyTile);
					empty.removeClass(classesEmptyTile).addClass(classesMovingTile);

					$this.checkCorrectPosition();
					$this.alertEndGame();
					$this.getLeftCoordinate();
					$this.getTopCoordinate();
				}
			});
			tileToMove.on('swipedown', function(){
				var topCoordinateMovingTile = topCoordinate - 100,
					classTopMovingTile = 'top' + topCoordinateMovingTile,
					classTopEmptyTile = 'top' + topCoordinate,
					classLeft = 'left' + leftCoordinate,
					classesMovingTile = classTopMovingTile + ' ' + classLeft,
					classesEmptyTile = classTopEmptyTile + ' ' + classLeft;

				if($(el).hasClass(classesMovingTile) && empty.hasClass(classesEmptyTile)){
					$(el).removeClass(classesMovingTile).addClass(classesEmptyTile);
					empty.removeClass(classesEmptyTile).addClass(classesMovingTile);

					$this.checkCorrectPosition();
					$this.alertEndGame();
					$this.getLeftCoordinate();
					$this.getTopCoordinate();
				}
			});
			tileToMove.on('swipeup', function(){
				var topCoordinateMovingTile = topCoordinate + 100,
					classTopMovingTile = 'top' + topCoordinateMovingTile,
					classTopEmptyTile = 'top' + topCoordinate,
					classLeft = 'left' + leftCoordinate,
					classesMovingTile = classTopMovingTile + ' ' + classLeft,
					classesEmptyTile = classTopEmptyTile + ' ' + classLeft;

				if($(el).hasClass(classesMovingTile) && empty.hasClass(classesEmptyTile)){
					$(el).removeClass(classesMovingTile).addClass(classesEmptyTile);
					empty.removeClass(classesEmptyTile).addClass(classesMovingTile);

					$this.checkCorrectPosition();
					$this.alertEndGame();
					$this.getLeftCoordinate();
					$this.getTopCoordinate();
				}
			});
		},
		getLeftCoordinate: function(){
			window.empty = $('#tileNumber9');
			var emptyClasses = empty.attr('class').split(' ');
			var	emptyLeftClass = $.grep(emptyClasses, function(item, index) {
				return item.indexOf('left') === 0;
			});
			var leftNumber = emptyLeftClass.toString().slice(4);
			window.leftCoordinate = parseInt(leftNumber, 10);
		},
		getTopCoordinate: function () {
			window.empty = $('#tileNumber9');
			var	emptyClasses = empty.attr('class').split(' ');
			var	emptyTopClass = $.grep(emptyClasses, function(item, index) {
				return item.indexOf('top') === 0;
			});
			var topNumber = emptyTopClass.toString().slice(3);
			window.topCoordinate = parseInt(topNumber, 10);
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
				$('.vue-overlay').addClass('x-active');
				$('.vue-alert-container').addClass('x-active');
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