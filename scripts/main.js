let topWay = document.querySelector(".top-way"),
    leftWay = document.querySelector(".left-way"),
    rightWay = document.querySelector(".right-way"),
    dialogue = document.querySelector(".dialogue"),
    txtBox = document.querySelector(".txt-box"),
    nextDia = document.querySelector(".next-dialogue")

function walk(){
    if(topWay.addEventListener("click", function(){
        document.querySelector(".scene").style.backgroundImage = "url('images/draw-pixel-art-sprites.jpg')"
        dialogue.innerHTML = `Oh ? Il y a quelque chose là-bas !`
        txtBox.style.display = "inline"
        nextDia.style.display = "none"
        document.querySelector(".direction-box").style.display = "none"
        document.querySelector(".scene").innerHTML = `<div class="txt-box">
        <p class="dialogue">Oh, il y a quelque chose là-bas !</p>
        <button class="next-dialogue">Il n'était pas bien loin tout compte fait !</button>
        </div>
        <img src="images/1215347632cute-kitty-animated-gif-72.gif" alt="Kitty" class="kitty">`
    })){
    } else if(leftWay.addEventListener("click", function(){
        txtBox.style.display = "inline"
        dialogue.innerHTML = `Hmm, il semblerait qu'il n'ait pas emprunté ce chemin..`
        nextDia.innerHTML = `Essayons d'autres chemins`
    })){
    } else if(rightWay.addEventListener("click", function(){
        txtBox.style.display = "inline"
        dialogue.innerHTML = `Ça ne doit pas être ici on dirait...`
        nextDia.innerHTML = `Mince.. Allons voir ailleurs..`
    })){ 
    }
}
nextDia.addEventListener("click", function(){
    document.querySelector(".direction-box").style.display = "inline"
    txtBox.style.display = "none"
    walk()
})
