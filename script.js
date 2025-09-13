class DiscordProfile {
    constructor(userId) {
        this.userId = userId;
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
        this.fetchDiscordData();
        
        // Refresh data every 30 seconds
        setInterval(() => this.fetchDiscordData(), 30000);
    }

    setupVideoBackground() {
        // Set video source from GitHub
        if (GITHUB_VIDEO_URL) {
            // Create source elements for different formats
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

        // Add hover effects for interactive elements
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

        // Start typing effect when page loads
        this.startTypingEffect();

        enterBtn.addEventListener('click', () => {
            // Hide intro screen
            introScreen.classList.add('hidden');
            
            // Show main content, audio player, and video background
            setTimeout(() => {
                mainContent.classList.add('visible');
                document.getElementById('audio-player').classList.add('visible');
                
                // Show video background if available
                if (GITHUB_VIDEO_URL) {
                    this.bgVideo.classList.add('visible');
                    this.bgVideo.play().catch(error => {
                        console.log('Video autoplay prevented:', error);
                    });
                }
                
                document.body.style.overflow = 'auto';
                this.createParticles();
                this.playMusic(); // Auto-play background music
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
        
        // Type main title
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
        
        // Type subtitle
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
        
        // Start typing after a short delay
        setTimeout(typeTitle, 1000);
    }

    setupAudioPlayer() {
        const playPauseBtn = document.getElementById('play-pause-btn');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const progressSlider = document.getElementById('progress-slider');
        const volumeSlider = document.getElementById('volume-slider');
        const minimizeBtn = document.getElementById('minimize-btn');

        // Use the same audio element as background music (synchronize them)
        this.audioPlayer = this.bgMusic;
        
        if (this.audioPlayer) {
            this.audioPlayer.volume = 0.3;
            this.updateAudioInfo();
        }

        // Minimize button (check if exists)
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => {
                this.toggleMinimize();
            });
        }

        // Play/Pause button
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                this.toggleAudioPlayer();
            });
        }

        // Previous and Next buttons
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

        // Progress slider
        if (progressSlider) {
            progressSlider.addEventListener('input', (e) => {
                if (this.audioPlayer && this.duration) {
                    const time = (e.target.value / 100) * this.duration;
                    this.audioPlayer.currentTime = time;
                }
            });
        }

        // Volume slider
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                if (this.audioPlayer) {
                    this.audioPlayer.volume = e.target.value / 100;
                }
            });
        }

        // Audio player event listeners
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
        // Set music source from GitHub
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
        
        for (let i = 0; i < 30; i++) { // Reduced particle count for mobile performance
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

    async fetchDiscordData() {
        if (!this.userId || this.userId === 'YOUR_DISCORD_USER_ID') {
            this.updateProfile({
                discord_user: {
                    username: 'KIDD',
                    discriminator: '0001',
                    avatar: null
                },
                discord_status: 'online',
                activities: []
            });
            return;
        }

        try {
            const response = await fetch(`https://api.lanyard.rest/v1/users/${this.userId}`);
            const data = await response.json();
            
            if (data.success) {
                this.updateProfile(data.data);
            } else {
                throw new Error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching Discord data:', error);
            this.updateProfile({
                discord_user: {
                    username: 'KIDD',
                    discriminator: '0000',
                    avatar: null
                },
                discord_status: 'offline',
                activities: []
            });
        }
    }

    updateProfile(data) {
        // Update avatar
        const avatar = document.getElementById('avatar');
        if (avatar) {
            const avatarUrl = data.discord_user.avatar 
                ? `https://cdn.discordapp.com/avatars/${this.userId}/${data.discord_user.avatar}.png?size=256`
                : `https://cdn.discordapp.com/embed/avatars/${data.discord_user.discriminator % 5}.png`;
            avatar.src = avatarUrl;
        }

        // Update username and discriminator
        const username = document.getElementById('username');
        const discriminator = document.getElementById('discriminator');
        
        if (username) username.textContent = data.discord_user.username;
        if (discriminator) discriminator.textContent = `#${data.discord_user.discriminator}`;

        // Update status
        const statusIndicator = document.getElementById('status-indicator');
        const statusText = document.getElementById('status-text');
        
        if (statusIndicator) statusIndicator.className = `status-indicator ${data.discord_status}`;
        if (statusText) statusText.textContent = this.capitalizeFirst(data.discord_status);

        // Update custom status
        this.updateCustomStatus(data);

        // Update activities
        this.updateActivities(data.activities || []);

        // Update Discord link
        const discordLink = document.getElementById('discord-link');
        if (discordLink) discordLink.href = `https://discord.com/users/${this.userId}`;
    }

    updateCustomStatus(data) {
        const customStatus = document.getElementById('custom-status');
        const statusEmoji = document.getElementById('status-emoji');
        const statusMessage = document.getElementById('status-message');

        if (!customStatus || !statusEmoji || !statusMessage) return;

        const customActivity = data.activities?.find(activity => activity.type === 4);
        
        if (customActivity) {
            statusEmoji.textContent = customActivity.emoji?.name || '';
            statusMessage.textContent = customActivity.state || '';
            customStatus.style.display = 'block';
        } else {
            customStatus.style.display = 'none';
        }
    }

    updateActivities(activities) {
        const activitiesContainer = document.getElementById('activities');
        if (!activitiesContainer) return;
        
        activitiesContainer.innerHTML = '';

        const filteredActivities = activities.filter(activity => activity.type !== 4);

        filteredActivities.forEach(activity => {
            const activityEl = document.createElement('div');
            activityEl.classList.add('activity');

            let activityContent = `<div class="activity-name">${activity.name}</div>`;
            
            if (activity.details) {
                activityContent += `<div class="activity-details-text">${activity.details}</div>`;
            }
            
            if (activity.state) {
                activityContent += `<div class="activity-state">${activity.state}</div>`;
            }

            activityEl.innerHTML = activityContent;
            activitiesContainer.appendChild(activityEl);
        });
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

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// ============ CONFIGURATION SECTION ============

// Replace 'YOUR_DISCORD_USER_ID' with your actual Discord user ID
const DISCORD_USER_ID = '720887495923073044';

// Add your GitHub music URL here (background music AND audio player will use the same file)
const GITHUB_MUSIC_URL = 'https://github.com/KIDDASS/kiddd/raw/main/kiyo%20-%20Dantay%20FT.%20YZKK%20(OFFICIAL%20LYRIC%20VIDEO).mp3';

// Add your GitHub video URL here (background video)
const GITHUB_VIDEO_URL = 'https://github.com/KIDDASS/kiddd/raw/main/videoplayback.mp4';

// Add your GitHub images here
const GITHUB_IMAGES = {
    container1: 'https://github.com/KIDDASS/MyWeb/raw/main/3dgifmaker36240%20(1).gif',
    // container2: 'https://your-image-url-here.jpg' // Add second image if needed
};

// Audio Player Configuration (using the same audio as background music)
const AUDIO_PLAYER_CONFIG = {
    audioUrl: GITHUB_MUSIC_URL, // Using the same audio file as background music
    title: 'DANTAY', // Change this to your song title
    artist: 'KIYO', // Change this to your artist name
    coverImage: 'https://github.com/KIDDASS/HERMANOSYN/raw/main/KIDD.jpg' // Add your cover image URL here (optional)
};

// ============ INITIALIZATION ============

// Initialize the profile
const discordProfile = new DiscordProfile(DISCORD_USER_ID);

// Auto-load GitHub images when page loads
window.addEventListener('load', () => {
    if (GITHUB_IMAGES.container1) {
        const container1 = document.getElementById('container-1');
        discordProfile.displayImage(container1, GITHUB_IMAGES.container1);
    }
    
    if (GITHUB_IMAGES.container2) {
        const container2 = document.getElementById('container-2');
        discordProfile.displayImage(container2, GITHUB_IMAGES.container2);
    }
});

// Handle window resize for mobile responsiveness
window.addEventListener('resize', () => {
    // Recreate particles if screen size changes significantly
    const particlesContainer = document.querySelector('.particles-container');
    if (particlesContainer && window.innerWidth > 480) {
        particlesContainer.innerHTML = '';
        discordProfile.createParticles();
    }
});