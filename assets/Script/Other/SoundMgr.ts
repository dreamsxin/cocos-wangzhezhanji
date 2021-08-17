

const { ccclass, property } = cc._decorator;

@ccclass
export default class SoundMgr extends cc.Component {

    sound_path: string = 'Sound/';
    sounds: { [key: number]: any } = {};
    music_enabled: boolean = true;
    audio_enabled: boolean = true;
    music: string = '';
    protected static instance: SoundMgr;
    public static getInstance(): SoundMgr {
        if (!this.instance) {
            this.instance = new SoundMgr();
        }
        return this.instance;
    }

    addSound(key: string, clip: cc.AudioClip) {
        this.sounds[key] = clip;
    }

    playFx(fxName: string, isloop: boolean = false) {
        if (!this.audio_enabled) return;
        if (this.sounds[fxName]) cc.audioEngine.playEffect(this.sounds[fxName], isloop);
    }

    playMusic(musicName: string) {
        if (!this.music_enabled) return;
        if (this.sounds[musicName]) cc.audioEngine.playMusic(this.sounds[musicName], true);
    }

    stopMusic() {
        cc.audioEngine.stopMusic();
    }

    stopAllMusic() {
        cc.audioEngine.stopAll();
    }

    setMusic(enabled: boolean) {
        this.music_enabled = enabled;
        if (!enabled) {
            cc.audioEngine.stopMusic();
        }
    }
    setAudio(enabled: boolean) {
        this.audio_enabled = enabled;
    }

    setEnabled(enabled: boolean) {
        this.music_enabled = enabled;
        if (this.music_enabled) {
            this.playMusic(this.music);
        }
        else {
            cc.audioEngine.stopAll();
        }
    }

    getEnable() {
        return this.music_enabled;
    }


    getMusicName() {
        return this.music
    }


}
