//---------table size----------
const numLine = 4
const numCol = 4
//-----------------------------

let gameArray
let moves = 0

//fonction qui genere la table html et l'ajoute au document
function createTable() {
    //zoom qui permet de changer l'affichage en fonction du nombre de ligne
    document.body.style.zoom = 100 - (numLine * 10 / 4) + "%"
    let table = document.createElement('table')
    document.body.appendChild(table)
    let moves = document.createElement("th")
    moves.setAttribute("id", "moves")
    moves.setAttribute("colspan", String(numCol))
    table.appendChild(moves)
    for (let i = 0; i < numLine; i++) {
        let line = document.createElement('tr')
        table.appendChild(line)
        for (let j = 0; j < numCol; j++) {
            let column = document.createElement("td")
            //La taille des cases de la table sont choisie en fonction du nombre de lignes et colonnes
            column.setAttribute("width", "" + (100 / numLine) * 5 + "px")
            column.setAttribute("height", "" + (100 / numCol) * 5 + "px")
            column.setAttribute("id", i + "-" + j)
            line.appendChild(column)
        }
    }
}

//fonction qui initialise un tableau qui va servir pour l'algorithme
function createArray() {
    let array2d = []
    for (let i = 0; i < numLine; i++) {
        let array = []
        for (let i = 0; i < numCol; i++)
            array.push("")
        array2d.push(array)
    }
    gameArray = array2d
}

//fonction  qui genére les deux premiers nombres au début du jeu
function begin() {
    for (let i = 0; i < 2; i++) {
        generateNumber()
    }
    $("#moves").html("0")
}

//fonction qui gére le déplacement des tuiles vers le bas et update le tableau javascript
function moveDown() {
    for (let line = numLine - 2; line >= 0; line--) {
        for (let col = 0; col < numCol; col++) {
            if (gameArray[line][col] !== "") {
                let currentLine = line + 1
                let value = gameArray[line][col]
                while (currentLine <= numLine - 1 && gameArray[currentLine][col] === "")
                    currentLine++
                if (currentLine - 1 === line && gameArray[currentLine][col] !== value)
                    continue
                else if (currentLine > numLine - 1)
                    gameArray[numLine - 1][col] = value
                else if (value === gameArray[currentLine][col])
                    gameArray[currentLine][col] = String(parseInt(value) + parseInt(gameArray[currentLine][col]))
                else
                    gameArray[currentLine - 1][col] = value
                gameArray[line][col] = ""
            }
        }
    }
}

//fonction qui gére le déplacement des tuiles vers la droite et update le tableau javascript
function moveRight() {
    for (let line = 0; line < numLine; line++) {
        for (let col = numLine - 2; col >= 0; col--) {
            if (gameArray[line][col] !== "") {
                let currentCol = col + 1
                let value = gameArray[line][col]
                while (currentCol <= numCol - 1 && gameArray[line][currentCol] === "")
                    currentCol++
                if (currentCol - 1 === col && gameArray[line][currentCol] !== value)
                    continue
                else if (currentCol > numCol - 1)
                    gameArray[line][numCol - 1] = value
                else if (value === gameArray[line][currentCol])
                    gameArray[line][currentCol] = String(parseInt(value) + parseInt(gameArray[line][currentCol]))
                else
                    gameArray[line][currentCol - 1] = value
                gameArray[line][col] = ""
            }
        }
    }
}

//fonction qui gére le déplacement des tuiles vers le gauche et update le tableau javascript
function moveLeft() {
    for (let line = 0; line < numLine; line++) {
        for (let col = 0; col < numCol; col++) {
            if (gameArray[line][col] !== "") {
                let currentCol = col - 1
                let value = gameArray[line][col]
                while (currentCol >= 0 && gameArray[line][currentCol] === "")
                    currentCol--
                if (currentCol + 1 === col && gameArray[line][currentCol] !== value)
                    continue
                else if (currentCol < 0)
                    gameArray[line][0] = value
                else if (value === gameArray[line][currentCol])
                    gameArray[line][currentCol] = String(parseInt(value) + parseInt(gameArray[line][currentCol]))
                else
                    gameArray[line][currentCol + 1] = value
                gameArray[line][col] = ""
            }
        }
    }
}

//fonction qui gére le déplacement des tuiles vers le haut et update le tableau javascript
function moveUp() {
    for (let line = 1; line < numLine; line++) {
        for (let col = 0; col < numCol; col++) {
            if (gameArray[line][col] !== "") {
                let currentLine = line - 1
                let value = gameArray[line][col]
                while (currentLine >= 0 && gameArray[currentLine][col] === "")
                    currentLine--
                if (currentLine + 1 === line && gameArray[currentLine][col] !== value)
                    continue
                else if (currentLine < 0)
                    gameArray[0][col] = value
                else if (value === gameArray[currentLine][col]) {
                    gameArray[currentLine][col] = String(parseInt(value) + parseInt(gameArray[currentLine][col]))
                }
                else {
                    gameArray[currentLine + 1][col] = value
                }
                gameArray[line][col] = ""
            }
        }
    }
}

