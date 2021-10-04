const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

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
      timeupdate = $('#timeupdate');

var indexSong = 0,
isPlaying = false,
isRandom = false,
isRepeat = false,
arrList = [];

const app = {
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

    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[indexSong];
            }
        })
    },

    renderPlaylist: function(){
        var htmls = this.songs.map((item,index) => {
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
        this.setConfig('indexSong', indexSong);

        var isExist = arrList.some(item => item == indexSong);

        if(!isExist){
            arrList.push(indexSong);
        }

        if(arrList.length == this.songs.length){
            while(arrList.length > 1){
                arrList.shift();
            }
        }
        header.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.img})`;
        audio.src = this.currentSong.path; 
    },

    scrollToSong: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavier: 'smooth',
                block: 'center'
            })
        }, 300);
    },

    getTime: function(value){
        var min = Math.floor(value / 60);
        value %= 60;
        return `${min<10 ? '0'+ min : min}:${value < 10 ? '0' + value : value}`;
    },

    nextSong: function(){
        indexSong++;
        if(indexSong == this.songs.length){
            indexSong = 0;
        }
        this.loadCurrentSong();
        this.renderPlaylist();
        this.scrollToSong();
    },

    prevSong: function(){
        indexSong--;
        if(indexSong < 0){
            indexSong = this.songs.length - 1;
        }
        this.loadCurrentSong();
        this.renderPlaylist();
        this.scrollToSong();
    },

    playRandomSong: function(){
        let curIndex, isExist = true;
        while(isExist){
            curIndex = Math.floor(Math.random() * this.songs.length);
            var kt = arrList.some(item => item == curIndex);
            isExist = kt;
        }

        indexSong = curIndex;
        this.loadCurrentSong();
        this.renderPlaylist();
        this.scrollToSong();
    },

    handleEvents: function(){
        const _this = this;

        //  CD Thumb Rotation
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 8000,
            iterations: Infinity
        });
        cdThumbAnimate.pause();

        // Scroll Playlist
        var cdWidth = cd.offsetWidth;
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = (newCdWidth > 0)? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth ;
        }

        // Play and Pause Song
        playbtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
            }
            else{
                audio.play();
            }
        }

        // When Pausing
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // When Playing
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // Time On Playing
        audio.ontimeupdate = function(){
            if(audio.duration){
                const currentProgress = audio.currentTime / audio.duration *100;
                progress.value = currentProgress;
                timeupdate.innerHTML = _this.getTime(Math.floor(audio.currentTime)) + '/' + _this.getTime(Math.floor(audio.duration));
            }
        }

        // Change Time Play
        progress.onchange = function(index){
            const seekTime = audio.duration / 100*index.target.value;
            audio.currentTime = Math.floor(seekTime);
            timeupdate.innerHTML = _this.getTime(Math.floor(audio.currentTime)) + '/' + _this.getTime(Math.floor(audio.duration));
            if(!_this.isPlaying){
                audio.play();
            }
        }

        // On Ending
        audio.onended =function(){
            if(!isRepeat){
                nextbtn.click();
            }
            else{
                audio.play();
            }
        }

        // Next Song BTN
        nextbtn.onclick = function(){
            if(!_this.isRandom){
                _this.nextSong();
            }
            else{
                _this.playRandomSong();
            }
            audio.play();
        }
        
        // Prev Song BTN
        prevbtn.onclick = function(){
            if(!_this.isRandom){
                _this.prevSong();
            }
            else{
                _this.playRandomSong();
            }
            audio.play();
        }

        // Random BTN
        randombtn.onclick = function(){
            isRandom = !isRandom;
            randombtn.classList.toggle('active', isRandom);
            if(!!isRepeat){
                isRepeat = !isRepeat;
                repeatbtn.classList.toggle('active',isRepeat);
            }
            this.setConfig('isRandom',isRandom);
            this.setConfig('isRepeat',isRepeat);
        } 

        // Repeat BTN
        repeatbtn.onclick = function(){
            isRepeat = !isRepeat;
            repeatbtn.classList.toggle('active', isRepeat);
            if(!!isRandom){
                isRandom = !isRandom;
                randombtn.classList.toggle('active',isRandom);
            }
            this.setConfig('isRandom',isRandom);
            this.setConfig('isRepeat',isRepeat);
        }

        // Playlist click
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')){
                indexSong = Number(songNode.dataset.index);
                _this.loadCurrentSong();
                _this.renderPlaylist();
                audio.play();
            }
        }
    },

    SetConfigBegin: function(){
        if(this.config.indexSong == undefined){
            indexSong = 0;
        }
        else{
            indexSong = this.config.indexSong;
        }
        isRepeat = this.config.isRepeat;
        isRandom = this.config.isRandom;
    },

    start: function(){
        this.defineProperties();

        this.SetConfigBegin();

        this.renderPlaylist();

        this.loadCurrentSong();
        
        this.handleEvents();

        repeatbtn.classList.toggle('active', isRepeat);
        randombtn.classList.toggle('active', isRandom);

        audio.play();
    }
}

app.start();