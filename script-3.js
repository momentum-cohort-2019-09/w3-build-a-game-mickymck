class Game {
    constructor(canvasId) {
        const canvas = document.getElementById(canvasId)
        this.screen = canvas.getContext("2d")
        this.size = { width: canvas.width, height: canvas.height }
        this.keyboard = new Keyboarder()
        this.gameOver = false

        this.bodies = []

        this.goodBodies = []

        let heroSize = {
            width: 20,
            height: 20
        }

        let heroLocation = {
            x: Math.floor(heroSize.width * 2),
            y: Math.floor(this.size.height * .5) - (heroSize.height / 2)
        }

        let superHeroSize = {
            width: 20,
            height: 20
        }

        let superHeroLocation = {
            x: Math.floor(this.size.width - (superHeroSize.width * 3)),
            y: Math.floor(this.size.height * .5) - (superHeroSize.height / 2)
        }

        let flagSize = {
            width: 20,
            height: 20
        }

        let flagLocation = {
            x: Math.floor(this.size.width - (flagSize.width * 3)),
            y: Math.floor(this.size.height * .5) - (flagSize.height / 2)
        }

        let homeBaseSize = {
            width: 20,
            height: 20
        }

        let homeBaseLocation = {
            x: Math.floor(flagSize.width * 3),
            y: Math.floor(this.size.height * .5) - (flagSize.height / 2)
        }

        let ghostSize = {
            width: 2,
            height: 2
        }

        let firstGhostLocation = {
            x: this.randomX(1000),
            y: this.randomY(500)
        }

        this.hero = new Hero(heroLocation, heroSize)
        this.addBody(this.hero)
        this.addGoodBody(this.hero)

        this.flag = new Flag(flagLocation, flagSize)
        this.addGoodBody(this.flag)

        this.ghost = new Ghost(firstGhostLocation, ghostSize)
        this.addBody(this.ghost)

        this.superHero = new SuperHero(superHeroLocation, superHeroSize)

        this.homeBase = new HomeBase(homeBaseLocation, homeBaseSize)
    }

    addBody(body) {
        this.bodies.push(body)
    }

    addGoodBody(goodBody) {
        this.goodBodies.push(goodBody)
    }

    randomX (max) {
        return Math.floor(Math.random() * Math.floor(max))
    }

    randomY (max) {
        return Math.floor(Math.random() * Math.floor(max))
    }

    addGhost () {
        let ghostLocation = {
            x: this.randomX(1000),
            y: this.randomY(500)
        }

        let ghostSize = {
            width: 2,
            height: 2
        }
        
        this.ghost = new Ghost(ghostLocation, ghostSize)

        this.addBody(this.ghost)
    }

    winTheGame () {
        this.youWin = new YouWin(0, 0, 1000, 500)
        this.addGoodBody(this.youWin)
    }

    run() {
        const tick = () => {
            this.update()
            this.draw()

            if (!this.gameOver) {
                requestAnimationFrame(tick)
            }
        }

        tick()
    }

    update() {
        
        for (let body of this.bodies) {
            body.update(this)

            if (Math.random() < .007) {
                this.addGhost()
            }

            if (crash(this.hero, body)) {
                this.gameOver = true
            }

            if (crash(this.superHero, body)) {
                this.gameOver = true
            }
        }

        for (let goodBody of this.goodBodies) {
            goodBody.update(this)

            // allows hero to turn superHero when he grabs the flag
            let heroHasNoFlag = (hero) => {
                return this.goodBodies.filter(function (flag) { return flagGrab(hero, flag) }).length === 0
            }
            this.goodBodies = this.goodBodies.filter(heroHasNoFlag)

            // if hero grabs the flag, and after hero has been removed from goodBodies once, and a homebase has already been added to the goodBodies array
            if ((flagGrab(this.hero, this.flag)) &&
                (this.bodies[this.bodies.length - 1] !== this.superHero) && 
                (this.goodBodies[0] !== this.homeBase)) {
                
                this.bodies.splice(0, 1)
                this.addBody(this.superHero)
                this.addGoodBody(this.homeBase)
            }

            // if he brings the flag home, he wins the game
            if (flagGrab(this.superHero, this.homeBase)) {
                this.winTheGame()
                this.gameOver = true
            }
        }
    }

    draw() {
        this.screen.fillStyle = "#423149"
        this.screen.fillRect(0, 0, 1000, 500)

        for (let body of this.bodies) {
            body.draw(this.screen)
        }

        for (let goodBody of this.goodBodies) {
            goodBody.draw(this.screen)
        }
    }
}

class Hero {
    constructor(location, size) {
        this.location = location
        this.size = size
    }

