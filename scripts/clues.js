"use strict"
{
let { rooms,throwError , getCurrentRoom, currentRoom, currentLevel, getNextRoom, getRoomId, goToRoom, getMaxRooms, isRoomValid} = ESCAPE_ROOM;
Object.assign(ESCAPE_ROOM, {setFoundKey, typeWriter});
let clueName;
let foundKey = false;
let lastInteraction = '';
let foundHideSpot = false;
let isLocked = true;

const clueClick = (event) => {
   if(!isClue(event.target.className))return;
   clueName = getClueName(event.target.className);
   changeFrame(clueName);
   lastInteraction = clueName;
}

const next = (event) => {
    console.log('test');
    goToRoom(getNextRoom(getCurrentRoom()));
 }
 
function setFoundKey(test){
    foundKey = test;
}

function getClueName(clueName){
    return clueName.replace('clue ', '');
}

function isClue(clueName){
    if(clueName.includes('clue'))return true;
    return false;
}

function isKey(clueName){
    if(clueName == 'key'){
        return true;
    }
    return false;
}

function playSound(sound){    
    const audio = new Audio(`../sounds/${sound}`);
    audio.onerror = function(){ // Failed to load
        throwError(`Failed to play find sound at: ${audio.src}`);
        return false;
    };
    audio.volume = 0.5;
    audio.play();
}

function setFrame(){

}

function changeFrame(clueName){
    const level =  document.querySelector(`.level-${getRoomId(getCurrentRoom())}`)    
    const img = new Image();

    if (clueName == 'door') {
        if(foundKey){
            foundKey = false;
            isLocked = true;
            lastInteraction = '';
            playSound('key-open.mp3');
            setTimeout(function(){goToRoom(getNextRoom(getCurrentRoom()))},2000)
            document.querySelector('.key-stuff').style.display = "none";
            document.querySelector('.tirebouchon-stuff').style.display = "none"; 
            return;
        }
        return;
    }

    if (lastInteraction == clueName && lastInteraction != 'coffreOuvert') {
        if (foundKey && clueName && getCurrentRoom() == 'room level-2') {            
            img.src = `../images/frames/level-${getRoomId(getCurrentRoom())}/level-${getRoomId(getCurrentRoom())}-nokey.svg`;
        }else{
            img.src = `../images/frames/level-${getRoomId(getCurrentRoom())}/level-${getRoomId(getCurrentRoom())}.svg`;
        }
        img.onload = function(){             
            level.style.backgroundImage = `url("${img.src}")`;
            lastInteraction = '';
        }
        return;
    }
    console.log(clueName);
    
    if (foundKey && getCurrentRoom() == 'room level-2'){
        img.src = `../images/frames/level-${getRoomId(getCurrentRoom())}/${clueName}-nokey.svg`;
    }else{
        img.src = `../images/frames/level-${getRoomId(getCurrentRoom())}/${clueName}.svg`;
    }
    if (isKey(clueName)) {
        if(!foundKey && lastInteraction == 'keyHide'){
            foundKey = true;
            document.querySelector('.key').style.display = 'none';
            playSound('pick-key.mp3');
            document.querySelector('.key-stuff').style.display = "block"; 
            img.src = `../images/frames/level-${getRoomId(getCurrentRoom())}/level-${getRoomId(getCurrentRoom())}-nokey.svg`;
            img.onload = function(){ 
            level.style.backgroundImage = `url("${img.src}")`;
            document.querySelector(`.level-${getRoomId(getCurrentRoom())} .keyHide`).style.zIndex = '10';
            return;
            }
        }else{
            document.querySelector(`.level-${getRoomId(getCurrentRoom())} .keyHide`).style.zIndex = '10'; 
        }
    }else{
        img.onload = function(){ 
            switch(getCurrentRoom()){
                case 'room level-1':
                    if (getCurrentRoom() == 'room level-1') {    
                        if (foundHideSpot) {
                            foundHideSpot = false;
                            document.querySelector(`.level-${getRoomId(getCurrentRoom())} .keyHide`).style.zIndex = '10';
                        }
                        if (clueName == 'keyHide') { 
                            foundHideSpot = true;
                            document.querySelector(`.level-${getRoomId(getCurrentRoom())} .${clueName}`).style.zIndex = '5';
                        }
        
                    }
                    break;
                case 'room level-2':
                    if (clueName == 'tireBouchon' && isLocked) {
                        isLocked = false;
                        document.querySelector(".tirebouchon-stuff").style.display = "block"
                    }
                    break;
                case 'room level-3':
                    if (clueName == 'coffreOuvert') {
                        document.querySelector(`.safeVaultContainer`).style.display = 'block';
                    }
                    break;
                case 'room level-4':
                    if (clueName == 'placard') {
                        document.querySelector(`.labyrinthContainer`).style.display = 'block';
                    }
                    break;
            }
            if(getCurrentRoom() != 'room level-1'){
                if (foundHideSpot) {
                    foundHideSpot = false;
                    document.querySelector(`.level-${getRoomId(getCurrentRoom())} .keyHide`).style.zIndex = '10';
                }

                if (clueName == 'keyHide' && isLocked) {  
                    return;
                }

                if (clueName == 'keyHide' && !isLocked) {  
                    foundHideSpot = true;
                    document.querySelector(`.level-${getRoomId(getCurrentRoom())} .key`).style.display = 'block';
                    document.querySelector(`.level-${getRoomId(getCurrentRoom())} .${clueName}`).style.zIndex = '5';
                }
                
            }
            try {                
                const lastDialogue = document.querySelector(lastText);
                lastDialogue.classList.add('hidden');
                clearTimeout(timeOut);
            } catch (error) {                
            }
            typeWriter(`.dialogues-zone .${clueName}`, false, 50)
            level.style.backgroundImage = `url("${img.src}")`;
            }

            
        
        if(clueName == 'keyHide' && foundKey && getCurrentRoom() == 'room level-1'){
            img.src = `../images/frames/level-${getRoomId(getCurrentRoom())}/level-${getRoomId(getCurrentRoom())}-nokey.svg`;
            img.onload = function(){ 
                level.style.backgroundImage = `url("${img.src}")`;
            }
        }
    }

}



document.querySelector('.nextRoom').addEventListener('click', next);

document.getElementById('rooms').addEventListener('click', clueClick);


let i = 0;
let text;
let textChars;
let timeOut;
let lastText = ''
function typeWriter(textid, wipe, speed) {    
    textid = textid.split('text')[0] 
    text = document.querySelector(textid);
    
    if (text == null){
        console.log('Given paragraph ID is null.');
        return;
    }
    if (!wipe){
        lastText = textid;
        textChars = text.textContent;
        text.textContent = "";
        wipe = true;
        text.style.display = 'block'
    }
    text.classList.remove('hidden');
    if (i < textChars.length) {
      text.textContent += textChars.charAt(i);
      //console.log(text.textContent);
      
      i++;
      
      setTimeout(function(){ typeWriter('.dialogues-zone .' + text.className, wipe, speed); }, speed);
    }else{
        timeOut = setTimeout(function(){ text.classList.add('hidden');},4000);
        i = 0;
    }
  }





}


