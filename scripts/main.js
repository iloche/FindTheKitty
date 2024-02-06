let topWay = document.querySelector(".top-way"),
    leftWay = document.querySelector(".left-way"),
    rightWay = document.querySelector(".right-way"),
    dialogue = document.querySelector(".dialogue"),
    txtBox = document.querySelector(".txt-box"),
    direction = document.querySelector(".direction-box")
    nextDia = document.querySelector(".next-dialogue"),
    randomNumber = Math.random()*3,
    roundNumber = Math.floor(randomNumber),
    buttons = document.querySelectorAll(".allButtons"),
    tableau = [topWay, leftWay, rightWay],
    finalChoice = tableau[roundNumber]
    console.log(finalChoice)

nextDia.addEventListener("click", function(){
    direction.style.display = "inline"
    txtBox.style.display = "none"
})

finalChoice.addEventListener("click", function(){
    document.querySelector(".scene").style.backgroundImage = "url('images/draw-pixel-art-sprites.jpg')"
    dialogue.innerHTML = `Oh ? Il y a quelque chose là-bas !`
    txtBox.style.display = "inline"
    nextDia.style.display = "none"
    direction.style.display = "none"
    document.querySelector('.scene').innerHTML+=`
    <img class="kitty" src="images/kitty.gif">`
})

buttons.forEach(function(button){
    button.addEventListener("click", function(){
        if (button != finalChoice){
            txtBox.style.display = "inline"
            dialogue.innerHTML = `Ça ne doit pas être ici on dirait...`
            nextDia.innerHTML = `Mince.. Allons voir ailleurs..`
        }
    })
})