    update() {
        if (game.keyboard.isDown(Keyboarder.KEYS.LEFT) && (this.location.x >= 15)) {
            this.location.x -= 2
        }
        if (game.keyboard.isDown(Keyboarder.KEYS.RIGHT) && (this.location.x <= 985)) {
            this.location.x += 2
        }
        if (game.keyboard.isDown(Keyboarder.KEYS.UP) && (this.location.y >= 15)) {
            this.location.y -= 2
        }
        if (game.keyboard.isDown(Keyboarder.KEYS.DOWN) && (this.location.y <= 485)) {
            this.location.y += 2
        }
    }

    draw(screen) {
        screen.fillStyle = "#EEE11A"
        screen.fillRect(
            this.location.x - (this.size.width/2),
            this.location.y - (this.size.height/2),
            this.size.width, this.size.height)
    }
}

class SuperHero {
    constructor(location, size) {
        this.location = location
        this.size = size
    }


    update() {
        if (game.keyboard.isDown(Keyboarder.KEYS.LEFT) && (this.location.x >= 15)) {
            this.location.x -= 4
        }
        if (game.keyboard.isDown(Keyboarder.KEYS.RIGHT) && (this.location.x <= 985)) {
            this.location.x += 4
        }
        if (game.keyboard.isDown(Keyboarder.KEYS.UP) && (this.location.y >= 15)) {
            this.location.y -= 4
        }
        if (game.keyboard.isDown(Keyboarder.KEYS.DOWN) && (this.location.y <= 485)) {
            this.location.y += 4
        }
    }

    draw(screen) {
        screen.fillStyle = "#EEE11A"
        screen.fillRect(
            this.location.x - (this.size.width/2),
            this.location.y - (this.size.height/2),
            this.size.width, this.size.height)
        screen.fillStyle = "#8CD1EF"
        screen.fillRect(
            this.location.x,
            this.location.y - (this.size.height/2),
            this.size.width / 2, this.size.height / 2)
        screen.fillStyle = "#8CD1EF"
        screen.fillRect(
            this.location.x - (this.size.width/2),
            this.location.y,
            this.size.width / 2, this.size.height / 2)
    }
}

class Flag {
    constructor(location, size) {
        this.location = location
        this.size = size
    }

    update() {

    }

    draw(screen) {
        screen.fillStyle = "#8CD1EF"
        screen.fillRect(
            this.location.x - (this.size.width/2),
            this.location.y - (this.size.height/2),
            this.size.width, this.size.height)
    }
}

class HomeBase {
    constructor(location, size) {
        this.location = location
        this.size = size
    }

    update() {

    }

    draw(screen) {
        screen.fillStyle = "#FF9FF9"
        screen.fillRect(
            this.location.x - (this.size.width/2),
            this.location.y - (this.size.height/2),
            this.size.width, this.size.height)
    }
}

class Ghost {
    constructor(location, size) {
        this.location = location
        this.size = size
    }

    update() {
        if (this.size.width < 40) {
            this.size.width += 2
        }
        if (this.size.height < 40) {
            this.size.height += 2
        }
    }

    draw(screen) {
        screen.fillStyle = "#ffffff"
        screen.fillRect(
            this.location.x - (this.size.width/2),
            this.location.y - (this.size.height/2),
            this.size.width, this.size.height)
    }
}

class YouWin {
    constructor (location, size) {
        this.location = location
        this.size = size
    }

    update() {

    }

    draw(screen) {
        screen.fillStyle = "#EEE11A"
        screen.fillRect(0, 0, 1000, 500)
    }
}

class Keyboarder {
    constructor() {
        this.keyState = {}

        window.addEventListener('keydown', function (e) {
            this.keyState[e.keyCode] = true
        }.bind(this))

        window.addEventListener('keyup', function (e) {
            this.keyState[e.keyCode] = false
        }.bind(this))
    }

    isDown(keyCode) {
        return this.keyState[keyCode] === true
    }

    on(keyCode, callback) {
        window.addEventListener('keydown', function (e) {
            if (e.keyCode === keyCode) {
                callback()
            }
        })
    }
}

Keyboarder.KEYS = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, S: 83 }

function flagGrab(hero, flag) {
    return !(
        hero === flag ||
        hero.location.x + hero.size.width / 2 < flag.location.x - flag.size.width / 2 ||
        hero.location.y + hero.size.height / 2 < flag.location.y - flag.size.height / 2 ||
        hero.location.x - hero.size.width / 2 > flag.location.x + flag.size.width / 2 ||
        hero.location.y - hero.size.height / 2 > flag.location.y + flag.size.height / 2
    )
}

function crash(b1, b2) {
    return !(
        b1 === b2 ||
        b1.location.x + b1.size.width / 2 < b2.location.x - b2.size.width / 2 ||
        b1.location.y + b1.size.height / 2 < b2.location.y - b2.size.height / 2 ||
        b1.location.x - b1.size.width / 2 > b2.location.x + b2.size.width / 2 ||
        b1.location.y - b1.size.height / 2 > b2.location.y + b2.size.height / 2
    )
}

const game = new Game("capture-the-flag")
game.run()
