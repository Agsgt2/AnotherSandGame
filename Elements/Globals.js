SpaceTode`

origin @
change @ (self) => self

given ! (atom, self) => atom !== self

symbol _ Empty
symbol x Void
symbol * Void

given . (element) => element !== Void
keep .

given # (element) => element !== Empty && element !== Void

given $ (element, Self) => element === Self
change $ (Self) => new Self()

given ? (element) => element !== Void
select ? (atom) => atom
change ? (selected) => selected


given < (self) => self.continue === false
given > (self) => self.continue === true
keep < (self) => self.continue = false
keep > (self) => self.continue = true

`