//fonction évenementielle qui attend l'appuie sur une touche directionnel pour effctuer un déplacement
$(document).keydown(function (key) {
    let arrows = [37, 38, 39, 40]
    let keyPressed = key.which
    if ($.inArray(keyPressed, arrows) !== -1) {
        switch (keyPressed) {
            //up
            case 38:
                moveUp()
                break
            //down
            case 40:
                moveDown()
                break
            //right
            case 39:
                moveRight()
                break
            //left
            case 37:
                moveLeft()
                break
        }
        //apres le deplacement on verifie si il existe une case vide, si oui on genere un nombre
        //puis on vérifie si le jeu est terminer
        if (checkForEmptyCell(gameArray)) {
            moves++
            $("#moves").html(String(moves))
            generateNumber()
            checkGameEnd()
        }
    }
});

//fonction qui choisie un nombre aléatoire entre 2 et 4 puis l'ajoute au tableau javascript
function generateNumber() {
    let tab = []
    for (let line = 0; line < numLine; line++) {
        for (let col = 0; col < numCol; col++) {
            if (gameArray[line][col] === "")
                tab.push([line, col])
        }
    }
    let number = String(Math.random() < 0.9 ? 2 : 4)
    let rand = Math.floor(Math.random() * tab.length)
    let index = tab[rand]
    gameArray[index[0]][index[1]] = number
    refresh()
}

//fonction qui met à jour le tableau html
function refresh() {
    for (let i = 0; i < numLine; i++) {
        for (let j = 0; j < numCol; j++) {
            let elem = document.getElementById(i + "-" + j)
            let number = gameArray[i][j]
            elem.innerHTML = number
            let colors = getColors(number)
            elem.style.backgroundColor = colors.bgColor
            elem.style.color = colors.textColor
        }
    }
}

//fonction qui choisie la couleur a afficher en fonction du nombre
function getColors(number) {
    switch (number) {
        case "":
            return {textColor: "", bgColor: "#cdc1b4"}
        case "2":
            return {textColor: "#776e65", bgColor: "#eee4da"}
        case "4":
            return {textColor: "#776e65", bgColor: "#eee1c9"}
        case "8":
            return {textColor: "#f9f6f2", bgColor: "#f3b27a"}
        case "16":
            return {textColor: "#f9f6f2", bgColor: "#f69664"}
        case "32" :
            return {textColor: "#f9f6f2", bgColor: "#f77c5f"}
        case "64":
            return {textColor: "#f9f6f2", bgColor: "#f75f3b"}
        default:
            return {textColor: "#f9f6f2", bgColor: "#edd073"}
    }
}

//fonction qui vérifie si le jeu est terminer
function checkGameEnd() {
    if (checkForWin())
        $("#msg").html("you won! well played!")
    else if (!checkForEmptyCell() && !checkForMerge())
        $("#msg").html("No more moves possible, try again")
    else
        return
    $(".popup-container").css("transform", "scale(1)")
    $("#restart").click(function () {
        location.reload()
    })
}

//fonction qui vérifie si une case est vide
function checkForEmptyCell() {
    for (let i = 0; i < numLine; i++) {
        for (let j = 0; j < numCol; j++) {
            if (gameArray[i][j] === "")
                return true
        }
    }
    return false
}

//fonction qui vérifie si une fusion est possible si jamais il n'y a pas de case vide
function checkForMerge() {
    for (let line = 0; line < numLine; line++) {
        let top = line - 1
        let bottom = line + 1
        for (let col = 0; col < numCol; col++) {
            let value = gameArray[line][col]
            let right = col + 1
            let left = col - 1
            if (top >= 0 && gameArray[top][col] === value)
                return true
            else if (bottom <= numLine - 1 && gameArray[bottom][col] === value)
                return true
            else if (left >= 0 && gameArray[line][left] === value)
                return true
            else if (right <= numCol - 1 && gameArray[line][right] === value)
                return true
        }
    }
    return false
}

function checkForWin() {
    for (let i = 0; i < numLine; i++) {
        for (let j = 0; j < numCol; j++) {
            if (gameArray[i][j] === "2048") {
                return true
            }
        }
    }
    return false
}

//fonction qui lance le jeu
function init() {
    createTable()
    createArray()
    begin()
}

init()



