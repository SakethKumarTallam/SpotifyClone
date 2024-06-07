let currentsong = new Audio()
let songs,curFolder;
function secondsToMinutes(totalSeconds) {
    if(isNaN(totalSeconds)|| totalSeconds<0){
        return "00:00";
    }
    var roundedSeconds = Math.round(totalSeconds);
    var minutes = Math.floor(roundedSeconds / 60);
    var remainingSeconds = roundedSeconds % 60;

    var formattedMinutes = ('0' + minutes).slice(-2);
    var formattedSeconds = ('0' + remainingSeconds).slice(-2);

    return formattedMinutes + ':' + formattedSeconds;
}


async function getSongs(folder) {
    curFolder=folder;
    let a = await fetch(`http://127.0.0.1:3000/songs/${curFolder}/`)
    let response = await a.text();
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href)
        }
        
    }
    for (const i of songs) {
        let div=document.createElement('div')
        div.innerHTML=` <img src="music.svg" alt="" width="25">
        <ul>
        <li>${i.split(`/${curFolder}/`)[1].replaceAll('%20',' ')}</li>
        <li>By Saketh</li>
        </ul>
        <img src="play.svg" alt="" width="25">`
        div.setAttribute('class','card');
        document.querySelector('.twocont').append(div); 
    }
    let s=Array.from(document.querySelectorAll('.card'))
    s.forEach(element => {
        element.addEventListener('click',e=>{
            console.log(element.querySelector('ul li').innerHTML);
            playmusic(element.querySelector('ul li').innerHTML.trim());
        })
    });
    return songs;
}
const playmusic = (e,pause=false) =>{
    console.log("The e is ",e);
    
    if(!pause){
        play.src = "pause.svg"
        document.querySelector('.ab .info').innerHTML=e.replaceAll('%20',' ');
        currentsong.src=`/songs/${curFolder}/`+ e
        currentsong.play()
    }
    else{
        currentsong.src=e
        document.querySelector('.ab .info').innerHTML=e.split(`/${curFolder}/`)[1].replaceAll('%20',' ');
    }
    document.querySelector('.ab .time').innerHTML="00:00 / 00:00"
}
async function ldAlb(){
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text();
    let div1=document.createElement('div');
    div1.innerHTML=response;
    let a_s=Array.from(div1.getElementsByTagName('a'))
    await Promise.all(a_s.map(async e => {
        if((e.href.includes('/songs/')) && !(e.href.split('/songs/')[1].startsWith('.'))){
            // console.log("two",!(e.href.split('/songs/')[1].startsWith('.')));
            let fold=e.href.split('/').slice(-2)[0]
            // console.log("One ",fold);
            let g = await fetch(`${e.href}info.json`);
            let titles = await g.json();
            console.log(titles);
            let div=document.createElement('div');
            div.innerHTML=`<div class="prof1" data-fdr="${fold}">
            <img src="/songs/${fold}/cover.jpeg" alt="">
            <h4>${titles.title}</h4>
            <div class="msg">${titles.description}</div>
            <div class="play"></div>
            </div>
            `
            document.querySelector('.profiles').append(div);
        }
    }));
}

async function main() {
    songs=await getSongs('one');
    console.log(songs);
    playmusic(songs[0],true)
    await ldAlb();
    let ch = document.getElementsByClassName('prof1');
    let c=Array.from(ch);
    console.log(ch.length);
    for (const i of c) {
        i.addEventListener("mouseenter", (e) => {
            let ch = i.querySelector('.play')
            ch.innerHTML = "<img src=\"play.svg\">"
            let ch1 = ch.querySelector('.play img')
            ch1.setAttribute("style", "background-color: color(srgb 0.108 0.8437 0.3764);border-radius: 50%;padding: 10px;width: 22px;height:25px")
            ch1.addEventListener("mouseenter", () => {
                ch1.style.padding = "11px";
                ch1.style.width = "23px";
                ch1.style.backgroundColor = "color(srgb 0.108 0.89 0.3764)"
            })
            ch1.addEventListener("mouseleave", () => {
                ch1.style.padding = "10px";
                ch1.style.width = "22px";
                ch1.style.backgroundColor = "color(srgb 0.108 0.8437 0.3764)"
            })
            i.setAttribute("style", "background-color:color(srgb 0.1608 0.1608 0.1608);;border-radius:5px;")
        })
        i.addEventListener("mouseleave", () => {
            let ch = i.querySelector('.play')
            ch.innerHTML = ""
            i.removeAttribute("style")
        })
    }
    
    play.addEventListener('click',()=>{
        if(currentsong.paused){
            currentsong.play();
            play.src = "pause.svg"
        }
        else{
            currentsong.pause();
            play.src = "play.svg"
        }
    })
    
    next.addEventListener('click',e=>{
        console.log(currentsong.src);
        console.log(songs);
        let index = songs.indexOf(currentsong.src)
        if((index+1)<songs.length){
            playmusic(songs[index+1].split(`/songs/${curFolder}/`)[1]);
        }
    })
    previous.addEventListener('click',e=>{
        console.log(currentsong.src);
        console.log(songs);
        let index = songs.indexOf(currentsong.src)
        if((index-1)>=0){
            playmusic(songs[index-1].split(`/songs/${curFolder}/`)[1]);
        }
    })
    
    range.addEventListener("change",e=>{
        currentsong.volume=range.value/100
        if(range.value==0){
            vol1.src='mute.svg'
        }
        else{
            vol1.src='volume.svg';
        }
    })
    vol1.addEventListener('click',e=>{
        console.log(vol1.src);
        let s=vol1.src.split('/')
        if(s.indexOf('volume.svg')>=0){
            currentsong.volume=0;
            range.value=0;
            vol1.src='mute.svg'
        }
        else if((s.indexOf('volume.svg')) == -1){
            currentsong.volume=0.5;
            range.value=50;
            vol1.src='volume.svg'
        }
    })
    
    currentsong.addEventListener('timeupdate',()=>{
        console.log(currentsong.currentTime,currentsong.duration);
        document.querySelector('.time').innerHTML=`${secondsToMinutes(currentsong.currentTime)}/${secondsToMinutes(currentsong.duration)}`
        document.querySelector('.circle').style.left=(currentsong.currentTime/currentsong.duration)*100 +'%'
    })
    document.querySelector('.skbar').addEventListener('click',(e)=>{
        let p=(e.offsetX / (e.target.getBoundingClientRect().width))*100
        document.querySelector('.circle').style.left=p + "%"
        currentsong.currentTime= (currentsong.duration * p)/100
    })
    document.querySelector('.four > img').addEventListener('click',()=>{
        document.querySelector('.aside').style.left="0";
    })
    document.querySelector('.aside > img').addEventListener('click',()=>{
        document.querySelector('.aside').style.left="-120%";
    })
    for (const i of c) {   
        console.log(i);
        i.addEventListener('click',async (e)=>{
            document.querySelector('.twocont').innerHTML='';
            let folder=e.currentTarget.dataset.fdr;
            curFolder=folder;
            let songs=await getSongs(curFolder);
            // console.log(songs[0].split(`${curFolder}/`)[1]);
            playmusic(songs[0].split(`${curFolder}/`)[1])
        })
    }
}
main()

