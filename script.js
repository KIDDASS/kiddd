class FacebookProfile {
    constructor(facebookUserId) {
        this.facebookUserId = facebookUserId;
        this.cursor = document.querySelector('.cursor');
        this.bgMusic = document.getElementById('bg-music');
        this.bgVideo = document.getElementById('bg-video');
        this.isPlaying = false;
        this.audioPlayer = null;
        this.isAudioPlaying = false;
        this.currentTime = 0;
        this.duration = 0;
        this.isMinimized = false;
        this.init();
    }

    init() {
        this.setupCursor();
        this.setupIntro();
        this.setupMusic();
        this.setupAudioPlayer();
        this.setupVideoBackground();
        this.setupFacebookProfile();
    }

    setupVideoBackground() {
        if (GITHUB_VIDEO_URL) {
            const mp4Source = this.bgVideo.querySelector('source[type="video/mp4"]');
            const webmSource = this.bgVideo.querySelector('source[type="video/webm"]');
            
            if (mp4Source) mp4Source.src = GITHUB_VIDEO_URL;
            if (webmSource) webmSource.src = GITHUB_VIDEO_URL;
            
            this.bgVideo.load();
        }
    }

    setupCursor() {
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';
        });

        const interactiveElements = document.querySelectorAll('a, .avatar, .enter-btn, .audio-btn, .minimize-btn');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('active');
            });
            
            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('active');
            });
        });
    }

    setupIntro() {
        const enterBtn = document.getElementById('enter-btn');
        const introScreen = document.getElementById('intro-screen');
        const mainContent = document.getElementById('main-content');

        this.startTypingEffect();

        enterBtn.addEventListener('click', () => {
            introScreen.classList.add('hidden');
            
            setTimeout(() => {
                mainContent.classList.add('visible');
                document.getElementById('audio-player').classList.add('visible');
                
                if (GITHUB_VIDEO_URL) {
                    this.bgVideo.classList.add('visible');
                    this.bgVideo.play().catch(error => {
                        console.log('Video autoplay prevented:', error);
                    });
                }
                
                document.body.style.overflow = 'auto';
                this.createParticles();
                this.playMusic();
            }, 500);
        });
    }

    startTypingEffect() {
        const titleElement = document.getElementById('main-title');
        const subtitleElement = document.getElementById('subtitle');
        
        const titleText = 'KIDD';
        const subtitleText = 'FROM HERMANO SYN';
        
        let titleIndex = 0;
        let subtitleIndex = 0;
        
        const typeTitle = () => {
            if (titleIndex < titleText.length) {
                titleElement.textContent = titleText.slice(0, titleIndex + 1);
                titleElement.classList.add('typing-cursor');
                titleIndex++;
                setTimeout(typeTitle, 150);
            } else {
                titleElement.classList.remove('typing-cursor');
                setTimeout(typeSubtitle, 500);
            }
        };
        
        const typeSubtitle = () => {
            if (subtitleIndex < subtitleText.length) {
                subtitleElement.textContent = subtitleText.slice(0, subtitleIndex + 1);
                subtitleElement.classList.add('typing-cursor');
                subtitleIndex++;
                setTimeout(typeSubtitle, 100);
            } else {
                subtitleElement.classList.remove('typing-cursor');
            }
        };
        
        setTimeout(typeTitle, 1000);
    }

    setupAudioPlayer() {
        const playPauseBtn = document.getElementById('play-pause-btn');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const progressSlider = document.getElementById('progress-slider');
        const volumeSlider = document.getElementById('volume-slider');
        const minimizeBtn = document.getElementById('minimize-btn');

        this.audioPlayer = this.bgMusic;
        
        if (this.audioPlayer) {
            this.audioPlayer.volume = 0.3;
            this.updateAudioInfo();
        }

        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => {
                this.toggleMinimize();
            });
        }

        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                this.toggleAudioPlayer();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                console.log('Previous track');
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                console.log('Next track');
            });
        }

        if (progressSlider) {
            progressSlider.addEventListener('input', (e) => {
                if (this.audioPlayer && this.duration) {
                    const time = (e.target.value / 100) * this.duration;
                    this.audioPlayer.currentTime = time;
                }
            });
        }

        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                if (this.audioPlayer) {
                    this.audioPlayer.volume = e.target.value / 100;
                }
            });
        }

        if (this.audioPlayer) {
            this.audioPlayer.addEventListener('loadedmetadata', () => {
                this.duration = this.audioPlayer.duration;
                this.updateTimeDisplay();
            });

            this.audioPlayer.addEventListener('timeupdate', () => {
                this.currentTime = this.audioPlayer.currentTime;
                this.updateProgress();
                this.updateTimeDisplay();
            });

            this.audioPlayer.addEventListener('ended', () => {
                this.isAudioPlaying = false;
                this.isPlaying = false;
                this.updateAudioIcon();
            });

            this.audioPlayer.addEventListener('play', () => {
                this.isAudioPlaying = true;
                this.isPlaying = true;
                this.updateAudioIcon();
            });

            this.audioPlayer.addEventListener('pause', () => {
                this.isAudioPlaying = false;
                this.isPlaying = false;
                this.updateAudioIcon();
            });
        }
    }

    toggleMinimize() {
        const audioPlayer = document.getElementById('audio-player');
        const minimizeBtn = document.getElementById('minimize-btn');
        
        if (!audioPlayer || !minimizeBtn) return;
        
        this.isMinimized = !this.isMinimized;
        
        if (this.isMinimized) {
            audioPlayer.classList.add('minimized');
            minimizeBtn.classList.add('minimized');
        } else {
            audioPlayer.classList.remove('minimized');
            minimizeBtn.classList.remove('minimized');
        }
    }

    toggleAudioPlayer() {
        if (!this.audioPlayer || !this.audioPlayer.src) return;

        if (this.isAudioPlaying) {
            this.audioPlayer.pause();
            this.isAudioPlaying = false;
        } else {
            this.audioPlayer.play().then(() => {
                this.isAudioPlaying = true;
            }).catch(error => {
                console.error('Error playing audio:', error);
            });
        }
        this.updateAudioIcon();
    }

    updateAudioIcon() {
        const playIcon = document.getElementById('play-icon-audio');
        const pauseIcon = document.getElementById('pause-icon-audio');
        
        if (playIcon && pauseIcon) {
            if (this.isAudioPlaying) {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            } else {
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
            }
        }
    }

    updateProgress() {
        if (this.duration) {
            const progress = (this.currentTime / this.duration) * 100;
            const progressFill = document.getElementById('progress-fill');
            const progressSlider = document.getElementById('progress-slider');
            
            if (progressFill) progressFill.style.width = progress + '%';
            if (progressSlider) progressSlider.value = progress;
        }
    }

    updateTimeDisplay() {
        const timeCurrent = document.getElementById('time-current');
        const timeTotal = document.getElementById('time-total');
        
        if (timeCurrent) timeCurrent.textContent = this.formatTime(this.currentTime);
        if (timeTotal) timeTotal.textContent = this.formatTime(this.duration);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    updateAudioInfo() {
        const audioTitle = document.getElementById('audio-title');
        const audioArtist = document.getElementById('audio-artist');
        const audioCover = document.getElementById('audio-cover');
        
        if (AUDIO_PLAYER_CONFIG.title && audioTitle) {
            audioTitle.textContent = AUDIO_PLAYER_CONFIG.title;
        }
        if (AUDIO_PLAYER_CONFIG.artist && audioArtist) {
            audioArtist.textContent = AUDIO_PLAYER_CONFIG.artist;
        }
        if (AUDIO_PLAYER_CONFIG.coverImage && audioCover) {
            audioCover.src = AUDIO_PLAYER_CONFIG.coverImage;
        }
    }

    setupMusic() {
        if (GITHUB_MUSIC_URL && this.bgMusic) {
            this.bgMusic.src = GITHUB_MUSIC_URL;
        }
    }

    playMusic() {
        if (GITHUB_MUSIC_URL && this.bgMusic && this.bgMusic.src) {
            this.bgMusic.play().then(() => {
                this.isPlaying = true;
                console.log('Background music started playing');
            }).catch(error => {
                console.log('Background music autoplay prevented by browser:', error);
            });
        }
    }

    createParticles() {
        const container = document.querySelector('.particles-container');
        if (!container) return;
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            const size = Math.random() * 4 + 2;
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const delay = Math.random() * 8;
            
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.background = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`;
            particle.style.animationDelay = delay + 's';
            
            container.appendChild(particle);
        }
    }

    setupFacebookProfile() {
        // Since Facebook API has strict limitations, we'll use static data
        // You can customize this information manually
        this.updateProfile({
            name: FACEBOOK_CONFIG.name || 'KIDD',
            profilePicture: FACEBOOK_CONFIG.profilePicture || 'https://via.placeholder.com/150x150/1877f2/ffffff?text=FB',
            location: FACEBOOK_CONFIG.location || 'Philippines',
            friendsCount: FACEBOOK_CONFIG.friendsCount || 'Loading...',
            isOnline: true
        });

        // Simulate fetching friends count (this would normally come from Facebook API)
        setTimeout(() => {
            this.simulateFriendsCount();
        }, 2000);
    }

    updateProfile(data) {
        // Update avatar
        const avatar = document.getElementById('avatar');
        if (avatar && data.profilePicture) {
            avatar.src = data.profilePicture;
        }

        // Update username
        const username = document.getElementById('username');
        if (username && data.name) {
            username.textContent = data.name;
        }

        // Update location
        const location = document.getElementById('location');
        if (location && data.location) {
            location.textContent = data.location;
        }

        // Update friends count
        const friendsCount = document.getElementById('friends-count');
        if (friendsCount && data.friendsCount) {
            friendsCount.textContent = data.friendsCount;
        }

        // Update status indicator
        const statusIndicator = document.getElementById('status-indicator');
        if (statusIndicator) {
            statusIndicator.style.background = data.isOnline ? '#42b883' : '#gray';
        }

        // Update Facebook link
        const facebookLink = document.getElementById('facebook-link');
        if (facebookLink && FACEBOOK_CONFIG.profileUrl) {
            facebookLink.href = FACEBOOK_CONFIG.profileUrl;
        }

        // Update Instagram link if provided
        const instagramLink = document.getElementById('instagram-link');
        if (instagramLink && FACEBOOK_CONFIG.instagramUrl) {
            instagramLink.href = FACEBOOK_CONFIG.instagramUrl;
        }
    }

    simulateFriendsCount() {
        // Simulate a realistic friends count animation
        const friendsCountElement = document.getElementById('friends-count');
        if (!friendsCountElement) return;

        const targetCount = FACEBOOK_CONFIG.friendsCount || Math.floor(Math.random() * 500) + 200;
        let currentCount = 0;
        const increment = Math.ceil(targetCount / 50);
        
        const countUp = () => {
            if (currentCount < targetCount) {
                currentCount = Math.min(currentCount + increment, targetCount);
                friendsCountElement.textContent = `${currentCount} friends`;
                setTimeout(countUp, 50);
            } else {
                friendsCountElement.textContent = `${targetCount} friends`;
            }
        };
        
        countUp();
    }

    displayImage(container, imageSrc) {
        if (!container) return;
        
        const placeholder = container.querySelector('.container-placeholder');
        const image = container.querySelector('.container-image');
        
        if (image && placeholder) {
            image.src = imageSrc;
            image.style.display = 'block';
            placeholder.style.display = 'none';
            container.classList.add('has-image');
        }
    }
}

// ============ FACEBOOK CONFIGURATION SECTION ============

// Facebook Profile Configuration
const FACEBOOK_CONFIG = {
    name: 'Mark Sollestre', // Your display name
    profilePicture: 'https://github.com/KIDDASS/kiddd//main/image.png', // Your profile picture URL
    location: 'Philippines', // Your location
    friendsCount: 505, // Number of friends (will animate to this number)
    profileUrl: 'https://www.facebook.com/solllzzz', // Your Facebook profile URL
    instagramUrl: 'https://www.instagram.com/trstdoz/', // Your Instagram URL (optional)
};

// GitHub Assets (same as before)
const GITHUB_MUSIC_URL = 'https://github.com/KIDDASS/kiddd/raw/main/kiyo%20-%20Dantay%20FT.%20YZKK%20(OFFICIAL%20LYRIC%20VIDEO).mp3';
const GITHUB_VIDEO_URL = 'https://github.com/KIDDASS/kiddd/raw/main/videoplayback.mp4';

// GitHub Images
const GITHUB_IMAGES = {
    container1: 'https://github.com/KIDDASS/MyWeb/raw/main/3dgifmaker36240%20(1).gif',
};

// Audio Player Configuration
const AUDIO_PLAYER_CONFIG = {
    audioUrl: GITHUB_MUSIC_URL,
    title: 'DANTAY',
    artist: 'KIYO',
    coverImage: 'https://github.com/KIDDASS/HERMANOSYN/raw/main/KIDD.jpg'
};

// ============ INITIALIZATION ============

// Initialize the Facebook profile
const facebookProfile = new FacebookProfile();

// Auto-load GitHub images when page loads
window.addEventListener('load', () => {
    if (GITHUB_IMAGES.container1) {
        const container1 = document.getElementById('container-1');
        facebookProfile.displayImage(container1, GITHUB_IMAGES.container1);
    }
});

// Handle window resize for mobile responsiveness
window.addEventListener('resize', () => {
    const particlesContainer = document.querySelector('.particles-container');
    if (particlesContainer && window.innerWidth > 480) {
        particlesContainer.innerHTML = '';
        facebookProfile.createParticles();
    }
});

// ============ FACEBOOK API INTEGRATION (OPTIONAL) ============
/*
IMPORTANT NOTE: Facebook's API has very strict limitations for accessing personal profile data.
Due to privacy policies, most personal information is not accessible through their API.

If you want to try real Facebook integration, you would need to:

1. Create a Facebook App at https://developers.facebook.com/
2. Get approval for specific permissions (which is very difficult for personal data)
3. Use Facebook SDK for JavaScript

Here's a basic example of what Facebook SDK integration would look like:

// Load Facebook SDK
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Initialize Facebook SDK
window.fbAsyncInit = function() {
    FB.init({
        appId: 'YOUR_FACEBOOK_APP_ID',
        cookie: true,
        xfbml: true,
        version: 'v18.0'
    });
};

// Login and get basic info (very limited)
function loginWithFacebook() {
    FB.login(function(response) {
        if (response.authResponse) {
            FB.api('/me', {fields: 'name,picture'}, function(response) {
                // Update profile with limited data
                facebookProfile.updateProfile({
                    name: response.name,
                    profilePicture: response.picture.data.url
                });
            });
        }
    }, {scope: 'public_profile'});
}

However, this approach has major limitations:
- Cannot access friends count
- Cannot access posts or activities  
- Requires app approval from Facebook
- Limited to very basic public information

For a personal profile site, using static configuration (as implemented above) 
is much more practical and reliable.
*/
