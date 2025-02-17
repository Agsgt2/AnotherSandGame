SpaceTode`

element SquishSand {

	colour "#ffcc00"
	emissive "#ffa34d"
	category "Weird"
	symbol D SquishSand.Double
	symbol S SquishSand.Single
	@ => D

	element Double any(xz) {
		//default true
		//category "Structure"
		colour "#ffa34d"
		emissive "#ffa34d"

		@ => _
		_    @

		 @  =>  _
		_ _    S S

		@  => _
		 _     @
		
		 @ =>  _
		_     @

		_ => S
		@    S

	}

	element Single any(xz) {
		colour "#ffcc00"
		emissive "#ffa34d"

		@ => _
		_    @

		_    .
		@ => _
		$    D

		@ => D
		D    @

		 @  =>  .
		_ _    . .
		
		 @  =>  .
		$ $    . .

		@  => D
		 D     @
		
		 @ =>  D
		D     @

		@  => _
		 _     @
		
		 @ =>  _
		_     @

	}

}

element Rainblock {

	category "Weird"

	// Setup
	{
		data init false
		given i (self) => !self.init
		keep i (self, origin) => {
			self.init = true
			const hue = Math.floor(Math.random() * 360)
			const colour = new THREE.Color("hsl("+hue+", 100%, 50%)")
			self.colour.r = Math.round(colour.r * 255)
			self.colour.g = Math.round(colour.g * 255)
			self.colour.b = Math.round(colour.b * 255)
			self.emissive.r = Math.round(colour.r * 255)
			self.emissive.g = Math.round(colour.g * 255)
			self.emissive.b = Math.round(colour.b * 255)
			SPACE.update(origin)
		}
		i => i
	}

	// Move
	{
		given R (self, element, atom) => element === Rainblock && atom.colour.r > self.colour.r
		select R (atom) => atom
		change R (selected) => selected
		@R => R@

		
		/*given r (self, element, atom) => element === Rainblock && atom.colour.r < self.colour.r
		select r (atom) => atom
		change r (selected) => selected
		r@ => @r*/

		pov(right) {
			given G (self, element, atom) => element === Rainblock && atom.colour.g > self.colour.g
			select G (atom) => atom
			change G (selected) => selected
			@G => G@

			
			/*given g (self, element, atom) => element === Rainblock && atom.colour.g < self.colour.g
			select g (atom) => atom
			change g (selected) => selected
			g@ => @g*/
		}

		given B (self, element, atom) => element === Rainblock && atom.colour.b > self.colour.b
		select B (atom) => atom
		change B (selected) => selected
		B => @
		@    B

		
		/*given b (self, element, atom) => element === Rainblock && atom.colour.b < self.colour.b
		select b (atom) => atom
		change b (selected) => selected
		@ => b
		b    @*/

		/*@ => _
		_    @*/

		any(xyz.directions) {
			@_ => _@
		}
	}

}

element CrystalOld {
	
	category "Weird"
	colour "lightblue"
	emissive "blue"

	maybe(1/100) any(xz.directions) {
		.....    $...$
		..@.. => ..$..
		.....    $...$
	}
		
	

}

element Brancher {
	category "Weird"

	@ => _
	_    @

	symbol G Brancher.Grower
	symbol S Sand

	@ => G
	*    .

	@ => _

	element Grower {

		colour "rgb(70, 255, 128)"
		colour "rgb(35, 200, 100)"

		G => .
		@    .

		all(xz.directions) {
			 G =>  .
			@     .
		}

		maybe(0.3) any(xz.directions) {
			_@_ => $.$
		}
		
		/*maybe(0.3) any(xz.directions) {
			_ _ => $ $
			 @      .
		}*/

		/*any(xz.directions) {
			 _ =>  $
			@     .
		}*/

		maybe(1/20) {
			_ => $
			@    .
		}

	}

}

element Labyrinth {
	category "Weird"
	
	data countBuffer 0

	// Reset buffer
	keep r (self) => self.countBuffer = 0
	action @ => r

	// Count neighbours
	given c (element, Self, self) => {
		if (element === Self) self.countBuffer++
		return true
	}

	action {
		ccc    ...
		c@c => ...
		ccc    ...
	}

	pov(right) action {
		ccc    ...
		c@c => ...
		ccc    ...
	}

	pov(top) action {
		ccc    ...
		c@c => ...
		ccc    ...
	}

	// Die
	given d (self) => self.countBuffer > 4
	d => _
	
	// Grow
	origin g
	given g (self) => self.countBuffer === 2
	for(xyz.directions) g_ => .$

}

element SparkLife {
	category "Weird"
	colour "rgb(255, 255, 70)"
	data countBuffer 0
	
	// Reset buffer
	keep r (self) => self.countBuffer = 0
	action @ => r

	// Count neighbours
	given c (element, Self, self) => {
		if (element === Self) self.countBuffer++
		return false
	}

	all(xyz.others) @c => ..

	// Die
	given d (self) => self.countBuffer >= 5 || self.countBuffer <= 2
	d => _
	
	// Grow
	origin g
	given g (self) => self.countBuffer >= 0 && self.countBuffer <= Infinity
	for(xyz.directions) g_ => .$

}

element GameOfLife {
	category "Weird"
	//category "Video"
	colour "brown"

	// Globals
	symbol D GameOfLife.Dead
	symbol A GameOfLife.Alive

	// Setup: Fill up the universe
	all(xy.directions) @_ => @$
	
	// Then become a dead or alive space
	maybe(0.9) @ => D
	@ => A

	element Dead {
		opacity 1
		//visible false
		colour "white"
		emissive "grey"
		data tally 0
		//category "Video"

		// Reset tally
		keep r (self) => self.tally = 0
		action @ => r

		// Count alive neighbours
		given a (self, element) => {
			if (element === GameOfLife.Alive) {
				self.tally++
			}
			return false
		}
		action {
			aaa    ...
			a@a => ...
			aaa    ...
		}

		// Live!
		given l (self) => self.tally === 3
		l => A
	}

	element Alive {
		//category "Video"
		prop override true
		data tally 0
		colour "grey"
		emissive "black"

		// Reset tally
		keep r (self) => self.tally = 0
		action @ => r

		// Count alive neighbours
		given a (self, element) => {
			if (element === GameOfLife.Alive) {
				self.tally++
			}
			return false
		}
		action {
			aaa    ...
			a@a => ...
			aaa    ...
		}

		// Survive
		given s (self) => self.tally >= 2 && self.tally <= 3
		s => .

		// Die
		@ => D

	}

}


element SpreadWater {
	category "Weird"
	//category "Video"
	data direction 0
	colour "lightblue"
	emissive "blue"
	opacity 1
	
	prop state LIQUID
	prop temperature COOL
	@ => _
	_    @
	
	for(xz.directions) {
		@  => _
		 _     @
	}
	
	given D (self, transformationNumber, element) => element === Empty && self.direction === transformationNumber
	all(xz.directions) {
		@D => _@
	}
	
	keep N (self) => self.direction = Math.floor(Math.random() * 4)
	@ => N
}



element MomentumSand {
	category "Weird"
	//category "Video"
	emissive "#ffa34d"
	colour "#fc0"
	data movement 0
	
	keep g (self) => {
		self.movement += 0.05
		if (self.movement > 1) self.movement = 1
	}
	action {
		@ => g
		_    .
	}
	
	given F (element, self) => {
		if (element !== Empty && element !== SpreadWater) return false
		return self.movement > 2/3
	}
	select F (atom) => atom
	change F (selected) => selected
	
	given f (element, self) => {
		if (element !== Empty && element !== SpreadWater) return false
		return self.movement > 1/3
	}
	select f (atom) => atom
	change f (selected) => selected
	@ => _
	_    F
	F    @
	
	@ => f
	f    @
	
	given b (Self, element) => element === Self
	keep b (atom, self) => {
		if (atom.movement < self.movement) {
			atom.movement = self.movement
		}
	}
	action {
		@ => .
		b    b
	}
	
	given s (element, self) => {
		if (element !== Empty && element !== SpreadWater) return false
		return self.movement > 0.3
	}
	select s (atom) => atom
	change s (selected) => selected
	
	change m (self) => {
		self.movement -= 0.2
		if (self.movement < 0) self.movement = 0
		return self
	}
	
	
	any(xz.directions) {
		@  => s
		 s     m
	}
	
}

`;
