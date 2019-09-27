class Game {
    constructor(canvasId) {
        const canvas = document.getElementById(canvasId)
        this.screen = canvas.getContext("2d")
        this.size = { width: canvas.width, height: canvas.height }

        this.bodies = []

        let playerSize = {
            width: 20,
            height: 20
        }

        let playerLocation = {
            x: Math.floor(this.size.width * .5),
            y: Math.floor(this.size.height - (playerSize.height * 2))
        }

        console.log(playerLocation)

        this.player = new Player(playerLocation, playerSize)
        this.addBody(this.player)
    }

    addBody(body) {
        this.bodies.push(body)
    }

    run() {
        this.draw()
    }

    draw() {
        this.screen.fillStyle = "#FFFDE8"
        this.screen.fillRect(0, 0, 500, 500)

        for (let body of this.bodies) {
            body.draw(this.screen)
        }
    }
}

class Player {
    constructor(location, size) {
        this.location = location
        this.size = size
    }

    draw(screen) {
        screen.fillStyle = "#000000"
        screen.fillRect(this.location.x, this.location.y, this.size.width, this.size.height)
    }
}

const captureGame = new Game("capture-the-flag")
captureGame.run()
