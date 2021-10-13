const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function csl(data){
    console.log(data);
}

const KEY_OF_MUSIC = 'ToanTa_Player';

const player = $('.player'),
      header = $('header h2'),
      cdThumb = $('.cd-thumb'),
      audio = $('audio'),
      playbtn = $('.btn-toggle-play'),
      progress = $('#progress'),
      cd = $('.cd'),
      nextbtn = $('.btn-next'),
      prevbtn = $('.btn-prev'),
      randombtn = $('.btn-random'),
      repeatbtn = $('.btn-repeat'),
      playlist = $('.playlist'),
      timeupdate = $('#timeupdate'),
      modalYbtn = $('#yes'),
      modalXbtn = $('#no'),
      modal = $('.modal');

var indexSong = 0,
isPlaying = false,
isRandom = false,
isRepeat = false,
isContinue = false,
arrList = [0,2,5,7,6];

const app ={
    config: JSON.parse(localStorage.getItem(KEY_OF_MUSIC)) || {},
    
    songs: [
        {
            name: 'Đi Bể Bơi',
            singer: 'Low G',
            path: './asserts/music/DiBeBoi.mp3',
            img: './asserts/img/DiBeBoi.jpg'
        },
    
        {
            name: 'Em Gái',
            singer: 'Low G',
            path: './asserts/music/EmGai.mp3',
            img: './asserts/img/emGai.jpg'
        },
    
        {
            name: 'Flexing Trên Circle K',
            singer: 'Low G',
            path: './asserts/music/FlexingTrenCircleK.mp3',
            img: './asserts/img/flexingtrencircleK.jpg'
        },
    
        {
            name: 'Industry Baby',
            singer: 'Lil Nas X',
            path: './asserts/music/IndustryBaby.mp3',
            img: './asserts/img/IndustryBaby.jpg'
        },
    
        {
            name: 'On Top',
            singer: 'The Girl Next Door',
            path: './asserts/music/OnTop.mp3',
            img: './asserts/img/OnTop.jpg'
        },
    
        {
            name: 'She Make It Clap',
            singer: 'Low G',
            path: './asserts/music/SheMakeItClap.mp3',
            img: './asserts/img/shemakeitclap.jpg'
        },
    
        {
            name: 'Simple Cypher',
            singer: 'Low G',
            path: './asserts/music/SimpleCypher.mp3',
            img: './asserts/img/simplecypher.jpg'
        },
    
        {
            name: 'Tales Of Dominica',
            singer: 'Lil Nas X',
            path: './asserts/music/TalesOfDominica.mp3',
            img: './asserts/img/talesOfDominica.jpg'
        },
    
        {
            name: 'Tán Gái 505',
            singer: 'Low G',
            path: './asserts/music/TanGai505.mp3',
            img: './asserts/img/TanGai505.jpg'
        }
    ],

    setConfig: function(key, value){
        this.config[key] = value;
        localStorage.setItem(KEY_OF_MUSIC, JSON.stringify(this.config));
    },

    setConfigBegin: function(){
        
        if(this.config.indexSong == undefined){
            indexSong = 0;
        }
        else{
            indexSong = this.config.indexSong;
        }

        if(this.config?.currentTime){
            audio.currentTime = this.config.currentTime;
        }

        if(!!audio.currentTime) isContinue = true;
        if(!!this.config?.isRandom) isRandom = true;  
        if(!!this.config?.isRepeat) isRepeat = true;  
    },

    defineProperty: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[indexSong];
            }
        })
    },

    renderPlaylist: function(){
        var htmls = this.songs.map((item, index) => {
            return `<div class="song ${index === indexSong ? 'active':''}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${item.img}')"></div>
                    <div class="body">
                        <h3 class="title">${item.name}</h3>
                        <p class="author">${item.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>`
        });

        playlist.innerHTML = htmls.join('\n');
    },

    loadCurrentSong: function(){
        
        var isExist = arrList.some(index => index == indexSong);
        if(!isExist){
            arrList.push(indexSong);
        }

        if(arrList.length === this.songs.length){
            while(arrList.length > 1){
                arrList.shift();
            }
        }
        this.setConfig('indexSong', indexSong);
        header.innerText = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.img})`;
        audio.src = this.currentSong.path;
    },

    modalContainer: function(){
        if(!!isContinue){
            modal.classList.add('open');
            modalXbtn.addEventListener('click', function(){
                audio.currentTime = 0;
                modal.classList.remove('open');
                audio.play(); 
            });
            modalYbtn.addEventListener('click',function(){
                modal.classList.remove('open');
                audio.play();
            })
        }
    },

    nextSong: function(){
        indexSong++;
        if(indexSong >= this.songs.length){
            indexSong = 0;
        }
        this.currentSong = indexSong;
        this.renderPlaylist();
        this.loadCurrentSong();
        this.scrollToSong();
    },

    prevSong: function(){
        indexSong--;
        if(indexSong < 0){
            indexSong = this.songs.length-1;
        }
        this.currentSong = indexSong;
        this.renderPlaylist();
        this.loadCurrentSong();
        this.scrollToSong();
    },

    playRandomSong: function(){
        var curIndex, isExist=true;
        while(isExist){
            curIndex = Math.floor(Math.random() * this.songs.length);
            isExist = arrList.some(index => index == curIndex);
        }
        indexSong = curIndex;
        this.renderPlaylist();
        this.loadCurrentSong();
        this.scrollToSong();
    },

    scrollToSong: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }, 500);
    },

    getTime: function(value){
        var min = Math.floor(value / 60);
        value %= 60;
        return `${min<10 ? '0'+ min : min}:${value < 10 ? '0' + value : value}`;
    },

    innerTime: function(curTime, duradion){
        return this.getTime(Math.floor(curTime)) + '/' + this.getTime(Math.floor(duradion));
    },


    handelEvents: function(){
        const _thisApp = this;
        
        // CDThumb rotation
        const cdThumbAnimate = cdThumb.animate(
            [{transform: 'rotate(360deg)'}],
            {
                duration: 8000,
                iterations: Infinity
            }
        );
        cdThumbAnimate.pause();

        // On Scroll Playlist
        var cdWidth = cd.offsetWidth;
        document.onscroll = function(){
            var widthScroll = window.scrollY || document.documentElement.scrollTop;
            var newCdWidth = cdWidth - widthScroll;

            cd.style.width = (newCdWidth > 0)? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        
        //playbtn on click
        playbtn.onclick = function(){
            if(!isPlaying){
                audio.play();
            }
            else{
                audio.pause();
            }
        }

        // when audio playing
        audio.onplay = function(){
            isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // when audio pausing
        audio.onpause = function(){
            isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // audio on End
        audio.onended = function(){
            if(!isRepeat){
                nextbtn.click();
            }
            else{
                audio.play();
            }
        }

        // Progress when audio playing and pause
        audio.ontimeupdate = function(){
            if(audio.duration){
                _thisApp.setConfig('currentTime', audio.currentTime);
                const currentProgress = audio.currentTime / audio.duration * 100;
                progress.value = currentProgress;
                timeupdate.innerHTML = _thisApp.innerTime(audio.currentTime, audio.duration);
            }
        }

        // Change time playing by Progress
        progress.onchange = function(index){
            const seekTime = audio.duration / 100 * index.target.value;
            audio.currentTime = Math.floor(seekTime);
            timeupdate.innerHTML = _thisApp.innerTime(audio.currentTime, audio.duration);
            if(!isPlaying){
                audio.play();
            }
        }

        // next BTN event
        nextbtn.onclick = function(){
            if(!isRandom){
                _thisApp.nextSong();
            }
            else{
                _thisApp.playRandomSong();
            }
            audio.play();
        }

        //previous BTN event
        prevbtn.onclick = function(){
            if(!isRandom){
                _thisApp.prevSong();
            }
            else{
                _thisApp.playRandomSong();
            }
            audio.play();
        }

        // repeat BTN event
        repeatbtn.onclick = function(){
            isRepeat = !isRepeat;
            if(isRepeat && isRandom){
                isRandom = !isRandom;
            }

            randombtn.classList.toggle('active',isRandom);
            repeatbtn.classList.toggle('active', isRepeat);
            
            _thisApp.setConfig('isRepeat', isRepeat);
            _thisApp.setConfig('isRandom', isRandom);
        }

        // Random BTN event
        randombtn.onclick = function(){
            isRandom = !isRandom;
            if(isRandom && isRepeat){
                isRepeat = !isRepeat;
            }

            randombtn.classList.toggle('active',isRandom);
            repeatbtn.classList.toggle('active', isRepeat);
            
            _thisApp.setConfig('isRepeat', isRepeat);
            _thisApp.setConfig('isRandom', isRandom);
        }

        // PlayList click to choose Song
        playlist.onclick = function(event){
            let songNode = event.target.closest('.song:not(.active)');

            if(songNode || event.target.closest('option')){
                indexSong = Number(songNode.dataset.index);
                _thisApp.renderPlaylist();
                _thisApp.loadCurrentSong();
                audio.play();
            }
        }

    },

    start: function(){

        this.defineProperty();

        this.setConfigBegin();
        
        this.renderPlaylist();
        
        this.loadCurrentSong();

        this.modalContainer();
        
        this.handelEvents();

        repeatbtn.classList.toggle('active', isRepeat);
        randombtn.classList.toggle('active', isRandom);

    }
}

app.start();